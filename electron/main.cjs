const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

let pyProc = null;

// Function to poll the server until it responds successfully
function waitForServer(url, timeout = 10000) {
	return new Promise((resolve, reject) => {
		const start = Date.now();
		function check() {
			http
				.get(url, (res) => {
					// Consider a successful response if we get a 200
					if (res.statusCode === 200) {
						resolve();
					} else {
						retry();
					}
				})
				.on('error', () => {
					retry();
				});
		}
		function retry() {
			if (Date.now() - start > timeout) {
				reject(new Error('Timeout waiting for frontend server'));
			} else {
				setTimeout(check, 200);
			}
		}
		check();
	});
}

function createWindow() {
	const mainWindow = new BrowserWindow({
		webPreferences: {
			preload: path.join(__dirname, 'preload.cjs'),
			contextIsolation: true,
			enableRemoteModule: false,
			nodeIntegration: false
		}
	});
	mainWindow.maximize();

	if (app.isPackaged) {
		// In production, load the built frontend files.
		const indexPath = path.join(process.resourcesPath, 'frontend', 'index.html');
		console.log('Loading production index file:', indexPath);
		mainWindow.loadFile(indexPath).catch(err => {
			console.error('Error loading index file:', err);
		});
	} else {
		// In development, wait for the frontend dev server.
		waitForServer('http://localhost:11136', 10000)
			.then(() => {
				mainWindow.loadURL('http://localhost:11136');
			})
			.catch((error) => {
				console.error('Frontend did not start in time:', error);
				const errorHtml = `
				  <html>
					<head>
					  <meta charset="UTF-8">
					  <title>Frontend Error</title>
					</head>
					<body>
					  <h1>Frontend failed to start</h1>
					  <pre>${error.message}</pre>
					  <pre>${error.stack}</pre>
					</body>
				  </html>
				`;
				mainWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(errorHtml));
			});
	}
}

function startPythonScript() {
	let executablePath;

	if (app.isPackaged) {
		// In production, use the bundled cx_Freeze executable.
		executablePath = path.join(process.resourcesPath, 'backend', process.platform === 'win32' ? 'main.exe' : 'main');
		try {
			// Set executable permission for Linux/macOS
			if (process.platform !== 'win32') {
				fs.chmodSync(executablePath, 0o755);
			}
		} catch (err) {
			console.error('Failed to set executable permission on', executablePath, err);
		}
		console.log('Launching bundled backend:', executablePath);
		pyProc = spawn(executablePath, [], { stdio: 'inherit' });
	} else {
		// In development, run the Python script directly.
		executablePath = path.join(__dirname, 'backend', 'main.py');
		console.log('Launching Python script:', executablePath);
		pyProc = spawn('python', [executablePath], { stdio: 'inherit' });
	}

	pyProc.on('close', (code) => {
		console.log(`Python process exited with code ${code}`);
	});
}

app.whenReady().then(() => {
	createWindow();
	startPythonScript();

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

app.on('will-quit', () => {
	if (pyProc) {
		pyProc.kill();
	}
});

app.on('quit', () => {
	if (pyProc) {
		pyProc.kill();
	}
});

app.on('window-all-closed', () => {
	if (pyProc) {
		pyProc.kill();
	}
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

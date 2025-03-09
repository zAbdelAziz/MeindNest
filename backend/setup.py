import sys
from cx_Freeze import setup, Executable

# Define any packages or files needed by your app here
build_exe_options = {
    # Ensure that the dynamic module is included
    "includes": ["uvicorn.loops.auto"],
    # Optionally, include the entire uvicorn package if needed
    "packages": ["uvicorn"],
    "include_files": []  # add any extra files if needed
}

# If your application has a GUI, you might use "Win32GUI" on Windows.
base = None
if sys.platform == "win32":
    base = "Win32GUI"  # Change or remove if you're running a console app

setup(
    name="BackendApp",
    version="0.1",
    description="Python backend for YourAppName",
    options={"build_exe": build_exe_options},
    executables=[Executable("main.py", base=base)]
)

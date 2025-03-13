import React, { useState } from 'react';

interface FormulaModalProps {
	target: 'row' | 'column';
	onConfirm: (formula: string, target: 'row' | 'column') => void;
	onCancel: () => void;
}

const FormulaModal: React.FC<FormulaModalProps> = ({ target, onConfirm, onCancel }) => {
	const [formula, setFormula] = useState('');

	const handleSubmit = () => {
		onConfirm(formula, target);
		setFormula('');
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center z-50">
			{/* Overlay */}
			<div className="absolute inset-0 bg-black opacity-50" onClick={onCancel}></div>
			{/* Modal content */}
			<div className="bg-white dark:bg-gray-800 p-4 z-10 rounded shadow-md max-w-sm w-full">
				<h2 className="text-lg font-bold mb-2">
					Enter Formula for {target === 'row' ? 'Row' : 'Column'}
				</h2>
				<input
					type="text"
					value={formula}
					onChange={(e) => setFormula(e.target.value)}
					placeholder="e.g. =col0+col1"
					className="border p-1 w-full mb-2"
				/>
				<div className="flex justify-end">
					<button onClick={onCancel} className="mr-2 px-3 py-1 border rounded">
						Cancel
					</button>
					<button onClick={handleSubmit} className="px-3 py-1 border rounded">
						Confirm
					</button>
				</div>
			</div>
		</div>
	);
};

export default FormulaModal;

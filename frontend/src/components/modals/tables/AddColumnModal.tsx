import React, { useState } from 'react';
import BaseModal from '../../BaseModal';

interface AddColumnModalProps {
	onConfirm: (options: { columnName: string }) => void;
	onCancel: () => void;
}

const AddColumnModal: React.FC<AddColumnModalProps> = ({ onConfirm, onCancel }) => {
	const [columnName, setColumnName] = useState('');

	const handleSubmit = () => {
		onConfirm({ columnName });
	};

	return (
		<BaseModal title="Add New Column" onSubmit={handleSubmit} onCancel={onCancel}>
			<div>
				<label className="block text-sm mb-1">Column Name:</label>
				<input
					type="text"
					value={columnName}
					onChange={(e) => setColumnName(e.target.value)}
					className="border p-2 rounded w-full"
					placeholder="Enter column name"
				/>
			</div>
		</BaseModal>
	);
};

export default AddColumnModal;

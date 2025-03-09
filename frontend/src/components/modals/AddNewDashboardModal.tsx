// src/components/InputModal.tsx
import React, { useState } from 'react';

interface InputModalProps {
  message: string;
  placeholder?: string;
  onCancel: () => void;
  onConfirm: (value: string) => void;
}

const AddNewDashboardModal: React.FC<InputModalProps> = ({
  message,
  placeholder,
  onCancel,
  onConfirm,
}) => {
  const [value, setValue] = useState('');

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded shadow-lg w-80">
        <p className="mb-4">{message}</p>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder || ''}
          className="w-full p-2 border rounded mb-4"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(value)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewDashboardModal;

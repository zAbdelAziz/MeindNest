// src/components/ConfirmModal.tsx
import React from 'react';

interface ConfirmModalProps {
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmDeleteWidgetModal: React.FC<ConfirmModalProps> = ({
  message,
  onCancel,
  onConfirm,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded shadow-lg">
        <p className="mb-4">{message}</p>
        <div className="flex justify-end space-x-2">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white rounded">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteWidgetModal;

// src/components/InputModal.tsx
import React, { useState } from 'react';
import BaseModal from '../BaseModal';

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

  const handleSubmit = () => {
    onConfirm(value);
  };

  return (
    <BaseModal
      title="Add New Dashboard"
      onSubmit={handleSubmit}
      onCancel={onCancel}
    >
      <p className="mb-4">{message}</p>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder || ''}
        className="w-full p-2 border rounded mb-4"
      />
    </BaseModal>
  );
};

export default AddNewDashboardModal;

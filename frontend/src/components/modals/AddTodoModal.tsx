// src/components/modals/AddTodoModal.tsx
import React, { useState } from 'react';
import BaseModal from '../BaseModal';

interface AddTodoModalProps {
  onConfirm: (options: { title: string }) => void;
  onCancel: () => void;
}

const AddTodoModal: React.FC<AddTodoModalProps> = ({ onConfirm, onCancel }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = () => {
    onConfirm({ title });
  };

  return (
    <BaseModal
      title="Add New Todo Widget"
      onSubmit={handleSubmit}
      onCancel={onCancel}
    >
      <div>
        <label className="block text-sm mb-1">Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="Enter todo title"
        />
      </div>
    </BaseModal>
  );
};

export default AddTodoModal;

// src/components/modals/AddDiagramModal.tsx
import React, { useState } from 'react';
import BaseModal from '../BaseModal';

interface AddDiagramModalProps {
  onConfirm: (options: { title: string }) => void;
  onCancel: () => void;
}

const AddDiagramModal: React.FC<AddDiagramModalProps> = ({ onConfirm, onCancel }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = () => {
    onConfirm({ title });
  };

  return (
    <BaseModal
      title="Add New Diagram Widget"
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
          placeholder="Enter diagram widget title"
        />
      </div>
    </BaseModal>
  );
};

export default AddDiagramModal;

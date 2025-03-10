// src/components/modals/AddTimelineModal.tsx
import React, { useState } from 'react';
import BaseModal from '../BaseModal';

interface AddTimelineModalProps {
  onConfirm: (options: { title: string }) => void;
  onCancel: () => void;
}

const AddTimelineModal: React.FC<AddTimelineModalProps> = ({ onConfirm, onCancel }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = () => {
    onConfirm({ title });
  };

  return (
    <BaseModal
      title="Add New Timeline Widget"
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
          placeholder="Enter timeline title"
        />
      </div>
    </BaseModal>
  );
};

export default AddTimelineModal;

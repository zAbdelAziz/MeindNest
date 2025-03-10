// src/components/ConfirmModal.tsx
import React from 'react';
import BaseModal from '../BaseModal';

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
    <BaseModal
      title="Confirm Delete"
      onSubmit={onConfirm}
      onCancel={onCancel}
      confirmButtonText="Delete"
    >
      <p>{message}</p>
    </BaseModal>
  );
};

export default ConfirmDeleteWidgetModal;

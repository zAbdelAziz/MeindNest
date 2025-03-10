// src/components/modals/BaseModal.tsx
import React, { useEffect, useRef } from 'react';

interface BaseModalProps {
  title: string;
  children: React.ReactNode;
  onSubmit: () => void;
  onCancel: () => void;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

const BaseModal: React.FC<BaseModalProps> = ({
  title,
  children,
  onSubmit,
  onCancel,
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
}) => {
  const formRef = useRef<HTMLFormElement>(null);

  // When the modal mounts, try to focus the first input in the form.
  useEffect(() => {
    if (formRef.current) {
      const firstInput = formRef.current.querySelector('input');
      if (firstInput) {
        (firstInput as HTMLInputElement).focus();
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-neutral-300 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-400 bg-opacity-10">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="bg-neutral-200 dark:bg-neutral-800 p-6 shadow-md max-w-md w-full"
      >
        <h2 className="text-xl mb-4">{title}</h2>
        <div className="mb-4">{children}</div>
        <div className="flex justify-end space-x-4">
          <button type="submit" className="px-4 py-2 bg-slate-600 text-white rounded">
            {confirmButtonText}
          </button>
          <button type="button" className="px-4 py-2 bg-slate-300 rounded" onClick={onCancel}>
            {cancelButtonText}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BaseModal;

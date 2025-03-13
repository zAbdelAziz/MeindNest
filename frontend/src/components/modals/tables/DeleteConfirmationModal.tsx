import React from 'react';
import BaseModal from '../../BaseModal';

interface DeleteConfirmationModalProps {
	title: string;
	message: string;
	onConfirm: () => void;
	onCancel: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
																			 title,
																			 message,
																			 onConfirm,
																			 onCancel,
																		 }) => {
	return (
		<BaseModal
			title={title}
			onSubmit={onConfirm}
			onCancel={onCancel}
			confirmButtonText="Delete"
		>
			<p>{message}</p>
		</BaseModal>
	);
};

export default DeleteConfirmationModal;

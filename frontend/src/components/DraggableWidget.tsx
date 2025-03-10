// src/components/DraggableWidget.tsx
import React, { useState } from 'react';
import { MdEdit, MdClose, MdDragIndicator } from 'react-icons/md';
import { PiDotsThreeOutlineFill } from 'react-icons/pi';

import Dropdown from './generic/Dropdown';
import ConfirmDeleteWidgetModal from './modals/ConfirmDeleteWidgetModal';

interface DraggableWidgetProps {
	widgetName: string;
	children: React.ReactNode;
	onDelete?: () => void;
	onRename?: (newName: string) => void;
}

const DraggableWidget: React.FC<DraggableWidgetProps> = ({
															 widgetName,
															 children,
															 onDelete,
															 onRename,
														 }) => {
	// Use both the value and its setter so that we can update the name.
	const [name, setName] = useState(widgetName);
	const [isEditing, setIsEditing] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	// When Save is clicked, call onRename with the new name.
	const handleRename = () => {
		if (onRename) {
			onRename(name);
		}
		setIsEditing(false);
	};

	return (
		// Mark the container with "group" so inner elements can use group-hover
		<div className="relative flex flex-col h-full group">
			{/* Header */}
			<div className="p-1 flex items-center justify-between bg-slate-300/10 dark:bg-stone-900/10">
				<div className="flex items-center flex-grow">
					{/* Drag handle: always present (with the drag-handle class) but only visibly opaque on hover */}
					<div className="mr-2 text-2xl opacity-0 group-hover:opacity-100 drag-handle">
						<MdDragIndicator className="cursor-move" />
					</div>
					{/* Show an input when editing; otherwise show the name */}
					{isEditing ? (
						<input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="p-1 border rounded"
						/>
					) : (
						<span>{name}</span>
					)}
				</div>
				<div className="flex-none">
					{isEditing ? (
						// When editing, show Save/Cancel buttons
						<div className="flex space-x-2">
							<button onClick={handleRename} className="text-blue-500">
								Save
							</button>
							<button onClick={() => setIsEditing(false)} className="text-gray-500">
								Cancel
							</button>
						</div>
					) : (
						// Otherwise, show the dropdown actions (Rename/Delete)
						<div className="invisible group-hover:visible">
							<Dropdown
								toggleIcon={<PiDotsThreeOutlineFill className="text-lg" />}
								options={[
									{
										value: { id: 1, name: 'Rename', icon: '' },
										onSelect: () => setIsEditing(true),
										render: () => (
											<div className="flex items-center" title="Rename">
												<MdEdit />
												<span className="ml-1">Rename</span>
											</div>
										),
									},
									{
										value: { id: 2, name: 'Delete', icon: '', label: 'Delete' },
										onSelect: () => setShowDeleteModal(true),
										render: () => (
											<div className="flex items-center">
												<MdClose />
												<span className="ml-1">Delete</span>
											</div>
										),
									},
								]}
							/>
						</div>
					)}
				</div>
			</div>

			<hr className="text-gray-500" />

			{/* Content area */}
			<div className="flex-1 overflow-hidden bg-zinc-200/15 dark:bg-neutral-800/10 p-2 group-hover:overflow-auto scrollbar [scrollbar-gutter:stable]">
				{children}
			</div>

			{/* Delete Confirmation Modal */}
			{showDeleteModal && (
				<ConfirmDeleteWidgetModal
					message="Are you sure you want to delete this widget?"
					onCancel={() => setShowDeleteModal(false)}
					onConfirm={() => {
						if (onDelete) {
							onDelete();
						}
						setShowDeleteModal(false);
					}}
				/>
			)}
		</div>
	);
};

export default DraggableWidget;

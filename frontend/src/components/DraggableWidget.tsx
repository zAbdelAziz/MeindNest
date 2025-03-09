// src/components/DraggableWidget.tsx
import React, { useState } from 'react';
import { MdEdit, MdClose, MdDragIndicator } from 'react-icons/md';
import { PiDotsThreeOutlineVertical } from "react-icons/pi";

import Dropdown from './generic/Dropdown';

import ConfirmDeleteWidgetModal from './modals/ConfirmDeleteWidgetModal';

interface DraggableWidgetProps {
	widgetName: string;
	children: React.ReactNode;
	onDelete?: () => void;
	onRename?: (newName: string) => void;
}

const DraggableWidget: React.FC<DraggableWidgetProps> = ({widgetName, children, onDelete, onRename,}) => {

	const [isEditing, setIsEditing] = useState(false);
	const [name, setName] = useState(widgetName);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const handleRename = () => {
		if (onRename) {
			onRename(name);
		}
		setIsEditing(false);
	};

	return (
		<div className="relative p-2 bg-slate-300/10 dark:bg-stone-900/10 text-neutral-800 dark:text-neutral-400 h-full flex flex-col">
			{/* Header: title area (draggable) and action buttons (non-draggable) */}
			<div className="flex items-center justify-between p-1">
				{/* Title */}
				<div className="flex-grow">
					{isEditing ?
						(<input type="text" className="p-1 border rounded w-full" value={name} onChange={(e) => setName(e.target.value)}/>)
						:
						(<>
							<div className="flex items-center justify-start">
								<div className="drag-handle cursor-move text-2xl"><MdDragIndicator /></div>
								<span>{name}</span>
							</div>
						</>)
					}

				</div>
				{/* Actions */}
				<div className="flex-none">
					{isEditing ?
						(<>
							<button onClick={handleRename} className="text-blue-500 mx-2">Save</button>
							<button onClick={() => setIsEditing(false)} className="text-gray-500">Cancel</button>
						</>)
						:
						(<>
							<Dropdown toggleIcon={<PiDotsThreeOutlineVertical />}
									  options={[
											  {
												  value: { id: 1, name: 'Rename', icon: "" },
												  onSelect: () => setIsEditing(true),
												  render: () => (<div className="flex items-center" title="Rename"><MdEdit /><span className="ml-1">Rename</span></div>),
											  },
											  {
												value: { id: 2, name: 'Delete', icon: "", label: 'Delete'},
												onSelect: () => setShowDeleteModal(true),
												render: () => (<div className="flex items-center"><MdClose /><span className="ml-1">Delete</span></div>),
											  },
											]}
						  	/>
							{/*{onRename && (<button onClick={() => setIsEditing(true)} className="text-yellow-900 mr-2" title="Rename"><MdEdit /></button>)}*/}
							{/*{onDelete && (<button onClick={() => setShowDeleteModal(true)} className="text-red-900" title="Delete"><MdClose /></button>)}*/}
						</>)
					}
				</div>

			</div>

			<hr className="text-gray-500"/>

			{/* Content area */}
			<div className="flex-grow">
				{children}
			</div>

			{/* Delete Confirmation Modal */}
			{showDeleteModal && (
				<ConfirmDeleteWidgetModal
					message="Are you sure you want to delete this widget?"
					onCancel={() => setShowDeleteModal(false)}
					onConfirm={() => {
						if (onDelete) {onDelete();}
						setShowDeleteModal(false);
					}}
				/>
			)}

		</div>
	);
};

export default DraggableWidget;

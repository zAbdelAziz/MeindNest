// src/components/DraggableWidget.tsx
import React, { useState } from 'react';
import {
	MdEdit,
	MdClose,
	MdDragIndicator,
	MdKeyboardArrowUp,
	MdKeyboardArrowDown,
} from 'react-icons/md';
import { PiDotsThreeOutlineFill } from 'react-icons/pi';

import Dropdown from './generic/Dropdown';
import ConfirmDeleteWidgetModal from './modals/ConfirmDeleteWidgetModal';

interface DraggableWidgetProps {
	widgetName: string;
	widgetId: string;
	collapsed: boolean;
	icon?: React.ReactNode;
	children: React.ReactNode;
	onDelete?: () => void;
	onRename?: (newName: string) => void;
	onCollapse?: (widgetId: string, collapsed: boolean) => void;
	headerActions?: React.ReactNode;
}

const DraggableWidget: React.FC<DraggableWidgetProps> = ({
															 widgetName,
															 widgetId,
															 collapsed,
															 icon,
															 children,
															 onDelete,
															 onRename,
															 onCollapse,
															 headerActions,
														 }) => {
	const [name, setName] = useState(widgetName);
	const [isEditing, setIsEditing] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const handleRename = () => {
		if (onRename) onRename(name);
		setIsEditing(false);
	};

	const toggleCollapse = () => {
		if (onCollapse) {
			onCollapse(widgetId, !collapsed);
		}
	};

	return (
		<div className={`relative flex flex-col group ${collapsed ? 'h-12' : 'h-full'}`}>
			{/* Header */}
			<div
				className={`p-1 flex items-center justify-between bg-slate-300/10 dark:bg-stone-900/10 ${
					collapsed ? 'py-0 border-y border-gray-500' : ''
				}`}
			>
				<div className="flex items-center flex-grow">
					<div className="mr-2 text-2xl opacity-0 group-hover:opacity-100 drag-handle">
						<MdDragIndicator className="cursor-move" />
					</div>
					{icon && <span className="mr-2">{icon}</span>}
					{/* Title is always visible */}
					<div className={collapsed ? 'max-w-[160px] truncate' : 'flex-grow group-hover:opacity-100'}>
					{isEditing ? (
					  <input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						onKeyDown={(e) => {
						  if (e.key === 'Enter') {
							handleRename();
						  }
						}}
						className="p-1 border"
						autoFocus
					  />
					) : (
					  <span className="text-sm truncate" title={name}>
						{name}
					  </span>
					)}

					</div>
				</div>
				<div className="flex-none flex items-center space-x-2">
					{/* Collapse button and dropdown hidden until hover */}
					<button onClick={toggleCollapse} className="cursor-pointer invisible group-hover:visible">
						{collapsed ? <MdKeyboardArrowDown /> : <MdKeyboardArrowUp />}
					</button>
					{headerActions && (
						<div className="invisible group-hover:visible">
							{headerActions}
						</div>
					)}
					{/* Only show dropdown when not collapsed */}
				  {!collapsed && !isEditing && (
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
					{isEditing && (
						<div className="flex space-x-2">
							<button onClick={handleRename} className="text-blue-500">
								Save
							</button>
							<button onClick={() => setIsEditing(false)} className="text-gray-500">
								Cancel
							</button>
						</div>
					)}
				</div>
			</div>
			{/*<hr className="text-gray-500" />*/}
			{!collapsed && (
				<div className="flex-1 overflow-hidden bg-zinc-200/15 dark:bg-neutral-800/20 border-y border-gray-500 p-2 group-hover:overflow-auto scrollbar [scrollbar-gutter:stable]">
					{children}
				</div>
			)}
			{showDeleteModal && (
				<ConfirmDeleteWidgetModal
					message="Are you sure you want to delete this widget?"
					onCancel={() => setShowDeleteModal(false)}
					onConfirm={() => {
						if (onDelete) onDelete();
						setShowDeleteModal(false);
					}}
				/>
			)}
		</div>
	);
};

export default DraggableWidget;

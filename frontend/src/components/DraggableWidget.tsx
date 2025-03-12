// src/components/DraggableWidget.tsx
import React, { useState } from 'react';
import { MdEdit, MdClose, MdDragIndicator } from 'react-icons/md';
import { PiDotsThreeOutlineFill } from 'react-icons/pi';

import Dropdown from './generic/Dropdown';
import ConfirmDeleteWidgetModal from './modals/ConfirmDeleteWidgetModal';

interface DraggableWidgetProps {
  widgetName: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onDelete?: () => void;
  onRename?: (newName: string) => void;
  headerActions?: React.ReactNode; // New prop for extra header buttons
}

const DraggableWidget: React.FC<DraggableWidgetProps> = ({
  widgetName,
  icon,
  children,
  onDelete,
  onRename,
  headerActions,
}) => {
  const [name, setName] = useState(widgetName);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleRename = () => {
    if (onRename) {
      onRename(name);
    }
    setIsEditing(false);
  };

  return (
    <div className="relative flex flex-col h-full group">
      {/* Header */}
      <div className="p-1 flex items-center justify-between bg-slate-300/10 dark:bg-stone-900/10">
        <div className="flex items-center flex-grow">
          <div className="mr-2 text-2xl opacity-0 group-hover:opacity-100 drag-handle">
            <MdDragIndicator className="cursor-move" />
          </div>
          {icon && <span className="mr-2">{icon}</span>}
          {isEditing ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-1 border rounded"
            />
          ) : (
            <span className="text-sm">{name}</span>
          )}
        </div>
        <div className="flex-none flex items-center space-x-2">
          {/* Render additional header actions if provided */}
          {headerActions}
          {isEditing ? (
            <div className="flex space-x-2">
              <button onClick={handleRename} className="text-blue-500">
                Save
              </button>
              <button onClick={() => setIsEditing(false)} className="text-gray-500">
                Cancel
              </button>
            </div>
          ) : (
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

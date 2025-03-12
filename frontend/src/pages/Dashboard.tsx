// src/pages/DashboardPage.tsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { WidthProvider } from 'react-grid-layout';
import GridLayout from 'react-grid-layout';

import { useDashboardWidgets, WidgetLayout } from '../hooks/useDashboardWidgets';
import DraggableWidget from '../components/DraggableWidget';
import { widgetMappings } from '../config/widgetMappings';
import Dropdown from "../components/generic/Dropdown";

// Import all modal components
import AddChartModal from '../components/modals/AddChartModal';
import AddTableModal from '../components/modals/AddTableModal';
import AddTodoModal from '../components/modals/AddTodoModal';
import AddTimelineModal from '../components/modals/AddTimelineModal';
import AddCalendarModal from '../components/modals/AddCalendarModal';
import AddTextModal from '../components/modals/AddTextModal';
import AddEmailModal from '../components/modals/AddEmailModal';
import AddFileExplorerModal from '../components/modals/AddFileExplorerModal';
import AddDiagramModal from '../components/modals/AddDiagramModal';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { MdAdd } from "react-icons/md";
import { FaChartPie, FaTimeline, FaTable, FaCalendarDays, FaFolderOpen, FaDiagramProject } from "react-icons/fa6";
import { LuListTodo, LuText, LuMail } from "react-icons/lu";

const ResponsiveGridLayout = WidthProvider(GridLayout);

// Updated renderWidget to pass the collapse state.
const renderWidget = (
  widget: WidgetLayout,
  deleteWidget: (widgetId: string) => void,
  renameWidget: (widgetId: string, newName: string) => void,
  collapseWidget: (widgetId: string, collapsed: boolean) => void
) => {
  const widgetConfig = widgetMappings[widget.widgetType];
  const WidgetComponent = widgetConfig
    ? widgetConfig.component
    : () => <div>Unknown Widget</div>;

  return (
    // Add the "collapsed" class if the widget is collapsed.
    <div key={widget.i} className={widget.collapsed ? 'collapsed' : ''}>
      <DraggableWidget
        widgetName={widget.widgetName}
        widgetId={widget.i}
        collapsed={widget.collapsed || false}
        icon={widgetConfig?.icon}
        onDelete={() => deleteWidget(widget.i)}
        onRename={(newName: string) => renameWidget(widget.i, newName)}
        onCollapse={collapseWidget}
      >
        {/* Pass widgetId prop to all widget components */}
        <WidgetComponent widgetId={widget.i} />
      </DraggableWidget>
    </div>
  );
};


const DashboardPage: React.FC = () => {
  const { dashboardId } = useParams<{ dashboardId: string }>();
  const instanceId = dashboardId || 'base-dashboard';
  const { currentLayout, onLayoutChange, addWidget, deleteWidget, renameWidget, collapseWidget } =
    useDashboardWidgets(instanceId);

  // State to manage which widget modal is open (if any)
  const [activeWidgetModal, setActiveWidgetModal] = useState<{ widgetType: string } | null>(null);

  // When the modal confirms, add the widget using the title provided from the modal.
  const handleAddWidgetConfirm = (widgetType: string, options?: { title: string }) => {
    addWidget(widgetType, options);
    setActiveWidgetModal(null);
  };

  return (
    <div className="p-4">
      {/* Controls for adding new widgets */}
      <div className="mb-4 flex justify-end space-x-4">
        <Dropdown
          toggleIcon={<MdAdd className="text-lg" />}
          options={[
            {
              value: { id: 1, name: 'Chart', icon: "", label: "Chart" },
              onSelect: () => setActiveWidgetModal({ widgetType: 'chart' }),
              render: () => (
                <div className="flex items-center">
                  <FaChartPie />
                  <span className="ml-2">Chart</span>
                </div>
              ),
            },
            {
              value: { id: 2, name: 'Table', icon: "" },
              onSelect: () => setActiveWidgetModal({ widgetType: 'table' }),
              render: () => (
                <div className="flex items-center">
                  <FaTable />
                  <span className="ml-2">Table</span>
                </div>
              ),
            },
            {
              value: { id: 3, name: 'Todo', icon: "" },
              onSelect: () => setActiveWidgetModal({ widgetType: 'todo' }),
              render: () => (
                <div className="flex items-center">
                  <LuListTodo />
                  <span className="ml-2">Todo</span>
                </div>
              ),
            },
            {
              value: { id: 4, name: 'Timeline', icon: "" },
              onSelect: () => setActiveWidgetModal({ widgetType: 'timeline' }),
              render: () => (
                <div className="flex items-center">
                  <FaTimeline />
                  <span className="ml-2">Timeline</span>
                </div>
              ),
            },
            {
              value: { id: 5, name: 'Calendar', icon: "" },
              onSelect: () => setActiveWidgetModal({ widgetType: 'calendar' }),
              render: () => (
                <div className="flex items-center">
                  <FaCalendarDays />
                  <span className="ml-2">Calendar</span>
                </div>
              ),
            },
            {
              value: { id: 6, name: 'Text', icon: "" },
              onSelect: () => setActiveWidgetModal({ widgetType: 'text' }),
              render: () => (
                <div className="flex items-center">
                  <LuText />
                  <span className="ml-2">Text</span>
                </div>
              ),
            },
            {
              value: { id: 7, name: 'Email', icon: "" },
              onSelect: () => setActiveWidgetModal({ widgetType: 'email' }),
              render: () => (
                <div className="flex items-center">
                  <LuMail />
                  <span className="ml-2">Email</span>
                </div>
              ),
            },
            {
              value: { id: 8, name: 'File Explorer', icon: "" },
              onSelect: () => setActiveWidgetModal({ widgetType: 'fileExplorer' }),
              render: () => (
                <div className="flex items-center">
                  <FaFolderOpen />
                  <span className="ml-2">Folder</span>
                </div>
              ),
            },
            {
              value: { id: 9, name: 'Diagram', icon: "" },
              onSelect: () => setActiveWidgetModal({ widgetType: 'diagram' }),
              render: () => (
                <div className="flex items-center">
                  <FaDiagramProject />
                  <span className="ml-2">Diagram</span>
                </div>
              ),
            },
          ]}
        />
      </div>

      <ResponsiveGridLayout
        className="layout"
        layout={currentLayout}
        onLayoutChange={onLayoutChange}
        cols={12}
        rowHeight={30}
        draggableHandle=".drag-handle"
      >
        {currentLayout.map((widget) =>
          renderWidget(widget, deleteWidget, renameWidget, collapseWidget)
        )}
      </ResponsiveGridLayout>

      {/* Render modals based on the active widget type */}
      {activeWidgetModal?.widgetType === 'chart' && (
        <AddChartModal
          onConfirm={(options) => handleAddWidgetConfirm('chart', options)}
          onCancel={() => setActiveWidgetModal(null)}
        />
      )}
      {activeWidgetModal?.widgetType === 'table' && (
        <AddTableModal
          onConfirm={(options) => handleAddWidgetConfirm('table', options)}
          onCancel={() => setActiveWidgetModal(null)}
        />
      )}
      {activeWidgetModal?.widgetType === 'todo' && (
        <AddTodoModal
          onConfirm={(options) => handleAddWidgetConfirm('todo', options)}
          onCancel={() => setActiveWidgetModal(null)}
        />
      )}
      {activeWidgetModal?.widgetType === 'timeline' && (
        <AddTimelineModal
          onConfirm={(options) => handleAddWidgetConfirm('timeline', options)}
          onCancel={() => setActiveWidgetModal(null)}
        />
      )}
      {activeWidgetModal?.widgetType === 'calendar' && (
        <AddCalendarModal
          onConfirm={(options) => handleAddWidgetConfirm('calendar', options)}
          onCancel={() => setActiveWidgetModal(null)}
        />
      )}
      {activeWidgetModal?.widgetType === 'text' && (
        <AddTextModal
          onConfirm={(options) => handleAddWidgetConfirm('text', options)}
          onCancel={() => setActiveWidgetModal(null)}
        />
      )}
      {activeWidgetModal?.widgetType === 'email' && (
        <AddEmailModal
          onConfirm={(options) => handleAddWidgetConfirm('email', options)}
          onCancel={() => setActiveWidgetModal(null)}
        />
      )}
      {activeWidgetModal?.widgetType === 'fileExplorer' && (
        <AddFileExplorerModal
          onConfirm={(options) => handleAddWidgetConfirm('fileExplorer', options)}
          onCancel={() => setActiveWidgetModal(null)}
        />
      )}
      {activeWidgetModal?.widgetType === 'diagram' && (
        <AddDiagramModal
          onConfirm={(options) => handleAddWidgetConfirm('diagram', options)}
          onCancel={() => setActiveWidgetModal(null)}
        />
      )}
    </div>
  );
};

export default DashboardPage;

// src/pages/DashboardPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { WidthProvider } from 'react-grid-layout';
import GridLayout from 'react-grid-layout';
import { useDashboardWidgets, WidgetLayout } from '../hooks/useDashboardWidgets';
import DraggableWidget from '../components/DraggableWidget';
import { widgetMappings } from '../config/widgetMappings';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import Dropdown from "../components/generic/Dropdown.tsx";
import {PiDotsThreeOutlineVertical} from "react-icons/pi";
import {MdClose, MdEdit} from "react-icons/md";

const ResponsiveGridLayout = WidthProvider(GridLayout);

// Render a widget by looking up its component from the mapping.
const renderWidget = (
  widget: WidgetLayout,
  deleteWidget: (widgetId: string) => void,
  renameWidget: (widgetId: string, newName: string) => void
) => {
  const widgetConfig = widgetMappings[widget.widgetType];
  const WidgetComponent = widgetConfig
    ? widgetConfig.component
    : () => <div>Unknown Widget</div>;

  return (
    <div key={widget.i}>
      <DraggableWidget
        widgetName={widget.widgetName}
        onDelete={() => deleteWidget(widget.i)}
        onRename={(newName: string) => renameWidget(widget.i, newName)}
      >
        <WidgetComponent />
      </DraggableWidget>
    </div>
  );
};

const DashboardPage: React.FC = () => {
  const { dashboardId } = useParams<{ dashboardId: string }>();
  const instanceId = dashboardId || 'base-dashboard';
  const { currentLayout, onLayoutChange, addWidget, deleteWidget, renameWidget } =
    useDashboardWidgets(instanceId);

  return (
    <div className="p-4">
      {/* Controls for adding new widgets */}
      <div className="mb-4 flex justify-center space-x-4">
            <Dropdown toggleIcon={<PiDotsThreeOutlineVertical />}
              options={[
                      {
                          value: { id: 1, name: 'Chart', icon: "", label: "Chart" },
                          onSelect: () => addWidget('chart'),
                          render: () => (<div className="flex items-center" title="Rename"><MdEdit /><span className="ml-1">Chart</span></div>),
                      },
                      {
                        value: { id: 2, name: 'Table', icon: ""},
                        onSelect: () => addWidget('table'),
                        render: () => (<div className="flex items-center"><MdClose /><span className="ml-1">Table</span></div>),
                      },
                    {
                        value: { id: 3, name: 'Todo', icon: ""},
                        onSelect: () => addWidget('todo'),
                        render: () => (<div className="flex items-center"><MdClose /><span className="ml-1">Todo</span></div>),
                    },
                  {
                        value: { id: 4, name: 'Timeline', icon: ""},
                        onSelect: () => addWidget('timeline'),
                        render: () => (<div className="flex items-center"><MdClose /><span className="ml-1">Timeline</span></div>),
                    },
                  {
                        value: { id: 5, name: 'Calendar', icon: ""},
                        onSelect: () => addWidget('calendar'),
                        render: () => (<div className="flex items-center"><MdClose /><span className="ml-1">Calendar</span></div>),
                    },
                  {
                        value: { id: 6, name: 'Text', icon: ""},
                        onSelect: () => addWidget('text'),
                        render: () => (<div className="flex items-center"><MdClose /><span className="ml-1">Text</span></div>),
                    },
                  {
                        value: { id: 7, name: 'Email', icon: ""},
                        onSelect: () => addWidget('email'),
                        render: () => (<div className="flex items-center"><MdClose /><span className="ml-1">Email</span></div>),
                    },
                  {
                        value: { id: 3, name: 'File Explorer', icon: ""},
                        onSelect: () => addWidget('fileExplorer'),
                        render: () => (<div className="flex items-center"><MdClose /><span className="ml-1">File Explorer</span></div>),
                    },
                  {
                        value: { id: 3, name: 'Diagram', icon: ""},
                        onSelect: () => addWidget('diagram'),
                        render: () => (<div className="flex items-center"><MdClose /><span className="ml-1">Diagram</span></div>),
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
          renderWidget(widget, deleteWidget, renameWidget)
        )}
      </ResponsiveGridLayout>
    </div>
  );
};

export default DashboardPage;

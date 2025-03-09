// src/pages/DashboardPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { WidthProvider } from 'react-grid-layout';
import GridLayout from 'react-grid-layout';
import { useDashboardWidgets, WidgetLayout } from '../hooks/useDashboardWidgets';
import DraggableWidget from '../components/DraggableWidget';
import ChartComponent from '../components/ChartComponent';
import TableComponent from '../components/TableComponent';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(GridLayout);

// Render a widget based on its type.
const renderWidget = (
  widget: WidgetLayout,
  deleteWidget: (widgetId: string) => void,
  renameWidget: (widgetId: string, newName: string) => void
) => {
  let content;
  switch (widget.widgetType) {
    case 'chart':
      content = <ChartComponent />;
      break;
    case 'table':
      content = <TableComponent />;
      break;
    default:
      content = <div>Unknown Widget</div>;
  }
  return (
    <div key={widget.i}>
      <DraggableWidget
        widgetName={widget.widgetName}
        onDelete={() => deleteWidget(widget.i)}
        onRename={(newName: string) => renameWidget(widget.i, newName)}
      >
        {content}
      </DraggableWidget>
    </div>
  );
};

const DashboardPage: React.FC = () => {
  // Get the dashboard id from the route parameters.
  const { dashboardId } = useParams<{ dashboardId: string }>();
  // Use a fallback id if none is provided.
  const instanceId = dashboardId || 'base-dashboard';

  // Use the instanceId in the dashboard widgets hook.
  const { currentLayout, onLayoutChange, addWidget, deleteWidget, renameWidget } =
    useDashboardWidgets(instanceId);

  return (
    <div className="p-4">
      {/* Controls for adding new widgets */}
      <div className="mb-4 flex justify-center space-x-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => addWidget('chart')}
        >
          Add Chart
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={() => addWidget('table')}
        >
          Add Table
        </button>
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

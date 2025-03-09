// src/hooks/useDashboardWidgets.ts
import { useLayoutStore } from '../stores/useLayoutStore';
import { Layout } from 'react-grid-layout';

export type WidgetType = 'chart' | 'table' | string;

export interface WidgetLayout extends Layout {
  widgetType: WidgetType;
  widgetName: string;
}

// A default layout if none is saved yet.
const defaultLayout: WidgetLayout[] = [
  { i: '1', widgetType: 'chart', widgetName: 'CHART Widget', x: 0, y: 0, w: 6, h: 4 },
  { i: '2', widgetType: 'table', widgetName: 'TABLE Widget', x: 6, y: 0, w: 6, h: 4 },
];

export function useDashboardWidgets(dashboardId: string) {
  const { layouts, setLayout } = useLayoutStore();
  // @ts-ignore
	const currentLayout: WidgetLayout[] = layouts[dashboardId] || defaultLayout;

  // When items are moved or resized, update the layout.
  const onLayoutChange = (layout: Layout[]) => {
    const updatedLayout = layout.map((item) => {
      const existingItem = currentLayout.find((x) => x.i === item.i);
      return {
        ...item,
        widgetType: existingItem ? existingItem.widgetType : 'chart',
        widgetName: existingItem ? existingItem.widgetName : 'CHART',
      } as WidgetLayout;
    });
    setLayout(dashboardId, updatedLayout);
  };

  // Add a new widget with a unique id.
  const addWidget = (widgetType: WidgetType) => {
    const newId = Date.now().toString();
    const newItem: WidgetLayout = {
      i: newId,
      widgetType,
      widgetName: `${widgetType.toUpperCase()}`,
      x: 0,
      y: Infinity,
      w: 6,
      h: 4,
    };
    setLayout(dashboardId, [...currentLayout, newItem]);
  };

  // Delete a widget.
  const deleteWidget = (widgetId: string) => {
    const newLayout = currentLayout.filter((widget) => widget.i !== widgetId);
    setLayout(dashboardId, newLayout);
  };

  // Rename a widget.
  const renameWidget = (widgetId: string, newName: string) => {
    const newLayout = currentLayout.map((widget) =>
      widget.i === widgetId ? { ...widget, widgetName: newName } : widget
    );
    setLayout(dashboardId, newLayout);
  };

  return { currentLayout, onLayoutChange, addWidget, deleteWidget, renameWidget };
}

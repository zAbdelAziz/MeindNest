// src/hooks/useDashboardWidgets.ts
import { useLayoutStore } from '../stores/useLayoutStore';
import { Layout } from 'react-grid-layout';
import { widgetMappings } from '../config/widgetMappings';

export type WidgetType = keyof typeof widgetMappings | string;

export interface WidgetLayout extends Layout {
  widgetType: WidgetType;
  widgetName: string;
}

// Optional: A default layout when none is saved yet.
const defaultLayout: WidgetLayout[] = [
  { i: 'base-dashboard-1', widgetType: 'chart', widgetName: 'Chart Widget', x: 0, y: 0, w: 6, h: 4 },
  { i: 'base-dashboard-2', widgetType: 'table', widgetName: 'Table Widget', x: 6, y: 0, w: 6, h: 4 },
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
        widgetName: existingItem ? existingItem.widgetName : 'Chart Widget',
      } as WidgetLayout;
    });
    setLayout(dashboardId, updatedLayout);
  };

  // Add a new widget with an id that combines the dashboard id and a unique timestamp.
  const addWidget = (widgetType: WidgetType) => {
    const mapping = widgetMappings[widgetType] || {
      defaultName: widgetType.toUpperCase(),
      defaultLayout: { w: 6, h: 4 },
    };

    const newId = `${dashboardId}-${Date.now()}`;
    const newItem: WidgetLayout = {
      i: newId,
      widgetType,
      widgetName: mapping.defaultName,
      x: 0,
      y: Infinity, // y: Infinity pushes the widget to the bottom
      w: mapping.defaultLayout.w,
      h: mapping.defaultLayout.h,
    };
    setLayout(dashboardId, [...currentLayout, newItem]);
  };

  const deleteWidget = (widgetId: string) => {
    const newLayout = currentLayout.filter((widget) => widget.i !== widgetId);
    setLayout(dashboardId, newLayout);
  };

  const renameWidget = (widgetId: string, newName: string) => {
    const newLayout = currentLayout.map((widget) =>
      widget.i === widgetId ? { ...widget, widgetName: newName } : widget
    );
    setLayout(dashboardId, newLayout);
  };

  return { currentLayout, onLayoutChange, addWidget, deleteWidget, renameWidget };
}

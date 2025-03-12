// src/hooks/useDashboardWidgets.ts
import { useLayoutStore } from '../stores/useLayoutStore';
import { Layout } from 'react-grid-layout';
import { widgetMappings } from '../config/widgetMappings';

export type WidgetType = keyof typeof widgetMappings | string;

export interface WidgetLayout extends Layout {
  widgetType: WidgetType;
  widgetName: string;
  minW?: number;
  // New properties to track collapse state and previous dimensions
  collapsed?: boolean;
  prevW?: number;
  prevH?: number;
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
      const widgetType = existingItem ? existingItem.widgetType : 'chart';
      const mapping = widgetMappings[widgetType] || { defaultLayout: { w: 6, h: 4 } };

      return {
        ...item,
        widgetType,
        widgetName: existingItem ? existingItem.widgetName : mapping.defaultName,
        // Include minW if defined in the widget mapping.
        ...(mapping.defaultLayout.minW ? { minW: mapping.defaultLayout.minW } : {}),
        // Persist collapse state if already set.
        collapsed: existingItem?.collapsed,
        prevW: existingItem?.prevW,
        prevH: existingItem?.prevH,
      } as WidgetLayout;
    });
    setLayout(dashboardId, updatedLayout);
  };

  // Updated addWidget: accepts an optional options object containing a title.
  const addWidget = (widgetType: WidgetType, options?: { title: string }) => {
    const mapping = widgetMappings[widgetType] || {
      defaultName: widgetType.toUpperCase(),
      defaultLayout: { w: 6, h: 4 },
    };

    const newId = `${dashboardId}-${Date.now()}`;
    const newItem: WidgetLayout = {
      i: newId,
      widgetType,
      widgetName: options?.title || mapping.defaultName,
      x: 0,
      y: Infinity, // pushes the widget to the bottom
      w: mapping.defaultLayout.w,
      h: mapping.defaultLayout.h,
      ...(mapping.defaultLayout.minW ? { minW: mapping.defaultLayout.minW } : {}),
      collapsed: false,
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

  // New: update layout dimensions and persist collapse state.
  const collapseWidget = (widgetId: string, collapsed: boolean) => {
    const updatedLayout = currentLayout.map((widget) => {
      if (widget.i === widgetId) {
        if (collapsed && !widget.collapsed) {
          // When collapsing, save current dimensions and set to 1×1.
          return {
            ...widget,
            prevW: widget.w,
            prevH: widget.h,
            collapsed: true,
            w: 2,
            h: 1,
          };
        }
        if (!collapsed && widget.collapsed) {
          // When expanding, restore previous dimensions if available.
          const mapping = widgetMappings[widget.widgetType] || { defaultLayout: { w: 6, h: 4 } };
          return {
            ...widget,
            collapsed: false,
            w: widget.prevW || mapping.defaultLayout.w,
            h: widget.prevH || mapping.defaultLayout.h,
            prevW: undefined,
            prevH: undefined,
          };
        }
      }
      return widget;
    });
    setLayout(dashboardId, updatedLayout);
  };

  return { currentLayout, onLayoutChange, addWidget, deleteWidget, renameWidget, collapseWidget };
}

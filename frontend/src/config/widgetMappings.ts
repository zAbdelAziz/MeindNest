// src/config/widgetMappings.ts
import React from 'react';
import ChartComponent from '../components/widgets/Chart';
import TableComponent from '../components/widgets/Table';
import TodoComponent from '../components/widgets/Todo';
import TimelineComponent from '../components/widgets/Timeline';
import CalendarComponent from '../components/widgets/Calendar';
import TextNoteComponent from '../components/widgets/TextNote';
import EmailComponent from '../components/widgets/Email';
import FileExplorerComponent from '../components/widgets/FileExplorer';
import DiagramComponent from '../components/widgets/Diagram';

export interface WidgetConfig {
  component: React.FC;
  defaultName: string;
  defaultLayout: { w: number; h: number };
}

export const widgetMappings: Record<string, WidgetConfig> = {
  chart: {
    component: ChartComponent,
    defaultName: 'Chart Widget',
    defaultLayout: { w: 6, h: 4 },
  },
  table: {
    component: TableComponent,
    defaultName: 'Table Widget',
    defaultLayout: { w: 6, h: 4 },
  },
  todo: {
    component: TodoComponent,
    defaultName: 'Todo List',
    defaultLayout: { w: 6, h: 4 },
  },
  timeline: {
    component: TimelineComponent,
    defaultName: 'Timeline',
    defaultLayout: { w: 6, h: 4 },
  },
  calendar: {
    component: CalendarComponent,
    defaultName: 'Calendar',
    defaultLayout: { w: 6, h: 4 },
  },
  text: {
    component: TextNoteComponent,
    defaultName: 'Text / Note',
    defaultLayout: { w: 6, h: 4 },
  },
  email: {
    component: EmailComponent,
    defaultName: 'Email',
    defaultLayout: { w: 6, h: 4 },
  },
  fileExplorer: {
    component: FileExplorerComponent,
    defaultName: 'File Explorer',
    defaultLayout: { w: 6, h: 4 },
  },
  diagram: {
    component: DiagramComponent,
    defaultName: 'Diagram',
    defaultLayout: { w: 6, h: 4 },
  },
};

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

import { FaChartPie, FaTable, FaTimeline, FaCalendarDays, FaFolderOpen, FaDiagramProject } from 'react-icons/fa6';
import { LuListTodo, LuText, LuMail } from 'react-icons/lu';

export interface WidgetConfig {
  component: React.FC<{ widgetId: string }>;
  defaultName: string;
  defaultLayout: { w: number; h: number; minW?: number };
  icon: React.ReactNode;
}


export const widgetMappings: Record<string, WidgetConfig> = {
  chart: {
    component: ChartComponent,
    defaultName: 'Chart Widget',
    defaultLayout: { w: 6, h: 4 },
    icon: <FaChartPie />,
  },
  table: {
    component: TableComponent,
    defaultName: 'Table Widget',
    defaultLayout: { w: 6, h: 5, minW: 3 },
    icon: <FaTable />,
  },
  todo: {
    component: TodoComponent,
    defaultName: 'Todo List',
    defaultLayout: { w: 6, h: 4 },
    icon: <LuListTodo />,
  },
  timeline: {
    component: TimelineComponent,
    defaultName: 'Timeline',
    defaultLayout: { w: 6, h: 4 },
    icon: <FaTimeline />,
  },
  calendar: {
    component: CalendarComponent,
    defaultName: 'Calendar',
    defaultLayout: { w: 6, h: 4 },
    icon: <FaCalendarDays />,
  },
  text: {
    component: TextNoteComponent,
    defaultName: 'Text / Note',
    defaultLayout: { w: 6, h: 4 },
    icon: <LuText />,
  },
  email: {
    component: EmailComponent,
    defaultName: 'Email',
    defaultLayout: { w: 6, h: 4 },
    icon: <LuMail />,
  },
  fileExplorer: {
    component: FileExplorerComponent,
    defaultName: 'File Explorer',
    defaultLayout: { w: 6, h: 4 },
    icon: <FaFolderOpen />,
  },
  diagram: {
    component: DiagramComponent,
    defaultName: 'Diagram',
    defaultLayout: { w: 6, h: 4 },
    icon: <FaDiagramProject />,
  },
};

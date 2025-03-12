// src/components/ChartComponent.tsx
import React from 'react';

import '../../assets/css/widget.css';
import {TableComponentProps} from "./Table.tsx";

export interface CalendarComponentProps {
  widgetId: string;
}

const CalendarComponent: React.FC<TableComponentProps> = ({ widgetId }) => {
  return (
    <div className="widget">
      <p className="text-center">Chart Component</p>
      <p className="text-center">Chart Component</p>
      <p className="text-center">Chart Component</p>
      <p className="text-center">Chart Component</p>
      <p className="text-center">Chart Component</p>
      <p className="text-center">Chart Component</p>
      <p className="text-center">Chart Component</p>
      <p className="text-center">Chart Component</p>
      <p className="text-center">Chart Component</p>
      <p className="text-center">Chart Component</p>
      <p className="text-center">Chart Component</p>
      <p className="text-center">Chart Component</p>
      <p className="text-center">Chart Component</p>
    </div>
  );
};

export default CalendarComponent;

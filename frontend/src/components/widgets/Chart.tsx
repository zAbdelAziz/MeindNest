// src/components/ChartComponent.tsx
import React from 'react';

import '../../assets/css/widget.css';


export interface ChartComponentProps {
  widgetId: string;
}

const ChartComponent: React.FC<ChartComponentProps> = ({ widgetId }) => {
  return (
    <div className="widget">
      <p className="text-center">Chart Component</p>
    </div>
  );
};

export default ChartComponent;

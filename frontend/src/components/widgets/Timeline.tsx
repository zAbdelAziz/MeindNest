// src/components/TimelineComponent.tsx
import React from 'react';

import '../../assets/css/widget.css';


export interface TimelineComponentProps {
  widgetId: string;
}

const TimelineComponent: React.FC<TimelineComponentProps> = ({ widgetId }) => {
  return (
    <div className="widget">
      <p className="text-center">Timeline Component</p>
    </div>
  );
};

export default TimelineComponent;

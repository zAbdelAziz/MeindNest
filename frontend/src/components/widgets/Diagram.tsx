// src/components/DiagramComponent.tsx
import React from 'react';

import '../../assets/css/widget.css';


export interface DiagramComponentProps {
  widgetId: string;
}

const DiagramComponent: React.FC<DiagramComponentProps> = ({ widgetId }) => {
  return (
    <div className="widget">
      <p className="text-center">Diagram Component</p>
    </div>
  );
};

export default DiagramComponent;

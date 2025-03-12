// src/components/TextNoteComponent.tsx
import React from 'react';

import '../../assets/css/widget.css';


export interface TextNoteComponentProps {
  widgetId: string;
}

const TextNoteComponent: React.FC<TextNoteComponentProps> = ({ widgetId }) => {
  return (
    <div className="widget">
      <p className="text-center">TextNote Component</p>
    </div>
  );
};

export default TextNoteComponent;

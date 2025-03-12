// src/components/TodoComponent.tsx
import React from 'react';

import '../../assets/css/widget.css';


export interface TodoComponentProps {
  widgetId: string;
}

const TodoComponent: React.FC<TodoComponentProps> = ({ widgetId }) => {
  return (
    <div className="widget">
      <p className="text-center">Todo Component</p>
    </div>
  );
};

export default TodoComponent;

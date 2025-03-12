// src/components/EmailComponent.tsx
import React from 'react';

import '../../assets/css/widget.css';


export interface EmailComponentProps {
  widgetId: string;
}

const EmailComponent: React.FC<EmailComponentProps> = ({ widgetId }) => {
  return (
    <div className="widget">
      <p className="text-center">Email Component</p>
    </div>
  );
};

export default EmailComponent;

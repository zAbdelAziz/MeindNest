// src/components/FileExplorerComponent.tsx
import React from 'react';

import '../../assets/css/widget.css';


export interface FileExplorerComponentProps {
  widgetId: string;
}

const FileExplorerComponent: React.FC<FileExplorerComponentProps> = ({ widgetId }) => {
  return (
    <div className="widget">
      <p className="text-center">FileExplorer Component</p>
    </div>
  );
};

export default FileExplorerComponent;

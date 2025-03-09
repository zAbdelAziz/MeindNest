// src/components/Layout.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LeftSidebar from './LeftSidebar';
import TopBar from './TopBar';
import Dashboard from '../pages/Dashboard';

interface LayoutProps {
  sidebarWidth: number;
  handleMouseDown: () => void;
  toggleSidebarWidth: () => void;
  sideBarExpanded: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  sidebarWidth,
  handleMouseDown,
  toggleSidebarWidth,
  sideBarExpanded,
}) => {
  return (
    <div className="min-h-screen flex h-screen bg-neutral-300 dark:bg-neutral-900">
      {/* Left Sidebar */}
      <LeftSidebar sidebarWidth={sidebarWidth} />

      {/* Draggable Divider */}
      <div
        className="cursor-col-resize bg-neutral-400 dark:bg-neutral-800"
        onMouseDown={handleMouseDown}
      />

      {/* Main Content Area */}
      <div className="overflow-auto flex-1 bg-neutral-300 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-400 scrollbar">
        <TopBar
          toggleSidebarWidth={toggleSidebarWidth}
          sideBarExpanded={sideBarExpanded}
        />
        <Routes>
          {/* Base Dashboard */}
          <Route path="/" element={<Dashboard />} />
          {/* Dashboard instances */}
          <Route path="/:dashboardId" element={<Dashboard />} />
        </Routes>
      </div>
    </div>
  );
};

export default Layout;

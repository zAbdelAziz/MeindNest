// src/components/LeftSidebar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { MdDashboard } from 'react-icons/md';
import { useDashboardStore } from '../stores/useDashboardStore';

interface LeftSidebarProps {
  sidebarWidth: number;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ sidebarWidth }) => {
  // Retrieve the list of dashboards from the dashboard store.
  const dashboards = useDashboardStore((state) => state.dashboards);

  return (
    <div
      className="flex flex-col justify-center items-center overflow-auto bg-neutral-400 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-400 scrollbar"
      style={{ width: sidebarWidth }}
    >
      <div className="border-3 m-0.5 rounded-full"></div>

      {/* Dynamic Dashboard Links */}
      {dashboards.length > 0 && (
        <>
          {dashboards.map((dashboard) => (
            <div key={dashboard.id} className="py-1">
              <Link to={`/${dashboard.id}`}>
                <button
                  className="p-1 rounded-full text-3xl text-zinc-700 dark:text-stone-500"
                  title={dashboard.name}
                >
                  <MdDashboard />
                </button>
              </Link>
            </div>
          ))}
        </>
      )}

      <div className="border-3 m-0.5 rounded-full"></div>

    </div>
  );
};

export default LeftSidebar;

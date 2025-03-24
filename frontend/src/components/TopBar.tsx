import React from 'react';

import { useNavigate, useMatch } from 'react-router-dom';

import { useDarkMode } from '../hooks/useDarkMode';
import { usePageTitle } from '../hooks/usePageTitle';

import { useNewDashboard } from '../hooks/useNewDashboard';
import { useDashboardStore } from '../stores/useDashboardStore';

import AddNewDashboardModal from './modals/AddNewDashboardModal';

import NotificationsDropdown from './NotificationsDropdown';

import {
	MdLightMode,
	MdDarkMode,
	MdOutlineKeyboardDoubleArrowLeft,
	MdOutlineKeyboardDoubleArrowRight,
	MdAdd,
	MdClose
} from 'react-icons/md';


interface TopBarProps {
	toggleSidebarWidth: () => void;
	sideBarExpanded: boolean;
}

const TopBar: React.FC<TopBarProps> = ({ toggleSidebarWidth, sideBarExpanded }) => {
	const { darkMode, toggleDarkMode } = useDarkMode();

	const pageTitle = usePageTitle();
	const navigate = useNavigate();

	// useMatch to capture dashboard id from URL.
	const match = useMatch('/:dashboardId');
	const dashboardId = match?.params.dashboardId;
	const deleteDashboard = useDashboardStore((state) => state.deleteDashboard);

	// Use the custom hook for new dashboard creation.
	const {
		showNewDashboardModal,
		openNewDashboard,
		confirmNewDashboard,
		cancelNewDashboard,
	} = useNewDashboard();

	const handleDeleteDashboard = () => {
		if (!dashboardId) return;
		const confirmed = window.confirm('Are you sure you want to delete this dashboard?');
		if (confirmed) {
			deleteDashboard(dashboardId);
			navigate('/');
		}
	};

  return (
    <div className="flex justify-between items-center bg-neutral-400 dark:bg-neutral-800 p-2">
      {/* Left section for sidebar and dashboard controls */}
      <div className="p-2 flex space-x-2">
        {/* Sidebar toggle and add dashboard buttons */}
        <button onClick={toggleSidebarWidth} className="rounded-full text-xl text-slate-600 p-1 mx-1" title="Toggle Menu">
          {sideBarExpanded ? <MdOutlineKeyboardDoubleArrowRight /> : <MdOutlineKeyboardDoubleArrowLeft />}
        </button>
        <button onClick={openNewDashboard} className="rounded-full text-xl text-slate-600 p-1 mx-1" title="Create New Dashboard">
          <MdAdd />
        </button>
      </div>

      {/* Center: Page Title */}
      <div className="p-2 flex items-center space-x-4">
        <p className="text-lg font-semibold">{pageTitle}</p>
      </div>

      {/* Right: Notifications, dark mode, delete dashboard */}
      <div className="p-2 flex items-center space-x-4">
        <NotificationsDropdown />
        <button onClick={toggleDarkMode} className="rounded-full text-xl text-slate-600 p-1">
          {darkMode ? <MdLightMode /> : <MdDarkMode />}
        </button>
        {dashboardId && (
          <button onClick={handleDeleteDashboard} className="rounded-full text-xl text-red-900 p-1" title="Delete Dashboard">
            <MdClose />
          </button>
        )}
      </div>

      {/* New Dashboard Modal */}
      {showNewDashboardModal && (
        <AddNewDashboardModal
          message="Enter the name for the new dashboard:"
          placeholder="Dashboard name"
          onCancel={cancelNewDashboard}
          onConfirm={confirmNewDashboard}
        />
      )}
    </div>
  );
};


export default TopBar;

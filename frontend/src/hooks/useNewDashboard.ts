// src/hooks/useNewDashboard.ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboardStore } from '../stores/useDashboardStore';

export function useNewDashboard() {
  const [showNewDashboardModal, setShowNewDashboardModal] = useState(false);
  const navigate = useNavigate();
  const addDashboard = useDashboardStore((state) => state.addDashboard);

  // Open the modal for creating a new dashboard.
  const openNewDashboard = () => {
    setShowNewDashboardModal(true);
  };

  // Confirm creation of a new dashboard with the provided name.
  const confirmNewDashboard = (dashboardName: string) => {
    if (dashboardName && dashboardName.trim().length > 0) {
      const id = Date.now().toString();
      addDashboard({ id, name: dashboardName });
      navigate(`/${id}`);
    }
    setShowNewDashboardModal(false);
  };

  // Cancel the creation.
  const cancelNewDashboard = () => {
    setShowNewDashboardModal(false);
  };

  return {
    showNewDashboardModal,
    openNewDashboard,
    confirmNewDashboard,
    cancelNewDashboard,
  };
}

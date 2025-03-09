// src/hooks/usePageTitle.ts
import { useLocation } from 'react-router-dom';
import { useDashboardStore } from '../stores/useDashboardStore';

export function usePageTitle(): string {
  const location = useLocation();
  const dashboards = useDashboardStore((state) => state.dashboards);

  // Assume URL is like "/somepageid". Remove the leading slash.
  const pageId = location.pathname.slice(1);

  // Look up the dashboard by its id.
  const dashboard = dashboards.find((d) => d.id === pageId);

  return dashboard ? dashboard.name : 'Main';
}

// src/stores/useDashboardStore.ts
import {create} from 'zustand';
import { persist } from 'zustand/middleware';

export interface Dashboard {
  id: string;
  name: string;
}

export interface DashboardStore {
  dashboards: Dashboard[];
  addDashboard: (dashboard: Dashboard) => void;
  updateDashboardName: (id: string, name: string) => void;
  deleteDashboard: (id: string) => void;
}

export const useDashboardStore =  create<DashboardStore, [["zustand/persist", DashboardStore]]>(
  persist(
    (set) => ({
      dashboards: [],
      addDashboard: (dashboard: Dashboard) =>
        set((state) => ({ dashboards: [...state.dashboards, dashboard] })),
      updateDashboardName: (id: string, name: string) =>
        set((state) => ({
          dashboards: state.dashboards.map((d) =>
            d.id === id ? { ...d, name } : d
          ),
        })),
      deleteDashboard: (id: string) =>
        set((state) => ({
          dashboards: state.dashboards.filter((d) => d.id !== id),
        })),
    }),
    { name: 'dashboard-store'}
  )
);

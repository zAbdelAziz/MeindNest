// src/stores/useLayoutStore.ts
import {create} from 'zustand';
import { persist } from 'zustand/middleware';
import { Layout } from 'react-grid-layout';


export interface WidgetLayout extends Layout {
  widgetType: 'chart' | 'table' | string;
}

export interface LayoutStore {
  layouts: { [page: string]: Layout[] };
  setLayout: (page: string, layout: Layout[]) => void;
}

export const useLayoutStore = create<LayoutStore, [["zustand/persist", LayoutStore]]>(
  persist(
	  // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (set, _get) => ({
      layouts: {},
      setLayout: (page: string, layout: Layout[]) => {
        set((state) => ({
          layouts: { ...state.layouts, [page]: layout },
        }));
      },
    }),
    {
      name: 'layout-store',
// key in localStorage
	  }
  )
);

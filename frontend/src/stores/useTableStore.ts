// src/stores/useTableStore.ts
import {create} from 'zustand';
import { persist } from 'zustand/middleware';

export interface TableData {
  headers: string[];
  rows: string[][];
}

interface TableStore {
  tables: Record<string, TableData>;
  // Allow dataOrUpdater to be either a TableData object or an updater function
  setTableData: (
    tableId: string,
    dataOrUpdater: TableData | ((prev: TableData) => TableData)
  ) => void;
}

export const useTableStore = create<TableStore, [["zustand/persist", TableStore]]>(
  persist(
    (set) => ({
      tables: {},
      setTableData: (tableId, dataOrUpdater) =>
        set((state) => {
          const currentData =
            state.tables[tableId] || {
              headers: ['Column 1', 'Column 2', 'Column 3'],
              rows: [
                ['', '', ''],
                ['', '', ''],
              ],
            };
          const newData =
            typeof dataOrUpdater === 'function'
              ? dataOrUpdater(currentData)
              : dataOrUpdater;
          return {
            tables: {
              ...state.tables,
              [tableId]: newData,
            },
          };
        }),
    }),
    {
      name: 'table-storage', // key in localStorage
    }
  )
);

import {create} from 'zustand';

interface TableSelectionState {
  selectedRows: number[];
  selectedColumns: number[];
  setSelectedRows: (rows: number[] | ((prev: number[]) => number[])) => void;
  setSelectedColumns: (cols: number[] | ((prev: number[]) => number[])) => void;
}

export const useTableSelectionStore = create<TableSelectionState>((set) => ({
  selectedRows: [],
  selectedColumns: [],
  setSelectedRows: (rows) => set((state) => ({ selectedRows: typeof rows === 'function' ? rows(state.selectedRows) : rows })),
  setSelectedColumns: (cols) => set((state) => ({ selectedColumns: typeof cols === 'function' ? cols(state.selectedColumns) : cols })),
}));

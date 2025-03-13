import {create} from 'zustand';

interface TableHoverState {
  hoveredRow: number | null;
  hoveredColumn: number | null;
  setHoveredRow: (row: number | null) => void;
  setHoveredColumn: (col: number | null) => void;
}

export const useTableHoverStore = create<TableHoverState>((set) => ({
  hoveredRow: null,
  hoveredColumn: null,
  setHoveredRow: (row) => set({ hoveredRow: row }),
  setHoveredColumn: (col) => set({ hoveredColumn: col }),
}));

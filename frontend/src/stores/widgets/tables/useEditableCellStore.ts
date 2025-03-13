import {create} from 'zustand';

interface EditableCellState {
  editingCell: { rowIndex: number; columnIndex: number } | null;
  editingValue: string;
  setEditingCell: (cell: { rowIndex: number; columnIndex: number } | null) => void;
  setEditingValue: (value: string) => void;
}

export const useEditableCellStore = create<EditableCellState>((set) => ({
  editingCell: null,
  editingValue: '',
  setEditingCell: (cell) => set({ editingCell: cell }),
  setEditingValue: (value) => set({ editingValue: value }),
}));

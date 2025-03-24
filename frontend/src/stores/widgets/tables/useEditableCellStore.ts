import {create} from 'zustand';

export interface EditingCell {
  row: number;
  col: number;
}

interface EditableCellState {
  editingCell: EditingCell | null;
  editingValue: string;
  // Allow both a direct value and an updater function
  setEditingCell: (value: EditingCell | null | ((prev: EditingCell | null) => EditingCell | null)) => void;
  setEditingValue: (value: string | ((prev: string) => string)) => void;
}

export const useEditableCellStore = create<EditableCellState>((set) => ({
  editingCell: null,
  editingValue: '',
  setEditingCell: (value) =>
    set((state) => ({
      editingCell: typeof value === 'function' ? value(state.editingCell) : value,
    })),
  setEditingValue: (value) =>
    set((state) => ({
      editingValue: typeof value === 'function' ? value(state.editingValue) : value,
    })),
}));

import {create} from 'zustand';

interface TableModalState {
  isAddColumnModalOpen: boolean;
  referenceColumnIndex: number | null;
  columnInsertPosition: 'left' | 'right';
  rowToDelete: number | null;
  colToDelete: number | null;
  formulaModalOpen: boolean;
  formulaTarget: 'row' | 'column';
  openAddColumnModal: (refIndex: number | null, position: 'left' | 'right') => void;
  closeAddColumnModal: () => void;
  setRowToDelete: (row: number | null) => void;
  setColToDelete: (col: number | null) => void;
  openFormulaModal: (target: 'row' | 'column') => void;
  closeFormulaModal: () => void;
}

// useTableModalStore.ts
export const useTableModalStore = create<TableModalState>((set) => ({
  isAddColumnModalOpen: false,
  referenceColumnIndex: null, // defined here
  columnInsertPosition: 'left',
  rowToDelete: null,
  colToDelete: null,
  formulaModalOpen: false,
  formulaTarget: 'row',
  openAddColumnModal: (refIndex, position) =>
    set({ isAddColumnModalOpen: true, referenceColumnIndex: refIndex, columnInsertPosition: position }),
  closeAddColumnModal: () =>
    set({ isAddColumnModalOpen: false, referenceColumnIndex: null, columnInsertPosition: 'left' }),
  setRowToDelete: (row) => set({ rowToDelete: row }),
  setColToDelete: (col) => set({ colToDelete: col }),
  openFormulaModal: (target) => set({ formulaModalOpen: true, formulaTarget: target }),
  closeFormulaModal: () => set({ formulaModalOpen: false, formulaTarget: 'row' }),
}));


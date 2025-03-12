// src/hooks/useTableSelection.ts
import { useState } from 'react';

export interface CellPosition {
  row: number;
  col: number;
}

export interface DragSelection {
  start: CellPosition;
  end: CellPosition;
}

export const useTableSelection = () => {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectedColumns, setSelectedColumns] = useState<Set<number>>(new Set());
  const [dragSelection, setDragSelection] = useState<DragSelection | null>(null);

  const toggleRowSelection = (rowIndex: number) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(rowIndex)) {
        newSet.delete(rowIndex);
      } else {
        newSet.add(rowIndex);
      }
      return newSet;
    });
  };

  const toggleColumnSelection = (colIndex: number) => {
    setSelectedColumns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(colIndex)) {
        newSet.delete(colIndex);
      } else {
        newSet.add(colIndex);
      }
      return newSet;
    });
  };

  const startDragSelection = (start: CellPosition) => {
    setDragSelection({ start, end: start });
  };

  const updateDragSelection = (current: CellPosition) => {
    if (dragSelection) {
      setDragSelection({ start: dragSelection.start, end: current });
    }
  };

  const endDragSelection = () => {
    // In a full implementation you might consolidate the drag region into row/column selection
    setDragSelection(null);
  };

  return {
    selectedRows,
    selectedColumns,
    dragSelection,
    toggleRowSelection,
    toggleColumnSelection,
    startDragSelection,
    updateDragSelection,
    endDragSelection,
  };
};

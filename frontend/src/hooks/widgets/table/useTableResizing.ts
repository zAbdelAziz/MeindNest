import { useState, useEffect } from 'react';
import { TableData } from '../../../stores/useTableStore';

const MIN_COL_WIDTH = 30; // pixels
const MIN_ROW_HEIGHT = 20; // pixels

export const useTableResizing = (tableData: TableData) => {
  const [columnWidths, setColumnWidths] = useState<number[]>([]);
  const [rowHeights, setRowHeights] = useState<number[]>([]);

  useEffect(() => {
    // First column is fixed (e.g. for selection), rest get default width.
    const widths = [80];
    for (let i = 0; i < tableData.headers.length; i++) {
      widths.push(150);
    }
    setColumnWidths(widths);
  }, [tableData.headers]);

  useEffect(() => {
    const heights = tableData.rows.map(() => 40);
    setRowHeights(heights);
  }, [tableData.rows]);

  const handleColumnResize = (colIndex: number, startX: number) => {
    const initialWidth = columnWidths[colIndex + 1]; // offset because index 0 is selection column
    const onMouseMove = (e: MouseEvent) => {
      const newWidth = Math.max(MIN_COL_WIDTH, initialWidth + (e.clientX - startX));
      setColumnWidths((prev) => {
        const updated = [...prev];
        updated[colIndex + 1] = newWidth;
        return updated;
      });
    };
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const handleRowResize = (rowIndex: number, startY: number) => {
    const initialHeight = rowHeights[rowIndex];
    const onMouseMove = (e: MouseEvent) => {
      const newHeight = Math.max(MIN_ROW_HEIGHT, initialHeight + (e.clientY - startY));
      setRowHeights((prev) => {
        const updated = [...prev];
        updated[rowIndex] = newHeight;
        return updated;
      });
    };
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return {
    columnWidths,
    rowHeights,
    handleColumnResize,
    handleRowResize,
  };
};

// src/hooks/useTableColumns.ts
import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { TableData } from '../../../stores/useTableStore';
import { EditingCell } from './useEditableCell';

interface UseTableColumnsProps {
  tableData: TableData;
  widgetId: string;
  editingCell: EditingCell | null;
  editingValue: string;
  setEditingCell: React.Dispatch<React.SetStateAction<EditingCell | null>>;
  setEditingValue: React.Dispatch<React.SetStateAction<string>>;
  setTableData: (widgetId: string, updater: ((prev: TableData) => TableData) | TableData) => void;
}

export const useTableColumns = ({
  tableData,
  widgetId,
  editingCell,
  editingValue,
  setEditingCell,
  setEditingValue,
  setTableData,
}: UseTableColumnsProps): ColumnDef<Record<string, string>>[] => {
  return React.useMemo(() => {
    return tableData.headers.map((header, colIndex) => ({
      id: `col${colIndex}`,
      accessorKey: `col${colIndex}`,
      header: () => {
        if (editingCell && editingCell.row === -1 && editingCell.col === colIndex) {
          return (
            <input
              className="border-0 p-1 w-full"
              value={editingValue}
              onChange={(e) => setEditingValue(e.target.value)}
              onBlur={() => {
                setTableData(widgetId, (prev) => {
                  const newHeaders = prev.headers.map((h, idx) =>
                    idx === colIndex ? editingValue : h
                  );
                  return { ...prev, headers: newHeaders };
                });
                setEditingCell(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  setTableData(widgetId, (prev) => {
                    const newHeaders = prev.headers.map((h, idx) =>
                      idx === colIndex ? editingValue : h
                    );
                    return { ...prev, headers: newHeaders };
                  });
                  setEditingCell(null);
                }
              }}
              autoFocus
            />
          );
        }
        return (
          <div
            onClick={() => {
              setEditingCell({ row: -1, col: colIndex });
              setEditingValue(header);
            }}
            className="cursor-pointer"
          >
            {header}
          </div>
        );
      },
      cell: (info) => {
        const colIdx = colIndex;
        const cellValue = info.getValue() as string;
        const rowIndex = info.row.index;
        if (editingCell && editingCell.row === rowIndex && editingCell.col === colIdx) {
          return (
            <input
              className="p-0 w-full"
              value={editingValue}
              onChange={(e) => setEditingValue(e.target.value)}
              onBlur={() => {
                setTableData(widgetId, (prev) => {
                  const newRows = prev.rows.map((row, idx) =>
                    idx === rowIndex
                      ? row.map((cell, cidx) => (cidx === colIdx ? editingValue : cell))
                      : row
                  );
                  return { ...prev, rows: newRows };
                });
                setEditingCell(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  setTableData(widgetId, (prev) => {
                    const newRows = prev.rows.map((row, idx) =>
                      idx === rowIndex
                        ? row.map((cell, cidx) => (cidx === colIdx ? editingValue : cell))
                        : row
                    );
                    return { ...prev, rows: newRows };
                  });
                  setEditingCell(null);
                }
              }}
              autoFocus
            />
          );
        }
        return (
          <div
            onClick={() => {
              setEditingCell({ row: rowIndex, col: colIdx });
              setEditingValue(cellValue);
            }}
            className="cursor-pointer p-0"
          >
            {cellValue}
          </div>
        );
      },
    }));
  }, [tableData, editingCell, editingValue, setEditingCell, setEditingValue, setTableData, widgetId]);
};

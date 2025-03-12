// src/components/TableComponent.tsx
import React, { useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table';
import { useTableStore, TableData } from '../../stores/useTableStore';
import '../../assets/css/widget.css';

export interface TableComponentProps {
  widgetId: string;
}

// Updated default table data with sample default cell values.
const defaultTableData: TableData = {
  headers: ['Column 1', 'Column 2', 'Column 3'],
  rows: [
    ['Default 1', 'Default 2', 'Default 3'],
    ['Default 4', 'Default 5', 'Default 6'],
  ],
};

const TableComponent: React.FC<TableComponentProps> = ({ widgetId }) => {
  const { tables, setTableData } = useTableStore();

  // Use the store data or default if not present.
  const tableData: TableData = tables[widgetId] || defaultTableData;

  // On mount, initialize the table data if needed.
  useEffect(() => {
    if (!tables[widgetId]) {
      setTableData(widgetId, defaultTableData);
    }
  }, [tables, widgetId, setTableData]);

  // State to track which cell is being edited.
  // (row: -1 for header, otherwise row index in the original data)
  const [editingCell, setEditingCell] = React.useState<{ row: number; col: number } | null>(null);
  const [editingValue, setEditingValue] = React.useState<string>('');

  // Build columns using the headers array.
  const columns = React.useMemo<ColumnDef<Record<string, string>>[]>(() => {
    return tableData.headers.map((header, colIndex) => ({
      id: `col${colIndex}`,
      accessorKey: `col${colIndex}`, // Tells TanStack Table where to find the value.
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
                    idx === rowIndex ? row.map((cell, cidx) => (cidx === colIdx ? editingValue : cell)) : row
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
                      idx === rowIndex ? row.map((cell, cidx) => (cidx === colIdx ? editingValue : cell)) : row
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
  }, [tableData, editingCell, editingValue, setTableData, widgetId]);

  // Convert rows (string arrays) into an array of objects for TanStack Table.
  const data = React.useMemo(() => {
    return tableData.rows.map((row) => {
      const rowObj: Record<string, string> = {};
      tableData.headers.forEach((_, colIndex) => {
        rowObj[`col${colIndex}`] = row[colIndex] || '';
      });
      return rowObj;
    });
  }, [tableData]);

  const tableInstance = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="h-full overflow-auto scrollbar">
      <table className="min-w-full">
        <thead>
          {tableInstance.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="p-1">
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {tableInstance.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border p-1">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;

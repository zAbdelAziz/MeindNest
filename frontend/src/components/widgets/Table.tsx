// src/components/TableComponent.tsx
import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import { useTableStore, TableData } from '../../stores/useTableStore';
import { useInitializeTable } from '../../hooks/widgets/table/useInitializeTable';
import { useEditableCell } from '../../hooks/widgets/table/useEditableCell';
import { useTableColumns } from '../../hooks/widgets/table/useTableColumns';
import TableMenu from './tables/TableMenu';
import '../../assets/css/widget.css';

export interface TableComponentProps {
  widgetId: string;
}

const defaultTableData: TableData = {
  headers: ['Column 1', 'Column 2', 'Column 3'],
  rows: [
    ['Default 1', 'Default 2', 'Default 3'],
    ['Default 4', 'Default 5', 'Default 6'],
  ],
};

const TableComponent: React.FC<TableComponentProps> = ({ widgetId }) => {
  const { setTableData } = useTableStore();

  // Initialize table data (or use default)
  const tableData = useInitializeTable(widgetId, defaultTableData);

  // Manage inline editing state
  const { editingCell, setEditingCell, editingValue, setEditingValue } = useEditableCell();

  // New state for row and column selections.
  const [selectedRows, setSelectedRows] = React.useState<number[]>([]);
  const [selectedColumns, setSelectedColumns] = React.useState<number[]>([]);

  // Prepare data objects for TanStack Table from tableData.
  const data = React.useMemo(() => {
    return tableData.rows.map((row) => {
      const rowObj: Record<string, string> = {};
      tableData.headers.forEach((_, colIndex) => {
        rowObj[`col${colIndex}`] = row[colIndex] || '';
      });
      return rowObj;
    });
  }, [tableData]);

  // Get column definitions for data columns (includes inline editing & column selection).
  const dataColumns = useTableColumns({
    tableData,
    widgetId,
    editingCell,
    editingValue,
    setEditingCell,
    setEditingValue,
    setTableData,
    selectedColumns,
    setSelectedColumns,
  });

  // Create a dedicated selection column for rows.
  const selectionColumn: ColumnDef<Record<string, string>> = {
    id: 'selection',
    header: () => (
      <input
        type="checkbox"
        checked={selectedRows.length === data.length && data.length > 0}
        onChange={(e) => {
          if (e.target.checked) {
            setSelectedRows(data.map((_, idx) => idx));
          } else {
            setSelectedRows([]);
          }
        }}
        onClick={(e) => e.stopPropagation()}
      />
    ),
    cell: ({ row }) => {
      const rowIndex = row.index;
      return (
        <input
          type="checkbox"
          checked={selectedRows.includes(rowIndex)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRows((prev) => [...prev, rowIndex]);
            } else {
              setSelectedRows((prev) => prev.filter((i) => i !== rowIndex));
            }
          }}
          onClick={(e) => e.stopPropagation()}
        />
      );
    },
    size: 40,
  };

  // Merge the selection column with the rest of the data columns.
  const columns: ColumnDef<Record<string, string>>[] = React.useMemo(() => {
    return [selectionColumn, ...dataColumns];
  }, [selectionColumn, dataColumns]);

  // Build the TanStack Table instance.
  const tableInstance = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="widget group relative h-full">
      {/* Top menu always rendered; buttons show on hover */}
      <TableMenu selectedRows={selectedRows} selectedColumns={selectedColumns} />
      <div className="h-max overflow-auto scrollbar">
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
                  <td key={cell.id} className="border p-1 hover:bg-gray-300 dark:hover:bg-gray-800">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableComponent;

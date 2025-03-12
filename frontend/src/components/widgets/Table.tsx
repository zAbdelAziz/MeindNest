// src/components/TableComponent.tsx
import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';

import { useTableStore, TableData } from '../../stores/useTableStore';
import { useInitializeTable } from '../../hooks/widgets/table/useInitializeTable';
import { useEditableCell } from '../../hooks/widgets/table/useEditableCell';
import { useTableColumns } from '../../hooks/widgets/table/useTableColumns';

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
  const {setTableData } = useTableStore();

  // Initialize the table data.
  const tableData = useInitializeTable(widgetId, defaultTableData);

  // Manage editable cell state.
  const { editingCell, setEditingCell, editingValue, setEditingValue } = useEditableCell();

  // Build table columns with editable header and cell logic.
  const columns = useTableColumns({
    tableData,
    widgetId,
    editingCell,
    editingValue,
    setEditingCell,
    setEditingValue,
    setTableData,
  });

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

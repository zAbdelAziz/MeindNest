import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
} from '@tanstack/react-table';
import { useTableStore, TableData } from '../../stores/useTableStore';
import { useInitializeTable } from '../../hooks/widgets/table/useInitializeTable';
import { useEditableCell } from '../../hooks/widgets/table/useEditableCell';
import { useTableColumns } from '../../hooks/widgets/table/useTableColumns';
import { useTableResizing } from '../../hooks/widgets/table/useTableResizing';
import { useTableActions } from '../../hooks/widgets/table/useTableActions';
import { useSyncTableData } from '../../hooks/widgets/table/useSyncTableData';
import TableMenu from './tables/TableMenu';
import AddColumnModal from '../modals/tables/AddColumnModal';
import DeleteConfirmationModal from '../modals/tables/DeleteConfirmationModal';
import TableHeader from './tables/TableHeader';
import TableRow from './tables/TableRow';
import Dropdown from '../generic/Dropdown';
import { MdClose } from 'react-icons/md';
import { PiDotsThreeVerticalBold } from 'react-icons/pi';
import FormulaModal from '../modals/tables/FormulaModal';
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

  // Initialize table data.
  const tableData = useInitializeTable(widgetId, defaultTableData);

  // Inline editing state.
  const { editingCell, setEditingCell, editingValue, setEditingValue } =
    useEditableCell();

  // Selection state.
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<number[]>([]);

  // Global hover states.
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [hoveredColumn, setHoveredColumn] = useState<number | null>(null);

  // Modal states.
  const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false);
  const [referenceColumnIndex, setReferenceColumnIndex] = useState<number | null>(null);
  const [columnInsertPosition, setColumnInsertPosition] = useState<'left' | 'right'>('left');
  const [rowToDelete, setRowToDelete] = useState<number | null>(null);
  const [colToDelete, setColToDelete] = useState<number | null>(null);

  // Formula modal state.
  const [formulaModalOpen, setFormulaModalOpen] = useState(false);
  const [formulaTarget, setFormulaTarget] = useState<'row' | 'column'>('row');

  // This hook will sync the table data to your API whenever it changes.
  useSyncTableData(widgetId);

  // Use custom hooks.
  const { columnWidths, rowHeights, handleColumnResize, handleRowResize } =
    useTableResizing(tableData);
  const {
    addRowTop,
    addRowBottom,
    confirmAddColumn,
    deleteColumn,
    deleteRow,
    deleteSelected,
  } = useTableActions(widgetId, tableData, setTableData);

  // Prepare table data.
  const data = useMemo(() => {
    return tableData.rows.map((row) => {
      const rowObj: Record<string, string> = {};
      tableData.headers.forEach((_, colIndex) => {
        rowObj[`col${colIndex}`] = row[colIndex] || '';
      });
      return rowObj;
    });
  }, [tableData]);

  // Data columns from hook.
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
    hoveredColumn,
  });

  // Fixed selection column.
  const selectionColumn: ColumnDef<Record<string, string>> = {
    id: 'selection',
    header: () => (
      <div style={{ width: columnWidths[0] }} className="flex items-center">
        <div
          className={`${
            hoveredColumn === -1 ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-300`}
        >
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
        </div>
      </div>
    ),
    cell: ({ row }) => (
      <div style={{ width: columnWidths[0] }} className="flex items-center w-max">
        <div
          className={`${
            hoveredRow === row.index ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-300`}
        >
          <input
            type="checkbox"
            checked={selectedRows.includes(row.index)}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedRows((prev) => [...prev, row.index]);
              } else {
                setSelectedRows((prev) => prev.filter((i) => i !== row.index));
              }
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        <div
          className={`${
            hoveredRow === row.index ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-300 ml-1`}
        >
          <Dropdown
            options={[
              {
                value: 'delete-row',
                onSelect: () => setRowToDelete(row.index),
                render: () => (
                  <div className="flex items-center">
                    <MdClose className="text-lg" />
                    <span className="ml-1 text-xs">Delete Row</span>
                  </div>
                ),
              },
            ]}
            toggleIcon={<PiDotsThreeVerticalBold className="text-lg" />}
          />
        </div>
      </div>
    ),
    size: columnWidths[0],
  };

  const columns: ColumnDef<Record<string, string>>[] = useMemo(() => {
    return [selectionColumn, ...dataColumns];
  }, [selectionColumn, dataColumns]);

  const tableInstance = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Math Operation Handler.
  const handleMathOperation = (
    operation:
      | 'sum'
      | 'average'
      | 'max'
      | 'min'
      | 'product'
      | 'count'
      | 'median'
      | 'std'
  ) => {
    if (selectedColumns.length > 0 || (selectedColumns.length === 0 && selectedRows.length === 0)) {
      // Vertical aggregation: add a new row.
      setTableData(widgetId, (prev: TableData) => {
        const newRow = prev.headers.map((_, colIndex) => {
          const shouldOperate =
            selectedColumns.length > 0 ? selectedColumns.includes(colIndex) : true;
          if (!shouldOperate) return '';
          const values = prev.rows
            .map((row) => parseFloat(row[colIndex]))
            .filter((val) => !isNaN(val));
          if (values.length === 0) return '';
          switch (operation) {
            case 'sum':
              return values.reduce((a, b) => a + b, 0).toString();
            case 'average':
              return (values.reduce((a, b) => a + b, 0) / values.length).toString();
            case 'max':
              return Math.max(...values).toString();
            case 'min':
              return Math.min(...values).toString();
            case 'product':
              return values.reduce((a, b) => a * b, 1).toString();
            case 'count':
              return values.length.toString();
            case 'median': {
              const sorted = [...values].sort((a, b) => a - b);
              const mid = Math.floor(sorted.length / 2);
              const median =
                sorted.length % 2 !== 0
                  ? sorted[mid]
                  : (sorted[mid - 1] + sorted[mid]) / 2;
              return median.toString();
            }
            case 'std': {
              const mean = values.reduce((a, b) => a + b, 0) / values.length;
              const variance = values.reduce((sum, val) => sum + (val - mean) ** 2, 0) / values.length;
              return Math.sqrt(variance).toString();
            }
            default:
              return '';
          }
        });
        return { ...prev, rows: [...prev.rows, newRow] };
      });
    } else if (selectedRows.length > 0) {
      // Horizontal aggregation: add a new column.
      setTableData(widgetId, (prev: TableData) => {
        const newHeader = operation.charAt(0).toUpperCase() + operation.slice(1);
        const newHeaders = [...prev.headers, newHeader];
        const newRows = prev.rows.map((row, rowIndex) => {
          if (!selectedRows.includes(rowIndex)) {
            return [...row, ''];
          } else {
            const values = row
              .map((cell) => parseFloat(cell))
              .filter((val) => !isNaN(val));
            let agg = '';
            if (values.length > 0) {
              switch (operation) {
                case 'sum':
                  agg = values.reduce((a, b) => a + b, 0).toString();
                  break;
                case 'average':
                  agg = (values.reduce((a, b) => a + b, 0) / values.length).toString();
                  break;
                case 'max':
                  agg = Math.max(...values).toString();
                  break;
                case 'min':
                  agg = Math.min(...values).toString();
                  break;
                case 'product':
                  agg = values.reduce((a, b) => a * b, 1).toString();
                  break;
                case 'count':
                  agg = values.length.toString();
                  break;
                case 'median': {
                  const sorted = [...values].sort((a, b) => a - b);
                  const mid = Math.floor(sorted.length / 2);
                  const median =
                    sorted.length % 2 !== 0
                      ? sorted[mid]
                      : (sorted[mid - 1] + sorted[mid]) / 2;
                  agg = median.toString();
                  break;
                }
                case 'std': {
                  const mean = values.reduce((a, b) => a + b, 0) / values.length;
                  const variance = values.reduce((sum, val) => sum + (val - mean) ** 2, 0) / values.length;
                  agg = Math.sqrt(variance).toString();
                  break;
                }
                default:
                  agg = '';
              }
            }
            return [...row, agg];
          }
        });
        return { headers: newHeaders, rows: newRows };
      });
    }
    setSelectedRows([]);
    setSelectedColumns([]);
  };

  // Formula Handler.
  const handleApplyFormula = (formula: string, target: 'row' | 'column') => {
    if (target === 'row') {
      setTableData(widgetId, (prev: TableData) => {
        const newHeader = `Formula (${formula})`;
        const newHeaders = [...prev.headers, newHeader];
        const newRows = prev.rows.map((row) => {
          try {
            const formulaBody = formula.startsWith('=') ? formula.substring(1) : formula;
            // Create a context mapping col0, col1, ... to the row's numeric values.
            const context: Record<string, number> = {};
            prev.headers.forEach((_, index) => {
              context[`col${index}`] = parseFloat(row[index]) || 0;
            });
            const func = new Function(...Object.keys(context), `return ${formulaBody};`);
            const result = func(...Object.values(context));
            return [...row, result.toString()];
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (e) {
            return [...row, 'Error'];
          }
        });
        return { headers: newHeaders, rows: newRows };
      });
    } else if (target === 'column') {
      setTableData(widgetId, (prev: TableData) => {
        // const newHeader = `Formula (${formula})`;
        // const newHeaders = [...prev.headers, newHeader];
        const newRow = prev.headers.map((_, colIndex) => {
          try {
            const formulaBody = formula.startsWith('=') ? formula.substring(1) : formula;
            // Create a context mapping row0, row1, ... to numeric values from this column.
            const context: Record<string, number> = {};
            prev.rows.forEach((row, rowIndex) => {
              context[`row${rowIndex}`] = parseFloat(row[colIndex]) || 0;
            });
            const func = new Function(...Object.keys(context), `return ${formulaBody};`);
            const result = func(...Object.values(context));
            return result.toString();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (e) {
            return 'Error';
          }
        });
        return { ...prev, rows: [...prev.rows, newRow] };
      });
    }
  };

  const handleConfirmAddColumn = (columnName: string) => {
    confirmAddColumn(columnName, referenceColumnIndex, columnInsertPosition);
    setIsAddColumnModalOpen(false);
    setSelectedColumns([]);
  };

  const handleAddColumnLeft = () => {
    const refIndex = selectedColumns.length > 0 ? Math.min(...selectedColumns) : 0;
    setReferenceColumnIndex(refIndex);
    setColumnInsertPosition('left');
    setIsAddColumnModalOpen(true);
  };

  const handleAddColumnRight = () => {
    const refIndex =
      selectedColumns.length > 0 ? Math.min(...selectedColumns) : tableData.headers.length;
    setReferenceColumnIndex(refIndex);
    setColumnInsertPosition('right');
    setIsAddColumnModalOpen(true);
  };

  const handleDeleteSelected = () => {
    deleteSelected(selectedRows, selectedColumns);
    setSelectedRows([]);
    setSelectedColumns([]);
  };

  const handleConfirmDeleteColumn = () => {
    if (colToDelete !== null) {
      deleteColumn(colToDelete);
      setColToDelete(null);
    }
  };

  const handleConfirmDeleteRow = () => {
    if (rowToDelete !== null) {
      deleteRow(rowToDelete);
      setRowToDelete(null);
    }
  };

  const handleExportCSV = () => {
    const { headers, rows } = tableData;
    const csvRows = [];
    csvRows.push(headers.join(','));
    rows.forEach((row) => {
      csvRows.push(row.join(','));
    });
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'table-data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Open formula modal callback.
  const openFormulaModal = (target: 'row' | 'column') => {
    setFormulaTarget(target);
    setFormulaModalOpen(true);
  };

  const visibleRows = tableInstance.getRowModel().rows;
  const lastRowIdx = visibleRows.length - 1;

  return (
    <div className="widget relative h-full">
      <TableMenu
        selectedRows={selectedRows}
        selectedColumns={selectedColumns}
        onDeleteSelected={handleDeleteSelected}
        onAddRowTop={addRowTop}
        onAddRowBottom={addRowBottom}
        onAddColumnLeft={handleAddColumnLeft}
        onAddColumnRight={handleAddColumnRight}
        onExportCSV={handleExportCSV}
        onMathOperation={handleMathOperation}
        onOpenFormula={openFormulaModal}
      />
      <div className="h-max overflow-auto scrollbar">
        <table className="min-w-full">
          <TableHeader
            headerGroups={tableInstance.getHeaderGroups()}
            hoveredColumn={hoveredColumn}
            hoveredRow={hoveredRow}
            columnWidths={columnWidths}
            selectedColumns={selectedColumns}
            setHoveredColumn={setHoveredColumn}
            setHoveredRow={setHoveredRow}
            setColToDelete={setColToDelete}
            handleColumnResize={handleColumnResize}
          />
          <tbody>
            {visibleRows.map((row) => (
              <TableRow
                key={row.id}
                row={row}
                rowHeight={rowHeights[row.index]}
                lastRowIdx={lastRowIdx}
                hoveredRow={hoveredRow}
                hoveredColumn={hoveredColumn}
                selectedRows={selectedRows}
                selectedColumns={selectedColumns}
                setHoveredColumn={setHoveredColumn}
                setHoveredRow={setHoveredRow}
                handleRowResize={handleRowResize}
              />
            ))}
          </tbody>
        </table>
      </div>
      {isAddColumnModalOpen && (
        <AddColumnModal
          onConfirm={({ columnName }) => handleConfirmAddColumn(columnName)}
          onCancel={() => setIsAddColumnModalOpen(false)}
        />
      )}
      {rowToDelete !== null && (
        <DeleteConfirmationModal
          title="Confirm Delete Row"
          message="Are you sure you want to delete this row?"
          onConfirm={handleConfirmDeleteRow}
          onCancel={() => setRowToDelete(null)}
        />
      )}
      {colToDelete !== null && (
        <DeleteConfirmationModal
          title="Confirm Delete Column"
          message="Are you sure you want to delete this column?"
          onConfirm={handleConfirmDeleteColumn}
          onCancel={() => setColToDelete(null)}
        />
      )}
      {formulaModalOpen && (
        <FormulaModal
          target={formulaTarget}
          onConfirm={(formula, target) => {
            handleApplyFormula(formula, target);
            setFormulaModalOpen(false);
          }}
          onCancel={() => setFormulaModalOpen(false)}
        />
      )}
    </div>
  );
};

export default TableComponent;

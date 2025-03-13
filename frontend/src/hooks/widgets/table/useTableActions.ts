import { TableData } from '../../../stores/useTableStore';

export const useTableActions = (
  widgetId: string,
  _tableData: TableData,
  setTableData: (widgetId: string, updater: (prev: TableData) => TableData) => void
) => {
  const addRowTop = () => {
    setTableData(widgetId, (prev: TableData) => {
      const newRow = new Array(prev.headers.length).fill('');
      return { ...prev, rows: [newRow, ...prev.rows] };
    });
  };

  const addRowBottom = () => {
    setTableData(widgetId, (prev: TableData) => {
      const newRow = new Array(prev.headers.length).fill('');
      return { ...prev, rows: [...prev.rows, newRow] };
    });
  };

  const confirmAddColumn = (
    columnName: string,
    referenceColumnIndex: number | null,
    columnInsertPosition: 'left' | 'right'
  ) => {
    setTableData(widgetId, (prev: TableData) => {
      let insertIndex: number;
      if (referenceColumnIndex !== null) {
        insertIndex = columnInsertPosition === 'left' ? referenceColumnIndex : referenceColumnIndex + 1;
      } else {
        insertIndex = prev.headers.length;
      }
      const newHeaders = [...prev.headers];
      newHeaders.splice(insertIndex, 0, columnName);
      const newRows = prev.rows.map((row) => {
        const newRow = [...row];
        newRow.splice(insertIndex, 0, '');
        return newRow;
      });
      return { ...prev, headers: newHeaders, rows: newRows };
    });
  };

  const deleteColumn = (colIndex: number) => {
    setTableData(widgetId, (prev: TableData) => {
      const newHeaders = prev.headers.filter((_, idx) => idx !== colIndex);
      const newRows = prev.rows.map((row) => row.filter((_, idx) => idx !== colIndex));
      return { ...prev, headers: newHeaders, rows: newRows };
    });
  };

  const deleteRow = (rowIndex: number) => {
    setTableData(widgetId, (prev: TableData) => {
      const newRows = prev.rows.filter((_, idx) => idx !== rowIndex);
      return { ...prev, rows: newRows };
    });
  };

  const deleteSelected = (selectedRows: number[], selectedColumns: number[]) => {
    setTableData(widgetId, (prev: TableData) => {
      let newHeaders = prev.headers;
      let newRows = prev.rows;
      if (selectedColumns.length > 0) {
        newHeaders = prev.headers.filter((_, idx) => !selectedColumns.includes(idx));
        newRows = prev.rows.map((row) =>
          row.filter((_, idx) => !selectedColumns.includes(idx))
        );
      }
      if (selectedRows.length > 0) {
        newRows = newRows.filter((_, idx) => !selectedRows.includes(idx));
      }
      return { ...prev, headers: newHeaders, rows: newRows };
    });
  };

  return {
    addRowTop,
    addRowBottom,
    confirmAddColumn,
    deleteColumn,
    deleteRow,
    deleteSelected,
  };
};

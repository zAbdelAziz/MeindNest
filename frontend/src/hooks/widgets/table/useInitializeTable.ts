// src/hooks/useInitializeTable.ts
import { useEffect } from 'react';
import { useTableStore, TableData } from '../../../stores/useTableStore';

export const useInitializeTable = (widgetId: string, defaultTableData: TableData): TableData => {
  const { tables, setTableData } = useTableStore();

  useEffect(() => {
    if (!tables[widgetId]) {
      setTableData(widgetId, defaultTableData);
    }
  }, [tables, widgetId, setTableData, defaultTableData]);

  return tables[widgetId] || defaultTableData;
};

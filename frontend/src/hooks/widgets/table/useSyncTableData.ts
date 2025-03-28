// src/hooks/useSyncTableData.ts
import { useEffect } from 'react';
import { useTableStore } from '../../../stores/useTableStore';
import { usePageTitle } from '../../usePageTitle.ts';

export const useSyncTableData = (widgetId: string) => {
  // Get the table data from the store for the given widgetId.
  const tableData = useTableStore(state => state.tables[widgetId]);
  // Get the page identifier (or title) from the current location.
  const pageId = usePageTitle();

  useEffect(() => {
    if (!tableData) return;

    // Debounce the API call if needed.
    const timeout = setTimeout(() => {
      // Create a unique table id by combining pageId and widgetId.
      const uniqueTableId = `${pageId}_${widgetId}`;

      // Updated payload structure to match the FastAPI endpoint expectations.
      const payload = {
        table_id: uniqueTableId,
        table_data: tableData,
      };

      // Replace the URL with your API endpoint.
      fetch('http://localhost:12850/widgets/tables/save-table', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then(response => response.json())
        .then(data => {
          console.log('Table update pushed successfully:', data);
        })
        .catch(error => {
          console.error('Error pushing table update:', error);
        });
    }, 500); // Adjust debounce delay as needed

    return () => clearTimeout(timeout);
  }, [tableData, widgetId, pageId]);
};

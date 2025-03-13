import React, { useEffect, useState } from 'react';
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
import AddColumnModal from '../modals/tables/AddColumnModal';
import DeleteConfirmationModal from '../modals/tables/DeleteConfirmationModal';
import Dropdown from '../generic/Dropdown';
import { MdClose } from 'react-icons/md';
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

const MIN_COL_WIDTH = 30; // Minimum width in pixels (approx. 3 characters)
const MIN_ROW_HEIGHT = 20; // Minimum row height in pixels

const TableComponent: React.FC<TableComponentProps> = ({ widgetId }) => {
	const { setTableData } = useTableStore();

	// Initialize table data.
	const tableData = useInitializeTable(widgetId, defaultTableData);

	// Inline editing state.
	const { editingCell, setEditingCell, editingValue, setEditingValue } = useEditableCell();

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

	// Resizing state.
	const [columnWidths, setColumnWidths] = useState<number[]>([]);
	const [rowHeights, setRowHeights] = useState<number[]>([]);

	// Initialize column widths: first column is selection (fixed 80px), then each data column gets 150px.
	useEffect(() => {
		const widths = [];
		widths.push(80); // fixed width for selection column
		for (let i = 0; i < tableData.headers.length; i++) {
			widths.push(150);
		}
		setColumnWidths(widths);
	}, [tableData.headers]);

	// Initialize row heights.
	useEffect(() => {
		const heights = tableData.rows.map(() => 40);
		setRowHeights(heights);
	}, [tableData.rows]);

	// Prepare table data.
	const data = React.useMemo(() => {
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

	// Selection column (first column) with fixed width.
	const selectionColumn: ColumnDef<Record<string, string>> = {
		id: 'selection',
		header: () => (
			<div style={{ width: columnWidths[0] }} className="flex items-center">
				<div
					className={`${hoveredColumn === -1 ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
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
				{/* No delete dropdown in header for selection column */}
			</div>
		),
		cell: ({ row }) => (
			<div style={{ width: columnWidths[0] }} className="flex items-center w-max">
				<div
					className={`${hoveredRow === row.index ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
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
				{/* Delete row dropdown – visibility tied to entire row hover */}
				<div
					className={`${hoveredRow === row.index ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 ml-1`}
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
						toggleIcon={<MdClose className="text-lg" />}
					/>
				</div>
			</div>
		),
		size: columnWidths[0],
	};

	// Merge columns.
	const columns: ColumnDef<Record<string, string>>[] = React.useMemo(() => {
		return [selectionColumn, ...dataColumns];
	}, [selectionColumn, dataColumns]);

	// Build the table instance.
	const tableInstance = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	// --- Handle modal confirm for adding a column ---
	const handleConfirmAddColumn = (columnName: string) => {
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
		setIsAddColumnModalOpen(false);
		setSelectedColumns([]);
	};


	// Column resizing handler.
	const handleColumnResize = (colIndex: number, startX: number) => {
		const initialWidth = columnWidths[colIndex + 1]; // +1 because index 0 is selection column
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

	// Row resizing handler.
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

	// Row addition.
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

	// Column addition.
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

	// Delete selected rows/columns (from top menu).
	const handleDeleteSelected = () => {
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
		setSelectedRows([]);
		setSelectedColumns([]);
	};

	// Confirm column deletion.
	const handleConfirmDeleteColumn = () => {
		if (colToDelete !== null) {
			setTableData(widgetId, (prev: TableData) => {
				const newHeaders = prev.headers.filter((_, idx) => idx !== colToDelete);
				const newRows = prev.rows.map((row) => row.filter((_, idx) => idx !== colToDelete));
				return { ...prev, headers: newHeaders, rows: newRows };
			});
			setColToDelete(null);
		}
	};

	// Confirm row deletion.
	const handleConfirmDeleteRow = () => {
		if (rowToDelete !== null) {
			setTableData(widgetId, (prev: TableData) => {
				const newRows = prev.rows.filter((_, idx) => idx !== rowToDelete);
				return { ...prev, rows: newRows };
			});
			setRowToDelete(null);
		}
	};

	// Capture visible rows.
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
			/>
			<div className="h-max overflow-auto scrollbar">
				<table className="min-w-full">
					<thead>
					{tableInstance.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								let colIndex: number | null = null;
								if (header.column.id.startsWith('col')) {
									colIndex = parseInt(header.column.id.replace('col', ''), 10);
								} else if (header.column.id === 'selection') {
									colIndex = -1;
								}
								let headerHighlightClass = "";
								if (colIndex !== null) {
									if (hoveredRow === -1 && hoveredColumn === colIndex) {
										headerHighlightClass = "bg-gray-300 dark:bg-gray-800";
									} else if (hoveredColumn === colIndex || selectedColumns.includes(colIndex)) {
										headerHighlightClass = "bg-gray-300/50 dark:bg-gray-800/50";
									}
								}
								return (
									<th
										key={header.id}
										onMouseEnter={() => {
											if (colIndex !== null) {
												setHoveredRow(-1);
												setHoveredColumn(colIndex);
											}
										}}
										onMouseLeave={() => setHoveredColumn(null)}
										className={`p-1 border-0 ${headerHighlightClass} relative`}
										style={{ width: colIndex === -1 ? columnWidths[0] : columnWidths[colIndex + 1] }}
									>
										{header.isPlaceholder ? null : (
											<div className="flex justify-between items-center">
												<div>
													{flexRender(header.column.columnDef.header, header.getContext()) ||
														<span className="text-gray-400">&nbsp;</span>}
												</div>
												{/* Delete column dropdown (only for non-selection columns) */}
												{header.column.id !== 'selection' && (
													<div
														className={`transition-opacity duration-300 ml-1 ${hoveredColumn === colIndex ? 'opacity-100' : 'opacity-0'}`}
													>
														<Dropdown
															options={[
																{
																	value: 'delete-column',
																	onSelect: () => setColToDelete(colIndex as number),
																	render: () => (
																		<div className="flex items-center">
																			<MdClose className="text-lg" />
																			<span className="ml-1 text-xs">Delete Column</span>
																		</div>
																	),
																},
															]}
															toggleIcon={<MdClose className="text-lg" />}
														/>
													</div>
												)}
												{/* Column resizer handle */}
												{header.column.id !== 'selection' && colIndex !== null && (
													<div
														className="absolute right-0 top-0 h-full w-1 cursor-col-resize opacity-0 hover:opacity-100"
														onMouseDown={(e) => {
															e.preventDefault();
															handleColumnResize(colIndex, e.clientX);
														}}
													/>
												)}
											</div>
										)}
									</th>
								);
							})}
						</tr>
					))}
					</thead>
					<tbody>
					{visibleRows.map((row, rowIdx) => (
						<tr
							key={row.id}
							onMouseEnter={() => setHoveredRow(row.index)}
							onMouseLeave={() => setHoveredRow(null)}
							style={{ height: rowHeights[row.index] ? `${rowHeights[row.index]}px` : 'auto' }}
						>
							{row.getVisibleCells().map((cell, cellIndex) => {
								let colIndex: number | null = null;
								if (cell.column.id.startsWith('col')) {
									colIndex = parseInt(cell.column.id.replace('col', ''), 10);
								}
								let cellHighlightClass = "";
								if (colIndex !== null) {
									if (row.index === hoveredRow && hoveredColumn === colIndex) {
										cellHighlightClass = "bg-gray-300 dark:bg-gray-800";
									} else if (
										row.index === hoveredRow ||
										hoveredColumn === colIndex ||
										selectedRows.includes(row.index) ||
										selectedColumns.includes(colIndex)
									) {
										cellHighlightClass = "bg-gray-300/50 dark:bg-gray-800/50";
									}
								}
								// Compute border classes.
								let borderClasses = "";
								if (cell.column.id === 'selection') {
									borderClasses = "p-1";
								} else {
									borderClasses = "border p-1";
									const visibleCells = row.getVisibleCells();
									const firstActualIndex = visibleCells.findIndex(c => c.column.id !== 'selection');
									const lastActualIndex = visibleCells.length - 1 - [...visibleCells].reverse().findIndex(c => c.column.id !== 'selection');
									if (cellIndex === firstActualIndex) {
										borderClasses += " border-l-0";
									}
									if (cellIndex === lastActualIndex) {
										borderClasses += " border-r-0";
									}
									if (rowIdx === lastRowIdx) {
										borderClasses += " border-b-0";
									}
								}
								return (
									<td
										key={cell.id}
										onMouseEnter={() => {
											if (colIndex !== null) setHoveredColumn(colIndex);
										}}
										onMouseLeave={() => setHoveredColumn(null)}
										className={`${borderClasses} ${cellHighlightClass} relative`}
									>
										{flexRender(cell.column.columnDef.cell, cell.getContext()) || <span className="text-gray-400">&nbsp;</span>}
										{/* Add row resizer in the last cell */}
										{cellIndex === row.getVisibleCells().length - 1 && (
											<div
												className="absolute bottom-0 right-0 h-1 w-full cursor-row-resize opacity-0 hover:opacity-100"
												onMouseDown={(e) => {
													e.preventDefault();
													handleRowResize(row.index, e.clientY);
												}}
											/>
										)}
										{/* (Optional) You could also add a delete-row button here if desired */}
									</td>
								);
							})}
						</tr>
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
		</div>
	);
};

export default TableComponent;

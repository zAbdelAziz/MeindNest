import React from 'react';
import { flexRender } from '@tanstack/react-table';

interface TableRowProps {
	row: any; // Ideally, type this using your table's row type
	rowHeight: number;
	lastRowIdx: number;
	hoveredRow: number | null;
	hoveredColumn: number | null;
	selectedRows: number[];
	selectedColumns: number[];
	setHoveredColumn: (col: number | null) => void;
	setHoveredRow: (row: number | null) => void;
	handleRowResize: (rowIndex: number, startY: number) => void;
}

const TableRow: React.FC<TableRowProps> = ({
											   row,
											   rowHeight,
											   lastRowIdx,
											   hoveredRow,
											   hoveredColumn,
											   selectedRows,
											   selectedColumns,
											   setHoveredColumn,
											   setHoveredRow,
											   handleRowResize,
										   }) => {
	return (
		<tr
			key={row.id}
			onMouseEnter={() => setHoveredRow(row.index)}
			onMouseLeave={() => setHoveredRow(null)}
			style={{ height: rowHeight ? `${rowHeight}px` : 'auto' }}
		>
			{row.getVisibleCells().map((cell: any, cellIndex: number) => {
				let colIndex: number | null = null;
				if (cell.column.id.startsWith('col')) {
					colIndex = parseInt(cell.column.id.replace('col', ''), 10);
				}
				let cellHighlightClass = "";
				if (colIndex !== null) {
					if (row.index === hoveredRow && hoveredColumn === colIndex) {
						cellHighlightClass = "bg-gray-200 dark:bg-gray-800";
					} else if (
						row.index === hoveredRow ||
						hoveredColumn === colIndex ||
						selectedRows.includes(row.index) ||
						selectedColumns.includes(colIndex)
					) {
						cellHighlightClass = "bg-gray-200/50 dark:bg-gray-800/50";
					}
				}
				let borderClasses = "";
				if (cell.column.id === 'selection') {
					borderClasses = "p-1";
				} else {
					borderClasses = "border border-neutral-400 dark:border-neutral-800 p-1";
					const visibleCells = row.getVisibleCells();
					const firstActualIndex = visibleCells.findIndex((c: any) => c.column.id !== 'selection');
					const lastActualIndex =
						visibleCells.length - 1 - [...visibleCells].reverse().findIndex((c: any) => c.column.id !== 'selection');
					if (cellIndex === firstActualIndex) {
						borderClasses += " border-l-0";
					}
					if (cellIndex === lastActualIndex) {
						borderClasses += " border-r-0";
					}
					if (row.index === lastRowIdx) {
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
						{flexRender(cell.column.columnDef.cell, cell.getContext()) || (
							<span className="text-gray-400">&nbsp;</span>
						)}
						{cellIndex === row.getVisibleCells().length - 1 && (
							<div
								className="absolute bottom-0 right-0 h-1 w-full cursor-row-resize opacity-0 hover:opacity-100"
								onMouseDown={(e) => {
									e.preventDefault();
									handleRowResize(row.index, e.clientY);
								}}
							/>
						)}
					</td>
				);
			})}
		</tr>
	);
};

export default TableRow;

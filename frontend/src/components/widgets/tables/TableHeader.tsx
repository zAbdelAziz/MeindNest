import React from 'react';
import { flexRender, HeaderGroup } from '@tanstack/react-table';
import Dropdown from '../../generic/Dropdown';
import { MdClose } from 'react-icons/md';
import { PiDotsThreeVerticalBold } from 'react-icons/pi';

interface TableHeaderProps {
	headerGroups: HeaderGroup<Record<string, string>>[];
	hoveredColumn: number | null;
	hoveredRow: number | null;
	columnWidths: number[];
	selectedColumns: number[];
	setHoveredColumn: (col: number | null) => void;
	setHoveredRow: (row: number | null) => void;
	setColToDelete: (col: number | null) => void;
	handleColumnResize: (colIndex: number, startX: number) => void;
}

const TableHeader: React.FC<TableHeaderProps> = ({
													 headerGroups,
													 hoveredColumn,
													 hoveredRow,
													 columnWidths,
													 selectedColumns,
													 setHoveredColumn,
													 setHoveredRow,
													 setColToDelete,
													 handleColumnResize,
												 }) => {
	return (
		<thead>
		{headerGroups.map((headerGroup) => (
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
							headerHighlightClass = "bg-gray-200 dark:bg-gray-800";
						} else if (hoveredColumn === colIndex || selectedColumns.includes(colIndex)) {
							headerHighlightClass = "bg-gray-200/50 dark:bg-gray-800/50";
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
							style={{ width: colIndex === null ? 'auto' : colIndex === -1 ? columnWidths[0] : columnWidths[colIndex + 1] }}
						>
							{header.isPlaceholder ? null : (
								<div className="flex justify-between items-center">
									<div>
										{flexRender(header.column.columnDef.header, header.getContext()) || (
											<span className="text-gray-400">&nbsp;</span>
										)}
									</div>
									{/* Only add delete dropdown for non-selection columns */}
									{header.column.id !== 'selection' && (
										<div
											className={`transition-opacity duration-300 ml-1 ${
												hoveredColumn === colIndex ? 'opacity-100' : 'opacity-0'
											}`}
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
												toggleIcon={<PiDotsThreeVerticalBold className="text-lg" />}
											/>
										</div>
									)}
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
	);
};

export default TableHeader;

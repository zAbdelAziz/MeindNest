import React from 'react';
import Dropdown from '../../generic/Dropdown';
import { MdAdd, MdClose, MdFileDownload } from 'react-icons/md';
import {
	PiColumnsPlusLeftFill,
	PiColumnsPlusRightFill,
	PiRowsPlusBottomFill,
	PiRowsPlusTopFill,
	PiSigma,
	PiMathOperations
} from 'react-icons/pi';
import {TbMathFunction, TbMathAvg, TbMathMax, TbMathMin, TbLayoutAlignMiddleFilled, TbChartScatter} from "react-icons/tb";
import { FaTimes } from "react-icons/fa";
import { GoNumber } from "react-icons/go";

export interface TableMenuProps {
	selectedRows: number[];
	selectedColumns: number[];
	onDeleteSelected: () => void;
	onAddRowTop: () => void;
	onAddRowBottom: () => void;
	onAddColumnLeft: () => void;
	onAddColumnRight: () => void;
	onExportCSV: () => void;
	onMathOperation: (
		op:
			| 'sum'
			| 'average'
			| 'max'
			| 'min'
			| 'product'
			| 'count'
			| 'median'
			| 'std'
	) => void;
	onOpenFormula: (target: 'row' | 'column') => void;
}

const TableMenu: React.FC<TableMenuProps> = ({
												 selectedRows,
												 selectedColumns,
												 onDeleteSelected,
												 onAddRowTop,
												 onAddRowBottom,
												 onAddColumnLeft,
												 onAddColumnRight,
												 onExportCSV,
												 onMathOperation,
												 onOpenFormula,
											 }) => {
	const hasSelection = selectedRows.length > 0 || selectedColumns.length > 0;

	return (
		<div className="sticky top-0 w-full border-y border-neutral-400 dark:border-neutral-800 flex justify-between bg-neutral-300 dark:bg-neutral-900 mb-1 z-100">
			{/* Selection Actions */}
			<div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
				{hasSelection && (
					<div className="flex m-1">
						<button
							onClick={onDeleteSelected}
							className="hover:bg-gray-300 dark:hover:bg-red-950 focus:outline-none p-1"
						>
							<MdClose className="text-lg" />
						</button>
					</div>
				)}
			</div>

			{/* Static Actions */}
			<div className="flex items-center">


				{/* Formula Dropdown */}
				<Dropdown
					toggleIcon={<TbMathFunction className="text-lg" title="Formula" />}
					options={[
						{
							value: 'applyFormulaRow',
							onSelect: () => onOpenFormula('row'),
							render: () => (
								<div className="flex items-center w-max">
									<span className="ml-1 text-xs">Apply Formula (Row)</span>
								</div>
							),
						},
						{
							value: 'applyFormulaColumn',
							onSelect: () => onOpenFormula('column'),
							render: () => (
								<div className="flex items-center w-max">
									<span className="ml-1 text-xs">Apply Formula (Column)</span>
								</div>
							),
						},
					]}
				/>

				{/* Math Operations Dropdown */}
				<Dropdown
					toggleIcon={<PiMathOperations className="text-xl" title="Math Operations"/>}
					options={[
						{
							value: 'sum',
							onSelect: () => onMathOperation('sum'),
							render: () => (
								<div className="flex items-center w-max" title="Sum">
									<PiSigma className="text-lg" />
									<span className="ml-1 text-xs">Sum</span>
								</div>
							),
						},
						{
							value: 'product',
							onSelect: () => onMathOperation('product'),
							render: () => (
								<div className="flex items-center w-max" title="Product">
									<FaTimes className="text-lg" />
									<span className="ml-1 text-xs">Product</span>
								</div>
							),
						},
						{
							value: 'average',
							onSelect: () => onMathOperation('average'),
							render: () => (
								<div className="flex items-center w-max" title="Avrg.">
									<TbMathAvg className="text-lg" />
									<span className="ml-1 text-xs">Average</span>
								</div>
							),
						},
						{
							value: 'max',
							onSelect: () => onMathOperation('max'),
							render: () => (
								<div className="flex items-center w-max" title="Maximum">
									<TbMathMax className="text-lg" />
									<span className="ml-1 text-xs">Max</span>
								</div>
							),
						},
						{
							value: 'min',
							onSelect: () => onMathOperation('min'),
							render: () => (
								<div className="flex items-center w-max" title="Minimum">
									<TbMathMin className="text-lg" />
									<span className="ml-1 text-xs">Min</span>
								</div>
							),
						},
						{
							value: 'count',
							onSelect: () => onMathOperation('count'),
							render: () => (
								<div className="flex items-center w-max" title="Count">
									<GoNumber className="text-lg" />
									<span className="ml-1 text-xs">Count</span>
								</div>
							),
						},
						{
							value: 'median',
							onSelect: () => onMathOperation('median'),
							render: () => (
								<div className="flex items-center w-max" title="Median">
									<TbLayoutAlignMiddleFilled className="text-lg" />
									<span className="ml-1 text-xs">Median</span>
								</div>
							),
						},
						{
							value: 'std',
							onSelect: () => onMathOperation('std'),
							render: () => (
								<div className="flex items-center w-max" title="Standard Deviation">
									<TbChartScatter className="text-lg" />
									<span className="ml-1 text-xs">Std Dev</span>
								</div>
							),
						},
					]}
				/>

			</div>
			<div className="flex items-center">
				{/* Export CSV */}
				<button
					onClick={onExportCSV}
					className="hover:bg-gray-200 dark:hover:bg-gray-800 focus:outline-none p-1 mr-2"
					title="Export to CSV"
				>
					<MdFileDownload className="text-lg" />
				</button>

				{/* Add Rows/Columns Dropdown */}
				<Dropdown
					toggleIcon={<MdAdd className="text-lg" />}
					options={[
						{
							value: { id: 1, name: 'RowTop', label: 'Row To Top' },
							onSelect: onAddRowTop,
							render: () => (
								<div className="flex items-center w-max" title="Row To Top">
									<PiRowsPlusTopFill className="text-lg" />
									<span className="ml-1 text-xs">Top Row</span>
								</div>
							),
						},
						{
							value: { id: 2, name: 'RowBottom', label: 'Row To Bottom' },
							onSelect: onAddRowBottom,
							render: () => (
								<div className="flex items-center w-max" title="Row To Bottom">
									<PiRowsPlusBottomFill className="text-lg" />
									<span className="ml-1 text-xs">Bottom Row</span>
								</div>
							),
						},
						{
							value: { id: 3, name: 'ColumnToLeft', label: 'Column To Left' },
							onSelect: onAddColumnLeft,
							render: () => (
								<div className="flex items-center w-max">
									<PiColumnsPlusLeftFill className="text-lg" title="Column To Left" />
									<span className="ml-1 text-xs">Left Column</span>
								</div>
							),
						},
						{
							value: { id: 4, name: 'ColumnToRight', label: 'Column To Right' },
							onSelect: onAddColumnRight,
							render: () => (
								<div className="flex items-center w-max">
									<PiColumnsPlusRightFill className="text-lg" title="Column To Right" />
									<span className="ml-1 text-xs">Right Column</span>
								</div>
							),
						},
					]}
				/>
			</div>
		</div>
	);
};

export default TableMenu;

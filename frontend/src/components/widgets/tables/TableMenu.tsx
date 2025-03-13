// src/components/TableMenu.tsx
import React from 'react';
import Dropdown from '../../generic/Dropdown';
import { MdAdd, MdClose } from 'react-icons/md';
import { PiColumnsPlusLeftFill, PiColumnsPlusRightFill, PiRowsPlusBottomFill, PiRowsPlusTopFill } from 'react-icons/pi';

interface TableMenuProps {
  selectedRows: number[];
  selectedColumns: number[];
  onDeleteSelected: () => void;
  onAddRowTop: () => void;
  onAddRowBottom: () => void;
  onAddColumnLeft: () => void;
  onAddColumnRight: () => void;
}

const TableMenu: React.FC<TableMenuProps> = ({
  selectedRows,
  selectedColumns,
  onDeleteSelected,
  onAddRowTop,
  onAddRowBottom,
  onAddColumnLeft,
  onAddColumnRight,
}) => {
  const hasSelection = selectedRows.length > 0 || selectedColumns.length > 0;
  return (
    <div className="sticky top-0 w-full border-y border-gray-500 flex justify-between bg-neutral-300 dark:bg-neutral-900 mb-1 z-100">
      {/* Selection actions */}
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

      {/* Static actions */}
      <div className="">

          {/*Add Rows*/}
        <Dropdown
          toggleIcon={<MdAdd className="text-lg" />}
          options={[
            {
              value: { id: 1, name: 'RowTop', icon: '', label: 'Row To Top' },
              onSelect: onAddRowTop,
              render: () => (
                <div className="flex items-center w-max" title="RowTop">
                  <PiRowsPlusTopFill className="text-lg" title="Row To Top" />
                  <span className="ml-1 text-xs">Top Row</span>
                </div>
              ),
            },
            {
              value: { id: 2, name: 'RowBottom', icon: '', label: 'Row To Bottom' },
              onSelect: onAddRowBottom,
              render: () => (
                <div className="flex items-center w-max" title="RowBottom">
                  <PiRowsPlusBottomFill className="text-lg" title="Row To Bottom" />
                  <span className="ml-1 text-xs">Bottom Row</span>
                </div>
              ),
            },
            {
              value: { id: 3, name: 'ColumnToLeft', icon: '', label: 'Column To Left' },
              onSelect: onAddColumnLeft,
              render: () => (
                <div className="flex items-center w-max">
                  <PiColumnsPlusLeftFill className="text-lg" title="Column To Left" />
                  <span className="ml-1 text-xs">Left Column</span>
                </div>
              ),
            },
            {
              value: { id: 4, name: 'ColumnToRight', icon: '', label: 'Column To Right' },
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

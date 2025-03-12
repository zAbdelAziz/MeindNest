// src/components/TableMenu.tsx
import React from 'react';

import Dropdown from '../../generic/Dropdown';

import {MdAdd, MdClose} from "react-icons/md";
import {PiColumnsPlusLeftFill, PiColumnsPlusRightFill} from "react-icons/pi";


interface TableMenuProps {
  selectedRows: number[];
  selectedColumns: number[];
}

const TableMenu: React.FC<TableMenuProps> = ({ selectedRows, selectedColumns }) => {
  const hasSelection = selectedRows.length > 0 || selectedColumns.length > 0;
  return (
    <div className="w-full flex justify-between">

		{/*Selection*/}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {hasSelection && (
          <div className="flex p-1">
            <button className="hover:bg-gray-300 dark:hover:bg-red-950 focus:outline-none p-1"><MdClose className="text-lg" /></button>
          </div>
        )}
      </div>

		{/*Static*/}
	  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
		  <Dropdown
			toggleIcon={<MdAdd className="text-lg" />}
			options={[
			  {
				value: { id: 1, name: 'RowTop', icon: '', label: 'Row To Top' },
				onSelect: () => addRowTop,
				render: () => (
				  <div className="flex items-center w-max" title="RowTop">
					<PiColumnsPlusLeftFill title="Row To Top" />
					<span className="ml-1 text-xs">Top Row</span>
				  </div>
				),
			  },
				{
				value: { id: 2, name: 'RowBottom', icon: '', label: 'Row To Bottom' },
				onSelect: () => addRowBottom,
				render: () => (
				  <div className="flex items-center w-max" title="RowBottom">
					<PiColumnsPlusLeftFill title="Row To Bottom" />
					<span className="ml-1 text-xs">Bottom Row</span>
				  </div>
				),
			  },
			  {
				value: { id: 3, name: 'ColumnToLeft', icon: '', label: 'Column To Left' },
				onSelect: () => addColumnLeft,
				render: () => (
				  <div className="flex items-center w-max">
					<PiColumnsPlusLeftFill className="text-lg" title="Column To Left" />
					<span className="ml-1 text-xs">Left Column</span>
				  </div>
				),
			  },
				{
				value: { id: 3, name: 'ColumnToRight', icon: '', label: 'Column To Right' },
				onSelect: () => addColumnRight,
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

// Dropdown.tsx
import React from 'react';
import useDropdown, { DropdownOption } from '../../hooks/generic/useDropdown';

interface DropdownProps<T> {
  options: DropdownOption<T>[];
  label?: string;
  mainIcon?: React.ReactNode;
  toggleIcon?: React.ReactNode;
}

function Dropdown<T>({ options, label, mainIcon, toggleIcon }: DropdownProps<T>) {
  const { open, setOpen, selectOption, dropdownRef } = useDropdown<T>(null);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center justify-between w-full p-2  text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-800 focus:outline-none"
      >
        <div className="flex items-center">
          {mainIcon && <span className="mr-2">{mainIcon}</span>}
          <span>{label}</span>
        </div>
        <span>
          {toggleIcon ? (
            toggleIcon
          ) : (
            <svg className="-mr-1 ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </span>
      </button>
      {open && (
        <div className="origin-top-right absolute right-0 mt-2 shadow-lg bg-zinc-200 dark:bg-neutral-800 ring-1 z-50">
          <div className="py-1">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => selectOption(option)}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-200 dark:hover:bg-gray-800"
              >
                {option.render()}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dropdown;

import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import useDropdown, { DropdownOption } from '../../hooks/generic/useDropdown';

interface DropdownProps<T> {
  options: DropdownOption<T>[];
  label?: string;
  mainIcon?: React.ReactNode;
  toggleIcon?: React.ReactNode;
}

function Dropdown<T>({ options, label, mainIcon, toggleIcon }: DropdownProps<T>) {
  // Create a ref for the menu element.
  const menuRef = useRef<HTMLDivElement>(null);
  // Pass the menuRef as an extra ref to be excluded from the outside-click check.
  // @ts-ignore
  const { open, setOpen, selectOption, dropdownRef } = useDropdown<T>(null, [menuRef]);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  useEffect(() => {
    if (open && dropdownRef.current && menuRef.current) {
      const triggerRect = dropdownRef.current.getBoundingClientRect();
      let top = triggerRect.bottom;
      let left = triggerRect.left;
      const menuRect = menuRef.current.getBoundingClientRect();
      if (left + menuRect.width > window.innerWidth) {
        left = window.innerWidth - menuRect.width;
      }
      if (left < 0) {
        left = 0;
      }
      setMenuPosition({ top, left });
    }
  }, [open, dropdownRef]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center justify-between w-full p-2 text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-800 focus:outline-none"
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
      {open &&
        ReactDOM.createPortal(
          <div
            ref={menuRef}
            style={{
              position: 'fixed',
              top: menuPosition.top,
              left: menuPosition.left,
              zIndex: 9999,
            }}
            className="origin-top-right mt-2 shadow-lg bg-zinc-200 dark:bg-neutral-800 ring-1 text-neutral-800 dark:text-neutral-400"
          >
            <div className="py-1">
              {options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => selectOption(option)}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-300 dark:hover:bg-gray-800"
                >
                  {option.render()}
                </button>
              ))}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

export default Dropdown;

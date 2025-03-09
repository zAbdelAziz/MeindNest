// useDropdown.ts
import { useState, useEffect, useRef } from 'react';

export interface DropdownOption<T> {
  value: T;
  onSelect: () => void;
  render: () => React.ReactNode;
}

function useDropdown<T>(initialSelected: DropdownOption<T> | null = null) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<DropdownOption<T> | null>(initialSelected);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Instead of a generic handleSelect, we use selectOption which simply calls the option's own onSelect.
  const selectOption = (option: DropdownOption<T>) => {
    setSelected(option);
    option.onSelect();
    setOpen(false);
  };

  // Close the dropdown when clicking outside of it.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return { open, selected, setOpen, selectOption, dropdownRef };
}

export default useDropdown;

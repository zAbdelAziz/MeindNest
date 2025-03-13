import { useState, useEffect, useRef, RefObject } from 'react';

export interface DropdownOption<T> {
  value: T;
  onSelect: () => void;
  render: () => React.ReactNode;
}

function useDropdown<T>(
  initialSelected: DropdownOption<T> | null = null,
  excludeRefs: RefObject<HTMLElement>[] = []
) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<DropdownOption<T> | null>(initialSelected);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectOption = (option: DropdownOption<T>) => {
    setSelected(option);
    option.onSelect();
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && dropdownRef.current.contains(event.target as Node)) {
        return;
      }
      for (const ref of excludeRefs) {
        if (ref.current && ref.current.contains(event.target as Node)) {
          return;
        }
      }
      setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [excludeRefs]);

  return { open, selected, setOpen, selectOption, dropdownRef };
}

export default useDropdown;

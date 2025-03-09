// src/hooks/useDarkMode.ts
import { useEffect } from 'react';
import { useThemeStore } from '../stores/useThemeStore';

export function useDarkMode() {
  const darkMode = useThemeStore((state) => state.darkMode);
  const toggleDarkMode = useThemeStore((state) => state.toggleDarkMode);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return { darkMode, toggleDarkMode };
}

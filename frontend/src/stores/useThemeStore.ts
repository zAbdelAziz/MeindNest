import {create} from 'zustand';
import { persist } from 'zustand/middleware';

export interface ThemeState {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const useThemeStore = create<ThemeState, [["zustand/persist", ThemeState]]>(
  persist(
    (set) => ({
      darkMode: true,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
    }),
    {
      name: 'theme-store',
    }
  )
);

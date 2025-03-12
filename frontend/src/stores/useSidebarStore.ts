import {create} from 'zustand';
import { sidebarActions } from './sidebarActions';

export interface SidebarState {
  sidebarWidth: number;
  sideBarExpanded: boolean;
  dragging: boolean;
  setSidebarWidth: (width: number) => void;
  toggleSidebarWidth: () => void;
  setDragging: (drag: boolean) => void;
}

const initialState: Omit<SidebarState, 'setSidebarWidth' | 'toggleSidebarWidth' | 'setDragging'> = {
  sidebarWidth: 0,
  sideBarExpanded: true,
  dragging: false,
};


export const useSidebarStore = create<SidebarState>((set, get, api) => ({
  ...initialState,
  ...sidebarActions(set, get, api),
}));

// Remove the third parameter if you don't need it:
export const sidebarActions = (set: any, get: any, api: unknown) => ({

  setSidebarWidth: (width: number) => {
    set({ sidebarWidth: width });
  },
  toggleSidebarWidth: () => {
    console.log(api);
    const { sidebarWidth, sideBarExpanded } = get();
    set({
      sidebarWidth: sidebarWidth === 0 ? 50 : 0,
      sideBarExpanded: !sideBarExpanded,
    });
  },
  setDragging: (drag: boolean) => {
    set({ dragging: drag });
  },
});

import { useEffect } from 'react';
import { useSidebarStore } from '../stores/useSidebarStore';

/**
 * Returns separated mouse event handlers for dragging the sidebar.
 * The functions use the sidebar store to update the state.
 */
export function useSidebarDrag() {
  // Note: We use the getState() function to always get the most up-to-date values
  // inside the event handlers, since these functions may be called outside React’s render cycle.

  function handleMouseDown() {
    useSidebarStore.getState().setDragging(true);
  }

  function handleMouseMove(e: MouseEvent) {
    const { dragging, setSidebarWidth } = useSidebarStore.getState();
    if (!dragging) return;
    // Enforce minimum (50px) and maximum (200px) widths
    const newWidth = Math.min(Math.max(e.clientX, 0), 50);
    setSidebarWidth(newWidth);
  }

  function handleMouseUp() {
    useSidebarStore.getState().setDragging(false);
  }

  // Optionally, you could add an effect inside this hook to automatically attach the events:
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return { handleMouseDown, handleMouseMove, handleMouseUp };
}

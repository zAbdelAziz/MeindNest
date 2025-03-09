// src/App.tsx
import { BrowserRouter as Router } from 'react-router-dom';
import Layout from './components/Layout';
import './assets/css/main.css';
import { useSidebarStore } from './stores/useSidebarStore';
import { useSidebarDrag } from './hooks/useSidebarDrag';

function App() {

  // Get sidebar state and actions from the sidebar store
  const sidebarWidth = useSidebarStore((state) => state.sidebarWidth);
  const sideBarExpanded = useSidebarStore((state) => state.sideBarExpanded);
  const toggleSidebarWidth = useSidebarStore((state) => state.toggleSidebarWidth);

  // Retrieve mouse event handlers from our custom drag hook
  const { handleMouseDown } = useSidebarDrag();

  return (
    <Router>
      <Layout
        sidebarWidth={sidebarWidth}
        handleMouseDown={handleMouseDown}
        toggleSidebarWidth={toggleSidebarWidth}
        sideBarExpanded={sideBarExpanded}
      />
    </Router>
  );
}

export default App;

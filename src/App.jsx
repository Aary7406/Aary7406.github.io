import { useRoutes, useLocation, HashRouter } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { cloneElement } from 'react';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import ScrollToTop from './components/ScrollToTop';

const routes = [
  { path: '/', element: <HomePage /> },
  { path: '/projects', element: <ProjectsPage /> },
];

// useRoutes gives us the matched element; we clone it with a stable key so
// AnimatePresence can track enter/exit between route changes.
function AnimatedRoutes() {
  const location = useLocation();
  const element = useRoutes(routes);
  return (
    <AnimatePresence mode="wait">
      {element && cloneElement(element, { key: location.pathname })}
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <AnimatedRoutes />
    </HashRouter>
  );
}
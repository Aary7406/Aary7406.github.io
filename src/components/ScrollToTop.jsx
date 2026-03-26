// src/components/ScrollToTop.jsx
import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  // useLayoutEffect fires synchronously BEFORE the browser paints,
  // so scroll resets before the user sees anything.
  useLayoutEffect(() => {
    // If Lenis is active on window, destroy it so it doesn't fight us
    if (window.lenis) {
      window.lenis.destroy();
      delete window.lenis;
    }

    // Force-reset every scrollable target
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return null;
}

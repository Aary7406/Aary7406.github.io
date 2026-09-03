// src/components/ScrollToTop.jsx
import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  // useLayoutEffect fires synchronously BEFORE the browser paints,
  // so scroll resets before the user sees anything.
  useLayoutEffect(() => {
    // Safely destroy Lenis if active — wrap in try/catch in case it's
    // already been destroyed or is in a bad state (e.g. during React 19
    // strict-mode double-invoke or fast navigation).
    try {
      if (window.lenis) {
        window.lenis.destroy();
        delete window.lenis;
      }
    } catch (e) {
      delete window.lenis;
    }

    // Force-reset every scrollable target
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    } catch (e) {
      // Ignore scroll reset errors (e.g. in non-browser environments)
    }
  }, [pathname]);

  return null;
}

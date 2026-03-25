// src/pages/ProjectsPage.jsx
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import InnerTransition from '../components/transitions/InnerTransition';

// ── CUSTOMIZABLE ──────────────────────────────────────────────
const ACCENT = '#7dd3fc';
// ──────────────────────────────────────────────────────────────

export default function ProjectsPage() {
  const navigate = useNavigate();

  return (
    <InnerTransition>
      <div className="bg-dark-base text-light-primary min-h-screen flex flex-col items-center justify-center px-6">
        {/* Back button */}
        <motion.button
          onClick={() => navigate('/')}
          className="absolute top-8 left-8 flex items-center gap-2 text-sm font-medium cursor-pointer"
          style={{ color: ACCENT }}
          whileHover={{ x: -4 }}
          aria-label="Go back to home"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </motion.button>

        {/* WIP Banner */}
        <div className="text-center">
          <h1
            className="text-4xl md:text-6xl font-bold mb-6"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            My <span style={{ color: ACCENT }}>Projects</span>
          </h1>
          <div
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full border"
            style={{ borderColor: 'rgba(125, 211, 252, 0.3)', backgroundColor: 'rgba(125, 211, 252, 0.08)' }}
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: ACCENT }} />
              <span className="relative inline-flex rounded-full h-3 w-3" style={{ backgroundColor: ACCENT }} />
            </span>
            <span className="text-light-secondary text-lg font-medium">Work in Progress</span>
          </div>
          <p className="text-light-muted mt-6 max-w-md mx-auto">
            This page is being built. Check back soon for a full showcase of my work.
          </p>
        </div>
      </div>
    </InnerTransition>
  );
}

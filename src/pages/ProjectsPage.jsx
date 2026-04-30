// src/pages/ProjectsPage.jsx
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import InnerTransition from '../components/transitions/InnerTransition';
import ProjectsShader from '../webgl/ProjectsShader';
import './ProjectsPage.css';

// ── CUSTOMIZABLE ──────────────────────────────────────────────
const ACCENT = '#ffeaeaff';

// Images in display order — must match filenames in public/Projects/
const IMAGE_URLS = [
  '/Projects/Lost and found.png',
  '/Projects/Converta.png',
  '/Projects/LightShell.png',
  '/Projects/Xreality.png',
  '/Projects/commitgen.png',
];
// ─────────────────────────────────────────────────────────────

const PROJECTS = [
    {
      title: 'Lost and Found Portal',
      desc:  'A centralized platform to easily report and recover lost items.',
      pills: [{ label: 'Open Source', type: '' }, { label: 'Active', type: 'active' }],
      buttonClass: "lost-found-btn",
      link: "https://lostportal.vercel.app"
    },
  {
    title: 'Converta',
    desc:  'A fast, elegant file conversion utility for everyday workflows.',
    pills: [{ label: 'Open Source', type: '' }, { label: 'Active', type: 'active' }],
    buttonClass: "converta-btn",
    link:"https://github.com/Aary7406/Converta"
  },
  {
    title: 'Lightshell',
    desc:  'A next-generation, high-performance command line environment.',
    pills: [{ label: 'Open Source', type: '' }, { label: 'Upcoming', type: 'upcoming' }],
    buttonClass: "lightshell-btn",
    buttonText: "Coming soon",
    link:"#"
  },
  {
    title: 'Xreality',
    desc:  'Immersive augmented reality experiences pushing the boundaries of the digital realm.',
    pills: [{ label: 'Upcoming', type: 'upcoming' }, { label: 'Closed Source', type: 'closed' }],
    buttonClass: "reality-btn",
    buttonText: "Coming soon",
    link:"#"
  },
  {
    title: 'CommitGen',
    desc:  'An AI-powered commit message generator that crafts clear, concise messages from your code changes.',
    pills: [{ label: 'Closed Source', type: '' }, { label: 'Active', type: 'active' }],
    buttonClass: "commitgen-btn",
    link:"https://commitgencli.vercel.app"
  }
];

export default function ProjectsPage() {
  const navigate          = useNavigate();
  const canvasContainerRef = useRef(null);
  const scrollContentRef   = useRef(null);
  const shaderRef          = useRef(null);

  useEffect(() => {
    // Force scroll to top on mount, as AnimatePresence might preserve previous scroll
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    if (!canvasContainerRef.current || !scrollContentRef.current) return;

    const shader = new ProjectsShader(
      canvasContainerRef.current,
      scrollContentRef.current,
      IMAGE_URLS
    );

    shaderRef.current = shader;

    return () => {
      shaderRef.current?.destroy();
      shaderRef.current = null;
    };
  }, []);

  return (
    <InnerTransition>
      <div className="projects-wrapper">

        {/* Back button — fixed, always above canvas */}
        <motion.button
          onClick={() => navigate('/')}
          className="back-btn"
          style={{ color: ACCENT }}
          whileHover={{ x: -5 }}
          aria-label="Go back to home"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </motion.button>

        {/* WebGL canvas — Three.js appends its <canvas> here */}
        <div ref={canvasContainerRef} className="canvas-container" aria-hidden="true" />

        {/* Scrollable sections — text floats above canvas */}
        <div ref={scrollContentRef} className="scroll-content" style={{ willChange: 'transform' }}>
          {PROJECTS.map((project, i) => (
            <section
              key={project.title}
              className={`project-section${i === PROJECTS.length - 1 ? ' last' : ''}`}
            >
              <div className="project-sticky-content">
                <div className="project-pills">
                  {project.pills.map((pill) => (
                    <span key={pill.label} className={`pill${pill.type ? ` pill-${pill.type}` : ''}`}>
                      {pill.label}
                    </span>
                  ))}
                </div>
                <div className="project-info">
                  <h1>{project.title}</h1>
                  <p>{project.desc}</p>
                  <a
                  href={project.link || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                   className={`project-btn ${project.buttonClass}`}>
                    {project.buttonText || "Check it out"}
                    </a>
                </div>
              </div>
            </section>
          ))}
        </div>

      </div>
    </InnerTransition>
  );
}

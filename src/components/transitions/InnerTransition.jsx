// src/components/transitions/InnerTransition.jsx
// ── CUSTOMIZABLE CONSTANTS ────────────────────────────────────
const TRANSITION_DURATION = 0.8;      // Seconds for slide overlay
const PERSPECTIVE_Y = -150;           // px — how far page moves up on exit
const PERSPECTIVE_SCALE = 0.9;        // Scale on exit (0.9 = 90%)
const EASE = [0.76, 0, 0.24, 1];     // Snappy deceleration bezier
// ──────────────────────────────────────────────────────────────

import { motion } from 'framer-motion';

const anim = (variants) => ({
  initial: 'initial',
  animate: 'enter',
  exit: 'exit',
  variants,
});

// The overlay sweeps UP from off-screen bottom on exit, then is hidden on enter.
const slideVariants = {
  initial: { y: '100%' },
  enter:   { y: '100%', transition: { duration: TRANSITION_DURATION, ease: EASE } },
  exit:    { y: ['100%', '0%'], transition: { duration: TRANSITION_DURATION, ease: EASE } },
};

const perspectiveVariants = {
  initial: { scale: 1, y: 0 },
  enter:   { scale: 1, y: 0, transition: { duration: 0.5, ease: EASE, delay: 0.5 } },
  exit:    { scale: PERSPECTIVE_SCALE, y: PERSPECTIVE_Y, transition: { duration: 0.5, ease: EASE } },
};

const opacityVariants = {
  initial: { opacity: 0 },
  enter:   { opacity: 1, transition: { duration: 0.5, delay: 0.5 } },
  exit:    { opacity: 0, transition: { duration: 0.5 } },
};

// Dark mesh grainy gradient — no canvas, no image, pure CSS + inline SVG filter
const GrainyOverlay = () => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
    }}
  >
    {/* SVG turbulence filter for grain */}
    <svg width="0" height="0" style={{ position: 'absolute' }}>
      <filter id="tt-grain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.65"
          numOctaves="3"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
        <feBlend in="SourceGraphic" mode="multiply" />
      </filter>
    </svg>

    {/* Base dark gradient — deep charcoal with cool-purple and teal mesh tones */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(ellipse 80% 60% at 20% 20%, rgba(30, 20, 60, 0.95) 0%, transparent 70%),
          radial-gradient(ellipse 70% 80% at 80% 80%, rgba(10, 30, 40, 0.9) 0%, transparent 65%),
          radial-gradient(ellipse 100% 100% at 50% 50%, rgba(5, 5, 15, 1) 40%, rgba(10, 10, 25, 1) 100%)
        `,
      }}
    />

    {/* Grain texture layer */}
    <div
      style={{
        position: 'absolute',
        inset: '-50%',
        width: '200%',
        height: '200%',
        opacity: 0.18,
        filter: 'url(#tt-grain)',
        background: 'rgba(200, 200, 220, 0.6)',
      }}
    />
  </div>
);

export default function InnerTransition({ children }) {
  return (
    <>
      {/* Dark mesh grainy overlay that sweeps up on exit */}
      <motion.div
        {...anim(slideVariants)}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 9999,
          pointerEvents: 'none',
          willChange: 'transform',
          // Fallback solid in case gradient renders slowly
          background: '#050510',
        }}
      >
        <GrainyOverlay />
      </motion.div>

      {/* Page content wrapper — perspective scale-down on exit */}
      <motion.div
        {...anim(perspectiveVariants)}
        style={{ transformOrigin: 'bottom center', width: '100%' }}
      >
        <motion.div {...anim(opacityVariants)}>
          {children}
        </motion.div>
      </motion.div>
    </>
  );
}

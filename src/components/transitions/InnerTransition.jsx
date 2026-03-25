// src/components/transitions/InnerTransition.jsx
// ── CUSTOMIZABLE CONSTANTS ────────────────────────────────────
const SLIDE_COLOR = '#7dd3fc';        // Accent cyan — matches portfolio palette
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

const slideVariants = {
  initial: { top: '100%' },
  enter: { top: '100%', transition: { duration: TRANSITION_DURATION, ease: EASE } },
  exit: { top: ['100%', '0%'], transition: { duration: TRANSITION_DURATION, ease: EASE } },
};

const perspectiveVariants = {
  initial: { scale: 1, y: 0 },
  enter: { scale: 1, y: 0, transition: { duration: 0.5, ease: EASE, delay: 0.5 } },
  exit: { scale: PERSPECTIVE_SCALE, y: PERSPECTIVE_Y, transition: { duration: 0.5, ease: EASE } },
};

const opacityVariants = {
  initial: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: 0.5, delay: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.5 } },
};

export default function InnerTransition({ children }) {
  return (
    <>
      {/* Fixed overlay that sweeps across screen on exit — separate from layout flow */}
      <motion.div
        {...anim(slideVariants)}
        style={{
          position: 'fixed',
          top: '100%',
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: SLIDE_COLOR,
          zIndex: 99,
          pointerEvents: 'none',
        }}
      />

      {/* Page content wrapper — NO overflow:hidden, uses transformOrigin for perspective */}
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

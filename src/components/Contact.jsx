import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import catKissGif from '../assets/catkiss.gif';

// Social platform data
const socials = [
  {
    id: 'instagram',
    short: 'IG',
    full: 'Instagram',
    href: 'https://www.instagram.com/aary7406/',
    brandColor: '#E4405F',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    id: 'telegram',
    short: 'TG',
    full: 'Telegram',
    href: 'https://t.me/Jiraiya7406',
    brandColor: '#26A5E4',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12.056 0h-.112zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
  {
    id: 'linkedin',
    short: 'IN',
    full: 'LinkedIn',
    href: 'https://www.linkedin.com/in/aary-hinge-21118b35b/',
    brandColor: '#0A66C2',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    id: 'contra',
    short: 'CO',
    full: 'Contra',
    href: 'https://contra.com/aary_8zunt7b8?referralExperimentNid=DEFAULT_REFERRAL_PROGRAM&referrerUsername=aary_8zunt7b8',
    brandColor: '#FDEE21',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16a3.02 3.02 0 0 1-1.533 1.46 4.592 4.592 0 0 1-.803.28c-.12.03-.24.054-.363.072a4.03 4.03 0 0 1-.562.04H9.693a.848.848 0 0 0-.848.848v2.28c0 .468.38.848.848.848h4.614c.188 0 .374-.012.562-.04.123-.018.243-.042.363-.072.274-.07.544-.162.803-.28a3.02 3.02 0 0 0 1.533-1.46.424.424 0 0 1 .793.208v3.36a.424.424 0 0 1-.424.424H7.063a.424.424 0 0 1-.424-.424V8.376c0-.234.19-.424.424-.424h10c.234 0 .424.19.424.424v-.424a.424.424 0 0 1 .08.208z" />
      </svg>
    ),
  },
  {
    id: 'freelancer',
    short: 'FR',
    full: 'Freelancer',
    href: 'https://www.freelancer.in/u/Aary7406?sb=t',
    brandColor: '#29B2FE',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.819 6.917l-4.478.308 3.357-4.066L14.266 0 8.39 6.862H0l3.543 5.217L0 17.296h5.23l1.13 1.639L9.36 24l2.637-3.877L14.634 24l2.999-5.065 1.13-1.639h5.237l-3.543-5.217 3.543-5.217h-4.181zm-7.182 9.416l-1.578-2.317-1.578 2.317-.862-1.264 2.44-3.585 2.44 3.585-.862 1.264zm2.952-4.336H8.411L6.884 9.8h10.232L15.59 12z" />
      </svg>
    ),
  },
];

// CSS transition duration for the pill expand/shrink (ms)
const PILL_CSS_DURATION = 400;
// Stagger text total duration estimate (ms) — used for sequencing the leave
const STAGGER_EXIT_DURATION = 350;

// Stagger text — letters roll in one by one
const StaggerText = ({ text, className = '' }) => (
  <span className={`inline-flex overflow-hidden ${className}`}>
    {text.split('').map((char, i) => (
      <motion.span
        key={i}
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '-100%', opacity: 0 }}
        transition={{
          duration: 0.25,
          ease: [0.33, 1, 0.68, 1],
          delay: i * 0.025,
        }}
      >
        {char === ' ' ? '\u00A0' : char}
      </motion.span>
    ))}
  </span>
);

// Social pill button — sequenced: CSS expand → stagger in; stagger out → CSS shrink
const SocialPill = ({ social }) => {
  const [expanded, setExpanded] = useState(false);   // CSS class for width
  const [showText, setShowText] = useState(false);    // triggers stagger text
  const enterTimer = useRef(null);
  const leaveTimer = useRef(null);

  const handleEnter = useCallback(() => {
    // Cancel any pending leave
    if (leaveTimer.current) clearTimeout(leaveTimer.current);

    // Step 1: CSS expand the pill
    setExpanded(true);
    // Step 2: After CSS transition finishes, show stagger text
    enterTimer.current = setTimeout(() => {
      setShowText(true);
    }, PILL_CSS_DURATION);
  }, []);

  const handleLeave = useCallback(() => {
    // Cancel any pending enter
    if (enterTimer.current) clearTimeout(enterTimer.current);

    // Step 1: Hide stagger text (triggers exit animation)
    setShowText(false);
    // Step 2: After stagger exit finishes, shrink the pill
    leaveTimer.current = setTimeout(() => {
      setExpanded(false);
    }, STAGGER_EXIT_DURATION);
  }, []);

  return (
    <a
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={`contact-pill ${expanded ? 'contact-pill--expanded' : ''}`}
      style={{
        color: expanded ? social.brandColor : 'rgba(255, 255, 255, 0.85)',
      }}
    >
      {/* Icon */}
      <span className="contact-pill-icon">
        {social.icon}
      </span>

      {/* Text — short or full */}
      <span className="contact-pill-text">
        <AnimatePresence mode="wait" initial={false}>
          {showText ? (
            <StaggerText key="full" text={social.full} />
          ) : (
            <motion.span
              key="short"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
            >
              {social.short}
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </a>
  );
};

// "I always [gif] reply." hover reveal component
const GifRevealText = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <span
      className="inline-flex items-center cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span>I always</span>
      <span
        className="inline-block overflow-hidden align-middle"
        style={{
          width: hovered ? 'clamp(3rem, 6vw, 5rem)' : '0px',
          opacity: hovered ? 1 : 0,
          margin: hovered ? '0 0.3em' : '0',
          transition: 'width 0.5s cubic-bezier(0.33, 1, 0.68, 1), opacity 0.4s ease, margin 0.5s cubic-bezier(0.33, 1, 0.68, 1)',
          verticalAlign: 'middle',
        }}
      >
        <img
          src={catKissGif}
          alt="cat kiss"
          className="rounded-lg"
          style={{
            height: 'clamp(3rem, 6vw, 5rem)',
            width: 'clamp(3rem, 6vw, 5rem)',
            objectFit: 'cover',
          }}
        />
      </span>
      <span>&nbsp;reply.</span>
    </span>
  );
};

const Contact = () => {
  return (
    <section
      id="contact"
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6"
      style={{ backgroundColor: '#DC2626', fontFamily: 'Inter, sans-serif' }}
    >
      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        viewport={{ once: true, amount: 0.3 }}
        className="text-white text-center leading-tight tracking-tight mb-4"
        style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 800,
          fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
        }}
      >
        Feel free to reach out.
        <br />
        <span className="text-white/60">
          <GifRevealText />
        </span>
      </motion.h2>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
        viewport={{ once: true, amount: 0.3 }}
        className="text-lg md:text-xl text-white/60 text-center mb-14 max-w-md"
        style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}
      >
        Got a project in mind? Let's make it happen.
      </motion.p>

      {/* Social pills row */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        viewport={{ once: true, amount: 0.3 }}
        className="flex flex-wrap justify-center gap-3 md:gap-4"
      >
        {socials.map((social) => (
          <SocialPill key={social.id} social={social} />
        ))}
      </motion.div>

      {/* Footer text */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        viewport={{ once: true }}
        className="absolute bottom-6 text-sm text-white/40 text-center"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        © {new Date().getFullYear()} Aary Hinge. Crafted with passion.
      </motion.p>
    </section>
  );
};

export default Contact;
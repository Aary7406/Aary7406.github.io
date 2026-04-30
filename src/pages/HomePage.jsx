// src/pages/HomePage.jsx
import { useEffect, useState, useRef, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import Lenis from 'lenis';
import InnerTransition from '../components/transitions/InnerTransition';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/skills';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
const Services = lazy(() => import('../components/Services'));
const ProjectsSection = lazy(() => import('../components/ProjectsSection'));
const Contact = lazy(() => import('../components/Contact'));

gsap.registerPlugin(ScrollTrigger);

// ── BRIDGE CTA CUSTOMIZATION ─────────────────────────────────
const CTA_TEXT = 'Check Out All My Projects';
const CTA_ACCENT = '#7dd3fc';          // accent-cyan
const CTA_GLOW_COLOR = 'rgba(125, 211, 252, 0.4)';
// ──────────────────────────────────────────────────────────────

const BridgeCTA = () => {
  const navigate = useNavigate();

  return (
    <div className="relative z-10 flex items-center justify-center py-20 md:py-28">
      <motion.button
        onClick={() => navigate('/projects')}
        className="relative px-10 py-5 text-lg font-semibold tracking-widest uppercase rounded-full border-2 cursor-pointer overflow-hidden group bridge-cta-btn"
        style={{
          borderColor: CTA_ACCENT,
          color: CTA_ACCENT,
          backgroundColor: 'transparent',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        aria-label="View all projects"
      >
        {/* Background fill on hover */}
        <span
          className="absolute inset-0 w-0 group-hover:w-full transition-all duration-500 ease-out"
          style={{ backgroundColor: CTA_ACCENT }}
        />
        {/* Text */}
        <span className="relative z-10 group-hover:text-black transition-colors duration-500">
          {CTA_TEXT}
        </span>
      </motion.button>
    </div>
  );
};

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const lenisRef = useRef(null);

  // Lock scroll during loader
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [loading]);

  // Fallback timeout for loader
  useEffect(() => {
    const fallback = setTimeout(() => setLoading(false), 5000);
    return () => clearTimeout(fallback);
  }, []);

  const handleLoaderComplete = () => setLoading(false);

  useEffect(() => {
    if (!loading) {
      const isMobile = window.innerWidth < 768;
      const lenis = new Lenis({
        duration: isMobile ? 0.8 : 1.2,
        easing: isMobile
          ? (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
          : (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
        smoothTouch: isMobile,
        touchMultiplier: isMobile ? 1.5 : 1,
        wheelMultiplier: isMobile ? 1 : 1.2,
        normalizeWheel: !isMobile,
      });

      lenisRef.current = lenis;
      window.lenis = lenis;

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      const sections = document.querySelectorAll('section');
      sections.forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 1, y: 50 },
          {
            opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              end: 'top 30%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      return () => {
        if (lenisRef.current) {
          lenisRef.current.destroy();
          delete window.lenis;
        }
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    }
  }, [loading]);

  return (
    <InnerTransition>
      <div className="bg-dark-base text-light-primary min-h-screen">
        {loading && <Loader onComplete={handleLoaderComplete} />}
        <Navbar />
        <main className="relative">
          <Hero loading={loading} />
          <div className="h-screen" aria-hidden="true" />

          {/* Content that scrolls over hero with shared background */}
          <div className="relative z-10">
            {/* Shared background for About + Skills */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: 'url(/Skills.webp)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed',
                filter: 'blur(10px)',
              }}
            />
            <div className="absolute inset-0 bg-dark-base/70 pointer-events-none" />

            <About />
            <Skills />
            <Suspense fallback={null}>
              <Services />
            </Suspense>
          </div>

          {/* Projects + Bridge CTA + Contact */}
          <div
            className="relative z-5"
            style={{ backgroundColor: '#d64545' }}
          >
            <Suspense fallback={null}>
              <div className="relative z-10">
                <ProjectsSection />
              </div>

              {/* Bridge CTA — floats in the red zone between projects and contact */}
              <BridgeCTA />

              <div className="relative z-10">
                <Contact />
              </div>
            </Suspense>
          </div>
        </main>
      </div>
    </InnerTransition>
  );
}

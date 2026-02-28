import { useEffect, useState, useRef, lazy, Suspense } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/skills';
const Services = lazy(() => import('./components/Services'));
const ProjectsSection = lazy(() => import('./components/ProjectsSection'));
const Contact = lazy(() => import('./components/Contact'));
import Navbar from './components/Navbar';
import Loader from './components/Loader';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

function App() {
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

  // Loader drives its own exit via onComplete; fallback timeout as safety net
  useEffect(() => {
    const fallback = setTimeout(() => setLoading(false), 5000);
    return () => clearTimeout(fallback);
  }, []);

  const handleLoaderComplete = () => setLoading(false);

  useEffect(() => {
    // Initialize simple Lenis only after loading is complete
    if (!loading) {
      // Mobile-optimized Lenis initialization
      const isMobile = window.innerWidth < 768;
      const lenis = new Lenis({
        duration: isMobile ? 0.8 : 1.2,
        easing: isMobile
          ? (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2  // Snappier mobile easing
          : (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),                 // Smooth desktop easing
        smooth: true,
        smoothTouch: isMobile,
        touchMultiplier: isMobile ? 1.5 : 1,
        wheelMultiplier: isMobile ? 1 : 1.2,
        normalizeWheel: !isMobile
      });

      lenisRef.current = lenis;
      window.lenis = lenis;

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);

      // Initialize smooth scroll behavior
      const initSmoothScroll = () => {
        // Setup GSAP ScrollTrigger for smooth scrolling
        const sections = document.querySelectorAll('section');

        sections.forEach((section) => {
          gsap.fromTo(
            section,
            { opacity: 1, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 1.2,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                end: 'top 30%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        });
      };

      initSmoothScroll();

      return () => {
        if (lenisRef.current) {
          lenisRef.current.destroy();
          delete window.lenis;
        }
      };
    }
  }, [loading]);

  return (
    <div className="bg-dark-base text-light-primary min-h-screen">
      {/* Loader overlays everything — panels split apart to reveal the site behind */}
      {loading && <Loader onComplete={handleLoaderComplete} />}

      <Navbar />
      <main className="relative">
        {/* Hero is sticky and stays behind at z-0 */}
        <Hero loading={loading} />
        {/* Spacer to account for sticky hero height */}
        <div className="h-screen" aria-hidden="true" />

        {/* Content that scrolls over hero with shared background */}
        <div className="relative z-10">
          {/* Shared background for About + Skills - single layer, no borders */}
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
          {/* Single dark overlay for entire content area */}
          <div className="absolute inset-0 bg-dark-base/70 pointer-events-none" />

          <About />
          <Skills />
          <Suspense fallback={null}>
            <Services />
          </Suspense>
        </div>

        {/* Pastel red background layer - above Hero (z-5) but below Projects content */}
        <div
          className="relative z-5"
          style={{
            backgroundColor: '#d64545', /* True red - matches SVG curve */
          }}
        >
          {/* Projects section with its own background - z-10 to be above the red bg */}
          <Suspense fallback={null}>
            <div className="relative z-10">
              <ProjectsSection />
            </div>

            {/* Contact section */}
            <div className="relative z-10">
              <Contact />
            </div>
          </Suspense>
        </div>
      </main>
    </div>
  );
}

export default App;
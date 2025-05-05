import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Navbar from './components/Navbar';
import Loader from './components/Loader';
// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

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

    // Initialize animations after the page has loaded
    if (!loading) {
      initSmoothScroll();
    }

    return () => clearTimeout(timer);
  }, [loading]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="bg-ctp-base text-ctp-text min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <footer className="py-6 text-center text-ctp-subtext0">
        <p>© {new Date().getFullYear()} Aary Hinge. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
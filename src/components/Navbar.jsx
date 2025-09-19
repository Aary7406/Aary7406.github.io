// src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' },
  ];

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          setIsScrolled(scrollY > 50);
          
          // Update active section based on scroll position (throttled)
          const sections = navItems.map(item => item.id);
          const currentSection = sections.find(section => {
            const element = document.getElementById(section);
            if (element) {
              const rect = element.getBoundingClientRect();
              // Adjusted for mobile - account for mobile navbar height
              const isMobile = window.innerWidth < 768;
              const offset = isMobile ? 120 : 100;
              return rect.top <= offset && rect.bottom >= offset;
            }
            return false;
          });
          
          if (currentSection) {
            setActiveSection(currentSection);
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Adjust offset for mobile vs desktop
      const isMobile = window.innerWidth < 768;
      const offset = isMobile ? -100 : -80;
      
      // Check if Lenis is available globally
      if (window.lenis) {
        window.lenis.scrollTo(element, { 
          offset: offset,
          duration: isMobile ? 1.0 : 1.2 
        });
      } else {
        // Fallback to native scroll
        window.scrollTo({
          top: element.offsetTop + offset,
          behavior: 'smooth'
        });
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.header 
         className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
          isMobileMenuOpen
            ? `bg-white/5 backdrop-blur-xl rounded-full top-4 ${isScrolled ? 'rounded-full m-4 shadow-lg shadow-ctp-crust/50' : 'shadow-lg shadow-ctp-crust/50'}` // Apply 'bg-ctp-base' or your chosen background when mobile menu is open
            : (isScrolled
              ? 'bg-black/10 backdrop-blur-xl rounded-full m-4 shadow-lg shadow-ctp-crust/50' // Original scrolled state
              : 'bg-transparent') // Original default state
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ 
          duration: 0.5,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
        style={{
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden',
          WebkitPerspective: 1000,
          perspective: 1000
        }}
      >
        <div className="container mx-auto rounded-full px-6 py-4">
          <div className="flex justify-between items-center">
            <motion.div 
              className="text-xl font-display font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-ctp-mauve cursor-pointer">A</span>
              <span className="text-ctp-text cursor-pointer">ary</span>
            </motion.div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  className={`relative px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeSection === item.id ? 'text-ctp-mauve' : 'text-ctp-subtext0 hover:text-ctp-text'
                  }`}
                  onClick={() => scrollToSection(item.id)}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * (index + 1) }}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-ctp-mauve rounded-full mx-2"
                      layoutId="activeSection"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))}
            </nav>
            
            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden text-ctp-text hover:text-ctp-mauve focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ 
                delay: 0.3,
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              whileTap={{ 
                scale: 0.95,
                transition: { duration: 0.1 }
              }}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                ) : (
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 6h16M4 12h16M4 18h16" 
                  />
                )}
              </svg>
            </motion.button>
          </div>
        </div>
      </motion.header>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xl md:hidden pt-20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ 
              duration: 0.4, 
              ease: [0.25, 0.46, 0.45, 0.94] 
            }}
          >
            <nav className="flex flex-col items-center gap-4 p-6">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  className={`py-3 px-6 text-lg font-medium w-full text-center rounded-[69px] transition-colors ${
                    activeSection === item.id 
                      ? 'bg-ctp-mauve/20 text-ctp-mauve' 
                      : 'text-ctp-subtext0 hover:text-ctp-text'
                  }`}
                  onClick={() => scrollToSection(item.id)}
                  initial={{ 
                    opacity: 0, 
                    y: 30,
                    scale: 0.9
                  }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    scale: 1
                  }}
                  exit={{
                    opacity: 0,
                    y: -15,
                    scale: 0.95
                  }}
                  transition={{ 
                    delay: 0.1 + (index * 0.08),
                    duration: 0.5,
                    ease: [0.25, 0.46, 0.45, 0.94],
                    type: "tween"
                  }}
                >
                  {item.label}
                </motion.button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
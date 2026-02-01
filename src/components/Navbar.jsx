// src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
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
          const sections = navItems.map(item => item.id);
          const currentSection = sections.find(section => {
            const element = document.getElementById(section);
            if (element) {
              const rect = element.getBoundingClientRect();
              const offset = 150;
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
      // Scroll exactly to the section top
      const targetPosition = element.getBoundingClientRect().top + window.scrollY;
      
      if (window.lenis) {
        window.lenis.scrollTo(targetPosition, { duration: 1.2 });
      } else {
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    }
    setIsMobileMenuOpen(false);
  };

  // Glassmorphism style object
  const glassStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',    willChange: 'backdrop-filter',
    isolation: 'isolate',  };

  // Framer Motion variants - consistent tween for seamless feel
  const navItemVariants = {
    hidden: { opacity: 0, x: 14 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: [0.33, 1, 0.68, 1], // CSS ease-out equivalent
      },
    }),
    exit: (i) => ({
      opacity: 0,
      x: -8,
      transition: {
        delay: (4 - i) * 0.025,
        duration: 0.2,
        ease: [0.32, 0, 0.67, 0], // CSS ease-in equivalent
      },
    }),
  };

  return (
    <>
      {/* Mobile Header - Shows name pill */}
      <motion.header 
        className="md:hidden fixed top-6 left-6 z-50"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="px-5 py-3 rounded-full" style={glassStyle}>
          <span className="text-light-primary font-display font-bold text-lg">
            Aary<span className="text-accent-cyan">.</span>
          </span>
        </div>
      </motion.header>

      {/* Desktop Navbar - Two Separate Pills */}
      <header 
        className="hidden md:block fixed top-6 left-1/2 z-50 animate-[slideDown_0.6s_ease-out_forwards]"
        style={{ transform: 'translateX(-50%)' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative flex items-center">
          {/* Name Pill */}
          <motion.div 
            className="px-6 py-3 rounded-full relative cursor-pointer"
            style={glassStyle}
            animate={{ x: isHovered ? -100 : 0 }}
            transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
          >
            {/* Glass highlight */}
            <div 
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)' }}
            />
            <span className="text-light-primary font-display font-bold text-lg whitespace-nowrap relative z-10">
              Aary<span className="text-accent-cyan">.</span>
            </span>
          </motion.div>

          {/* Nav Items Pill - Appears on hover, absolutely positioned */}
          <AnimatePresence>
            {isHovered && (
              <motion.nav
                className="absolute left-0 ml-3 px-2 py-2 rounded-full flex items-center"
                style={{ ...glassStyle, transformOrigin: 'left center' }}
                initial={{ opacity: 0, scaleX: 0.8, x: 0 }}
                animate={{ opacity: 1, scaleX: 1, x: 0 }}
                exit={{ opacity: 0, scaleX: 0.9 }}
                transition={{ 
                  duration: 0.35, 
                  ease: [0.33, 1, 0.68, 1],
                }}
              >
              {/* Glass highlight */}
              <div 
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%)' }}
              />
              
              <div className="flex items-center gap-1 relative z-10">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    custom={index}
                    variants={navItemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap 
                      transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)]
                      hover:scale-[1.03] active:scale-[0.97]
                      ${
                        activeSection === item.id 
                          ? 'text-dark-base bg-light-primary' 
                          : 'text-light-secondary hover:text-light-primary hover:bg-white/10'
                      }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      scrollToSection(item.id);
                    }}
                  >
                    {item.label}
                  </motion.button>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
        </div>
      </header>

      {/* Mobile Menu Button */}
      <motion.button
        className="md:hidden fixed top-6 right-6 z-50 p-3 rounded-full"
        style={glassStyle}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 text-light-primary" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          {isMobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </motion.button>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="absolute inset-0 bg-dark-base/90 backdrop-blur-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            <nav className="relative z-10 flex flex-col items-center gap-6">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  className={`text-3xl font-display font-bold transition-colors ${
                    activeSection === item.id 
                      ? 'text-accent-cyan' 
                      : 'text-light-secondary hover:text-light-primary'
                  }`}
                  onClick={() => scrollToSection(item.id)}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ 
                    delay: 0.1 + (index * 0.08),
                    duration: 0.4,
                    ease: [0.25, 0.46, 0.45, 0.94]
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
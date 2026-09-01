import { useEffect, useRef, memo, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faLayerGroup, 
  faCode, 
  faMicrochip, 
  faGauge, 
  faGears, 
  faCubes 
} from '@fortawesome/free-solid-svg-icons';

gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// INFINITE SCROLL SLIDER (Play/Pause + Drag, 120fps optimized)
// ============================================================================
const InfiniteSlider = memo(({ items, speed = 25 }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);
  const containerRef = useRef(null);
  const dragStartX = useRef(0);
  const scrollStartX = useRef(0);

  // Duplicate items for seamless loop
  const duplicatedItems = [...items, ...items];

  // Drag handlers
  const handleDragStart = useCallback((e) => {
    setIsDragging(true);
    setIsPaused(true);
    dragStartX.current = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
    
    const slider = sliderRef.current;
    if (slider) {
      const computedStyle = window.getComputedStyle(slider);
      const matrix = new DOMMatrix(computedStyle.transform);
      scrollStartX.current = matrix.m41;
    }
  }, []);

  const handleDragMove = useCallback((e) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
    const deltaX = clientX - dragStartX.current;
    const slider = sliderRef.current;
    
    if (slider) {
      slider.style.animation = 'none';
      slider.style.transform = `translateX(${scrollStartX.current + deltaX}px)`;
    }
  }, [isDragging]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const slider = sliderRef.current;
    if (slider) {
      // Get current position and normalize it
      const computedStyle = window.getComputedStyle(slider);
      const matrix = new DOMMatrix(computedStyle.transform);
      let currentX = matrix.m41;
      
      // Get half width (loop point)
      const halfWidth = slider.scrollWidth / 2;
      
      // Normalize position within bounds
      while (currentX > 0) currentX -= halfWidth;
      while (currentX < -halfWidth) currentX += halfWidth;
      
      // Resume animation from current position
      const progress = Math.abs(currentX) / halfWidth;
      slider.style.transform = '';
      slider.style.animation = `scroll ${speed}s linear infinite`;
      slider.style.animationDelay = `-${progress * speed}s`;
    }
    
    // Small delay before resuming auto-scroll
    setTimeout(() => setIsPaused(false), 100);
  }, [isDragging, speed]);

  // Attach global listeners for drag
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleDragMove, { passive: false });
      window.addEventListener('touchend', handleDragEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  // Generate slider content JSX for reuse
  const sliderContent = (
    <div
      ref={sliderRef}
      className="flex gap-4 md:gap-5 will-change-transform py-2"
      style={{
        animation: `scroll ${speed}s linear infinite`,
        animationPlayState: isPaused ? 'paused' : 'running',
      }}
    >
      {duplicatedItems.map((item, index) => (
        <div
          key={`${item.name}-${index}`}
          className="flex-shrink-0 group"
        >
          <div className="relative">
            {/* Glow on hover */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-cyan via-accent-magenta to-accent-lime rounded-full opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300" />
            
            {/* Pill-shaped chip - glass effect blending with bg */}
            <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-5 py-2.5 flex items-center gap-3 transition-all duration-300 group-hover:border-white/20 group-hover:bg-white/10">
              <span className="text-accent-cyan/80 text-lg">{item.icon}</span>
              <span className="text-light-tertiary font-medium text-sm whitespace-nowrap group-hover:text-light-secondary">{item.name}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div 
      ref={containerRef}
      className="relative w-full overflow-hidden cursor-grab active:cursor-grabbing select-none rounded-full"
      onMouseEnter={() => !isDragging && setIsPaused(true)}
      onMouseLeave={() => !isDragging && setIsPaused(false)}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
    >
      {/* Sharp base layer - the actual content */}
      {sliderContent}
      
      {/* Progressive Vector Blur Mask Layer */}
      {/* Uses backdrop-filter with gradient mask for mathematically smooth blur transition */}
      {/* Mask gradient: solid at edges (blur visible) → transparent center (sharp visible) */}
      {/* The mask uses eased gradients for smoother perceptual falloff */}
      <div 
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          /* 
           * Progressive mask using multiple color stops for smooth easing:
           * Left edge:  0-40px solid blur, 40-150px fade to transparent
           * Right edge: calc(100%-150px) to calc(100%-40px) fade, calc(100%-40px) to 100% solid blur
           * Uses cubic-bezier-like stop distribution for perceptual smoothness
           */
          WebkitMaskImage: `linear-gradient(
            90deg,
            rgba(0,0,0,1) 0px,
            rgba(0,0,0,1) 30px,
            rgba(0,0,0,0.8) 50px,
            rgba(0,0,0,0.5) 80px,
            rgba(0,0,0,0.2) 120px,
            rgba(0,0,0,0) 160px,
            rgba(0,0,0,0) calc(100% - 160px),
            rgba(0,0,0,0.2) calc(100% - 120px),
            rgba(0,0,0,0.5) calc(100% - 80px),
            rgba(0,0,0,0.8) calc(100% - 50px),
            rgba(0,0,0,1) calc(100% - 30px),
            rgba(0,0,0,1) 100%
          )`,
          maskImage: `linear-gradient(
            90deg,
            rgba(0,0,0,1) 0px,
            rgba(0,0,0,1) 30px,
            rgba(0,0,0,0.8) 50px,
            rgba(0,0,0,0.5) 80px,
            rgba(0,0,0,0.2) 120px,
            rgba(0,0,0,0) 160px,
            rgba(0,0,0,0) calc(100% - 160px),
            rgba(0,0,0,0.2) calc(100% - 120px),
            rgba(0,0,0,0.5) calc(100% - 80px),
            rgba(0,0,0,0.8) calc(100% - 50px),
            rgba(0,0,0,1) calc(100% - 30px),
            rgba(0,0,0,1) 100%
          )`,
        }}
      />
      
      {/* CSS Animation */}
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
});

InfiniteSlider.displayName = 'InfiniteSlider';

// ============================================================================
// STAGGERED TEXT (Simplified, CSS-driven)
// ============================================================================
const StaggeredText = memo(({ text, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-30px' });

  return (
    <span
      ref={ref}
      className="inline-block overflow-hidden"
      style={{ perspective: '500px' }}
    >
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="inline-block will-change-transform"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? 'translateY(0) rotateX(0)' : 'translateY(100%) rotateX(-80deg)',
            transition: `all 0.5s cubic-bezier(0.33, 1, 0.68, 1) ${delay + i * 0.025}s`,
            transformOrigin: 'bottom',
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
});

StaggeredText.displayName = 'StaggeredText';

// ============================================================================
// FLOATING PARAGRAPH (Scroll-based reversible)
// ============================================================================
const FloatingParagraph = memo(({ children, delay = 0, scrollProgress }) => {
  // Stagger based on delay prop
  const start = 0.1 + delay;
  const end = 0.35 + delay;
  
  const opacity = useTransform(scrollProgress, [start, end], [0, 1]);
  const y = useTransform(scrollProgress, [start, end], [30, 0]);
  const blur = useTransform(scrollProgress, [start, end], [6, 0]);

  return (
    <motion.p
      style={{
        opacity,
        y,
        filter: useTransform(blur, (v) => `blur(${v}px)`),
      }}
      className="text-light-tertiary text-base md:text-lg leading-relaxed will-change-[transform,opacity,filter]"
    >
      {children}
    </motion.p>
  );
});

FloatingParagraph.displayName = 'FloatingParagraph';

// ============================================================================
// SKILLS DATA (Font Awesome SVG icons)
// ============================================================================
const skills = [
  { name: 'Full Stack Development', icon: <FontAwesomeIcon icon={faLayerGroup} /> },
  { name: 'C++ Development', icon: <FontAwesomeIcon icon={faCode} /> },
  { name: 'Kernel Tuning', icon: <FontAwesomeIcon icon={faMicrochip} /> },
  { name: 'OS Optimization', icon: <FontAwesomeIcon icon={faGauge} /> },
  { name: 'DevOps', icon: <FontAwesomeIcon icon={faGears} /> },
  { name: 'System Architecture', icon: <FontAwesomeIcon icon={faCubes} /> },
];

// ============================================================================
// MAIN ABOUT COMPONENT
// ============================================================================
const About = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const pfpRef = useRef(null);
  const bioRef = useRef(null);

  // Scroll progress for bio section - reversible stagger effects
  const { scrollYProgress: bioScrollProgress } = useScroll({
    target: bioRef,
    offset: ['start 0.9', 'start 0.3'],
  });

  // Magnetic PFP effect with RAF for 120fps
  useEffect(() => {
    const pfp = pfpRef.current;
    if (!pfp) return;

    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let rafId = null;

    const lerp = (start, end, factor) => start + (end - start) * factor;

    const animate = () => {
      currentX = lerp(currentX, targetX, 0.1);
      currentY = lerp(currentY, targetY, 0.1);
      
      if (Math.abs(currentX - targetX) > 0.01 || Math.abs(currentY - targetY) > 0.01) {
        pfp.style.transform = `translate(${currentX}px, ${currentY}px)`;
        rafId = requestAnimationFrame(animate);
      } else {
        pfp.style.transform = `translate(${targetX}px, ${targetY}px)`;
        rafId = null;
      }
    };

    const handleMouseMove = (e) => {
      const rect = pfp.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      targetX = (e.clientX - centerX) * 0.15;
      targetY = (e.clientY - centerY) * 0.15;
      
      if (!rafId) rafId = requestAnimationFrame(animate);
    };

    const handleMouseLeave = () => {
      targetX = 0;
      targetY = 0;
      if (!rafId) rafId = requestAnimationFrame(animate);
    };

    pfp.addEventListener('mousemove', handleMouseMove);
    pfp.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      pfp.removeEventListener('mousemove', handleMouseMove);
      pfp.removeEventListener('mouseleave', handleMouseLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative min-h-screen py-24 md:py-32 overflow-hidden"
    >
      <div className="relative z-10 container mx-auto px-6 md:px-8">
        
        {/* HEADING */}
        <div ref={headingRef} className="text-center mb-16 md:mb-20">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-4">
            <span className="text-gradient">About</span>
            <span className="text-light-primary"> Me</span>
          </h2>
          <div className="w-20 h-0.5 bg-gradient-to-r from-accent-cyan via-accent-magenta to-accent-lime rounded-full mx-auto" />
        </div>

        {/* PROFILE + BIO GRID */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-5xl mx-auto">
          
          {/* LEFT: Profile */}
          <div className="flex flex-col items-center lg:items-start space-y-6">
            
            {/* Magnetic PFP with JS cursor-following */}
            <div
              ref={pfpRef}
              className="relative cursor-pointer group will-change-transform"
            >
              <div 
                className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-accent-cyan via-accent-magenta to-accent-lime animate-spin-slow transition-opacity duration-300 group-hover:opacity-80"
                style={{ opacity: 0.5 }}
              />
              <div className="absolute -inset-0.5 rounded-full bg-dark-base" />
              <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden border border-dark-elevated">
                <img
                  src="https://github.com/Aary7406.png"
                  alt="Aary Hinge"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>

            {/* Name */}
            <div className="text-center lg:text-left">
              <h3 className="text-2xl md:text-3xl font-display font-bold text-light-primary mb-1">
                <StaggeredText text="Aary Hinge" delay={0.2} />
              </h3>
              <p className="text-light-muted">Developer & System Enthusiast</p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-center">
              <div>
                <div className="text-xl md:text-2xl font-bold text-accent-cyan">CS</div>
                <div className="text-light-muted text-xs">Bachelor's</div>
              </div>
              <div className="w-px h-8 bg-glass-border hidden sm:block" />
              <div>
                <div className="text-xl md:text-2xl font-bold text-accent-magenta">CTO</div>
                <div className="text-light-muted text-xs">@ SLV Agency</div>
              </div>
              <div className="w-px h-8 bg-glass-border hidden sm:block" />
              <div>
                <div className="text-xl md:text-2xl font-bold text-accent-lime">∞</div>
                <div className="text-light-muted text-xs">Curiosity</div>
              </div>
              <div className="w-px h-8 bg-glass-border hidden sm:block" />
              <div>
                <div className="text-xl md:text-2xl font-bold text-accent-yellow">24/7</div>
                <div className="text-light-muted text-xs">Learning</div>
              </div>
            </div>
          </div>

          {/* RIGHT: Bio */}
          <div ref={bioRef} className="space-y-5">
            <FloatingParagraph delay={0} scrollProgress={bioScrollProgress}>
              I'm a <span className="text-accent-cyan font-medium">Computer Science student</span> and 
              <span className="text-accent-magenta font-medium"> CTO at SLV</span>, with a passion 
              for understanding systems — from web applications down to kernel-level optimizations.
            </FloatingParagraph>

            <FloatingParagraph delay={0.1} scrollProgress={bioScrollProgress}>
              My work spans <span className="text-accent-magenta font-medium">full-stack development</span> and 
              <span className="text-accent-lime font-medium"> low-level C++</span> where performance is measured in microseconds.
            </FloatingParagraph>

            <FloatingParagraph delay={0.2} scrollProgress={bioScrollProgress}>
              I'm fascinated by <span className="text-accent-cyan font-medium">OS internals</span>, kernel tuning, 
              and DevOps practices that bridge development and infrastructure.
            </FloatingParagraph>
          </div>
        </div>

        {/* SKILLS */}
        <div className="mt-20 md:mt-24">
          <div className="text-center mb-10">
            <h3 className="text-xl md:text-2xl font-display font-bold mb-2">
              <span className="text-light-primary">What I </span>
              <span className="text-gradient">Do</span>
            </h3>
          </div>

          {/* Infinite scroll slider - 22s for 20% faster */}
          <InfiniteSlider items={skills} speed={22} />
        </div>
      </div>
    </section>
  );
};

export default About;
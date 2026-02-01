import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Loader = () => {
  const loaderRef = useRef(null);
  const textRef = useRef(null);
  const dotsRef = useRef([]);

  useEffect(() => {
    const tl = gsap.timeline();
    
    // Animate the text
    tl.to(textRef.current, {
      duration: 1,
      y: 0,
      opacity: 1,
      ease: "power4.out"
    });
    
    // Animate dots in sequence
    dotsRef.current.forEach((dot, index) => {
      gsap.to(dot, {
        scale: 1.5,
        opacity: 1,
        duration: 0.6,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        delay: index * 0.15
      });
    });
    
    return () => {
      tl.kill();
      dotsRef.current.forEach(dot => gsap.killTweensOf(dot));
    };
  }, []);

  const addDotRef = (el) => {
    if (el && !dotsRef.current.includes(el)) {
      dotsRef.current.push(el);
    }
  };

  return (
    <div 
      ref={loaderRef}
      className="fixed inset-0 flex flex-col items-center justify-center bg-dark-base z-50"
    >
      <div className="flex flex-col items-center">
        <h1 
          ref={textRef}
          className="font-display text-5xl md:text-7xl font-bold text-light-primary opacity-0 transform translate-y-8"
        >
          Aary<span className="text-accent-cyan">.</span>
        </h1>
        
        <div className="flex mt-10 space-x-2">
          <div
            ref={addDotRef}
            className="w-2 h-2 rounded-full bg-accent-cyan opacity-30 transform scale-75"
          />
          <div
            ref={addDotRef}
            className="w-2 h-2 rounded-full bg-accent-magenta opacity-30 transform scale-75"
          />
          <div
            ref={addDotRef}
            className="w-2 h-2 rounded-full bg-accent-lime opacity-30 transform scale-75"
          />
        </div>
      </div>
    </div>
  );
};

export default Loader;

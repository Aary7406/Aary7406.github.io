import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Loader = () => {
  const loaderRef = useRef(null);
  const textRef = useRef(null);
  const circlesRef = useRef([]);

  useEffect(() => {
    const tl = gsap.timeline();
    
    // Animate the text
    tl.to(textRef.current, {
      duration: 1.5,
      y: 0,
      opacity: 1,
      ease: "power3.out"
    });
    
    // Animate circles
    circlesRef.current.forEach((circle, index) => {
      tl.to(circle, {
        scale: 1.2,
        opacity: 1,
        duration: 0.5,
        ease: "power1.inOut",
        yoyo: true,
        repeat: 1,
        delay: index * 0.2
      }, "-=0.4");
    });
    
    return () => {
      tl.kill();
    };
  }, []);

  const addCircleRef = (el) => {
    if (el && !circlesRef.current.includes(el)) {
      circlesRef.current.push(el);
    }
  };

  return (
    <div 
      ref={loaderRef}
      className="fixed inset-0 flex flex-col items-center justify-center bg-ctp-base z-50"
    >
      <div className="flex flex-col items-center">
        <h1 
          ref={textRef}
          className="font-display text-4xl md:text-6xl text-ctp-mauve opacity-0 transform translate-y-8"
        >
          Aary Hinge
        </h1>
        
        <div className="flex mt-8 space-x-3">
          <div
            ref={addCircleRef}
            className="w-4 h-4 rounded-full bg-ctp-rosewater opacity-20 transform scale-0"
          />
          <div
            ref={addCircleRef}
            className="w-4 h-4 rounded-full bg-ctp-mauve opacity-20 transform scale-0"
          />
          <div
            ref={addCircleRef}
            className="w-4 h-4 rounded-full bg-ctp-blue opacity-20 transform scale-0"
          />
          <div
            ref={addCircleRef}
            className="w-4 h-4 rounded-full bg-ctp-teal opacity-20 transform scale-0"
          />
          <div
            ref={addCircleRef}
            className="w-4 h-4 rounded-full bg-ctp-green opacity-20 transform scale-0"
          />
        </div>
      </div>
      
      <p className="mt-6 text-ctp-subtext0 animate-pulse">Loading Portfolio...</p>
    </div>
  );
};

export default Loader;

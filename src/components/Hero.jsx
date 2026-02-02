import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PixelDistortionText from './PixelDistortionText';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const heroRef = useRef(null);
  const subtitleRef = useRef(null);

  useEffect(() => {
    // Main timeline for hero animations
    const tl = gsap.timeline({ delay: 0.5 });

    tl.fromTo(
      subtitleRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
      '+=0.3'
    );

    // Parallax scroll effect
    gsap.to(heroRef.current, {
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
      y: 150,
      opacity: 0.3,
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Background Image with Dark Overlay and Blur */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/background.jpeg)',
            filter: 'blur(4px)',
            transform: 'scale(1.08)',
          }}
        />
        {/* Dark overlay for AMOLED-like darkness */}
        <div className="absolute inset-0 bg-black/75" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-6 md:px-8">
        <div className="max-w-6xl mx-auto text-center">
          {/* Main Name - Pixel Distortion Shader Text */}
          <div className="mb-6">
            <PixelDistortionText text="Aary.Hinge" />
          </div>

          {/* Subtitle */}
          <p 
            ref={subtitleRef}
            className="text-2xl md:text-3xl lg:text-4xl text-light-secondary max-w-2xl mx-auto"
            style={{ fontFamily: 'Caveat, cursive' }}
          >
            hey there! i turn <span className="text-accent-cyan">ideas</span> into{' '}
            <span className="text-accent-magenta">reality</span> — one line at a time ✨
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;

import { useEffect, useRef, Suspense, lazy } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
const PixelDistortionText = lazy(() => import('./PixelDistortionText'));

gsap.registerPlugin(ScrollTrigger);

const Hero = ({ loading = false }) => {
  const heroRef = useRef(null);
  const heroContentRef = useRef(null);
  const subtitleRef = useRef(null);

  // Delay hero entrance animation until loader finishes
  useEffect(() => {
    if (loading) return; // Don't animate while loader is showing

    // Main timeline for hero animations
    const tl = gsap.timeline({ delay: 0.3 });

    tl.fromTo(
      subtitleRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
      '+=0.2'
    );

    // Scale down effect as user scrolls - hero stays sticky, content scales
    gsap.to(heroContentRef.current, {
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5,
      },
      scale: 0.75,
      opacity: 0,
      ease: 'none',
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [loading]);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="sticky top-0 h-screen flex items-center justify-center overflow-hidden bg-black z-0"
    >
      {/* Background Image with Dark Overlay and Blur */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/background.webp)',
            filter: 'blur(4px)',
            transform: 'scale(1.08)',
          }}
        />
        {/* Dark overlay for AMOLED-like darkness */}
        <div className="absolute inset-0 bg-black/75" />
      </div>

      {/* Content Container */}
      <div ref={heroContentRef} className="relative z-10 container mx-auto px-6 md:px-8 will-change-transform">
        <div className="max-w-6xl mx-auto text-center">
          {/* Main Name - Pixel Distortion Shader Text */}
          <div className="mb-6">
            <Suspense fallback={<div className="w-full h-64 md:h-80 lg:h-96" style={{ minHeight: '280px' }} />}>
              <PixelDistortionText text="Aary.Hinge" />
            </Suspense>
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

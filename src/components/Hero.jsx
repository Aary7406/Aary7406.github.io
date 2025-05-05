import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
const Hero = () => {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const shapesRef = useRef([]);

  useEffect(() => {
    const shapes = shapesRef.current;

    // Initial animations with adjusted durations and easing
    const tl = gsap.timeline({ delay: 0.3 });

    tl.fromTo(
      titleRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'power2.out' }
    )
      .fromTo(
        subtitleRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power2.out' },
        '-=0.8'
      )
      .fromTo(
        ctaRef.current,
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
        '-=0.6'
      )
      .fromTo(
        shapes,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 0.9,
          duration: 1.2,
          stagger: 0.15,
          ease: 'elastic.out(1, 0.4)',
        },
        '-=0.7'
      );

    // Refactored floating animation for shapes with smoother fixed values
    shapes.forEach((shape, index) => {
      const delay = index * 0.3;
      gsap.to(shape, {
        y: 15,
        x: 15,
        rotation: 10,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: delay,
      });
      gsap.to(shape, {
        y: -15,
        x: -15,
        rotation: -10,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: delay + 2,
      });
    });

    // Setup GSAP ScrollTrigger for parallax effect with opacity fade to 0.7 instead of 0.5
    gsap.to(heroRef.current, {
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
      y: 200,
      opacity: 0.7,
    });

    // Replace waving hand ScrollTimeline animation with GSAP animation fallback
    const hand = document.querySelector('.wave-hand');
    if (hand) {
      hand.classList.remove('animate-wave');
      gsap.to(hand, {
        rotation: 14,
        duration: 0.3,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        transformOrigin: '70% 70%',
      });
    }

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      shapes.forEach((shape) => gsap.killTweensOf(shape));
      if (hand) gsap.killTweensOf(hand);
    };
  }, []);

  const addShapeRef = (el) => {
    if (el && !shapesRef.current.includes(el)) {
      shapesRef.current.push(el);
    }
  };

  const scrollToAbout = (e) => {
    e.preventDefault();
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
      window.scrollTo({
        top: aboutSection.offsetTop - 70,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Decorative shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          ref={addShapeRef}
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-ctp-mauve opacity-10 rounded-full blur-2xl"
        ></div>
        <div
          ref={addShapeRef}
          className="absolute top-1/3 right-1/4 w-40 h-40 bg-ctp-sapphire opacity-10 rounded-full blur-3xl"
        ></div>
        <div
          ref={addShapeRef}
          className="absolute bottom-1/4 left-1/3 w-36 h-36 bg-ctp-pink opacity-10 rounded-full blur-2xl"
        ></div>
        <div
          ref={addShapeRef}
          className="absolute bottom-1/3 right-1/3 w-28 h-28 bg-ctp-teal opacity-10 rounded-full blur-xl"
        ></div>
      </div>

      <div className="container mx-auto px-4 md:px-8 z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 ref={titleRef} className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6">
            <span className="text-ctp-text">Hey there</span>{' '}
            <span className="wave-hand inline-block ml-2">👋</span>
            <br />
            <span className="text-ctp-mauve">I'm Aary Hinge</span>
          </h1>

          <h2 ref={subtitleRef} className="text-xl md:text-2xl text-ctp-subtext1 mb-8">
            Computer Science Student & Aspiring Developer
          </h2>

          <div ref={ctaRef} className="flex justify-center space-x-4">
            <a
              href="#about"
              onClick={scrollToAbout}
              className="px-6 py-3 bg-ctp-mauve text-ctp-crust font-medium rounded-lg hover:bg-ctp-pink transition-colors duration-300"
            >
              About Me
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                const contactSection = document.querySelector('#contact');
                if (contactSection) {
                  window.scrollTo({
                    top: contactSection.offsetTop - 70,
                    behavior: 'smooth',
                  });
                }
              }}
              className="px-6 py-3 border border-ctp-mauve text-ctp-mauve font-medium rounded-lg hover:bg-ctp-mauve hover:bg-opacity-10 transition-colors duration-300"
            >
              Get In Touch
            </a>
          </div>

          <div className="mt-16">
            <div className="animate-bounce">
              <svg
                className="w-6 h-6 mx-auto text-ctp-subtext0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

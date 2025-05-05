import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const contentRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 15;
      const rotateY = (centerX - x) / 15;

      card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale3d(1.05, 1.05, 1.05)';
      card.style.boxShadow = rotateY / 5 + 'px ' + rotateX / 5 + 'px 20px rgba(24, 25, 38, 0.5), 0 4px 20px rgba(103, 92, 194, 0.3)';
    };

    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      card.style.boxShadow = '0 4px 20px rgba(103, 92, 194, 0.2)';
    };

    if (card) {
      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);
    }

    // MODIFIED SCROLLTRIGGER - Changed the toggleActions and end point
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        end: 'bottom 20%', // Changed from 'center center' to 'bottom 20%'
        toggleActions: 'play none none none', // Changed from 'play reverse play reverse'
        // This means: play animation when entering, and don't reverse it when scrolling past
      },
    });

    tl.fromTo(
      headingRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
    )
      .fromTo(
        contentRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: 'power2.out' },
        '-=0.6'
      )
      .fromTo(
        cardRef.current,
        { opacity: 0, scale: 0.85 },
        { opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.7)' },
        '-=0.4'
      );

    // The parallax effect for the background remains unchanged
    gsap.fromTo(
      sectionRef.current.querySelector('.bg-gradient'),
      { y: '-10%' },
      {
        y: '10%',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );

    return () => {
      if (card) {
        card.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('mouseleave', handleMouseLeave);
      }
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section id="about" ref={sectionRef} className="relative py-20 md:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="bg-gradient absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-ctp-mauve opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-1/2 h-1/2 bg-ctp-blue opacity-5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 md:px-8">
        <h2 ref={headingRef} className="text-3xl md:text-4xl font-display font-bold text-center mb-16">
          <span className="text-ctp-mauve">About</span> Me
        </h2>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div ref={contentRef} className="space-y-6">
            <p className="text-ctp-text">
              Hello! I'm <span className="text-ctp-mauve font-semibold">Aary Hinge</span>, a passionate Computer Science student pursuing a Bachelor's degree. I'm enthusiastic about building innovative and user-friendly web applications.
            </p>

            <p className="text-ctp-subtext1">
              My journey in programming has equipped me with a versatile skill set spanning front-end and back-end technologies. I enjoy solving complex problems and continuously expanding my knowledge in the rapidly evolving tech landscape.
            </p>

            <p className="text-ctp-subtext1">
              I'm particularly interested in web development and database management, with experience in modern frameworks and tools that help create efficient and scalable applications.
            </p>

            <div className="pt-4">
              <h3 className="text-ctp-sapphire font-medium mb-3">Education</h3>
              <div className="pl-4 border-l-2 border-ctp-surface1">
                <p className="text-ctp-text font-medium">Bachelor of Computer Science</p>
                <p className="text-ctp-subtext0 text-sm">Currently Pursuing</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div
              ref={cardRef}
              className="bg-ctp-surface0 p-6 rounded-2xl border border-ctp-surface2 transition-all duration-300"
              style={{ transformStyle: 'preserve-3d', boxShadow: '0 4px 20px rgba(103, 92, 194, 0.2)' }}
            >
              <div className="text-center space-y-6">
                <div className="inline-block rounded-full p-1 bg-gradient-to-r from-ctp-mauve to-ctp-blue">
                  <div className="w-32 h-32 bg-ctp-surface0 rounded-full flex items-center justify-center">
                    <span className="text-4xl">👨‍💻</span>
                  </div>
                </div>

                <h3 className="text-xl font-display font-semibold text-ctp-mauve">Developer Skills</h3>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-ctp-surface1 rounded-lg p-3">
                    <p className="text-ctp-teal font-medium">Frontend</p>
                    <p className="text-ctp-subtext1">React, HTML, CSS, JavaScript</p>
                  </div>

                  <div className="bg-ctp-surface1 rounded-lg p-3">
                    <p className="text-ctp-blue font-medium">Backend</p>
                    <p className="text-ctp-subtext1">Node.js, Express.js, MongoDB</p>
                  </div>

                  <div className="bg-ctp-surface1 rounded-lg p-3">
                    <p className="text-ctp-peach font-medium">Languages</p>
                    <p className="text-ctp-subtext1">JavaScript, C/C++, Python, Bash</p>
                  </div>

                  <div className="bg-ctp-surface1 rounded-lg p-3">
                    <p className="text-ctp-green font-medium">Tools</p>
                    <p className="text-ctp-subtext1">Git, VSCode, Terminal</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
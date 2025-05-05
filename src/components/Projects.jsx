import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const projectsRef = useRef(null);
  
  // Sample project items - these can be updated with real projects later
  const projects = [
    {
      title: "Portfolio Website",
      description: "A responsive personal portfolio built with React, featuring advanced animations and a modern UI design.",
      tags: ["React", "Tailwind CSS", "GSAP"],
      status: "current"
    },
    {
      title: "Coming Soon",
      description: "An exciting project currently under development. Stay tuned for updates!",
      tags: ["Frontend", "Backend", "Database"],
      status: "upcoming"
    },
    {
      title: "Future Project",
      description: "A planned project that will showcase advanced skills and creative problem-solving.",
      tags: ["React", "Node.js", "MongoDB"],
      status: "upcoming"
    }
  ];
  
  useEffect(() => {
    // Create 3D rotation effect for project cards
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        
        // Move tag pills based on cursor position for parallax effect
        const tags = card.querySelectorAll('.tag');
        tags.forEach((tag, index) => {
          const depth = 1 + (index * 0.5);
          const moveX = (x - centerX) / (12 * depth);
          const moveY = (y - centerY) / (12 * depth);
          tag.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        const tags = card.querySelectorAll('.tag');
        tags.forEach(tag => {
          tag.style.transform = 'translate(0, 0)';
        });
      });
    });
    
    // GSAP animations for section entrance
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 70%',
        end: 'center center',
        toggleActions: 'play none none none'
      }
    });
    
    tl.fromTo(
      headingRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }
    );
    
    // Staggered entrance for project cards
    if (projectsRef.current && projectsRef.current.children.length > 0) {
      tl.fromTo(
        Array.from(projectsRef.current.children),
        { 
          opacity: 0, 
          y: 50,
          rotationX: 15,
          rotationY: -10,
          scale: 0.9
        },
        { 
          opacity: 1, 
          y: 0,
          rotationX: 0,
          rotationY: 0,
          scale: 1,
          stagger: 0.15, 
          duration: 0.8, 
          ease: 'power2.out' 
        },
        '-=0.3'
      );
    }
    
    // Create parallax scrolling effect for the background shapes
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape, i) => {
      const direction = i % 2 === 0 ? 1 : -1;
      const speed = 0.1 + (i * 0.05);
      
      gsap.to(shape, {
        y: `${direction * 100}px`,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          ease: 'none',
        },
        ease: 'none',
      });
    });
    
    return () => {
      projectCards.forEach(card => {
        card.removeEventListener('mousemove', () => {});
        card.removeEventListener('mouseleave', () => {});
      });
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section 
      id="projects" 
      ref={sectionRef}
      className="relative py-20 md:py-32 bg-ctp-base overflow-hidden"
    >
      {/* Background decorative shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="shape absolute top-1/4 left-1/5 w-64 h-64 bg-ctp-mauve opacity-5 rounded-full blur-3xl"></div>
        <div className="shape absolute top-3/4 right-1/4 w-80 h-80 bg-ctp-blue opacity-5 rounded-full blur-3xl"></div>
        <div className="shape absolute bottom-1/3 left-1/2 w-40 h-40 bg-ctp-pink opacity-5 rounded-full blur-2xl"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-8">
        <h2 
          ref={headingRef}
          className="text-3xl md:text-4xl font-display font-bold text-center mb-16"
        >
          <span className="text-ctp-blue">My</span> Projects
        </h2>
        
        <div className="text-center mb-12">
          <p className="text-ctp-subtext1 max-w-2xl mx-auto">
            Here are some of the projects I've worked on. I'm constantly learning and building new things!
          </p>
        </div>
        
        <div 
          ref={projectsRef}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {projects.map((project, index) => (
            <div 
              key={index}
              className={`project-card bg-ctp-surface0 rounded-xl p-6 border ${
                project.status === 'current' 
                  ? 'border-ctp-mauve' 
                  : 'border-ctp-surface1'
              } shadow-lg transition-all duration-300`}
            >
              <div className="h-full flex flex-col">
                <div className="mb-4">
                  {project.status === 'current' ? (
                    <span className="inline-block bg-ctp-mauve bg-opacity-20 text-ctp-mauve text-xs px-2 py-1 rounded-full">
                      Active
                    </span>
                  ) : (
                    <span className="inline-block bg-ctp-blue bg-opacity-20 text-ctp-blue text-xs px-2 py-1 rounded-full">
                      Planned
                    </span>
                  )}
                </div>
                
                <h3 className="text-xl font-display font-semibold text-ctp-text mb-3">
                  {project.title}
                </h3>
                
                <p className="text-ctp-subtext0 mb-6 flex-grow">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.tags.map((tag, i) => (
                    <span 
                      key={i}
                      className="tag bg-ctp-surface1 text-ctp-subtext1 text-xs px-3 py-1 rounded-full transition-transform duration-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-ctp-surface1">
                  {project.status === 'current' ? (
                    <a 
                      href="#"
                      className="inline-flex items-center text-sm font-medium text-ctp-mauve hover:text-ctp-pink transition-colors"
                    >
                      View Details
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  ) : (
                    <span className="text-sm text-ctp-subtext0">Coming Soon</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <p className="text-ctp-subtext1 mb-6">More projects coming soon!</p>
          <button className="px-6 py-3 bg-ctp-surface1 text-ctp-text hover:bg-ctp-surface2 transition-colors duration-300 rounded-lg">
            Check Back Later
          </button>
        </div>
      </div>
    </section>
  );
};

export default Projects;
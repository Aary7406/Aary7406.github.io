// src/components/Skills.jsx
import { useEffect, useRef } from 'react';
import { color, motion, useInView } from 'framer-motion';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SkillCard = ({ name, icon, color, delay }) => {
  const cardRef = useRef(null);
  
  useEffect(() => {
    const card = cardRef.current;
    
    // 3D hover effect
    const handleMouseMove = (e) => {
      const { left, top, width, height } = card.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      
      gsap.to(card, {
        rotateY: x * 20,
        rotateX: -y * 20,
        transformPerspective: 1000,
        ease: 'power2.out',
        duration: 0.5
      });
    };
    
    const handleMouseLeave = () => {
      gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.5,
        ease: 'power2.out'
      });
    };
    
    if (card) {
      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);
    }
    
    return () => {
      if (card) {
        card.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <motion.div
      ref={cardRef}
      className={`bg-ctp-surface0 hover:bg-ctp-surface1 rounded-xl p-6 shadow-lg transform-gpu will-change-transform`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: delay }}
      viewport={{ once: false, amount: 0.2 }}
    >
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${color}`}>
        <div className="text-ctp-base" dangerouslySetInnerHTML={{ __html: icon }}></div>
      </div>
      <h3 className="text-ctp-text font-medium">{name}</h3>
    </motion.div>
  );
};

const skillsData = [
  { 
    name: 'React', 
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 13.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm7.5-4.5c0-1.1-1.1-2.1-2.8-2.7.3-.8.6-1.8.6-2.7 0-1.5-.8-2.3-2-2.3-1 0-1.7.6-2.3 1.5-1.5-.3-3-.5-4.6-.5-1.6 0-3.1.2-4.6.5-.6-.9-1.3-1.5-2.3-1.5-1.2 0-2 .8-2 2.3 0 .9.3 1.9.6 2.7-1.7.6-2.8 1.6-2.8 2.7 0 1.1 1.1 2.1 2.8 2.7-.3.8-.6 1.8-.6 2.7 0 1.5.8 2.3 2 2.3 1 0 1.7-.6 2.3-1.5 1.5.3 3 .5 4.6.5 1.6 0 3.1-.2 4.6-.5.6.9 1.3 1.5 2.3 1.5 1.2 0 2-.8 2-2.3 0-.9-.3-1.9-.6-2.7 1.7-.6 2.8-1.6 2.8-2.7zm-2 0c0 .2-.1.4-.4.6-.2.1-.4.3-.7.4-1 .4-2.3.6-3.7.8-.4.5-.9 1-1.3 1.4-1 1-2 1.6-3 1.6s-2-.6-3-1.6c-.4-.4-.9-.9-1.3-1.4-1.4-.2-2.7-.4-3.7-.8-.3-.1-.5-.3-.7-.4-.3-.2-.4-.4-.4-.6 0-.2.1-.4.4-.6.2-.1.4-.3.7-.4 1-.4 2.3-.6 3.7-.8.4-.5.9-1 1.3-1.4 1-1 2-1.6 3-1.6s2 .6 3 1.6c.4.4.9.9 1.3 1.4 1.4.2 2.7.4 3.7.8.3.1.5.3.7.4.3.2.4.4.4.6z"/></svg>', 
    color: 'bg-ctp-blue' 
  },
  { 
    name: 'JavaScript', 
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M3 3h18v18H3V3zm16.5 15.5v-7.5h-3v7.5h3zm-6 0V8h-3v10.5h3zm-6 0v-3h-3v3h3z"/></svg>', 
    color: 'bg-ctp-yellow' 
  },
  { 
    name: 'Tailwind CSS', 
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"/></svg>', 
    color: 'bg-ctp-teal' 
  },
  { 
    name: 'HTML', 
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z"/></svg>', 
    color: 'bg-ctp-peach' 
  },
  { 
    name: 'CSS', 
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.855L12 19.288l5.373-1.53L18.59 4.414v-.001z"/></svg>', 
    color: 'bg-ctp-blue' 
  },
  { 
    name: 'Node.js', 
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 1.85c-.27 0-.55.07-.78.2l-7.44 4.3c-.48.28-.78.8-.78 1.36v8.58c0 .56.3 1.08.78 1.36l1.95 1.12c.95.46 1.27.47 1.71.47 1.4 0 2.21-.85 2.21-2.33V8.44c0-.12-.1-.22-.22-.22H8.5c-.13 0-.23.1-.23.22v8.47c0 .66-.68 1.31-1.77.76L4.45 16.5c-.07-.04-.12-.13-.12-.22V7.73c0-.1.04-.19.12-.24l7.44-4.3c.06-.04.16-.04.22 0l7.44 4.3c.08.04.12.14.12.23v8.55c0 .1-.04.18-.12.22l-7.44 4.3c-.07.04-.15.04-.23 0l-1.9-1.12c-.06-.04-.16-.03-.22 0-.6.36-.71.4-.99.46-.27.05-.67.13-1.06-.32-.06-.07-.2-.24-.35-.4-.03-.04-.07-.08-.1-.12-.04-.04-.38-.2-.4-.22-.24-.13-.34-.36-.34-.6 0-.23.12-.44.32-.56l.14-.09c.12-.07.22-.13.29-.2.06-.06.12-.15.22-.33.05-.1.11-.26.13-.45.01-.05.01-.1.01-.14 0-.06 0-.12-.01-.17v-8.88c0-.26-.14-.5-.36-.63-.23-.14-.5-.16-.76-.07l-1.75.7c-.11.04-.23-.05-.23-.16V5c0-.09.05-.17.13-.21l7.44-4.29c.23-.13.5-.2.78-.2M14 8c-2.12 0-3.39.89-3.39 2.39 0 1.61 1.26 2.08 3.3 2.28 2.43.24 2.62.6 2.62 1.08 0 .83-.67 1.18-2.23 1.18-1.98 0-2.4-.5-2.55-1.5-.01-.07-.06-.12-.13-.12h-.92c-.07 0-.13.06-.13.13 0 .73.4 1.58 1.25 1.98.71.33 1.7.39 2.34.39 2.44 0 3.8-.88 3.8-2.44 0-1.61-1.11-2.04-3.37-2.34-2.31-.3-2.54-.46-2.54-1 0-.45.2-.95 1.96-.95 1.56 0 2.15.34 2.39 1.4.02.07.06.12.13.12h.93c.04 0 .07-.02.1-.04.02-.03.03-.06.03-.09 0-.76-.56-1.58-1.56-1.98-.92-.37-2.01-.48-3.01-.48z"/></svg>', 
    color: 'bg-ctp-green' 
  },
  { 
    name: 'Express.js', 
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M24 18.588a1.529 1.529 0 0 1-1.895-.72l-3.45-4.771-.5-.667-4.003 5.444a1.466 1.466 0 0 1-1.802.708l5.158-6.92-4.798-6.251a1.595 1.595 0 0 1 1.9.666l3.576 4.83 3.596-4.81a1.435 1.435 0 0 1 1.788-.668L21.708 7.9l-2.522 3.283a.666.666 0 0 0 0 .994l4.804 6.412zM.002 11.576l.42-2.075c1.154-4.103 5.858-5.81 9.094-3.27 1.895 1.489 2.368 3.597 2.275 5.973H1.116C.943 16.447 4.005 19.009 7.92 17.7a4.078 4.078 0 0 0 2.582-2.876c.207-.666.548-.78 1.174-.588a5.417 5.417 0 0 1-2.589 3.957 6.272 6.272 0 0 1-7.306-.933 6.575 6.575 0 0 1-1.64-3.858c0-.235-.08-.455-.134-.666A88.33 88.33 0 0 1 0 11.577zm1.127-.286h9.654c-.06-3.076-2.001-5.258-4.59-5.278-2.882-.04-4.944 2.094-5.071 5.264z"/></svg>', 
    color: 'bg-ctp-lavender' 
  },
  { 
    name: 'MongoDB', 
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M17.193 9.555c-1.264-5.58-4.252-7.414-4.573-8.115-.28-.394-.53-.954-.735-1.44-.036.495-.055.685-.523 1.184-.723.566-4.438 3.682-4.74 10.02-.282 5.912 4.27 9.435 4.888 9.884l.07.05A73.49 73.49 0 0111.91 24h.481c.114-1.032.284-2.056.51-3.07.417-.296.604-.463.85-.693a11.342 11.342 0 003.639-8.464c.01-.814-.103-1.662-.197-2.218zm-5.336 8.195s0-8.291.275-8.29c.213 0 .49 10.695.49 10.695-.381-.045-.765-1.76-.765-2.405z"/></svg>', 
    color: 'bg-ctp-green' 
  },
  { 
    name: 'C/C++', 
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M11.001 9.002H8v-1h3.001V5H8v1.001h2v.999H8v1h3.001v1.002zm4.001-1V6h-1.001v2.001H13V7h-1.001v2.001H13v1.001h-1.001v2h1.001v-1h1.001v1H15v-2h-1.001V9.002h1.001zm-3.001 6.999c-4.667 0-8.001-3.332-8.001-8.001 0-4.667 3.334-8 8.001-8 4.667 0 8.001 3.333 8.001 8 0 4.668-3.334 8.001-8.001 8.001zm0 1c4.946 0 9.001-4.054 9.001-9.001S16.947 5 12.001 5s-9.001 4.054-9.001 9 4.055 9.001 9.001 9.001z"/></svg>', 
    color: 'bg-ctp-pink' 
  },
  { 
    name: 'Python', 
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z"/></svg>', 
    color: 'bg-ctp-yellow' 
  },
  { 
    name: 'Bootstrap', 
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M11.77 11.24H9.956V8.202h2.152c1.17 0 1.834.522 1.834 1.466 0 1.008-.773 1.572-2.174 1.572zm.324 1.206H9.957v3.348h2.231c1.459 0 2.232-.585 2.232-1.685s-.795-1.663-2.326-1.663zM24 11.39v1.218c-1.128.108-1.817.944-2.226 2.268-.407 1.319-.463 2.937-.42 4.186.045 1.3-.968 2.5-2.337 2.5H4.985c-1.37 0-2.383-1.2-2.337-2.5.043-1.249-.013-2.867-.42-4.186-.41-1.324-1.1-2.16-2.228-2.268V11.39c1.128-.108 1.819-.944 2.227-2.268.408-1.319.464-2.937.42-4.186-.045-1.3.968-2.5 2.338-2.5h14.032c1.37 0 2.382 1.2 2.337 2.5-.043 1.249.013 2.867.42 4.186.409 1.324 1.098 2.16 2.226 2.268zm-7.927 2.817c0-1.354-.953-2.333-2.368-2.488v-.057c1.04-.169 1.856-1.135 1.856-2.213 0-1.537-1.213-2.538-3.062-2.538h-4.16v10.172h4.181c2.218 0 3.553-1.086 3.553-2.876z"/></svg>', 
    color: 'bg-ctp-mauve' 
  },
  { 
    name: 'Bash', 
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M3 2h18v20H3V2zm17 19V3H4v18h16z"/><path d="M12 18h4v1h-4zM6.5 10.5L8 9l3.5 3.5L8 16l-1.5-1.5L9 12z"/></svg>', 
    color: 'bg-ctp-yellow' 
  },
  {
  name: 'Next.js',
  icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M3 2h18v20H3V2zm17 19V3H4v18h16z"/><path d="M19 7.01v9.98c0 .3-.15.59-.4.76l-5.81-7.28v6.42h-1.5V9.47c0-.3.15-.59.4-.76l5.82 7.28V9.57h1.49v-2.56z"/><path d="M7.01 9.5v7.33H5.5V7.01h7.22v1.49H7.01z"/></svg>',
  color: 'bg-ctp-pink'
},
];

const Skills = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.2 });
  
  useEffect(() => {
    // GSAP ScrollTrigger animations
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.querySelector('.skills-title'),
        { 
          y: 50, 
          opacity: 0 
        },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current.querySelector('.skills-title'),
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play reverse play reverse",
          }
        }
      );
    }
  }, []);

  return (
    <section 
      id="skills" 
      className="py-24 relative overflow-hidden"
      ref={containerRef}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-96 h-96 rounded-full bg-ctp-blue/5 blur-3xl -right-48 top-20"></div>
        <div className="absolute w-64 h-64 rounded-full bg-ctp-mauve/5 blur-3xl -left-32 bottom-20"></div>
      </div>
      
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-16 skills-title"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-ctp-text mb-2">
            My <span className="text-ctp-blue">Skills</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-ctp-blue to-ctp-mauve rounded-full mx-auto"></div>
          <p className="text-ctp-subtext1 mt-6 max-w-xl mx-auto">
            Here are the technologies and programming languages I've worked with and am proficient in.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {skillsData.map((skill, index) => (
            <SkillCard 
              key={skill.name}
              name={skill.name}
              icon={skill.icon}
              color={skill.color}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;

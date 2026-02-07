// src/components/Skills.jsx
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Skill categories with subsections
const skillCategories = [
  {
    id: 'fullstack',
    title: 'Full Stack',
    subtitle: 'Development',
    accent: 'accent-cyan',
    subsections: [
      {
        name: 'Frontend',
        skills: ['React', 'Next.js', 'JavaScript', 'Vite', 'React Query', 'HTML5', 'Redux'],
      },
      {
        name: 'Backend',
        skills: ['Node.js', 'Bun', 'Express.js', 'MongoDB', 'PostgreSQL', 'MySQL', 'REST API', 'Supabase', 'Flask'],
      },
      {
        name: 'Web Design',
        skills: ['Tailwind CSS', 'Framer Motion', 'GSAP', 'CSS3', 'Figma', 'Styled Components', 'SVG Animation', 'Three.js', 'Anime.js'],
      },
    ],
  },
  {
    id: 'devops',
    title: 'Basic',
    subtitle: 'DevOps',
    accent: 'accent-magenta',
    subsections: [
      {
        name: 'Containerization',
        skills: ['Docker', 'Docker Compose'],
      },
      {
        name: 'Version Control',
        skills: ['Git', 'GitHub', 'GitLab', 'GitHub Actions', 'Git Flow'],
      },
      {
        name: 'Deployment',
        skills: ['Vercel', 'Railway', 'Nginx', 'CI/CD', 'AWS', 'Netlify', 'Jenkins'],
      },
    ],
  },
  {
    id: 'cpp',
    title: 'C++',
    subtitle: 'Development',
    accent: 'accent-lime',
    subsections: [
      {
        name: 'Core',
        skills: ['Modern C++ (17/20)', 'C++23', 'STL', 'OOP'],
      },
      {
        name: 'Concepts',
        skills: ['Data Structures', 'Algorithms', 'Memory Management', 'Multithreading'],
      },
      {
        name: 'Build Systems',
        skills: ['CMake'],
      },
      {
        name: 'Tools',
        skills: ['Clang', 'GCC'],
      },
    ],
  },
  {
    id: 'linux',
    title: 'Linux',
    subtitle: 'Fundamentals',
    accent: 'accent-yellow',
    subsections: [
      {
        name: 'Scripting',
        skills: ['Bash', 'Shell Scripting', 'Python', 'Automation'],
      },
      {
        name: 'Administration',
        skills: ['System Admin', 'Process Management', 'Networking', 'SSH'],
      },
      {
        name: 'Tools',
        skills: ['nvim', 'btop', 'grep', 'fzf', 'Kitty'],
      },
      {
        name: 'Distros',
        skills: ['Zorin OS', 'Arch + Hyprland', 'Ubuntu', 'Kali Linux'],
      },
      {
        name: 'Kernel',
        skills: ['Zen Kernels'],
      },
    ],
  },
];

// Text skill item with slide-in animation
const SkillText = ({ skill, index, parentProgress, baseDelay }) => {
  // Stagger delay based on index - increased for more dramatic effect
  const staggerDelay = baseDelay + index * 0.025;
  
  // Calculate individual item progress - blur clears around 55% viewport
  const itemStart = staggerDelay;
  const itemEnd = 0.38 + staggerDelay;
  
  const opacity = useTransform(
    parentProgress,
    [itemStart, itemEnd],
    [0, 1]
  );
  
  // Slide in from right - increased distance
  const x = useTransform(
    parentProgress,
    [itemStart, itemEnd],
    [80, 0]
  );
  
  // Blur effect - increased intensity
  const blur = useTransform(
    parentProgress,
    [itemStart, itemEnd],
    [12, 0]
  );

  return (
    <motion.span
      style={{ 
        opacity, 
        x,
        filter: useTransform(blur, (v) => `blur(${v}px)`),
        fontFamily: 'Rosehot, sans-serif',
      }}
      className="text-light-secondary text-lg md:text-xl lg:text-2xl
                 hover:text-light-primary transition-colors duration-200 cursor-default
                 will-change-[transform,opacity,filter]"
    >
      {skill}
    </motion.span>
  );
};

// Subsection component
const Subsection = ({ subsection, subsectionIndex, parentProgress, accentClass }) => {
  const baseDelay = 0.08 + subsectionIndex * 0.08;
  
  const labelOpacity = useTransform(
    parentProgress,
    [baseDelay, baseDelay + 0.30],
    [0, 1]
  );
  
  const labelX = useTransform(
    parentProgress,
    [baseDelay, baseDelay + 0.30],
    [60, 0]
  );
  
  const labelBlur = useTransform(
    parentProgress,
    [baseDelay, baseDelay + 0.30],
    [10, 0]
  );

  return (
    <div className="flex flex-col items-end gap-2 max-w-xl lg:max-w-2xl">
      {/* Subsection label */}
      <motion.span
        style={{ 
          opacity: labelOpacity, 
          x: labelX,
          filter: useTransform(labelBlur, (v) => `blur(${v}px)`),
        }}
        className={`text-sm md:text-base lg:text-lg font-semibold uppercase tracking-wider ${accentClass} mb-1 will-change-[transform,opacity,filter]`}
      >
        {subsection.name}
      </motion.span>
      
      {/* Skills list */}
      <div className="flex flex-wrap justify-end gap-x-4 gap-y-2">
        {subsection.skills.map((skill, skillIndex) => (
          <SkillText
            key={skill}
            skill={skill}
            index={skillIndex}
            parentProgress={parentProgress}
            baseDelay={baseDelay + 0.02}
          />
        ))}
      </div>
    </div>
  );
};

// Individual skill category section
const SkillCategory = ({ category, index }) => {
  const sectionRef = useRef(null);
  
  // Scroll progress for this section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  
  // Title animations - completes around 55% viewport
  const titleBlur = useTransform(scrollYProgress, [0.05, 0.28], [15, 0]);
  const titleOpacity = useTransform(scrollYProgress, [0.05, 0.25], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0.05, 0.28], [50, 0]);
  
  // Subtitle animations with slight delay
  const subtitleBlur = useTransform(scrollYProgress, [0.08, 0.32], [12, 0]);
  const subtitleOpacity = useTransform(scrollYProgress, [0.08, 0.28], [0, 1]);
  const subtitleY = useTransform(scrollYProgress, [0.08, 0.32], [35, 0]);

  // Determine accent color classes
  const getAccentClasses = (accent) => {
    const accents = {
      'accent-cyan': 'text-accent-cyan',
      'accent-magenta': 'text-accent-magenta',
      'accent-lime': 'text-accent-lime',
      'accent-yellow': 'text-accent-yellow',
    };
    return accents[accent] || 'text-accent-cyan';
  };

  return (
    <section
      ref={sectionRef}
      className="min-h-[70vh] overflow-hidden flex flex-col justify-center py-16 md:py-20 relative"
    >
      <div className="container mx-auto px-6 relative z-10">
        {/* Huge typography title - top */}
        <div className="mb-10 md:mb-14">
          <motion.h2
            style={{
              filter: useTransform(titleBlur, (v) => `blur(${v}px)`),
              opacity: titleOpacity,
              y: titleY,
              fontFamily: 'Seraphine, sans-serif',
            }}
            className={`text-display-lg md:text-display-xl font-bold will-change-[filter,transform,opacity]
                       ${getAccentClasses(category.accent)} leading-none tracking-tight`}
          >
            {category.title}
          </motion.h2>
          <motion.span
            style={{
              filter: useTransform(subtitleBlur, (v) => `blur(${v}px)`),
              opacity: subtitleOpacity,
              y: subtitleY,
              fontFamily: 'Seraphine, sans-serif',
            }}
            className="block text-display-md md:text-display-lg font-bold will-change-[filter,transform,opacity]
                       text-light-tertiary leading-none tracking-tight mt-2"
          >
            {category.subtitle}
          </motion.span>
        </div>

        {/* Subsections - right aligned, below title */}
        <div className="flex flex-col items-end gap-6 md:gap-8">
          {category.subsections.map((subsection, subIndex) => (
            <Subsection
              key={subsection.name}
              subsection={subsection}
              subsectionIndex={subIndex}
              parentProgress={scrollYProgress}
              accentClass={getAccentClasses(category.accent)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const Skills = () => {
  const containerRef = useRef(null);

  return (
    <div id="skills" ref={containerRef} className="relative">
      {/* Section header */}
      <div className="container mx-auto px-6 pt-24 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: false, amount: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-light-primary mb-3">
            My <span className="text-accent-cyan">Skills</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-accent-cyan to-accent-magenta rounded-full mx-auto" />
          <p className="text-light-muted mt-6 max-w-xl mx-auto text-base md:text-lg">
            Technologies and domains I specialize in
          </p>
        </motion.div>
      </div>

      {/* Skill categories */}
      {skillCategories.map((category, index) => (
        <SkillCategory key={category.id} category={category} index={index} />
      ))}
    </div>
  );
};

export default Skills;

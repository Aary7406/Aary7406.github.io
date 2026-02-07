// src/components/Services.jsx
import { useRef, useEffect, useState, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// INFINITE MARQUEE FOR CURSOR (Seamless, fast, never stops)
// ============================================================================
const CursorMarquee = memo(({ text }) => {
    // Two identical groups side by side - translate -50% creates seamless loop
    return (
        <div className="overflow-hidden">
            <div
                className="flex whitespace-nowrap will-change-transform"
                style={{
                    animation: 'cursorMarquee 5s linear infinite',
                }}
            >
                {/* First group */}
                <span
                    className="text-sm font-bold px-3 shrink-0"
                    style={{
                        fontFamily: 'Inter, sans-serif',
                        color: '#1a1a2e',
                    }}
                >
                    {text}
                </span>
                <span
                    className="text-sm font-bold px-3 shrink-0"
                    style={{
                        fontFamily: 'Inter, sans-serif',
                        color: '#1a1a2e',
                    }}
                >
                    {text}
                </span>
                {/* Second group (duplicate for seamless loop) */}
                <span
                    className="text-sm font-bold px-3 shrink-0"
                    style={{
                        fontFamily: 'Inter, sans-serif',
                        color: '#1a1a2e',
                    }}
                >
                    {text}
                </span>
                <span
                    className="text-sm font-bold px-3 shrink-0"
                    style={{
                        fontFamily: 'Inter, sans-serif',
                        color: '#1a1a2e',
                    }}
                >
                    {text}
                </span>
                <span
                    className="text-sm font-bold px-3 shrink-0"
                    style={{
                        fontFamily: 'Inter, sans-serif',
                        color: '#1a1a2e',
                    }}
                >
                    {text}
                </span>
                <span
                    className="text-sm font-bold px-3 shrink-0"
                    style={{
                        fontFamily: 'Inter, sans-serif',
                        color: '#1a1a2e',
                    }}
                >
                    {text}
                </span>
            </div>
            <style>{`
                @keyframes cursorMarquee {
                    from { transform: translateX(0); }
                    to { transform: translateX(-200%); }
                }
            `}</style>
        </div>
    );
});

CursorMarquee.displayName = 'CursorMarquee';

// Rolling text effect component - accepts isHovered from parent for row-level control
const RollingText = ({ children, className = '', isHovered = false }) => {
    const text = String(children);

    return (
        <span className={`relative inline-flex overflow-hidden ${className}`}>
            {text.split('').map((char, i) => (
                <motion.span
                    key={i}
                    className="relative block"
                    animate={isHovered ? { y: '-100%' } : { y: 0 }}
                    transition={{
                        duration: 0.3,
                        ease: [0.33, 1, 0.68, 1],
                        delay: i * 0.03,
                    }}
                >
                    {char === ' ' ? '\u00A0' : char}
                    <span className="absolute left-0 top-full">
                        {char === ' ' ? '\u00A0' : char}
                    </span>
                </motion.span>
            ))}
        </span>
    );
};

// Services data with detailed descriptions
const services = [
    {
        id: 'fullstack',
        title: 'Full Stack',
        subtitle: 'Development',
        description: "I build modern, fast, and scalable web applications that actually work in the real world. From clean frontends to solid backends, I focus on usability, performance, and maintainability so your product isn't just pretty — it's reliable. If you have an idea, I turn it into a functional system you can deploy, use, and grow.",
        accent: 'accent-cyan',
    },
    {
        id: 'pc-optimization',
        title: 'PC',
        subtitle: 'Optimization',
        description: "I tune systems to run smoother, faster, and more efficiently. This includes cleaning up bloat, fixing performance bottlenecks, improving startup times, and optimizing settings for your workflow. Your machine won't just \"work better\" — it'll feel noticeably sharper.",
        accent: 'accent-magenta',
    },
    {
        id: 'cpp',
        title: 'C++',
        subtitle: 'Development',
        description: "I write efficient, structured, and high-performance C++ code for applications that demand speed and control. Whether it's algorithms, systems programming, or performance-critical tools, I prioritize clean logic, stability, and real-world usability.",
        accent: 'accent-lime',
    },
    {
        id: 'devops',
        title: 'DevOps',
        subtitle: 'Solutions',
        description: "I help streamline development and deployment with automation, CI/CD pipelines, and cloud workflows. The goal is fewer failures, smoother releases, and less manual headache — so you can focus on building, not babysitting infrastructure.",
        accent: 'accent-yellow',
    },
    {
        id: 'pc-building',
        title: 'PC',
        subtitle: 'Building',
        description: "I design and assemble custom PCs tailored to your needs — gaming, productivity, content creation, or development. Every build is optimized for your budget, performance goals, and future upgradability.",
        accent: 'accent-cyan',
    },
];

// Pastel blue color
const PASTEL_BLUE = '#A8D8EA';

const Services = () => {
    const sectionRef = useRef(null);
    const listRef = useRef(null);
    const cursorTextRef = useRef(null);
    const itemsRef = useRef([]);
    const [isHovering, setIsHovering] = useState(false);
    const [hoveredService, setHoveredService] = useState(null);
    const mousePos = useRef({ x: 0, y: 0 });

    // Accent color classes
    const getAccentClass = (accent) => {
        const accents = {
            'accent-cyan': 'text-accent-cyan',
            'accent-magenta': 'text-accent-magenta',
            'accent-lime': 'text-accent-lime',
            'accent-yellow': 'text-accent-yellow',
        };
        return accents[accent] || 'text-accent-cyan';
    };

    // GSAP entrance stagger animation
    useEffect(() => {
        const items = itemsRef.current;
        if (!items.length) return;

        gsap.set(items, { opacity: 0, y: 40 });

        gsap.to(items, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
            stagger: 0.12,
            scrollTrigger: {
                trigger: listRef.current,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
            },
        });

        return () => {
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    }, []);

    // Mouse follower with scroll compensation
    useEffect(() => {
        const list = listRef.current;
        const cursorText = cursorTextRef.current;
        if (!list || !cursorText) return;

        let animationId;

        const updatePosition = () => {
            const rect = list.getBoundingClientRect();
            const relativeX = mousePos.current.x - rect.left;
            const relativeY = mousePos.current.y - rect.top;
            cursorText.style.left = `${relativeX}px`;
            cursorText.style.top = `${relativeY}px`;
            animationId = requestAnimationFrame(updatePosition);
        };

        const handleMouseMove = (e) => {
            mousePos.current.x = e.clientX;
            mousePos.current.y = e.clientY;
        };

        const handleMouseEnter = () => setIsHovering(true);
        const handleMouseLeave = () => setIsHovering(false);

        list.addEventListener('mousemove', handleMouseMove);
        list.addEventListener('mouseenter', handleMouseEnter);
        list.addEventListener('mouseleave', handleMouseLeave);

        animationId = requestAnimationFrame(updatePosition);

        return () => {
            list.removeEventListener('mousemove', handleMouseMove);
            list.removeEventListener('mouseenter', handleMouseEnter);
            list.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <section
            id="services"
            ref={sectionRef}
            className="relative z-20 overflow-hidden"
        >
            <div className="container mx-auto px-6 py-20 md:py-32 relative z-10">
                {/* Section header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-light-primary mb-3">
                        My <span className="text-accent-magenta">Services</span>
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-accent-magenta to-accent-cyan rounded-full mx-auto" />
                    <p
                        className="text-light-muted mt-6 max-w-xl mx-auto text-base md:text-lg"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                        Professional services I offer to bring your ideas to life
                    </p>
                </div>

                {/* Services list - full width */}
                <div ref={listRef} className="relative cursor-none">
                    {/* Mouse-following pill - Pastel Blue with Infinite Slider */}
                    <div
                        ref={cursorTextRef}
                        className={`absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2 z-50
                        transition-opacity duration-150 ${isHovering ? 'opacity-100' : 'opacity-0'}`}
                        style={{
                            willChange: 'left, top',
                            mixBlendMode: 'exclusion',
                        }}
                    >
                        <div
                            className="rounded-full overflow-hidden"
                            style={{
                                backgroundColor: PASTEL_BLUE,
                                width: '160px',
                                padding: '12px 0',
                                border: '2px solid rgba(255,255,255,0.4)',
                                boxShadow: '0 8px 32px rgba(168, 216, 234, 0.4), 0 4px 16px rgba(0,0,0,0.2)',
                            }}
                        >
                            <CursorMarquee text="Contact Now →" />
                        </div>
                    </div>

                    {/* Service items */}
                    <ul className="space-y-0">
                        {services.map((service, index) => (
                            <motion.li
                                key={service.id}
                                ref={(el) => (itemsRef.current[index] = el)}
                                className="group border-t border-glass-border last:border-b transition-colors duration-300 hover:bg-glass-white/50"
                                onMouseEnter={() => setHoveredService(service.id)}
                                onMouseLeave={() => setHoveredService(null)}
                            >
                                <div className="py-6 md:py-8 px-4 md:px-8">
                                    {/* Title row */}
                                    <div className="flex items-center gap-6 md:gap-8">
                                        <span
                                            className="text-light-muted/60 text-sm md:text-base font-mono shrink-0"
                                            style={{ fontFamily: 'JetBrains Mono, monospace' }}
                                        >
                                            0{index + 1}
                                        </span>
                                        <h3
                                            className={`text-2xl md:text-3xl lg:text-4xl font-bold ${getAccentClass(service.accent)}`}
                                            style={{ fontFamily: 'Inter, sans-serif' }}
                                        >
                                            <RollingText isHovered={hoveredService === service.id}>
                                                {service.title}
                                            </RollingText>
                                            <span className="text-light-secondary/80 font-normal ml-3">
                                                <RollingText isHovered={hoveredService === service.id}>
                                                    {service.subtitle}
                                                </RollingText>
                                            </span>
                                        </h3>
                                    </div>

                                    {/* Description - revealed on hover with mix-blend for cursor visibility */}
                                    <AnimatePresence>
                                        {hoveredService === service.id && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0, y: -10 }}
                                                animate={{ opacity: 1, height: 'auto', y: 0 }}
                                                exit={{ opacity: 0, height: 0, y: -10 }}
                                                transition={{
                                                    duration: 0.35,
                                                    ease: [0.33, 1, 0.68, 1],
                                                }}
                                                className="overflow-hidden"
                                                style={{ mixBlendMode: 'exclusion' }}
                                            >
                                                <p
                                                    className="text-white text-base md:text-lg mt-4 md:mt-5 pl-12 md:pl-20 max-w-4xl leading-relaxed"
                                                    style={{ fontFamily: 'Inter, sans-serif' }}
                                                >
                                                    {service.description}
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default Services;



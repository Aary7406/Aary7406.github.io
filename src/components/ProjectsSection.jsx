// src/components/ProjectsSection.jsx
// FIX: Each subsection has a WRAPPER with proper height
// The sticky content stays h-screen, but wrapper controls scroll distance
import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import LostImage from '../assets/Lost.PNG';

// ============================================================
// SECTION 1: Lost & Found Portal
// ============================================================
const Section1 = ({ scrollYProgress }) => {
    const orbsRef = useRef([]);
    const title = "Lost & Found Portal";

    // Perspective: scales out in SECOND HALF (0.4-0.6)
    const scale = useTransform(scrollYProgress, [0.4, 0.6], [1, 0.8]);
    const rotate = useTransform(scrollYProgress, [0.4, 0.6], [0, -5]);

    // Content animations in FIRST HALF (0-0.4)
    const getTitleCharY = (i, total) => {
        const start = 0.05 + (i / total) * 0.08;
        return useTransform(scrollYProgress, [start, start + 0.06], ['100%', '0%']);
    };
    const getTitleCharOpacity = (i, total) => {
        const start = 0.05 + (i / total) * 0.08;
        return useTransform(scrollYProgress, [start, start + 0.05], [0, 1]);
    };
    const imageX = useTransform(scrollYProgress, [0.12, 0.28], ['100%', '0%']);
    const imageScale = useTransform(scrollYProgress, [0.12, 0.28], [0.7, 1]);
    const imageOpacity = useTransform(scrollYProgress, [0.12, 0.2], [0, 1]);
    const titleShiftY = useTransform(scrollYProgress, [0.2, 0.28], ['0%', '-35%']);
    const descY = useTransform(scrollYProgress, [0.22, 0.32], ['50%', '0%']);
    const descOpacity = useTransform(scrollYProgress, [0.22, 0.3], [0, 1]);
    const ctaOpacity = useTransform(scrollYProgress, [0.28, 0.35], [0, 1]);

    useEffect(() => {
        const orbs = orbsRef.current.filter(Boolean);
        const anims = orbs.map((orb, i) => {
            const dirs = [[60, -50], [-55, 60], [50, 55], [-60, -55]];
            const [x, y] = dirs[i] || [40, -40];
            return gsap.to(orb, { x, y, duration: 15 + i * 4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        });
        return () => anims.forEach(a => a.kill());
    }, []);

    return (
        // WRAPPER: 50% of total height (400vh if parent is 800vh)
        <div className="relative h-1/2">
            {/* STICKY CONTENT: stays in view while scrolling through wrapper */}
            <motion.div
                style={{ scale, rotate, transformOrigin: 'center top' }}
                className="sticky top-0 h-screen w-full overflow-hidden"
            >
                {/* Background */}
                <div className="absolute inset-0 bg-ctp-base">
                    <div ref={el => orbsRef.current[0] = el} className="absolute -top-1/4 -left-1/4 w-[70vw] h-[70vw] rounded-full"
                        style={{ background: 'radial-gradient(circle, rgba(198, 160, 246, 0.7) 0%, transparent 70%)', filter: 'blur(100px)' }} />
                    <div ref={el => orbsRef.current[1] = el} className="absolute top-1/4 -right-1/3 w-[60vw] h-[60vw] rounded-full"
                        style={{ background: 'radial-gradient(circle, rgba(245, 189, 230, 0.6) 0%, transparent 70%)', filter: 'blur(100px)' }} />
                    <div ref={el => orbsRef.current[2] = el} className="absolute -bottom-1/3 left-1/4 w-[65vw] h-[65vw] rounded-full"
                        style={{ background: 'radial-gradient(circle, rgba(138, 173, 244, 0.65) 0%, transparent 70%)', filter: 'blur(100px)' }} />
                    <div ref={el => orbsRef.current[3] = el} className="absolute top-1/2 left-1/2 w-[50vw] h-[50vw] rounded-full -translate-x-1/2 -translate-y-1/2"
                        style={{ background: 'radial-gradient(circle, rgba(139, 213, 202, 0.5) 0%, transparent 70%)', filter: 'blur(80px)' }} />
                    <div className="absolute inset-0" style={{ backgroundColor: 'rgba(36, 39, 58, 0.3)', backdropFilter: 'blur(20px) saturate(150%)' }} />
                </div>

                {/* Badges */}
                <div className="absolute top-4 right-4 md:top-6 md:right-6 flex gap-2 z-30">
                    <span className="px-3 py-1 text-xs rounded-full bg-green-500/20 text-green-400 border border-green-500/30 backdrop-blur-sm">Active</span>
                    <span className="px-3 py-1 text-xs rounded-full bg-white/10 text-white/80 border border-white/20 backdrop-blur-sm">Open Source</span>
                </div>

                {/* Content */}
                <div className="absolute bottom-8 left-8 z-20" style={{ maxWidth: '400px' }}>
                    <motion.div style={{ y: titleShiftY }}>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ctp-text" style={{ fontFamily: 'Space Grotesk' }}>
                            {title.split('').map((char, i) => (
                                <span key={i} className="inline-block overflow-hidden">
                                    <motion.span className="inline-block"
                                        style={{ y: getTitleCharY(i, title.length), opacity: getTitleCharOpacity(i, title.length) }}>
                                        {char === ' ' ? '\u00A0' : char}
                                    </motion.span>
                                </span>
                            ))}
                        </h2>
                    </motion.div>
                    <div className="overflow-hidden mt-4">
                        <motion.p className="text-base md:text-lg text-ctp-subtext0" style={{ y: descY, opacity: descOpacity, fontFamily: 'Inter' }}>
                            A comprehensive web application for managing lost and found items in educational institutions, corporates, and government offices.
                        </motion.p>
                    </div>
                    <motion.a href="https://lostportal.vercel.app" target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 text-sm rounded-full bg-ctp-mauve text-ctp-base font-medium hover:scale-105 transition-transform"
                        style={{ opacity: ctaOpacity }}>
                        View on GitHub →
                    </motion.a>
                </div>

                {/* Image */}
                <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] max-w-xl z-10"
                    style={{ x: imageX, scale: imageScale, opacity: imageOpacity }}>
                    <div className="relative rounded-xl overflow-hidden shadow-2xl">
                        <img src={LostImage} alt="Lost & Found Portal" className="w-full h-auto" />
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

// ============================================================
// SECTION 2: LightShell
// ============================================================
const Section2 = ({ scrollYProgress }) => {
    const title = "LightShell";

    // Perspective: scales IN during transition (0.4-0.6)
    const scale = useTransform(scrollYProgress, [0.4, 0.6], [0.8, 1]);
    const rotate = useTransform(scrollYProgress, [0.4, 0.6], [5, 0]);

    // Content animations in SECOND HALF (0.6-1.0)
    const getTitleCharY = (i, total) => {
        const start = 0.62 + (i / total) * 0.08;
        return useTransform(scrollYProgress, [start, start + 0.06], ['100%', '0%']);
    };
    const getTitleCharOpacity = (i, total) => {
        const start = 0.62 + (i / total) * 0.08;
        return useTransform(scrollYProgress, [start, start + 0.05], [0, 1]);
    };
    const imageX = useTransform(scrollYProgress, [0.7, 0.85], ['100%', '0%']);
    const imageScale = useTransform(scrollYProgress, [0.7, 0.85], [0.7, 1]);
    const imageOpacity = useTransform(scrollYProgress, [0.7, 0.78], [0, 1]);
    const titleShiftY = useTransform(scrollYProgress, [0.78, 0.86], ['0%', '-35%']);
    const descY = useTransform(scrollYProgress, [0.8, 0.9], ['50%', '0%']);
    const descOpacity = useTransform(scrollYProgress, [0.8, 0.88], [0, 1]);

    return (
        // WRAPPER: 50% of total height
        <div className="relative h-1/2">
            {/* STICKY CONTENT */}
            <motion.div
                style={{ scale, rotate, transformOrigin: 'center top' }}
                className="sticky top-0 h-screen w-full overflow-hidden"
            >
                {/* Background */}
                <div className="absolute inset-0 bg-black">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'url(/services.jpg)', backgroundSize: 'cover', backgroundPosition: 'center',
                        filter: 'blur(25px) brightness(0.25)', opacity: 0.5
                    }} />
                </div>

                {/* Badges */}
                <div className="absolute top-4 right-4 md:top-6 md:right-6 flex gap-2 z-30">
                    <span className="px-3 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 backdrop-blur-sm">Upcoming</span>
                    <span className="px-3 py-1 text-xs rounded-full bg-white/10 text-white/80 border border-white/20 backdrop-blur-sm">Open Source</span>
                </div>

                {/* Content */}
                <div className="absolute bottom-8 left-8 z-20" style={{ maxWidth: '400px' }}>
                    <motion.div style={{ y: titleShiftY }}>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white" style={{ fontFamily: 'JetBrains Mono' }}>
                            {title.split('').map((char, i) => (
                                <span key={i} className="inline-block overflow-hidden">
                                    <motion.span className="inline-block"
                                        style={{ y: getTitleCharY(i, title.length), opacity: getTitleCharOpacity(i, title.length) }}>
                                        {char === ' ' ? '\u00A0' : char}
                                    </motion.span>
                                </span>
                            ))}
                        </h2>
                    </motion.div>
                    <div className="overflow-hidden mt-4">
                        <motion.p className="text-base md:text-lg text-gray-300" style={{ y: descY, opacity: descOpacity, fontFamily: 'Inter' }}>
                            A non-POSIX shell built in C++ for Linux, focused on efficiency and modern features.
                        </motion.p>
                    </div>
                </div>

                {/* CSS Terminal Window Placeholder */}
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] max-w-2xl z-20"
                    style={{ x: imageX, scale: imageScale, opacity: imageOpacity }}
                >
                    <div className="w-full rounded-lg overflow-hidden border border-white/10 bg-[#0f0f12] shadow-2xl">
                        {/* Terminal Header */}
                        <div className="bg-[#1a1b26] px-4 py-2 flex items-center gap-2 border-b border-white/5">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                            </div>
                            <div className="flex-1 text-center text-xs text-white/30 font-mono">user@lightshell:~</div>
                        </div>
                        {/* Terminal Body */}
                        <div className="p-6 font-mono text-sm leading-relaxed text-gray-300">
                            <div className="flex gap-2">
                                <span className="text-green-400">➜</span>
                                <span className="text-blue-400">~</span>
                                <span className="text-gray-400">$</span>
                                <span className="text-white">./lightshell</span>
                            </div>
                            <div className="mt-2 text-white/50">
                                Initializing LightShell v1.0.0...<br />
                                Loading modules... [OK]<br />
                                System check... [OK]<br />
                            </div>
                            <div className="mt-4 flex gap-2">
                                <span className="text-green-400">➜</span>
                                <span className="text-blue-400">lightshell</span>
                                <span className="text-gray-400">git:(main)</span>
                                <span className="animate-pulse">_</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

// ============================================================
// MAIN WRAPPER
// ============================================================
const ProjectsSection = () => {
    const containerRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end']
    });

    return (
        <section id="projects" ref={containerRef} className="relative h-[800vh]">
            <Section1 scrollYProgress={scrollYProgress} />
            <Section2 scrollYProgress={scrollYProgress} />
        </section>
    );
};

export default ProjectsSection;

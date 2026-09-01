// src/components/ProjectsSection.jsx
// FIX: Each subsection has a WRAPPER with proper height
// The sticky content stays h-screen, but wrapper controls scroll distance
import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
// ============================================================
// ============================================================
// ============================================================
// SECTION 1: CommitGen
// ============================================================
const Section1 = ({ scrollYProgress }) => {
    const orbsRef = useRef([]);
    const title = "CommitGen";

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
                {/* Background: Orange and Black palette */}
                <div className="absolute inset-0 bg-[#0a0a0a]">
                    <div ref={el => orbsRef.current[0] = el} className="absolute -top-1/4 -left-1/4 w-[70vw] h-[70vw] rounded-full"
                        style={{ background: 'radial-gradient(circle, rgba(249, 115, 22, 0.6) 0%, transparent 70%)', filter: 'blur(100px)' }} />
                    <div ref={el => orbsRef.current[1] = el} className="absolute top-1/4 -right-1/3 w-[60vw] h-[60vw] rounded-full"
                        style={{ background: 'radial-gradient(circle, rgba(234, 88, 12, 0.5) 0%, transparent 70%)', filter: 'blur(100px)' }} />
                    <div ref={el => orbsRef.current[2] = el} className="absolute -bottom-1/3 left-1/4 w-[65vw] h-[65vw] rounded-full"
                        style={{ background: 'radial-gradient(circle, rgba(251, 146, 60, 0.4) 0%, transparent 70%)', filter: 'blur(100px)' }} />
                    <div ref={el => orbsRef.current[3] = el} className="absolute top-1/2 left-1/2 w-[50vw] h-[50vw] rounded-full -translate-x-1/2 -translate-y-1/2"
                        style={{ background: 'radial-gradient(circle, rgba(194, 65, 12, 0.45) 0%, transparent 70%)', filter: 'blur(80px)' }} />
                    <div className="absolute inset-0" style={{ backgroundColor: 'rgba(10, 10, 10, 0.4)', backdropFilter: 'blur(20px) saturate(150%)' }} />
                </div>

                {/* Badges */}
                <div className="absolute top-4 right-4 md:top-6 md:right-6 flex gap-2 z-30">
                    <span className="px-3 py-1 text-xs rounded-full bg-green-500/20 text-green-400 border border-green-500/30 backdrop-blur-sm">Active</span>
                    <span className="px-3 py-1 text-xs rounded-full bg-white/10 text-white/80 border border-white/20 backdrop-blur-sm">Closed Source</span>
                </div>

                {/* Content */}
                <div className="absolute bottom-8 left-6 md:bottom-12 md:left-12 lg:left-16 z-20 max-w-sm sm:max-w-md md:max-w-lg">
                    <motion.div style={{ y: titleShiftY }}>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight" style={{ fontFamily: 'Space Grotesk' }}>
                            {title.split(' ').map((word, wordIndex) => {
                                const wordsBefore = title.split(' ').slice(0, wordIndex).join(' ');
                                const baseOffset = wordsBefore.length > 0 ? wordsBefore.length + 1 : 0;
                                return (
                                    <span key={wordIndex} className="inline-block whitespace-nowrap mr-[0.28em] last:mr-0">
                                        {word.split('').map((char, charIndex) => {
                                            const i = baseOffset + charIndex;
                                            return (
                                                <span key={charIndex} className="inline-block overflow-hidden">
                                                    <motion.span
                                                        className="inline-block"
                                                        style={{ y: getTitleCharY(i, title.length), opacity: getTitleCharOpacity(i, title.length) }}
                                                    >
                                                        {char}
                                                    </motion.span>
                                                </span>
                                            );
                                        })}
                                    </span>
                                );
                            })}
                        </h2>
                    </motion.div>
                    <div className="overflow-hidden mt-3 md:mt-4">
                        <motion.p className="text-sm sm:text-base md:text-lg text-gray-300 font-normal leading-relaxed" style={{ y: descY, opacity: descOpacity, fontFamily: 'Inter' }}>
                            An AI-powered commit generator that analyzes your code changes to generate clear, concise, and conventional commit messages instantly.
                        </motion.p>
                    </div>
                    <motion.a href="https://commitgencli.vercel.app" target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-4 md:mt-5 px-5 md:px-6 py-2.5 md:py-3 text-sm rounded-full bg-orange-500 text-black font-semibold hover:bg-orange-400 hover:scale-105 transition-all shadow-lg shadow-orange-500/25"
                        style={{ opacity: ctaOpacity }}>
                        Check it out →
                    </motion.a>
                </div>

                {/* Image */}
                <motion.div className="absolute top-[35%] md:top-1/2 right-6 md:right-12 lg:right-16 -translate-y-1/2 w-[85%] md:w-[48%] max-w-xl z-10"
                    style={{ x: imageX, scale: imageScale, opacity: imageOpacity }}>
                    <div className="relative rounded-xl overflow-hidden shadow-2xl border border-white/10">
                        <img src="/commitgen.png" alt="CommitGen" className="w-full h-auto" />
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

// ============================================================
// SECTION 2: Sovilifestyleventures
// ============================================================
const Section2 = ({ scrollYProgress }) => {
    const orbsRef = useRef([]);
    const title = "Sovi Lifestyle Ventures";

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
    const ctaOpacity = useTransform(scrollYProgress, [0.86, 0.92], [0, 1]);

    useEffect(() => {
        const orbs = orbsRef.current.filter(Boolean);
        const anims = orbs.map((orb, i) => {
            const dirs = [[-50, 60], [60, -55], [-60, -50], [55, 50]];
            const [x, y] = dirs[i] || [-40, 40];
            return gsap.to(orb, { x, y, duration: 16 + i * 4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        });
        return () => anims.forEach(a => a.kill());
    }, []);

    return (
        // WRAPPER: 50% of total height
        <div className="relative h-1/2">
            {/* STICKY CONTENT */}
            <motion.div
                style={{ scale, rotate, transformOrigin: 'center top' }}
                className="sticky top-0 h-screen w-full overflow-hidden"
            >
                {/* Background: Rich Sky Blue with subtle luminous highlights */}
                <div className="absolute inset-0 bg-gradient-to-br from-sky-500 via-sky-600 to-sky-900">
                    <div ref={el => orbsRef.current[0] = el} className="absolute -top-1/4 -left-1/4 w-[70vw] h-[70vw] rounded-full"
                        style={{ background: 'radial-gradient(circle, rgba(56, 189, 248, 0.75) 0%, rgba(14, 165, 233, 0.4) 50%, transparent 70%)', filter: 'blur(80px)' }} />
                    <div ref={el => orbsRef.current[1] = el} className="absolute top-1/4 -right-1/3 w-[60vw] h-[60vw] rounded-full"
                        style={{ background: 'radial-gradient(circle, rgba(2, 132, 199, 0.8) 0%, rgba(3, 105, 161, 0.5) 60%, transparent 70%)', filter: 'blur(90px)' }} />
                    <div ref={el => orbsRef.current[2] = el} className="absolute -bottom-1/3 left-1/4 w-[65vw] h-[65vw] rounded-full"
                        style={{ background: 'radial-gradient(circle, rgba(125, 211, 252, 0.55) 0%, rgba(14, 165, 233, 0.35) 60%, transparent 70%)', filter: 'blur(80px)' }} />
                    <div ref={el => orbsRef.current[3] = el} className="absolute top-1/2 left-1/2 w-[50vw] h-[50vw] rounded-full -translate-x-1/2 -translate-y-1/2"
                        style={{ background: 'radial-gradient(circle, rgba(255, 255, 255, 0.25) 0%, rgba(56, 189, 248, 0.4) 60%, transparent 70%)', filter: 'blur(70px)' }} />
                    <div className="absolute inset-0 bg-sky-950/20 backdrop-blur-[2px]" />
                </div>

                {/* Badges */}
                <div className="absolute top-4 right-4 md:top-6 md:right-6 flex gap-2 z-30">
                    <span className="px-3.5 py-1 text-xs font-semibold rounded-full bg-emerald-400/25 text-emerald-200 border border-emerald-400/40 backdrop-blur-md">Active</span>
                    <span className="px-3.5 py-1 text-xs font-semibold rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-md">Closed Source</span>
                </div>

                {/* Content */}
                <div className="absolute bottom-8 left-6 md:bottom-12 md:left-12 lg:left-16 z-20 max-w-sm sm:max-w-md md:max-w-lg">
                    <motion.div style={{ y: titleShiftY }}>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight" style={{ fontFamily: 'Space Grotesk' }}>
                            {title.split(' ').map((word, wordIndex) => {
                                const wordsBefore = title.split(' ').slice(0, wordIndex).join(' ');
                                const baseOffset = wordsBefore.length > 0 ? wordsBefore.length + 1 : 0;
                                return (
                                    <span key={wordIndex} className="inline-block whitespace-nowrap mr-[0.28em] last:mr-0">
                                        {word.split('').map((char, charIndex) => {
                                            const i = baseOffset + charIndex;
                                            return (
                                                <span key={charIndex} className="inline-block overflow-hidden">
                                                    <motion.span
                                                        className="inline-block"
                                                        style={{ y: getTitleCharY(i, title.length), opacity: getTitleCharOpacity(i, title.length) }}
                                                    >
                                                        {char}
                                                    </motion.span>
                                                </span>
                                            );
                                        })}
                                    </span>
                                );
                            })}
                        </h2>
                    </motion.div>
                    <div className="overflow-hidden mt-3 md:mt-4">
                        <motion.p className="text-sm sm:text-base md:text-lg text-sky-100 font-normal leading-relaxed" style={{ y: descY, opacity: descOpacity, fontFamily: 'Inter' }}>
                            A modern, high-performance website designed and built for a premium lifestyle and business venture agency.
                        </motion.p>
                    </div>
                    <motion.a href="https://sovilifestyleventures.vercel.app" target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-4 md:mt-5 px-5 md:px-6 py-2.5 md:py-3 text-sm rounded-full bg-white text-sky-950 font-bold hover:bg-sky-50 hover:scale-105 transition-all shadow-xl shadow-sky-950/30"
                        style={{ opacity: ctaOpacity }}>
                        Check it out →
                    </motion.a>
                </div>

                {/* Image */}
                <motion.div
                    className="absolute top-[35%] md:top-1/2 right-6 md:right-12 lg:right-16 -translate-y-1/2 w-[85%] md:w-[48%] max-w-xl z-10"
                    style={{ x: imageX, scale: imageScale, opacity: imageOpacity }}
                >
                    <div className="relative rounded-xl overflow-hidden shadow-2xl border border-white/20 shadow-sky-950/40">
                        <img src="/SLV.png" alt="Sovi Lifestyle Ventures" className="w-full h-auto" />
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

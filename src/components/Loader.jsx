import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import loaderBg from '../assets/Loader.png';

const LOADER_TEXT = 'TheAary';

const Loader = ({ onComplete }) => {
  const topPanelRef = useRef(null);
  const bottomPanelRef = useRef(null);
  const textWrapperRef = useRef(null);
  const charsRef = useRef([]);

  useEffect(() => {
    charsRef.current = charsRef.current.slice(0, LOADER_TEXT.length);

    const tl = gsap.timeline({
      onComplete: () => {
        if (onComplete) onComplete();
      },
    });

    // 1. Slide-up reveal: characters start below their mask and slide into view
    tl.from(charsRef.current, {
      yPercent: 110,
      stagger: 0.07,
      duration: 0.6,
      ease: 'power4.out',
    });

    // 2. Hold for the user to read
    tl.to({}, { duration: 0.6 });

    // 3. Slide characters back out (upward, reverse reveal)
    tl.to(charsRef.current, {
      yPercent: -110,
      stagger: 0.04,
      duration: 0.45,
      ease: 'power3.in',
    });

    // 4. Split panels apart (simultaneous)
    tl.to(
      topPanelRef.current,
      {
        yPercent: -100,
        duration: 0.8,
        ease: 'power3.inOut',
      },
    );
    tl.to(
      bottomPanelRef.current,
      {
        yPercent: 100,
        duration: 0.8,
        ease: 'power3.inOut',
      },
      '<'
    );

    return () => tl.kill();
  }, [onComplete]);

  return (
    <>
      {/* ─── Top half panel ─── */}
      <div ref={topPanelRef} className="loader-panel loader-panel-top">
        <div
          className="loader-panel-bg"
          style={{ backgroundImage: `url(${loaderBg})` }}
        />
        <div className="loader-panel-overlay" />
      </div>

      {/* ─── Bottom half panel ─── */}
      <div ref={bottomPanelRef} className="loader-panel loader-panel-bottom">
        <div
          className="loader-panel-bg loader-panel-bg--bottom"
          style={{ backgroundImage: `url(${loaderBg})` }}
        />
        <div className="loader-panel-overlay" />
      </div>

      {/* ─── Centered text ─── */}
      <div ref={textWrapperRef} className="loader-text-wrapper">
        <h1 className="loader-heading" aria-label={LOADER_TEXT}>
          {LOADER_TEXT.split('').map((char, i) => (
            <span key={i} className="loader-char-mask">
              <span
                ref={(el) => { charsRef.current[i] = el; }}
                className="loader-char"
              >
                {char}
              </span>
            </span>
          ))}
        </h1>
      </div>
    </>
  );
};

export default Loader;

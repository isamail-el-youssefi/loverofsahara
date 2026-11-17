import { useState, useEffect } from "react";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import "./ui/motion-loading-fill-text-utils/index.css";

export interface PagePreloaderProps {
  onComplete?: () => void;
}

export function PagePreloader({ onComplete }: PagePreloaderProps) {
  const [isVisible, setIsVisible] = useState(true);

  // Apple Design: Smooth critically damped spring progression
  const progress = useSpring(0, { damping: 26, stiffness: 100 });
  const clipPath = useTransform(progress, [0, 1], ["inset(0 100% 0 0)", "inset(0 0% 0 0)"]);
  const barWidth = useTransform(progress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    // Prevent user scrolling while preloader is active
    document.body.style.overflow = "hidden";

    let currentVal = 0;
    const interval = setInterval(() => {
      currentVal += Math.random() * 0.18 + 0.08;
      if (currentVal >= 1) {
        clearInterval(interval);
        progress.set(1);
        setTimeout(() => {
          setIsVisible(false);
        }, 400);
      } else {
        progress.set(currentVal);
      }
    }, 140);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = "";
    };
  }, [progress]);

  const handleExitComplete = () => {
    document.body.style.overflow = "";
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {isVisible && (
        <motion.div
          key="page-preloader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.01,
            filter: "blur(6px)",
            transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-ink text-white px-6 select-none"
        >
          {/* Subtle vignette gradient harmonized with website dark surfaces */}
          <div className="absolute inset-0  from-transparent via-ink/50 to-ink-deep pointer-events-none" />

          {/* Centered brand content with Apple spatial rhythm */}
          <div className="relative z-10 flex flex-col items-center text-center max-w-[1200px] w-full">
            {/* Apple frosted glass eyebrow badge - identical to HeroSection */}
{/*             <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium text-white/90 mb-6 sm:mb-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]"
            >
              <span>Erg Chegaga • Zagora</span>
            </motion.div> */}

            {/* Headline Display Text with Apple optical negative tracking */}
            <div className="fill-text-container w-full overflow-hidden py-2">
              <div className="fill-text-stack">
                <div
                  className="fill-text fill-text-bg text-[2.2rem] sm:text-[4rem] md:text-[6rem] lg:text-[7rem]  font-bold tracking-[-0.04em] leading-[0.98]"
                  aria-hidden
                >
                  LOVER OF SAHARA
                </div>
                <motion.div
                  className="fill-text fill-text-fill text-[2.2rem] sm:text-[4rem] md:text-[6rem] lg:text-[7rem] font-bold tracking-[-0.04em] leading-[0.98]"
                  style={{ clipPath }}
                >
                  LOVER OF SAHARA
                </motion.div>
              </div>
            </div>

            {/* Apple minimalist progress track */}

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PagePreloader;

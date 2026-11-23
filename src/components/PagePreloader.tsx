import { useState, useEffect } from "react";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import "./ui/motion-loading-fill-text-utils/index.css";

export interface PagePreloaderProps {
  onComplete?: () => void;
}

const WORD = "LOVER OF SAHARA";
/** Same type as the header logo (see `.fill-text` rules in styles.css), extra bold. */
const WORD_SIZE = "text-[1.85rem] sm:text-[4rem] md:text-[6rem] lg:text-[7rem]";

/** The wordmark fills in from the left, then the whole screen slides up. */
export function PagePreloader({ onComplete }: PagePreloaderProps) {
  const [isVisible, setIsVisible] = useState(true);

  // Smooth critically damped spring progression
  const progress = useSpring(0, { damping: 26, stiffness: 100 });
  const clipPath = useTransform(progress, [0, 1], ["inset(0 100% 0 0)", "inset(0 0% 0 0)"]);

  useEffect(() => {
    // Prevent user scrolling while preloader is active
    document.body.style.overflow = "hidden";

    let currentVal = 0;
    const interval = setInterval(() => {
      currentVal += Math.random() * 0.18 + 0.08;
      if (currentVal >= 1) {
        clearInterval(interval);
        progress.set(1);
        setTimeout(() => setIsVisible(false), 400);
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
    onComplete?.();
  };

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {isVisible && (
        <motion.div
          key="page-preloader"
          initial={{ y: 0 }}
          exit={{ y: "-100%", transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-[99999] flex select-none flex-col items-center justify-center bg-ink px-6 text-white"
        >
          <div className="relative z-10 flex w-full max-w-[1200px] flex-col items-center text-center">
            <div className="fill-text-container w-full overflow-hidden py-2">
              <div className="fill-text-stack">
                <div
                  className={`fill-text fill-text-bg ${WORD_SIZE} font-bold leading-[0.98] tracking-[-0.04em]`}
                  aria-hidden
                >
                  {WORD}
                </div>
                <motion.div
                  className={`fill-text fill-text-fill ${WORD_SIZE} font-bold leading-[0.98] tracking-[-0.04em]`}
                  style={{ clipPath }}
                >
                  {WORD}
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PagePreloader;

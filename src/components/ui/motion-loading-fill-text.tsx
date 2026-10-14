"use client"

import { useEffect } from "react"
import { motion, useSpring, useTransform } from "motion/react"
import "./motion-loading-fill-text-utils/index.css"

export interface LoadingFillTextProps {
  text?: string
  className?: string
  textClassName?: string
  onComplete?: () => void
}

function useFillProgress(onComplete?: () => void) {
  const progress = useSpring(0, { damping: 26, stiffness: 100 })

  useEffect(() => {
    let currentVal = 0
    const id = setInterval(() => {
      currentVal += Math.random() * 0.18 + 0.08
      if (currentVal >= 1) {
        clearInterval(id)
        progress.set(1)
        if (onComplete) {
          setTimeout(onComplete, 400)
        }
      } else {
        progress.set(currentVal)
      }
    }, 140)
    return () => clearInterval(id)
  }, [progress, onComplete])

  return progress
}

export function LoadingFillText({
  text = "LOVER OF SAHARA",
  className = "",
  textClassName = "text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-[-0.04em] leading-[0.98]",
  onComplete,
}: LoadingFillTextProps) {
  const progress = useFillProgress(onComplete)
  const clipPath = useTransform(progress, [0, 1], ["inset(0 100% 0 0)", "inset(0 0% 0 0)"])

  return (
    <div className={`fill-text-container ${className}`}>
      <div className="fill-text-stack">
        <div className={`fill-text fill-text-bg ${textClassName}`} aria-hidden>
          {text}
        </div>
        <motion.div className={`fill-text fill-text-fill ${textClassName}`} style={{ clipPath }}>
          {text}
        </motion.div>
      </div>
    </div>
  )
}

export default LoadingFillText

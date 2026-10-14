'use client';
import * as React from 'react';
import { cn } from "@/lib/utils";
import { motion } from 'framer-motion';

export interface TextRollHoverProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  direction?: 'up' | 'down';
}

export const TextRollHover = ({
  children,
  className,
  activeClassName,
  direction = 'up',
  ...props
}: TextRollHoverProps) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const isUp = direction === 'up';

  return (
    <span
      className={cn('relative inline-flex overflow-hidden select-none', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      <motion.span
        className="inline-block text-nowrap"
        animate={{
          y: isHovered ? (isUp ? '-100%' : '100%') : '0%',
          opacity: isHovered ? 0 : 1,
        }}
        transition={{
          duration: 0.28,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        {children}
      </motion.span>
      <motion.span
        className={cn('absolute left-0 top-0 inline-block text-nowrap', activeClassName)}
        initial={{ y: isUp ? '100%' : '-100%', opacity: 0 }}
        animate={{
          y: isHovered ? '0%' : isUp ? '100%' : '-100%',
          opacity: isHovered ? 1 : 0,
        }}
        transition={{
          duration: 0.28,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        {children}
      </motion.span>
    </span>
  );
};

export const TextStaggerHover = TextRollHover;

"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Vertical distance in pixels. */
  distance?: number;
}

/**
 * A single, quiet entrance used across editorial sections. Content is always
 * rendered; motion is removed entirely when the visitor prefers reduced motion.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  distance = 22,
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div className={className} data-reveal="">
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      data-reveal=""
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

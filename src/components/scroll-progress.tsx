"use client";

import { motion, useScroll, useSpring } from "motion/react";

import { useCalm } from "@/lib/motion-preference";

// A red rule across the top of the screen that fills as the page is read.
export function ScrollProgress() {
  const calm = useCalm();
  const { scrollYProgress } = useScroll();
  const eased = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.001,
  });
  const progress = calm ? scrollYProgress : eased;

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-signal"
      style={{ scaleX: progress }}
    />
  );
}

"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";

import { useCalm } from "@/lib/motion-preference";

// A red rule across the top of the screen, with a small square riding its tip
// like a train on the line.
export function ScrollProgress() {
  const calm = useCalm();
  const { scrollYProgress } = useScroll();
  const eased = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.001,
  });
  const progress = calm ? scrollYProgress : eased;
  const trainX = useTransform(progress, (value) => `calc(${value * 100}vw - ${value * 9}px)`);

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-signal"
        style={{ scaleX: progress }}
      />
      <motion.div
        aria-hidden="true"
        className="fixed left-0 top-0 z-50 size-[9px] bg-signal"
        style={{ x: trainX }}
      />
    </>
  );
}

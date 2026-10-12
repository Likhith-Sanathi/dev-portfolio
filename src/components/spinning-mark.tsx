"use client";

import { motion, useScroll, useTransform } from "motion/react";

// The red square in the header turns as the page scrolls: two full turns
// from top to bottom.
export function SpinningMark() {
  const { scrollYProgress } = useScroll();
  const rotate = useTransform(scrollYProgress, (value) => value * 720);

  return (
    <motion.span
      aria-hidden="true"
      data-parallax
      style={{ rotate }}
      className="size-3 shrink-0 bg-signal"
    />
  );
}

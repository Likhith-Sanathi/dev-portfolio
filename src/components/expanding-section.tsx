"use client";

import { motion, useMotionTemplate, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

// The closing beat: the red square used as a marker throughout the page grows
// from the top-left corner until it fills the whole section.
export function ExpandingSection({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start start"],
  });
  // Finishes early because on short phones the section, sitting just above the
  // footer, can never scroll all the way to the top of the viewport.
  const side = useTransform(scrollYProgress, [0.05, 0.7], [3, 150]);
  const inset = useTransform(scrollYProgress, [0.05, 0.7], [1, 0]);
  const clipPath = useMotionTemplate`inset(calc(1.25rem * ${inset}) max(0px, calc(100% - var(--gutter) * ${inset} - ${side}vmax)) max(0px, calc(100% - 1.25rem * ${inset} - ${side}vmax)) calc(var(--gutter) * ${inset}))`;

  return (
    <motion.section
      ref={ref}
      id={id}
      data-parallax
      style={{ clipPath }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

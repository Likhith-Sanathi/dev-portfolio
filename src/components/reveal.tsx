"use client";

import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

type RevealVariant = "rise" | "wipe" | "tilt" | "blast" | "skew" | "zoom";

const variants = {
  rise: {
    hidden: { opacity: 0, y: 28, scale: 0.985 },
    show: { opacity: 1, y: 0, scale: 1 },
  },
  wipe: {
    hidden: {
      opacity: 0,
      y: 18,
      clipPath: "inset(0 100% 0 0 round 24px)",
    },
    show: {
      opacity: 1,
      y: 0,
      clipPath: "inset(0 0% 0 0 round 24px)",
    },
  },
  tilt: {
    hidden: {
      opacity: 0,
      y: 52,
      rotateX: 26,
      rotateZ: -2,
      scale: 0.97,
    },
    show: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      rotateZ: 0,
      scale: 1,
    },
  },
  blast: {
    hidden: {
      opacity: 0,
      y: 68,
      scale: 0.9,
      rotateZ: 4,
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateZ: 0,
    },
  },
  skew: {
    hidden: {
      opacity: 0,
      x: -40,
      skewX: -8,
    },
    show: {
      opacity: 1,
      x: 0,
      skewX: 0,
    },
  },
  zoom: {
    hidden: {
      opacity: 0,
      scale: 1.08,
    },
    show: {
      opacity: 1,
      scale: 1,
    },
  },
} satisfies Record<RevealVariant, { hidden: object; show: object }>;

const transitionByVariant = {
  rise: { duration: 0.56 },
  wipe: { duration: 0.62 },
  tilt: { duration: 0.7 },
  blast: { duration: 0.82 },
  skew: { duration: 0.58 },
  zoom: { duration: 0.52 },
} satisfies Record<RevealVariant, { duration: number }>;

export function Reveal({
  children,
  className,
  delay = 0,
  variant = "rise",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: RevealVariant;
}) {
  const shouldReduceMotion = useReducedMotion();
  const selected = variants[variant];

  return (
    <motion.div
      className={cn("transform-gpu will-change-transform", className)}
      initial={shouldReduceMotion ? false : selected.hidden}
      whileInView={shouldReduceMotion ? undefined : selected.show}
      viewport={{ once: true, margin: "-12% 0px -12% 0px", amount: 0.3 }}
      transition={{
        ...transitionByVariant[variant],
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

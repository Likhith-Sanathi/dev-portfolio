"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.7, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

// A horizontal rule that draws itself from the left edge when it enters view.
// The full-width wrapper is observed so the collapsed line can still trigger.
export function Rule({
  className,
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      aria-hidden="true"
      className={cn("h-px", className)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -5% 0px" }}
    >
      <motion.div
        className="h-full origin-left bg-ink"
        variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1 } }}
        transition={{ duration: 1.1, delay, ease }}
      />
    </motion.div>
  );
}

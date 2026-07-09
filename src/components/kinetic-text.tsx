"use client";

import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

export function KineticText({
  text,
  as = "h2",
  className,
  delay = 0,
}: {
  text: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  delay?: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  const Component = as;

  return (
    <Component
      className={cn(
        "font-heading font-light leading-[0.92] text-[var(--paper)] heading-glow",
        className,
      )}
      aria-label={text}
    >
      {text.split(" ").map((word, index) => (
        <span
          aria-hidden="true"
          className="mr-[0.18em] inline-block overflow-hidden align-bottom pb-[0.12em] pr-[0.05em]"
          key={`${word}-${index}`}
        >
          <motion.span
            className="inline-block transform-gpu"
            initial={
              shouldReduceMotion
              ? false
              : {
                    y: "0.14em",
                    rotateX: 54,
                    rotateZ: index % 2 === 0 ? -4 : 4,
                    scale: 0.985,
                    opacity: 0,
                  }
            }
            whileInView={
              shouldReduceMotion
                ? undefined
                : {
                    y: "0em",
                    rotateX: 0,
                    rotateZ: 0,
                    scale: 1,
                    opacity: 1,
                  }
            }
            viewport={{ once: true, margin: "-14% 0px -14% 0px" }}
            transition={{
              duration: 0.62,
              delay: delay + index * 0.03,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Component>
  );
}

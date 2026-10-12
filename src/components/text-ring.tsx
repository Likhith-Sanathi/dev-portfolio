"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useId } from "react";

import { cn } from "@/lib/utils";

const RADIUS = 38;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// A line of text set round a circle with a red square at its centre, turning
// with the scroll. Decorative: the same words appear on the page as text.
export function TextRing({
  text,
  opacity,
  className,
}: {
  text: string;
  opacity?: MotionValue<number>;
  className?: string;
}) {
  const pathId = `ring-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const { scrollY } = useScroll();
  const rotate = useTransform(scrollY, (value) => value * 0.2);

  return (
    <motion.div
      aria-hidden="true"
      data-scroll-fade
      style={{ opacity }}
      className={cn("pointer-events-none", className)}
    >
      <motion.svg
        viewBox="0 0 100 100"
        data-parallax
        style={{ rotate }}
        className="size-full"
      >
        <defs>
          <path
            id={pathId}
            d={`M 50 50 m -${RADIUS} 0 a ${RADIUS} ${RADIUS} 0 1 1 ${RADIUS * 2} 0 a ${RADIUS} ${RADIUS} 0 1 1 -${RADIUS * 2} 0`}
          />
        </defs>
        <text
          fill="currentColor"
          fontSize={7.2}
          fontWeight={500}
          letterSpacing="0.08em"
          style={{ textTransform: "uppercase" }}
        >
          <textPath
            href={`#${pathId}`}
            textLength={CIRCUMFERENCE - 2}
            lengthAdjust="spacing"
          >
            {text}
          </textPath>
        </text>
        <rect x={42} y={42} width={16} height={16} fill="var(--signal)" />
      </motion.svg>
    </motion.div>
  );
}

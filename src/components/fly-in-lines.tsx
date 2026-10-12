"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

// Each line of a heading flies in from alternating sides of the screen,
// gaining weight, and locks into the left edge as the heading scrolls up into
// place.
export function FlyInLines({
  lines,
  className,
}: {
  lines: readonly string[];
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 25%"],
  });

  return (
    <h2 ref={ref} aria-label={lines.join(" ")} className={className}>
      {lines.map((line, index) => (
        <Line
          key={line}
          progress={scrollYProgress}
          from={index % 2 === 0 ? 70 : -70}
          lag={index * 0.08}
        >
          {line}
        </Line>
      ))}
    </h2>
  );
}

function Line({
  progress,
  from,
  lag,
  children,
}: {
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  from: number;
  lag: number;
  children: string;
}) {
  const t = useTransform(progress, (value) =>
    Math.min(1, Math.max(0, (value - lag) / (1 - lag))),
  );
  const x = useTransform(t, (value) => `${(1 - value) ** 3 * from}vw`);
  // Each line arrives light and gains weight as it locks into place.
  const fontWeight = useTransform(t, (value) => 200 + (1 - (1 - value) ** 3) * 400);

  return (
    <motion.span
      aria-hidden="true"
      data-parallax
      data-weight
      style={{ x, fontWeight }}
      className="block whitespace-nowrap"
    >
      {children}
    </motion.span>
  );
}

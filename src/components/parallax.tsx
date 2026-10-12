"use client";

import { motion, useScroll, useTransform, type UseScrollOptions } from "motion/react";
import { useRef } from "react";

// Moves its children at a different rate from the page while they cross the
// viewport. `from` and `to` are pixel offsets along `axis` at the start and
// end of `offset`. Reduced-motion visitors get no transform (see globals.css).
export function Parallax({
  children,
  className,
  from,
  to,
  axis = "y",
  offset = ["start end", "end start"],
}: {
  children: React.ReactNode;
  className?: string;
  from: number;
  to: number;
  axis?: "x" | "y";
  offset?: UseScrollOptions["offset"];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset });
  const value = useTransform(scrollYProgress, [0, 1], [from, to]);

  return (
    <motion.div
      ref={ref}
      data-parallax
      style={axis === "x" ? { x: value } : { y: value }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

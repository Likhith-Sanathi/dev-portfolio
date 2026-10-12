"use client";

import { motion, useScroll, useTransform, type UseScrollOptions } from "motion/react";
import { useRef } from "react";

// Moves its children vertically at a different rate from the page while they
// cross the viewport. `from` and `to` are pixel offsets at the start and end
// of `offset`. Reduced-motion visitors get no transform (see globals.css).
export function Parallax({
  children,
  className,
  from,
  to,
  offset = ["start end", "end start"],
}: {
  children: React.ReactNode;
  className?: string;
  from: number;
  to: number;
  offset?: UseScrollOptions["offset"];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset });
  const y = useTransform(scrollYProgress, [0, 1], [from, to]);

  return (
    <motion.div ref={ref} data-parallax style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

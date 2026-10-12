"use client";

import { motion, useScroll, useTransform, type UseScrollOptions } from "motion/react";
import { useRef } from "react";

import { useLean } from "@/components/scroll-velocity";

// Moves its children at a different rate from the page while they cross the
// viewport. `from` and `to` are pixel offsets along `axis` at the start and
// end of `offset`; `lean` skews them with scroll speed, up to that many
// degrees. Reduced-motion visitors get no transform (see globals.css).
export function Parallax({
  children,
  className,
  from,
  to,
  axis = "y",
  lean = 0,
  offset = ["start end", "end start"],
}: {
  children: React.ReactNode;
  className?: string;
  from: number;
  to: number;
  axis?: "x" | "y";
  lean?: number;
  offset?: UseScrollOptions["offset"];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset });
  const value = useTransform(scrollYProgress, [0, 1], [from, to]);
  const skewX = useLean(lean);

  return (
    <motion.div
      ref={ref}
      data-parallax
      style={axis === "x" ? { x: value, skewX } : { y: value, skewX }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

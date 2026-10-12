"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

import { cn } from "@/lib/utils";

// A chapter number that slams down from oversize into place behind its heading
// as the heading scrolls in, anchored to its top-right corner.
export function ChapterNumeral({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 25%"],
  });
  const scale = useTransform(scrollYProgress, (value) => {
    const t = Math.min(1, Math.max(0, value));
    return 1 + (1 - t) ** 3 * 2.2;
  });
  const opacity = useTransform(scrollYProgress, (value) =>
    Math.min(1, Math.max(0, value * 2.5)),
  );

  return (
    <motion.span
      ref={ref}
      aria-hidden="true"
      data-parallax
      data-scroll-fade
      style={{ scale, opacity, originX: 1, originY: 0 }}
      className={cn("block", className)}
    >
      {children}
    </motion.span>
  );
}

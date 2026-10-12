"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

import { grid } from "@/lib/grid";
import { cn } from "@/lib/utils";

const COLUMNS = 12;

// The page's 12-column grid drawing itself down behind a chapter heading as
// it arrives, column by column, then fading back out of the way. Purely a
// motion flourish, so it is left out when the page is calm. Place it in a
// positioned container.
export function GridLines() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 15%"],
  });

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(grid, "pointer-events-none absolute inset-0 -z-10 calm:hidden")}
    >
      {Array.from({ length: COLUMNS }, (_, index) => (
        <Column key={index} index={index} progress={scrollYProgress} />
      ))}
    </div>
  );
}

function Column({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const scaleY = useTransform(progress, (value) => {
    const t = Math.min(1, Math.max(0, (value - index * 0.025) / 0.45));
    return 1 - (1 - t) ** 3;
  });
  const opacity = useTransform(progress, (value) =>
    1 - Math.min(1, Math.max(0, (value - 0.7) / 0.3)),
  );

  return (
    <motion.div
      data-parallax
      data-scroll-fade
      style={{ scaleY, opacity }}
      className={cn(
        "h-full origin-top border-x border-signal/25",
        index >= 4 && "hidden md:block",
      )}
    />
  );
}

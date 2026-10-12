"use client";

import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef } from "react";

import { grid } from "@/lib/grid";
import { cn } from "@/lib/utils";

// Pins a statement to the viewport and inks it in word by word, each word
// flipping up into place, so it is read at the pace of the scroll. Reduced-motion
// visitors get the plain paragraph without the pinned runway (globals.css).
export function ScrollStatement({
  label,
  text,
}: {
  label: string;
  text: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const words = text.split(" ");
  const span = 0.72 / words.length;

  return (
    <div ref={ref} className="relative h-[240vh] calm:h-auto">
      <div className="sticky top-0 flex h-svh items-center calm:static calm:h-auto calm:py-20">
        <div className={cn(grid, "w-full gap-y-6")}>
          <p className="col-span-4 text-sm text-mute md:col-span-3">{label}</p>
          <p className="col-span-4 text-[clamp(2rem,4.4vw,4.75rem)] font-semibold leading-[1.02] tracking-[-0.04em] md:col-span-9">
            {words.map((word, index) => (
              <Word
                key={index}
                progress={scrollYProgress}
                range={[0.08 + index * span, 0.08 + (index + 2) * span]}
              >
                {word}
              </Word>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
}

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  // A function transform keeps this on Motion's JS path. The range form gets
  // offloaded to a native scroll timeline that mis-maps these sub-ranges, so
  // words faded back out once the reader scrolled past them.
  const t = useTransform(progress, (value) =>
    Math.min(1, Math.max(0, (value - range[0]) / (range[1] - range[0]))),
  );
  const opacity = useTransform(t, (value) => 0.14 + 0.86 * value);
  // Each word stands up from lying flat, hinged on its baseline, like a flap
  // on a departure board. No perspective once upright keeps the text crisp.
  const rotateX = useTransform(t, (value) => (1 - value) * 88);
  const transformPerspective = useTransform(t, (value) =>
    value > 0.995 ? 0 : 700,
  );

  return (
    <>
      <motion.span
        data-parallax
        data-scroll-fade
        style={{ opacity, rotateX, transformPerspective, originY: 1 }}
        className="inline-block"
      >
        {children}
      </motion.span>{" "}
    </>
  );
}

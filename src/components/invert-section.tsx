"use client";

import { motion, useScroll, useTransform, type MotionStyle } from "motion/react";
import { useRef } from "react";

import { cn } from "@/lib/utils";

// Light and dark values of the palette tokens in globals.css.
const light = { paper: "#f3f2ee", ink: "#111110", mute: "#5f5e59", hairline: "#cfcdc5" };
const dark = { paper: "#111110", ink: "#f3f2ee", mute: "#a3a29b", hairline: "#34332f" };

function phase(value: number, start: number, end: number) {
  return Math.min(1, Math.max(0, (value - start) / (end - start)));
}

// A section that turns the lights out as it takes over the screen and back on
// as it leaves, by swapping the palette tokens its descendants are set in.
export function InvertSection({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const darkness = useTransform(scrollYProgress, (value) =>
    Math.min(phase(value, 0.1, 0.26), 1 - phase(value, 0.78, 0.92)),
  );
  // The background fades, but type flips at the midpoint: a fading text colour
  // would cross the background colour and vanish for a moment.
  const paper = useTransform(darkness, [0, 1], [light.paper, dark.paper]);
  const ink = useTransform(darkness, (value) => (value < 0.5 ? light.ink : dark.ink));
  const mute = useTransform(darkness, (value) => (value < 0.5 ? light.mute : dark.mute));
  const hairline = useTransform(darkness, (value) =>
    value < 0.5 ? light.hairline : dark.hairline,
  );

  const style = {
    "--paper": paper,
    "--ink": ink,
    "--mute": mute,
    "--hairline": hairline,
  } as MotionStyle;

  return (
    <motion.section
      ref={ref}
      id={id}
      style={style}
      className={cn("bg-paper text-ink", className)}
    >
      {children}
    </motion.section>
  );
}

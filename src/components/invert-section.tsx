"use client";

import { motion, useScroll, useTransform, type MotionStyle } from "motion/react";
import { useRef } from "react";

import { useTheme } from "@/lib/theme-preference";
import { cn } from "@/lib/utils";

// The light and dark values of the palette tokens in globals.css.
const palettes = {
  light: { paper: "#f3f2ee", ink: "#111110", mute: "#5f5e59", hairline: "#cfcdc5", signalInk: "#d32a1d" },
  dark: { paper: "#111110", ink: "#f3f2ee", mute: "#a3a29b", hairline: "#34332f", signalInk: "#ef5a48" },
};

function phase(value: number, start: number, end: number) {
  return Math.min(1, Math.max(0, (value - start) / (end - start)));
}

// A section that inverts the page as it takes over the screen and turns back
// as it leaves, by swapping the palette tokens its descendants are set in:
// lights out in light mode, lights on in dark mode.
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
  const theme = useTheme();
  const from = palettes[theme];
  const to = palettes[theme === "dark" ? "light" : "dark"];
  const darkness = useTransform(scrollYProgress, (value) =>
    Math.min(phase(value, 0.1, 0.26), 1 - phase(value, 0.78, 0.92)),
  );
  // The background fades, but type flips at the midpoint: a fading text colour
  // would cross the background colour and vanish for a moment.
  const paper = useTransform(darkness, [0, 1], [from.paper, to.paper]);
  const ink = useTransform(darkness, (value) => (value < 0.5 ? from.ink : to.ink));
  const mute = useTransform(darkness, (value) => (value < 0.5 ? from.mute : to.mute));
  const hairline = useTransform(darkness, (value) =>
    value < 0.5 ? from.hairline : to.hairline,
  );
  const signalInk = useTransform(darkness, (value) =>
    value < 0.5 ? from.signalInk : to.signalInk,
  );

  const style = {
    "--paper": paper,
    "--ink": ink,
    "--mute": mute,
    "--hairline": hairline,
    "--signal-ink": signalInk,
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

"use client";

import { Fragment } from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

const tags = { h1: motion.h1, h2: motion.h2, p: motion.p };

const slide = {
  hidden: { y: "110%" },
  show: { y: "0%" },
};

// Type slides up from behind a mask, like a line being set into a forme.
// Pass `lines` for explicit line breaks, or `text` to mask word by word so
// the heading can still reflow across breakpoints. The heading itself is
// observed, because the masked spans start clipped out of view.
export function MaskText({
  text,
  lines,
  as = "h2",
  className,
  delay = 0,
}: {
  text?: string;
  lines?: readonly React.ReactNode[];
  as?: keyof typeof tags;
  className?: string;
  delay?: number;
}) {
  const Component = tags[as];
  const pieces = lines ?? text?.split(" ") ?? [];
  const isLines = lines !== undefined;

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
    >
      {pieces.map((piece, index) => (
        <Fragment key={index}>
          {!isLines && index > 0 ? " " : null}
          {/* Clipped top and bottom only: the slide is vertical, and the
              tight tracking lets a word's last letter reach past its slot. */}
          <span
            className={cn(
              "-my-[0.1em] overflow-y-clip py-[0.1em]",
              isLines ? "block" : "inline-block align-bottom",
            )}
          >
            <motion.span
              className={isLines ? "block" : "inline-block"}
              variants={slide}
              transition={{
                duration: 0.9,
                delay: delay + index * (isLines ? 0.1 : 0.035),
                ease,
              }}
            >
              {piece}
            </motion.span>
          </span>
        </Fragment>
      ))}
    </Component>
  );
}

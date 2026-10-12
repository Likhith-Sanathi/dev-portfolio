"use client";

import { motion, useScroll, useTransform } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

const slide = {
  hidden: { y: "110%" },
  show: { y: "0%" },
};

// The name sets itself line by line on load, then the two lines pull apart
// as the reader scrolls on: the opening beat of the page.
export function HeroName({
  first,
  last,
  className,
}: {
  first: string;
  last: string;
  className?: string;
}) {
  const { scrollY } = useScroll();
  const firstX = useTransform(scrollY, [0, 900], ["0%", "-16%"]);
  const lastX = useTransform(scrollY, [0, 900], ["0%", "12%"]);

  const lines = [
    { key: "first", x: firstX, content: first },
    {
      key: "last",
      x: lastX,
      content: (
        <>
          {last}
          <span className="text-signal">.</span>
        </>
      ),
    },
  ];

  return (
    <motion.h1
      className={className}
      initial="hidden"
      animate="show"
      aria-label={`${first} ${last}`}
    >
      {lines.map((line, index) => (
        <motion.span
          key={line.key}
          data-parallax
          style={{ x: line.x }}
          className="-my-[0.1em] block overflow-hidden py-[0.1em]"
        >
          <motion.span
            className="block"
            variants={slide}
            transition={{ duration: 0.9, delay: 0.1 + index * 0.1, ease }}
          >
            {line.content}
          </motion.span>
        </motion.span>
      ))}
    </motion.h1>
  );
}

"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

import { frame } from "@/lib/grid";
import { cn } from "@/lib/utils";

function phase(value: number, start: number, end: number) {
  return Math.min(1, Math.max(0, (value - start) / (end - start)));
}

// End credits. The footer is fixed under the page and a transparent spacer at
// the end of the document uncovers it; as it is uncovered the name sets itself
// letter by letter and the red full stop lands last.
export function FooterReveal({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) {
  const spacerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: spacerRef,
    offset: ["start end", "end end"],
  });
  const [first, last] = name.split(" ");
  const dotScale = useTransform(scrollYProgress, (value) =>
    phase(value, 0.82, 0.98),
  );

  let letterIndex = 0;
  const line = (text: string) =>
    text.split("").map((letter) => {
      const index = letterIndex++;
      return (
        <Letter key={index} progress={scrollYProgress} index={index}>
          {letter}
        </Letter>
      );
    });

  return (
    <>
      <div ref={spacerRef} aria-hidden="true" className="h-[72svh]" />
      <footer className="fixed inset-x-0 bottom-0 z-0 flex h-[72svh] flex-col bg-ink text-paper">
        {children}
        <div className={cn(frame, "@container mt-auto pb-4 md:pb-6")}>
          <p className="-ml-[0.06em] whitespace-nowrap text-[length:calc(100cqw/3.4)] font-semibold leading-[0.8] tracking-[-0.065em] md:text-[length:calc(100cqw/6.45)]">
            <span className="sr-only">{name}</span>
            <span aria-hidden="true" className="block overflow-hidden md:inline-block">
              {line(first)}
            </span>
            <span aria-hidden="true"> </span>
            <span aria-hidden="true" className="block overflow-hidden md:inline-block">
              {line(last)}
              <span className="relative ml-[0.035em] inline-block size-[0.145em]">
                <motion.span
                  data-parallax
                  style={{ scale: dotScale }}
                  className="absolute inset-0 bg-signal"
                />
              </span>
            </span>
          </p>
        </div>
      </footer>
    </>
  );
}

function Letter({
  progress,
  index,
  children,
}: {
  progress: MotionValue<number>;
  index: number;
  children: string;
}) {
  const y = useTransform(progress, (value) => {
    const t = phase(value, 0.2 + index * 0.03, 0.62 + index * 0.03);
    return `${(1 - t) ** 3 * 105}%`;
  });

  return (
    <motion.span data-parallax style={{ y }} className="inline-block">
      {children}
    </motion.span>
  );
}

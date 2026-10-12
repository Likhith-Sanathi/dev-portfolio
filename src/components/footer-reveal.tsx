"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

import { FlapTime } from "@/components/flap-time";
import { SwissClock } from "@/components/swiss-clock";
import { frame } from "@/lib/grid";
import { cn } from "@/lib/utils";

function phase(value: number, start: number, end: number) {
  return Math.min(1, Math.max(0, (value - start) / (end - start)));
}

// End credits. The footer is fixed under the page and a transparent spacer at
// the end of the document uncovers it; as it is uncovered the railway clock
// winds up to the time in Cork, the name sets itself letter by letter and the
// red full stop lands last.
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
  const wind = useTransform(scrollYProgress, (value) => phase(value, 0.3, 0.92));

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
        <div className={cn(frame, "mt-auto flex items-end justify-between gap-6")}>
          <div className="pb-1">
            <p className="text-sm text-paper/60">Local time in Cork</p>
            <FlapTime
              className="mt-3 text-3xl font-semibold md:text-5xl"
              cellClassName="bg-paper text-ink"
            />
          </div>
          <SwissClock wind={wind} className="size-[min(24svh,30vw)] shrink-0" />
        </div>
        <div className={cn(frame, "@container pb-4 pt-6 md:pb-6 md:pt-8")}>
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
  const t = useTransform(progress, (value) =>
    phase(value, 0.2 + index * 0.03, 0.62 + index * 0.03),
  );
  const y = useTransform(t, (value) => `${(1 - value) ** 3 * 105}%`);
  const fontWeight = useTransform(t, (value) => 200 + (1 - (1 - value) ** 3) * 400);

  return (
    <motion.span
      data-parallax
      data-weight
      style={{ y, fontWeight }}
      className="inline-block"
    >
      {children}
    </motion.span>
  );
}

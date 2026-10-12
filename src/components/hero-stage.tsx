"use client";

import { ArrowDown } from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

import { frame, grid } from "@/lib/grid";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

// Beats of the pinned runway, as fractions of its scroll progress. After the
// statement the rest of the page slides over the red stage like a curtain.
const SCATTER: Range = [0.02, 0.3];
const ZOOM: Range = [0.15, 0.42];
const STATEMENT: Range = [0.4, 0.6];

// Fixed per-letter speeds, so the name breaks apart unevenly but repeatably.
const firstSpeeds = [0.95, 0.4, 1.25, 0.65, 1.1, 0.5, 0.85];
const lastSpeeds = [0.55, 1.15, 0.75, 1.35, 0.45, 1.0, 0.7];
const metaSpeeds = [0.5, 1.1, 0.75, 1.4];

type Range = [number, number];

function phase(value: number, [start, end]: Range) {
  return Math.min(1, Math.max(0, (value - start) / (end - start)));
}

function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

const rise = {
  hidden: { y: "40%", opacity: 0 },
  show: { y: "0%", opacity: 1 },
};

export function HeroStage({
  first,
  last,
  meta,
  statement,
}: {
  first: string;
  last: string;
  meta: readonly { label: string; content: React.ReactNode }[];
  statement: string;
}) {
  const runwayRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const [cover, setCover] = useState(60);

  // How far the full stop must scale to cover the stage from where it sits.
  useEffect(() => {
    const stage = stageRef.current;
    const dot = dotRef.current;
    if (!stage || !dot) {
      return;
    }

    function measure() {
      if (!stage || !dot) {
        return;
      }
      const s = stage.getBoundingClientRect();
      const d = dot.getBoundingClientRect();
      const cx = d.left + d.width / 2 - s.left;
      const cy = d.top + d.height / 2 - s.top;
      const reach = Math.max(cx, s.width - cx, cy, s.height - cy);
      setCover(Math.max(1, ((reach * 2) / d.width) * 1.06));
    }

    // Re-measure once the webfont lands, since it moves the full stop.
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) {
        measure();
      }
    });
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ["start 56px", "end end"],
  });

  const dotScale = useTransform(scrollYProgress, (value) =>
    cover ** easeInOut(phase(value, ZOOM)),
  );
  const cueOpacity = useTransform(scrollYProgress, (value) =>
    1 - phase(value, [0, 0.04]),
  );
  const labelOpacity = useTransform(scrollYProgress, (value) =>
    phase(value, [STATEMENT[0], STATEMENT[0] + 0.05]),
  );
  const words = statement.split(" ");
  const step = (STATEMENT[1] - STATEMENT[0] - 0.06) / words.length;

  return (
    <section
      ref={runwayRef}
      aria-label="Introduction"
      className="relative h-[380svh] motion-reduce:h-auto"
    >
      <div
        ref={stageRef}
        className="sticky top-14 h-[calc(100svh-3.5rem)] overflow-hidden motion-reduce:static motion-reduce:h-auto"
      >
        <div
          className={cn(
            frame,
            "@container flex h-full flex-col pb-5 pt-6 md:pb-8 md:pt-8",
          )}
        >
          <div className={cn(grid, "gap-y-6 text-sm leading-snug")}>
            {meta.map((item, index) => (
              <MetaColumn
                key={item.label}
                label={item.label}
                progress={scrollYProgress}
                speed={metaSpeeds[index % metaSpeeds.length]}
                delay={index * 0.06}
              >
                {item.content}
              </MetaColumn>
            ))}
          </div>

          <motion.h1
            initial="hidden"
            animate="show"
            aria-label={`${first} ${last}`}
            className="-ml-[0.06em] mt-12 text-[length:min(100cqw/3.4,(100svh_-_15rem)/1.62)] font-semibold leading-[0.8] tracking-[-0.065em] md:mt-14"
          >
            <span aria-hidden="true" className="block whitespace-nowrap">
              {first.split("").map((letter, index) => (
                <Letter
                  key={index}
                  progress={scrollYProgress}
                  distance={-firstSpeeds[index % firstSpeeds.length] * 110}
                  delay={0.1 + index * 0.035}
                >
                  {letter}
                </Letter>
              ))}
            </span>
            <span aria-hidden="true" className="block whitespace-nowrap">
              {last.split("").map((letter, index) => (
                <Letter
                  key={index}
                  progress={scrollYProgress}
                  distance={lastSpeeds[index % lastSpeeds.length] * 110}
                  delay={0.2 + index * 0.035}
                >
                  {letter}
                </Letter>
              ))}
              {/* The full stop: a red square that later floods the stage. */}
              <span
                ref={dotRef}
                className="relative ml-[0.035em] inline-block size-[0.145em]"
              >
                <motion.span
                  variants={rise}
                  transition={{ duration: 0.8, delay: 0.5, ease }}
                  className="absolute inset-0"
                >
                  <motion.span
                    data-parallax
                    style={{ scale: dotScale }}
                    className="absolute inset-0 bg-signal"
                  />
                </motion.span>
              </span>
            </span>
          </motion.h1>

          <motion.p
            style={{ opacity: cueOpacity }}
            data-scroll-fade
            className="mt-auto flex items-center gap-2 text-sm motion-reduce:hidden"
          >
            Scroll to begin
            <ArrowDown className="size-4" strokeWidth={1.75} />
          </motion.p>
        </div>

        <div className="pointer-events-none absolute inset-0 z-20 flex items-center text-white motion-reduce:static motion-reduce:bg-signal motion-reduce:py-24">
          <div className={cn(frame, grid, "w-full gap-y-6")}>
            <motion.p
              data-scroll-fade
              style={{ opacity: labelOpacity }}
              className="col-span-4 text-sm md:col-span-3"
            >
              In short
            </motion.p>
            <p className="col-span-4 text-pretty text-[clamp(2.25rem,5.4vw,6.25rem)] font-semibold leading-none tracking-[-0.045em] md:col-span-9">
              {words.map((word, index) => (
                <StatementWord
                  key={index}
                  progress={scrollYProgress}
                  range={[
                    STATEMENT[0] + 0.04 + index * step,
                    STATEMENT[0] + 0.04 + (index + 3) * step,
                  ]}
                >
                  {word}
                </StatementWord>
              ))}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function MetaColumn({
  label,
  progress,
  speed,
  delay,
  children,
}: {
  label: string;
  progress: MotionValue<number>;
  speed: number;
  delay: number;
  children: React.ReactNode;
}) {
  const y = useTransform(progress, (value) => `${-phase(value, [0, 0.2]) * speed * 30}vh`);
  const opacity = useTransform(progress, (value) => 1 - phase(value, [0.04, 0.16]));

  return (
    <motion.div
      data-parallax
      data-scroll-fade
      style={{ y, opacity }}
      className="col-span-2 md:col-span-3"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay, ease }}
      >
        <p className="text-mute">{label}</p>
        <div className="mt-1 max-w-[22rem] font-medium">{children}</div>
      </motion.div>
    </motion.div>
  );
}

function Letter({
  progress,
  distance,
  delay,
  children,
}: {
  progress: MotionValue<number>;
  distance: number;
  delay: number;
  children: string;
}) {
  const y = useTransform(
    progress,
    (value) => `${phase(value, SCATTER) ** 1.6 * distance}vh`,
  );

  return (
    <motion.span data-parallax style={{ y }} className="inline-block">
      <motion.span
        variants={rise}
        transition={{ duration: 0.8, delay, ease }}
        className="inline-block"
      >
        {children}
      </motion.span>
    </motion.span>
  );
}

function StatementWord({
  progress,
  range,
  children,
}: {
  progress: MotionValue<number>;
  range: Range;
  children: string;
}) {
  const y = useTransform(progress, (value) => `${(1 - phase(value, range)) * 0.6}em`);
  const opacity = useTransform(progress, (value) => phase(value, range));

  return (
    <>
      <motion.span
        data-parallax
        data-scroll-fade
        style={{ y, opacity }}
        className="inline-block"
      >
        {children}
      </motion.span>{" "}
    </>
  );
}

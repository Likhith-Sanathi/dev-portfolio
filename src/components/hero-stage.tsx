"use client";

import { ArrowDown } from "lucide-react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
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

// Fixed per-letter flight, so the name breaks apart unevenly but repeatably:
// vertical distance (vh), sideways drift (vw), spin (deg), and depth for the
// pointer parallax.
const firstFlight = {
  rise: [0.95, 0.4, 1.25, 0.65, 1.1, 0.5, 0.85],
  drift: [-14, -7, -11, -2, 5, 3, 12],
  spin: [-38, 24, -14, 52, -26, 18, -44],
  depth: [0.7, 1.6, 1, 2, 0.8, 1.4, 1.1],
};
const lastFlight = {
  rise: [0.55, 1.15, 0.75, 1.35, 0.45, 1, 0.7],
  drift: [-12, -4, -9, 2, 7, 10, 15],
  spin: [30, -48, 16, -22, 40, -12, 34],
  depth: [1.3, 0.8, 1.8, 0.9, 1.5, 0.7, 1.2],
};
const metaSpeeds = [0.5, 1.1, 0.75, 1.4];

type Range = [number, number];
type IntroStage = "count" | "collapse" | "done";

function phase(value: number, [start, end]: Range) {
  return Math.min(1, Math.max(0, (value - start) / (end - start)));
}

function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
  // Generous until measured, so the opening red always covers the stage.
  const [cover, setCover] = useState(140);
  const reduceMotion = useReducedMotion();

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

  // Opening sequence: the stage starts flooded red while a counter runs to
  // 100, then the red collapses into the full stop and the name sets itself.
  // Scrolling later plays the same move in reverse.
  const count = useMotionValue(0);
  const intro = useMotionValue(1);
  const [stage, setStage] = useState<IntroStage>("count");
  const introStage: IntroStage = reduceMotion ? "done" : stage;
  const counter = useTransform(count, (value) =>
    String(Math.round(value)).padStart(3, "0"),
  );

  useEffect(() => {
    if (reduceMotion) {
      intro.set(0);
      return;
    }

    let cancelled = false;
    const running: { stop: () => void }[] = [];

    async function play() {
      await Promise.race([document.fonts.ready, wait(1500)]);
      if (cancelled) {
        return;
      }
      const counting = animate(count, 100, {
        duration: 1.2,
        ease: [0.65, 0, 0.35, 1],
      });
      running.push(counting);
      await counting;
      if (cancelled) {
        return;
      }
      setStage("collapse");
      const collapsing = animate(intro, 0, {
        duration: 1.1,
        ease: [0.76, 0, 0.24, 1],
      });
      running.push(collapsing);
      await collapsing;
      if (!cancelled) {
        setStage("done");
      }
    }

    play();
    return () => {
      cancelled = true;
      running.forEach((animation) => animation.stop());
    };
  }, [reduceMotion, count, intro]);

  // Pointer position, -1 to 1 on each axis, eased so the letters float.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const floatX = useSpring(pointerX, { stiffness: 70, damping: 18, mass: 0.6 });
  const floatY = useSpring(pointerY, { stiffness: 70, damping: 18, mass: 0.6 });

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }
    function onMove(event: PointerEvent) {
      pointerX.set((event.clientX / window.innerWidth) * 2 - 1);
      pointerY.set((event.clientY / window.innerHeight) * 2 - 1);
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [pointerX, pointerY]);

  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ["start 56px", "end end"],
  });

  const dotScale = useTransform([scrollYProgress, intro], ([value, opening]) =>
    cover ** Math.max(opening as number, easeInOut(phase(value as number, ZOOM))),
  );
  const cueOpacity = useTransform(scrollYProgress, (value) =>
    1 - phase(value, [0, 0.04]),
  );
  const labelOpacity = useTransform(scrollYProgress, (value) =>
    phase(value, [STATEMENT[0], STATEMENT[0] + 0.05]),
  );
  const words = statement.split(" ");
  const step = (STATEMENT[1] - STATEMENT[0] - 0.06) / words.length;
  const nameIn = introStage !== "count";

  const lines = [
    { text: first, flight: firstFlight, direction: -1, delay: 0.25 },
    { text: last, flight: lastFlight, direction: 1, delay: 0.35 },
  ];

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
                delay={0.5 + index * 0.06}
                visible={nameIn}
              >
                {item.content}
              </MetaColumn>
            ))}
          </div>

          <motion.h1
            initial="hidden"
            animate={nameIn ? "show" : "hidden"}
            aria-label={`${first} ${last}`}
            className="-ml-[0.06em] mt-12 text-[length:min(100cqw/3.4,(100svh_-_15rem)/1.62)] font-semibold leading-[0.8] tracking-[-0.065em] md:mt-14"
          >
            {lines.map((line, lineIndex) => (
              <span
                key={line.text}
                aria-hidden="true"
                className="block whitespace-nowrap"
              >
                {line.text.split("").map((letter, index) => {
                  const pick = (values: number[]) => values[index % values.length];

                  return (
                    <Letter
                      key={index}
                      progress={scrollYProgress}
                      pointerX={floatX}
                      pointerY={floatY}
                      rise={line.direction * pick(line.flight.rise) * 110}
                      drift={pick(line.flight.drift)}
                      spin={pick(line.flight.spin)}
                      depth={pick(line.flight.depth)}
                      delay={line.delay + index * 0.035}
                    >
                      {letter}
                    </Letter>
                  );
                })}
                {lineIndex === lines.length - 1 ? (
                  // The full stop: a red square that floods the stage.
                  <span
                    ref={dotRef}
                    className="relative ml-[0.035em] inline-block size-[0.145em]"
                  >
                    <motion.span
                      data-parallax
                      style={{ scale: dotScale }}
                      className="absolute inset-0 bg-signal"
                    />
                  </span>
                ) : null}
              </span>
            ))}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: introStage === "done" ? 1 : 0 }}
            transition={{ duration: 0.6 }}
            className="mt-auto motion-reduce:hidden"
          >
            <motion.p
              style={{ opacity: cueOpacity }}
              className="flex items-center gap-2 text-sm"
            >
              Scroll to begin
              <ArrowDown className="size-4" strokeWidth={1.75} />
            </motion.p>
          </motion.div>
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

        {/* The opening counter, set in white on the flooded stage. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-30 text-white motion-reduce:hidden"
        >
          <div
            className={cn(
              frame,
              "flex h-full flex-col justify-between pb-5 pt-6 md:pb-8 md:pt-8",
            )}
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: introStage === "count" ? 1 : 0 }}
              transition={{ duration: 0.4 }}
              className="flex justify-between text-sm font-medium"
            >
              <span>
                {first} {last}
              </span>
              <span>Portfolio, 2026</span>
            </motion.p>
            <span className="block overflow-hidden">
              <motion.span
                initial={{ y: "100%" }}
                animate={{ y: introStage === "count" ? "0%" : "-105%" }}
                transition={{ duration: 0.75, ease }}
                className="block text-[clamp(7rem,30vw,30rem)] font-semibold leading-[0.8] tracking-[-0.06em] tabular-nums"
              >
                {counter}
              </motion.span>
            </span>
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
  visible,
  children,
}: {
  label: string;
  progress: MotionValue<number>;
  speed: number;
  delay: number;
  visible: boolean;
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
        animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
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
  pointerX,
  pointerY,
  rise: distance,
  drift,
  spin,
  depth,
  delay,
  children,
}: {
  progress: MotionValue<number>;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  rise: number;
  drift: number;
  spin: number;
  depth: number;
  delay: number;
  children: string;
}) {
  // Scroll throws each letter on its own path; the pointer adds a small
  // counter-movement scaled by depth, so the name reads as layered.
  const x = useTransform([progress, pointerX], ([value, pointer]) => {
    const t = phase(value as number, SCATTER) ** 1.6;
    return `calc(${t * drift}vw + ${(pointer as number) * depth * -22}px)`;
  });
  const y = useTransform([progress, pointerY], ([value, pointer]) => {
    const t = phase(value as number, SCATTER) ** 1.6;
    return `calc(${t * distance}vh + ${(pointer as number) * depth * -14}px)`;
  });
  const rotate = useTransform(progress, (value) =>
    phase(value, SCATTER) ** 1.6 * spin,
  );

  return (
    <motion.span
      data-parallax
      style={{ x, y, rotate }}
      className="inline-block"
    >
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

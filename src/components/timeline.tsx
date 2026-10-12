"use client";

import { ArrowDown } from "lucide-react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";

import type { TimelineEvent } from "@/lib/timeline";
import { cn, pad } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

const roll = {
  enter: (direction: number) => ({ y: direction > 0 ? "100%" : "-100%" }),
  center: { y: "0%" },
  exit: (direction: number) => ({ y: direction > 0 ? "-100%" : "100%" }),
};

// A chronological story. The year stays pinned beside the events and rolls
// over, digit by digit, as each milestone crosses the middle of the screen.
export function Timeline({ events }: { events: readonly TimelineEvent[] }) {
  const listRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState({ index: 0, direction: 1 });
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start center", "end center"],
  });

  const current = events[active.index];
  const years = [...new Set(events.map((event) => event.year))];

  function activate(index: number) {
    setActive((previous) =>
      previous.index === index
        ? previous
        : { index, direction: index > previous.index ? 1 : -1 },
    );
  }

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-x-6">
      <aside
        aria-hidden="true"
        className="sticky top-14 z-10 -mx-4 border-b border-ink bg-paper px-4 pb-3 pt-4 md:-mx-8 md:px-8 lg:top-24 lg:col-span-5 lg:mx-0 lg:self-start lg:border-b-0 lg:bg-transparent lg:p-0"
      >
        <div className="flex items-end justify-between gap-4 lg:block">
          <div>
            <p className="hidden justify-between text-sm lg:flex">
              <span>Milestone</span>
              <span className="tabular-nums text-mute">
                {pad(active.index + 1)} / {pad(events.length)}
              </span>
            </p>
            <RollingYear
              year={current.year}
              direction={active.direction}
              className="text-5xl font-semibold tracking-[-0.06em] lg:mt-6 lg:text-[clamp(5rem,14.5vw,15rem)]"
            />
          </div>
          <div className="text-right text-sm lg:mt-6 lg:text-left">
            <p className="font-medium lg:text-2xl lg:tracking-[-0.02em]">
              {current.month}
              <span className="text-mute"> / {current.kind}</span>
            </p>
            <p className="tabular-nums text-mute lg:hidden">
              {pad(active.index + 1)} / {pad(events.length)}
            </p>
          </div>
        </div>
        <div className="relative mt-3 h-px bg-hairline lg:mt-8">
          <motion.div
            className="absolute inset-x-0 -top-px h-[3px] origin-left bg-signal"
            style={{ scaleX: scrollYProgress }}
          />
        </div>
        <ul className="mt-4 hidden gap-6 text-sm tabular-nums lg:flex">
          {years.map((year) => (
            <li
              key={year}
              className={cn(
                "transition-colors duration-300",
                year === current.year ? "text-ink" : "text-hairline",
              )}
            >
              {year}
            </li>
          ))}
        </ul>
      </aside>

      <ol
        ref={listRef}
        className="lg:col-span-7 lg:col-start-6 lg:border-t lg:border-ink"
      >
        {events.map((event, index) => (
          <TimelineItem
            key={event.id}
            event={event}
            isActive={index === active.index}
            onActivate={() => activate(index)}
          />
        ))}
      </ol>
    </div>
  );
}

// Milestones swing out to the side the further they sit from the middle of
// the screen, so the list turns past the reader like a rolodex.
function TimelineItem({
  event,
  isActive,
  onActivate,
}: {
  event: TimelineEvent;
  isActive: boolean;
  onActivate: () => void;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const x = useTransform(scrollYProgress, (value) => {
    const distance = (value - 0.5) * 2;
    return `${distance * distance * 14}vw`;
  });

  return (
    <motion.li
      ref={ref}
      data-parallax
      style={{ x }}
      onViewportEnter={onActivate}
      viewport={{ margin: "-45% 0px -54% 0px" }}
      className={cn(
        "border-b border-hairline py-10 transition-opacity duration-500 md:py-14",
        isActive ? "opacity-100" : "opacity-30 motion-reduce:opacity-100",
      )}
    >
      <div className="flex items-center gap-3 text-sm">
        <span
          aria-hidden="true"
          className={cn(
            "size-2 shrink-0 bg-signal transition-opacity duration-300",
            isActive ? "opacity-100" : "opacity-0",
          )}
        />
        <span className="tabular-nums">{event.period}</span>
        <span className="text-mute">{event.kind}</span>
      </div>
      <h3 className="mt-4 text-balance text-[clamp(1.75rem,3.2vw,3rem)] font-semibold leading-none tracking-[-0.04em]">
        {event.title}
      </h3>
      {event.subtitle ? (
        <p className="mt-3 text-base text-mute md:text-lg">
          {event.subtitle}
        </p>
      ) : null}
      {event.body ? (
        <p className="mt-6 max-w-[62ch] text-base leading-relaxed">
          {event.body}
        </p>
      ) : null}
      {event.points ? (
        <ol className="mt-6 max-w-[62ch] space-y-4 text-mute">
          {event.points.map((point, pointIndex) => (
            <li key={point} className="flex gap-4">
              <span className="w-5 shrink-0 tabular-nums text-ink">
                {pad(pointIndex + 1)}
              </span>
              <span>{point}</span>
            </li>
          ))}
        </ol>
      ) : null}
      {event.topics ? (
        <p className="mt-6 max-w-[62ch] text-sm leading-relaxed">
          <span className="text-mute">Relevant coursework</span>
          <br />
          {event.topics.join(" / ")}
        </p>
      ) : null}
      {event.href ? (
        <a
          href={event.href}
          className="mt-6 inline-flex items-center gap-1 text-sm font-medium transition-colors duration-200 hover:text-signal"
        >
          {event.linkLabel}
          <ArrowDown className="size-4" strokeWidth={1.75} />
        </a>
      ) : null}
    </motion.li>
  );
}

function RollingYear({
  year,
  direction,
  className,
}: {
  year: string;
  direction: number;
  className?: string;
}) {
  return (
    <span className={cn("flex leading-[0.85] tabular-nums", className)}>
      {year.split("").map((digit, index) => (
        <span
          key={index}
          className="relative -my-[0.06em] inline-block overflow-hidden py-[0.06em]"
        >
          <AnimatePresence
            mode="popLayout"
            initial={false}
            custom={direction}
          >
            <motion.span
              key={digit}
              custom={direction}
              variants={roll}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.55, delay: index * 0.04, ease }}
              className="inline-block"
            >
              {digit}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
    </span>
  );
}

"use client";

import { ArrowDown } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { memo, useCallback, useRef, useState } from "react";

import { ScrambleText } from "@/components/scramble-text";
import { SplitFlap } from "@/components/split-flap";
import type { TimelineEvent } from "@/lib/timeline";
import { cn, pad } from "@/lib/utils";

// A chronological story. The year stays pinned beside the events on a
// split-flap board and flips over as each milestone crosses the middle of
// the screen.
export function Timeline({ events }: { events: readonly TimelineEvent[] }) {
  const listRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState({ index: 0 });
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start center", "end center"],
  });

  const current = events[active.index];
  const years = [...new Set(events.map((event) => event.year))];

  // Stable, so a change of milestone re-renders only the two items whose
  // state changed rather than the whole drum.
  const activate = useCallback((index: number) => {
    setActive((previous) => (previous.index === index ? previous : { index }));
  }, []);

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-x-6">
      <aside
        aria-hidden="true"
        className="sticky top-14 z-10 -mx-4 border-b border-ink bg-paper px-4 pb-3 pt-4 md:-mx-8 md:px-8 lg:top-24 lg:col-span-5 lg:mx-0 lg:self-start lg:border-b-0 lg:bg-transparent lg:p-0"
      >
        <div className="flex items-end justify-between gap-4 lg:block">
          <div>
            <p className="hidden items-center justify-between text-sm lg:flex">
              <span>Milestone</span>
              <span className="flex items-center gap-1.5 tabular-nums text-mute">
                <SplitFlap
                  value={pad(active.index + 1)}
                  cellClassName="bg-ink text-paper"
                />
                / {pad(events.length)}
              </span>
            </p>
            <SplitFlap
              value={current.year}
              cellClassName="bg-ink text-paper"
              className="text-5xl font-semibold tracking-[-0.04em] lg:mt-6 lg:text-[clamp(4.5rem,12.5vw,13rem)]"
            />
          </div>
          <div className="text-right text-sm lg:mt-6 lg:text-left">
            <p className="font-medium lg:text-2xl lg:tracking-[-0.02em]">
              <ScrambleText text={current.month} trigger="change" />
              <span className="text-mute">
                {" / "}
                <ScrambleText text={current.kind} trigger="change" />
              </span>
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
            index={index}
            isActive={index === active.index}
            onActivate={activate}
          />
        ))}
      </ol>
    </div>
  );
}

// Milestones sit on a drum: each tips back the further it is from the middle
// of the screen and shrinks slightly, so the list turns past the reader like
// a rolodex.
const TimelineItem = memo(function TimelineItem({
  event,
  index,
  isActive,
  onActivate,
}: {
  event: TimelineEvent;
  index: number;
  isActive: boolean;
  onActivate: (index: number) => void;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const rotateX = useTransform(scrollYProgress, (value) => {
    const distance = Math.max(-1, Math.min(1, (value - 0.5) * 2));
    return distance * 58;
  });
  const scale = useTransform(scrollYProgress, (value) => {
    const distance = Math.min(1, Math.abs((value - 0.5) * 2));
    return 1 - distance * distance * 0.14;
  });
  // Perspective only while tilted, so an upright milestone renders crisp.
  const transformPerspective = useTransform(rotateX, (value) =>
    Math.abs(value) < 0.05 ? 0 : 1100,
  );

  return (
    <motion.li
      ref={ref}
      data-parallax
      style={{ rotateX, scale, transformPerspective }}
      onViewportEnter={() => onActivate(index)}
      viewport={{ margin: "-45% 0px -54% 0px" }}
      className={cn(
        "border-b border-hairline py-10 transition-opacity duration-500 md:py-14",
        isActive ? "opacity-100" : "opacity-30 calm:opacity-100",
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
});

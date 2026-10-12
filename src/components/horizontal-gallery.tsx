"use client";

import { ArrowUpRight } from "lucide-react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

import type { portfolio } from "@/lib/portfolio-content";
import { useCalm } from "@/lib/motion-preference";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn, pad } from "@/lib/utils";

type Project = (typeof portfolio.projects)[number];

// Vertical scroll drives a pinned horizontal track of project panels, with a
// giant index numeral behind each panel moving at its own speed. Falls back
// to a plain vertical list for calm visitors and very short screens.
export function HorizontalGallery({
  projects,
}: {
  projects: readonly Project[];
}) {
  const tallEnough = useMediaQuery("(min-height: 560px)", true);
  const calm = useCalm();
  const enabled = tallEnough && !calm;
  const runwayRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const [metrics, setMetrics] = useState({ distance: 0, panel: 0 });
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!enabled || !track) {
      return;
    }

    const observer = new ResizeObserver(() => {
      const first = track.firstElementChild as HTMLElement | null;
      setMetrics({
        distance: Math.max(
          0,
          track.scrollWidth - document.documentElement.clientWidth,
        ),
        panel: first?.offsetWidth ?? 0,
      });
    });
    observer.observe(track);
    observer.observe(document.documentElement);
    return () => observer.disconnect();
  }, [enabled]);

  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ["start 56px", "end end"],
  });
  const x = useTransform(scrollYProgress, (value) =>
    enabled ? -value * metrics.distance : 0,
  );

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setActive(Math.round(value * (projects.length - 1)));
  });

  return (
    <div
      ref={runwayRef}
      className="relative"
      style={
        enabled
          ? { height: `calc(100svh - 3.5rem + ${metrics.distance}px)` }
          : undefined
      }
    >
      {/* Anchor targets placed where each panel reaches the left edge. */}
      {enabled
        ? projects.map((project, index) => (
            <span
              key={project.title}
              id={`project-${pad(index + 1)}`}
              aria-hidden="true"
              className="absolute left-0"
              style={{ top: index * metrics.panel }}
            />
          ))
        : null}

      <div
        className={cn(
          // Opaque, so the section heading's drifting numeral can't show through.
          enabled &&
            "sticky top-14 h-[calc(100svh-3.5rem)] overflow-hidden bg-paper",
        )}
      >
        <motion.ol
          ref={trackRef}
          style={{ x }}
          className={cn(
            enabled
              ? "flex h-full w-max pl-4 pr-[8vw] md:pl-8 lg:pl-10"
              : "border-b border-ink px-4 md:px-8 lg:px-10",
          )}
        >
          {projects.map((project, index) => (
            <Panel
              key={project.title}
              project={project}
              index={index}
              horizontal={enabled}
              trackX={x}
              panelWidth={metrics.panel}
            />
          ))}
        </motion.ol>

        {enabled ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 px-4 pb-5 md:px-8 lg:px-10">
            <div className="flex items-center justify-between text-sm">
              <span>Selected projects</span>
              <span className="tabular-nums text-mute">
                {pad(active + 1)} / {pad(projects.length)}
              </span>
            </div>
            <div className="relative mt-3 h-px bg-hairline">
              <motion.div
                className="absolute inset-x-0 -top-px h-[3px] origin-left bg-signal"
                style={{ scaleX: scrollYProgress }}
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Panel({
  project,
  index,
  horizontal,
  trackX,
  panelWidth,
}: {
  project: Project;
  index: number;
  horizontal: boolean;
  trackX: MotionValue<number>;
  panelWidth: number;
}) {
  // The numeral outruns its panel by half again, so it races in from the right
  // as the panel arrives and is clipped away while it leaves.
  const numeralX = useTransform(trackX, (value) =>
    horizontal ? (index * panelWidth + value) * 0.5 : 0,
  );

  return (
    <li
      id={horizontal ? undefined : `project-${pad(index + 1)}`}
      className={cn(
        "relative",
        horizontal
          ? "flex h-full w-[86vw] shrink-0 flex-col overflow-hidden border-l border-ink px-5 pb-24 pt-4 md:w-[72vw] md:px-8 md:pb-28 lg:w-[60vw]"
          : "border-t border-ink",
      )}
    >
      {horizontal ? (
        <motion.span
          aria-hidden="true"
          style={{ x: numeralX }}
          className="pointer-events-none absolute -right-[0.04em] top-6 select-none text-[clamp(11rem,42vh,30rem)] font-semibold leading-[0.75] tracking-[-0.07em] text-hairline/70"
        >
          {pad(index + 1)}
        </motion.span>
      ) : null}

      <a
        href={project.githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${project.title}, view on GitHub`}
        data-cursor="view"
        className={cn(
          "group relative flex flex-col focus-visible:outline-offset-[-2px]",
          horizontal ? "h-full" : "py-8",
        )}
      >
        <div className="flex items-center gap-4 text-sm">
          <span className="w-8 shrink-0 font-medium tabular-nums transition-colors duration-200 group-hover:text-signal">
            {pad(index + 1)}
          </span>
          <span className="min-w-0 flex-1 truncate text-mute">
            {project.type}
          </span>
          <span className="shrink-0 tabular-nums text-mute">
            {project.period}
          </span>
        </div>

        <div className={cn(horizontal ? "mt-auto" : "mt-6")}>
          <h3 className="max-w-[14ch] text-balance text-[clamp(2.25rem,5vw,5.25rem)] font-semibold leading-[0.92] tracking-[-0.05em]">
            {project.title}
          </h3>
          <div className="mt-6 grid gap-6 md:mt-8 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:gap-8">
            <p className="text-base leading-relaxed">{project.description}</p>
            <div>
              <p className="flex gap-3 text-base font-medium leading-snug">
                <span
                  aria-hidden="true"
                  className="mt-[0.45em] size-2 shrink-0 bg-signal"
                />
                {project.impact}
              </p>
              <p className="mt-4 text-sm text-mute">
                {project.tags.join(" / ")}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium transition-colors duration-200 group-hover:text-signal">
                GitHub
                <ArrowUpRight
                  className="size-5 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  strokeWidth={1.75}
                />
              </span>
            </div>
          </div>
        </div>
      </a>
    </li>
  );
}

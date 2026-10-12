"use client";

import type { MotionValue } from "motion/react";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

const formatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Dublin",
  hour: "numeric",
  minute: "numeric",
  hourCycle: "h23",
});

function corkHourAndMinute(now: number) {
  const parts = formatter.formatToParts(now);
  const read = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value ?? 0);
  return { hour: read("hour"), minute: read("minute") };
}

const hourMarks = Array.from({ length: 12 }, (_, index) => index * 30);
const minuteMarks = Array.from({ length: 60 }, (_, index) => index * 6).filter(
  (angle) => angle % 30 !== 0,
);

// Hans Hilfiker's Swiss railway clock, keeping Cork time. The red seconds hand
// sweeps round in 58.5 seconds, waits at twelve, and the minute hand jumps on
// the minute. With `wind`, the hands sweep up from twelve o'clock as that
// value runs from 0 to 1, and the clock only runs once it has been wound.
export function SwissClock({
  className,
  wind,
}: {
  className?: string;
  wind?: MotionValue<number>;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const hourRef = useRef<SVGGElement>(null);
  const minuteRef = useRef<SVGGElement>(null);
  const secondRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) {
      return;
    }

    let frame = 0;
    let visible = false;
    let running = false;
    // Full turns the minute hand has made, so passing :59 keeps it moving
    // forwards instead of easing all the way back round.
    let laps = 0;
    let lastMinute = -1;

    function draw() {
      const now = Date.now();
      const { hour, minute } = corkHourAndMinute(now);
      const secondsIntoMinute = (now % 60000) / 1000;
      const wound = wind ? Math.min(1, Math.max(0, wind.get())) : 1;

      const second = Math.min(360, (secondsIntoMinute / 58.5) * 360) % 360;
      const hourAngle = (hour % 12) * 30 + minute * 0.5;

      hourRef.current?.style.setProperty("transform", `rotate(${hourAngle * wound}deg)`);
      secondRef.current?.style.setProperty("transform", `rotate(${second * wound}deg)`);

      const minuteHand = minuteRef.current;
      if (minuteHand) {
        if (wound < 1) {
          laps = 0;
        } else if (lastMinute !== -1 && minute < lastMinute) {
          laps += 1;
        }
        lastMinute = minute;
        // Ease the jump only once wound, so winding tracks the scroll exactly.
        minuteHand.style.transition = wound < 1 ? "none" : "";
        const angle = (minute * 6 + laps * 360) * wound;
        minuteHand.style.setProperty("transform", `rotate(${angle}deg)`);
      }
    }

    function tick() {
      draw();
      if (running) {
        frame = requestAnimationFrame(tick);
      }
    }

    function update() {
      const shouldRun = visible && (!wind || wind.get() > 0);
      if (shouldRun && !running) {
        running = true;
        frame = requestAnimationFrame(tick);
      } else if (!shouldRun && running) {
        running = false;
        cancelAnimationFrame(frame);
      }
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    observer.observe(svg);
    const unsubscribe = wind?.on("change", update);
    draw();

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      unsubscribe?.();
    };
  }, [wind]);

  return (
    <svg
      ref={svgRef}
      viewBox="-100 -100 200 200"
      aria-hidden="true"
      className={cn("block", className)}
    >
      <circle r="99" fill="var(--paper)" />
      {minuteMarks.map((angle) => (
        <rect
          key={angle}
          x="-1.2"
          y="-95"
          width="2.4"
          height="8"
          fill="var(--ink)"
          transform={`rotate(${angle})`}
        />
      ))}
      {hourMarks.map((angle) => (
        <rect
          key={angle}
          x="-3.6"
          y="-95"
          width="7.2"
          height="27"
          fill="var(--ink)"
          transform={`rotate(${angle})`}
        />
      ))}
      <g ref={hourRef}>
        <polygon points="-6,22 6,22 4.6,-60 -4.6,-60" fill="var(--ink)" />
      </g>
      <g
        ref={minuteRef}
        className="transition-transform duration-[260ms] ease-[cubic-bezier(0.3,1.8,0.5,1)]"
      >
        <polygon points="-4.6,22 4.6,22 3.4,-90 -3.4,-90" fill="var(--ink)" />
      </g>
      <g ref={secondRef}>
        <rect x="-1.2" y="-60" width="2.4" height="92" fill="var(--signal)" />
        <circle cy="-60" r="10.5" fill="var(--signal)" />
        <circle r="2.6" fill="var(--signal)" />
      </g>
    </svg>
  );
}

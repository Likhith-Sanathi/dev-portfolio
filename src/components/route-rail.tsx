"use client";

import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

// A railway route down the left edge of wide screens: one station per
// chapter, a red line filling in behind the reader, and a train at the
// current position. Stations are links, so it doubles as a minimap.
export function RouteRail({
  stations,
}: {
  stations: readonly { href: string; label: string; index: string }[];
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const [stops, setStops] = useState<number[]>([]);
  const [railHeight, setRailHeight] = useState(0);
  const [passed, setPassed] = useState(-1);

  // Each station sits where its chapter starts, as a share of the whole scroll.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) {
      return;
    }
    function measure() {
      if (!rail) {
        return;
      }
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setRailHeight(rail.clientHeight);
      setStops(
        stations.map((station) => {
          const element = document.querySelector(station.href);
          if (!element || scrollable <= 0) {
            return 0;
          }
          const top = element.getBoundingClientRect().top + window.scrollY - 56;
          return Math.min(1, Math.max(0, top / scrollable));
        }),
      );
    }
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    observer.observe(rail);
    return () => observer.disconnect();
  }, [stations]);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const reached = stops.reduce((last, stop, index) => (value >= stop - 0.002 ? index : last), -1);
    setPassed(reached);
  });

  const trainY = useTransform(scrollYProgress, (value) => value * railHeight);

  return (
    <nav
      aria-label="Route"
      className="pointer-events-none fixed bottom-8 left-4 top-24 z-30 hidden w-3 xl:block"
    >
      <div ref={railRef} className="relative h-full">
        <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[#8a8984]/60" />
        <motion.div
          className="absolute left-1/2 top-0 h-full w-[3px] -translate-x-1/2 origin-top bg-signal"
          style={{ scaleY: scrollYProgress }}
        />
        {stations.map((station, index) => (
          <a
            key={station.href}
            href={station.href}
            aria-label={`${station.index} ${station.label}`}
            title={`${station.index} ${station.label}`}
            className={cn(
              "pointer-events-auto absolute left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 border-2 transition-colors duration-300",
              index <= passed ? "border-signal bg-signal" : "border-[#8a8984] bg-paper",
            )}
            style={{ top: `${(stops[index] ?? 0) * 100}%` }}
          />
        ))}
        <motion.span
          aria-hidden="true"
          className="absolute left-1/2 top-0 h-4 w-2 -translate-x-1/2 -translate-y-1/2 bg-ink outline outline-2 outline-paper"
          style={{ y: trainY }}
        />
      </div>
    </nav>
  );
}

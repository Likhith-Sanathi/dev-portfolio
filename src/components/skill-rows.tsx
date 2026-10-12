"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { frame } from "@/lib/grid";
import { cn, pad } from "@/lib/utils";

// Each skill group is set as one long line of type that slides sideways as
// it crosses the screen, alternating direction row by row. The travel is
// sized from the measured overflow, so every item passes through view.
export function SkillRows({
  groups,
}: {
  groups: readonly { title: string; items: readonly string[] }[];
}) {
  return (
    <div>
      {groups.map((group, index) => (
        <SkillRow
          key={group.title}
          title={group.title}
          items={group.items}
          reverse={index % 2 === 1}
        />
      ))}
      <div className={frame}>
        <div className="h-px bg-ink" />
      </div>
    </div>
  );
}

function SkillRow({
  title,
  items,
  reverse,
}: {
  title: string;
  items: readonly string[];
  reverse: boolean;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const [size, setSize] = useState({ overflow: 0, width: 0 });

  useEffect(() => {
    const row = rowRef.current;
    const track = trackRef.current;
    if (!row || !track) {
      return;
    }

    // ResizeObserver reports once on observe, which covers the first measure.
    const observer = new ResizeObserver(() => {
      setSize({
        overflow: Math.max(0, track.scrollWidth - row.clientWidth),
        width: row.clientWidth,
      });
    });
    observer.observe(row);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ["start end", "end start"],
  });
  const x = useTransform(scrollYProgress, (progress) => {
    const lead = size.width * 0.06;
    const travel = size.overflow + lead * 2;
    return lead - travel * (reverse ? 1 - progress : progress);
  });

  return (
    <div>
      <div className={frame}>
        <div className="flex items-baseline justify-between border-t border-ink pt-3 text-sm">
          <h3 className="font-medium">{title}</h3>
          <span className="tabular-nums text-mute">({pad(items.length)})</span>
        </div>
      </div>
      <div ref={rowRef} className="overflow-x-clip py-5 md:py-8">
        <motion.ul
          ref={trackRef}
          data-parallax
          style={{ x }}
          className={cn(
            "flex w-max items-center whitespace-nowrap px-4 md:px-8 lg:px-10",
            "text-[clamp(2.75rem,7vw,7.5rem)] font-semibold leading-[1.05] tracking-[-0.05em]",
            "motion-reduce:w-auto motion-reduce:flex-wrap motion-reduce:whitespace-normal",
          )}
        >
          {items.map((item, index) => (
            <li key={item} className="flex items-center">
              {item}
              {index < items.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="mx-[0.28em] inline-block size-[0.16em] bg-signal"
                />
              ) : null}
            </li>
          ))}
        </motion.ul>
      </div>
    </div>
  );
}

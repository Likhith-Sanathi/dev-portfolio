"use client";

import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  wrap,
} from "motion/react";
import { Fragment, useEffect, useRef, useState } from "react";

import { useScrollVelocity } from "@/components/scroll-velocity";
import { useCalm } from "@/lib/motion-preference";
import { cn } from "@/lib/utils";

// A railway ticker band. It runs on its own, picks up speed with the scroll
// and turns round when the reader scrolls back up. Decorative: everything it
// says is on the page elsewhere, so it is hidden from screen readers, and it
// stands still when the page is calm.
export function Ticker({
  items,
  direction = 1,
  speed = 70,
  className,
}: {
  items: readonly string[];
  direction?: 1 | -1;
  // Resting speed in pixels a second.
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "200px 0px" });
  const velocity = useScrollVelocity();
  const calm = useCalm();
  const x = useMotionValue(0);
  const heading = useRef<1 | -1>(direction);
  const [copyWidth, setCopyWidth] = useState(0);

  useEffect(() => {
    const copy = copyRef.current;
    if (!copy) {
      return;
    }
    const observer = new ResizeObserver(() => setCopyWidth(copy.offsetWidth));
    observer.observe(copy);
    return () => observer.disconnect();
  }, []);

  useAnimationFrame((_, delta) => {
    if (!inView || calm || copyWidth === 0) {
      return;
    }
    const scroll = velocity.get();
    if (scroll > 20) {
      heading.current = direction;
    } else if (scroll < -20) {
      heading.current = direction === 1 ? -1 : 1;
    }
    const boost = 1 + Math.min(8, Math.abs(scroll) / 260);
    const next = x.get() - heading.current * speed * boost * (delta / 1000);
    x.set(wrap(-copyWidth, 0, next));
  });

  return (
    <div ref={ref} aria-hidden="true" className={cn("overflow-hidden", className)}>
      <motion.div data-parallax style={{ x }} className="flex w-max">
        {[0, 1, 2].map((copy) => (
          <div
            key={copy}
            ref={copy === 0 ? copyRef : undefined}
            className="flex shrink-0 items-center whitespace-nowrap"
          >
            {items.map((item, index) => (
              <Fragment key={index}>
                <span>{item}</span>
                <span className="mx-[0.6em] inline-block size-[0.28em] shrink-0 bg-current" />
              </Fragment>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

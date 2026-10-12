"use client";

import { useEffect, useRef } from "react";

import { useCalm } from "@/lib/motion-preference";
import { cn } from "@/lib/utils";

const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

// Text that decodes from random characters, left to right, like a board
// resolving. Plays when it scrolls into view, on hover, or when the text
// changes. The visible text is decorative; screen readers get a stable copy.
export function ScrambleText({
  text,
  trigger = "view",
  className,
}: {
  text: string;
  trigger?: "view" | "hover" | "change";
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const frame = useRef(0);
  const calm = useCalm();

  // Writes into React's own text node, so React's later updates still land.
  function play() {
    const node = ref.current?.firstChild;
    if (calm || !node || node.nodeType !== Node.TEXT_NODE) {
      return;
    }
    cancelAnimationFrame(frame.current);
    const start = performance.now();
    const duration = Math.min(900, 300 + text.length * 32);

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const settled = Math.floor(t * text.length);
      node.nodeValue = text
        .split("")
        .map((character, index) =>
          index < settled || character === " "
            ? character
            : glyphs[Math.floor(Math.random() * glyphs.length)],
        )
        .join("");
      if (t < 1) {
        frame.current = requestAnimationFrame(tick);
      }
    };
    frame.current = requestAnimationFrame(tick);
  }

  // Keep the latest play() for the observers and listeners below.
  const playRef = useRef(play);
  useEffect(() => {
    playRef.current = play;
  });

  useEffect(() => {
    const element = ref.current;
    if (trigger !== "view" || !element) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          playRef.current();
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [trigger]);

  useEffect(() => {
    if (trigger === "change") {
      playRef.current();
    }
  }, [trigger, text]);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  return (
    <span className={cn("relative", className)}>
      <span className="sr-only">{text}</span>
      <span
        ref={ref}
        aria-hidden="true"
        onPointerEnter={trigger === "hover" ? () => playRef.current() : undefined}
      >
        {text}
      </span>
    </span>
  );
}

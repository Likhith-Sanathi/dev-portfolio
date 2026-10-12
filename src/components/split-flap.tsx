"use client";

import { motion } from "motion/react";
import { useState } from "react";

import { cn } from "@/lib/utils";

// A row of split-flap cells, as on a station departure board. When a cell's
// character changes, the top half of the old character falls away and the
// bottom half of the new one lands on top of it.
export function SplitFlap({
  value,
  className,
  cellClassName,
  stagger = 0.05,
}: {
  value: string;
  className?: string;
  // Sets the tile colours; the halves inherit the background.
  cellClassName?: string;
  stagger?: number;
}) {
  return (
    <span className={cn("inline-flex", className)}>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true" className="inline-flex gap-[0.05em]">
        {value.split("").map((character, index) => (
          <FlapCell
            key={index}
            character={character}
            delay={index * stagger}
            className={cellClassName}
          />
        ))}
      </span>
    </span>
  );
}

function FlapCell({
  character,
  delay,
  className,
}: {
  character: string;
  delay: number;
  className?: string;
}) {
  // Remember the outgoing character so it can fall away. Updating state while
  // rendering is React's documented way to derive it from a changed prop.
  const [flip, setFlip] = useState({
    current: character,
    previous: character,
    count: 0,
  });
  if (flip.current !== character) {
    setFlip({ current: character, previous: flip.current, count: flip.count + 1 });
  }

  const isSpace = character === " ";

  return (
    <span
      className={cn(
        "relative inline-block h-[1.12em] w-[0.7em] tabular-nums [perspective:4em]",
        isSpace ? "w-[0.3em] bg-transparent" : className,
      )}
    >
      {isSpace ? null : (
        <>
          <Half side="top" character={flip.current} />
          <Half side="bottom" character={flip.previous} />
          {flip.count > 0 ? (
            <>
              <motion.span
                key={`fall-${flip.count}`}
                initial={{ rotateX: 0 }}
                animate={{ rotateX: -90 }}
                transition={{ duration: 0.16, delay, ease: "easeIn" }}
                className="absolute inset-x-0 top-0 h-1/2 origin-bottom bg-inherit [backface-visibility:hidden]"
              >
                <Face side="top" character={flip.previous} />
              </motion.span>
              <motion.span
                key={`land-${flip.count}`}
                initial={{ rotateX: 90 }}
                animate={{ rotateX: 0 }}
                transition={{ duration: 0.2, delay: delay + 0.16, ease: "easeOut" }}
                className="absolute inset-x-0 bottom-0 h-1/2 origin-top bg-inherit [backface-visibility:hidden]"
              >
                <Face side="bottom" character={flip.current} />
              </motion.span>
            </>
          ) : null}
          {/* The split between the two halves of the tile. */}
          <span className="absolute inset-x-0 top-1/2 z-10 h-[0.02em] min-h-px -translate-y-1/2 bg-current opacity-20" />
        </>
      )}
    </span>
  );
}

function Half({ side, character }: { side: "top" | "bottom"; character: string }) {
  return (
    <span
      className={cn(
        "absolute inset-x-0 h-1/2 bg-inherit",
        side === "top" ? "top-0" : "bottom-0",
      )}
    >
      <Face side={side} character={character} />
    </span>
  );
}

// One half of a character: a full-height glyph clipped to the top or bottom.
function Face({ side, character }: { side: "top" | "bottom"; character: string }) {
  return (
    <span className="absolute inset-0 overflow-hidden bg-inherit">
      <span
        className={cn(
          "absolute inset-x-0 flex h-[200%] items-center justify-center leading-none",
          side === "top" ? "top-0" : "bottom-0",
        )}
      >
        {character}
      </span>
    </span>
  );
}

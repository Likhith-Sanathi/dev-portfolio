"use client";

import { motion, useTransform, type MotionValue } from "motion/react";

// Small seeded generator, so each poster is the same on every visit.
function random(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ink = "var(--ink)";
const signal = "var(--signal)";
const hairline = "var(--hairline)";

type Layers = { back: React.ReactNode; middle: React.ReactNode; number: { x: number; y: number } };

// One Swiss poster per project, each a nod to what the project does, drawn on
// a 100 × 100 grid in three layers so it can come apart in depth.
const compositions: ((seed: number) => Layers)[] = [
  // A coding agent's loop: nested squares around a red core.
  () => ({
    back: [46, 38, 30, 22].map((half) => (
      <rect key={half} x={50 - half} y={50 - half} width={half * 2} height={half * 2} fill="none" stroke={ink} strokeWidth={0.8} />
    )),
    middle: <rect x={43} y={43} width={14} height={14} fill={signal} />,
    number: { x: 4, y: 97 },
  }),
  // A study platform: a stack of flashcards with the red card on top.
  () => ({
    back: [0, 1, 2, 3].map((step) => (
      <rect key={step} x={6 + step * 6} y={54 - step * 6} width={54} height={36} fill="var(--paper)" stroke={ink} strokeWidth={0.8} />
    )),
    middle: <rect x={30} y={30} width={54} height={36} fill={signal} />,
    number: { x: 60, y: 97 },
  }),
  // Quant research: a bar chart under a red sun.
  (seed) => {
    const next = random(seed);
    return {
      back: Array.from({ length: 14 }, (_, index) => {
        const height = 12 + next() * 46;
        return <rect key={index} x={5 + index * 6.4} y={96 - height} width={4.2} height={height} fill={ink} />;
      }),
      middle: <circle cx={70} cy={28} r={19} fill={signal} />,
      number: { x: 4, y: 30 },
    };
  },
  // Operations dashboards: a grid of tiles, a few of them lit.
  () => ({
    back: Array.from({ length: 9 }, (_, index) => (
      <rect key={index} x={4 + (index % 3) * 31} y={4 + Math.floor(index / 3) * 31} width={28} height={28} fill="none" stroke={hairline} strokeWidth={0.8} />
    )),
    middle: (
      <>
        <rect x={35} y={4} width={28} height={28} fill={ink} />
        <rect x={4} y={35} width={28} height={28} fill={ink} />
        <rect x={66} y={66} width={28} height={28} fill={signal} />
      </>
    ),
    number: { x: 36, y: 60 },
  }),
  // A rogue-like: a pixel dungeon with the red player in it.
  (seed) => {
    const next = random(seed);
    const pixels = [];
    for (let row = 0; row < 12; row += 1) {
      for (let column = 0; column < 12; column += 1) {
        if (next() < 0.34) {
          pixels.push(<rect key={`${row}-${column}`} x={4 + column * 7.8} y={4 + row * 7.8} width={6.2} height={6.2} fill={ink} />);
        }
      }
    }
    return {
      back: pixels,
      middle: <rect x={51} y={35} width={14} height={14} fill={signal} />,
      number: { x: 4, y: 97 },
    };
  },
];

// A project's poster. `drift` is how far the panel is from its resting place,
// in panel widths; the layers separate by depth as it moves.
export function ProjectPoster({
  index,
  number,
  drift,
  className,
}: {
  index: number;
  number: string;
  drift: MotionValue<number>;
  className?: string;
}) {
  const layers = compositions[index % compositions.length](index + 7);
  const back = useTransform(drift, (value) => value * 5);
  const middle = useTransform(drift, (value) => value * 14);
  const front = useTransform(drift, (value) => value * 28);

  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={className} overflow="visible">
      <motion.g data-parallax style={{ x: back }}>
        {layers.back}
      </motion.g>
      <motion.g data-parallax style={{ x: middle }}>
        {layers.middle}
      </motion.g>
      <motion.g data-parallax style={{ x: front }}>
        <text
          x={layers.number.x}
          y={layers.number.y}
          fill={ink}
          fontSize={30}
          fontWeight={600}
          letterSpacing="-0.06em"
        >
          {number}
        </text>
      </motion.g>
    </svg>
  );
}

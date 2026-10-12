"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef } from "react";

// Beats of the pinned runway, as fractions of its scroll progress.
const GATHER: Range = [0.04, 0.5];
const CLOSE: Range = [0.5, 0.58];
const ZOOM: Range = [0.58, 0.86];

const COLUMNS = 16;
const SIGNAL = "#d32a1d";

type Range = [number, number];

type Particle = {
  column: number;
  row: number;
  // Scattered start, as fractions of the stage from its centre.
  x: number;
  y: number;
  spin: number;
  size: number;
  delay: number;
};

function phase(value: number, [start, end]: Range) {
  return Math.min(1, Math.max(0, (value - start) / (end - start)));
}

function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

// Small seeded generator, so the scatter is the same on every visit.
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

const particles: Particle[] = (() => {
  const next = random(1985);
  return Array.from({ length: COLUMNS * COLUMNS }, (_, index) => ({
    column: index % COLUMNS,
    row: Math.floor(index / COLUMNS),
    x: (next() - 0.5) * 1.5,
    y: (next() - 0.5) * 1.5,
    spin: (next() - 0.5) * Math.PI * 3,
    size: 0.5 + next() * 1.4,
    delay: next() * 0.12,
  }));
})();

// The closing beat, the mirror of the opening: red squares scattered over the
// page fly together into a grid, close up into the full stop, and the full
// stop zooms back out to fill the screen, handing over to the red contact
// section. Decorative, so it is skipped entirely when the page is calm.
export function Reassemble() {
  const runwayRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frame = useRef(0);
  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ["start 56px", "end end"],
  });

  function draw(progress: number) {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) {
      return;
    }
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const ratio = window.devicePixelRatio || 1;
    if (canvas.width !== Math.round(width * ratio)) {
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
    }
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);
    context.fillStyle = SIGNAL;

    const centreX = width / 2;
    const centreY = height / 2;
    const side = Math.min(width, height) * 0.22;
    const cell = side / COLUMNS;

    const zoom = easeInOut(phase(progress, ZOOM));
    if (zoom > 0) {
      // One solid square growing from the centre until it covers the stage.
      const cover = (Math.hypot(width, height) / side) * 1.05;
      const grown = side * cover ** zoom;
      context.fillRect(centreX - grown / 2, centreY - grown / 2, grown, grown);
      return;
    }

    const gap = (1 - phase(progress, CLOSE)) * 0.22;
    for (const particle of particles) {
      const t = easeInOut(
        Math.min(1, Math.max(0, (phase(progress, GATHER) - particle.delay) / (1 - particle.delay))),
      );
      const homeX = centreX + (particle.column - (COLUMNS - 1) / 2) * cell;
      const homeY = centreY + (particle.row - (COLUMNS - 1) / 2) * cell;
      const x = centreX + particle.x * width + (homeX - (centreX + particle.x * width)) * t;
      const y = centreY + particle.y * height + (homeY - (centreY + particle.y * height)) * t;
      const size = cell * (particle.size + (1 - gap - particle.size) * t) + 0.5;

      context.save();
      context.translate(x, y);
      context.rotate(particle.spin * (1 - t));
      context.fillRect(-size / 2, -size / 2, size, size);
      context.restore();
    }
  }

  // Keep the latest draw() for the scroll listener and resize observer.
  const drawRef = useRef(draw);
  useEffect(() => {
    drawRef.current = draw;
  });

  function schedule() {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() =>
      drawRef.current(scrollYProgress.get()),
    );
  }

  useMotionValueEvent(scrollYProgress, "change", schedule);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const observer = new ResizeObserver(() => drawRef.current(scrollYProgress.get()));
    observer.observe(canvas);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame.current);
    };
  }, [scrollYProgress]);

  return (
    <div
      ref={runwayRef}
      aria-hidden="true"
      className="relative h-[240svh] calm:hidden"
    >
      <div className="sticky top-14 h-[calc(100svh-3.5rem)] overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 size-full" />
      </div>
    </div>
  );
}

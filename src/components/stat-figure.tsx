"use client";

import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useEffect, useRef } from "react";

import { parseCount, type Count } from "@/lib/count";
import { useCalm } from "@/lib/motion-preference";
import { useTheme } from "@/lib/theme-preference";

// Cell grids for each kind of stat, as columns × rows.
function layout(count: Count) {
  if (count.kind === "placing") {
    return { columns: Math.ceil(count.field / 2), rows: 2, cells: count.field };
  }
  if (count.kind === "share") {
    return { columns: 50, rows: 20, cells: 1000 };
  }
  const cells = Math.max(1, Math.round(count.to));
  const columns = Math.min(50, cells);
  return { columns, rows: Math.ceil(cells / columns), cells };
}

// A stat that counts to its value as it scrolls into place, over a dot-grid
// figure that counts with it: a placing marker climbs through the field, a
// count fills its cells, and a "Top x%" drains a thousand cells down to its
// share. Screen readers and calm visitors get the final value straight away.
export function StatFigure({ value }: { value: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const calm = useCalm();
  const theme = useTheme();
  const count = parseCount(value);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 40%"],
  });
  const progress = useTransform(scrollYProgress, (value) => {
    const t = Math.min(1, Math.max(0, value));
    return 1 - (1 - t) ** 3;
  });
  const text = useTransform(progress, (t) =>
    count ? count.format(count.from + (count.to - count.from) * t) : value,
  );

  // Sizes and colours change only on resize, so they are read then, not on
  // every scroll frame; `drawn` skips frames where no cell would change.
  const sizing = useRef({ width: 0, height: 0, cell: 0, ink: "", signal: "", hairline: "" });
  const drawn = useRef<number | null>(null);

  function resize() {
    const canvas = canvasRef.current;
    if (!canvas || !count) {
      return;
    }
    const { columns, rows } = layout(count);
    const width = canvas.clientWidth;
    const cell = width / columns;
    const height = cell * rows;
    const ratio = window.devicePixelRatio || 1;
    canvas.style.height = `${height}px`;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    const styles = getComputedStyle(canvas);
    sizing.current = {
      width,
      height,
      cell,
      ink: styles.getPropertyValue("--ink").trim(),
      signal: styles.getPropertyValue("--signal").trim(),
      hairline: styles.getPropertyValue("--hairline").trim(),
    };
    drawn.current = null;
  }

  function draw(t: number) {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context || !count || sizing.current.width === 0) {
      return;
    }
    const current = count.from + (count.to - count.from) * t;
    // What the grid shows only changes when this rounded value does.
    const shown = count.kind === "share" ? Math.round(current * 10) : Math.round(current);
    if (drawn.current === shown) {
      return;
    }
    drawn.current = shown;

    const { columns, cells } = layout(count);
    const { width, height, cell, ink, signal, hairline } = sizing.current;
    const ratio = window.devicePixelRatio || 1;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);
    const size = cell * 0.72;

    for (let index = 0; index < cells; index += 1) {
      const column = index % columns;
      const row = Math.floor(index / columns);
      let colour = hairline;
      if (count.kind === "placing" && index === Math.round(current) - 1) {
        colour = signal;
      } else if (count.kind === "count" && index < Math.round(current)) {
        colour = ink;
      } else if (count.kind === "share" && index < Math.round(current * 10)) {
        colour = signal;
      }
      context.fillStyle = colour;
      context.fillRect(column * cell, row * cell, size, size);
    }
  }

  // Keep the latest draw() and resize() for the listeners below.
  const drawRef = useRef(draw);
  const resizeRef = useRef(resize);
  useEffect(() => {
    drawRef.current = draw;
    resizeRef.current = resize;
  });

  useMotionValueEvent(progress, "change", (t) => {
    if (!calm) {
      drawRef.current(t);
    }
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const observer = new ResizeObserver(() => {
      resizeRef.current();
      drawRef.current(calm ? 1 : progress.get());
    });
    observer.observe(canvas);
    return () => observer.disconnect();
    // The theme is a dependency so a switch re-reads the palette.
  }, [calm, progress, theme]);

  return (
    <div ref={ref}>
      <span className="sr-only">{value}</span>
      <motion.span aria-hidden="true" className="tabular-nums calm:hidden">
        {text}
      </motion.span>
      <span aria-hidden="true" className="hidden calm:inline">
        {value}
      </span>
      {count ? (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="mt-6 block w-full md:mt-8"
        />
      ) : null}
    </div>
  );
}

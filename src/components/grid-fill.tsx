"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef } from "react";

import { frame, grid } from "@/lib/grid";
import { cn } from "@/lib/utils";

// Beats of the pinned runway, as fractions of its scroll progress.
const DRAW: Range = [0, 0.18];
const FILL: Range = [0.18, 0.7];
const CLOSE: Range = [0.7, 0.86];
// How long each cell takes to fill, as a share of the whole fill beat.
const CELL = 0.22;

type Range = [number, number];

type Layout = {
  width: number;
  height: number;
  columns: { x: number; width: number }[];
  gap: number;
  rows: number;
  top: number;
  colours: { signal: string; ink: string };
};

function phase(value: number, [start, end]: Range) {
  return Math.min(1, Math.max(0, (value - start) / (end - start)));
}

function easeOut(t: number) {
  return 1 - (1 - t) ** 3;
}

function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

// The closing beat. The page's own column grid draws itself across a pinned
// screen, its cells flood red in a cascade from top left to bottom right like
// a departure board updating, then the gutters close up into solid red as the
// red contact section arrives. Decorative, so it is skipped when calm.
export function GridFill() {
  const runwayRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // An invisible copy of the site grid, measured so the cells sit exactly on
  // the real columns at every breakpoint.
  const gridRef = useRef<HTMLDivElement>(null);
  const layoutRef = useRef<Layout | null>(null);
  const frameRef = useRef(0);
  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ["start 56px", "end end"],
  });

  function measure() {
    const stage = stageRef.current;
    const reference = gridRef.current;
    const canvas = canvasRef.current;
    if (!stage || !reference || !canvas) {
      return;
    }
    const box = stage.getBoundingClientRect();
    const columns = Array.from(reference.children)
      .map((child) => child.getBoundingClientRect())
      .filter((rect) => rect.width > 0)
      .map((rect) => ({ x: rect.left - box.left, width: rect.width }));
    if (columns.length < 2) {
      return;
    }
    const gap = columns[1].x - (columns[0].x + columns[0].width);
    // Square cells, with the same gutter between rows as between columns.
    const pitch = columns[0].width + gap;
    const inset = columns[0].x;
    const rows = Math.max(1, Math.floor((box.height - inset * 2 + gap) / pitch));
    const top = (box.height - (rows * pitch - gap)) / 2;

    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.round(box.width * ratio);
    canvas.height = Math.round(box.height * ratio);
    const styles = getComputedStyle(canvas);
    layoutRef.current = {
      width: box.width,
      height: box.height,
      columns,
      gap,
      rows,
      top,
      colours: {
        signal: styles.getPropertyValue("--signal").trim(),
        ink: styles.getPropertyValue("--ink").trim(),
      },
    };
  }

  function draw(progress: number) {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const layout = layoutRef.current;
    if (!canvas || !context || !layout) {
      return;
    }
    const { width, height, columns, gap, rows, top, colours } = layout;
    const ratio = window.devicePixelRatio || 1;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);

    const cell = columns[0].width;
    const pitch = cell + gap;
    const drawn = easeOut(phase(progress, DRAW));
    const closed = easeInOut(phase(progress, CLOSE));
    const fill = phase(progress, FILL);

    // The grid's column and row edges, drawn in and faded as the red closes.
    const lineAlpha = 0.28 * (1 - closed);
    if (drawn > 0 && lineAlpha > 0) {
      context.globalAlpha = lineAlpha;
      context.fillStyle = colours.ink;
      for (const column of columns) {
        context.fillRect(column.x, 0, 1, height * drawn);
        context.fillRect(column.x + column.width - 1, 0, 1, height * drawn);
      }
      for (let row = 0; row < rows; row += 1) {
        const y = top + row * pitch;
        context.fillRect(0, y, width * drawn, 1);
        context.fillRect(0, y + cell - 1, width * drawn, 1);
      }
      context.globalAlpha = 1;
    }

    // Cells fill top-down, in a diagonal wave; each moves from its slot on
    // the grid to its share of the full screen as the gutters close.
    context.fillStyle = colours.signal;
    const waves = columns.length + rows - 2 || 1;
    const tileWidth = width / columns.length;
    const tileHeight = height / rows;
    for (let row = 0; row < rows; row += 1) {
      for (let index = 0; index < columns.length; index += 1) {
        const start = ((index + row) / waves) * (1 - CELL);
        const t = easeOut(Math.min(1, Math.max(0, (fill - start) / CELL)));
        if (t <= 0) {
          continue;
        }
        const column = columns[index];
        const x = column.x + (index * tileWidth - column.x) * closed;
        const y = top + row * pitch + (row * tileHeight - (top + row * pitch)) * closed;
        // A pixel of overlap once closed, so no seams show between tiles.
        const w = cell + (tileWidth + 1 - cell) * closed;
        const h = cell + (tileHeight + 1 - cell) * closed;
        context.fillRect(x, y, w, h * t);
      }
    }
  }

  // Keep the latest measure() and draw() for the listeners below.
  const measureRef = useRef(measure);
  const drawRef = useRef(draw);
  useEffect(() => {
    measureRef.current = measure;
    drawRef.current = draw;
  });

  useMotionValueEvent(scrollYProgress, "change", () => {
    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() =>
      drawRef.current(scrollYProgress.get()),
    );
  });

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) {
      return;
    }
    const observer = new ResizeObserver(() => {
      measureRef.current();
      drawRef.current(scrollYProgress.get());
    });
    observer.observe(stage);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameRef.current);
    };
  }, [scrollYProgress]);

  return (
    <div
      ref={runwayRef}
      aria-hidden="true"
      className="relative h-[240svh] calm:hidden"
    >
      <div
        ref={stageRef}
        className="sticky top-14 h-[calc(100svh-3.5rem)] overflow-hidden"
      >
        <div ref={gridRef} className={cn(frame, grid, "invisible absolute inset-x-0 top-0 h-px")}>
          {Array.from({ length: 12 }, (_, index) => (
            <div key={index} className={cn(index >= 4 && "hidden md:block")} />
          ))}
        </div>
        <canvas ref={canvasRef} className="absolute inset-0 size-full" />
      </div>
    </div>
  );
}

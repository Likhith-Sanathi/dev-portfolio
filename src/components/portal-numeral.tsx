"use client";

import { motion, useMotionValueEvent, useTransform, type MotionValue } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";

function easeIn(t: number) {
  return t * t * t;
}

// A sheet of paper with a giant numeral cut out of it, laid over a pinned
// scene. Through the digits the scene shows; as `progress` runs from 0 to 1
// the cut-out grows from a point inside the first digit's stroke until the
// sheet is gone and the reader has flown through the number.
export function PortalNumeral({
  text,
  label,
  progress,
}: {
  text: string;
  label: string;
  progress: MotionValue<number>;
}) {
  const maskId = `portal-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const holeRef = useRef<SVGTextElement>(null);
  const outlineRef = useRef<SVGTextElement>(null);
  const [focus, setFocus] = useState({ x: 0, y: 0, cover: 1 });

  // Where to dive in, and how far to scale before the stroke fills the screen.
  useEffect(() => {
    const svg = svgRef.current;
    const outline = outlineRef.current;
    if (!svg || !outline) {
      return;
    }

    function measure() {
      if (!svg || !outline) {
        return;
      }
      const box = outline.getBBox();
      if (box.width === 0) {
        return;
      }
      const width = svg.clientWidth;
      const height = svg.clientHeight;
      // Roughly the middle of the first digit's left stroke.
      const x = box.x + box.width * 0.055;
      const y = box.y + box.height * 0.5;
      const stroke = box.width * 0.075;
      const reach = Math.max(x, width - x, y, height - y);
      setFocus({ x, y, cover: Math.max(1, (reach / (stroke / 2)) * 1.5) });
    }

    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) {
        measure();
      }
    });
    const observer = new ResizeObserver(measure);
    observer.observe(svg);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, []);

  function apply(t: number) {
    const scale = focus.cover ** easeIn(Math.min(1, Math.max(0, t)));
    const transform = `translate(${focus.x} ${focus.y}) scale(${scale}) translate(${-focus.x} ${-focus.y})`;
    holeRef.current?.setAttribute("transform", transform);
    outlineRef.current?.setAttribute("transform", transform);
    if (wrapRef.current) {
      wrapRef.current.style.visibility = t >= 0.995 ? "hidden" : "visible";
    }
  }

  // Keep the latest apply() for the listener and re-apply after measuring.
  const applyRef = useRef(apply);
  useEffect(() => {
    applyRef.current = apply;
    apply(progress.get());
  });

  useMotionValueEvent(progress, "change", (t) => applyRef.current(t));

  const labelOpacity = useTransform(progress, (t) => 1 - Math.min(1, t * 5));

  const type = {
    fontSize: "min(70svh, 54vw)",
    fontWeight: 600,
    letterSpacing: "-0.06em",
  } as const;

  return (
    <div ref={wrapRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-20">
      <svg ref={svgRef} className="absolute inset-0 size-full">
        <defs>
          <mask id={maskId}>
            <rect width="100%" height="100%" fill="white" />
            <text
              ref={holeRef}
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="central"
              fill="black"
              style={type}
            >
              {text}
            </text>
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="var(--paper)" mask={`url(#${maskId})`} />
        <text
          ref={outlineRef}
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          fill="none"
          stroke="var(--ink)"
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
          style={type}
        >
          {text}
        </text>
      </svg>
      <motion.p
        style={{ opacity: labelOpacity }}
        className="absolute bottom-5 left-4 flex items-center gap-2 text-sm md:left-8 lg:left-10"
      >
        <span className="size-2 bg-signal" />
        {label}
      </motion.p>
    </div>
  );
}

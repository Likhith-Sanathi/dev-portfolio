"use client";

import { ArrowUpRight } from "lucide-react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

import { useCalm } from "@/lib/motion-preference";
import { useMediaQuery } from "@/lib/use-media-query";

type Mode = "hidden" | "default" | "link" | "view";

const shapes: Record<Mode, { size: number; fill: boolean }> = {
  hidden: { size: 0, fill: true },
  default: { size: 12, fill: true },
  link: { size: 44, fill: false },
  view: { size: 92, fill: true },
};

// A red square that trails the pointer, opens into an outline over links and
// into a "View" tile over project panels. A thin paper-coloured ring keeps it visible
// on the red sections. It replaces the system cursor, which is hidden while it
// runs; touch and calm visitors keep their own cursor.
export function CursorFollower() {
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)", false);
  const calm = useCalm();
  const enabled = finePointer && !calm;
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const followX = useSpring(x, { stiffness: 520, damping: 42, mass: 0.5 });
  const followY = useSpring(y, { stiffness: 520, damping: 42, mass: 0.5 });
  const [mode, setMode] = useState<Mode>("hidden");

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const root = document.documentElement;
    root.dataset.customCursor = "";

    function onMove(event: PointerEvent) {
      if (event.pointerType !== "mouse") {
        return;
      }
      x.set(event.clientX);
      y.set(event.clientY);
    }

    function onOver(event: PointerEvent) {
      if (event.pointerType !== "mouse") {
        return;
      }
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest("[data-cursor='view']")) {
        setMode("view");
      } else if (target?.closest("a, button")) {
        setMode("link");
      } else {
        setMode("default");
      }
    }

    function onLeave() {
      setMode("hidden");
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      delete root.dataset.customCursor;
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) {
    return null;
  }

  const shape = shapes[mode];

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[70]"
      style={{ x: followX, y: followY }}
    >
      <motion.div
        className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden text-sm font-medium text-on-signal shadow-[0_0_0_1px_var(--on-signal)]"
        initial={false}
        animate={{
          width: shape.size,
          height: shape.size,
          backgroundColor: shape.fill ? "#d32a1d" : "rgba(211,42,29,0)",
          borderWidth: shape.fill ? 0 : 1.5,
          opacity: mode === "hidden" ? 0 : 1,
        }}
        style={{ borderColor: "#d32a1d", borderStyle: "solid" }}
        transition={{ type: "spring", stiffness: 420, damping: 32 }}
      >
        {mode === "view" ? (
          <span className="flex items-center gap-0.5">
            View
            <ArrowUpRight className="size-3.5" strokeWidth={2} />
          </span>
        ) : null}
      </motion.div>
    </motion.div>
  );
}

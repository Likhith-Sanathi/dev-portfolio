"use client";

import { useEffect, useRef } from "react";

// A modular grid drawn in the current text colour, lit only in a pool around
// the mouse. Touch screens get a faint, evenly lit grid instead. Place it as
// the first child of a positioned, isolated section.
export function SpotlightGrid() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = ref.current;
    const section = grid?.parentElement;
    if (!grid || !section) {
      return;
    }
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }

    function onMove(event: PointerEvent) {
      if (!grid || !section) {
        return;
      }
      const box = section.getBoundingClientRect();
      grid.style.setProperty("--spot-x", `${event.clientX - box.left}px`);
      grid.style.setProperty("--spot-y", `${event.clientY - box.top}px`);
      grid.style.setProperty("--spot-r", "280px");
    }

    function onLeave() {
      grid?.style.setProperty("--spot-r", "0px");
    }

    section.addEventListener("pointermove", onMove, { passive: true });
    section.addEventListener("pointerleave", onLeave);
    return () => {
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-40 [mask-image:radial-gradient(circle_var(--spot-r,0px)_at_var(--spot-x,50%)_var(--spot-y,50%),#000,transparent)] [@media(hover:none)]:opacity-[0.06] [@media(hover:none)]:[mask-image:none]"
    />
  );
}

"use client";

import { ReactLenis } from "lenis/react";

import { useCalm } from "@/lib/motion-preference";

const smooth = {
  duration: 1.05,
  easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
  smoothWheel: true,
  wheelMultiplier: 0.8,
  anchors: { offset: -56 },
};

// Hands wheel and anchor scrolling straight back to the browser when calm.
const native = { smoothWheel: false, anchors: false };

// Always mounted: swapping the wrapper when motion is switched off would
// remount, and so reset, everything on the page. Lenis rebuilds itself when
// its options change instead.
export function LenisProvider({ children }: { children: React.ReactNode }) {
  const calm = useCalm();

  return (
    <ReactLenis root options={calm ? native : smooth}>
      {children}
    </ReactLenis>
  );
}

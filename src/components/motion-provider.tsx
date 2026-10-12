"use client";

import { MotionConfig } from "motion/react";

import { ScrollVelocityProvider } from "@/components/scroll-velocity";
import { useCalm } from "@/lib/motion-preference";

// When the page is calm, Motion skips transform animations while still
// revealing content, so nothing that starts hidden on the server stays hidden.
// Driven by the shared preference so the on-page toggle works both ways.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  const calm = useCalm();

  return (
    <MotionConfig reducedMotion={calm ? "always" : "never"}>
      <ScrollVelocityProvider>{children}</ScrollVelocityProvider>
    </MotionConfig>
  );
}

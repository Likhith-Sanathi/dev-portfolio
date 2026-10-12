"use client";

import { MotionConfig } from "motion/react";

// With reducedMotion="user", Motion skips transform animations for people who
// prefer reduced motion while still revealing content, so nothing that starts
// hidden on the server stays hidden.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

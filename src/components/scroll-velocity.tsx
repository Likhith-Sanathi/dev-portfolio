"use client";

import {
  motionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "motion/react";
import { createContext, useContext } from "react";

const VelocityContext = createContext<MotionValue<number> | null>(null);
const still = motionValue(0);

// One smoothed scroll velocity for the whole page, so everything that leans
// with the scroll leans together.
export function ScrollVelocityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), {
    damping: 50,
    stiffness: 300,
  });

  return (
    <VelocityContext.Provider value={velocity}>
      {children}
    </VelocityContext.Provider>
  );
}

// A skew in degrees that grows with scroll speed, reaching `max` at about
// 2,200px a second and leaning against the direction of travel.
export function useLean(max: number) {
  const velocity = useContext(VelocityContext) ?? still;

  return useTransform(velocity, (value) => {
    const lean = (-value / 2200) * max;
    return Math.max(-max, Math.min(max, lean));
  });
}

// A vertical stretch that grows with scroll speed in either direction, up to
// `max` (0.2 is a 20% stretch) at about 2,200px a second.
export function useStretch(max: number) {
  const velocity = useContext(VelocityContext) ?? still;

  return useTransform(velocity, (value) =>
    1 + Math.min(max, (Math.abs(value) / 2200) * max),
  );
}

// Scroll speed from 0 to 1, reaching 1 at about 2,200px a second.
export function useSpeed() {
  const velocity = useContext(VelocityContext) ?? still;

  return useTransform(velocity, (value) => Math.min(1, Math.abs(value) / 2200));
}

// The shared smoothed scroll velocity itself, in pixels a second.
export function useScrollVelocity() {
  return useContext(VelocityContext) ?? still;
}

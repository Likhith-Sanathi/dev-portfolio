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

// One smoothed scroll velocity for the whole page, so everything that reacts
// to scroll speed reacts together.
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

// Scroll speed from 0 to 1, reaching 1 at about 2,200px a second.
export function useSpeed() {
  const velocity = useContext(VelocityContext) ?? still;

  return useTransform(velocity, (value) => Math.min(1, Math.abs(value) / 2200));
}

// The shared smoothed scroll velocity itself, in pixels a second.
export function useScrollVelocity() {
  return useContext(VelocityContext) ?? still;
}

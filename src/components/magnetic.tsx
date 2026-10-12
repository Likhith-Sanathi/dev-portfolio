"use client";

import { motion, useSpring } from "motion/react";
import { useRef } from "react";

import { cn } from "@/lib/utils";

// Pulls its content towards a mouse pointer hovering over it and springs back
// when the pointer leaves. Touch and pen input are ignored.
export function Magnetic({
  children,
  className,
  strength = 0.3,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useSpring(0, { stiffness: 260, damping: 18, mass: 0.4 });
  const y = useSpring(0, { stiffness: 260, damping: 18, mass: 0.4 });

  function onPointerMove(event: React.PointerEvent) {
    const element = ref.current;
    if (event.pointerType !== "mouse" || !element) {
      return;
    }
    const box = element.getBoundingClientRect();
    x.set((event.clientX - (box.left + box.width / 2)) * strength);
    y.set((event.clientY - (box.top + box.height / 2)) * strength);
  }

  function onPointerLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.span
      ref={ref}
      data-parallax
      style={{ x, y }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={cn("inline-block", className)}
    >
      {children}
    </motion.span>
  );
}

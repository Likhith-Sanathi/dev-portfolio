"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { useEffect, useRef } from "react";

import { useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

type Hover3DEffect = "gravitate" | "evade";

type Hover3DProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  contentClassName?: string;
  effect?: Hover3DEffect;
  tiltLimit?: number;
  scale?: number;
  perspective?: number;
  borderRadius?: number | string;
};

function Hover3D({
  children,
  className,
  contentClassName,
  effect = "evade",
  tiltLimit = 8,
  scale = 1.01,
  perspective = 1200,
  borderRadius,
  style,
  ...props
}: Hover3DProps) {
  const shouldReduceMotion = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);

  const setTransform = (tiltX: number, tiltY: number, nextScale: number) => {
    if (!contentRef.current) {
      return;
    }

    contentRef.current.style.transform = `perspective(${perspective}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(${nextScale}, ${nextScale}, ${nextScale})`;
  };

  const setActive = (active: boolean) => {
    if (!contentRef.current) {
      return;
    }

    contentRef.current.dataset.hover3dActive = active ? "true" : "false";
  };

  const resetTransform = () => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    setActive(false);
    setTransform(0, 0, 1);
  };

  useEffect(() => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    if (contentRef.current) {
      contentRef.current.dataset.hover3dActive = "false";
      contentRef.current.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    }

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [perspective]);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || event.pointerType !== "mouse" || !wrapperRef.current) {
      return;
    }

    const { width, height, top, left } = wrapperRef.current.getBoundingClientRect();
    const multiplier = effect === "evade" ? -1 : 1;
    const tiltX =
      ((event.clientY - top) / height - 0.5) * (tiltLimit * 2) * multiplier;
    const tiltY =
      ((event.clientX - left) / width - 0.5) * -(tiltLimit * 2) * multiplier;

    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }

    frameRef.current = requestAnimationFrame(() => {
      setActive(true);
      setTransform(tiltX, tiltY, scale);
      frameRef.current = null;
    });
  };

  return (
    <div
      ref={wrapperRef}
      className={cn("relative overflow-visible", className)}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTransform}
      onPointerCancel={resetTransform}
      onBlur={resetTransform}
      style={style}
      {...props}
    >
      <div
        ref={contentRef}
        className={cn(
          "h-full w-full transition-transform duration-200 ease-out will-change-transform",
          contentClassName,
        )}
        style={borderRadius === undefined ? undefined : { borderRadius }}
      >
        {children}
      </div>
    </div>
  );
}

export { Hover3D };

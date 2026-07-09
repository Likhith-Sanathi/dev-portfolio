"use client";

import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type LayeredPanelProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  contentClassName?: string;
};

function LayeredPanel({
  className,
  contentClassName,
  children,
  ...props
}: LayeredPanelProps) {
  return (
    <div
      {...props}
      className={cn(
        "relative overflow-hidden border border-white/20 bg-[linear-gradient(135deg,rgba(255,255,255,0.16),rgba(255,255,255,0.08),rgba(255,255,255,0.03))] shadow-[0_0_120px_rgba(255,255,255,0.16)]",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.24),transparent_28%),linear-gradient(90deg,rgba(0,0,0,0.35),transparent)]" />
      <div className="scanlines pointer-events-none absolute inset-0 opacity-25" />
      <div className={cn("relative z-10", contentClassName)}>{children}</div>
    </div>
  );
}

export { LayeredPanel };

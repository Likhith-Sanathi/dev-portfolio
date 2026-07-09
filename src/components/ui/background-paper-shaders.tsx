"use client";

import { MeshGradient } from "@paper-design/shaders-react";

import { cn } from "@/lib/utils";

export function BackgroundPaperShaders({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-0 z-0 isolate overflow-hidden",
        className,
      )}
    >
      <MeshGradient
        className="absolute inset-0 h-full w-full scale-[1.1] blur-2xl opacity-78"
        colors={["#000000", "#1a1a1a", "#333333", "#ffffff"]}
      />
      <div className="absolute inset-0 bg-black/48" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_26%,rgba(0,0,0,0.62)_100%)]" />
    </div>
  );
}

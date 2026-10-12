"use client";

import { useLenis } from "lenis/react";
import { RotateCcw } from "lucide-react";

import { useCalm } from "@/lib/motion-preference";
import { cn } from "@/lib/utils";

export const REPLAY_INTRO_EVENT = "portfolio:replay-intro";

// Jumps back to the top and plays the opening counter again. Hidden when the
// page is calm, since the intro is skipped then.
export function ReplayIntro({ className }: { className?: string }) {
  const lenis = useLenis();
  const calm = useCalm();

  if (calm) {
    return null;
  }

  function replay() {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true });
    } else {
      window.scrollTo(0, 0);
    }
    window.dispatchEvent(new Event(REPLAY_INTRO_EVENT));
  }

  return (
    <button
      type="button"
      onClick={replay}
      className={cn(
        "inline-flex items-center gap-1.5 transition-colors duration-200 hover:text-signal-ink",
        className,
      )}
    >
      Replay intro
      <RotateCcw className="size-3.5" strokeWidth={1.75} />
    </button>
  );
}

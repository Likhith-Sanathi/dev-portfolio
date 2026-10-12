"use client";

import { setMotionPreference, useCalm } from "@/lib/motion-preference";
import { cn } from "@/lib/utils";

// Turns the page's motion on or off, remembered between visits. It can also
// switch motion back on for someone whose OS asks for less.
export function MotionToggle({
  className,
  showLabel = true,
}: {
  className?: string;
  showLabel?: boolean;
}) {
  const calm = useCalm();

  return (
    <button
      type="button"
      onClick={() => setMotionPreference(calm ? "full" : "reduced")}
      // A stable name with a pressed state reads as "Motion, toggle, pressed".
      aria-pressed={!calm}
      aria-label={showLabel ? undefined : "Motion"}
      title={calm ? "Turn motion on" : "Turn motion off"}
      className={cn(
        "inline-flex items-center gap-2 transition-colors duration-200 hover:text-signal-ink",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "size-2.5 shrink-0 border border-current transition-colors duration-200",
          !calm && "border-signal bg-signal",
        )}
      />
      {showLabel ? (
        <span>
          Motion <span aria-hidden="true">{calm ? "off" : "on"}</span>
        </span>
      ) : null}
    </button>
  );
}

"use client";

import { useSyncExternalStore } from "react";

import { SplitFlap } from "@/components/split-flap";

const formatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Dublin",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function subscribe(onTick: () => void) {
  const id = window.setInterval(onTick, 1000);
  return () => window.clearInterval(id);
}

// Cork time on split-flap tiles. It flips in from "--:--" once the page is
// live, then flips again on every minute.
export function FlapTime({
  className,
  cellClassName,
}: {
  className?: string;
  cellClassName?: string;
}) {
  const time = useSyncExternalStore(
    subscribe,
    () => formatter.format(Date.now()),
    () => null,
  );

  return (
    <SplitFlap
      value={time ?? "--:--"}
      className={className}
      cellClassName={cellClassName}
    />
  );
}

"use client";

import { useSyncExternalStore } from "react";

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

function getSnapshot() {
  return formatter.format(Date.now());
}

function getServerSnapshot() {
  return null;
}

export function LocalTime({ className }: { className?: string }) {
  const time = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return <span className={className}>{time ?? "--:--"}</span>;
}

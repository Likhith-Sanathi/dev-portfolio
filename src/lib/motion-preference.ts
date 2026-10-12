import { useSyncExternalStore } from "react";

import { MOTION_STORAGE_KEY } from "@/lib/preference-script";

// The page is "calm" when the visitor asks for reduced motion, either through
// their OS setting or the on-page toggle. The toggle can also override the OS
// setting the other way. The choice lives on <html data-motion> so CSS (the
// `calm:` variant in globals.css) and JS read the same source of truth; a
// saved choice is applied before hydration by preference-script.ts.

export const MOTION_PREFERENCE_EVENT = "motionpreference";
const EVENT = MOTION_PREFERENCE_EVENT;
const OS_QUERY = "(prefers-reduced-motion: reduce)";

export type MotionPreference = "full" | "reduced";

function subscribe(onChange: () => void) {
  const list = window.matchMedia(OS_QUERY);
  list.addEventListener("change", onChange);
  window.addEventListener(EVENT, onChange);
  return () => {
    list.removeEventListener("change", onChange);
    window.removeEventListener(EVENT, onChange);
  };
}

function isCalm() {
  const choice = document.documentElement.dataset.motion;
  if (choice === "reduced") {
    return true;
  }
  if (choice === "full") {
    return false;
  }
  return window.matchMedia(OS_QUERY).matches;
}

export function useCalm() {
  return useSyncExternalStore(subscribe, isCalm, () => false);
}

export function setMotionPreference(preference: MotionPreference) {
  document.documentElement.dataset.motion = preference;
  try {
    localStorage.setItem(MOTION_STORAGE_KEY, preference);
  } catch {
    // Private mode or blocked storage: the choice still holds for this visit.
  }
  window.dispatchEvent(new Event(EVENT));
}

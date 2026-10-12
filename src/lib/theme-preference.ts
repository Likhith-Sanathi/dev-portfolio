import { useSyncExternalStore } from "react";

import { THEME_STORAGE_KEY } from "@/lib/preference-script";

// Light is the default; dark is a choice made with the on-page toggle and
// remembered. It lives on <html data-theme> so CSS and JS share one source of
// truth; a saved choice is applied before hydration by preference-script.ts.

export const THEME_EVENT = "themepreference";

export type Theme = "light" | "dark";

const browserColours: Record<Theme, string> = { light: "#f3f2ee", dark: "#111110" };

function subscribe(onChange: () => void) {
  window.addEventListener(THEME_EVENT, onChange);
  return () => window.removeEventListener(THEME_EVENT, onChange);
}

function currentTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function useTheme() {
  return useSyncExternalStore(subscribe, currentTheme, (): Theme => "light");
}

export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Private mode or blocked storage: the choice still holds for this visit.
  }
  syncBrowserColour(theme);
  window.dispatchEvent(new Event(THEME_EVENT));
}

// Keeps the browser chrome (address bar on phones) in step with the page.
export function syncBrowserColour(theme: Theme) {
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", browserColours[theme]);
}

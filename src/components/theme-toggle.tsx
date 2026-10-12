"use client";

import { useEffect } from "react";

import { setTheme, syncBrowserColour, useTheme } from "@/lib/theme-preference";
import { cn } from "@/lib/utils";

// Switches between the light and dark palettes, remembered between visits.
// The mark is a half-filled square: the contrast symbol, kept to the grid.
export function ThemeToggle({
  className,
  showLabel = true,
}: {
  className?: string;
  showLabel?: boolean;
}) {
  const theme = useTheme();
  const dark = theme === "dark";

  // A choice restored before hydration still needs the browser chrome updated.
  useEffect(() => {
    syncBrowserColour(theme);
  }, [theme]);

  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      // A stable name with a pressed state reads as "Dark mode, toggle, pressed".
      aria-pressed={dark}
      aria-label={showLabel ? undefined : "Dark mode"}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "inline-flex items-center gap-2 transition-colors duration-200 hover:text-signal-ink",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="relative size-2.5 shrink-0 overflow-hidden border border-current"
      >
        <span className="absolute inset-y-0 left-0 w-1/2 bg-current" />
      </span>
      {showLabel ? (
        <span>
          Dark mode <span aria-hidden="true">{dark ? "on" : "off"}</span>
        </span>
      ) : null}
    </button>
  );
}

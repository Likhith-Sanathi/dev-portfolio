"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { frame, grid } from "@/lib/grid";
import { cn } from "@/lib/utils";

// Reveals the 12-column layout grid the page is set on. Press G to toggle.
export function GridToggle({ className }: { className?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() !== "g" || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      if (
        event.target instanceof Element &&
        event.target.closest("input, textarea, [contenteditable='true']")
      ) {
        return;
      }

      setVisible((current) => !current);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        aria-pressed={visible}
        className={cn(
          "inline-flex items-center gap-2 text-left transition-colors duration-200 hover:text-signal-ink",
          className,
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "size-2.5 border border-current transition-colors duration-200",
            visible && "border-signal bg-signal",
          )}
        />
        {visible ? "Hide grid" : "Show grid"}
        <kbd className="hidden font-sans opacity-60 md:inline">G</kbd>
      </button>
      {/* Portalled so the footer's stacking context can't bury it. */}
      {visible
        ? createPortal(
            <div
              aria-hidden="true"
              className="pointer-events-none fixed inset-0 z-[60]"
            >
              <div className={cn(frame, grid, "h-full")}>
                {Array.from({ length: 12 }, (_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "h-full bg-signal/10 outline outline-1 -outline-offset-1 outline-signal/30",
                      index >= 4 && "hidden md:block",
                    )}
                  />
                ))}
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

"use client";

import { useLenis } from "lenis/react";

// Lets keyboard and screen reader users jump past the long pinned intro.
// Moves focus as well as scroll, since smooth scrolling intercepts the jump.
export function SkipLink({ target, children }: { target: string; children: React.ReactNode }) {
  const lenis = useLenis();

  function onClick(event: React.MouseEvent<HTMLAnchorElement>) {
    const element = document.getElementById(target);
    if (!element) {
      return;
    }
    event.preventDefault();
    if (lenis) {
      lenis.scrollTo(element, { offset: -56, immediate: true, force: true });
    } else {
      element.scrollIntoView();
    }
    element.focus({ preventScroll: true });
  }

  return (
    <a
      href={`#${target}`}
      onClick={onClick}
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:bg-ink focus:px-3 focus:py-2 focus:text-sm focus:text-paper"
    >
      {children}
    </a>
  );
}

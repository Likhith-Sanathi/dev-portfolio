"use client";

import { useLenis } from "lenis/react";
import { ArrowUp } from "lucide-react";

import { useCalm } from "@/lib/motion-preference";
import { cn } from "@/lib/utils";

function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

// Back to the top the long way: a slow scroll that plays the whole page back
// in reverse. Calm visitors jump straight there.
export function RewindLink({ className }: { className?: string }) {
  const lenis = useLenis();
  const calm = useCalm();

  function onClick(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    if (lenis && !calm) {
      lenis.scrollTo(0, { duration: 4, easing: easeInOut, force: true });
    } else {
      window.scrollTo(0, 0);
    }
  }

  return (
    <a
      href="#top"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 transition-colors duration-200 hover:text-signal-ink",
        className,
      )}
    >
      {calm ? "Top" : "Rewind to top"}
      <ArrowUp className="size-4" strokeWidth={1.75} />
    </a>
  );
}

"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

// Header navigation that marks the chapter currently under the middle of the
// screen, so the reader always knows where they are in the story.
export function SectionNav({
  sections,
}: {
  sections: readonly { href: string; label: string; index: string }[];
}) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const href = `#${entry.target.id}`;
          if (entry.isIntersecting) {
            visible.add(href);
          } else {
            visible.delete(href);
          }
        }
        setActive(visible.values().next().value ?? null);
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );

    for (const section of sections) {
      const element = document.querySelector(section.href);
      if (element) {
        observer.observe(element);
      }
    }
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav
      aria-label="Sections"
      className="hidden md:col-span-8 md:grid md:grid-cols-subgrid"
    >
      {sections.map((section) => {
        const isActive = section.href === active;

        return (
          <a
            key={section.href}
            href={section.href}
            aria-current={isActive ? "location" : undefined}
            className="group col-span-2 flex gap-2 transition-colors duration-200 hover:text-signal"
          >
            <span
              className={cn(
                "hidden tabular-nums transition-colors duration-200 group-hover:text-signal lg:inline",
                isActive ? "text-signal" : "text-mute",
              )}
            >
              {section.index}
            </span>
            <span
              className={cn(
                "underline-offset-[6px] transition-[text-decoration-color] duration-200",
                isActive
                  ? "underline decoration-signal decoration-2"
                  : "decoration-transparent",
              )}
            >
              {section.label}
            </span>
          </a>
        );
      })}
    </nav>
  );
}

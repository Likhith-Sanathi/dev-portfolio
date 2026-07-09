"use client";

import AutoScroll from "embla-carousel-auto-scroll";

import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import type { SkillLogo } from "@/lib/skill-logos";
import { cn } from "@/lib/utils";

interface Logos3Props {
  heading?: string;
  logos?: SkillLogo[];
  className?: string;
  direction?: "forward" | "backward";
}

function buildLoopingLogos(logos: SkillLogo[]) {
  if (logos.length <= 1) {
    return logos;
  }

  const clones = logos.map((logo, index) => ({
    ...logo,
    id: `${logo.id}-clone-${index}`,
    isClone: true,
  }));

  return [...logos, ...clones];
}

function LogoMark({ logo }: { logo: SkillLogo }) {
  return (
    <svg
      viewBox="0 0 24 24"
      role="img"
      aria-label={logo.description}
      className="h-10 w-10 shrink-0 text-white"
    >
      <path fill="currentColor" d={logo.icon.path} />
    </svg>
  );
}

const Logos3 = ({
  heading = "Trusted by these companies",
  logos = [],
  className,
  direction = "forward",
}: Logos3Props) => {
  const loopingLogos = buildLoopingLogos(logos);

  return (
    <section
      className={cn(
        "w-full oled-panel rounded-[2rem] border border-white/10 p-4 md:p-5",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-code text-[0.72rem] uppercase tracking-[0.36em] text-white/65">
          {heading}
        </h3>
      </div>
      <div className="relative mt-4 overflow-hidden">
        <Carousel
          className="w-full"
          opts={{ loop: true }}
          plugins={[AutoScroll({ direction, playOnInit: true })]}
        >
          <CarouselContent className="ml-0">
            {loopingLogos.map((logo) => (
              <CarouselItem
                key={logo.id}
                aria-hidden={logo.isClone ? true : undefined}
                className="flex basis-auto justify-center pl-0 pr-4 md:pr-6"
              >
                <div className="flex shrink-0 items-center justify-center">
                  <LogoMark logo={logo} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-background to-transparent" />
      </div>
    </section>
  );
};

export { Logos3 };

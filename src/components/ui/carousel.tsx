"use client";

import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";

import { cn } from "@/lib/utils";

type CarouselApi = ReturnType<typeof useEmblaCarousel>[1];
type CarouselPlugin = Parameters<typeof useEmblaCarousel>[1];
type CarouselOptions = Parameters<typeof useEmblaCarousel>[0];

type CarouselContextValue = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  orientation: "horizontal" | "vertical";
};

const CarouselContext = React.createContext<CarouselContextValue | null>(null);

function useCarouselContext() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("Carousel components must be used within <Carousel>.");
  }

  return context;
}

function Carousel({
  className,
  opts,
  plugins,
  orientation = "horizontal",
  setApi,
  children,
  ...props
}: React.PropsWithChildren<
  React.HTMLAttributes<HTMLDivElement> & {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
  }
>) {
  const [carouselRef, api] = useEmblaCarousel(
    { ...opts, axis: orientation === "horizontal" ? "x" : "y" },
    plugins,
  );

  React.useEffect(() => {
    setApi?.(api);
  }, [api, setApi]);

  return (
    <CarouselContext.Provider value={{ carouselRef, orientation }}>
      <div
        data-slot="carousel"
        className={cn("relative w-full", className)}
        role="region"
        aria-roledescription="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

function CarouselContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { carouselRef, orientation } = useCarouselContext();

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        data-slot="carousel-content"
        className={cn(
          "flex",
          orientation === "horizontal" ? "items-center" : "flex-col",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function CarouselItem({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { orientation } = useCarouselContext();

  return (
    <div
      data-slot="carousel-item"
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-auto",
        orientation === "horizontal" ? "pl-0 pr-4 md:pr-6" : "pt-4",
        className,
      )}
      {...props}
    />
  );
}

export { Carousel, CarouselContent, CarouselItem };

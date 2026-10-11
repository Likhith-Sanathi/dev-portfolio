"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useAnimationFrame,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "motion/react";

import { reelScenes } from "@/components/reel/reel-scenes";
import { BackgroundPaperShaders } from "@/components/ui/background-paper-shaders";
import { portfolio } from "@/lib/portfolio-content";
import { cn } from "@/lib/utils";

type Chapter = {
  label: string;
  start: number;
  duration: number;
  sceneIndex: number;
};

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const sceneStarts = reelScenes.map((_, index) =>
  reelScenes
    .slice(0, index)
    .reduce((sum, scene) => sum + scene.duration, 0),
);

const totalDuration = reelScenes.reduce(
  (sum, scene) => sum + scene.duration,
  0,
);

const chapters = reelScenes.reduce<Chapter[]>((list, scene, index) => {
  const previous = list[list.length - 1];

  if (previous?.label === scene.chapter) {
    previous.duration += scene.duration;
  } else {
    list.push({
      label: scene.chapter,
      start: sceneStarts[index],
      duration: scene.duration,
      sceneIndex: index,
    });
  }

  return list;
}, []);

const chapterOfScene = reelScenes.map(
  (_, index) =>
    chapters.filter((chapter) => chapter.sceneIndex <= index).length - 1,
);

function sceneIndexAt(time: number) {
  let index = 0;

  while (index + 1 < sceneStarts.length && sceneStarts[index + 1] <= time) {
    index += 1;
  }

  return index;
}

function formatTime(seconds: number) {
  const whole = Math.floor(seconds);

  return `${String(Math.floor(whole / 60)).padStart(2, "0")}:${String(
    whole % 60,
  ).padStart(2, "0")}`;
}

const subscribeToNothing = () => () => {};

/** `?record` hides the controls and stops on the last frame for video capture. */
function useRecordMode() {
  return useSyncExternalStore(
    subscribeToNothing,
    () => new URLSearchParams(window.location.search).has("record"),
    () => false,
  );
}

export function PortfolioReel() {
  const recordMode = useRecordMode();
  const time = useMotionValue(0);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [take, setTake] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [finished, setFinished] = useState(false);
  const sceneIndexRef = useRef(0);

  const goToScene = useCallback(
    (index: number) => {
      const next = (index + reelScenes.length) % reelScenes.length;

      time.set(sceneStarts[next]);
      sceneIndexRef.current = next;
      setSceneIndex(next);
      setTake((value) => value + 1);
      setFinished(false);
    },
    [time],
  );

  const restart = useCallback(() => {
    goToScene(0);
    setPlaying(true);
  }, [goToScene]);

  useAnimationFrame((_, delta) => {
    if (!playing) {
      return;
    }

    let next = time.get() + delta / 1000;

    if (next >= totalDuration) {
      if (recordMode) {
        time.set(totalDuration);
        setPlaying(false);
        setFinished(true);
        return;
      }

      next %= totalDuration;
    }

    time.set(next);

    const index = sceneIndexAt(next);

    if (index !== sceneIndexRef.current) {
      sceneIndexRef.current = index;
      setSceneIndex(index);
    }
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const onControl =
        event.target instanceof Element && event.target.closest("a, button");

      if (event.key === " " || event.key === "k") {
        if (onControl && event.key === " ") {
          return;
        }

        event.preventDefault();
        setPlaying((value) => !value);
      } else if (event.key === "ArrowRight") {
        goToScene(sceneIndexRef.current + 1);
      } else if (event.key === "ArrowLeft") {
        goToScene(sceneIndexRef.current - 1);
      } else if (event.key === "r") {
        restart();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToScene, restart]);

  useEffect(() => {
    if (!recordMode) {
      return;
    }

    const reelWindow = window as Window & {
      __reel?: { duration: number; restart: () => void };
    };

    reelWindow.__reel = { duration: totalDuration, restart };

    return () => {
      delete reelWindow.__reel;
    };
  }, [recordMode, restart]);

  const scene = reelScenes[sceneIndex];
  const chapterIndex = chapterOfScene[sceneIndex];

  return (
    <MotionConfig reducedMotion="user">
      <div
        className="relative isolate h-dvh w-full overflow-hidden bg-background text-foreground selection:bg-white selection:text-black"
        data-reel-duration={totalDuration}
        data-reel-state={finished ? "finished" : playing ? "playing" : "paused"}
      >
        <BackgroundPaperShaders className="z-0" maxPixelCount={960 * 540} />
        <ChapterNumeral index={chapterIndex} />

        <main className="relative z-10 h-full">
          <AnimatePresence>
            {scene.overlay ? (
              <motion.div
                key={scene.overlay.key}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.45, ease } }}
                transition={{ duration: 0.35 }}
              >
                {scene.overlay.render()}
              </motion.div>
            ) : null}
          </AnimatePresence>
          <AnimatePresence>
            <motion.section
              key={`${scene.id}:${take}`}
              aria-label={scene.chapter}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.45, ease } }}
              transition={{ duration: 0.35 }}
            >
              {scene.render()}
            </motion.section>
          </AnimatePresence>
        </main>

        <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between gap-4 px-5 pt-5 font-code text-xs uppercase sm:px-[4vw] sm:pt-6">
          <Link
            href="/"
            className="pointer-events-auto flex min-w-0 items-center gap-3 tracking-[0.3em] text-white/80 transition-colors duration-200 ease-out hover:text-white"
          >
            <span className="size-1.5 shrink-0 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)]" />
            <span className="truncate">{portfolio.name}</span>
          </Link>
          <div className="flex shrink-0 items-center gap-4 tracking-[0.24em] text-white/60">
            <span className="hidden sm:inline">{scene.chapter}</span>
            {recordMode ? null : <Timecode time={time} />}
          </div>
        </header>

        <footer className="absolute inset-x-0 bottom-0 z-30 flex items-end gap-4 px-5 pb-5 sm:px-[4vw] sm:pb-6">
          <nav aria-label="Reel chapters" className="flex min-w-0 flex-1 gap-1.5">
            {chapters.map((chapter, index) => (
              <ChapterSegment
                key={chapter.label}
                chapter={chapter}
                time={time}
                active={index === chapterIndex}
                interactive={!recordMode}
                onSelect={() => goToScene(chapter.sceneIndex)}
              />
            ))}
          </nav>
          {recordMode ? null : (
            <div className="flex shrink-0 items-center gap-1.5">
              <ControlButton label="Previous scene" onClick={() => goToScene(sceneIndex - 1)}>
                <ChevronLeft />
              </ControlButton>
              <ControlButton
                label={playing ? "Pause reel" : "Play reel"}
                onClick={() => setPlaying((value) => !value)}
              >
                {playing ? <Pause /> : <Play />}
              </ControlButton>
              <ControlButton label="Next scene" onClick={() => goToScene(sceneIndex + 1)}>
                <ChevronRight />
              </ControlButton>
              <ControlButton label="Restart reel" onClick={restart}>
                <RotateCcw />
              </ControlButton>
              <Link
                href="/"
                className="ml-1 hidden h-9 items-center gap-1 rounded-full bg-white px-4 text-sm font-medium text-black shadow-[0_0_24px_rgba(255,255,255,0.28)] transition-colors duration-200 ease-out hover:bg-white/90 sm:inline-flex"
              >
                Site
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
          )}
        </footer>
      </div>
    </MotionConfig>
  );
}

function Timecode({ time }: { time: MotionValue<number> }) {
  const label = useTransform(
    time,
    (value) => `${formatTime(value)} / ${formatTime(totalDuration)}`,
  );

  return <motion.span className="tabular-nums">{label}</motion.span>;
}

function ChapterNumeral({ index }: { index: number }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute bottom-[12vh] right-[3vw] z-[1] overflow-hidden font-code text-[clamp(8rem,24vw,22rem)] font-semibold leading-none tracking-[-0.06em] text-white/[0.04]"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={index}
          className="block"
          initial={{ y: "60%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-60%", opacity: 0 }}
          transition={{ duration: 0.8, ease }}
        >
          {String(index + 1).padStart(2, "0")}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

function ChapterSegment({
  chapter,
  time,
  active,
  interactive,
  onSelect,
}: {
  chapter: Chapter;
  time: MotionValue<number>;
  active: boolean;
  interactive: boolean;
  onSelect: () => void;
}) {
  const scaleX = useTransform(time, (value) =>
    Math.min(Math.max((value - chapter.start) / chapter.duration, 0), 1),
  );

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={!interactive}
      aria-label={`Jump to ${chapter.label}`}
      aria-current={active ? "step" : undefined}
      className="group flex min-w-0 flex-col gap-2 py-2 text-left disabled:cursor-default"
      style={{ flexGrow: chapter.duration, flexBasis: 0 }}
    >
      <span className="relative h-[3px] w-full overflow-hidden rounded-full bg-white/15">
        <motion.span
          className="absolute inset-0 origin-left rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.5)]"
          style={{ scaleX }}
        />
      </span>
      <span
        className={cn(
          "hidden truncate font-code text-[10px] uppercase tracking-[0.24em] transition-colors duration-200 ease-out md:block",
          active ? "text-white" : "text-white/45 group-enabled:group-hover:text-white/75",
        )}
      >
        {chapter.label}
      </span>
    </button>
  );
}

function ControlButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="inline-flex size-9 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/85 backdrop-blur-xl transition-colors duration-200 ease-out hover:bg-white/[0.12] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 [&_svg]:size-4"
    >
      {children}
    </button>
  );
}

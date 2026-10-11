"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";

import {
  ArrowUpRight,
  Award,
  Mail,
  MapPin,
  Radio,
  Send,
  Sparkles,
  Terminal,
} from "lucide-react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useTransform,
  type Variants,
} from "motion/react";

import { LogoMark } from "@/components/blocks/logos3";
import { KineticText } from "@/components/kinetic-text";
import { Badge } from "@/components/ui/badge";
import { LayeredPanel } from "@/components/ui/layered-panel";
import { portfolio } from "@/lib/portfolio-content";
import { skillLabelsToLogos } from "@/lib/skill-logos";
import { cn } from "@/lib/utils";

export type ReelScene = {
  id: string;
  chapter: string;
  /** Seconds the scene stays on stage before the next one takes over. */
  duration: number;
  render: () => ReactNode;
  /** Layer that stays mounted across consecutive scenes sharing the same key. */
  overlay?: { key: string; render: () => ReactNode };
};

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];
const exitEase: [number, number, number, number] = [0.7, 0, 0.84, 0];

const chipVariants: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.9 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease } },
};

const socialIcons = {
  GitHub: Terminal,
  LinkedIn: ArrowUpRight,
  Email: Mail,
};

const cardClass =
  "oled-panel relative overflow-hidden rounded-[1.75rem] p-5 sm:p-7";

const pad = (value: number) => String(value).padStart(2, "0");

const skillCount = portfolio.skillGroups.reduce(
  (sum, group) => sum + group.items.length,
  0,
);

const skillRails = portfolio.skillGroups.map((group) => ({
  heading: group.title,
  logos: skillLabelsToLogos(group.items),
}));

function SceneShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "absolute inset-0 flex items-center justify-center px-5 pb-[clamp(5.5rem,13vh,9rem)] pt-[clamp(4.5rem,11vh,7.5rem)] sm:px-[6vw]",
        className,
      )}
      style={{ perspective: "1400px" }}
    >
      {children}
    </div>
  );
}

function SceneLabel({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) {
  return (
    <motion.p
      className="font-code text-[clamp(0.7rem,1vw,0.875rem)] uppercase tracking-[0.36em] text-white/65"
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay, ease }}
    >
      {children}
    </motion.p>
  );
}

/** A 0→1 motion value that runs once on mount, driven by the motion frame loop. */
function useTimeline(duration: number, delay: number) {
  const progress = useMotionValue(0);

  useEffect(() => {
    const controls = animate(progress, 1, { duration, delay, ease: "linear" });

    return () => controls.stop();
  }, [progress, duration, delay]);

  return progress;
}

function Typewriter({
  text,
  delay = 0,
  duration = text.length * 0.035,
}: {
  text: string;
  delay?: number;
  duration?: number;
}) {
  const progress = useTimeline(duration, delay);
  const visible = useTransform(progress, (value) =>
    text.slice(0, Math.round(value * text.length)),
  );

  return (
    <>
      <span className="sr-only">{text}</span>
      <motion.span aria-hidden="true">{visible}</motion.span>
    </>
  );
}

const scrambleGlyphs = "#%&*+<>/\\[]{}=?01";

function scramble(text: string, progress: number) {
  const revealed = Math.floor(progress * text.length);
  const tick = Math.floor(progress * 40);

  return Array.from(text, (character, index) => {
    if (index < revealed || character === " ") {
      return character;
    }

    return scrambleGlyphs[(index * 7 + tick * 13) % scrambleGlyphs.length];
  }).join("");
}

function ScrambleText({
  text,
  delay = 0,
  duration = 1,
}: {
  text: string;
  delay?: number;
  duration?: number;
}) {
  const progress = useTimeline(duration, delay);
  const output = useTransform(progress, (value) => scramble(text, value));

  return (
    <>
      <span className="sr-only">{text}</span>
      <motion.span aria-hidden="true">{output}</motion.span>
    </>
  );
}

function Cursor({ delay = 0 }: { delay?: number }) {
  return (
    <motion.span
      aria-hidden="true"
      className="ml-1 inline-block h-[1em] w-[0.55em] translate-y-[0.12em] bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{
        duration: 0.9,
        delay,
        repeat: Infinity,
        times: [0, 0.5, 0.5, 1],
        ease: "linear",
      }}
    />
  );
}

function SplitHeadline({
  text,
  delay = 0,
  className,
}: {
  text: string;
  delay?: number;
  className?: string;
}) {
  const words = text.split(" ").map((word, wordIndex, all) => ({
    word,
    offset: all.slice(0, wordIndex).join("").length,
  }));

  return (
    <h1
      className={className}
      aria-label={text}
      style={{ perspective: "1000px" }}
    >
      {words.map(({ word, offset }) => (
        <span
          aria-hidden="true"
          key={`${word}-${offset}`}
          className="mr-[0.2em] inline-block whitespace-nowrap last:mr-0"
        >
          {Array.from(word, (character, index) => (
            <motion.span
              key={index}
              className="inline-block origin-bottom transform-gpu"
              initial={{
                opacity: 0,
                y: "0.45em",
                rotateX: -85,
                filter: "blur(10px)",
              }}
              animate={{ opacity: 1, y: "0em", rotateX: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.8,
                delay: delay + (offset + index) * 0.045,
                ease,
              }}
            >
              {character}
            </motion.span>
          ))}
        </span>
      ))}
    </h1>
  );
}

const bootLines = [
  ["profile", portfolio.name],
  ["based in", portfolio.location],
  ["studying", portfolio.education[0].institution],
  ["projects", `${portfolio.projects.length} loaded`],
  ["skills", `${skillCount} indexed`],
] as const;

function BootScene() {
  return (
    <SceneShell>
      <motion.div
        className="oled-panel relative w-full max-w-3xl overflow-hidden rounded-[2rem]"
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{
          opacity: 0,
          scale: 1.06,
          filter: "blur(12px)",
          transition: { duration: 0.45, ease: exitEase },
        }}
        transition={{ duration: 0.7, ease }}
      >
        <div className="scanlines absolute inset-0 opacity-30" />
        <div className="relative flex items-center gap-2 border-b border-white/10 px-5 py-4 sm:px-8">
          {[0, 1, 2].map((dot) => (
            <span key={dot} className="size-2.5 rounded-full bg-white/20" />
          ))}
          <span className="ml-3 font-code text-xs uppercase tracking-[0.3em] text-white/55">
            Portfolio OS
          </span>
        </div>
        <div className="relative space-y-3 p-5 font-code text-[clamp(0.8rem,1.5vw,1.3rem)] leading-relaxed sm:p-8">
          <p className="text-white">
            <span className="text-white/45">$ </span>
            <Typewriter text="portfolio-os --boot" delay={0.35} duration={0.7} />
          </p>
          {bootLines.map(([label, value], index) => (
            <motion.p
              key={label}
              className="flex gap-3 sm:gap-4"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 1.15 + index * 0.24, ease }}
            >
              <span className="shrink-0 text-white">[ ok ]</span>
              <span className="w-20 shrink-0 text-white/50 sm:w-32">{label}</span>
              <span className="min-w-0 truncate text-white/85">{value}</span>
            </motion.p>
          ))}
          <motion.p
            className="pt-2 text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 2.45 }}
          >
            <span className="text-white/45">&gt; </span>
            launching reel
            <Cursor delay={2.45} />
          </motion.p>
        </div>
      </motion.div>
    </SceneShell>
  );
}

function IntroScene() {
  return (
    <SceneShell>
      <div className="w-full max-w-[1500px] space-y-[clamp(1rem,3vh,2rem)]">
        <motion.div
          className="flex flex-wrap items-center gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
        >
          <Badge className="h-auto min-h-8 whitespace-normal rounded-full border-white/20 bg-white/10 px-4 py-1 leading-5 text-white shadow-[0_0_36px_rgba(255,255,255,0.16)]">
            <Sparkles className="size-3.5" />
            {portfolio.availability}
          </Badge>
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="size-4" />
            {portfolio.location}
          </span>
        </motion.div>
        <motion.p
          className="font-code text-[clamp(0.7rem,1.1vw,1rem)] uppercase tracking-[0.28em] text-muted-foreground sm:tracking-[0.42em]"
          initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
          animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
          transition={{ duration: 0.9, delay: 0.3, ease }}
        >
          {portfolio.role}
        </motion.p>
        <SplitHeadline
          text={portfolio.headline}
          delay={0.45}
          className="font-heading text-[clamp(3.4rem,min(12vw,22vh),12rem)] font-light leading-[0.92] tracking-[-0.075em] heading-glow"
        />
        <motion.div
          aria-hidden="true"
          className="h-px w-full max-w-[1100px] origin-left bg-[linear-gradient(90deg,#fff,rgba(255,255,255,0.4),transparent)] shadow-[0_0_18px_rgba(255,255,255,0.45)]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 1.2, ease }}
        />
        <motion.p
          className="max-w-3xl text-pretty text-[clamp(1.05rem,1.7vw,1.6rem)] leading-[1.45] text-muted-foreground"
          initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 1.5, ease }}
        >
          {portfolio.hero}
        </motion.p>
      </div>
    </SceneShell>
  );
}

function StatsScene() {
  return (
    <SceneShell>
      <div className="w-full max-w-6xl">
        <SceneLabel>Portfolio OS</SceneLabel>
        <div className="mt-[clamp(1rem,3vh,2rem)] grid gap-3 sm:grid-cols-3 sm:gap-4">
          {portfolio.stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className={cardClass}
              initial={{ opacity: 0, y: 70, rotateX: 30, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 + index * 0.14, ease }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.18),transparent_45%)]" />
              <div className="scanlines absolute inset-0 opacity-30" />
              <div className="relative">
                <p className="whitespace-nowrap font-code text-[clamp(1.9rem,3.1vw,3.6rem)] font-semibold leading-none tracking-[-0.04em]">
                  <ScrambleText
                    text={stat.value}
                    delay={0.45 + index * 0.16}
                    duration={1.1}
                  />
                </p>
                <motion.div
                  className="mt-[clamp(1rem,3vh,2rem)] h-px origin-left bg-white/25"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.9, delay: 0.9 + index * 0.14, ease }}
                />
                <motion.p
                  className="mt-4 text-[clamp(0.85rem,1.2vw,1.15rem)] text-white/70"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.1 + index * 0.14, ease }}
                >
                  {stat.label}
                </motion.p>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.p
          className="mt-[clamp(1.25rem,4vh,2.5rem)] max-w-4xl text-pretty text-[clamp(1.1rem,2vw,2rem)] font-medium leading-[1.35]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.7, ease }}
        >
          {portfolio.summary}
        </motion.p>
      </div>
    </SceneShell>
  );
}

function CardKicker({ label, meta }: { label: string; meta: string }) {
  return (
    <div className="flex items-center justify-between gap-4 font-code text-[11px] uppercase">
      <p className="tracking-[0.28em] text-white/70">{label}</p>
      <p className="tracking-[0.22em] text-white/60">{meta}</p>
    </div>
  );
}

function AboutScene() {
  const education = portfolio.education[0];
  const experience = portfolio.experience[0];

  return (
    <SceneShell>
      <div className="w-full max-w-6xl">
        <SceneLabel>About me</SceneLabel>
        <KineticText
          text="Built through shipping."
          trigger="mount"
          delay={0.1}
          className="mt-3 text-[clamp(2.4rem,min(5.6vw,10vh),6rem)] leading-none tracking-[-0.06em]"
        />
        <div className="mt-[clamp(1.25rem,4vh,2.5rem)] grid gap-3 sm:gap-4 lg:grid-cols-2">
          <motion.div
            className={cardClass}
            initial={{ opacity: 0, x: -60, rotateY: 14 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.55, ease }}
          >
            <CardKicker label="Education" meta={education.period} />
            <h3 className="mt-4 text-[clamp(1.35rem,2.3vw,2.1rem)] font-medium tracking-[-0.03em]">
              {education.institution}
            </h3>
            <p className="mt-1 text-[clamp(0.95rem,1.3vw,1.15rem)] text-white/82">
              {education.degree}
            </p>
            <p className="mt-2 text-sm text-white/68">{education.detail}</p>
            <motion.div
              className="mt-5 hidden flex-wrap gap-2 sm:flex"
              initial="hidden"
              animate="show"
              variants={{
                show: { transition: { staggerChildren: 0.06, delayChildren: 1.2 } },
              }}
            >
              {education.coursework.map((course) => (
                <motion.span
                  key={course}
                  variants={chipVariants}
                  className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-white/72"
                >
                  {course}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
          <motion.div
            className={cardClass}
            initial={{ opacity: 0, x: 60, rotateY: -14 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.75, ease }}
          >
            <CardKicker label="Experience" meta={experience.period} />
            <h3 className="mt-4 text-[clamp(1.35rem,2.3vw,2.1rem)] font-semibold tracking-[-0.03em]">
              {experience.title}
            </h3>
            <p className="mt-1 text-[clamp(0.95rem,1.3vw,1.15rem)] text-white/82">
              {experience.company}
            </p>
            <motion.p
              className="mt-4 text-[clamp(0.9rem,1.15vw,1.05rem)] leading-[1.65] text-white/74"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.3, ease }}
            >
              {experience.description}
            </motion.p>
            <motion.p
              className="mt-4 hidden gap-3 text-sm leading-6 text-white/62 sm:flex"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.7, ease }}
            >
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-white/70" />
              <span>{experience.highlights[0]}</span>
            </motion.p>
          </motion.div>
        </div>
      </div>
    </SceneShell>
  );
}

function AchievementsScene() {
  return (
    <SceneShell>
      <div className="w-full max-w-6xl">
        <SceneLabel>Achievements</SceneLabel>
        <div className="mt-[clamp(1rem,3vh,2rem)] grid gap-3 sm:gap-4 md:grid-cols-2">
          {portfolio.achievements.map((achievement, index) => (
            <motion.div
              key={achievement.title}
              className={cardClass}
              initial={{
                opacity: 0,
                y: 90,
                rotateX: 20,
                rotateZ: index % 2 === 0 ? -5 : 5,
                scale: 0.92,
              }}
              animate={{ opacity: 1, y: 0, rotateX: 0, rotateZ: 0, scale: 1 }}
              transition={{ duration: 0.75, delay: 0.25 + index * 0.18, ease }}
            >
              <div className="flex items-start justify-between gap-4">
                <Award className="size-6 text-white drop-shadow-[0_0_14px_rgba(255,255,255,0.4)]" />
                <span className="font-code text-xs uppercase tracking-[0.2em] text-white/72">
                  {achievement.period}
                </span>
              </div>
              <h3 className="mt-4 text-[clamp(1rem,1.55vw,1.45rem)] font-medium leading-snug tracking-[-0.02em]">
                {achievement.title}
              </h3>
              <p className="mt-2 hidden text-sm leading-6 text-white/68 sm:block">
                {achievement.detail}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </SceneShell>
  );
}

function ProjectsHeader({ active }: { active: number }) {
  const total = portfolio.projects.length;

  return (
    <div className="absolute inset-x-0 top-[clamp(4.5rem,11vh,7.5rem)] px-5 sm:px-[6vw]">
      <div className="mx-auto flex max-w-6xl items-end justify-between gap-6">
        <div>
          <SceneLabel>Projects</SceneLabel>
          <KineticText
            text="Built across systems and markets."
            trigger="mount"
            className="mt-3 text-[clamp(1.8rem,min(4vw,7vh),4.25rem)] leading-none tracking-[-0.06em]"
          />
        </div>
        <motion.div
          className="hidden shrink-0 items-center gap-4 pb-2 sm:flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <span className="relative inline-flex h-5 w-8 justify-end overflow-hidden font-code text-sm text-white">
            <AnimatePresence initial={false}>
              <motion.span
                key={active}
                className="absolute right-0"
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                exit={{ y: "-100%" }}
                transition={{ duration: 0.45, ease }}
              >
                {pad(active + 1)}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="font-code text-sm text-white/45">/ {pad(total)}</span>
          <div className="flex items-center gap-1.5">
            {portfolio.projects.map((project, index) => (
              <motion.span
                key={project.title}
                className="h-1.5 rounded-full bg-white"
                initial={false}
                animate={{
                  width: index === active ? 24 : 6,
                  opacity: index === active ? 1 : 0.3,
                }}
                transition={{ duration: 0.45, ease }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ProjectScene({ index }: { index: number }) {
  const project = portfolio.projects[index];
  const direction = index % 2 === 0 ? 1 : -1;

  return (
    <SceneShell className="pt-[clamp(10rem,27vh,16rem)]">
      <motion.article
        className="oled-panel grid w-full max-w-6xl overflow-hidden rounded-[1.75rem] border border-white/10 lg:grid-cols-[0.8fr_1.2fr]"
        initial={{
          opacity: 0,
          y: 140,
          rotateX: 24,
          rotateZ: direction * -3,
          scale: 0.92,
        }}
        animate={{ opacity: 1, y: 0, rotateX: 0, rotateZ: 0, scale: 1 }}
        exit={{
          opacity: 0,
          y: -110,
          rotateX: -18,
          scale: 0.94,
          transition: { duration: 0.5, ease: exitEase },
        }}
        transition={{ duration: 0.8, ease }}
      >
        <div className="relative overflow-hidden bg-black p-5 sm:p-7 lg:min-h-[clamp(16rem,36vh,22rem)]">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.2),transparent_45%),radial-gradient(circle_at_75%_20%,rgba(255,255,255,0.16),transparent_35%)]" />
          <div className="grain absolute inset-0 opacity-40" />
          <motion.div
            aria-hidden="true"
            className="absolute inset-y-0 -left-1/2 w-1/2 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.16),transparent)]"
            initial={{ x: "0%", skewX: -18 }}
            animate={{ x: "400%", skewX: -18 }}
            transition={{ duration: 1.4, delay: 0.5, ease: "easeInOut" }}
          />
          <div className="relative flex h-full flex-col justify-between gap-6 lg:gap-8">
            <div className="flex items-center justify-between gap-3">
              <span className="font-code text-xs uppercase tracking-[0.28em] text-white/72">
                {pad(index + 1)}
              </span>
              <span className="rounded-full border border-white/15 px-3 py-1 font-code text-xs text-white/80">
                {project.period}
              </span>
            </div>
            <div>
              <motion.span
                className="mb-4 inline-block"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: 0.35, ease }}
              >
                <Radio className="size-7 text-white drop-shadow-[0_0_18px_rgba(255,255,255,0.36)]" />
              </motion.span>
              <p className="font-code text-[11px] uppercase tracking-[0.28em] text-white/68">
                {project.type}
              </p>
              <h3 className="mt-3 text-[clamp(1.9rem,3.4vw,3.25rem)] font-medium leading-[1.02] tracking-[-0.05em]">
                {project.title}
              </h3>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-5 p-5 sm:p-7">
          <motion.p
            className="line-clamp-4 text-[clamp(0.95rem,1.45vw,1.3rem)] leading-[1.5] text-foreground sm:line-clamp-none"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45, ease }}
          >
            {project.description}
          </motion.p>
          <motion.p
            className="hidden rounded-2xl border border-white/15 bg-white/[0.05] p-4 text-sm font-semibold text-white/84 sm:block"
            initial={{ opacity: 0, clipPath: "inset(0 100% 0 0 round 16px)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0% 0 0 round 16px)" }}
            transition={{ duration: 0.8, delay: 0.75, ease }}
          >
            {project.impact}
          </motion.p>
          <motion.div
            className="flex flex-wrap gap-2"
            initial="hidden"
            animate="show"
            variants={{
              show: { transition: { staggerChildren: 0.06, delayChildren: 0.95 } },
            }}
          >
            {project.tags.map((tag) => (
              <motion.span
                key={tag}
                variants={chipVariants}
                className="rounded-full bg-white/[0.08] px-3 py-1 text-xs text-white/80"
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </motion.article>
    </SceneShell>
  );
}

function SkillsScene() {
  return (
    <SceneShell>
      <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[minmax(16rem,24rem)_minmax(0,1fr)] lg:items-center lg:gap-12">
        <div>
          <SceneLabel>Skills</SceneLabel>
          <KineticText
            text="Technical range, grounded in practice."
            trigger="mount"
            delay={0.1}
            className="mt-3 text-[clamp(2rem,min(3.4vw,7vh),3.75rem)] leading-none tracking-[-0.06em]"
          />
        </div>
        <div className="grid min-w-0 gap-3">
          {skillRails.map((rail, index) => (
            <motion.div
              key={rail.heading}
              className="oled-panel min-w-0 overflow-hidden rounded-[1.5rem] border border-white/10 p-3 sm:p-4"
              initial={{ opacity: 0, x: index % 2 === 0 ? 80 : -80 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.4 + index * 0.12, ease }}
            >
              <div className="flex items-center justify-between font-code text-[0.7rem] uppercase">
                <h3 className="tracking-[0.32em] text-white/65">{rail.heading}</h3>
                <span className="text-white/45">{pad(rail.logos.length)}</span>
              </div>
              <div className="relative mt-3 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
                <motion.div
                  className="flex w-max"
                  animate={{ x: index % 2 === 0 ? ["0%", "-50%"] : ["-50%", "0%"] }}
                  transition={{
                    duration: 6 + rail.logos.length * 1.6,
                    ease: "linear",
                    repeat: Infinity,
                  }}
                >
                  {[...rail.logos, ...rail.logos].map((logo, logoIndex) => (
                    <div
                      key={`${logo.id}-${logoIndex}`}
                      aria-hidden={logoIndex >= rail.logos.length ? true : undefined}
                      className="pr-2.5"
                    >
                      <span className="flex h-12 items-center rounded-full border border-white/10 bg-white/[0.05] pr-4 text-sm text-white/80 sm:h-14">
                        <LogoMark logo={logo} />
                        {logo.description}
                      </span>
                    </div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SceneShell>
  );
}

function ContactScene() {
  return (
    <SceneShell>
      <motion.div
        className="w-full max-w-6xl"
        initial={{ opacity: 0, y: 70, scale: 0.92, rotateZ: 2 }}
        animate={{ opacity: 1, y: 0, scale: 1, rotateZ: 0 }}
        transition={{ duration: 0.9, ease }}
      >
        <LayeredPanel className="rounded-[2.5rem] p-6 text-foreground sm:p-10 md:p-12">
          <SceneLabel delay={0.3}>Contact me</SceneLabel>
          <KineticText
            text="Open to internships and ambitious technical work."
            trigger="mount"
            delay={0.35}
            className="mt-4 max-w-4xl text-[clamp(2.2rem,min(5.4vw,10vh),6rem)] leading-none tracking-[-0.06em]"
          />
          <div className="mt-[clamp(1.5rem,5vh,3rem)] flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <p className="font-code text-[clamp(0.95rem,2vw,1.75rem)] text-white">
              <Typewriter text={portfolio.email} delay={1.5} duration={1.1} />
              <Cursor delay={1.5} />
            </p>
            <motion.div
              className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:gap-3"
              initial="hidden"
              animate="show"
              variants={{
                show: { transition: { staggerChildren: 0.1, delayChildren: 2.2 } },
              }}
            >
              <motion.a
                href={`mailto:${portfolio.email}`}
                variants={chipVariants}
                className="relative isolate col-span-3 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-base font-medium text-black shadow-[0_0_34px_rgba(255,255,255,0.28)]"
              >
                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-1 -z-10 rounded-full bg-white/50 blur-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.15, 0.75, 0.15] }}
                  transition={{
                    duration: 1.8,
                    delay: 2.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <Send className="size-4" />
                Start a conversation
              </motion.a>
              {portfolio.socials.map((social) => {
                const Icon =
                  socialIcons[social.label as keyof typeof socialIcons] ??
                  ArrowUpRight;
                const external = !social.href.startsWith("mailto:");

                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    variants={chipVariants}
                    className="inline-flex h-12 min-w-0 items-center justify-center gap-1 rounded-full border border-white/20 bg-black/30 px-2 text-xs transition-colors duration-200 ease-out hover:border-white/30 hover:bg-white/[0.12] sm:gap-2 sm:px-4 sm:text-sm"
                  >
                    <Icon className="size-4" />
                    {social.label}
                  </motion.a>
                );
              })}
            </motion.div>
          </div>
        </LayeredPanel>
      </motion.div>
    </SceneShell>
  );
}

export const reelScenes: ReelScene[] = [
  { id: "boot", chapter: "Boot", duration: 3.4, render: () => <BootScene /> },
  { id: "intro", chapter: "Intro", duration: 5, render: () => <IntroScene /> },
  { id: "stats", chapter: "Stats", duration: 4.8, render: () => <StatsScene /> },
  { id: "about", chapter: "About", duration: 6.2, render: () => <AboutScene /> },
  {
    id: "achievements",
    chapter: "Achievements",
    duration: 4.6,
    render: () => <AchievementsScene />,
  },
  ...portfolio.projects.map((project, index) => ({
    id: `project-${index}`,
    chapter: "Projects",
    duration: 3.6,
    render: () => <ProjectScene index={index} />,
    overlay: {
      key: "projects",
      render: () => <ProjectsHeader active={index} />,
    },
  })),
  { id: "skills", chapter: "Skills", duration: 5.4, render: () => <SkillsScene /> },
  {
    id: "contact",
    chapter: "Contact",
    duration: 6.4,
    render: () => <ContactScene />,
  },
];

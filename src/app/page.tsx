import { ArrowUpRight } from "lucide-react";

import { CursorFollower } from "@/components/cursor-follower";
import { ChapterNumeral } from "@/components/chapter-numeral";
import { FlyInLines } from "@/components/fly-in-lines";
import { FooterReveal } from "@/components/footer-reveal";
import { GridFill } from "@/components/grid-fill";
import { GridLines } from "@/components/grid-lines";
import { GridToggle } from "@/components/grid-toggle";
import { HeroStage } from "@/components/hero-stage";
import { HorizontalGallery } from "@/components/horizontal-gallery";
import { InvertSection } from "@/components/invert-section";
import { LenisProvider } from "@/components/lenis-provider";
import { LocalTime } from "@/components/local-time";
import { Magnetic } from "@/components/magnetic";
import { MaskText } from "@/components/mask-text";
import { MotionProvider } from "@/components/motion-provider";
import { MotionToggle } from "@/components/motion-toggle";
import { Parallax } from "@/components/parallax";
import { ReplayIntro } from "@/components/replay-intro";
import { RewindLink } from "@/components/rewind-link";
import { Reveal, Rule } from "@/components/reveal";
import { ScrollProgress } from "@/components/scroll-progress";
import { ScrollStatement } from "@/components/scroll-statement";
import { SectionNav } from "@/components/section-nav";
import { SkillRows } from "@/components/skill-rows";
import { SkipLink } from "@/components/skip-link";
import { SpotlightGrid } from "@/components/spotlight-grid";
import { StatFigure } from "@/components/stat-figure";
import { ThemeToggle } from "@/components/theme-toggle";
import { Ticker } from "@/components/ticker";
import { Timeline } from "@/components/timeline";
import { frame, grid } from "@/lib/grid";
import { portfolio } from "@/lib/portfolio-content";
import { timeline } from "@/lib/timeline";
import { cn, pad } from "@/lib/utils";

const [firstName, lastName] = portfolio.name.split(" ");

const sections = portfolio.nav.map((item, index) => ({
  ...item,
  index: pad(index + 1),
}));

const sectionTitle =
  "text-display font-semibold leading-[0.92] tracking-[-0.05em]";

const heroMeta = [
  { label: "Discipline", content: portfolio.role },
  { label: "Studying", content: portfolio.education[0].institution },
  {
    label: "Based in",
    content: (
      <>
        {portfolio.location}
        <br />
        <LocalTime className="tabular-nums" /> local time
      </>
    ),
  },
  {
    label: "Status",
    content: (
      <span className="flex gap-2">
        <span
          aria-hidden="true"
          className="mt-[0.4em] size-2 shrink-0 bg-signal"
        />
        {portfolio.availability}
      </span>
    ),
  },
];

export default function Home() {
  return (
    <MotionProvider>
      <LenisProvider>
        <SkipLink target="about">Skip the intro</SkipLink>
        <ScrollProgress />
        <CursorFollower />
        <SiteHeader />
        {/* overflow-x-clip here, not on body: body overflow is handed to the
            viewport, where it doesn't stop sideways parallax widening the page
            on phones. Clip also keeps the pinned sections working. */}
        <main id="top" className="relative z-10 overflow-x-clip bg-paper">
          <HeroStage
            first={firstName}
            last={lastName}
            meta={heroMeta}
            statement={portfolio.hero}
          />
          {/* Everything after the hero is a curtain that slides up over the
              pinned red stage once its statement has been read. */}
          <div className="relative z-10 -mt-[100svh] border-t border-ink bg-paper calm:mt-0">
            <GlanceSection />
            <AboutSection />
            <ProjectTicker />
            <ProjectsSection />
            <SkillsSection />
            <GridFill />
            <ContactSection />
          </div>
        </main>
        <FooterReveal name={portfolio.name}>
          <FooterBar />
        </FooterReveal>
      </LenisProvider>
    </MotionProvider>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink bg-paper">
      <div className={cn(frame, grid, "h-14 items-center text-sm")}>
        <a
          href="#top"
          className="col-span-3 flex items-center gap-2.5 font-semibold tracking-[-0.01em]"
          aria-label={`${portfolio.name}, back to top`}
        >
          <span aria-hidden="true" className="size-3 shrink-0 bg-signal" />
          {portfolio.name}
        </a>
        <SectionNav sections={sections} />
        <div className="col-span-1 flex items-center gap-3 justify-self-end">
          {/* Hidden on tablets, where the nav fills the bar; both toggles are
              also in the footer. */}
          <ThemeToggle showLabel={false} className="p-1 md:hidden lg:inline-flex" />
          <MotionToggle showLabel={false} className="p-1 md:hidden lg:inline-flex" />
          <a
            href={`mailto:${portfolio.email}`}
            className="inline-flex items-center gap-1 font-medium transition-colors duration-200 hover:text-signal-ink"
          >
            Email
            <ArrowUpRight className="size-4" strokeWidth={1.75} />
          </a>
        </div>
      </div>
    </header>
  );
}

function GlanceSection() {
  return (
    <section
      aria-label="At a glance"
      className={cn(frame, "pb-24 pt-4 md:pb-40 md:pt-5")}
    >
      <div className={cn(grid, "gap-y-10")}>
        <p className="col-span-4 text-sm font-medium md:col-span-3">
          <span className="tabular-nums text-signal-ink">00</span>
          <span className="ml-3">At a glance</span>
        </p>
        <nav
          aria-label="Index"
          className="col-span-4 text-sm md:col-span-3 md:col-start-10"
        >
          <p className="text-mute">Index</p>
          <ol className="mt-3 border-t border-ink">
            {sections.map((section) => (
              <li key={section.href}>
                <a
                  href={section.href}
                  className="flex items-center justify-between border-b border-hairline py-2 transition-colors duration-200 hover:text-signal-ink"
                >
                  {section.label}
                  <span className="tabular-nums">{section.index}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* The three numbers arrive as a steep staircase, counting as they
          come, and settle onto one line. */}
      <dl className={cn(grid, "mt-20 gap-y-10 md:mt-32")}>
        {portfolio.stats.map((stat, index) => (
          <Parallax
            key={stat.label}
            from={index * 180}
            to={0}
            offset={["start end", "start 40%"]}
            className="col-span-4 border-t border-ink pt-3 max-md:transform-none!"
          >
            <dt className="flex justify-between gap-4 text-sm">
              <span>{stat.label}</span>
              <span className="tabular-nums text-mute">{pad(index + 1)}</span>
            </dt>
            <dd className="mt-8 text-display font-semibold leading-[0.85] tracking-[-0.055em] md:mt-16">
              <StatFigure value={stat.value} />
            </dd>
          </Parallax>
        ))}
      </dl>
    </section>
  );
}

// Coming up: the project names run past between the story and the work.
function ProjectTicker() {
  return (
    <div aria-hidden="true" className="border-y border-ink py-4 md:py-6">
      <Ticker
        items={portfolio.projects.map((project) => project.title)}
        speed={90}
        className="text-title font-semibold leading-none tracking-[-0.05em]"
      />
    </div>
  );
}

function SectionHead({
  index,
  label,
  title,
}: {
  index: string;
  label: string;
  title: string;
}) {
  return (
    <div className="relative">
      <GridLines />
      {/* A giant chapter numeral slams into place, then drifts down behind
          the heading. */}
      <Parallax
        from={-140}
        to={260}
        className="pointer-events-none absolute right-0 top-0 select-none"
      >
        <ChapterNumeral className="text-giant font-semibold leading-[0.75] tracking-[-0.07em] text-hairline/60">
          {index}
        </ChapterNumeral>
      </Parallax>
      <Rule />
      <div className={cn(grid, "relative gap-y-10 pt-4 md:pt-5")}>
        <p className="col-span-4 text-sm font-medium md:col-span-3">
          <span className="tabular-nums text-signal-ink">{index}</span>
          <span className="ml-3">{label}</span>
        </p>
        <Parallax
          axis="x"
          from={320}
          to={0}
          offset={["start end", "start 35%"]}
          className="col-span-4 md:col-span-9"
        >
          <MaskText text={title} className={sectionTitle} />
        </Parallax>
      </div>
    </div>
  );
}

function AboutSection() {
  const years = timeline.map((event) => event.year);

  return (
    <section
      id="about"
      tabIndex={-1}
      className={cn(frame, "pb-24 outline-none md:pb-40")}
    >
      <SectionHead
        index="01"
        label={sections[0].label}
        title="Built through shipping."
      />

      <ScrollStatement label="In brief" text={portfolio.summary} />

      <Reveal className="flex items-baseline justify-between gap-6 pb-3">
        <h3 className="text-lead font-semibold tracking-[-0.03em]">
          The story so far
        </h3>
        <span className="text-sm tabular-nums text-mute">
          {years[0]} to {years[years.length - 1]}
        </span>
      </Reveal>
      <Rule />
      <div className="lg:mt-12">
        <Timeline events={timeline} />
      </div>
    </section>
  );
}

function ProjectsSection() {
  return (
    <section id="projects" className="pb-24 md:pb-40">
      <div className={cn(frame, "pb-16 md:pb-24")}>
        <SectionHead
          index="02"
          label={sections[1].label}
          title="Built across systems and markets."
        />
      </div>
      <HorizontalGallery projects={portfolio.projects} />
    </section>
  );
}

function SkillsSection() {
  return (
    <InvertSection id="skills" className="relative isolate pb-24 md:pb-40">
      <SpotlightGrid />
      <div className={frame}>
        <SectionHead
          index="03"
          label={sections[2].label}
          title="Technical range, grounded in practice."
        />
      </div>
      <div className="mt-16 md:mt-24">
        <SkillRows groups={portfolio.skillGroups} />
      </div>
    </InvertSection>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="bg-signal text-on-signal">
      <div className={cn(frame, "pb-10 pt-4 md:pb-14 md:pt-5")}>
        <p className="text-sm font-medium">
          <span className="tabular-nums">{sections[3].index}</span>
          <span className="ml-3">{sections[3].label}</span>
        </p>

        <FlyInLines
          lines={["Open to", "internships", "and ambitious", "technical work."]}
          className="mt-16 text-poster font-semibold leading-[0.88] tracking-[-0.055em] md:mt-28"
        />

        <div className={cn(grid, "mt-20 gap-y-12 md:mt-32")}>
          <div className="col-span-4 md:col-span-12">
            <p className="text-sm">Write to</p>
            <Magnetic className="mt-3" strength={0.22}>
              <a
                href={`mailto:${portfolio.email}`}
                className="inline-block text-lead font-semibold leading-none tracking-[-0.04em] underline decoration-on-signal/40 decoration-[0.05em] underline-offset-[0.16em] transition-colors duration-200 [overflow-wrap:anywhere] hover:decoration-on-signal focus-visible:outline-on-signal md:text-title md:leading-none"
              >
                {portfolio.email}
              </a>
            </Magnetic>
          </div>
          <ul className="col-span-4 border-b border-on-signal/60 text-base font-medium md:col-span-3 md:col-start-10">
            {portfolio.socials.map((social) => {
              const isMail = social.href.startsWith("mailto:");

              return (
                <li key={social.label} className="border-t border-on-signal/60">
                  <Magnetic className="w-full" strength={0.12}>
                    <a
                      href={social.href}
                      target={isMail ? undefined : "_blank"}
                      rel={isMail ? undefined : "noopener noreferrer"}
                      className="group flex items-center justify-between py-3 focus-visible:outline-on-signal"
                    >
                      {social.label}
                      <ArrowUpRight
                        className="size-5 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        strokeWidth={1.75}
                      />
                    </a>
                  </Magnetic>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

// The top bar of the end credits; the reveal adds Cork time and the giant
// name below it.
function FooterBar() {
  return (
    <div className={cn(frame, grid, "gap-y-3 py-6 text-sm")}>
      <p className="col-span-4 md:col-span-3">© 2026 {portfolio.name}</p>
      <p className="col-span-4 text-paper/60 md:col-span-3">
        Set in Geist on a 12-column grid.
      </p>
      <div className="col-span-4 mt-3 flex flex-wrap items-center gap-x-6 gap-y-3 md:col-span-6 md:mt-0 md:justify-end">
        <GridToggle className="focus-visible:outline-paper" />
        <ThemeToggle className="focus-visible:outline-paper" />
        <MotionToggle className="focus-visible:outline-paper" />
        <ReplayIntro className="focus-visible:outline-paper" />
        <RewindLink className="focus-visible:outline-paper" />
      </div>
    </div>
  );
}

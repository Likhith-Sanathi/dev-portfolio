import { ArrowUp, ArrowUpRight } from "lucide-react";

import { ExpandingSection } from "@/components/expanding-section";
import { GridToggle } from "@/components/grid-toggle";
import { HeroName } from "@/components/hero-name";
import { LenisProvider } from "@/components/lenis-provider";
import { LocalTime } from "@/components/local-time";
import { MaskText } from "@/components/mask-text";
import { MotionProvider } from "@/components/motion-provider";
import { Parallax } from "@/components/parallax";
import { Reveal, Rule } from "@/components/reveal";
import { ScrollProgress } from "@/components/scroll-progress";
import { ScrollStatement } from "@/components/scroll-statement";
import { SectionNav } from "@/components/section-nav";
import { SkillRows } from "@/components/skill-rows";
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
  "text-[clamp(2.75rem,6.6vw,7.25rem)] font-semibold leading-[0.92] tracking-[-0.05em]";

export default function Home() {
  return (
    <MotionProvider>
      <LenisProvider>
        <ScrollProgress />
        <SiteHeader />
        <main id="top">
          <HeroSection />
          <AboutSection />
          <ProjectsSection />
          <SkillsSection />
          <ContactSection />
        </main>
        <SiteFooter />
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
        <a
          href={`mailto:${portfolio.email}`}
          className="col-span-1 inline-flex items-center gap-1 justify-self-end font-medium transition-colors duration-200 hover:text-signal"
        >
          Email
          <ArrowUpRight className="size-4" strokeWidth={1.75} />
        </a>
      </div>
    </header>
  );
}

function HeroSection() {
  const [education] = portfolio.education;

  return (
    <section
      className={cn(
        frame,
        "@container overflow-x-clip pb-20 pt-6 md:pb-32 md:pt-8",
      )}
    >
      <Reveal className={cn(grid, "gap-y-6 text-sm leading-snug")}>
        <HeroMeta label="Discipline">{portfolio.role}</HeroMeta>
        <HeroMeta label="Studying">{education.institution}</HeroMeta>
        <HeroMeta label="Based in">
          {portfolio.location}
          <br />
          <LocalTime className="tabular-nums" /> local time
        </HeroMeta>
        <HeroMeta label="Status">
          <span className="flex gap-2">
            <span
              aria-hidden="true"
              className="mt-[0.4em] size-2 shrink-0 bg-signal"
            />
            {portfolio.availability}
          </span>
        </HeroMeta>
      </Reveal>

      <HeroName
        first={firstName}
        last={lastName}
        className="-ml-[0.06em] mt-12 text-[length:min(100cqw/3.4,(100svh_-_15rem)/1.62)] font-semibold leading-[0.8] tracking-[-0.065em] md:mt-14"
      />

      <Rule className="mt-10 md:mt-14" delay={0.3} />

      <div className={cn(grid, "gap-y-12 pt-6 md:pt-8")}>
        <Reveal
          className="col-span-4 md:col-span-9 md:col-start-4 lg:col-span-7 lg:col-start-4"
          delay={0.35}
        >
          <p className="text-pretty text-[clamp(1.5rem,2.7vw,2.75rem)] font-medium leading-[1.1] tracking-[-0.03em]">
            {portfolio.hero}
          </p>
        </Reveal>
        <nav
          aria-label="Index"
          className="col-span-4 text-sm md:col-span-3 md:row-start-1"
        >
          <p className="text-mute">Index</p>
          <ol className="mt-3 border-t border-ink">
            {sections.map((section) => (
              <li key={section.href}>
                <a
                  href={section.href}
                  className="flex items-center justify-between border-b border-hairline py-2 transition-colors duration-200 hover:text-signal"
                >
                  {section.label}
                  <span className="tabular-nums">{section.index}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* The three numbers arrive as a staircase and settle onto one line. */}
      <dl className={cn(grid, "mt-20 gap-y-10 md:mt-32")}>
        {portfolio.stats.map((stat, index) => (
          <Parallax
            key={stat.label}
            from={index * 110}
            to={0}
            offset={["start end", "start 45%"]}
            className="col-span-4 border-t border-ink pt-3 max-md:transform-none!"
          >
            <dt className="flex justify-between gap-4 text-sm">
              <span>{stat.label}</span>
              <span className="tabular-nums text-mute">{pad(index + 1)}</span>
            </dt>
            <dd className="mt-8 text-[clamp(3.25rem,6.4vw,6.5rem)] font-semibold leading-[0.85] tracking-[-0.055em] md:mt-14">
              {stat.value}
            </dd>
          </Parallax>
        ))}
      </dl>
    </section>
  );
}

function HeroMeta({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="col-span-2 md:col-span-3">
      <p className="text-mute">{label}</p>
      <div className="mt-1 max-w-[22rem] font-medium">{children}</div>
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
    <>
      <Rule />
      <div className={cn(grid, "gap-y-10 pt-4 md:pt-5")}>
        <p className="col-span-4 text-sm font-medium md:col-span-3">
          <span className="tabular-nums text-signal">{index}</span>
          <span className="ml-3">{label}</span>
        </p>
        <Parallax from={56} to={-56} className="col-span-4 md:col-span-9">
          <MaskText text={title} className={sectionTitle} />
        </Parallax>
      </div>
    </>
  );
}

function AboutSection() {
  const years = timeline.map((event) => event.year);

  return (
    <section id="about" className={cn(frame, "pb-24 md:pb-40")}>
      <SectionHead
        index="01"
        label={sections[0].label}
        title="Built through shipping."
      />

      <ScrollStatement label="In brief" text={portfolio.summary} />

      <Reveal className="flex items-baseline justify-between gap-6 pb-3">
        <h3 className="text-2xl font-semibold tracking-[-0.03em] md:text-3xl">
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
    <section id="projects" className={cn(frame, "pb-24 md:pb-40")}>
      <SectionHead
        index="02"
        label={sections[1].label}
        title="Built across systems and markets."
      />

      <div className="mt-16 flex items-baseline justify-between pb-3 text-sm md:mt-24">
        <span>Selected projects</span>
        <span className="tabular-nums text-mute">
          ({pad(portfolio.projects.length)})
        </span>
      </div>
      {/* On tall enough desktops the cards pin and stack like an index file,
          each leaving its tab strip showing above the next. */}
      <ol className="border-b border-ink">
        {portfolio.projects.map((project, index) => (
          <li
            key={project.title}
            id={`project-${pad(index + 1)}`}
            className="bg-paper [@media(min-width:64rem)_and_(min-height:44rem)]:sticky"
            style={{ top: `calc(3.5rem + ${index} * 3rem)` }}
          >
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title}, view on GitHub`}
              className="group relative block border-t border-ink focus-visible:outline-offset-[-2px]"
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 -top-px h-[3px] origin-left scale-x-0 bg-signal transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
              />
              <div className="flex h-12 items-center gap-4 text-sm">
                <span className="w-8 shrink-0 font-medium tabular-nums transition-colors duration-200 group-hover:text-signal">
                  {pad(index + 1)}
                </span>
                <span className="min-w-0 flex-1 truncate text-mute">
                  {project.type}
                </span>
                <span className="shrink-0 tabular-nums text-mute">
                  <span className="md:hidden">{project.year}</span>
                  <span className="hidden md:inline">{project.period}</span>
                </span>
              </div>
              <div className={cn(grid, "gap-y-5 pb-8 pt-2 md:pb-12")}>
                <h3 className="col-span-4 text-balance text-[clamp(2rem,3.6vw,3.5rem)] font-semibold leading-[0.95] tracking-[-0.045em] md:col-span-6">
                  {project.title}
                </h3>
                <div className="col-span-4 md:col-span-4">
                  <p className="text-base leading-relaxed">
                    {project.description}
                  </p>
                  <p className="mt-5 flex gap-3 text-base font-medium leading-snug">
                    <span
                      aria-hidden="true"
                      className="mt-[0.45em] size-2 shrink-0 bg-signal"
                    />
                    {project.impact}
                  </p>
                  <p className="mt-5 text-sm text-mute">
                    {project.tags.join(" / ")}
                  </p>
                </div>
                <div className="col-span-4 flex items-end md:col-span-2 md:justify-end">
                  <span className="inline-flex items-center gap-1 text-sm font-medium transition-colors duration-200 group-hover:text-signal">
                    GitHub
                    <ArrowUpRight
                      className="size-5 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      strokeWidth={1.75}
                    />
                  </span>
                </div>
              </div>
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}

function SkillsSection() {
  return (
    <section id="skills" className="pb-24 md:pb-40">
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
    </section>
  );
}

function ContactSection() {
  return (
    <ExpandingSection id="contact" className="bg-signal text-white">
      <div className={cn(frame, "pb-10 pt-4 md:pb-14 md:pt-5")}>
        <p className="text-sm font-medium">
          <span className="tabular-nums">{sections[3].index}</span>
          <span className="ml-3">{sections[3].label}</span>
        </p>

        <h2 className="mt-16 max-w-[13ch] text-[clamp(3rem,8.6vw,9.5rem)] font-semibold leading-[0.9] tracking-[-0.055em] md:mt-28">
          Open to internships and ambitious technical work.
        </h2>

        <div className={cn(grid, "mt-20 items-end gap-y-12 md:mt-32")}>
          <div className="col-span-4 md:col-span-8">
            <p className="text-sm">Write to</p>
            <a
              href={`mailto:${portfolio.email}`}
              className="mt-3 inline-block text-[clamp(1.5rem,4.4vw,4.5rem)] font-semibold leading-none tracking-[-0.04em] underline decoration-white/40 decoration-[0.05em] underline-offset-[0.16em] transition-colors duration-200 [overflow-wrap:anywhere] hover:decoration-white focus-visible:outline-white"
            >
              {portfolio.email}
            </a>
          </div>
          <ul className="col-span-4 border-b border-white/60 text-base font-medium md:col-span-3 md:col-start-10">
            {portfolio.socials.map((social) => {
              const isMail = social.href.startsWith("mailto:");

              return (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target={isMail ? undefined : "_blank"}
                    rel={isMail ? undefined : "noopener noreferrer"}
                    className="group flex items-center justify-between border-t border-white/60 py-3 focus-visible:outline-white"
                  >
                    {social.label}
                    <ArrowUpRight
                      className="size-5 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      strokeWidth={1.75}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </ExpandingSection>
  );
}

function SiteFooter() {
  return (
    <footer className="bg-ink text-paper">
      <div className={cn(frame, grid, "gap-y-3 py-6 text-sm")}>
        <p className="col-span-4 md:col-span-3">
          © 2026 {portfolio.name}
        </p>
        <p className="col-span-4 text-paper/60 md:col-span-3">
          {portfolio.location}, <LocalTime className="tabular-nums" />
        </p>
        <p className="col-span-4 text-paper/60 md:col-span-3">
          Set in Geist on a 12-column grid.
        </p>
        <div className="col-span-4 mt-3 flex items-center justify-between gap-6 md:col-span-3 md:mt-0 md:justify-end">
          <GridToggle className="focus-visible:outline-paper" />
          <a
            href="#top"
            className="inline-flex items-center gap-1 transition-colors duration-200 hover:text-signal focus-visible:outline-paper"
          >
            Top
            <ArrowUp className="size-4" strokeWidth={1.75} />
          </a>
        </div>
      </div>
    </footer>
  );
}

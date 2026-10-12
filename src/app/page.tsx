import { ArrowUp, ArrowUpRight } from "lucide-react";

import { GridToggle } from "@/components/grid-toggle";
import { LenisProvider } from "@/components/lenis-provider";
import { LocalTime } from "@/components/local-time";
import { MaskText } from "@/components/mask-text";
import { MotionProvider } from "@/components/motion-provider";
import { Reveal, Rule } from "@/components/reveal";
import { ScrollProgress } from "@/components/scroll-progress";
import { frame, grid } from "@/lib/grid";
import { portfolio } from "@/lib/portfolio-content";
import { cn } from "@/lib/utils";

const [firstName, lastName] = portfolio.name.split(" ");

const sections = portfolio.nav.map((item, index) => ({
  ...item,
  index: String(index + 1).padStart(2, "0"),
}));

const sectionTitle =
  "text-[clamp(2.75rem,6.6vw,7.25rem)] font-semibold leading-[0.92] tracking-[-0.05em]";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

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
        <nav
          aria-label="Sections"
          className="hidden md:col-span-8 md:grid md:grid-cols-subgrid"
        >
          {sections.map((section) => (
            <a
              key={section.href}
              href={section.href}
              className="group col-span-2 flex gap-2 transition-colors duration-200 hover:text-signal"
            >
              <span className="hidden tabular-nums text-mute transition-colors duration-200 group-hover:text-signal lg:inline">
                {section.index}
              </span>
              {section.label}
            </a>
          ))}
        </nav>
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
    <section className={cn(frame, "@container pb-20 pt-6 md:pb-32 md:pt-8")}>
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

      <MaskText
        as="h1"
        lines={[
          firstName,
          <span key="last-name">
            {lastName}
            <span className="text-signal">.</span>
          </span>,
        ]}
        className="-ml-[0.06em] mt-12 text-[length:min(100cqw/3.4,(100svh_-_15rem)/1.62)] font-semibold leading-[0.8] tracking-[-0.065em] md:mt-14"
        delay={0.1}
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

      <dl className={cn(grid, "mt-20 gap-y-10 md:mt-32")}>
        {portfolio.stats.map((stat, index) => (
          <Reveal
            key={stat.label}
            delay={index * 0.08}
            className="col-span-4 border-t border-ink pt-3"
          >
            <dt className="flex justify-between gap-4 text-sm">
              <span>{stat.label}</span>
              <span className="tabular-nums text-mute">{pad(index + 1)}</span>
            </dt>
            <dd className="mt-8 text-[clamp(3.25rem,6.4vw,6.5rem)] font-semibold leading-[0.85] tracking-[-0.055em] md:mt-14">
              {stat.value}
            </dd>
          </Reveal>
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
        <MaskText
          text={title}
          className={cn(sectionTitle, "col-span-4 md:col-span-9")}
        />
      </div>
    </>
  );
}

function SubBlock({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-20 md:mt-32">
      <Reveal className="flex items-baseline justify-between gap-6 pb-3">
        <h3 className="text-2xl font-semibold tracking-[-0.03em] md:text-3xl">
          {title}
        </h3>
        <span className="text-sm tabular-nums text-mute">({pad(count)})</span>
      </Reveal>
      <Rule />
      <div className="divide-y divide-hairline">{children}</div>
    </div>
  );
}

function Entry({
  meta,
  title,
  subtitle,
  children,
}: {
  meta: readonly string[];
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal className={cn(grid, "gap-y-4 py-6 md:py-8")}>
      <div className="col-span-4 text-sm md:col-span-3">
        {meta.map((line, index) => (
          <p
            key={line}
            className={cn("tabular-nums", index > 0 && "text-mute")}
          >
            {line}
          </p>
        ))}
      </div>
      <div className="col-span-4 md:col-span-9 lg:col-span-4">
        <h4 className="text-balance text-2xl font-semibold leading-[1.05] tracking-[-0.03em] md:text-[1.75rem]">
          {title}
        </h4>
        {subtitle ? (
          <p className="mt-2 text-base text-mute">{subtitle}</p>
        ) : null}
      </div>
      <div className="col-span-4 text-base leading-relaxed md:col-span-9 md:col-start-4 lg:col-span-5 lg:col-start-8">
        {children}
      </div>
    </Reveal>
  );
}

function AboutSection() {
  return (
    <section id="about" className={cn(frame, "pb-24 md:pb-40")}>
      <SectionHead
        index="01"
        label={sections[0].label}
        title="Built through shipping."
      />

      <div className={cn(grid, "mt-10 md:mt-16")}>
        <Reveal className="col-span-4 md:col-span-8 md:col-start-4 lg:col-span-6 lg:col-start-4">
          <p className="text-pretty text-xl font-medium leading-snug tracking-[-0.02em] md:text-2xl">
            {portfolio.summary}
          </p>
        </Reveal>
      </div>

      <SubBlock title="Experience" count={portfolio.experience.length}>
        {portfolio.experience.map((item) => (
          <Entry
            key={item.period}
            meta={[item.period, item.location]}
            title={item.title}
            subtitle={item.company}
          >
            <p>{item.description}</p>
            <ol className="mt-6 space-y-4 text-mute">
              {item.highlights.map((highlight, index) => (
                <li key={highlight} className="flex gap-4">
                  <span className="w-5 shrink-0 tabular-nums text-ink">
                    {pad(index + 1)}
                  </span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ol>
          </Entry>
        ))}
      </SubBlock>

      <SubBlock title="Education" count={portfolio.education.length}>
        {portfolio.education.map((item) => (
          <Entry
            key={item.institution}
            meta={[item.period, item.location]}
            title={item.institution}
            subtitle={`${item.degree}. ${item.detail}.`}
          >
            <p className="text-sm text-mute">Relevant coursework</p>
            <ul className="mt-3 grid grid-cols-1 gap-x-6 border-t border-ink sm:grid-cols-2">
              {item.coursework.map((course) => (
                <li key={course} className="border-b border-hairline py-2">
                  {course}
                </li>
              ))}
            </ul>
          </Entry>
        ))}
      </SubBlock>

      <SubBlock title="Recognition" count={portfolio.achievements.length}>
        {portfolio.achievements.map((achievement) => (
          <Entry
            key={achievement.title}
            meta={[achievement.period]}
            title={achievement.title}
          >
            <p>{achievement.detail}</p>
          </Entry>
        ))}
      </SubBlock>
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
      <ol className="border-b border-ink">
        {portfolio.projects.map((project, index) => (
          <li key={project.title}>
            <Reveal>
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title}, view on GitHub`}
                className="group relative block border-t border-ink py-6 focus-visible:outline-offset-[-2px] md:py-10"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 -top-px h-[3px] origin-left scale-x-0 bg-signal transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
                />
                <div className={cn(grid, "gap-y-5")}>
                  <span className="col-span-2 text-sm font-medium tabular-nums transition-colors duration-200 group-hover:text-signal md:col-span-1">
                    {pad(index + 1)}
                  </span>
                  <span className="col-span-2 flex items-center justify-end gap-3 text-sm md:hidden">
                    <span className="tabular-nums text-mute">
                      {project.year}
                    </span>
                    <ArrowUpRight
                      className="size-5 transition-colors duration-200 group-hover:text-signal"
                      strokeWidth={1.75}
                    />
                  </span>
                  <div className="col-span-4 md:col-span-5">
                    <h3 className="text-balance text-[clamp(2rem,3.6vw,3.5rem)] font-semibold leading-[0.95] tracking-[-0.045em]">
                      {project.title}
                    </h3>
                    <p className="mt-3 text-sm text-mute">{project.type}</p>
                  </div>
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
                  <div className="hidden flex-col items-end justify-between gap-6 text-sm md:col-span-2 md:flex">
                    <span className="text-right tabular-nums text-mute">
                      {project.period}
                    </span>
                    <span className="inline-flex items-center gap-1 font-medium transition-colors duration-200 group-hover:text-signal">
                      GitHub
                      <ArrowUpRight
                        className="size-5 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        strokeWidth={1.75}
                      />
                    </span>
                  </div>
                </div>
              </a>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}

function SkillsSection() {
  return (
    <section id="skills" className={cn(frame, "pb-24 md:pb-40")}>
      <SectionHead
        index="03"
        label={sections[2].label}
        title="Technical range, grounded in practice."
      />

      <div className={cn(grid, "mt-16 gap-y-14 md:mt-24")}>
        {portfolio.skillGroups.map((group, index) => (
          <Reveal
            key={group.title}
            delay={index * 0.06}
            className="col-span-2 md:col-span-6 lg:col-span-3"
          >
            <div className="flex items-baseline justify-between border-t border-ink pt-3 text-sm">
              <h3 className="font-medium">{group.title}</h3>
              <span className="tabular-nums text-mute">
                ({pad(group.items.length)})
              </span>
            </div>
            <ul className="mt-5">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="border-b border-hairline py-2 text-lg font-medium tracking-[-0.02em] md:text-xl"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="bg-signal text-white">
      <div className={cn(frame, "pb-10 pt-4 md:pb-14 md:pt-5")}>
        <p className="text-sm font-medium">
          <span className="tabular-nums">{sections[3].index}</span>
          <span className="ml-3">{sections[3].label}</span>
        </p>

        <MaskText
          text="Open to internships and ambitious technical work."
          className="mt-16 max-w-[13ch] text-[clamp(3rem,8.6vw,9.5rem)] font-semibold leading-[0.9] tracking-[-0.055em] md:mt-28"
        />

        <div className={cn(grid, "mt-20 items-end gap-y-12 md:mt-32")}>
          <Reveal className="col-span-4 md:col-span-8">
            <p className="text-sm">Write to</p>
            <a
              href={`mailto:${portfolio.email}`}
              className="mt-3 inline-block text-[clamp(1.5rem,4.4vw,4.5rem)] font-semibold leading-none tracking-[-0.04em] underline decoration-white/40 decoration-[0.05em] underline-offset-[0.16em] transition-colors duration-200 [overflow-wrap:anywhere] hover:decoration-white focus-visible:outline-white"
            >
              {portfolio.email}
            </a>
          </Reveal>
          <Reveal
            className="col-span-4 md:col-span-3 md:col-start-10"
            delay={0.08}
          >
            <ul className="border-b border-white/60 text-base font-medium">
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
          </Reveal>
        </div>
      </div>
    </section>
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

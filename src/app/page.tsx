import {
  ArrowUpRight,
  Mail,
  MapPin,
  Radio,
  Send,
  Sparkles,
  Terminal,
} from "lucide-react";

import { LenisProvider } from "@/components/lenis-provider";
import { Logos3 } from "@/components/blocks/logos3";
import { Hover3D } from "@/components/hover-3d";
import { KineticText } from "@/components/kinetic-text";
import { Reveal } from "@/components/reveal";
import { ScrollProgress } from "@/components/scroll-progress";
import { BackgroundPaperShaders } from "@/components/ui/background-paper-shaders";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LayeredPanel } from "@/components/ui/layered-panel";
import { Separator } from "@/components/ui/separator";
import { portfolio } from "@/lib/portfolio-content";

const socialIcons = {
  GitHub: Terminal,
  LinkedIn: ArrowUpRight,
  Email: Mail,
};

export default function Home() {
  return (
    <LenisProvider>
      <ScrollProgress />
      <main className="relative isolate min-h-screen overflow-hidden bg-background text-foreground selection:bg-white selection:text-black">
        <BackgroundPaperShaders className="z-0" />
        <div className="relative z-10">
          <SiteHeader />
          <HeroSection />
          <AboutSection />
          <ProjectsSection />
          <SkillsSection />
          <ContactSection />
        </div>
      </main>
    </LenisProvider>
  );
}

function SiteHeader() {
  return (
    <header className="fixed left-0 right-0 top-4 z-40 px-4">
      <nav className="mx-auto flex min-w-0 max-w-6xl items-center justify-between rounded-full border border-white/10 bg-black/70 px-3 py-2 shadow-[0_0_80px_rgba(255,255,255,0.13)] backdrop-blur-xl">
        <a
          href="#top"
          className="group min-w-0 truncate rounded-full px-3 py-2 text-sm font-semibold tracking-tight transition-colors duration-200 ease-out hover:text-white"
          aria-label={`${portfolio.name} home`}
        >
          <span>{portfolio.name}</span>
        </a>
        <div className="hidden items-center gap-1 md:flex">
          {portfolio.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors duration-200 ease-out hover:bg-white/[0.08] hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </div>
        <Button
          asChild
          className="h-10 shrink-0 rounded-full bg-white px-3 text-black shadow-[0_0_24px_rgba(255,255,255,0.32)] transition-transform duration-200 ease-out hover:scale-[1.01] hover:bg-white/90 sm:px-4"
        >
          <a href={`mailto:${portfolio.email}`}>
            Let&apos;s talk
            <ArrowUpRight />
          </a>
        </Button>
      </nav>
    </header>
  );
}

function HeroSection() {
  return (
    <section
      id="top"
      className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-4 pb-20 pt-32 md:px-6 lg:pt-40"
    >
      <div className="grid min-w-0 items-end gap-10 lg:grid-cols-[1.12fr_0.88fr]">
        <Reveal className="min-w-0 space-y-8" variant="blast">
          <div className="flex flex-wrap items-center gap-3">
            <Badge className="h-auto min-h-8 w-full max-w-full whitespace-normal rounded-full border-white/20 bg-white/10 px-4 py-1 text-center leading-5 text-white shadow-[0_0_36px_rgba(255,255,255,0.16)] sm:h-8 sm:w-fit sm:whitespace-nowrap sm:py-0">
              <Sparkles className="size-3.5" />
              {portfolio.availability}
            </Badge>
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-4" />
              {portfolio.location}
            </span>
          </div>
          <div className="space-y-6">
            <p className="font-code text-xs uppercase tracking-[0.28em] text-muted-foreground sm:text-sm sm:tracking-[0.42em]">
              {portfolio.role}
            </p>
            <KineticText
              as="h1"
              text={portfolio.headline}
              className="max-w-5xl text-balance text-5xl tracking-[-0.075em] sm:text-6xl md:text-8xl lg:text-[8.9rem]"
            />
            <p className="max-w-2xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl md:text-2xl md:leading-9">
              {portfolio.hero}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              className="h-12 w-full rounded-full bg-white px-6 text-base text-black shadow-[0_0_34px_rgba(255,255,255,0.26)] transition-transform duration-200 ease-out hover:scale-[1.01] hover:bg-white/90 sm:w-auto"
            >
              <a href="#projects">
                View projects
                <ArrowUpRight />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 w-full rounded-full border-white/15 bg-white/[0.03] px-6 text-base transition-colors duration-200 ease-out hover:bg-white/[0.08] sm:w-auto"
            >
              <a href={`mailto:${portfolio.email}`}>
                <Mail />
                Contact me
              </a>
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.12} className="relative min-w-0" variant="tilt">
          <Hover3D>
            <div className="hover-3d-surface oled-panel relative overflow-hidden rounded-[2.4rem] p-4 text-foreground sm:p-5">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.24),transparent_34%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.1),transparent_30%)]" />
              <div className="scanlines absolute inset-0 opacity-30" />
              <div className="relative rounded-[1.8rem] border border-white/10 bg-black/45 p-4 sm:p-5">
                <div className="mb-6 md:mb-10">
                  <span className="font-code text-xs uppercase tracking-[0.3em] text-white/72">
                    Portfolio OS
                  </span>
                </div>
                <div className="space-y-5">
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {portfolio.stats.map((stat) => (
                      <div
                        key={stat.label}
                        className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.05] p-3 sm:p-4"
                      >
                        <p className="font-code text-xl font-semibold sm:text-2xl">
                          {stat.value}
                        </p>
                        <p className="mt-2 text-xs leading-4 text-white/68">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>
                  <Separator className="bg-white/10" />
                  <p className="text-pretty text-xl font-medium leading-8 sm:text-2xl">
                    {portfolio.summary}
                  </p>
                </div>
              </div>
            </div>
          </Hover3D>
        </Reveal>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-4 py-24 md:px-6">
      <div className="relative">
        <Hover3D>
          <div className="hover-3d-surface oled-panel relative overflow-hidden rounded-[2.5rem] px-4 py-6 text-foreground sm:px-6 md:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.14),transparent_34%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.06),transparent_30%)]" />
          <div className="scanlines absolute inset-0 opacity-20" />
          <div className="relative grid gap-10 lg:grid-cols-2 lg:items-stretch lg:gap-4">
            <div className="flex h-full flex-col gap-6">
              <div>
                <p className="font-code text-sm uppercase tracking-[0.36em] text-white/65">
                  About me
                </p>
                <KineticText
                  text="Built through shipping."
                  className="mt-5 text-5xl tracking-[-0.06em] md:text-7xl"
                />
              </div>
              <div className="flex flex-1 flex-col rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <p className="font-code text-xs uppercase tracking-[0.28em] text-white/70">
                  Education
                </p>
                <div className="mt-4 space-y-4">
                  {portfolio.education.map((item) => (
                    <div key={item.institution}>
                      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                        <div>
                          <h3 className="text-2xl font-medium tracking-[-0.03em]">
                            {item.institution}
                          </h3>
                          <p className="mt-1 text-lg text-white/82">
                            {item.degree}
                          </p>
                          <p className="mt-2 text-sm text-white/68">
                            {item.detail}
                          </p>
                        </div>
                        <div className="text-left md:text-right">
                          <p className="font-code text-xs uppercase tracking-[0.22em] text-white/75">
                            {item.period}
                          </p>
                          <p className="mt-2 text-sm text-white/68">
                            {item.location}
                          </p>
                        </div>
                      </div>
                      <div className="mt-5 space-y-4">
                        <div>
                          <p className="font-code text-[11px] uppercase tracking-[0.24em] text-white/60">
                            Relevant coursework
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {item.coursework.map((course) => (
                              <Badge
                                key={course}
                                variant="secondary"
                                className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-white/72"
                              >
                                {course}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex h-full flex-col gap-4">
              <p className="font-code text-sm uppercase tracking-[0.36em] text-white/65">
                Experience
              </p>
              {portfolio.experience.map((item, index) => (
                <Reveal
                  key={item.period}
                  delay={index * 0.06}
                  variant="rise"
                  className="flex-1"
                >
                  <div className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.045] p-5">
                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="text-2xl font-semibold tracking-[-0.03em]">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-base text-white/82">
                          {item.company}
                        </p>
                      </div>
                      <div className="text-left md:text-right">
                        <p className="font-code text-xs uppercase tracking-[0.22em] text-white/80">
                          {item.period}
                        </p>
                        <p className="mt-2 text-sm text-white/68">
                          {item.location}
                        </p>
                      </div>
                    </div>
                    <p className="mt-5 leading-7 text-white/74">
                      {item.description}
                    </p>
                    <ul className="mt-5 space-y-3 text-sm leading-7 text-white/68">
                      {item.highlights.map((highlight) => (
                        <li key={highlight} className="flex gap-3">
                          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-white/70" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <div className="mt-10">
            <p className="font-code text-sm uppercase tracking-[0.36em] text-white/65">
              Achievements
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-2 md:items-stretch">
              {portfolio.achievements.map((achievement, index) => (
                <Reveal
                  key={achievement.title}
                  delay={index * 0.05}
                  variant="rise"
                  className="h-full"
                >
                  <div className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.035] p-5">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-lg font-medium leading-7 tracking-[-0.02em]">
                        {achievement.title}
                      </h3>
                      <span className="font-code text-xs uppercase tracking-[0.2em] text-white/72">
                        {achievement.period}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-white/68">
                      {achievement.detail}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          </div>
        </Hover3D>
      </div>
    </section>
  );
}

function ProjectsSection() {
  return (
    <section id="projects" className="mx-auto max-w-6xl px-4 py-24 md:px-6">
      <Reveal
        className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end"
        variant="skew"
      >
        <div>
          <p className="font-code text-sm uppercase tracking-[0.36em] text-muted-foreground">
            Projects
          </p>
          <KineticText
            text="Built across systems and markets."
            className="mt-5 max-w-3xl text-5xl tracking-[-0.06em] md:text-7xl"
          />
        </div>
      </Reveal>

      <div className="grid gap-5">
        {portfolio.projects.map((project, index) => (
          <Reveal
            key={project.title}
            delay={index * 0.08}
            variant={index === 1 ? "blast" : "tilt"}
          >
            <Hover3D>
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${project.title} on GitHub`}
                className="group block rounded-[1.75rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                <Card className="hover-3d-surface oled-panel cursor-pointer overflow-hidden border-white/10 bg-card/90 py-0 shadow-[0_24px_100px_rgba(0,0,0,0.62)] transition duration-300 ease-out hover:border-white/20">
                  <CardContent className="grid gap-0 p-0 lg:grid-cols-[0.8fr_1.2fr]">
                    <div className="relative min-h-72 overflow-hidden bg-black p-6 text-foreground md:p-8">
                      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.2),transparent_45%),radial-gradient(circle_at_75%_20%,rgba(255,255,255,0.16),transparent_35%)]" />
                      <div className="grain absolute inset-0 opacity-40" />
                      <div className="relative flex h-full flex-col justify-between">
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-code text-xs uppercase tracking-[0.28em] text-white/72">
                            0{index + 1}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="rounded-full border border-white/15 px-3 py-1 font-code text-xs text-white/80">
                              {project.period}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full border border-white/15 px-3 py-1 font-code text-xs text-white/72 transition-colors duration-200 ease-out group-hover:text-white">
                              GitHub
                              <ArrowUpRight className="size-3" />
                            </span>
                          </div>
                        </div>
                        <div>
                          <Radio className="mb-5 size-8 text-white drop-shadow-[0_0_18px_rgba(255,255,255,0.36)]" />
                          <p className="font-code text-xs uppercase tracking-[0.28em] text-white/68">
                            {project.type}
                          </p>
                          <h3 className="mt-3 text-4xl font-medium tracking-[-0.05em]">
                            {project.title}
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-between p-6 md:p-8">
                      <p className="max-w-2xl text-xl leading-8 text-foreground">
                        {project.description}
                      </p>
                      <div className="mt-10 space-y-6">
                        <p className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 text-sm font-semibold text-white/84">
                          {project.impact}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {project.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="rounded-full bg-white/[0.06] px-3 text-muted-foreground transition-colors duration-200 ease-out hover:bg-white/[0.1] hover:text-white"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </a>
            </Hover3D>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function SkillsSection() {
  const skillRails = portfolio.skillGroups.map((group) => ({
    heading: group.title,
    skills: group.items,
  }));

  return (
    <section
      id="skills"
      className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24"
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(15rem,18rem)_minmax(0,1fr)] lg:items-start lg:gap-12">
        <Reveal className="max-w-md lg:pt-2" variant="skew">
          <p className="font-code text-sm uppercase tracking-[0.36em] text-muted-foreground">
            Skills
          </p>
          <KineticText
            text="Technical range, grounded in practice."
            className="mt-5 text-5xl tracking-[-0.06em] md:text-7xl"
          />
        </Reveal>
        <div className="grid min-w-0 gap-4 md:gap-5">
          {skillRails.map((row, index) => (
            <Reveal key={row.heading} delay={index * 0.08} variant="rise">
              <Logos3
                heading={row.heading}
                skills={row.skills}
                className="lg:max-w-2xl xl:max-w-3xl"
                direction={index % 2 === 1 ? "backward" : "forward"}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section
      id="contact"
      className="mx-auto max-w-6xl px-4 pb-12 pt-8 md:px-6 md:pt-20"
    >
      <Reveal variant="blast">
        <Hover3D>
          <LayeredPanel className="hover-3d-surface rounded-[2.5rem] p-6 text-foreground md:p-10">
            <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <p className="font-code text-sm uppercase tracking-[0.36em] text-white/82">
                  Contact me
                </p>
                <KineticText
                  text="Open to internships and ambitious technical work."
                  className="mt-5 max-w-4xl text-5xl tracking-[-0.06em] md:text-7xl"
                />
              </div>
              <div className="grid w-full grid-cols-3 gap-2 justify-self-center sm:w-auto sm:grid-cols-[repeat(3,max-content)] sm:gap-3 lg:justify-self-end">
                <Button
                  asChild
                  className="col-span-3 h-12 w-full justify-center rounded-full bg-white px-6 text-base text-black shadow-[0_0_34px_rgba(255,255,255,0.28)] transition-transform duration-200 ease-out hover:scale-[1.01] hover:bg-white/90"
                >
                  <a href={`mailto:${portfolio.email}`}>
                    <Send />
                    Start a conversation
                  </a>
                </Button>
                {portfolio.socials.map((social) => {
                  const Icon =
                    socialIcons[social.label as keyof typeof socialIcons] ??
                    ArrowUpRight;

                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target={social.href.startsWith("mailto:") ? undefined : "_blank"}
                      rel={
                        social.href.startsWith("mailto:")
                          ? undefined
                          : "noopener noreferrer"
                      }
                      className="inline-flex h-12 min-w-0 items-center justify-center gap-1 rounded-full border border-white/20 bg-black/30 px-2 py-2 text-xs transition-colors duration-200 ease-out hover:border-white/30 hover:bg-white/[0.12] sm:gap-2 sm:px-4 sm:text-sm"
                    >
                      <Icon className="size-4" />
                      {social.label}
                    </a>
                  );
                })}
              </div>
            </div>
          </LayeredPanel>
        </Hover3D>
      </Reveal>
      <footer className="flex flex-col gap-3 px-2 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <span>© 2026 {portfolio.name}. Built with Next.js and Motion.</span>
      </footer>
    </section>
  );
}

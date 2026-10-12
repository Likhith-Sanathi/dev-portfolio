import { portfolio } from "@/lib/portfolio-content";
import { pad } from "@/lib/utils";

export type TimelineKind = "Education" | "Experience" | "Project" | "Award";

export type TimelineEvent = {
  id: string;
  kind: TimelineKind;
  month: string;
  year: string;
  period: string;
  title: string;
  subtitle?: string;
  body?: string;
  points?: readonly string[];
  topics?: readonly string[];
  href?: string;
  linkLabel?: string;
};

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Same-month events read best as cause then effect: enrol, then win the scholarship.
const kindOrder: Record<TimelineKind, number> = {
  Education: 0,
  Experience: 1,
  Project: 2,
  Award: 3,
};

function startOf(period: string) {
  const [month, year] = period.split(" - ")[0].split(" ");
  return { month, year, order: Number(year) * 12 + months.indexOf(month) };
}

type Draft = Omit<TimelineEvent, "id" | "month" | "year">;

const drafts: Draft[] = [
  ...portfolio.education.map((item) => ({
    kind: "Education" as const,
    period: item.period,
    title: item.institution,
    subtitle: `${item.degree}. ${item.detail}.`,
    topics: item.coursework,
  })),
  ...portfolio.experience.map((item) => ({
    kind: "Experience" as const,
    period: item.period,
    title: item.title,
    subtitle: item.company,
    body: item.description,
    points: item.highlights,
  })),
  ...portfolio.projects.map((project, index) => ({
    kind: "Project" as const,
    period: project.period,
    title: project.title,
    subtitle: project.type,
    href: `#project-${pad(index + 1)}`,
    linkLabel: `Project ${pad(index + 1)}`,
  })),
  ...portfolio.achievements.map((achievement) => ({
    kind: "Award" as const,
    period: achievement.period,
    title: achievement.title,
    body: achievement.detail,
  })),
];

export const timeline: TimelineEvent[] = drafts
  .map((draft) => ({ draft, start: startOf(draft.period) }))
  .sort(
    (a, b) =>
      a.start.order - b.start.order ||
      kindOrder[a.draft.kind] - kindOrder[b.draft.kind],
  )
  .map(({ draft, start }, index) => ({
    ...draft,
    id: `event-${pad(index + 1)}`,
    month: start.month,
    year: start.year,
  }));

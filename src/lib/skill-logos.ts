import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faAws,
  faCss3Alt,
  faDocker,
  faGitAlt,
  faHtml5,
  faJava,
  faJs,
  faLinux,
  faOpenai,
  faPython,
  faRust,
  faTypescript,
} from "@fortawesome/free-brands-svg-icons";
import {
  faChartSimple,
  faCode,
  faDatabase,
  faTerminal,
} from "@fortawesome/free-solid-svg-icons";
import type { SimpleIcon } from "simple-icons";
import {
  siAssemblyscript,
  siC,
  siClaudecode,
  siCplusplus,
  siDjango,
  siExpress,
  siFlask,
  siGithubcopilot,
  siMui,
  siNextdotjs,
  siNvidia,
  siNumpy,
  siPandas,
  siPytorch,
  siShadcnui,
  siTailwindcss,
  siVercel,
} from "simple-icons";

type SkillIcon =
  | {
      kind: "font-awesome";
      icon: IconDefinition;
    }
  | {
      kind: "simple";
      icon: SimpleIcon;
    };

export interface SkillLogo {
  id: string;
  description: string;
  icon: SkillIcon;
  scale?: number;
  isClone?: boolean;
}

interface SkillDefinition {
  description: string;
  icon: SkillIcon;
  scale?: number;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const fontAwesome = (icon: IconDefinition): SkillIcon => ({
  kind: "font-awesome",
  icon,
});

const simple = (icon: SimpleIcon): SkillIcon => ({
  kind: "simple",
  icon,
});

const skillAliases: Record<string, string> = {
  "Next.JS": "Next.js",
  "Github Copilot": "GitHub Copilot",
  MaterialUI: "Material UI",
  ShadCN: "shadcn/ui",
};

const skillDefinitions: Record<string, SkillDefinition> = {
  HTML: { description: "HTML", icon: fontAwesome(faHtml5), scale: 1.28 },
  CSS: { description: "CSS", icon: fontAwesome(faCss3Alt), scale: 1.28 },
  Python: { description: "Python", icon: fontAwesome(faPython), scale: 1.12 },
  Java: { description: "Java", icon: fontAwesome(faJava), scale: 1.52 },
  JavaScript: {
    description: "JavaScript",
    icon: fontAwesome(faJs),
    scale: 1.08,
  },
  TypeScript: {
    description: "TypeScript",
    icon: fontAwesome(faTypescript),
    scale: 0.98,
  },
  C: { description: "C", icon: simple(siC), scale: 0.74 },
  "C++": { description: "C++", icon: simple(siCplusplus), scale: 0.82 },
  Rust: { description: "Rust", icon: fontAwesome(faRust), scale: 1.22 },
  SQL: { description: "SQL", icon: fontAwesome(faDatabase), scale: 1.02 },
  "MIPS Assembly": {
    description: "MIPS Assembly",
    icon: simple(siAssemblyscript),
    scale: 0.58,
  },
  "Next.js": { description: "Next.js", icon: simple(siNextdotjs), scale: 0.72 },
  Express: { description: "Express", icon: simple(siExpress), scale: 1.24 },
  Django: { description: "Django", icon: simple(siDjango), scale: 0.82 },
  Flask: { description: "Flask", icon: simple(siFlask), scale: 1.02 },
  CUDA: { description: "CUDA", icon: simple(siNvidia), scale: 1.02 },
  PyTorch: { description: "PyTorch", icon: simple(siPytorch), scale: 1.02 },
  Git: { description: "Git", icon: fontAwesome(faGitAlt), scale: 1.18 },
  Docker: { description: "Docker", icon: fontAwesome(faDocker), scale: 1.08 },
  Linux: { description: "Linux", icon: fontAwesome(faLinux), scale: 1.34 },
  Bash: { description: "Bash", icon: fontAwesome(faTerminal), scale: 0.98 },
  AWS: { description: "AWS", icon: fontAwesome(faAws), scale: 1.38 },
  Vercel: { description: "Vercel", icon: simple(siVercel), scale: 0.68 },
  "VS Code": { description: "VS Code", icon: fontAwesome(faCode), scale: 1.18 },
  "Claude Code": {
    description: "Claude Code",
    icon: simple(siClaudecode),
    scale: 0.92,
  },
  "OpenAI Codex": {
    description: "OpenAI Codex",
    icon: fontAwesome(faOpenai),
    scale: 1.22,
  },
  "GitHub Copilot": {
    description: "GitHub Copilot",
    icon: simple(siGithubcopilot),
    scale: 0.78,
  },
  Pandas: { description: "Pandas", icon: simple(siPandas), scale: 0.96 },
  NumPy: { description: "NumPy", icon: simple(siNumpy), scale: 0.9 },
  Matplotlib: {
    description: "Matplotlib",
    icon: fontAwesome(faChartSimple),
    scale: 1.1,
  },
  "Tailwind CSS": {
    description: "Tailwind CSS",
    icon: simple(siTailwindcss),
    scale: 0.94,
  },
  "Material UI": { description: "Material UI", icon: simple(siMui), scale: 0.8 },
  "shadcn/ui": { description: "shadcn/ui", icon: simple(siShadcnui), scale: 0.74 },
};

function normalizeSkillLabel(label: string) {
  return skillAliases[label] ?? label;
}

export function skillLabelsToLogos(labels: readonly string[]): SkillLogo[] {
  const seenIds = new Map<string, number>();

  return labels.flatMap((label) => {
    const normalizedLabel = normalizeSkillLabel(label);
    const skill = skillDefinitions[normalizedLabel];

    if (!skill) {
      return [];
    }

    const baseId = slugify(normalizedLabel) || "skill";
    const occurrence = seenIds.get(baseId) ?? 0;
    seenIds.set(baseId, occurrence + 1);

    return {
      id: occurrence === 0 ? baseId : `${baseId}-${occurrence + 1}`,
      description: skill.description,
      icon: skill.icon,
      scale: skill.scale,
    };
  });
}

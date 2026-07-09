import type { SimpleIcon } from "simple-icons";
import {
  siC,
  siCplusplus,
  siChartdotjs,
  siDocker,
  siDjango,
  siExpress,
  siFastapi,
  siFlask,
  siGit,
  siGnubash,
  siJavascript,
  siLinux,
  siMui,
  siNextdotjs,
  siNodedotjs,
  siNvidia,
  siNumpy,
  siOpenjdk,
  siPandas,
  siPycharm,
  siPython,
  siPytorch,
  siRatatui,
  siReact,
  siReacthookform,
  siRust,
  siShadcnui,
  siSocketdotio,
  siTailwindcss,
  siThreedotjs,
  siTypescript,
  siVercel,
  siVscodium,
} from "simple-icons";

export interface SkillLogo {
  id: string;
  description: string;
  icon: SimpleIcon;
  isClone?: boolean;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const skillIcons: Record<string, SimpleIcon> = {
  C: siC,
  "C++": siCplusplus,
  "Next.js": siNextdotjs,
  React: siReact,
  "Node.js": siNodedotjs,
  Python: siPython,
  JavaScript: siJavascript,
  TypeScript: siTypescript,
  Rust: siRust,
  Java: siOpenjdk,
  Express: siExpress,
  Django: siDjango,
  Flask: siFlask,
  FastAPI: siFastapi,
  "Socket.IO": siSocketdotio,
  PyTorch: siPytorch,
  Git: siGit,
  Docker: siDocker,
  Linux: siLinux,
  Bash: siGnubash,
  Vercel: siVercel,
  "VS Code": siVscodium,
  PyCharm: siPycharm,
  Pandas: siPandas,
  NumPy: siNumpy,
  "Three.js": siThreedotjs,
  "React Hook Form": siReacthookform,
  "Chart.js": siChartdotjs,
  Ratatui: siRatatui,
  "Tailwind CSS": siTailwindcss,
  "Material UI": siMui,
  "shadcn/ui": siShadcnui,
  CUDA: siNvidia,
} satisfies Record<string, SimpleIcon>;

export function skillLabelsToLogos(labels: readonly string[]): SkillLogo[] {
  const seenIds = new Map<string, number>();

  return labels.flatMap((label) => {
    const icon = skillIcons[label];

    if (!icon) {
      return [];
    }

    const baseId = slugify(label) || "skill";
    const occurrence = seenIds.get(baseId) ?? 0;
    seenIds.set(baseId, occurrence + 1);

    return {
      id: occurrence === 0 ? baseId : `${baseId}-${occurrence + 1}`,
      description: label,
      icon,
    };
  });
}

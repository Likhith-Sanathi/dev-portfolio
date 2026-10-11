import type { Metadata } from "next";

import { PortfolioReel } from "@/components/reel/portfolio-reel";
import { portfolio } from "@/lib/portfolio-content";

export const metadata: Metadata = {
  title: `${portfolio.name} - Reel`,
  description: `A self-playing animated walkthrough of ${portfolio.name}'s portfolio: experience, achievements, projects, and skills.`,
};

export default function ReelPage() {
  return <PortfolioReel />;
}

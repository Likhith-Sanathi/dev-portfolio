# Graph Report - .  (2026-07-07)

## Corpus Check
- Corpus is ~4,463 words - fits in a single context window. You may not need a graph.

## Summary
- 160 nodes · 197 edges · 18 communities (11 shown, 7 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Motion UI Primitives|Motion UI Primitives]]
- [[_COMMUNITY_shadcn Registry Config|shadcn Registry Config]]
- [[_COMMUNITY_Portfolio Page Sections|Portfolio Page Sections]]
- [[_COMMUNITY_TypeScript Compiler Config|TypeScript Compiler Config]]
- [[_COMMUNITY_Runtime Dependencies|Runtime Dependencies]]
- [[_COMMUNITY_Package Scripts|Package Scripts]]
- [[_COMMUNITY_README Framework Docs|README Framework Docs]]
- [[_COMMUNITY_Dev Toolchain|Dev Toolchain]]
- [[_COMMUNITY_Agent Guidance Docs|Agent Guidance Docs]]
- [[_COMMUNITY_App Layout Metadata|App Layout Metadata]]
- [[_COMMUNITY_Window Icon Asset|Window Icon Asset]]
- [[_COMMUNITY_ESLint Config|ESLint Config]]
- [[_COMMUNITY_Next Runtime Config|Next Runtime Config]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]
- [[_COMMUNITY_File Icon Asset|File Icon Asset]]
- [[_COMMUNITY_Globe Icon Asset|Globe Icon Asset]]
- [[_COMMUNITY_Next.js Brand Asset|Next.js Brand Asset]]
- [[_COMMUNITY_Vercel Brand Asset|Vercel Brand Asset]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 21 edges
2. `compilerOptions` - 16 edges
3. `Next.js` - 7 edges
4. `tailwind` - 6 edges
5. `aliases` - 6 edges
6. `scripts` - 5 edges
7. `Badge()` - 4 edges
8. `Button()` - 4 edges
9. `KineticText()` - 3 edges
10. `Reveal()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `BackgroundPaperShaders()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/background-paper-shaders.tsx → src/lib/utils.ts
- `CardHeader()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/card.tsx → src/lib/utils.ts
- `CardDescription()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/card.tsx → src/lib/utils.ts
- `CardAction()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/card.tsx → src/lib/utils.ts
- `CardFooter()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/card.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Next.js Learning Resources** — readme_nextjs_documentation, readme_learn_nextjs, readme_nextjs_github_repository [EXTRACTED 1.00]

## Communities (18 total, 7 thin omitted)

### Community 0 - "Motion UI Primitives"
Cohesion: 0.17
Nodes (16): KineticText(), Reveal(), RevealVariant, Badge(), badgeVariants, Button(), buttonVariants, Card() (+8 more)

### Community 1 - "shadcn Registry Config"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 2 - "Portfolio Page Sections"
Cohesion: 0.12
Nodes (6): socialIcons, LenisProvider(), ParallaxScene(), ScrollProgress(), BackgroundPaperShaders(), portfolio

### Community 3 - "TypeScript Compiler Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 4 - "Runtime Dependencies"
Cohesion: 0.13
Nodes (15): dependencies, class-variance-authority, clsx, lenis, lucide-react, motion, next, radix-ui (+7 more)

### Community 5 - "Package Scripts"
Cohesion: 0.18
Nodes (10): ignoreScripts, name, private, scripts, build, dev, lint, start (+2 more)

### Community 6 - "README Framework Docs"
Cohesion: 0.33
Nodes (10): app/page.tsx, create-next-app, Geist, Learn Next.js, next/font, Next.js, Next.js deployment documentation, Next.js Documentation (+2 more)

### Community 7 - "Dev Toolchain"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node, @types/react, @types/react-dom (+2 more)

### Community 8 - "Agent Guidance Docs"
Cohesion: 0.60
Nodes (3): Next.js, node_modules/next/dist/docs/, Nonstandard Next.js Version

### Community 9 - "App Layout Metadata"
Cohesion: 0.40
Nodes (3): display, metadata, mono

### Community 10 - "Window Icon Asset"
Cohesion: 1.00
Nodes (3): Software Window, Title Bar Controls, Window Icon

## Knowledge Gaps
- **85 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+80 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Runtime Dependencies` to `Package Scripts`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Dev Toolchain` to `Package Scripts`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `cn()` connect `Motion UI Primitives` to `Portfolio Page Sections`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _85 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `shadcn Registry Config` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `Portfolio Page Sections` be split into smaller, more focused modules?**
  _Cohesion score 0.11904761904761904 - nodes in this community are weakly interconnected._
- **Should `TypeScript Compiler Config` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
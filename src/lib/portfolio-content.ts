export const portfolio = {
  name: "Likhith Sanathi",
  role: "Computer Science student and software engineer",
  location: "Cork, Ireland",
  email: "likhithsanathi@gmail.com",
  availability: "Open to internships in AI, and software engineering",
  headline: "Likhith Sanathi.",
  hero:
    "I build production-minded software across AI tooling, Full-stack, quantitative ML, terminal systems, and verification workflows.",
  summary:
    "3rd year Computer Science student at University College Cork, building across IC verification, full-stack development, autonomous coding systems, quant trading research, and competitive cybersecurity with an insatiable habit of picking up new domains just to see how they work.",
  socials: [
    { label: "GitHub", href: "https://github.com/Likhith-Sanathi?tab=repositories" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/likhith-sanathi/" },
    { label: "Email", href: "mailto:likhithsanathi@gmail.com" },
  ],
  nav: [
    { label: "About me", href: "#about" },
    { label: "Projects", href: "#projects" },
    { label: "Skills", href: "#skills" },
    { label: "Contact me", href: "#contact" },
  ],
  stats: [
    { value: "1st / 40", label: "Intervarsity CTF finish" },
    { value: "500+", label: "Equities modelled" },
    { value: "Top 0.8%", label: "PicoCTF worldwide" },
  ],
  education: [
    {
      institution: "University College Cork",
      degree: "Bachelor of Science in Computer Science",
      detail: "On track for First-Class Honours (1.1)",
      location: "Cork, Ireland",
      period: "Sep 2024 - May 2028",
      coursework: [
        "Algorithms & Data Structures",
        "Operating Systems",
        "Networking",
        "Relational Databases",
        "Software Engineering",
        "Discrete Mathematics",
        "Logic Design",
        "Systems Architecture",
      ],
    },
  ],
  projects: [
    {
      title: "Autonomous Coding Harness",
      type: "Terminal-native autonomous coding runtime",
      year: "2026",
      period: "May 2026 - Jul 2026",
      description:
        "Engineered a repository-aware coding runtime in Rust with a 6-stage ReAct-style plan-act-observe-reflect-verify loop for software tasks.",
      highlights: [
        "Built a structured agent execution layer with 21 typed tool actions for repo search, filesystem mutation, patching, archive handling, shell execution, and task finalization.",
        "Designed enterprise-style safety controls including reflection tracking, changed-file monitoring, approval gates, external-path isolation, timeouts, mutation-risk classification, and automated verification across 6 project types.",
      ],
      impact: "Combined terminal UX, tool orchestration, and safety guardrails into one cohesive autonomous runtime.",
      tags: ["Rust", "Ratatui", "OpenRouter", "Crossterm"],
      githubUrl: "https://github.com/Likhith-Sanathi/tack",
    },
    {
      title: "StudyForge",
      type: "AI-powered study platform",
      year: "2026",
      period: "Apr 2026 - Present",
      description:
        "Developed an AI-powered study platform that turns uploaded PDF, DOCX, TXT, and Markdown files into flashcards, MCQs, true/false questions, fill-in-the-blanks, key concepts, summaries, and an AI tutor chat experience.",
      highlights: [
        "Implemented an end-to-end local pipeline with document parsing, content chunking, OpenRouter-powered generation, model selection, and persistent SQLite storage for study sets, progress tracking, and recent activity.",
        "Designed responsive study workflows with filtering, keyboard shortcuts, animated card interactions, dark mode, and dashboard analytics to make revision faster and interactive across devices.",
      ],
      impact:
        "Combined local document processing, persistent progress tracking, and AI-assisted revision into one cohesive study workflow across desktop and mobile.",
      tags: ["Next.js", "React", "TypeScript", "SQLite", "OpenRouter"],
      githubUrl: "https://github.com/Likhith-Sanathi/studyforge",
    },
    {
      title: "S&P 500 Quant Trading Pipeline",
      type: "Applied machine learning research pipeline",
      year: "2025",
      period: "Oct 2025 - Jan 2026",
      description:
        "Built a reproducible ML pipeline to forecast returns across 500+ large-cap equities with 20+ technical indicators and 60-day rolling windows.",
      highlights: [
        "Implemented and trained 3 GPU-accelerated PyTorch sequence models using chronological splits, Adam optimisation, LR scheduling, gradient clipping, and patience-based early stopping.",
        "Developed a backtesting engine with transaction costs, rule-based execution, and performance reporting across 10+ tickers.",
      ],
      impact:
        "Reached 55.7% directional accuracy and outperformed buy-and-hold in sample AAPL backtests over the same evaluation horizon.",
      tags: ["Python", "PyTorch", "pandas", "NumPy", "CUDA"],
      githubUrl: "https://github.com/Likhith-Sanathi/lstm-stock-predictor",
    },
    {
      title: "Asset Management App",
      type: "Secure full-stack asset operations platform",
      year: "2025",
      period: "Dec 2025 - Jan 2026",
      description:
        "Delivered a secure Django/PostgreSQL web app for a client by migrating a Flask/SQLite prototype and deploying it to AWS Lightsail within a six-week milestone-based engagement.",
      highlights: [
        "Hardened access and operations by restricting inbound traffic to trusted allowlisted home-network IP ranges and setting up a Git-based repeatable deployment workflow with sub-5-minute deploys and rollback safety.",
        "Expanded the prototype with user authentication and data-visualisation dashboards, delivering 5+ key operational reports for faster day-to-day decision support.",
      ],
      impact:
        "Turned a local prototype into a production-facing client system with secure access controls, structured delivery, and dependable deployment operations.",
      tags: ["Python", "Django", "PostgreSQL", "AWS Lightsail"],
      githubUrl: "https://github.com/Likhith-Sanathi/django-asset-management",
    },
    {
      title: "JavaScript Rogue-like Game",
      type: "Browser-based rogue-like game",
      year: "2025",
      period: "Jan 2025 - Mar 2025",
      description:
        "Engineered a browser-based rogue-like with multi-round gameplay, boss fights, projectile systems, and collision physics across 10+ levels with progressively increasing difficulty.",
      highlights: [
        "Implemented a custom 2D physics engine for movement, collisions, and projectile dynamics, and built a persistent Flask/SQLite leaderboard to store and retrieve 1,000+ high-score entries across sessions.",
        "Integrated AJAX-driven leaderboard and run-state updates without page reloads, cutting interaction latency to sub-second updates and improving gameplay responsiveness.",
      ],
      impact:
        "Combined real-time browser gameplay, persistent score tracking, and asynchronous UI updates into a responsive multi-level arcade experience.",
      tags: ["Python", "Flask", "AJAX", "JavaScript", "SQLite"],
      githubUrl: "https://github.com/Likhith-Sanathi/js-roguelike-game",
    },
  ],
  experience: [
    {
      period: "May 2026 - Sep 2026",
      title: "IC Verification Intern",
      company: "Vishay Intertechnology, Inc.",
      location: "Cork, Ireland",
      description:
        "Collaborated on UVM-based functional verification and regression workflows using vManager, supporting 100+ regression runs in a Linux verification environment.",
      highlights: [
        "Leveraged AI tools to accelerate regression analysis, debugging, verification reporting, and license optimisation, reducing manual effort by 25-30% across large-scale workflows.",
        "Analysed regression, coverage, and traceability reports to identify verification gaps, improve functional coverage by approximately 10-15%, uncover missing test scenarios, and generate tailored reports for 3+ engineering disciplines.",
        "Supported day-to-day regression health in a Linux verification environment by tracking failing runs, monitoring tool and license usage, and turning verification outputs into actionable updates for cross-functional engineering teams.",
      ],
    },
  ],
  achievements: [
    {
      title: "Winner, University of Galway CompSoc Intervarsity CTF",
      detail:
        "Won Ireland's largest student-led Capture The Flag event, finishing 1st of 40 teams.",
      period: "Feb 2026",
    },
    {
      title: "5th Place, ZeroDays CTF Open Division",
      detail:
        "Placed 5th overall in the Open category at one of the world's largest in-person Capture The Flag events.",
      period: "Mar 2026",
    },
    {
      title: "PicoCTF Global Division: 81st / 8,747 Teams Worldwide",
      detail:
        "Ranked in the top 0.8% worldwide in one of the largest global cybersecurity competitions.",
      period: "Mar 2026",
    },
    {
      title:
        "UCC College of Science, Engineering and Food Science Undergraduate Scholarship",
      detail:
        "Awarded a University College Cork undergraduate scholarship from the College of Science, Engineering and Food Science.",
      period: "Sep 2024",
    },
  ],
  skillGroups: [
    {
      title: "Languages",
      items: [
        "HTML",
        "CSS",
        "Python",
        "Java",
        "JavaScript",
        "TypeScript",
        "C",
        "C++",
        "Rust",
        "SQL",
        "MIPS Assembly",
      ],
    },
    {
      title: "Frameworks",
      items: [
        "Next.js",
        "Express",
        "Django",
        "Flask",
        "CUDA",
        "PyTorch",
      ],
    },
    {
      title: "Developer Tools",
      items: [
        "Git",
        "Docker",
        "Linux",
        "Bash",
        "AWS",
        "Vercel",
        "VS Code",
        "Claude Code",
        "OpenAI Codex",
        "GitHub Copilot",
      ],
    },
    {
      title: "Libraries",
      items: [
        "Pandas",
        "NumPy",
        "Matplotlib",
        "Tailwind CSS",
        "Material UI",
        "shadcn/ui",
      ],
    },
  ],
} as const;

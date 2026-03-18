export interface Experience {
  year: string;
  role: string;
  company: string;
  bullets?: string[];
}

export const EXPERIENCE: Experience[] = [
  {
    year: "2024 – Now",
    role: "Hobby Builder",
    company: "Personal Projects",
    bullets: [
      "Rebuilding this portfolio so it feels more honest and less template-like.",
      "Making small tools, experiments, and random ideas that help me learn by doing.",
    ],
  },
  {
    year: "2022 – Now",
    role: "AI + Automation Explorer",
    company: "Self-Directed",
    bullets: [
      "Testing agent workflows, prompt ideas, and everyday automation.",
      "Keeping the useful parts, throwing away the overcomplicated parts.",
    ],
  },
  {
    year: "2022 – 2025",
    role: "BSc Computer Systems Engineering",
    company: "University of Sunderland",
    bullets: [
      "Graduated with Second Class Honours (First Division), June 2025.",
      "Built strong systems thinking that shapes how I approach every project.",
      "Deepened understanding of software architecture, networks, and engineering principles.",
    ],
  },
  {
    year: "2019 – 2022",
    role: "Higher National Diploma (HND) in Computing",
    company: "KMD Computer Centre · SQA",
    bullets: [
      "Studied Computer Systems Fundamentals, Software Development, and Database Design.",
      "Covered software programming foundations, project management, and professional ethics.",
      "Served as the academic foundation before progressing to the BSc degree programme.",
    ],
  },
];

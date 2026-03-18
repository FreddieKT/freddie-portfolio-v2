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
    bullets: ["Building tools and experiments to learn by doing."],
  },
  {
    year: "2022 – Now",
    role: "AI + Automation Explorer",
    company: "Self-Directed",
    bullets: ["Testing agent workflows and prompt engineering."],
  },
  {
    year: "2022 – 2025",
    role: "BSc Computer Systems Engineering",
    company: "University of Sunderland",
    bullets: ["Second Class Honours (First Division), June 2025."],
  },
  {
    year: "2019 – 2022",
    role: "Higher National Diploma (HND) in Computing",
    company: "KMD Computer Centre · SQA",
    bullets: ["Academic foundation for my BSc degree programme."],
  },
];

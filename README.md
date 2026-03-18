# KTT.DEV — Personal Portfolio

Personal portfolio and blog of Khant Thura Thaung. Built with Astro and AstroPaper.

## Stack

- [Astro](https://astro.build/) — static site generator
- [AstroPaper](https://github.com/satnaing/astro-paper) — theme base
- [Tailwind CSS](https://tailwindcss.com/) — styling
- [Web3Forms](https://web3forms.com/) — contact form
- [Vercel](https://vercel.com/) — deployment

## Project structure

```
src/
├── data/
│   ├── blog/          # Blog posts (.md files)
│   ├── projects/      # Project entries (.md files)
│   ├── profile.ts     # Profile info
│   ├── experience.ts  # Experience timeline
│   └── certificates.ts
├── pages/
│   ├── index.astro    # Home
│   ├── about.astro    # About
│   └── projects/      # Projects listing + detail
└── components/
    └── ContactForm.astro
```

## Adding content

**New blog post** — create `src/data/blog/your-post-slug.md`:

```markdown
---
title: "Post Title"
description: "One sentence summary."
pubDatetime: 2026-03-18T00:00:00Z
tags: ["tag1", "tag2"]
---

Post body here.
```

**New project** — create `src/data/projects/your-project.md`:

```markdown
---
title: "Project Name"
description: "What it does."
pubDatetime: 2026-03-18T00:00:00Z
category: "Side Tool"
technologies: ["Astro", "Tailwind"]
featured: true
link: "https://live-url.com"
github: "https://github.com/FreddieKT/repo"
---

Project body here.
```

Push to `main` — Vercel deploys automatically.

## Environment variables

| Variable                          | Description                                                  |
| --------------------------------- | ------------------------------------------------------------ |
| `PUBLIC_SITE_URL`                 | Full site URL (e.g. `https://ktt.dev`)                       |
| `PUBLIC_WEB3FORMS_KEY`            | Contact form key from [web3forms.com](https://web3forms.com) |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console (optional)                             |

## Local dev

```bash
npm install
npm run dev
```

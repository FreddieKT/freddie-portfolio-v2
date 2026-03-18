---
title: "KTT.DEV Portfolio Refresh"
description: "A full refresh of my portfolio with calmer copy, cleaner fallbacks, better production handling, and a style that feels more like me than a template."
pubDatetime: 2024-11-15T00:00:00Z
category: "Personal Site"
technologies: ["Astro", "Tailwind", "Vercel"]
featured: true
link: "https://ktt.dev"
github: "https://github.com/FreddieKT/freddie-portfolio-v2"
---

Rebuilt from scratch using Astro and AstroPaper. The goal was to get rid of the database dependency, simplify publishing, and end up with something that loads fast and stays easy to maintain long-term.

## What changed

The previous version ran a React SPA backed by Supabase — full CMS, admin panel, auth, serverless functions. Useful to build, but too heavy for a personal portfolio.

This version is static. Blog posts are markdown files. Projects are markdown files. There is no database, no auth layer, no admin UI. Publishing means writing a file and pushing to git.

## What I kept

- The editorial layout and typography
- Dark/light mode
- RSS feed and sitemap (built into Astro)
- The same writing style and tone

## Stack

Built with Astro, styled with Tailwind, deployed on Vercel. Zero backend.

# SOCS — Society of Cyber Security

> A high-performance, cyberpunk-themed event website for the **Society of Cyber Security (SOCS)** — built with Next.js 16, GSAP, and a hacker aesthetic.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=flat-square&logo=tailwindcss)

---

## Features

- **Cyberpunk UI** — Chamfered clip-path cards, neon glow effects, scanline overlays
- **Live Threat Map** — Real-time animated global cyber-attack visualization (checkpoint.com style) using `react-simple-maps` + Canvas arcs
- **Floating Navbar** — Glassmorphic pill with live clock, threat level badge, and terminal toggle
- **Interactive Terminal** — Fully functional in-browser hacker terminal with commands, theme customization, and navigation
- **Matrix Data Stream** — GSAP-powered background animation
- **Scramble Text** — Matrix-style text decode animation on headings
- **Custom Cursor** — GSAP-tracked crosshair cursor
- **Smooth Scroll** — Lenis-powered scroll with page transitions
- **Dynamic Theming** — Live color customization via terminal commands (`theme primary #ff0040`)

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animations | GSAP, Framer Motion |
| Maps | react-simple-maps, topojson-client, world-atlas |
| Scroll | Lenis |
| Icons | Lucide React |
| Fonts | Space Grotesk, Turret Road, Wallpoet, Silkscreen |

---

## Getting Started

```bash
# Install dependencies
npm install

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Terminal Commands

The `>_ TERM` button in the navbar (or `Ctrl + \``) opens the hacker terminal. Available commands:

```
help            — list all commands
cd <page>       — navigate to a page (home, team, projects, events, resources)
ls              — list available pages
whoami          — display current user
clear           — clear terminal
theme primary <color>     — change accent color
theme bg <color>          — change background color
theme font <name>         — change font preset
theme reset               — reset to defaults
```

---

## Project Structure

```
src/
├── app/                  — Next.js routes + global CSS
├── components/
│   ├── cards/            — ProjectCard, EventCard, etc.
│   ├── layout/           — Navbar, Footer, PageWrapper, MobileMenu
│   ├── sections/         — HeroSection, AboutSection, StatsSection, etc.
│   └── ui/               — ThreatMap, Terminal, CustomCursor, GlowBorder, NeonButton, ...
├── constants/            — Static data (projects, events, team)
├── context/              — ThemeContext
├── lib/                  — GSAP animation helpers
└── types/                — Module declarations
```

---

## Contributing

PRs welcome. Open an issue first for major changes.

---

## License

MIT © Society of Cyber Security

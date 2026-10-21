# Sabbar — Website Front-End

Static, responsive, Arabic (RTL) front-end for the Sabbar creative studio website.
Plain HTML + CSS + vanilla JavaScript. **No build step, no frameworks, no dependencies.**

## Quick start

Open `index.html` in a browser, or serve the folder with any static server:

```bash
npx serve .          # or: python3 -m http.server 8080
```

## Pages

| File | Page |
|---|---|
| `index.html` | Home (hero video, about, stats, clients, services, selected work) |
| `chapters.html` | Chapters (services in four chapters + AI section) |
| `journeys.html` | Journeys (project filter + slowly moving project rail) |
| `journey-detail.html` | Single project template (cover, story, gallery) |
| `team.html` | Team (8 members + AI teammate) |
| `contact.html` | Contact form |

## Folder structure

```
index.html … contact.html   one file per page
css/styles.css              all styles (tokens at the top, sectioned)
js/main.js                  all behaviour (sectioned, commented)
assets/                     logo, hero video/poster, cactus, 16 client logos
fonts/                      Bahij TheSansArabic (Light / Plain / Bold, .ttf)
docs/                       developer documentation
```

## Documentation

- [docs/DEVELOPER-GUIDE.md](docs/DEVELOPER-GUIDE.md) — structure, design tokens, components, JavaScript behaviour, accessibility, browser support.
- [docs/CONTENT-GUIDE.md](docs/CONTENT-GUIDE.md) — how to replace placeholder images, add projects/team members, edit text.
- [docs/BACKEND-INTEGRATION.md](docs/BACKEND-INTEGRATION.md) — contact form endpoint, turning pages into templates/CMS, going live checklist.

## What is placeholder / to be provided

- **Images** for projects, team members, the project cover and gallery use `https://placehold.co/`. Replace them with real images (see the Content Guide).
- **X (Twitter) link** points to `https://x.com/` — replace with the real account URL (search for `x.com` in all pages; it appears in the header drawer, footer and the project page).
- **Contact form** has no backend; it shows the success state only until `data-endpoint` is set.
- **Project page** (`journey-detail.html`) contains one example project. Every card on the Journeys page links to it; create one page (or one template) per project.

## Credits & licences

- Font: Bahij TheSansArabic — check the licence you hold covers web embedding.
- Icons: Phosphor Icons (MIT), embedded as an inline SVG sprite at the top of each page.

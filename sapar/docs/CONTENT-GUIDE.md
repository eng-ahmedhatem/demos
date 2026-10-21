# Content Guide

## Replace placeholder images

All placeholders are `https://placehold.co/…` URLs. Put real files in `assets/` (e.g. `assets/projects/zain.jpg`) and change the `src`.

| Where | Recommended size (px) | Notes |
|---|---|---|
| `index.html` → "قصص صبار" cards | 540 × 600 | cropped to 9:10 |
| `journeys.html` → project cards | 360 × 1000 | tall card, cropped to 9:25 |
| `journey-detail.html` → cover | 540 × 800 | cropped to 27:40 |
| `journey-detail.html` → gallery | 1640 × 1025 | cropped to 16:10 |
| `team.html` → members | 480 × 640 | cropped to 3:4 |
| `team.html` → Rashed (AI) | 400 × 400 | shown as a circle |

Use JPG/WebP, compress to < 200 KB each, and update the `alt` text.

## Add a project to the Journeys page

Copy one `<a class="proj" …>` block inside `.rail__track` in `journeys.html`, then change:

- `data-cat` → `campaigns` or `production` (drives the filter)
- `href` → the project's page
- image `src` / `alt`, the small category line, and the title.

Update the counts in the three filter buttons (`<sup>…</sup>`). To add a new category: add a `<button class="filter" data-filter="new-key">` and use `new-key` in `data-cat`.

## Add a team member

Copy one `<div class="member …">` in `team.html` and change the image, name and role. The grid reflows automatically.

## Edit text

All copy is plain HTML text in the page files (Arabic). Numbers use Western digits (1 2 3 …) throughout — keep that convention.

## Links to fill in

- **X (Twitter)**: search `x.com` in the pages and replace with the real profile URL (header drawer, footer, project page share buttons).
- Instagram and LinkedIn point to `sabbar.sa` and `sabbar-studio` — confirm they are correct.
- Phone `+966 50 060 2937` and email `Sales@sabbarstudio.com` appear in the drawer, footer and contact page (search & replace).

## Stats (home page)

`<div class="stat …"><b>+500</b><span>سكتش<br>تصميم</span></div>` — edit the number and the two label lines.

# Backend Integration

The front-end has **no server code**. Everything below is optional wiring for your own backend/CMS.

## 1. Contact form

Markup: `contact.html` → `<form id="contact-form" data-endpoint="">`.

Fields (`name` attributes): `organization`, `name` (required), `email` (required), `phone`, `details`.

**To connect:** set `data-endpoint` to your URL, e.g. `data-endpoint="/api/contact"`.
`js/main.js` (section 6) will then `POST` the form as JSON:

```http
POST /api/contact
Content-Type: application/json

{"organization":"…","name":"…","email":"…","phone":"…","details":"…"}
```

- Respond with any **2xx** status → the form resets and the success message shows.
- Any other status or a network failure → an Arabic error message appears under the fields (edit the text in `main.js`).
- If `data-endpoint` is empty the form only shows the success state (demo mode).
- If you prefer a classic full-page POST: remove the submit listener in `main.js` section 6 and set `action`/`method` on the form.

Recommended server-side: validate and sanitise all fields, rate-limit, add spam protection (honeypot or CAPTCHA — add the field/script to the form), and send mail via your provider. Do not trust the client-side `required` checks.

## 2. Dynamic content (projects, team)

Projects and team members are static HTML. To drive them from a database/CMS, render the same markup server-side:

- **Journeys rail** needs, per project: `slug`, `title`, `category` (`campaigns|production`), `year`, `image`. Output one `.proj` link per project inside `.rail__track`. The JS reads the DOM, so no JS change is needed — but output the filter counts too.
- **Project page**: use `journey-detail.html` as the template — fields: category line, `h1` title, English subtitle, two paragraphs, cover image, gallery images (any number; add one dot button per image).
- **Team**: one `.member` per person: `photo`, `name`, `role`.
- **Home "قصص صبار"** cards: pick featured projects from the same data.

Suggested URLs: `/journeys`, `/journeys/{slug}`, `/chapters`, `/team`, `/contact`. If you drop the `.html` extensions, update the links in the header, drawer, footer and CTAs.

## 3. Shared partials

Header + drawer, footer and the SVG sprite are duplicated in every page. In a templating system make them partials; pass the current page so the matching link gets `aria-current="page"`.

## 4. Going live checklist

- [ ] Replace all `placehold.co` images; add real `alt` text.
- [ ] Replace the X link; confirm Instagram / LinkedIn, phone and email.
- [ ] Set the contact form `data-endpoint` (and add spam protection).
- [ ] Per-page `<title>`, `description` and Open Graph tags are set — update `og:image` to a full-size social image with an **absolute URL**; add `og:url` and a canonical link.
- [ ] Add `robots.txt` / `sitemap.xml`; add analytics and a cookie notice if required.
- [ ] Convert fonts to WOFF2; optionally add an MP4 fallback for the hero video.
- [ ] Serve over HTTPS with long-lived caching for `assets/`, `fonts/`, `css/`, `js/` (fingerprint file names or version the URLs).
- [ ] Test in Safari iOS (video autoplay, drawer) and on a small Android device.

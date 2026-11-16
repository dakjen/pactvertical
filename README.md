# PACT Vertical Website

**Version:** 1.3 · **Date:** 2026-11-16 · Draft for review

A static, single-page site for PACT Vertical, LLC. There is no build step and nothing to install. Vercel serves the files as they are.

## Files

| File | Purpose |
|---|---|
| `index.html` | Home page with all sections |
| `styles.css` | All styling |
| `main.js` | Mobile menu, scroll reveals, footer year |
| `404.html` | Not-found page |
| `assets/` | Logo files and favicon |
| `vercel.json` | Clean URLs, security headers, asset caching |
| `robots.txt`, `sitemap.xml` | Search engine basics |

Web files keep their standard names (`index.html` and so on) because Vercel and browsers need them. The version and date are recorded here and in `VERSION`.

## Deploy

1. Create an empty GitHub repo, for example `pactvertical-website`.
2. From this folder, run:
   ```bash
   git remote add origin https://github.com/<your-account>/pactvertical-website.git
   git push -u origin main
   ```
3. In Vercel, go to **Add New → Project**, import the repo, and set **Framework Preset** to **Other**. Leave the build command and output directory empty, then deploy.
4. Under **Settings → Domains**, add `pactvertical.com` and `www.pactvertical.com`, then update DNS at your registrar using the records Vercel shows you.

To preview locally, run `npx serve .` or open `index.html` in a browser.

## Brand

All colors are sampled from the PACT Vertical logo files:

| Role | Hex | Where it comes from |
|---|---|---|
| Primary maroon | `#882B2B` | Logo squares |
| Deep oxblood | `#60120B` | "Partners, Advisors, Contractors, Technicians" ring text |
| Charcoal | `#404040` | "PACT" lettering |
| Grey | `#8C8C8C` | "VERTICAL" lettering |
| Light grey | `#9C9C9C` | Grey squares |

Fonts: Raleway for headings, Open Sans for body text (both match the current site), and Bodoni Moda for the header wordmark.

**Logo files** (in `assets/`, all made from the original logo):
- `pact-vertical-logo.png`: the full circular logo, used in the Experience section
- `pact-lockup.png`: the mark with "PACT VERTICAL", without the ring text (not used yet; available for social or OG images)
- `pact-mark.png`: the squares only, used in the header
- `favicon.png`: the browser tab icon

## Content sources

- **Current pactvertical.com:** the banner ("Partners, Advisors, Contractors, Technicians / 4:1 four assets in one"), the four assets, Verticality, and the mission statement.
- **Box, "PACT Vertical Narrative GM edits.docx":** the Experience section (founded January 2021, 25+ years, NREUV's $150M+ in DMV projects over 15 years), the skills list, and the three Prince George's County projects in pre-development.
- **Box, "Gina M Resume - PACT Vertical, LLC.docx":** the service descriptions, Gina's bio, education, awards, and the project experience list.
- **Contact details:** the PACT Vertical address, phone, and email on file.

Nothing else was added.

## Please confirm before launch

1. **Founding year.** The narrative PDF says January **2020**; your edited narrative (docx) says January **2021**. The site uses 2021.
2. **Office address.** The site shows 9183A Central Avenue, Capitol Heights, MD 20743, but your résumé header says Greenbelt, MD.
3. **Project experience.** These are Gina's career projects (most through NREUV), and the site labels them that way. They are not PACT Vertical contracts.
4. **Unit and cost totals.** The résumé has two conflicting versions (7,500 units / $2B and 3,000 units / $550M), so neither is on the site.
5. **NREUV link.** The site links to https://nreuv.com.
6. **Contact button.** It opens the visitor's email app. A form would need a service such as Formspree.

## Still open

- **Four asset descriptions.** The cards show only their titles, because there was no source text for them.
- **Hero photo.** The hero uses a dark striped background. To use a photo instead, add it to `assets/` and set it as `.hero-photo` content.

## Changes in v1.3

- Content filled in from Box: experience, services, skills, project experience, and leadership bio.
- The mission section shows the logo.
- Asset paths are now relative, so the site works on Vercel and in any subfolder.

## Changes in v1.2

- Uses the original PACT Vertical logo files in place of the redrawn mark.
- Palette taken exactly from the logo. The bright red mission band is now the logo maroon, and the footer is the deep oxblood.
- The full circular logo now sits beside the Experience section.

## Changes in v1.1

- Recolored to the real brand palette and fonts listed above.
- Added the Mission section (red band) using the current site's mission text.
- The Verticality section now uses the site's actual wording.
- Hero now uses the site's banner content: "PACT Vertical / Partners, Advisors, Contractors, Technicians / 4:1 four assets in one."
- Added the logo mark.

## Adding images

Put photos in `assets/`. Then replace each placeholder block. For example, change

```html
<div class="hero-photo" ...><span class="ph-tag">[INSERT: …]</span></div>
```

to

```html
<div class="hero-photo"><img src="/assets/hero.jpg" alt="Describe the photo" style="width:100%;height:100%;object-fit:cover"></div>
```

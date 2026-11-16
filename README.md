# PACT Vertical Website

**Version:** 1.2 · **Date:** 2026-11-16 · Draft for review

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

All copy comes from the current pactvertical.com page: the experience paragraph, the four assets, the "Verticality" statement, the mission statement, and the "Partners, Advisors, Contractors, Technicians / 4:1 four assets in one" banner. The contact details are the PACT Vertical address, phone, and email already on file. Nothing else was added.

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

## Before launch: placeholders to fill

Every placeholder is marked `[INSERT: …]` and shows on the page with amber hatching, so it is easy to find. Search `index.html` for `INSERT`.

1. **Hero photo** (and its alt text). The current site's black-and-white header image can be reused.
2. **Mission photo.** The collage from the current mission banner.
3. **Four Assets descriptions.** One or two sentences each for Partnership, Advising & Counseling, Vetted Contractors, and Top Technicians.
4. **Services descriptions** for Development, Design, and Construction Management.
5. **Selected Projects.** Name, photo, location, type, and PACT Vertical's role for each (three cards; add or remove as needed).
6. **Leadership.** Gina Merritt's title and bio, plus any other team members to list.

## Please confirm

- The office address, phone, and email are public on the site. Confirm they should be.
- The NREUV link points to `https://nreuv.com`. Confirm the URL.
- The contact button opens the visitor's email app (`mailto:`). If you want a form instead, Vercel needs a form service such as Formspree. That would be a v1.1 change.

## Adding images

Put photos in `assets/`. Then replace each placeholder block. For example, change

```html
<div class="hero-photo" ...><span class="ph-tag">[INSERT: …]</span></div>
```

to

```html
<div class="hero-photo"><img src="/assets/hero.jpg" alt="Describe the photo" style="width:100%;height:100%;object-fit:cover"></div>
```

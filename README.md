# PACT Vertical Website

**Version:** 1.0 · **Date:** 2026-11-16 · Draft for review

A static, single-page site for PACT Vertical, LLC. There is no build step and nothing to install. Vercel serves the files as they are.

## Files

| File | Purpose |
|---|---|
| `index.html` | Home page with all sections |
| `styles.css` | All styling |
| `main.js` | Mobile menu, scroll reveals, footer year |
| `404.html` | Not-found page |
| `assets/favicon.svg` | Browser tab icon |
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

## Content sources

The only facts used come from the current pactvertical.com page and the PACT Vertical contact details already on file (address, phone, email). Nothing else was added.

## Before launch: placeholders to fill

Every placeholder is marked `[INSERT: …]` and shows on the page with amber hatching, so it is easy to find. Search `index.html` for `INSERT`.

1. **Hero photo** (and its alt text). The current site's images can be reused.
2. **Four Assets descriptions.** One or two sentences each for Partnership, Advising & Counseling, Vetted Contractors, and Top Technicians.
3. **Services descriptions** for Development, Design, and Construction Management.
4. **Selected Projects.** Name, photo, location, type, and PACT Vertical's role for each (three cards; add or remove as needed).
5. **Leadership.** Gina Merritt's title and bio, plus any other team members to list.

## Please confirm

- The four assets (Partnership, Advising & Counseling, Vetted Contractors, Top Technicians) are laid out with their first letters spelling P-A-C-T. Confirm this reading of the name works for you.
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

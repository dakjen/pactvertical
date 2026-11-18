# PACT Vertical Website

**Version:** 3.3 · **Date:** 2026-11-18 · Draft for review

A static, single-page site for PACT Vertical, LLC. There is no build step and nothing to install. Vercel serves the files as they are.

## Files

| File | Purpose |
|---|---|
| `index.html` | Home page with all sections, including the contact form |
| `api/contact.js` | Vercel serverless function behind the contact form. Sends email through Brevo |
| `styles.css` | All styling |
| `main.js` | Mobile menu, scroll reveals, footer year |
| `privacy.html`, `terms.html` | Legal pages, served at `/privacy` and `/terms` |
| `404.html` | Not-found page |
| `assets/` | Logo files, photos, favicons, and the social share image |
| `favicon.ico`, `site.webmanifest` | Browser tab and home-screen icons |
| `vercel.json` | Clean URLs, security headers, asset caching |
| `robots.txt`, `sitemap.xml`, `llms.txt` | Search engine and AI crawler basics |

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

5. **Connect Brevo (contact form).** In the Vercel project, open **Settings → Environment Variables** and add:

   | Variable | Value |
   |---|---|
   | `BREVO_API_KEY` | From Brevo → SMTP & API → API keys. Required. |
   | `CONTACT_TO` | Inbox(es) that receive inquiries, comma-separated. Default `gmerritt@pactvertical.com`. |
   | `BREVO_SENDER_EMAIL` | A sender verified in Brevo → Senders & Domains. Default `no-reply@pactvertical.com`. |
   | `BREVO_SENDER_NAME` | Default `PACT Vertical`. |
   | `BREVO_LIST_ID` | Optional. The numeric id of the Brevo list for the "keep me updated" box. Leave unset to skip list adds. |
   | `SITE_URL` | Where the logo and links inside the emails point. Default `https://pactvertical.com`. Set it to `https://pactvertical.vercel.app` until DNS moves, then remove it. |

   In Brevo, authenticate the **pactvertical.com** domain (Senders & Domains → Domains → add DKIM and DMARC records at the registrar) so the emails do not land in spam. Redeploy after adding variables. Until `BREVO_API_KEY` is set, the form shows a polite "not set up yet" message with the email address as a fallback.

   **Emails the form sends:**
   - *To PACT* (`CONTACT_TO`): "New inquiry: Name (Org) · Service" with every field, the message, and Reply-To set to the visitor so a plain reply answers them.
   - *To the visitor:* "We received your inquiry, PACT Vertical" with a copy of what they sent, the two-business-day promise, and the phone number.
   - *Optional list add:* when the visitor ticks the updates box and `BREVO_LIST_ID` is set, they are added to that list with FIRSTNAME, LASTNAME, ORGANIZATION, and SOURCE attributes. Brevo campaigns sent to that list carry Brevo's unsubscribe link automatically.

   **Protections:** honeypot field, 1.5-second minimum submit time, per-IP rate limit (5 per 10 minutes per instance), server-side validation and length caps, HTML escaping in every email.

6. **Turn on analytics.** In the Vercel project, open **Analytics** and click **Enable**, then redeploy once. The page already loads the analytics script, and it is cookieless, so no consent banner is needed. Until this is enabled the script simply returns 404 and nothing breaks.

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

Fonts (v2.0): Manrope for headings and body, JetBrains Mono for small labels, and Bodoni Moda for the header wordmark.

v3.0 adds a steel neutral scale (`#F4F5F6` to `#2E3338` graphite) alongside the logo colors.

**Logo files** (in `assets/`, all made from the original logo):
- `pact-vertical-logo.png`: the full circular logo, original colors, for light backgrounds
- `pact-vertical-logo-dark.png`: the full circular logo recolored for dark backgrounds (used in v2.1–2.2; kept for dark materials) (v3.0)
- `pact-lockup.png`: the mark with "PACT VERTICAL", without the ring text (not used yet; available for social or OG images)
- `pact-mark.png`: the squares only, used in the header
- `favicon.png`: the browser tab icon

## Content sources

- **Current pactvertical.com:** the banner ("Partners, Advisors, Contractors, Technicians / 4:1 four assets in one"), the four assets, Verticality, and the mission statement.
- **Box, "PACT Vertical Narrative GM edits.docx":** the Experience section (founded January 2021, 25+ years, NREUV's $150M+ in DMV projects over 15 years), the skills list, and the three Prince George's County projects in pre-development.
- **Box, "Gina M Resume - PACT Vertical, LLC.docx":** the service descriptions, Gina's bio, education, awards, and the project experience list.
- **Contact details:** the PACT Vertical address, phone, and email on file.
- **Gina's portrait:** `assets/gina-merritt.jpg`, cropped from the 2026 stage portrait on drginamerritt.net. Swap in a studio headshot if she prefers one (keep it 4:5, about 800×1000).

Nothing else was added.

## When DNS moves to Vercel

Two temporary settings point at `pactvertical.vercel.app` so link previews and emails work before the domain moves. Once pactvertical.com serves from Vercel:

1. In `index.html`, `privacy.html`, and `terms.html`, change the `og:image` and `twitter:image` URLs back to `https://pactvertical.com/assets/og-image.png`.
2. In Vercel → Settings → Environment Variables, delete `SITE_URL`.

## Please confirm before launch

1. **Founding year.** The narrative PDF says January **2020**; your edited narrative (docx) says January **2021**. The site uses 2021.
2. **Office address.** The site shows 9183A Central Avenue, Capitol Heights, MD 20743, but your résumé header says Greenbelt, MD.
3. **Project experience.** These are Gina's career projects (most through NREUV), and the site labels them that way. They are not PACT Vertical contracts.
4. **Unit and cost totals.** The résumé has two conflicting versions (7,500 units / $2B and 3,000 units / $550M), so neither is on the site.
5. **NREUV link.** The site links to https://nreuv.com.
6. **Contact form.** Sends through Brevo once `BREVO_API_KEY` is set in Vercel (see Deploy). Inquiries go to `CONTACT_TO`, default gmerritt@pactvertical.com.

## Still open

- **Four asset descriptions.** The cards show only their titles, because there was no source text for them.

## Changes in v3.3 (2026-11-18): contact form and Brevo email

- Real contact form in the Contact section (name, email, phone, organization, service, message, optional updates opt-in) replacing the mailto button. The email address stays visible as a fallback.
- `api/contact.js` sends an inquiry email to PACT and a branded confirmation to the visitor through Brevo, and optionally adds opted-in visitors to a Brevo list. See Deploy step 5 for the variables.
- Loading, success, and error states. A failed send always shows the error with the email address, never a false success.
- Spam protection (honeypot, time check, rate limit) and validation on both sides.
- Privacy policy updated to describe the form, Brevo, and the optional updates list.

## Changes in v3.2 (2026-11-18): launch readiness

- Leadership section now shows a portrait of Dr. Merritt beside her bio.
- Social share image (`assets/og-image.png`, 1200×630) with Open Graph and Twitter card tags, so links look right in texts, LinkedIn, and Slack.
- Full favicon set: `favicon.ico`, 16/32 px PNGs, Apple touch icon, and a web manifest. Safari and iPhone home screens now get the mark.
- Organization and WebSite structured data (JSON-LD) in the page head.
- `llms.txt` describing the firm for AI assistants, and `robots.txt` now explicitly welcomes AI crawlers.
- Privacy Policy and Terms of Use pages in the site design, linked in the footer. **Please skim both; they are honest boilerplate for a site with no forms or cookies.**
- Vercel Web Analytics script added (cookieless) with a one-line notice in the footer. Needs enabling in the Vercel dashboard (see Deploy).
- Sticky "Contact us" button on phones, shown after the visitor scrolls past the hero and hidden again at the Contact section and footer.
- Text links and footer links have larger tap areas on phones.
- Contrast fix: the muted grey text color darkened from `#6B737B` to `#5A636C` so stat labels, project locations, and the "VERTICAL" wordmark all pass WCAG AA (4.5:1).
- 404 page restyled to match the steel design, with a contact button.
- Extra security headers (Permissions-Policy, HSTS) and `/index.html` redirects to `/`.
- Mobile menu scrolls instead of being cut off on short phone screens.
- Removed the stale "Adding images" instructions (the placeholders are gone).

## Changes in v3.1 (2026-11-18)

- Gina's title is now CEO (was Principal) throughout.
- Leadership updated from drginamerritt.net: "Dr. Gina Merritt, MBA", 30+ years in real estate, $2B+ in deals, $310M+ raised since 2021, 800+ affordable units and 19 buildings across D.C., MD, and OH, Bronx and Wall Street background, Inc. 5000 (#730 nationally, #12 in D.C.), and the DCRE Pioneer Award. Added a link to drginamerritt.net.
- Added DesignDomain LLC (design services, designdomainllc.com, as listed on drginamerritt.net) to the Affiliates box.
- Added NREUV Advisors, LLC to the Affiliates box. It still needs a one-line description and a website link if it has one.

- Real photography replaces all drawn graphics. The steel-beam drawing in the hero and the bar chart in Verticality are gone.
  - Hero: looking up at a steel-framed tower (`assets/hero-tower.jpg`), revealed upward once on load and then still.
  - Full-width band after Services: aerial of a project team on a concrete deck (`assets/site-crew.jpg`, Scott Blake on Unsplash, free license). Replaced the earlier rebar aerial (`assets/site-aerial.jpg`, kept in the folder).
  - Verticality: wood-framed walls rising (`assets/framing.jpg`).
  - Mission: crew on scaffolding behind a graphite overlay (`assets/crew-scaffold.jpg`).
- Construction photos are toned to steel grey so they match the palette.
- Checked at 1440, 1280, 820, 390, and 360 px widths. Nothing overflows on phones.

**Photo sources:** all from Pexels (free license, no attribution required): d-goug, njeromin, enginakyurt, rois-martin. One more (mdrasel, rebar crew) was supplied but not used.

## Changes in v3.0 (steel redesign)

- New look: light brushed-steel and graphite instead of dark red. Logo maroon is now used only as an accent (buttons, the tallest beam, labels). No glows or gradient effects.
- New hero: steel I-beam columns rise like a building going up, girders span across them, and the logo mark draws itself on top of the tallest (maroon) column.
- Graphite bands for the skills ticker, the mission statement, and the footer.
- Experience section uses the original-color logo again (light background).
- Kept: the rising title, the rotating "We are your…" words, count-up stats, card hover lift, the animated Verticality chart, and scroll reveals.

## Changes in v2.2

- Removed the moving squares and the grid from the hero background. It is now a still, smooth dark-to-maroon glow. All other motion is unchanged.

## Changes in v2.1

- Calmer hero background: the grid is still, there are fewer nodes, they drift much more slowly, and the links between them are fainter. The mission band grid no longer moves either.
- The Experience logo no longer sits on a white panel. It uses a new light-on-dark version, `assets/pact-vertical-logo-dark.png`, with white "PACT", light grey "VERTICAL", and lit maroon ring text. The squares stay the original colors.

## Changes in v2.0 (redesign)

- Dark, modern, high-tech look in the logo colors: near-black backgrounds, logo maroon (`#882B2B`) with a lit maroon (`#C2413F`) for glows, and the logo greys.
- Animated hero: a live "blueprint" of logo-style nodes rising and linking (they react to the cursor), the logo mark drawing itself, the "PACT Vertical" title rising in, and a rotating word (Partners, Advisors, Contractors, Technicians).
- Scrolling skills ticker, count-up stats, cards that light up under the cursor, a tilting logo panel, Verticality bars and a trend line that animate on scroll, a moving grid in the mission band, and a scroll-progress bar.
- New fonts: Manrope, plus JetBrains Mono for labels. The wordmark stays Bodoni Moda.
- All motion turns off for visitors who set "reduce motion" on their device.

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

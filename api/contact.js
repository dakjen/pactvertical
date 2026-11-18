// PACT Vertical contact form handler (Vercel serverless, Node 18+).
// Sends two emails through Brevo: an inquiry notification to PACT and a confirmation to the visitor.
// Optionally adds the visitor to a Brevo contact list when they tick the opt-in box.
//
// Env vars (set in Vercel → Settings → Environment Variables):
//   BREVO_API_KEY        required. Brevo → SMTP & API → API keys
//   CONTACT_TO           inbox(es) that receive inquiries, comma-separated. Default: gmerritt@pactvertical.com
//   BREVO_SENDER_EMAIL   a sender verified in Brevo. Default: no-reply@pactvertical.com
//   BREVO_SENDER_NAME    Default: PACT Vertical
//   BREVO_LIST_ID        optional. Numeric list id for the "keep me updated" opt-in. Omit to disable.
//   SITE_URL             where email images and links point. Default https://pactvertical.com (set to the vercel.app URL until DNS moves)

const BREVO = 'https://api.brevo.com/v3';
const TO = (process.env.CONTACT_TO || 'gmerritt@pactvertical.com').split(',').map(s => s.trim()).filter(Boolean);
const SENDER = { name: process.env.BREVO_SENDER_NAME || 'PACT Vertical', email: process.env.BREVO_SENDER_EMAIL || 'no-reply@pactvertical.com' };
const LIST_ID = Number(process.env.BREVO_LIST_ID) || 0;
const FALLBACK = 'gmerritt@pactvertical.com';
const SITE = (process.env.SITE_URL || 'https://pactvertical.com').replace(/\/$/, '');

const PROJECT_TYPES = ['Development Management', 'Design Management', 'Construction Management', 'Not sure yet'];
const LIMITS = { name: 120, email: 254, phone: 40, organization: 160, message: 4000 };

// Best-effort per-IP rate limit (per warm instance). 5 submissions per 10 minutes.
const hits = new Map();
function limited(ip) {
  const now = Date.now(), win = 10 * 60 * 1000;
  const arr = (hits.get(ip) || []).filter(t => now - t < win);
  arr.push(now);
  hits.set(ip, arr);
  if (hits.size > 5000) hits.clear();
  return arr.length > 5;
}

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clean = (v, max) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, max);
const isEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e) && !/[\r\n]/.test(e);

function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') { try { return JSON.parse(req.body); } catch { return {}; } }
  return {};
}

async function brevo(path, payload) {
  const r = await fetch(BREVO + path, {
    method: 'POST',
    headers: { 'api-key': process.env.BREVO_API_KEY, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!r.ok) {
    const text = await r.text().catch(() => '');
    throw new Error(`Brevo ${path} ${r.status}: ${text.slice(0, 300)}`);
  }
  return r.status === 204 ? null : r.json().catch(() => null);
}

/* ---------- email templates (brand: steel + maroon) ---------- */
function shell(title, inner) {
  return `<!doctype html><html><body style="margin:0;background:#E6E9EC;font-family:Manrope,Helvetica,Arial,sans-serif;color:#444B52">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#E6E9EC;padding:32px 16px"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#F4F5F6;border:1px solid #C9CFD5;border-top:5px solid #882B2B">
<tr><td style="padding:28px 32px 8px"><img src="${SITE}/assets/pact-lockup.png" width="92" alt="PACT Vertical" style="display:block"></td></tr>
<tr><td style="padding:8px 32px 0;font-family:Menlo,Consolas,monospace;font-size:12px;letter-spacing:.06em;color:#882B2B">${esc(title)}</td></tr>
<tr><td style="padding:12px 32px 32px;font-size:16px;line-height:1.6">${inner}</td></tr>
<tr><td style="padding:18px 32px;background:#2E3338;color:#B4BCC4;font-size:12px;line-height:1.6">PACT Vertical, LLC · 9183A Central Avenue, Capitol Heights, MD 20743 · <a href="tel:+12024600468" style="color:#F4F5F6;text-decoration:none">202-460-0468</a><br>Partners, Advisors, Contractors, Technicians · <a href="https://pactvertical.com" style="color:#F4F5F6">pactvertical.com</a></td></tr>
</table></td></tr></table></body></html>`;
}
const row = (k, v) => `<tr><td style="padding:8px 12px 8px 0;font-family:Menlo,Consolas,monospace;font-size:12px;color:#882B2B;vertical-align:top;white-space:nowrap">${esc(k)}</td><td style="padding:8px 0;color:#1C1F23;vertical-align:top">${v}</td></tr>`;

function internalEmail(d) {
  const inner = `
<h1 style="margin:0 0 16px;font-size:24px;line-height:1.2;color:#1C1F23;letter-spacing:-.02em">New project inquiry from ${esc(d.name)}</h1>
<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-top:2px solid #2E3338;border-bottom:1px solid #C9CFD5;margin:0 0 20px">
${row('Name', esc(d.name))}
${row('Email', `<a href="mailto:${esc(d.email)}" style="color:#882B2B">${esc(d.email)}</a>`)}
${d.phone ? row('Phone', `<a href="tel:${esc(d.phone)}" style="color:#882B2B">${esc(d.phone)}</a>`) : ''}
${d.organization ? row('Organization', esc(d.organization)) : ''}
${row('Service', esc(d.projectType))}
${row('Updates', d.optIn ? 'Yes, asked to be kept updated' : 'No')}
</table>
<p style="margin:0 0 6px;font-family:Menlo,Consolas,monospace;font-size:12px;letter-spacing:.06em;color:#882B2B">MESSAGE</p>
<div style="padding:16px 18px;background:#fff;border:1px solid #C9CFD5;border-left:4px solid #882B2B;white-space:pre-wrap;color:#1C1F23">${esc(d.message)}</div>
<p style="margin:22px 0 0"><a href="mailto:${esc(d.email)}?subject=${encodeURIComponent('Re: your inquiry to PACT Vertical')}" style="display:inline-block;background:#882B2B;color:#fff;text-decoration:none;font-weight:700;padding:12px 20px;border-radius:6px">Reply to ${esc(d.name.split(' ')[0])} &rarr;</a></p>
<p style="margin:18px 0 0;font-size:13px;color:#5A636C">Sent from the contact form on pactvertical.com. Replying to this email goes straight to ${esc(d.email)}.</p>`;
  const text = `New project inquiry from ${d.name}

Name: ${d.name}
Email: ${d.email}
${d.phone ? `Phone: ${d.phone}\n` : ''}${d.organization ? `Organization: ${d.organization}\n` : ''}Service: ${d.projectType}
Updates: ${d.optIn ? 'yes' : 'no'}

Message:
${d.message}

Sent from the contact form on pactvertical.com. Reply to this email to answer them.`;
  return { subject: `New inquiry: ${d.name}${d.organization ? ` (${d.organization})` : ''} · ${d.projectType}`, htmlContent: shell('NEW INQUIRY · PACTVERTICAL.COM', inner), textContent: text };
}

function confirmationEmail(d) {
  const first = esc(d.name.split(' ')[0]);
  const inner = `
<h1 style="margin:0 0 16px;font-size:26px;line-height:1.2;color:#1C1F23;letter-spacing:-.02em">Thank you, ${first}. We have your inquiry.</h1>
<p style="margin:0 0 14px">Our team will review your project and get back to you within two business days. If it is time-sensitive, call us at <a href="tel:+12024600468" style="color:#882B2B;font-weight:700">202-460-0468</a>.</p>
<p style="margin:0 0 6px;font-family:Menlo,Consolas,monospace;font-size:12px;letter-spacing:.06em;color:#882B2B">WHAT YOU SENT</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-top:2px solid #2E3338;border-bottom:1px solid #C9CFD5;margin:0 0 18px">
${row('Service', esc(d.projectType))}
${d.organization ? row('Organization', esc(d.organization)) : ''}
${row('Message', `<span style="white-space:pre-wrap">${esc(d.message)}</span>`)}
</table>
<p style="margin:0 0 14px">With PACT Vertical you have four assets in one: <strong style="color:#1C1F23">Partners, Advisors, Contractors, Technicians.</strong> We evaluate each client's needs and offer an individualized suite of services based on the project size, goals, and budget.</p>
<p style="margin:22px 0 0"><a href="${SITE}/#services" style="display:inline-block;background:#2E3338;color:#fff;text-decoration:none;font-weight:700;padding:12px 20px;border-radius:6px">See our services &rarr;</a></p>
<p style="margin:26px 0 0;color:#1C1F23">Dr. Gina Merritt, MBA<br><span style="color:#5A636C">CEO, PACT Vertical, LLC</span></p>`;
  const text = `Thank you, ${d.name.split(' ')[0]}. We have your inquiry.

Our team will review your project and get back to you within two business days. If it is time-sensitive, call 202-460-0468.

What you sent
Service: ${d.projectType}
${d.organization ? `Organization: ${d.organization}\n` : ''}Message: ${d.message}

Dr. Gina Merritt, MBA
CEO, PACT Vertical, LLC
https://pactvertical.com`;
  return { subject: 'We received your inquiry, PACT Vertical', htmlContent: shell('THANK YOU · PACT VERTICAL', inner), textContent: text };
}

/* ---------- handler ---------- */
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ ok: false, error: 'Method not allowed.' }); }

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
  if (limited(ip)) return res.status(429).json({ ok: false, error: `Too many messages from this connection. Please wait a few minutes or email ${FALLBACK}.` });

  const b = readBody(req);

  // Spam: honeypot filled, or submitted in under 1.5s. Pretend it worked.
  const elapsed = Date.now() - Number(b.t || 0);
  if (b.website || (b.t && elapsed < 1500)) return res.status(200).json({ ok: true });

  const d = {
    name: clean(b.name, LIMITS.name),
    email: clean(b.email, LIMITS.email).toLowerCase(),
    phone: clean(b.phone, LIMITS.phone),
    organization: clean(b.organization, LIMITS.organization),
    projectType: PROJECT_TYPES.includes(b.projectType) ? b.projectType : 'Not sure yet',
    message: String(b.message ?? '').replace(/\r\n?/g, '\n').trim().slice(0, LIMITS.message),
    optIn: b.optIn === true || b.optIn === 'on' || b.optIn === 'true',
  };

  const errors = {};
  if (d.name.length < 2) errors.name = 'Please enter your name.';
  if (!isEmail(d.email)) errors.email = 'Please enter a valid email address.';
  if (d.message.length < 10) errors.message = 'Tell us a little about the project (at least 10 characters).';
  if (Object.keys(errors).length) return res.status(400).json({ ok: false, error: 'Please check the highlighted fields.', fields: errors });

  if (!process.env.BREVO_API_KEY) {
    console.error('BREVO_API_KEY is not set');
    return res.status(503).json({ ok: false, error: `Our contact form is not set up yet. Please email ${FALLBACK}.` });
  }

  // 1) Inquiry to PACT. Reply-To is the visitor so a plain reply reaches them.
  const internal = internalEmail(d);
  try {
    await brevo('/smtp/email', {
      sender: SENDER,
      to: TO.map(email => ({ email })),
      replyTo: { email: d.email, name: d.name },
      subject: internal.subject, htmlContent: internal.htmlContent, textContent: internal.textContent,
      tags: ['contact-form', 'inquiry'],
      headers: { 'X-Mailin-custom': 'pactvertical-contact' },
    });
  } catch (e) {
    console.error(e);
    return res.status(502).json({ ok: false, error: `We could not send your message. Please email ${FALLBACK} directly.` });
  }

  // 2) Confirmation to the visitor. Failure here should not fail the submission.
  const conf = confirmationEmail(d);
  const extras = {};
  try {
    await brevo('/smtp/email', {
      sender: SENDER, to: [{ email: d.email, name: d.name }], replyTo: { email: TO[0], name: 'PACT Vertical' },
      subject: conf.subject, htmlContent: conf.htmlContent, textContent: conf.textContent,
      tags: ['contact-form', 'confirmation'],
    });
  } catch (e) { console.error('confirmation failed', e); extras.confirmation = false; }

  // 3) Optional: add to a Brevo list when they opted in.
  if (d.optIn && LIST_ID) {
    const [first, ...rest] = d.name.split(' ');
    try {
      await brevo('/contacts', { email: d.email, updateEnabled: true, listIds: [LIST_ID], attributes: { FIRSTNAME: first, LASTNAME: rest.join(' '), ORGANIZATION: d.organization, SOURCE: 'pactvertical.com contact form' } });
    } catch (e) { console.error('list add failed', e); extras.list = false; }
  }

  return res.status(200).json({ ok: true, ...extras });
};

// PACT Vertical, site script v3.3 (2026-11-18)
{
  const root = document.documentElement;
  root.classList.add('js');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(pointer: fine)').matches;

  // Footer year
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Mobile nav
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  // Header state + scroll progress
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    const max = root.scrollHeight - root.clientHeight;
    root.style.setProperty('--p', max > 0 ? (window.scrollY / max).toFixed(4) : 0);
    if (header) header.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hide the sticky mobile CTA once the visitor reaches the contact section or footer
  const endZones = [document.getElementById('contact'), document.querySelector('.site-footer')].filter(Boolean);
  if (endZones.length && 'IntersectionObserver' in window) {
    const seen = new Set();
    const zoneIo = new IntersectionObserver(entries => {
      entries.forEach(e => e.isIntersecting ? seen.add(e.target) : seen.delete(e.target));
      root.classList.toggle('cta-off', seen.size > 0);
    }, { rootMargin: '0px 0px -30% 0px' });
    endZones.forEach(z => zoneIo.observe(z));
  }

  // Count-up numbers
  const countUp = el => {
    const end = +el.dataset.count, start = +(el.dataset.from || 0);
    const pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
    if (reduce) { el.textContent = pre + end + suf; return; }
    const t0 = performance.now(), dur = 1600;
    const step = now => {
      const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = pre + Math.round(start + (end - start) * e) + suf;
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  // Scroll reveals (staggered within each parent)
  const revealables = document.querySelectorAll('.reveal, .service');
  const groups = new Map();
  revealables.forEach(el => {
    const p = el.parentElement;
    const i = groups.get(p) || 0;
    el.style.setProperty('--d', (i * 0.08) + 's');
    groups.set(p, i + 1);
  });
  const show = el => {
    el.classList.add('in');
    el.querySelectorAll('[data-count]').forEach(countUp);
    if (el.matches('[data-count]')) countUp(el);
  };
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.18, rootMargin: '0px 0px -40px 0px' });
    revealables.forEach(el => io.observe(el));
  } else {
    revealables.forEach(show);
  }

  // Contact form: client validation, loading state, success and error states
  const form = document.getElementById('contact-form');
  if (form) {
    const status = document.getElementById('cf-status');
    const success = document.getElementById('contact-success');
    const submit = document.getElementById('cf-submit');
    const tField = document.getElementById('cf-t');
    const FALLBACK = 'gmerritt@pactvertical.com';
    const stamp = () => { tField.value = String(Date.now()); };
    stamp();

    const fields = {
      name: { el: form.elements.name, msg: 'Please enter your name.', ok: v => v.trim().length >= 2 },
      email: { el: form.elements.email, msg: 'Please enter a valid email address.', ok: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) },
      message: { el: form.elements.message, msg: 'Tell us a little about the project (at least 10 characters).', ok: v => v.trim().length >= 10 },
    };
    const setError = (key, msg) => {
      const f = fields[key]; if (!f) return;
      f.el.closest('.field').classList.toggle('invalid', !!msg);
      f.el.setAttribute('aria-invalid', msg ? 'true' : 'false');
      const box = document.getElementById(f.el.id + '-error'); if (box) box.textContent = msg || '';
    };
    const validate = () => {
      let first = null;
      Object.entries(fields).forEach(([k, f]) => {
        const bad = !f.ok(f.el.value);
        setError(k, bad ? f.msg : '');
        if (bad && !first) first = f.el;
      });
      return first;
    };
    Object.entries(fields).forEach(([k, f]) => f.el.addEventListener('input', () => { if (f.ok(f.el.value)) setError(k, ''); }));

    const showError = html => { status.className = 'form-status is-error'; status.innerHTML = html; };
    const fallbackLink = `<a href="mailto:${FALLBACK}?subject=Project%20inquiry%20via%20pactvertical.com">${FALLBACK}</a>`;

    form.addEventListener('submit', async e => {
      e.preventDefault();
      status.className = 'form-status'; status.textContent = '';
      const firstBad = validate();
      if (firstBad) { firstBad.focus(); return; }

      const data = Object.fromEntries(new FormData(form).entries());
      data.optIn = form.elements.optIn.checked;
      submit.disabled = true; submit.classList.add('busy');
      try {
        const ctrl = new AbortController(); const timer = setTimeout(() => ctrl.abort(), 20000);
        const r = await fetch(form.action, { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify(data), signal: ctrl.signal });
        clearTimeout(timer);
        let body = {}; try { body = await r.json(); } catch {}
        if (r.ok && body.ok) {
          form.hidden = true; success.hidden = false; success.focus();
          form.reset(); stamp();
          return;
        }
        if (body.fields) { Object.entries(body.fields).forEach(([k, m]) => setError(k, m)); const f = Object.keys(body.fields)[0]; fields[f] && fields[f].el.focus(); }
        showError((body.error || 'Something went wrong and your message was not sent.') + (/@/.test(body.error || '') ? '' : ` Please email ${fallbackLink} instead.`));
      } catch (err) {
        showError(`We could not reach our server, so your message was not sent. Please email ${fallbackLink} instead.`);
      } finally {
        submit.disabled = false; submit.classList.remove('busy');
      }
    });

    const again = document.getElementById('cf-again');
    if (again) again.addEventListener('click', () => { success.hidden = true; form.hidden = false; stamp(); form.elements.name.focus(); });
  }

  // Cursor glow + card spotlight + logo tilt + magnetic buttons
  if (fine && !reduce) {
    const glow = document.querySelector('.cursor-glow');
    window.addEventListener('pointermove', e => {
      if (glow) { glow.style.setProperty('--cx', e.clientX + 'px'); glow.style.setProperty('--cy', e.clientY + 'px'); }
    }, { passive: true });

    document.querySelectorAll('.glow-card').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });

    document.querySelectorAll('.tilt').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        el.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });

    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('pointermove', e => {
        const r = btn.getBoundingClientRect();
        btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .18}px, ${(e.clientY - r.top - r.height / 2) * .28}px)`;
      });
      btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
    });
  }
}

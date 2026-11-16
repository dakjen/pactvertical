// PACT Vertical, site script v2.1 (2026-11-16)
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
  const revealables = document.querySelectorAll('.reveal, .service, .vert-chart');
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

  // Hero canvas: logo-style nodes rising and linking, like a live blueprint
  const canvas = document.querySelector('.hero-canvas');
  if (canvas && !reduce && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, dpr = 1, nodes = [], mouse = { x: -9999, y: -9999 }, running = true;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(34, Math.max(14, W * H / 42000)));
      nodes = Array.from({ length: n }, () => make(Math.random() * H));
    };
    const make = yStart => ({
      x: Math.random() * W,
      y: yStart,
      s: 3 + Math.random() * 5,
      v: .03 + Math.random() * .06,
      red: Math.random() < .35,
      a: .18 + Math.random() * .35
    });
    const LINK = 170;
    const frame = () => {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      for (const p of nodes) {
        p.y -= p.v;
        if (p.y < -20) Object.assign(p, make(H + 20));
      }
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j], dx = a.x - b.x, dy = a.y - b.y, d = Math.hypot(dx, dy);
          if (d < LINK) {
            const red = a.red && b.red;
            ctx.strokeStyle = red ? `rgba(194,65,63,${(1 - d / LINK) * .3})` : `rgba(156,156,156,${(1 - d / LINK) * .12})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            // right-angle links, like the logo's square edges
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const p of nodes) {
        const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        const boost = dm < 160 ? (1 - dm / 160) * .5 : 0;
        const s = p.s * (1 + boost * .9);
        ctx.fillStyle = p.red ? `rgba(194,65,63,${Math.min(1, p.a + boost)})` : `rgba(156,156,156,${Math.min(1, p.a * .8 + boost)})`;
        ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
        if (p.red && p.s > 6) {
          ctx.strokeStyle = `rgba(194,65,63,${p.a * .5})`;
          ctx.strokeRect(p.x - s * 2.2, p.y - s * 2.2, s * 4.4, s * 4.4);
        }
      }
      requestAnimationFrame(frame);
    };
    window.addEventListener('resize', resize);
    canvas.parentElement.addEventListener('pointermove', e => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    canvas.parentElement.addEventListener('pointerleave', () => { mouse.x = mouse.y = -9999; });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([e]) => {
        const was = running; running = e.isIntersecting;
        if (running && !was) requestAnimationFrame(frame);
      }).observe(canvas);
    }
    resize();
    requestAnimationFrame(frame);
  }
}

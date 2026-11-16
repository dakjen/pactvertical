// PACT Vertical, site script v1.0 (2026-11-16)
document.documentElement.classList.add('js');

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

// Footer year
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

// Reveal on scroll
const targets = document.querySelectorAll('.reveal, .vert-bars');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  targets.forEach(t => io.observe(t));
} else {
  targets.forEach(t => t.classList.add('in'));
}

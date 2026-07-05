/* CITY GYM BRNO — main.js */

// 1. Nav scroll
const nav = document.getElementById('nav');
const onScroll = () => nav?.classList.toggle('is-scrolled', window.scrollY > 50);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// 2. Active link
const page = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__menu a, .nav__drawer a').forEach(a => {
  if (a.getAttribute('href') === page) a.classList.add('active');
});

// 3. Hamburger / drawer
const burger = document.querySelector('.nav__burger');
const drawer = document.querySelector('.nav__drawer');
const veil   = document.querySelector('.nav__veil');

const openD  = () => { burger.classList.add('is-open'); drawer.classList.add('is-open'); veil.classList.add('is-open'); document.body.style.overflow = 'hidden'; };
const closeD = () => { burger.classList.remove('is-open'); drawer.classList.remove('is-open'); veil.classList.remove('is-open'); document.body.style.overflow = ''; };

burger?.addEventListener('click', () => drawer.classList.contains('is-open') ? closeD() : openD());
veil?.addEventListener('click', closeD);
document.querySelectorAll('.nav__drawer a').forEach(a => a.addEventListener('click', closeD));

// 4. Scroll reveal
// Elements inside .pg-hero use CSS animations (hIn/hInR) — skip them here
// so the IntersectionObserver doesn't compete with the animations.
const srEls = [...document.querySelectorAll('.sr')].filter(el => !el.closest('.pg-hero'));
if (srEls.length) {
  const srObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); srObs.unobserve(e.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -48px 0px' });
  srEls.forEach(el => srObs.observe(el));
}

// 5. Underline draw
const udEls = document.querySelectorAll('.u-draw');
if (udEls.length) {
  const udObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); udObs.unobserve(e.target); } });
  }, { threshold: 0.6 });
  udEls.forEach(el => udObs.observe(el));
}

// 6. Counters
function runCtr(el) {
  const target = +el.dataset.target;
  const dur = 1600;
  const t0 = performance.now();
  const tick = now => {
    const p = Math.min((now - t0) / dur, 1);
    el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
const ctrEls = document.querySelectorAll('.ctr');
if (ctrEls.length) {
  const ctrObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { runCtr(e.target); ctrObs.unobserve(e.target); } });
  }, { threshold: 0.6 });
  ctrEls.forEach(el => ctrObs.observe(el));
}

// 7. Parallax
const pxEls = document.querySelectorAll('[data-px]');
if (pxEls.length && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const doPx = () => pxEls.forEach(el => {
    const r = el.getBoundingClientRect();
    el.style.transform = `translateY(${(r.top + r.height / 2 - innerHeight / 2) * +(el.dataset.px || .25)}px)`;
  });
  window.addEventListener('scroll', doPx, { passive: true });
  doPx();
}

// 8. Mobile parallax for .s--intro
// background-attachment:fixed is broken on iOS Safari. On mobile/tablet we use
// JS to shift background-position-y on scroll, recreating the parallax feel.
const introSec = document.querySelector('.s--intro');
if (introSec && !matchMedia('(prefers-reduced-motion:reduce)').matches) {
  const introMq = matchMedia('(max-width:1024px)');
  const doIntroParallax = () => {
    if (!introMq.matches) return;
    const rect = introSec.getBoundingClientRect();
    const offset = (rect.top + rect.height / 2 - innerHeight / 2) * 0.28;
    introSec.style.backgroundPositionY = `calc(35% + ${offset}px)`;
  };
  window.addEventListener('scroll', doIntroParallax, { passive: true });
  introMq.addEventListener('change', doIntroParallax);
  doIntroParallax();
}

// 9. FAQ
document.querySelectorAll('.faq-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const ans = btn.nextElementSibling;
    const open = btn.classList.contains('is-open');
    document.querySelectorAll('.faq-btn.is-open').forEach(b => { b.classList.remove('is-open'); b.nextElementSibling.classList.remove('is-open'); });
    if (!open) { btn.classList.add('is-open'); ans.classList.add('is-open'); }
  });
});

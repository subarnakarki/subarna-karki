(function () {
  'use strict';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- year ---- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---- mobile menu ---- */
  const menuBtn = document.getElementById('menu-btn');
  const menu = document.getElementById('mobile-menu');
  const iconOpen = document.getElementById('icon-open');
  const iconClose = document.getElementById('icon-close');
  function setMenu(open) {
    menu.classList.toggle('open', open);
    iconOpen.classList.toggle('hidden', open);
    iconClose.classList.toggle('hidden', !open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  menuBtn.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
  document.querySelectorAll('.mobile-link').forEach(function (l) {
    l.addEventListener('click', function () { setMenu(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('open')) { setMenu(false); menuBtn.focus(); }
  });

  /* ---- navbar background + active link ----
     A link is active when its section crosses a line 35% down the screen, so tall
     sections (Projects, Experience) count too; at the very bottom the last one wins. */
  const navbar = document.getElementById('navbar');
  const navClasses = ['bg-navy-900/85', 'backdrop-blur-lg', 'border-b', 'border-slate-500/10'];
  const links = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
  const tracked = links.map(function (l) {
    return { link: l, section: document.getElementById((l.getAttribute('href') || '').slice(1)) };
  }).filter(function (t) { return t.section; });

  let ticking = false;
  function update() {
    ticking = false;
    const y = window.scrollY;
    navClasses.forEach(function (c) { navbar.classList.toggle(c, y > 20); });

    const line = window.innerHeight * 0.35;
    const atBottom = window.innerHeight + y >= document.documentElement.scrollHeight - 4;
    let current = null;
    tracked.forEach(function (t) {
      const r = t.section.getBoundingClientRect();
      if (r.top <= line && r.bottom > line) current = t;
    });
    if (atBottom && tracked.length) current = tracked[tracked.length - 1];
    tracked.forEach(function (t) {
      const on = t === current;
      t.link.classList.toggle('active', on);
      if (on) t.link.setAttribute('aria-current', 'true'); else t.link.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener('resize', update);
  update();

  /* ---- hero stat count-up, once on load (the final values are already in the HTML) ---- */
  if (!reduceMotion) {
    document.querySelectorAll('[data-count]').forEach(function (el) {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const decimals = parseInt(el.dataset.decimals || '0', 10);
      const dur = 1200;
      const delay = 600;
      let start = null;
      function fmt(v) {
        return v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
      }
      function step(ts) {
        if (!start) start = ts;
        const p = Math.min((ts - start) / dur, 1);
        el.textContent = fmt(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      }
      el.textContent = fmt(0);
      setTimeout(function () { requestAnimationFrame(step); }, delay);
    });
  }

  /* ---- image lightbox ---- */
  (function () {
    const galleries = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox-gallery]'));
    const lb = document.getElementById('lightbox');
    if (!galleries.length || !lb) return;
    const lbImg = lb.querySelector('.lb-img');
    const lbCap = lb.querySelector('.lb-caption');
    const btnClose = lb.querySelector('.lb-close');
    const btnPrev = lb.querySelector('.lb-prev');
    const btnNext = lb.querySelector('.lb-next');
    let figures = [];
    let current = 0;
    let opener = null;

    function show(i) {
      current = (i + figures.length) % figures.length;
      const fig = figures[current];
      const img = fig.querySelector('img');
      const link = fig.querySelector('a');
      lbImg.src = link ? link.getAttribute('href') : img.src;
      lbImg.alt = img.alt;
      lbCap.textContent = fig.getAttribute('data-caption') || '';
    }
    function open(i, trigger) {
      opener = trigger;
      show(i);
      lb.classList.add('open');
      lb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      btnClose.focus();
    }
    function close() {
      lb.classList.remove('open');
      lb.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (opener) opener.focus();
    }

    galleries.forEach(function (gallery) {
      const galleryFigures = Array.prototype.slice.call(gallery.querySelectorAll('figure')).filter(function (fig) {
        return Boolean(fig.querySelector('img'));
      });
      galleryFigures.forEach(function (fig, i) {
        fig.addEventListener('click', function (e) {
          e.preventDefault();
          figures = galleryFigures;
          open(i, fig.querySelector('a') || fig);
        });
      });
    });
    btnClose.addEventListener('click', close);
    btnPrev.addEventListener('click', function (e) { e.stopPropagation(); show(current - 1); });
    btnNext.addEventListener('click', function (e) { e.stopPropagation(); show(current + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(current - 1);
      else if (e.key === 'ArrowRight') show(current + 1);
      else if (e.key === 'Tab') {
        // keep focus inside the viewer
        const f = [btnClose, btnPrev, btnNext];
        const idx = f.indexOf(document.activeElement);
        e.preventDefault();
        f[(idx + (e.shiftKey ? f.length - 1 : 1)) % f.length].focus();
      }
    });
  })();
})();

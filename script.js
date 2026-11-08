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
      function closeMenu() {
        menu.classList.remove('open');
        iconOpen.classList.remove('hidden');
        iconClose.classList.add('hidden');
      }
      menuBtn.addEventListener('click', function () {
        const open = menu.classList.toggle('open');
        iconOpen.classList.toggle('hidden', open);
        iconClose.classList.toggle('hidden', !open);
      });
      document.querySelectorAll('.mobile-link').forEach(function (l) {
        l.addEventListener('click', closeMenu);
      });

      /* ---- navbar bg on scroll ---- */
      const navbar = document.getElementById('navbar');
      function onScroll() {
        if (window.scrollY > 20) {
          navbar.classList.add('bg-navy-900/80', 'backdrop-blur-lg', 'border-b', 'border-slate-500/10', 'shadow-lg', 'shadow-navy-900/50');
        } else {
          navbar.classList.remove('bg-navy-900/80', 'backdrop-blur-lg', 'border-b', 'border-slate-500/10', 'shadow-lg', 'shadow-navy-900/50');
        }
      }
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });

      /* ---- animated role text ---- */
      const roles = ['Senior SDET', 'Test Automation Architect', 'AI-Assisted Testing', 'CI/CD Quality Gates'];
      const roleEl = document.getElementById('role');
      if (reduceMotion) {
        roleEl.textContent = roles[0];
      } else {
        let ri = 0, ci = 0, deleting = false;
        function type() {
          const word = roles[ri];
          roleEl.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++);
          let delay = deleting ? 40 : 75;
          if (!deleting && ci === word.length + 1) { deleting = false; delay = 1900; setTimeout(function () { deleting = true; type(); }, delay); return; }
          if (deleting && ci === 0) { deleting = false; ri = (ri + 1) % roles.length; delay = 350; }
          setTimeout(type, delay);
        }
        type();
      }

      /* ---- scroll reveal ---- */
      const revealEls = document.querySelectorAll('.reveal');
      if ('IntersectionObserver' in window && !reduceMotion) {
        const io = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) {
              // stagger siblings a touch
              e.target.style.transitionDelay = (e.target.dataset.delay || '0') + 'ms';
              e.target.classList.add('visible');
              io.unobserve(e.target);
            }
          });
        }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
        revealEls.forEach(function (el, i) { io.observe(el); });
      } else {
        revealEls.forEach(function (el) { el.classList.add('visible'); });
      }

      /* ---- active nav link on scroll (scrollspy) ---- */
      const sections = ['home', 'about', 'expertise', 'experience', 'projects', 'education', 'photography', 'contact'];
      const linkMap = {};
      document.querySelectorAll('.nav-link').forEach(function (l) {
        const id = (l.getAttribute('href') || '').replace('#', '');
        if (id) linkMap[id] = l;
      });
      if ('IntersectionObserver' in window) {
        const spy = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) {
              Object.values(linkMap).forEach(function (l) { l.classList.remove('active'); });
              const active = linkMap[e.target.id];
              if (active) active.classList.add('active');
            }
          });
        }, { threshold: 0.4 });
        sections.forEach(function (id) { const s = document.getElementById(id); if (s) spy.observe(s); });
      }

      /* ---- animated stat counters ---- */
      function animateCount(el) {
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const decimals = parseInt(el.dataset.decimals || '0', 10);
        const dur = 1400;
        let start = null;
        function step(ts) {
          if (!start) start = ts;
          const p = Math.min((ts - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = (target * eased).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      }
      const counters = document.querySelectorAll('[data-count]');
      if ('IntersectionObserver' in window && !reduceMotion) {
        const cio = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); }
          });
        }, { threshold: 0.6 });
        counters.forEach(function (c) { cio.observe(c); });
      } else {
        counters.forEach(function (c) { c.textContent = Number(c.dataset.count).toLocaleString('en-US') + (c.dataset.suffix || ''); });
      }

      /* ---- expertise card spotlight ---- */
      document.querySelectorAll('.expertise-card').forEach(function (card) {
        card.addEventListener('pointermove', function (ev) {
          const r = card.getBoundingClientRect();
          card.style.setProperty('--mx', (ev.clientX - r.left) + 'px');
          card.style.setProperty('--my', (ev.clientY - r.top) + 'px');
        });
      });

      /* ---- lightweight floating circuit/particle canvas ---- */
      if (!reduceMotion) {
        const canvas = document.getElementById('bg-canvas');
        const ctx = canvas.getContext('2d');
        let w, h, dpr, particles = [], raf = null, running = true;

        function resize() {
          dpr = Math.min(window.devicePixelRatio || 1, 2);
          w = window.innerWidth;
          h = window.innerHeight;
          canvas.style.width = w + 'px';
          canvas.style.height = h + 'px';
          canvas.width = w * dpr;
          canvas.height = h * dpr;
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          // density scales with viewport but capped for CPU
          const count = Math.min(Math.floor((w * h) / 26000), 70);
          particles = [];
          for (let i = 0; i < count; i++) {
            particles.push({
              x: Math.random() * w,
              y: Math.random() * h,
              vx: (Math.random() - 0.5) * 0.28,
              vy: (Math.random() - 0.5) * 0.28,
              r: Math.random() * 1.6 + 0.6,
            });
          }
        }

        const LINK_DIST = 130;
        function draw() {
          if (!running) return;
          ctx.clearRect(0, 0, w, h);
          for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > w) p.vx *= -1;
            if (p.y < 0 || p.y > h) p.vy *= -1;

            // links
            for (let j = i + 1; j < particles.length; j++) {
              const q = particles[j];
              const dx = p.x - q.x, dy = p.y - q.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < LINK_DIST) {
                const a = (1 - dist / LINK_DIST) * 0.5;
                ctx.strokeStyle = 'rgba(94, 234, 212,' + a * 0.5 + ')';
                ctx.lineWidth = 0.6;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(q.x, q.y);
                ctx.stroke();
              }
            }
            // node
            ctx.fillStyle = 'rgba(34, 211, 238, 0.7)';
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
          }
          raf = requestAnimationFrame(draw);
        }

        function start() { if (!running) { running = true; draw(); } }
        function stop() { running = false; if (raf) cancelAnimationFrame(raf); }

        resize();
        draw();
        let rt;
        window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(resize, 200); });
        document.addEventListener('visibilitychange', function () {
          if (document.hidden) stop(); else start();
        });
      }

      /* ---- photography lightbox ---- */
      (function () {
        const figures = Array.prototype.slice.call(document.querySelectorAll('#photo-track .photo'));
        const lb = document.getElementById('lightbox');
        if (!figures.length || !lb) return;
        const lbImg = lb.querySelector('.lb-img');
        const lbCap = lb.querySelector('.lb-caption');
        const btnClose = lb.querySelector('.lb-close');
        const btnPrev = lb.querySelector('.lb-prev');
        const btnNext = lb.querySelector('.lb-next');
        let current = 0;

        function show(i) {
          current = (i + figures.length) % figures.length;
          const fig = figures[current];
          const img = fig.querySelector('img');
          lbImg.src = img.src;
          lbImg.alt = img.alt;
          lbCap.textContent = fig.getAttribute('data-caption') || '';
        }
        function open(i) {
          show(i);
          lb.classList.add('open');
          lb.setAttribute('aria-hidden', 'false');
          document.body.style.overflow = 'hidden';
        }
        function close() {
          lb.classList.remove('open');
          lb.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        }

        figures.forEach(function (fig, i) {
          fig.addEventListener('click', function () { open(i); });
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
        });
      })();

      /* ---- photography carousel controls ---- */
      (function () {
        const track = document.getElementById('photo-track');
        if (!track) return;
        const prev = document.querySelector('.car-prev');
        const next = document.querySelector('.car-next');
        if (!prev || !next) return;

        function step() {
          const first = track.querySelector('.photo');
          if (!first) return track.clientWidth * 0.8;
          const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || '20') || 20;
          return first.getBoundingClientRect().width + gap;
        }
        function updateButtons() {
          const maxScroll = track.scrollWidth - track.clientWidth - 8;
          prev.disabled = track.scrollLeft <= 8;
          next.disabled = track.scrollLeft >= maxScroll;
        }
        prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
        next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); });
        track.addEventListener('scroll', updateButtons, { passive: true });
        window.addEventListener('resize', updateButtons);
        updateButtons();
      })();
    })();

/* ============================================================
   SHIVANI KOLALA — Portfolio App
   Handles: design randomization, scroll animations,
            typewriter effect, mobile nav
   ============================================================ */

(function () {
  'use strict';

  /* ── helpers ── */
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  const q    = sel => document.querySelector(sel);
  const qa   = sel => [...document.querySelectorAll(sel)];

  /* ============================================================
     1. DESIGN RANDOMIZATION
     ============================================================ */
  const THEMES = [
    { id: 'dark',  label: 'Dark Mode' },
    { id: 'blue',  label: 'Blue Tech' },
    { id: 'warm',  label: 'Warm Professional' },
    { id: 'green', label: 'Minimalist Green' },
  ];
  const LAYOUTS = [
    { id: 'left',   label: 'Left-aligned' },
    { id: 'center', label: 'Centered' },
    { id: 'split',  label: 'Split-screen' },
    { id: 'card',   label: 'Card layout' },
  ];
  const FONTS = [
    { id: 'sans',    label: 'Modern Sans-serif' },
    { id: 'mono',    label: 'Geometric Mono' },
    { id: 'classic', label: 'Classic Serif' },
  ];
  const ANIMATIONS = [
    { id: 'fade',  label: 'Fade In' },
    { id: 'slide', label: 'Slide' },
    { id: 'scale', label: 'Scale' },
  ];
  const PATTERNS = [
    { id: 'dot',   label: 'Dot Grid' },
    { id: 'geo',   label: 'Geometric' },
    { id: 'grad',  label: 'Gradient' },
    { id: 'noise', label: 'Subtle Overlay' },
  ];

  const chosen = {
    theme:     pick(THEMES),
    layout:    pick(LAYOUTS),
    font:      pick(FONTS),
    animation: pick(ANIMATIONS),
    pattern:   pick(PATTERNS),
  };

  /* Apply classes to <body> */
  const body = document.body;
  body.classList.add(
    'theme-'  + chosen.theme.id,
    'layout-' + chosen.layout.id,
    'font-'   + chosen.font.id,
    'anim-'   + chosen.animation.id,
    'pat-'    + chosen.pattern.id,
  );

  /* Display chosen theme in footer */
  const themeEl = q('#themeDisplay');
  if (themeEl) {
    themeEl.textContent =
      `Design: ${chosen.theme.label} · ${chosen.layout.label} · ` +
      `${chosen.font.label} · ${chosen.animation.label} · ${chosen.pattern.label}`;
  }

  /* ============================================================
     2. TYPEWRITER EFFECT
     ============================================================ */
  const phrases = [
    'Building AI-powered products that scale.',
    'Turning LLM potential into product reality.',
    'From concept to commercialization — at speed.',
    'Product leader at the frontier of AI & CX.',
  ];

  function runTypewriter(el) {
    if (!el) return;
    let phraseIdx = 0;
    let charIdx   = 0;
    let deleting  = false;
    const cursor  = document.createElement('span');
    cursor.className = 'tw-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    el.parentNode.insertBefore(cursor, el.nextSibling);

    function tick() {
      const phrase = phrases[phraseIdx];
      if (!deleting) {
        charIdx++;
        el.textContent = phrase.slice(0, charIdx);
        if (charIdx === phrase.length) {
          setTimeout(() => { deleting = true; tick(); }, 2200);
          return;
        }
        setTimeout(tick, 55);
      } else {
        charIdx--;
        el.textContent = phrase.slice(0, charIdx);
        if (charIdx === 0) {
          deleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
          setTimeout(tick, 400);
          return;
        }
        setTimeout(tick, 28);
      }
    }

    /* Only run typewriter anim variant, else just show first phrase */
    if (chosen.animation.id === 'fade') {
      el.textContent = phrases[0];
    } else {
      setTimeout(tick, 800);
    }
  }

  runTypewriter(q('#heroTagline'));

  /* ============================================================
     3. SCROLL REVEAL
     ============================================================ */
  function initReveal() {
    const items = qa('.reveal');
    if (!items.length) return;

    /* Stagger siblings: each group of siblings gets sequential delay */
    qa('.projects__grid, .skills__grid, .timeline, .about__right').forEach(parent => {
      qa('.reveal', parent).forEach((el, i) => {
        el.style.transitionDelay = (i * 0.1) + 's';
      });
    });

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    items.forEach(el => observer.observe(el));
  }

  /* ============================================================
     4. STICKY NAV — shrink + scroll-aware active links
     ============================================================ */
  function initNav() {
    const nav     = q('#nav');
    const toggle  = q('#navToggle');
    const links   = q('#navLinks');

    /* Scroll: add .scrolled class */
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

    /* Mobile toggle */
    toggle && toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });

    /* Close on link click */
    qa('#navLinks a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle && toggle.classList.remove('open');
        toggle && toggle.setAttribute('aria-expanded', 'false');
      });
    });

    /* Active link highlighting */
    const sections = qa('section[id]');
    const navAnchors = qa('#navLinks a');

    const setActive = () => {
      let current = '';
      sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
      });
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + current
          ? 'var(--accent)' : '';
      });
    };

    window.addEventListener('scroll', setActive, { passive: true });
    setActive();
  }

  /* ============================================================
     5. PROJECT CARD — keyboard accessibility
     ============================================================ */
  function initCards() {
    qa('.project-card[tabindex]').forEach(card => {
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.classList.toggle('focused');
        }
      });
    });
  }

  /* ============================================================
     6. SMOOTH SCROLL POLYFILL (for older browsers)
     ============================================================ */
  function initSmoothScroll() {
    qa('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', e => {
        const id = anchor.getAttribute('href').slice(1);
        const target = document.getElementById(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ============================================================
     7. HERO REVEAL on load
     ============================================================ */
  function initHeroReveal() {
    const heroReveals = qa('.hero .reveal');
    heroReveals.forEach((el, i) => {
      el.style.transitionDelay = (i * 0.12 + 0.2) + 's';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => el.classList.add('in-view'));
      });
    });
  }

  /* ============================================================
     INIT
     ============================================================ */
  document.addEventListener('DOMContentLoaded', () => {
    initHeroReveal();
    initReveal();
    initNav();
    initCards();
    initSmoothScroll();
  });

})();

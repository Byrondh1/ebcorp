/**
 * EB Corp — Main JavaScript
 * Handles: Navigation, AOS scroll reveal, counter animation,
 *          project filtering, mobile menu, WhatsApp tracking
 */

'use strict';

/* ============================================================
   NAVIGATION — Scroll behavior + mobile toggle
============================================================ */
(function initNav() {
  const navbar   = document.getElementById('navbar');
  const toggle   = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (!navbar) return;

  // Scroll class
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Mobile toggle
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close on nav link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        navLinks.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
})();

/* ============================================================
   AOS — Scroll Reveal (vanilla, no library dependency)
============================================================ */
(function initAOS() {
  const elements = document.querySelectorAll('[data-aos]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.aosDelay || '0', 10);
        setTimeout(() => {
          el.classList.add('aos-animate');
        }, delay);
        observer.unobserve(el);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
})();

/* ============================================================
   COUNTER ANIMATION — Stats numbers count up
============================================================ */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      el.textContent = Math.round(easeOut(progress) * target);
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

/* ============================================================
   TAB FILTERING — Works for both portfolio (.project-card)
   and blog grid (.blog-card) pages
============================================================ */
(function initTabFilter() {
  const tabs  = document.querySelectorAll('.tab-btn');
  const cards = document.querySelectorAll('.project-card, .blog-card');
  if (!tabs.length || !cards.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const filter = tab.dataset.tab;

      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-pressed', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-pressed', 'true');

      cards.forEach(card => {
        const category = card.dataset.category;
        const visible  = filter === 'todos' || category === filter || category === 'todos';

        if (visible) {
          card.style.display = '';
          card.classList.remove('aos-animate');
          requestAnimationFrame(() => {
            setTimeout(() => card.classList.add('aos-animate'), 50);
          });
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
})();

/* ============================================================
   HERO PARTICLES — Floating dot particles background
============================================================ */
(function initParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;

  // Skip on mobile for performance
  if (window.matchMedia('(max-width: 768px)').matches) return;

  const COUNT = 30;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < COUNT; i++) {
    const dot = document.createElement('div');
    const size = Math.random() * 3 + 1;
    const x    = Math.random() * 100;
    const y    = Math.random() * 100;
    const dur  = Math.random() * 6 + 4;
    const del  = Math.random() * 4;
    const op   = Math.random() * 0.3 + 0.05;

    Object.assign(dot.style, {
      position:        'absolute',
      width:           `${size}px`,
      height:          `${size}px`,
      borderRadius:    '50%',
      left:            `${x}%`,
      top:             `${y}%`,
      background:      i % 3 === 0 ? '#F5A623' : '#00D4FF',
      opacity:         op,
      animation:       `floatY ${dur}s ease-in-out ${del}s infinite`,
      pointerEvents:   'none',
    });

    fragment.appendChild(dot);
  }

  container.appendChild(fragment);
})();

/* ============================================================
   SMOOTH SCROLL — Anchor links with offset
============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80; // nav height
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ============================================================
   GA4 EVENT TRACKING
   Fires gtag events when gtag is available (production).
   Safe no-op in environments without GA4.
============================================================ */
(function initAnalytics() {
  function gtrack(eventName, params) {
    if (typeof gtag === 'function') {
      gtag('event', eventName, params);
    }
  }

  // --- WhatsApp button clicks ---
  document.querySelectorAll('a[href*="wa.me"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const label = btn.closest('[class*="cta"]') ? 'cta' :
                    btn.classList.contains('whatsapp-fab') ? 'fab' :
                    btn.classList.contains('btn-whatsapp') ? 'inline' : 'other';
      gtrack('whatsapp_click', {
        event_category: 'CTA',
        event_label: label,
        page_path: window.location.pathname
      });
    });
  });

  // --- Contact form submission ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', () => {
      gtrack('form_submit', {
        event_category: 'Contact',
        event_label: 'contact_form',
        page_path: window.location.pathname
      });
    });
  }

  // --- Cotizador step / completion ---
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-step-next], [data-cotizador-submit]');
    if (!btn) return;
    if (btn.dataset.cotizadorSubmit !== undefined) {
      gtrack('cotizador_complete', {
        event_category: 'Cotizador',
        event_label: 'completed'
      });
    } else if (btn.dataset.stepNext !== undefined) {
      gtrack('cotizador_step', {
        event_category: 'Cotizador',
        event_label: `step_${btn.dataset.stepNext || 'next'}`
      });
    }
  });

  // --- Blog scroll depth (50% and 90%) ---
  const article = document.querySelector('.blog-article');
  if (article) {
    const milestones = { 50: false, 90: false };
    window.addEventListener('scroll', () => {
      const rect   = article.getBoundingClientRect();
      const total  = article.offsetHeight;
      const read   = Math.max(0, window.innerHeight - rect.top);
      const pct    = Math.round((read / total) * 100);

      if (!milestones[50] && pct >= 50) {
        milestones[50] = true;
        gtrack('scroll_depth', { event_category: 'Blog', event_label: '50pct', page_path: window.location.pathname });
      }
      if (!milestones[90] && pct >= 90) {
        milestones[90] = true;
        gtrack('scroll_depth', { event_category: 'Blog', event_label: '90pct', page_path: window.location.pathname });
      }
    }, { passive: true });
  }
})();

/* ============================================================
   ACTIVE NAV LINK — Highlight current section on scroll
============================================================ */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length || !navItems.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(link => {
          const active = link.getAttribute('href') === `#${id}`;
          link.style.color = active ? 'white' : '';
          if (active) {
            link.style.setProperty('--link-w', '100%');
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();

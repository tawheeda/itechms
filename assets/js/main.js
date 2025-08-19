// assets/js/main.js
// Site interactions: mobile nav + partner logo auto-scroll

(() => {
  // ===== Mobile navigation =====
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const DESKTOP_MQ = window.matchMedia('(min-width: 901px)');

  if (mobileToggle && mobileMenu) {
    // Ensure accessible linkage and initial state
    if (!mobileMenu.id) mobileMenu.id = 'mobile-menu';
    mobileToggle.setAttribute('aria-controls', mobileMenu.id);
    mobileToggle.setAttribute('aria-expanded', 'false');

    const openMenu = () => {
      mobileMenu.classList.add('is-open');
      mobileToggle.setAttribute('aria-expanded', 'true');
    };

    const closeMenu = () => {
      mobileMenu.classList.remove('is-open');
      mobileToggle.setAttribute('aria-expanded', 'false');
    };

    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('is-open');
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu when switching to desktop layout
    const handleMQ = (e) => { if (e.matches) closeMenu(); };
    if (DESKTOP_MQ.addEventListener) {
      DESKTOP_MQ.addEventListener('change', handleMQ);
    } else {
      // Safari <14
      DESKTOP_MQ.addListener(handleMQ);
    }

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });

    // Close when clicking outside the menu
    document.addEventListener('click', (e) => {
      if (!mobileMenu.classList.contains('is-open')) return;
      const inside = mobileMenu.contains(e.target) || mobileToggle.contains(e.target);
      if (!inside) closeMenu();
    });

    // Close after tapping a link inside the mobile menu
    mobileMenu.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link) closeMenu();
    });
  }

  // ===== Auto-scroll for partner logo strips =====
  const strips = document.querySelectorAll('.scroll-strip');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  strips.forEach((strip) => {
    if (prefersReduced) return;

    let scrollAmount = 0;
    let interval = null;

    const start = () => {
      if (interval) return;
      interval = setInterval(() => {
        scrollAmount += 1;
        strip.scrollTo({ left: scrollAmount });
        if (scrollAmount >= strip.scrollWidth - strip.clientWidth - 2) {
          scrollAmount = 0;
          strip.scrollTo({ left: 0 });
        }
      }, 60);
    };

    const stop = () => {
      if (!interval) return;
      clearInterval(interval);
      interval = null;
    };

    // Pause on hover/touch for user control
    strip.addEventListener('mouseenter', stop);
    strip.addEventListener('mouseleave', start);
    strip.addEventListener('touchstart', stop, { passive: true });
    strip.addEventListener('touchend', start);

    // Kick off after layout settles
    setTimeout(start, 200);
  });
})();

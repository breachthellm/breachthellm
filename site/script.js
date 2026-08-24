(function () {
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    // Elements are never hidden by default in CSS, only JS adds the
    // pre-reveal state below, so doing nothing here just leaves everything
    // in its normal, fully-visible state.
    return;
  }

  var scrollTargets = document.querySelectorAll('.challenges, .how-it-works, .site-footer');

  var observer = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  scrollTargets.forEach(function (el) {
    el.classList.add('reveal');
    observer.observe(el);
  });

  var hero = document.querySelector('.hero');
  if (hero) {
    hero.classList.add('reveal');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        hero.classList.add('is-visible');
      });
    });
  }
})();

(function () {
  var toggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  if (!toggle || !navLinks) return;

  function isOpen() {
    return navLinks.classList.contains('is-open');
  }

  function openMenu() {
    navLinks.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
  }

  function closeMenu() {
    navLinks.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  }

  toggle.addEventListener('click', function () {
    if (isOpen()) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && isOpen()) {
      closeMenu();
      toggle.focus();
    }
  });
})();

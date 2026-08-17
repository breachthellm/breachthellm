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

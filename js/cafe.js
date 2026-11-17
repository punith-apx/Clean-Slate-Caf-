(() => {
  const pageLoader = document.querySelector('#page-loader');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (pageLoader && !reduceMotion) {
    pageLoader.hidden = false;
    window.setTimeout(() => {
      pageLoader.classList.add('page-loader-out');
      window.setTimeout(() => pageLoader.remove(), 360);
    }, 520);
  } else pageLoader?.remove();

  const revealTargets = document.querySelectorAll(
    '.hero-copy, .hero-photo, .story-heading, .story-visual, .menu-top, .menu-feature, .menu-categories, .dish, .favorites-head, .favorite, .experience-copy, .experience-photos, .visit-head, .visit-map, .visit-details, .footer-top'
  );
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealTargets.forEach(item => {
      item.classList.add('reveal-ready');
      revealObserver.observe(item);
    });
  }

  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#nav-links');
  if (toggle && nav) {
    const closeNav = () => {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation');
      nav.classList.remove('open');
    };
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      nav.classList.toggle('open', open);
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNav));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        closeNav();
        toggle.focus();
      }
    });
    document.addEventListener('click', event => {
      if (toggle.getAttribute('aria-expanded') === 'true' && !nav.contains(event.target) && !toggle.contains(event.target)) closeNav();
    });
  }

  const categoryButtons = [...document.querySelectorAll('.category')];
  const dishes = [...document.querySelectorAll('.dish')];
  categoryButtons.forEach(button => button.addEventListener('click', () => {
    const category = button.dataset.category;
    categoryButtons.forEach(item => {
      const selected = item === button;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    dishes.forEach(dish => {
      dish.hidden = category !== 'all' && dish.dataset.group !== category;
    });
  }));

  document.querySelectorAll('img').forEach(image => {
    image.addEventListener('error', () => {
      image.classList.add('image-unavailable');
      image.alt = `${image.alt} (image unavailable)`;
    }, { once: true });
  });
})();

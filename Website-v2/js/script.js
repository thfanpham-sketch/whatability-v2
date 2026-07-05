// What Ability Foundation — shared site behaviour

document.addEventListener('DOMContentLoaded', function () {
  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    // Close mobile nav when a link is clicked
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Events ticker pause/play (accessibility: lets users stop scrolling motion)
  var ticker = document.querySelector('.events-ticker');
  var pauseBtn = document.querySelector('.ticker-pause');
  if (ticker && pauseBtn) {
    pauseBtn.addEventListener('click', function () {
      var paused = ticker.classList.toggle('paused');
      pauseBtn.textContent = paused ? '▶' : '❚❚';
      pauseBtn.setAttribute('aria-label', paused ? 'Play events ticker' : 'Pause events ticker');
    });
  }

  // Highlight current page in nav based on URL
  var here = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a[href]').forEach(function (link) {
    var href = link.getAttribute('href').split('#')[0];
    if (href === here || (here === '' && href === 'index.html')) {
      link.setAttribute('aria-current', 'page');
    }
  });

  // Photo carousels inside experience cards (prev/next arrows + dots + swipe)
  document.querySelectorAll('.event-media').forEach(function (media) {
    var slides = media.querySelectorAll('.carousel-slide');
    if (slides.length <= 1) return;
    var dotsWrap = media.querySelector('.carousel-dots');
    var prevBtn = media.querySelector('.carousel-arrow.prev');
    var nextBtn = media.querySelector('.carousel-arrow.next');
    var index = 0;
    function show(i) {
      index = (i + slides.length) % slides.length;
      slides.forEach(function (s, si) { s.classList.toggle('active', si === index); });
      if (dotsWrap) {
        dotsWrap.querySelectorAll('button').forEach(function (d, di) {
          d.classList.toggle('active', di === index);
        });
      }
    }
    if (prevBtn) prevBtn.addEventListener('click', function (e) { e.preventDefault(); show(index - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function (e) { e.preventDefault(); show(index + 1); });
    if (dotsWrap) {
      dotsWrap.querySelectorAll('button').forEach(function (d, di) {
        d.addEventListener('click', function (e) { e.preventDefault(); show(di); });
      });
    }
    // Touch swipe support (mobile)
    var startX = null;
    media.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    media.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) show(dx < 0 ? index + 1 : index - 1);
      startX = null;
    }, { passive: true });
    show(0);
  });

  // Gentle reveal-on-scroll for cards and sections (skipped for reduced motion)
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced && 'IntersectionObserver' in window) {
    var revealables = document.querySelectorAll('.mission-card, .event-card, .step-card, .quicklink-card, .people-card, .impact-band, .promise-card, .giving-card, .cta-band');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'none';
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealables.forEach(function (el, i) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity .5s ease ' + (i % 4) * 0.06 + 's, transform .5s ease ' + (i % 4) * 0.06 + 's';
      io.observe(el);
    });
  }

  // Simple front-end validation feedback for forms (no backend wired up yet)
  document.querySelectorAll('form[data-demo-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = form.querySelector('.form-note');
      if (note) {
        note.textContent = "Thanks! This is a design preview. Hook this form up to your email or CRM before going live.";
        note.style.display = 'block';
      }
    });
  });
});

(function () {

  /* ── HEADER ─────────────────────────────────────────────────────── */
  function renderHeader() {
    const isCase = window.location.pathname.includes('/cases/');
    const root = isCase ? '../' : '';

    const header = document.createElement('header');
    header.innerHTML = `
      <a class="header-name" href="${root}index.html">
        <img src="${root}images/avatar.png" alt="Богдан Алексеев" class="avatar">
        <span>Богдан Алексеев</span>
      </a>
      <nav>
        <a href="#" class="btn btn-outline">CV</a>
        <a href="https://t.me/bogdan_alekseev" class="btn btn-telegram" target="_blank">Telegram</a>
      </nav>
    `;
    document.body.prepend(header);
  }

  /* ── CURSOR ─────────────────────────────────────────────────────── */
  function initCursor() {
    const cursor = document.createElement('div');
    cursor.id = 'custom-cursor';
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', e => {
      cursor.style.transform = `translate(${e.clientX - 28}px, ${e.clientY - 28}px)`;
    });

    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('mouseenter', () => cursor.classList.add('visible'));
      card.addEventListener('mouseleave', () => cursor.classList.remove('visible'));
    });
  }

  /* ── FLOATING NAV ───────────────────────────────────────────────── */
  function initFloatingNav() {
    const isCase = window.location.pathname.includes('/cases/');
    const nav = document.createElement('div');
    nav.className = 'floating-nav';
    nav.id = 'floating-nav';

    nav.innerHTML = `
      <a href="#" class="btn btn-dark">CV</a>
      <a href="https://t.me/bogdan_alekseev" class="btn btn-telegram" target="_blank">Telegram</a>
    `;

    document.body.appendChild(nav);

    let lastY = window.scrollY;
    window.addEventListener('scroll', () => {
      const currentY = window.scrollY;
      nav.classList.toggle('hidden', currentY > lastY && currentY > 60);
      lastY = currentY;
    }, { passive: true });
  }

  /* ── SCROLL REVEAL ──────────────────────────────────────────────── */
  function initScrollReveal() {
    const cards = document.querySelectorAll('.card');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('card--visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    cards.forEach(card => observer.observe(card));

    document.querySelectorAll('.card-row').forEach(row => {
      row.querySelectorAll('.card').forEach((card, i) => {
        card.style.transitionDelay = (i * 0.12) + 's';
      });
    });
  }

  /* ── INIT ───────────────────────────────────────────────────────── */
  function init() {
    renderHeader();
    initCursor();
    initFloatingNav();
    initScrollReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

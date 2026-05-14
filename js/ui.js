(function () {

  /* ── HEADER ─────────────────────────────────────────────────────── */
  function renderHeader() {
    const isCase = window.location.pathname !== '/' && !window.location.pathname.endsWith('index.html');
    const root = isCase ? '../' : '';

    const header = document.createElement('header');
    header.innerHTML = `
      <a class="header-name" href="/">
        <img src="${root}images/avatar.png" alt="Богдан Алексеев" class="avatar">
        <span>Богдан Алексеев</span>
      </a>
      <nav>
        <a href="https://docs.google.com/document/d/1da54qDzXx4MLuOIPf5lLActD1l6MFjKnCuzuBfiZKY0/edit?usp=sharing" class="btn btn-outline" target="_blank">CV</a>
        <a href="https://t.me/al_bogdan" class="btn btn-telegram" target="_blank">Telegram</a>
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
    const isCase = window.location.pathname !== '/' && !window.location.pathname.endsWith('index.html');
    const nav = document.createElement('div');
    nav.className = 'floating-nav';
    nav.id = 'floating-nav';

    nav.innerHTML = `
      <a href="https://docs.google.com/document/d/1da54qDzXx4MLuOIPf5lLActD1l6MFjKnCuzuBfiZKY0/edit?usp=sharing" class="btn btn-dark" target="_blank">CV</a>
      <a href="https://t.me/al_bogdan" class="btn btn-telegram" target="_blank">Telegram</a>
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
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains('case-block')) {
            entry.target.classList.add('case-block--visible');
          } else {
            entry.target.classList.add('card--visible');
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    document.querySelectorAll('.card, .case-block').forEach(el => observer.observe(el));

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

(function () {

  /* ── HEADER ─────────────────────────────────────────────────────── */
  function renderHeader() {
    const isCase = window.location.pathname !== '/' && !window.location.pathname.endsWith('index.html');
    const root = isCase ? '../' : '';

    const header = document.createElement('header');
    header.innerHTML = `
      <a class="header-name" href="/">
        <img src="${root}images/avatar.webp" alt="Богдан Алексеев" class="avatar">
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

    document.querySelectorAll('.card, .case-next').forEach(card => {
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

  /* ── FOOTER ─────────────────────────────────────────────────────── */
  function renderFooter() {
    const root = (window.location.pathname !== '/' && !window.location.pathname.endsWith('index.html')) ? '../' : '';

    const footer = document.createElement('footer');
    footer.innerHTML = `
      <div class="footer-links">
        <a class="footer-link" href="https://t.me/designfintech" target="_blank">
          <img src="${root}images/icon-df.svg" class="footer-icon" alt="DesignFintech">
          <span class="footer-link-name">@designfintech</span>
        </a>
        <a class="footer-link" href="https://dsgners.ru/bogdan-alekseev" target="_blank">
          <img src="${root}images/icon-dsgners.svg" class="footer-icon" alt="Dsgners">
          <span class="footer-link-name">dsgners.ru</span>
        </a>
        <a class="footer-link" href="https://www.linkedin.com/in/bogdan-al/" target="_blank">
          <img src="${root}images/icon-linkedin.svg" class="footer-icon" alt="LinkedIn">
          <span class="footer-link-name">linkedin</span>
        </a>
      </div>
      <div class="footer-copy">
        <span>© 2026 Bogdan Alekseev</span>
        <span>Moscow, GMT +3</span>
      </div>
    `;
    document.body.appendChild(footer);
  }

  /* ── INIT ───────────────────────────────────────────────────────── */
  function init() {
    renderHeader();
    renderFooter();
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

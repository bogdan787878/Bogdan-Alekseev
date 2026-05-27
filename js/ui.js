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
    header.querySelector('a[href*="docs.google"]').addEventListener('click', () => {
      if (typeof ym === 'function') ym(99984431, 'reachGoal', 'cv_click');
    });
  }

  /* ── HEADER VISIBILITY ──────────────────────────────────────────── */
  function initHeaderVisibility() {
    const hero = document.getElementById('hero');
    if (!hero) {
      // На кейсах хедер всегда виден
      document.querySelector('header')?.classList.add('header--visible');
      return;
    }
    const header = document.querySelector('header');
    const observer = new IntersectionObserver(([entry]) => {
      header.classList.toggle('header--visible', !entry.isIntersecting);
    }, { threshold: 0 });
    observer.observe(hero);
  }

  /* ── CURSOR ─────────────────────────────────────────────────────── */
  function initCursor() {
    const cursor = document.createElement('div');
    cursor.id = 'custom-cursor';
    document.body.appendChild(cursor);

    let mouseX = 0, mouseY = 0, rafId = null;
    document.addEventListener('mousemove', e => {
      mouseX = e.clientX - 28;
      mouseY = e.clientY - 28;
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
          rafId = null;
        });
      }
    }, { passive: true });

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
    nav.querySelector('a[href*="docs.google"]').addEventListener('click', () => {
      if (typeof ym === 'function') ym(99984431, 'reachGoal', 'cv_click');
    });

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
          } else if (entry.target.classList.contains('other-cases-item')) {
            entry.target.classList.add('other-cases-item--visible');
          } else if (entry.target.classList.contains('pub-card')) {
            entry.target.classList.add('pub-card--visible');
          } else if (entry.target.classList.contains('bias-card')) {
            entry.target.classList.add('bias-card--visible');
          } else if (entry.target.classList.contains('book-card')) {
            entry.target.classList.add('book-card--visible');
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

    document.querySelectorAll('.other-cases-item').forEach((el, i) => {
      el.style.transitionDelay = (i * 0.08) + 's';
      observer.observe(el);
    });

    document.querySelectorAll('.pub-card').forEach((el, i) => {
      el.style.transitionDelay = (i * 0.07) + 's';
      observer.observe(el);
    });

    document.querySelectorAll('.bias-card').forEach((el, i) => {
      el.style.transitionDelay = (i * 0.07) + 's';
      observer.observe(el);
    });

    document.querySelectorAll('.book-card').forEach((el, i) => {
      el.style.transitionDelay = (i % 5 * 0.08) + 's';
      observer.observe(el);
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
        <span>Moscow, GMT+3</span>
      </div>
    `;
    document.body.appendChild(footer);
    const goals = {
      'designfintech': 'footer_designfintech',
      'dsgners.ru':    'footer_dsgners',
      'linkedin.com':  'footer_linkedin',
    };
    footer.querySelectorAll('.footer-link').forEach(link => {
      const goal = Object.entries(goals).find(([key]) => link.href.includes(key));
      if (goal) link.addEventListener('click', () => {
        if (typeof ym === 'function') ym(99984431, 'reachGoal', goal[1]);
      });
    });
  }

  /* ── LIKE ───────────────────────────────────────────────────────── */
  function initLike() {
    const isCase = window.location.pathname !== '/' && !window.location.pathname.endsWith('index.html');
    if (!isCase) return;
    if (document.querySelector('.article-main')) return;

    const key = 'like_' + window.location.pathname;
    const countKey = 'likeCount_' + window.location.pathname;
    const trackedKey = 'likeTracked_' + window.location.pathname;

    let liked = localStorage.getItem(key) === '1';
    let count = parseInt(localStorage.getItem(countKey) || '0', 10);
    let tracked = localStorage.getItem(trackedKey) === '1';

    const frame = document.createElement('div');
    frame.className = 'like-frame';
    frame.innerHTML = `
      <button class="like-btn${liked ? ' liked' : ''}" aria-label="Поставить лайк">
        <svg class="like-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
        <span class="like-count">${count}</span>
      </button>
    `;
    document.body.appendChild(frame);

    const btn = frame.querySelector('.like-btn');
    const countEl = frame.querySelector('.like-count');

    const footer = document.querySelector('footer');
    window.addEventListener('scroll', () => {
      const past = window.scrollY + window.innerHeight > document.body.scrollHeight * 0.5;
      frame.classList.toggle('visible', past);
      if (footer) {
        const footerTop = footer.getBoundingClientRect().top;
        const gap = 32;
        if (footerTop < window.innerHeight) {
          frame.style.bottom = (window.innerHeight - footerTop + gap) + 'px';
        } else {
          frame.style.bottom = gap + 'px';
        }
      }
    }, { passive: true });

    btn.addEventListener('click', () => {
      if (liked) {
        liked = false;
        count = Math.max(0, count - 1);
        localStorage.setItem(key, '0');
        localStorage.setItem(countKey, String(count));
        btn.classList.remove('liked');
        countEl.textContent = count;
      } else {
        liked = true;
        count++;
        localStorage.setItem(key, '1');
        localStorage.setItem(countKey, String(count));
        btn.classList.add('liked');
        countEl.textContent = count;
        burstHearts(btn);
        if (!tracked && typeof ym === 'function') {
          tracked = true;
          localStorage.setItem(trackedKey, '1');
          const caseId = window.location.pathname.replace(/\//g, '') || 'index';
          ym(99984431, 'reachGoal', 'like', { case: caseId });
        }
      }
    });
  }

  function burstHearts(btn) {
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const count = 6;
    const spread = 70;
    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      el.className = 'heart-particle';
      el.textContent = '♥';
      const angleDeg = -90 + (-spread / 2 + (i / (count - 1)) * spread);
      const angleRad = angleDeg * Math.PI / 180;
      const dist = 140 + Math.random() * 60;
      el.style.setProperty('--tx', Math.round(Math.cos(angleRad) * dist) + 'px');
      el.style.setProperty('--ty', Math.round(Math.sin(angleRad) * dist) + 'px');
      el.style.left = cx + 'px';
      el.style.top = cy + 'px';
      el.style.animationDelay = (i * 0.05) + 's';
      document.body.appendChild(el);
      el.addEventListener('animationend', () => el.remove());
    }
  }

  /* ── PUBLICATIONS SHOW MORE ────────────────────────────────────── */
  function initPublications() {
    const cards = document.querySelectorAll('.pub-card');
    const btn = document.getElementById('pub-more-btn');
    if (!btn || !cards.length) return;

    let expanded = false;
    function isMobile() { return window.innerWidth <= 640; }

    function applyMobile() {
      if (!isMobile()) {
        cards.forEach(c => c.classList.remove('pub-visible'));
        btn.classList.add('pub-more--hidden');
        return;
      }
      if (expanded) return;
      // Sort by data-mobile-order: priority cards first, then the rest in DOM order
      const sorted = [...cards].sort((a, b) => {
        const oa = a.dataset.mobileOrder ? parseInt(a.dataset.mobileOrder) : 999;
        const ob = b.dataset.mobileOrder ? parseInt(b.dataset.mobileOrder) : 999;
        return oa - ob;
      });
      sorted.forEach((c, i) => {
        if (i < 3) { c.classList.add('pub-visible'); }
        else { c.classList.remove('pub-visible'); }
      });
      btn.classList.toggle('pub-more--hidden', cards.length <= 3);
    }

    btn.addEventListener('click', () => {
      expanded = true;
      cards.forEach(c => c.classList.add('pub-visible'));
      btn.classList.add('pub-more--hidden');
    });

    applyMobile();
    window.addEventListener('resize', applyMobile, { passive: true });
  }

  /* ── ARTICLE TOC ────────────────────────────────────────────────── */
  function initArticleTOC() {
    const articleMain = document.querySelector('.article-main');
    if (!articleMain) return;

    const articles = [
      { title: 'Эффект ореола',                           desc: 'Первое впечатление',          href: '/haloeffect/' },
      { title: 'Эффект Фрейминга',                        desc: 'Сила контекста',               href: '/framing/' },
      { title: 'Эффект обладания',                        desc: 'Цена владения',                href: '/endowment/' },
      { title: 'Эффект Конкорда',                         desc: 'Ловушка вложений',             href: '/sunkcoast/' },
      { title: 'Склонность к подтверждению точки зрения', desc: 'Избирательное внимание',       href: '/confirmationbias/' },
      { title: 'Эффект приманки',                         desc: 'Третий вариант',               href: '/decoyeffect/' },
    ];

    const current = window.location.pathname.replace(/\/$/, '') || '/';

    // Build sidebar
    const toc = document.createElement('nav');
    toc.className = 'article-toc';

    const tocTitle = document.createElement('div');
    tocTitle.className = 'article-toc-title';
    tocTitle.textContent = 'Когнитивные искажения';
    toc.appendChild(tocTitle);

    articles.forEach(art => {
      const a = document.createElement('a');
      a.href = art.href;

      const name = document.createElement('span');
      name.className = 'article-toc-name';
      name.textContent = art.title;

      const desc = document.createElement('span');
      desc.className = 'article-toc-desc';
      desc.textContent = art.desc;

      a.appendChild(name);
      a.appendChild(desc);

      const artPath = art.href.replace(/\//g, '');
      if (current.replace(/\//g, '') === artPath) {
        a.classList.add('toc-active');
      }

      toc.appendChild(a);
    });

    // Add back button above h1
    const hero = articleMain.querySelector('.article-hero');
    if (hero) {
      const back = document.createElement('a');
      back.href = '/';
      back.className = 'article-back';
      back.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>Назад';
      hero.insertBefore(back, hero.firstChild);
    }

    // Wrap all article content in .article-content
    const content = document.createElement('div');
    content.className = 'article-content';
    while (articleMain.firstChild) {
      content.appendChild(articleMain.firstChild);
    }

    // Create outer grid
    const outer = document.createElement('div');
    outer.className = 'article-outer';
    outer.appendChild(toc);
    outer.appendChild(content);
    articleMain.appendChild(outer);
  }


  /* ── SCROLL HINT ────────────────────────────────────────────────── */
  function initScrollHint() {
    if (window.innerWidth > 640) return;
    const wraps = document.querySelectorAll('.sf-scroll-wrap, .gf-scroll-wrap, .vtb-scroll-wrap');
    if (!wraps.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        observer.unobserve(el);

        const timer = setTimeout(() => {
          if (el.scrollWidth <= el.clientWidth) return;
          el.classList.add('scroll-hint-active');
          el.addEventListener('animationend', () => {
            el.classList.remove('scroll-hint-active');
          }, { once: true });
        }, 1200);

        el.addEventListener('scroll', () => {
          clearTimeout(timer);
          el.classList.remove('scroll-hint-active');
        }, { passive: true, once: true });
      });
    }, { threshold: 0.6 });

    wraps.forEach(el => observer.observe(el));
  }

  /* ── VIDEO TRACKING ─────────────────────────────────────────────── */
  function initVideoTracking() {
    document.querySelectorAll('video').forEach(video => {
      video.addEventListener('play', function onPlay() {
        if (typeof ym === 'function') {
          const caseId = window.location.pathname.replace(/\//g, '') || 'index';
          ym(99984431, 'reachGoal', 'video_play', { case: caseId });
        }
        video.removeEventListener('play', onPlay);
      });
    });
  }

  /* ── INIT ───────────────────────────────────────────────────────── */
  function init() {
    renderHeader();
    initHeaderVisibility();
    renderFooter();
    initCursor();
    initFloatingNav();
    initScrollReveal();
    initPublications();
    initLike();
    initArticleTOC();
    initScrollHint();
    initVideoTracking();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

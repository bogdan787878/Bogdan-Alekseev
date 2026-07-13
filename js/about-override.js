(function () {
  var STORAGE_KEY = 'gv_for_slug';
  var params = new URLSearchParams(window.location.search);
  var slug = params.get('for');

  if (slug) {
    try { sessionStorage.setItem(STORAGE_KEY, slug); } catch (e) {}
  } else {
    try { slug = sessionStorage.getItem(STORAGE_KEY); } catch (e) {}
  }
  if (!slug) return;

  // Параметр "прилипает" ко всем внутренним ссылкам страницы, чтобы переход
  // на кейс и обратно (в т.ч. кнопкой "Назад" браузера) сохранял персонализацию.
  document.querySelectorAll('a[href]').forEach(function (a) {
    var href = a.getAttribute('href');
    if (!href || href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0) return;
    var url;
    try { url = new URL(href, window.location.href); } catch (e) { return; }
    if (url.hostname !== window.location.hostname) return;
    url.searchParams.set('for', slug);
    a.setAttribute('href', url.pathname + url.search + url.hash);
  });

  // Путь к данным всегда от корня сайта — скрипт подключается и на кейсах во вложенной папке.
  fetch('/data/about-overrides.json')
    .then(function (r) { return r.ok ? r.json() : {}; })
    .then(function (map) {
      var entry = map[slug];
      if (!entry) return;
      var heroTitleEl = document.getElementById('heroTitle');
      if (entry.heroTitle && heroTitleEl) heroTitleEl.innerHTML = entry.heroTitle;
      if (entry.cvUrl) {
        document.querySelectorAll('.cv-link').forEach(function (a) {
          a.href = entry.cvUrl;
        });
      }

      // На подменных страницах блок "Кто я такой?" не нужен вовсе (есть только на index.html).
      var aboutSection = document.getElementById('about');
      if (aboutSection) aboutSection.remove();
      document.querySelectorAll('a[href*="#about"]').forEach(function (a) {
        a.remove();
      });

      // Теги роли на любой странице переключаются на текущее позиционирование.
      var ROLE_TAG = 'Senior Product Designer';
      document.title = document.title.replace('Design Director', ROLE_TAG);
      document.querySelectorAll('.role-tag').forEach(function (el) {
        if (el.textContent.trim() === 'Design Director') el.textContent = ROLE_TAG;
      });
    })
    .catch(function () {});
})();

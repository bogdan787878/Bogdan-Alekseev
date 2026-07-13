(function () {
  var slug = new URLSearchParams(window.location.search).get('for');
  if (!slug) return;

  fetch('data/about-overrides.json')
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

      // На подменных страницах блок "Кто я такой?" не нужен вовсе.
      var aboutSection = document.getElementById('about');
      if (aboutSection) aboutSection.remove();
      document.querySelectorAll('a[href="#about"]').forEach(function (a) {
        a.remove();
      });

      // Теги роли на странице переключаются на текущее позиционирование.
      var ROLE_TAG = 'Senior Product Designer';
      document.title = document.title.replace('Design Director', ROLE_TAG);
      document.querySelectorAll('.role-tag').forEach(function (el) {
        if (el.textContent.trim() === 'Design Director') el.textContent = ROLE_TAG;
      });
    })
    .catch(function () {});
})();

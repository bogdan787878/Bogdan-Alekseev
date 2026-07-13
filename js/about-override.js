(function () {
  var slug = new URLSearchParams(window.location.search).get('for');
  if (!slug) return;

  fetch('data/about-overrides.json')
    .then(function (r) { return r.ok ? r.json() : {}; })
    .then(function (map) {
      var entry = map[slug];
      if (!entry) return;
      var heroTitleEl = document.getElementById('heroTitle');
      var titleEl = document.getElementById('aboutTitle');
      var textEl = document.getElementById('aboutText');
      if (entry.heroTitle && heroTitleEl) heroTitleEl.innerHTML = entry.heroTitle;
      if (entry.title && titleEl) titleEl.textContent = entry.title;
      if (entry.paragraphs && textEl) {
        textEl.innerHTML = entry.paragraphs.map(function (p) {
          return '<p>' + p + '</p>';
        }).join('');
      }
    })
    .catch(function () {});
})();

(function () {
  // Единый источник заголовка/описания/тегов проекта — data/projects.json.
  // Заполняет любые [data-project][data-field] на странице (хиро кейса,
  // карточка проекта на главной) значениями по ключу data-project.
  var BASE = document.currentScript.src.replace(/js\/[^/]+$/, '');

  fetch(BASE + 'data/projects.json')
    .then(function (r) { return r.ok ? r.json() : {}; })
    .then(function (map) {
      document.querySelectorAll('[data-project][data-field]').forEach(function (el) {
        var project = map[el.dataset.project];
        if (!project) return;
        var value = project[el.dataset.field];
        if (value == null) return;

        if (el.dataset.field === 'tags' && Array.isArray(value)) {
          el.innerHTML = value.map(function (tag) {
            return '<span class="v3-tag">' + tag + '</span>';
          }).join('');
        } else if (/Html$/.test(el.dataset.field)) {
          el.innerHTML = value;
        } else {
          el.textContent = value;
        }

        // Текст подставлен уже после того, как typography.js мог
        // отработать (асинхронный fetch) — прогоняем его повторно.
        if (window.v3FixTypography) window.v3FixTypography(el);
      });
    })
    .catch(function () {});
})();

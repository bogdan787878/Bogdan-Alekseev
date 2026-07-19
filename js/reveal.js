(function () {
  // Портировано из первой версии портфолио: карточки поднимаются и
  // проявляются при попадании в зону видимости (см. .v3-reveal в uikit.css).
  var els = document.querySelectorAll('.v3-reveal');
  if (!els.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('v3-reveal--visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  els.forEach(function (el) { observer.observe(el); });

  // Ступенчатая задержка: карточки проектов — по порядку,
  // обложки книг — по позиции в ряду (как в оригинале).
  document.querySelectorAll('.v3-project.v3-reveal').forEach(function (el, i) {
    el.style.transitionDelay = (i * 0.12) + 's';
  });
  document.querySelectorAll('.v3-books-row').forEach(function (row) {
    row.querySelectorAll('.v3-book.v3-reveal').forEach(function (el, i) {
      el.style.transitionDelay = (i * 0.08) + 's';
    });
  });
})();

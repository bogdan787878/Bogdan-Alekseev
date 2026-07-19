(function () {
  var header = document.querySelector('.v3-header');
  if (!header) return;

  // На главной — показываем имя/кнопки в хедере, когда хиро уходит
  // за пределы экрана (тот же приём, что в старой версии портфолио).
  var hero = document.getElementById('hero');
  if (hero) {
    var observer = new IntersectionObserver(function (entries) {
      header.classList.toggle('v3-header--scrolled', !entries[0].isIntersecting);
    }, { threshold: 0 });
    observer.observe(hero);
  }

  // Бургер-меню на мобилке.
  var burger = document.getElementById('headerBurger');
  if (burger) {
    burger.addEventListener('click', function () {
      header.classList.toggle('v3-header--menu-open');
    });
  }
  document.querySelectorAll('.v3-header-mobile-menu a').forEach(function (a) {
    a.addEventListener('click', function () {
      header.classList.remove('v3-header--menu-open');
    });
  });
})();

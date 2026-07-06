(function () {
  document.querySelectorAll('.gv-catalog-card').forEach(function (card) {
    var slides = card.querySelectorAll('.gv-catalog-slide');
    var dots = card.querySelectorAll('.gv-catalog-dot');
    if (!slides.length) return;

    function goTo(index) {
      slides.forEach(function (s, i) { s.classList.toggle('is-active', i === index); });
      dots.forEach(function (d, i) { d.classList.toggle('is-active', i === index); });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        goTo(Number(dot.dataset.index));
      });
    });

    // Клик по самой картинке — переход к следующему слайду (не мешает загрузке в режиме редактирования)
    slides.forEach(function (slide, i) {
      slide.addEventListener('click', function (e) {
        if (window.__gvEditMode) return;
        e.preventDefault();
        goTo((i + 1) % slides.length);
      });
    });
  });
})();

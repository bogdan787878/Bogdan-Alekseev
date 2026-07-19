(function () {
  var cta = document.querySelector('.v3-mobile-cta');
  if (!cta) return;

  var lastY = window.scrollY;
  window.addEventListener('scroll', function () {
    var currentY = window.scrollY;
    cta.classList.toggle('v3-mobile-cta--hidden', currentY > lastY && currentY > 60);
    lastY = currentY;
  }, { passive: true });
})();

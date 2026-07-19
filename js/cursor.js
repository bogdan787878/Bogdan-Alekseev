(function () {
  var targets = document.querySelectorAll('.v3-project .v3-split-media');
  if (!targets.length) return;

  var cursor = document.createElement('div');
  cursor.className = 'v3-cursor';
  cursor.textContent = 'Перейти';
  document.body.appendChild(cursor);

  // Размер фикс, задан в CSS (.v3-cursor { width/height: 96px }) — не
  // читаем offsetWidth/offsetHeight на каждый mousemove, это форсирует
  // синхронный reflow на каждое событие и тормозит страницу.
  var HALF = 48;
  var mouseX = 0, mouseY = 0, rafId = null;
  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX - HALF;
    mouseY = e.clientY - HALF;
    if (!rafId) {
      rafId = requestAnimationFrame(function () {
        cursor.style.transform = 'translate(' + mouseX + 'px,' + mouseY + 'px)';
        rafId = null;
      });
    }
  }, { passive: true });

  targets.forEach(function (el) {
    el.addEventListener('mouseenter', function () { cursor.classList.add('v3-cursor--visible'); });
    el.addEventListener('mouseleave', function () { cursor.classList.remove('v3-cursor--visible'); });
  });
})();

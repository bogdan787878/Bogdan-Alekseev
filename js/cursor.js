(function () {
  var targets = document.querySelectorAll('.v3-project');
  if (!targets.length) return;

  var cursor = document.createElement('div');
  cursor.className = 'v3-cursor';
  cursor.textContent = 'Перейти';
  document.body.appendChild(cursor);

  var mouseX = 0, mouseY = 0, rafId = null;
  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX - cursor.offsetWidth / 2;
    mouseY = e.clientY - cursor.offsetHeight / 2;
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

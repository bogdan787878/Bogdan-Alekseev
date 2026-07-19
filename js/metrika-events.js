(function () {
  document.querySelectorAll('a[href*="docs.google.com"]').forEach(function (link) {
    link.addEventListener('click', function () {
      if (typeof ym === 'function') ym(99984431, 'reachGoal', 'cv_click');
    });
  });
  document.querySelectorAll('a[href*="t.me/al_bogdan"]').forEach(function (link) {
    link.addEventListener('click', function () {
      if (typeof ym === 'function') ym(99984431, 'reachGoal', 'telegram_click');
    });
  });
})();

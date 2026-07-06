(function () {
  fetch('data/images.json')
    .then(function (r) { return r.ok ? r.json() : {}; })
    .then(function (map) {
      Object.keys(map).forEach(function (slot) {
        var path = map[slot];
        if (!path) return;
        var els = document.querySelectorAll('[data-slot="' + slot + '"]');
        els.forEach(function (el) {
          el.style.backgroundImage = 'url(' + path + '?v=' + Date.now() + ')';
          el.style.backgroundSize = 'cover';
          el.style.backgroundPosition = 'center';
          el.textContent = '';
          el.classList.remove('gv-ph');
        });
      });
    })
    .catch(function () {});
})();

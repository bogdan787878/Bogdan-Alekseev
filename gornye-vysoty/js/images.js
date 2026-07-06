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
          el.style.backgroundSize = el.dataset.fit === 'contain' ? 'contain' : 'cover';
          el.style.backgroundRepeat = 'no-repeat';
          el.style.backgroundPosition = 'center';
          el.textContent = '';
          el.classList.remove('gv-ph');
        });
      });

      // На публичном сайте (не в режиме редактирования) прячем пустые кружки-аватарки —
      // видны только те, для которых реально загружена картинка. В самой админке
      // (когда доступен /api/ping) оставляем все — чтобы было что кликнуть и загрузить.
      fetch('/api/ping').then(function (r) { return r.ok; }).catch(function () { return false; })
        .then(function (isEditMode) {
          if (isEditMode) return;
          document.querySelectorAll('.gv-mortgage-avatars [data-slot]').forEach(function (el) {
            if (!el.style.backgroundImage) el.style.display = 'none';
          });
        });
    })
    .catch(function () {});
})();

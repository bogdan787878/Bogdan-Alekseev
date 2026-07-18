(function () {
  // Базовый путь вычисляется от расположения самого скрипта — работает
  // одинаково с корня (index.html) и из вложенных страниц (cases/*.html).
  var BASE = document.currentScript.src.replace(/js\/[^/]+$/, '');

  function clearPlaceholderText(el) {
    Array.prototype.slice.call(el.childNodes).forEach(function (node) {
      if (node.nodeType === 3) el.removeChild(node);
    });
  }

  // Применяет картинку или видео (webm) в слот. Используется и здесь,
  // и в edit-mode.js сразу после загрузки файла.
  function applyMediaSlot(el, url, fit) {
    clearPlaceholderText(el);
    el.classList.remove('v3-ph');
    var isVideo = /\.webm(\?|$)/i.test(url);
    var existingVideo = el.querySelector(':scope > video.v3-slot-video');
    if (existingVideo) existingVideo.remove();
    if (isVideo) {
      el.style.backgroundImage = '';
      el.style.position = el.style.position || 'relative';
      el.style.overflow = 'hidden';
      var video = document.createElement('video');
      video.className = 'v3-slot-video';
      video.src = url;
      video.autoplay = true;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;' +
        'object-fit:' + (fit === 'contain' ? 'contain' : 'cover') + ';border-radius:inherit;';
      el.appendChild(video);
    } else {
      el.style.backgroundImage = 'url(' + url + ')';
      el.style.backgroundSize = fit === 'contain' ? 'contain' : 'cover';
      el.style.backgroundRepeat = 'no-repeat';
      el.style.backgroundPosition = 'center';
    }
  }
  window.v3ApplyMediaSlot = applyMediaSlot;

  fetch(BASE + 'data/images.json')
    .then(function (r) { return r.ok ? r.json() : {}; })
    .then(function (map) {
      Object.keys(map).forEach(function (slot) {
        var path = map[slot];
        if (!path) return;
        var els = document.querySelectorAll('[data-slot="' + slot + '"]');
        els.forEach(function (el) {
          applyMediaSlot(el, BASE + path + '?v=' + Date.now(), el.dataset.fit);
        });
      });
    })
    .catch(function () {});
})();

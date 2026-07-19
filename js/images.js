(function () {
  // Базовый путь вычисляется от расположения самого скрипта — работает
  // одинаково с корня (index.html) и из вложенных страниц (cases/*.html).
  var BASE = document.currentScript.src.replace(/js\/[^/]+$/, '');

  function clearPlaceholderText(el) {
    Array.prototype.slice.call(el.childNodes).forEach(function (node) {
      if (node.nodeType === 3) el.removeChild(node);
    });
  }

  // В sticky-блоках кадры видео стоят друг под другом и скроллятся мимо
  // залипшего текста — часть из них может быть далеко за пределами экрана.
  // Вместо autoplay сразу запускаем/останавливаем видео по видимости.
  function playWhenVisible(video) {
    video.autoplay = false;
    video.pause();
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          video.play().catch(function () {});
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.35 });
    observer.observe(video);
  }

  // Применяет картинку или видео (webm) в слот. Используется и здесь,
  // и в edit-mode.js сразу после загрузки файла.
  //
  // Внутри .v3-inset-box (телефон-мокап с фиксированной формой), а также
  // в любом слоте с заранее заданной инлайновой высотой (автор задал
  // фиксированный размер под кроп) — медиа заполняет слот с кропом
  // (object-fit), сохраняя заданные пропорции блока.
  // В обычных блоках (.v3-split-media / .v3-full-media без инсета и без
  // инлайновой высоты) слот получает настоящий <img>/<video> — высота на
  // вебе подстраивается под реальные пропорции медиа, без кропа.
  function applyMediaSlot(el, url, fit) {
    clearPlaceholderText(el);
    el.classList.remove('v3-ph');
    var isVideo = /\.webm(\?|$)/i.test(url);
    var existing = el.querySelector(':scope > .v3-slot-media');
    if (existing) existing.remove();

    if (el.closest('.v3-inset-box') || el.style.height) {
      el.style.backgroundImage = '';
      el.style.position = el.style.position || 'relative';
      el.style.overflow = 'hidden';
      var fill = document.createElement(isVideo ? 'video' : 'img');
      fill.className = 'v3-slot-media';
      if (isVideo) {
        fill.muted = true; fill.loop = true; fill.playsInline = true;
        fill.classList.add('v3-shimmer');
        fill.addEventListener('loadeddata', function () { fill.classList.remove('v3-shimmer'); }, { once: true });
        if (el.closest('.v3-split--sticky')) {
          playWhenVisible(fill);
        } else {
          fill.autoplay = true;
        }
      }
      fill.src = url;
      fill.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;' +
        'object-fit:' + (fit === 'contain' ? 'contain' : 'cover') + ';border-radius:inherit;';
      el.appendChild(fill);
      return;
    }

    el.style.backgroundImage = '';
    el.style.aspectRatio = '';
    el.style.height = '';
    el.classList.add('v3-slot-loaded');
    var media = document.createElement(isVideo ? 'video' : 'img');
    media.className = 'v3-slot-media';
    if (isVideo) {
      media.autoplay = true; media.muted = true; media.loop = true; media.playsInline = true;
      media.classList.add('v3-shimmer');
      media.addEventListener('loadeddata', function () { media.classList.remove('v3-shimmer'); }, { once: true });
    }
    media.src = url;
    el.appendChild(media);
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

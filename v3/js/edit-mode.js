(function () {
  var BASE = document.currentScript.src.replace(/js\/[^/]+$/, '');

  fetch('/api/ping').then(function (r) {
    if (r.ok) init();
  }).catch(function () {});

  function init() {
    window.__v3EditMode = true;
    document.querySelectorAll('[data-slot]').forEach(function (el) {
      el.style.display = '';
      el.style.cursor = 'pointer';
      el.style.outline = '2px dashed rgba(40,38,139,0.5)';
      el.style.outlineOffset = '-2px';
      el.title = 'Нажмите, чтобы загрузить картинку (' + el.dataset.slot + ')';
      el.addEventListener('click', function () { openPicker(el); });
    });

    var bar = document.createElement('div');
    bar.style.cssText = 'position:fixed;left:16px;bottom:16px;z-index:9999;display:flex;align-items:center;gap:10px;background:#28268B;color:#fff;padding:10px 14px;border-radius:100px;font-family:sans-serif;font-size:14px;box-shadow:0 8px 24px rgba(0,0,0,0.25);';
    bar.innerHTML =
      '<span id="v3-edit-status">Режим редактирования</span>' +
      '<button id="v3-edit-publish" style="background:#8D8CBF;color:#fff;border:none;border-radius:100px;padding:8px 16px;font-size:14px;cursor:pointer;">Опубликовать</button>';
    document.body.appendChild(bar);

    document.getElementById('v3-edit-publish').addEventListener('click', publish);
    refreshStatus();
  }

  function openPicker(el) {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/webm';
    input.style.position = 'fixed';
    input.style.top = '-1000px';
    input.addEventListener('change', function () {
      if (input.files[0]) uploadSlot(el.dataset.slot, input.files[0], el);
      input.remove();
    });
    document.body.appendChild(input);
    input.click();
  }

  function uploadSlot(slot, file, el) {
    var fd = new FormData();
    fd.append('image', file);
    setStatus('Загружаю…');
    fetch('/api/upload-slot?slot=' + encodeURIComponent(slot), { method: 'POST', body: fd })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data.ok) {
          var url = BASE + data.path + '?v=' + Date.now();
          document.querySelectorAll('[data-slot="' + slot + '"]').forEach(function (target) {
            window.v3ApplyMediaSlot(target, url, target.dataset.fit);
          });
          setStatus('Загружено, готово к публикации');
        } else {
          setStatus('Ошибка загрузки');
        }
      })
      .catch(function () { setStatus('Ошибка загрузки'); });
  }

  function publish() {
    setStatus('Публикую…');
    fetch('/api/release', { method: 'POST' })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        setStatus(data.ok ? 'Опубликовано ✓' : 'Ошибка публикации — см. терминал админки');
      })
      .catch(function () { setStatus('Ошибка публикации'); });
  }

  function refreshStatus() {
    fetch('/api/status').then(function (r) { return r.json(); }).then(function (data) {
      setStatus(data.pending ? data.pending + ' изменений не опубликовано' : 'Всё опубликовано');
    }).catch(function () {});
  }

  function setStatus(text) {
    var el = document.getElementById('v3-edit-status');
    if (el) el.textContent = text;
  }
})();

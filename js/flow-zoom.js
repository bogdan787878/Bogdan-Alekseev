(function () {
  var board = document.getElementById('flowBoard');
  var canvas = document.getElementById('flowCanvas');
  if (!board || !canvas) return;

  var scale = 1, minScale = 0.25, maxScale = 4;
  var tx = 40, ty = 20;

  function apply() {
    canvas.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + scale + ')';
  }

  function zoomAt(clientX, clientY, factor) {
    var rect = board.getBoundingClientRect();
    var px = clientX - rect.left;
    var py = clientY - rect.top;
    var newScale = Math.min(maxScale, Math.max(minScale, scale * factor));
    var ratio = newScale / scale;
    tx = px - (px - tx) * ratio;
    ty = py - (py - ty) * ratio;
    scale = newScale;
    apply();
  }

  board.addEventListener('wheel', function (e) {
    e.preventDefault();
    var factor = e.deltaY < 0 ? 1.1 : 0.9;
    zoomAt(e.clientX, e.clientY, factor);
  }, { passive: false });

  // Драг мышью для панорамы (ЛКМ, не по кнопкам зума).
  var dragging = false, lastX = 0, lastY = 0;
  board.addEventListener('mousedown', function (e) {
    if (e.target.closest('.v3-flow-zoom-controls')) return;
    dragging = true;
    lastX = e.clientX; lastY = e.clientY;
    board.classList.add('is-dragging');
  });
  window.addEventListener('mousemove', function (e) {
    if (!dragging) return;
    tx += e.clientX - lastX;
    ty += e.clientY - lastY;
    lastX = e.clientX; lastY = e.clientY;
    apply();
  });
  window.addEventListener('mouseup', function () {
    dragging = false;
    board.classList.remove('is-dragging');
  });

  // Тач: один палец — панорама, два — пинч-зум.
  var touch = null;
  function touchDist(t) {
    var dx = t[0].clientX - t[1].clientX;
    var dy = t[0].clientY - t[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }
  board.addEventListener('touchstart', function (e) {
    if (e.touches.length === 1) {
      touch = { mode: 'pan', x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.touches.length === 2) {
      touch = {
        mode: 'pinch',
        dist: touchDist(e.touches),
        midX: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        midY: (e.touches[0].clientY + e.touches[1].clientY) / 2
      };
    }
  }, { passive: true });
  board.addEventListener('touchmove', function (e) {
    if (!touch) return;
    if (touch.mode === 'pan' && e.touches.length === 1) {
      tx += e.touches[0].clientX - touch.x;
      ty += e.touches[0].clientY - touch.y;
      touch.x = e.touches[0].clientX; touch.y = e.touches[0].clientY;
      apply();
      e.preventDefault();
    } else if (touch.mode === 'pinch' && e.touches.length === 2) {
      var newDist = touchDist(e.touches);
      zoomAt(touch.midX, touch.midY, newDist / touch.dist);
      touch.dist = newDist;
      e.preventDefault();
    }
  }, { passive: false });
  board.addEventListener('touchend', function () { touch = null; });

  var buttons = board.querySelectorAll('.v3-flow-zoom-btn');
  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var rect = board.getBoundingClientRect();
      var cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
      var action = btn.dataset.zoom;
      if (action === 'in') zoomAt(cx, cy, 1.25);
      else if (action === 'out') zoomAt(cx, cy, 0.8);
      else { scale = 1; tx = 40; ty = 20; apply(); }
    });
  });

  apply();
})();

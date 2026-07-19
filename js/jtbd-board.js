(function () {
  var board = document.getElementById('jtbdBoard');
  var center = document.getElementById('jtbdCenter');
  if (!board || !center) return;

  function centerColumn() {
    var target = center.offsetLeft - (board.clientWidth - center.offsetWidth) / 2;
    board.scrollLeft = Math.max(0, target);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', centerColumn);
  } else {
    centerColumn();
  }
})();

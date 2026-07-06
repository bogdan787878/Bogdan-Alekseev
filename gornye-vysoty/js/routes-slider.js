(function () {
  var track = document.getElementById('routes-track');
  if (!track) return;

  document.querySelectorAll('.gv-routes-arrow').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = track.querySelector('.gv-route-card');
      var step = card ? card.getBoundingClientRect().width + 16 : 400;
      track.scrollBy({ left: step * Number(btn.dataset.dir), behavior: 'smooth' });
    });
  });
})();

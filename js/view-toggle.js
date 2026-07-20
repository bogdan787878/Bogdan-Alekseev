(function () {
  var toggle = document.querySelector('.v3-view-toggle');
  if (!toggle) return;
  var buttons = toggle.querySelectorAll('.v3-view-toggle-btn');
  var boards = {
    jtbd: document.getElementById('jtbdBoard'),
    flows: document.getElementById('flowBoard')
  };
  if (!boards.jtbd || !boards.flows) return;

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      buttons.forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      var view = btn.dataset.view;
      boards.jtbd.style.display = view === 'jtbd' ? '' : 'none';
      boards.flows.style.display = view === 'flows' ? '' : 'none';
    });
  });
})();

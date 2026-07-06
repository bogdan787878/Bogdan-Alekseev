(function () {
  var grid = document.getElementById('plans-grid');
  if (!grid) return;

  var countEl = document.getElementById('plans-count');
  var emptyEl = document.getElementById('plans-empty');
  var roomsWrap = document.getElementById('filter-rooms');
  var areaSelect = document.getElementById('filter-area');
  var priceSelect = document.getElementById('filter-price');

  var allPlans = [];
  var activeRooms = 'all';

  function formatRub(n) {
    return Math.round(n).toLocaleString('ru-RU') + ' ₽';
  }

  function matchesRange(value, rangeStr) {
    if (rangeStr === 'all') return true;
    var parts = rangeStr.split('-');
    var min = Number(parts[0]);
    var max = Number(parts[1]);
    return value >= min && value <= max;
  }

  function matchesRooms(plan) {
    if (activeRooms === 'all') return true;
    if (activeRooms === '4') return plan.rooms >= 4;
    return plan.rooms === Number(activeRooms);
  }

  function cardHTML(plan) {
    var img = plan.image
      ? '<img class="gv-plan-card-img" src="' + plan.image + '" alt="' + plan.title + '">'
      : '<div class="gv-plan-card-img gv-ph">планировка</div>';
    return (
      '<article class="gv-plan-card">' +
        img +
        '<div class="gv-plan-card-body">' +
          '<div class="gv-plan-card-title">' + plan.title + '</div>' +
          '<div class="gv-plan-card-meta">' + plan.area + ' м² · ' + plan.floor + ' этаж</div>' +
          '<div class="gv-plan-card-price">' + formatRub(plan.price) + '</div>' +
        '</div>' +
      '</article>'
    );
  }

  function render() {
    var areaRange = areaSelect.value;
    var priceRange = priceSelect.value;

    var filtered = allPlans.filter(function (plan) {
      return matchesRooms(plan) &&
        matchesRange(plan.area, areaRange) &&
        matchesRange(plan.price, priceRange);
    });

    countEl.textContent = 'Найдено планировок: ' + filtered.length;
    grid.innerHTML = filtered.map(cardHTML).join('');
    grid.style.display = filtered.length ? '' : 'none';
    emptyEl.style.display = filtered.length ? 'none' : '';
  }

  roomsWrap.addEventListener('click', function (e) {
    var btn = e.target.closest('.gv-chip');
    if (!btn) return;
    activeRooms = btn.dataset.rooms;
    roomsWrap.querySelectorAll('.gv-chip').forEach(function (c) { c.classList.remove('is-active'); });
    btn.classList.add('is-active');
    render();
  });
  areaSelect.addEventListener('change', render);
  priceSelect.addEventListener('change', render);

  fetch('data/planirovki.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      allPlans = data;
      render();
    })
    .catch(function () {
      countEl.textContent = 'Не удалось загрузить планировки';
    });
})();

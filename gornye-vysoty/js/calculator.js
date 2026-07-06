(function () {
  var priceEl = document.getElementById('calc-price');
  var downEl = document.getElementById('calc-down');
  var termEl = document.getElementById('calc-term');
  var rateEl = document.getElementById('calc-rate');
  if (!priceEl) return;

  var priceOut = document.getElementById('calc-price-out');
  var downOut = document.getElementById('calc-down-out');
  var termOut = document.getElementById('calc-term-out');
  var rateOut = document.getElementById('calc-rate-out');
  var loanOut = document.getElementById('calc-loan');
  var overpayOut = document.getElementById('calc-overpay');
  var monthlyOut = document.getElementById('calc-monthly');

  function formatRub(n) {
    return Math.round(n).toLocaleString('ru-RU') + ' ₽';
  }

  function recalc() {
    var price = Number(priceEl.value);
    var downPct = Number(downEl.value);
    var termYears = Number(termEl.value);
    var ratePct = Number(rateEl.value);

    var downSum = price * downPct / 100;
    var loan = Math.max(price - downSum, 0);
    var months = termYears * 12;
    var monthlyRate = ratePct / 100 / 12;

    var monthly;
    if (monthlyRate === 0) {
      monthly = loan / months;
    } else {
      var k = Math.pow(1 + monthlyRate, months);
      monthly = loan * (monthlyRate * k) / (k - 1);
    }
    var total = monthly * months;
    var overpay = total - loan;

    priceOut.textContent = formatRub(price);
    downOut.textContent = formatRub(downSum) + ' (' + downPct + '%)';
    termOut.textContent = termYears + ' лет';
    rateOut.textContent = ratePct.toFixed(1).replace('.', ',') + '%';

    loanOut.textContent = formatRub(loan);
    overpayOut.textContent = formatRub(overpay);
    monthlyOut.textContent = formatRub(monthly) + '/мес.';
  }

  [priceEl, downEl, termEl, rateEl].forEach(function (el) {
    el.addEventListener('input', recalc);
  });

  recalc();
})();

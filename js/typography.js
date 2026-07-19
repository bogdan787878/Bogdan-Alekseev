(function () {
  // Не даёт коротким предлогам/союзам оставаться в конце строки —
  // заменяет пробел после них на неразрывный (&nbsp;). Работает
  // автоматически на любом тексте страницы, вручную &nbsp; ставить не нужно.
  var SHORT_WORDS = '(?:а|б|в|е|и|к|о|с|у|я|бы|во|да|до|её|же|за|из|их|ко|ли|мы|на|не|ни|но|нэ|об|он|от|по|со|та|то|ты|уж|это|как|что|или|для|при|над|под|про|без|чем|уже|ещё|тут|там|весь|вся|всё|мой|моя|моё|твой|наш|ваш|его|тот|эта|эти)';
  var RE = new RegExp('(^|[\\s\\u00A0])(' + SHORT_WORDS + ')(\\s)', 'giu');

  function fixText(str) {
    return str.replace(RE, '$1$2 ');
  }

  function walk(root) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        var tag = node.parentNode && node.parentNode.nodeName;
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT' || tag === 'TEXTAREA') {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var node;
    while ((node = walker.nextNode())) {
      var fixed = fixText(node.nodeValue);
      if (fixed !== node.nodeValue) node.nodeValue = fixed;
    }
  }

  // Доступно снаружи — вызывать повторно после того, как другой скрипт
  // подставил текст в DOM асинхронно (например projects.js после fetch).
  window.v3FixTypography = function (root) { walk(root || document.body); };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { walk(document.body); });
  } else {
    walk(document.body);
  }
})();

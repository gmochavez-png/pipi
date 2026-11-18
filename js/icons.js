/* =========================================================
   PIPI · Íconos
   Íconos de trazo redondeado al estilo de iOS, dibujados en SVG.
   Uso en HTML:  <span class="ico" data-icon="chevron-left"></span>
   Uso en JS:    window.PipiIcons.svg("speaker")
   ========================================================= */

(function () {
  "use strict";

  // Engranaje calculado (dientes redondeados alrededor de un círculo).
  function gearPath() {
    var teeth = 8, rOut = 10, rIn = 7.6, d = "";
    for (var i = 0; i < teeth * 2; i++) {
      var r = i % 2 === 0 ? rOut : rIn;
      var a0 = (i / (teeth * 2)) * Math.PI * 2 - Math.PI / (teeth * 2);
      var a1 = ((i + 1) / (teeth * 2)) * Math.PI * 2 - Math.PI / (teeth * 2);
      var x0 = 12 + Math.cos(a0) * r, y0 = 12 + Math.sin(a0) * r;
      var x1 = 12 + Math.cos(a1) * r, y1 = 12 + Math.sin(a1) * r;
      d += (i === 0 ? "M" : "L") + x0.toFixed(2) + " " + y0.toFixed(2) + "L" + x1.toFixed(2) + " " + y1.toFixed(2);
    }
    return d + "Z";
  }

  var S = 'fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"';

  var ICONS = {
    "chevron-left": '<path ' + S + ' d="M15 4.5 7.5 12 15 19.5"/>',
    "chevron-right": '<path ' + S + ' d="M9 4.5 16.5 12 9 19.5"/>',
    "speaker": '<path fill="currentColor" d="M4 9.2h3.2L12 5v14l-4.8-4.2H4a1 1 0 0 1-1-1V10.2a1 1 0 0 1 1-1z"/>' +
      '<path ' + S + ' d="M15.5 9a4.2 4.2 0 0 1 0 6M18.3 6.3a8 8 0 0 1 0 11.4"/>',
    "speaker-off": '<path fill="currentColor" d="M4 9.2h3.2L12 5v14l-4.8-4.2H4a1 1 0 0 1-1-1V10.2a1 1 0 0 1 1-1z"/>' +
      '<path ' + S + ' d="m15.5 9.5 5 5m0-5-5 5"/>',
    "gear": '<path ' + S + ' stroke-width="2" d="' + gearPath() + '"/><circle ' + S + ' stroke-width="2" cx="12" cy="12" r="3.2"/>',
    "star": '<path fill="currentColor" d="M12 2.8l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.6l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8z"/>',
    "refresh": '<path ' + S + ' d="M19.5 12a7.5 7.5 0 1 1-2.3-5.4"/><path ' + S + ' d="M19.8 4.2v4.5h-4.5"/>',
    "mic": '<rect ' + S + ' x="8.5" y="3" width="7" height="11.5" rx="3.5"/><path ' + S + ' d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3"/>',
    "stop": '<rect fill="currentColor" x="6.5" y="6.5" width="11" height="11" rx="2.5"/>',
    "arrow-up": '<path ' + S + ' stroke-width="2.6" d="M12 19V5.5M6.5 11 12 5.5 17.5 11"/>',
    "lock": '<rect fill="currentColor" x="5" y="10.5" width="14" height="10" rx="2.6"/><path ' + S + ' d="M8.2 10.5V8a3.8 3.8 0 0 1 7.6 0v2.5"/>',
    "check": '<path ' + S + ' stroke-width="2.8" d="M5 12.5l4.5 4.5L19 7.5"/>',
    "xmark": '<path ' + S + ' d="M6.5 6.5l11 11m0-11-11 11"/>',
    // Íconos de las "apps" de la portada (trazo blanco sobre el color)
    "book": '<path ' + S + ' d="M12 6.4C9.8 4.9 6.7 4.4 3.5 4.9v13.2c3.2-.5 6.3 0 8.5 1.5 2.2-1.5 5.3-2 8.5-1.5V4.9c-3.2-.5-6.3 0-8.5 1.5zM12 6.4v13.2"/>',
    "globe": '<circle ' + S + ' cx="12" cy="12" r="9"/><ellipse ' + S + ' cx="12" cy="12" rx="3.8" ry="9"/><path ' + S + ' d="M3.5 9h17M3.5 15h17"/>',
    "books": '<rect ' + S + ' x="4" y="4" width="5" height="16" rx="1.2"/><rect ' + S + ' x="10" y="4" width="5" height="16" rx="1.2"/><path ' + S + ' d="m16.4 5.6 3.9-1.1 3.2 14.6-3.9 1"/>',
    "puzzle": '<path ' + S + ' d="M9.5 4.5a2.5 2.5 0 0 1 5 0V6H19v4.5h-1.5a2.5 2.5 0 0 0 0 5H19V20h-4.5v-1.5a2.5 2.5 0 0 0-5 0V20H5v-4.5h1.5a2.5 2.5 0 0 0 0-5H5V6h4.5z"/>',
    "bubble": '<path ' + S + ' d="M12 4c5 0 9 3.2 9 7.2s-4 7.2-9 7.2c-1 0-2-.1-2.9-.4L4.5 20l1.4-3.8C4.1 14.9 3 13.1 3 11.2 3 7.2 7 4 12 4z"/>',
    "sparkles": '<path fill="currentColor" d="M11 3l1.6 4.6L17 9.2l-4.4 1.6L11 15.4 9.4 10.8 5 9.2l4.4-1.6zM18 13.5l.9 2.4 2.3.9-2.3.9-.9 2.4-.9-2.4-2.3-.9 2.3-.9z"/>',
    "arrow-right": '<path ' + S + ' stroke-width="2.6" d="M5 12h13.5M13 6.5l5.5 5.5-5.5 5.5"/>',
    "arrow-down": '<path ' + S + ' stroke-width="2.6" d="M12 5v13.5M6.5 13l5.5 5.5 5.5-5.5"/>',
    "palette": '<path ' + S + ' d="M12 3.5a8.5 8.5 0 1 0 0 17c1.3 0 2-.8 2-1.8 0-1.3-1.2-1.6-1.2-2.9 0-1 .8-1.8 1.9-1.8h2.4c2 0 3.4-1.5 3.4-3.6C20.5 6.6 16.7 3.5 12 3.5z"/>' +
      '<circle fill="currentColor" cx="7.6" cy="11" r="1.5"/><circle fill="currentColor" cx="10" cy="7.2" r="1.5"/><circle fill="currentColor" cx="14.6" cy="7.4" r="1.5"/>',
    "paw": '<ellipse fill="currentColor" cx="12" cy="16" rx="4.6" ry="3.8"/><ellipse fill="currentColor" cx="6" cy="10.6" rx="2" ry="2.6"/><ellipse fill="currentColor" cx="18" cy="10.6" rx="2" ry="2.6"/>' +
      '<ellipse fill="currentColor" cx="9.4" cy="6.4" rx="2" ry="2.6"/><ellipse fill="currentColor" cx="14.6" cy="6.4" rx="2" ry="2.6"/>',
    "people": '<circle ' + S + ' cx="8.5" cy="7.5" r="3"/><circle ' + S + ' cx="16.5" cy="9" r="2.4"/><path ' + S + ' d="M3 19.5c.4-3.4 2.7-5.5 5.5-5.5s5.1 2.1 5.5 5.5M14 15.3c.8-.6 1.6-.9 2.5-.9 2.2 0 4 1.7 4.4 4.6"/>',
    "face": '<circle ' + S + ' cx="12" cy="12" r="8.6"/><circle fill="currentColor" cx="9" cy="10" r="1.3"/><circle fill="currentColor" cx="15" cy="10" r="1.3"/><path ' + S + ' d="M8.5 14.5c1.9 2 5.1 2 7 0"/>',
    "grid": '<rect ' + S + ' x="3.5" y="3.5" width="17" height="17" rx="4"/><path ' + S + ' stroke-width="1.8" d="M9.2 3.5v17M14.8 3.5v17M3.5 9.2h17M3.5 14.8h17"/>',
    "trash":'<path ' + S + ' d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13"/>'
  };

  function svg(name, cls) {
    var body = ICONS[name];
    if (!body) return "";
    var size = name === "books" ? "0 0 24.5 24" : "0 0 24 24";
    return '<svg class="ico-svg' + (cls ? " " + cls : "") + '" viewBox="' + size + '" aria-hidden="true" focusable="false">' + body + "</svg>";
  }

  function fill(root) {
    Array.prototype.forEach.call((root || document).querySelectorAll("[data-icon]"), function (el) {
      el.innerHTML = svg(el.getAttribute("data-icon"));
    });
  }

  // Cambia el ícono de un elemento que ya tiene data-icon.
  function set(el, name) {
    if (!el) return;
    el.setAttribute("data-icon", name);
    el.innerHTML = svg(name);
  }

  window.PipiIcons = { svg: svg, fill: fill, set: set };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { fill(); });
  } else {
    fill();
  }
})();

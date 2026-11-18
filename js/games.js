/* =========================================================
   PIPI · Menú de Juegos
   Para agregar un juego nuevo, añade un objeto a GAMES con
   { id, title, emoji, desc, start } y crea su archivo en js/.
   ========================================================= */

(function () {
  "use strict";

  var GAMES = [
    {
      id: "sopa",
      title: "Sopa de letras",
      emoji: "🔤",
      desc: "Busca las palabras",
      color: "#ffe3c4",
      color2: "#ffc2d6",
      start: function () { if (window.PipiWordSearch) window.PipiWordSearch.start(); }
    }
  ];

  function render() {
    var grid = document.querySelector("#games-grid");
    if (!grid) return;
    grid.innerHTML = "";
    GAMES.forEach(function (g) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "game-card";
      b.style.setProperty("--game-a", g.color);
      b.style.setProperty("--game-b", g.color2);
      var em = document.createElement("span");
      em.className = "game-card__emoji";
      em.textContent = g.emoji;
      var tt = document.createElement("span");
      tt.className = "game-card__title";
      tt.textContent = g.title;
      var ds = document.createElement("span");
      ds.className = "game-card__desc";
      ds.textContent = g.desc;
      b.appendChild(em);
      b.appendChild(tt);
      b.appendChild(ds);
      b.addEventListener("click", g.start);
      grid.appendChild(b);
    });
    var soon = document.createElement("div");
    soon.className = "game-card game-card--soon";
    soon.innerHTML = '<span class="game-card__emoji">🎁</span><span class="game-card__title">Pronto, más juegos</span>';
    grid.appendChild(soon);
  }

  function open() {
    render();
    if (window.PipiApp && window.PipiApp.show) window.PipiApp.show("games");
  }

  window.PipiGames = { open: open, list: GAMES };
})();

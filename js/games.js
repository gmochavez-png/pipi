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
      color: "#5cb6ff",
      color2: "#1a66e8",
      icon: "grid",
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
      if (g.icon && window.PipiIcons) em.innerHTML = window.PipiIcons.svg(g.icon);
      else em.textContent = g.emoji;
      var tt = document.createElement("span");
      tt.className = "game-card__title";
      tt.textContent = g.title;
      var ds = document.createElement("span");
      ds.className = "game-card__desc";
      ds.textContent = g.desc;
      var body = document.createElement("span");
      body.className = "game-card__body";
      body.appendChild(tt);
      body.appendChild(ds);
      var chev = document.createElement("span");
      chev.className = "game-card__chev";
      chev.innerHTML = window.PipiIcons ? window.PipiIcons.svg("chevron-right") : "";
      b.appendChild(em);
      b.appendChild(body);
      b.appendChild(chev);
      b.addEventListener("click", g.start);
      grid.appendChild(b);
    });
    var soon = document.createElement("div");
    soon.className = "game-card game-card--soon";
    soon.innerHTML = '<span class="game-card__emoji">' + (window.PipiIcons ? window.PipiIcons.svg("sparkles") : "") + '</span><span class="game-card__body"><span class="game-card__title">Pronto, más juegos</span></span>';
    grid.appendChild(soon);
  }

  function open() {
    render();
    if (window.PipiApp && window.PipiApp.show) window.PipiApp.show("games");
  }

  window.PipiGames = { open: open, list: GAMES };
})();

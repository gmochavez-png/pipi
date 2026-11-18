/* =========================================================
   PIPI · Juego: Sopa de letras
   - Cuadrícula de 6×6 con letras grandes en mayúscula.
   - 4 palabras cortas tomadas de "Las palabras" (js/lessons.js).
   - Solo horizontal (➡️) y vertical (⬇️). Nada en diagonal ni al revés.
   - Se juega arrastrando el dedo o tocando la primera y la última letra.
   ========================================================= */

(function () {
  "use strict";

  var SIZE = 6;
  var WORDS_PER_GAME = 4;
  // Letras de relleno: sin K, W, X, Y, Ñ para no confundir a quien empieza a leer.
  var FILLER = "ABCDEFGHIJLMNOPRSTUV";
  // Colores del marcador de cada palabra encontrada (cápsula y tarjeta).
  var COLORS = [
    { pill: "rgba(255, 159, 10, 0.42)", card: "#fff1dc" },
    { pill: "rgba(52, 199, 89, 0.40)", card: "#e3f8e8" },
    { pill: "rgba(255, 45, 85, 0.32)", card: "#ffe4ea" },
    { pill: "rgba(90, 120, 255, 0.36)", card: "#e6ebff" },
    { pill: "rgba(48, 176, 199, 0.40)", card: "#e0f6f9" }
  ];

  var $ = function (sel) { return document.querySelector(sel); };
  function app() { return window.PipiApp || {}; }

  var game = null;     // { grid, targets, found, colorIdx }
  var sel = null;      // selección en curso (arrastre)
  var tapStart = null; // primera letra tocada (modo "tocar inicio y fin")

  function letters(word) {
    return Array.from(word.normalize("NFC").toUpperCase());
  }

  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* ---------- Palabras disponibles ---------- */
  function wordPool() {
    // Todas las palabras de los niveles de "Las palabras" (js/lessons.js).
    var cats = window.PIPI_LESSONS ? window.PIPI_LESSONS.lectura.categories : {};
    var pool = [];
    Object.keys(cats).forEach(function (key) {
      var cat = cats[key];
      if (cat.group !== "palabras") return;
      cat.items.forEach(function (item) {
        var ls = letters(item.big);
        if (ls.length >= 3 && ls.length <= SIZE) {
          pool.push({ word: item.big, letters: ls, emoji: item.emoji, say: item.say || item.big, audio: item.audio });
        }
      });
    });
    return pool;
  }

  /* ---------- Generar la cuadrícula ---------- */
  function tryPlace(grid, w) {
    var len = w.letters.length;
    for (var attempt = 0; attempt < 80; attempt++) {
      var horizontal = Math.random() < 0.5;
      var r = Math.floor(Math.random() * (horizontal ? SIZE : SIZE - len + 1));
      var c = Math.floor(Math.random() * (horizontal ? SIZE - len + 1 : SIZE));
      var ok = true;
      for (var i = 0; i < len; i++) {
        var cell = grid[horizontal ? r : r + i][horizontal ? c + i : c];
        if (cell && cell !== w.letters[i]) { ok = false; break; }
      }
      if (!ok) continue;
      for (var k = 0; k < len; k++) {
        grid[horizontal ? r : r + k][horizontal ? c + k : c] = w.letters[k];
      }
      return true;
    }
    return false;
  }

  function buildGame() {
    var pool = wordPool();
    for (var tries = 0; tries < 60; tries++) {
      var picks = shuffle(pool.slice()).slice(0, WORDS_PER_GAME);
      // Las palabras largas primero: es más fácil acomodarlas.
      picks.sort(function (a, b) { return b.letters.length - a.letters.length; });
      var grid = [];
      for (var r = 0; r < SIZE; r++) grid.push(new Array(SIZE).fill(null));
      var all = picks.every(function (w) { return tryPlace(grid, w); });
      if (!all) continue;
      for (var y = 0; y < SIZE; y++) {
        for (var x = 0; x < SIZE; x++) {
          if (!grid[y][x]) grid[y][x] = FILLER.charAt(Math.floor(Math.random() * FILLER.length));
        }
      }
      // Mostramos la lista en el orden de la partida, no por tamaño.
      return { grid: grid, targets: shuffle(picks), found: {}, colorIdx: 0 };
    }
    return null;
  }

  /* ---------- Pintar ---------- */
  function cellEl(r, c) {
    return document.querySelector('.ws-cell[data-r="' + r + '"][data-c="' + c + '"]');
  }

  function render() {
    var gridEl = $("#ws-grid");
    gridEl.innerHTML = "";
    gridEl.style.setProperty("--n", SIZE);
    livePill = null;
    pills = [];
    for (var r = 0; r < SIZE; r++) {
      for (var c = 0; c < SIZE; c++) {
        var d = document.createElement("div");
        d.className = "ws-cell";
        d.setAttribute("data-r", r);
        d.setAttribute("data-c", c);
        d.textContent = game.grid[r][c];
        gridEl.appendChild(d);
      }
    }

    var list = $("#ws-words");
    list.innerHTML = "";
    game.targets.forEach(function (w, i) {
      var li = document.createElement("li");
      li.className = "ws-word";
      li.setAttribute("data-i", i);
      // Toda la tarjeta es un botón grande para oír la palabra.
      var b = document.createElement("button");
      b.type = "button";
      b.className = "ws-word__btn";
      b.setAttribute("aria-label", "Escuchar " + w.word);
      b.addEventListener("click", function () { sayWord(w); });
      var em = document.createElement("span");
      em.className = "ws-word__emoji";
      em.textContent = w.emoji;
      var tx = document.createElement("span");
      tx.className = "ws-word__text";
      tx.textContent = w.word.toUpperCase();
      var sp = document.createElement("span");
      sp.className = "ws-word__listen";
      sp.innerHTML = window.PipiIcons ? window.PipiIcons.svg("speaker") : "";
      b.appendChild(em);
      b.appendChild(tx);
      b.appendChild(sp);
      li.appendChild(b);
      list.appendChild(li);
    });
    setMsgHtml("Busca las palabras " + arrows());
  }

  /* ---------- Marcador (cápsula bajo las letras) ---------- */
  var livePill = null;
  var pills = [];   // [{ el, cells }]

  function placePill(el, cells) {
    if (!cells.length) return;
    var a = cellEl(cells[0].r, cells[0].c);
    var b = cellEl(cells[cells.length - 1].r, cells[cells.length - 1].c);
    if (!a || !b) return;
    var pad = 2;
    var left = Math.min(a.offsetLeft, b.offsetLeft) + pad;
    var top = Math.min(a.offsetTop, b.offsetTop) + pad;
    var right = Math.max(a.offsetLeft + a.offsetWidth, b.offsetLeft + b.offsetWidth) - pad;
    var bottom = Math.max(a.offsetTop + a.offsetHeight, b.offsetTop + b.offsetHeight) - pad;
    el.style.left = left + "px";
    el.style.top = top + "px";
    el.style.width = (right - left) + "px";
    el.style.height = (bottom - top) + "px";
  }

  function newPill(cls) {
    var el = document.createElement("div");
    el.className = "ws-pill " + cls;
    $("#ws-grid").appendChild(el);
    return el;
  }

  function showLive(cells) {
    if (!livePill) livePill = newPill("ws-pill--live");
    livePill.className = "ws-pill ws-pill--live";
    livePill.hidden = false;
    placePill(livePill, cells);
  }

  function hideLive() { if (livePill) livePill.hidden = true; }

  window.addEventListener("resize", function () {
    pills.forEach(function (p) { placePill(p.el, p.cells); });
  });

  function arrows() {
    var I = window.PipiIcons;
    return I ? '<span class="inline-ico">' + I.svg("arrow-right") + '</span><span class="inline-ico">' + I.svg("arrow-down") + "</span>" : "";
  }

  function setMsgHtml(h) {
    var m = $("#ws-msg");
    if (m) m.innerHTML = h;
  }

  function setMsg(t) {
    var m = $("#ws-msg");
    if (m) m.textContent = t;
  }

  function sayWord(w) {
    var a = app();
    if (!w.audio) { if (a.stopAll) a.stopAll(); if (a.speak) a.speak(w.say, "es"); return; }
    if (a.playAudio) a.playAudio(a.audioBase + w.audio, w.say, "es");
  }

  /* ---------- Selección ---------- */
  function cellFromPoint(x, y) {
    var el = document.elementFromPoint(x, y);
    var cell = el && el.closest ? el.closest(".ws-cell") : null;
    if (!cell) return null;
    return { r: +cell.getAttribute("data-r"), c: +cell.getAttribute("data-c") };
  }

  // Devuelve las celdas en línea recta (fila o columna) entre a y b.
  function lineCells(a, b) {
    var out = [];
    if (a.r === b.r) {
      var c0 = Math.min(a.c, b.c), c1 = Math.max(a.c, b.c);
      for (var c = c0; c <= c1; c++) out.push({ r: a.r, c: c });
    } else if (a.c === b.c) {
      var r0 = Math.min(a.r, b.r), r1 = Math.max(a.r, b.r);
      for (var r = r0; r <= r1; r++) out.push({ r: r, c: a.c });
    }
    return out;
  }

  // Mientras arrastra, ajusta el final a la misma fila o columna.
  function snap(start, cur) {
    if (Math.abs(cur.c - start.c) >= Math.abs(cur.r - start.r)) return { r: start.r, c: cur.c };
    return { r: cur.r, c: start.c };
  }

  function clearMarks() {
    Array.prototype.forEach.call(document.querySelectorAll(".ws-cell.is-start"), function (el) {
      el.classList.remove("is-start");
    });
    hideLive();
  }

  function markSelecting(cells) {
    Array.prototype.forEach.call(document.querySelectorAll(".ws-cell.is-start"), function (el) {
      el.classList.remove("is-start");
    });
    showLive(cells);
  }

  function evaluate(cells) {
    if (cells.length < 2) return;
    var text = cells.map(function (p) { return game.grid[p.r][p.c]; }).join("");
    for (var i = 0; i < game.targets.length; i++) {
      if (game.found[i]) continue;
      if (game.targets[i].letters.join("") === text) { foundWord(i, cells); return; }
    }
    var a = app();
    if (a.playSfx) a.playSfx("wrong");
    var bad = newPill("ws-pill--wrong");
    placePill(bad, cells);
    setTimeout(function () { bad.remove(); }, 450);
    setMsg("Casi... ¡inténtalo otra vez!");
  }

  function foundWord(i, cells) {
    var a = app();
    var w = game.targets[i];
    var color = COLORS[game.colorIdx++ % COLORS.length];
    game.found[i] = true;
    var pill = newPill("ws-pill--found");
    pill.style.setProperty("--pill", color.pill);
    placePill(pill, cells);
    pills.push({ el: pill, cells: cells });
    var li = document.querySelector('.ws-word[data-i="' + i + '"]');
    if (li) {
      li.classList.add("is-found");
      li.style.setProperty("--found-bg", color.card);
      var ic = li.querySelector(".ws-word__listen");
      if (ic && window.PipiIcons) ic.innerHTML = window.PipiIcons.svg("check");
    }

    if (a.playSfx) a.playSfx("correct");
    if (a.celebrate) a.celebrate();
    if (a.expression) a.expression("happy", 2500);
    var name = a.childName ? a.childName() : "";
    setMsg("¡Encontraste " + w.word.toUpperCase() + ", " + name + "! " + w.emoji);
    sayWord(w);

    var left = game.targets.length - Object.keys(game.found).length;
    if (left === 0) {
      setTimeout(finishGame, 1400);
    }
  }

  function finishGame() {
    var a = app();
    if (a.addStar) a.addStar("juego:sopa:" + Date.now());
    var name = a.childName ? a.childName() : "";
    if (a.showParty) {
      a.showParty("¡FELICIDADES, " + name + "!", "¡Encontraste todas las palabras! 🔍",
        (window.PipiIcons ? '<span class="score-stars">' + window.PipiIcons.svg("star") + "</span> " : "") + "¡Ganaste una estrella!", function () { start(); });
    } else {
      start();
    }
  }

  /* ---------- Eventos de la cuadrícula ---------- */
  function onDown(e) {
    var p = cellFromPoint(e.clientX, e.clientY);
    if (!p) return;
    e.preventDefault();
    sel = { start: p, end: p, moved: false, id: e.pointerId };
    var gridEl = $("#ws-grid");
    try { gridEl.setPointerCapture(e.pointerId); } catch (err) {}
    markSelecting([p]);
    if (tapStart) cellEl(tapStart.r, tapStart.c).classList.add("is-start");
  }

  function onMove(e) {
    if (!sel || e.pointerId !== sel.id) return;
    var p = cellFromPoint(e.clientX, e.clientY);
    if (!p) return;
    var end = snap(sel.start, p);
    if (end.r !== sel.end.r || end.c !== sel.end.c) {
      sel.end = end;
      sel.moved = true;
      markSelecting(lineCells(sel.start, end));
    }
  }

  function onUp(e) {
    if (!sel || e.pointerId !== sel.id) return;
    var s = sel;
    sel = null;
    clearMarks();
    var a = app();

    if (s.moved && (s.start.r !== s.end.r || s.start.c !== s.end.c)) {
      tapStart = null;
      evaluate(lineCells(s.start, s.end));
      return;
    }

    // Toque simple: primera letra, luego la última.
    var p = s.start;
    if (!tapStart) {
      tapStart = p;
      cellEl(p.r, p.c).classList.add("is-start");
      if (a.playSfx) a.playSfx("drag");
      return;
    }
    if (tapStart.r === p.r && tapStart.c === p.c) {
      tapStart = null; // tocar la misma letra la desmarca
      return;
    }
    var first = tapStart;
    tapStart = null;
    var cells = lineCells(first, p);
    if (!cells.length) {
      // No está en la misma fila ni columna: empezamos desde esta letra.
      tapStart = p;
      cellEl(p.r, p.c).classList.add("is-start");
      setMsgHtml("Toca letras en la misma fila " + arrows());
      return;
    }
    evaluate(cells);
  }

  var bound = false;
  function bindOnce() {
    if (bound) return;
    bound = true;
    var gridEl = $("#ws-grid");
    gridEl.addEventListener("pointerdown", onDown);
    gridEl.addEventListener("pointermove", onMove);
    gridEl.addEventListener("pointerup", onUp);
    gridEl.addEventListener("pointercancel", function () { sel = null; clearMarks(); });
    var nb = $("#ws-new");
    if (nb) nb.addEventListener("click", start);
    var back = $("#ws-back");
    if (back) back.addEventListener("click", function () {
      if (window.PipiGames) window.PipiGames.open();
    });
  }

  function start() {
    bindOnce();
    game = buildGame();
    sel = null;
    tapStart = null;
    if (!game) return;
    var a = app();
    if (a.show) a.show("wordsearch");
    render();
  }

  window.PipiWordSearch = { start: start, _build: buildGame };
})();

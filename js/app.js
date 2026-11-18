/* =========================================================
   PIPI · Lógica de la aplicación
   - Navegación entre pantallas
   - Voz (voz del dispositivo, gratis y sin conexión)
   - Progreso y estrellas guardados en el teléfono
   ========================================================= */

(function () {
  "use strict";

  /* ---------------- Utilidades ---------------- */
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  var STORE_KEY = "pipi.progress.v2";
  function icon(name) { return window.PipiIcons ? window.PipiIcons.svg(name) : ""; }
  // Marcador de aciertos y errores con íconos (sin emojis).
  function scoreHtml(ok, bad, long) {
    return '<span class="score score--ok">' + icon("check") + ok + (long ? " aciertos" : "") + "</span>" +
      '<span class="score score--bad">' + icon("xmark") + bad + (long ? " errores" : "") + "</span>";
  }
  var audioBase = "assets/audio/";
  var pipi3d = null;

  var state = {
    done: {},      // {"lectura:letras:0": true, ...}
    muted: false,
    name: "",
    expressionRate: "normal",
    furColor: "#a9a7a1",
    unlockedSyllableLevel: 1,
    syllableStats: { byLevel: {} }
  };

  /* ---------------- Persistencia ---------------- */
  function loadState() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        var saved = JSON.parse(raw);
        if (saved && typeof saved === "object") {
          state.done = saved.done && typeof saved.done === "object" ? saved.done : {};
          state.muted = !!saved.muted;
          state.name = typeof saved.name === "string" ? saved.name.slice(0, 20) : "";
          state.expressionRate = saved.expressionRate === "low" || saved.expressionRate === "high" ? saved.expressionRate : "normal";
          state.furColor = typeof saved.furColor === "string" && /^#[0-9a-fA-F]{6}$/.test(saved.furColor) ? saved.furColor : "#a9a7a1";
          // El gris antiguo se cambia por el gris real del peluche.
          if (state.furColor.toLowerCase() === "#8b93a2") state.furColor = "#a9a7a1";
          state.unlockedSyllableLevel = (saved.unlockedSyllableLevel >= 1 && saved.unlockedSyllableLevel <= 4) ? saved.unlockedSyllableLevel : 1;
          state.syllableStats = (saved.syllableStats && typeof saved.syllableStats === "object") ? saved.syllableStats : { byLevel: {} };
          if (!state.syllableStats.byLevel) state.syllableStats.byLevel = {};
        }
      }
    } catch (e) { /* almacenamiento no disponible: seguimos en memoria */ }
  }

  function saveState() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({
        done: state.done,
        muted: state.muted,
        name: state.name,
        expressionRate: state.expressionRate,
        furColor: state.furColor,
        unlockedSyllableLevel: state.unlockedSyllableLevel,
        syllableStats: state.syllableStats
      }));
    } catch (e) { /* modo privado: no pasa nada */ }
  }

  function starCount() { return Object.keys(state.done).length; }

  var RATE_MS = { low: 30000, normal: 14000, high: 7000 };
  function rateMs() { return RATE_MS[state.expressionRate] || RATE_MS.normal; }
  function childName() { return (state.name || "").trim() || "amiga"; }

  function updateHomeGreeting() {
    var hg = $("#home-greeting");
    if (hg) hg.textContent = state.name ? "¡Hola, " + state.name + "!" : "¡Hola!";
  }

  /* ---------------- Voz ---------------- */
  var voices = [];

  function refreshVoices() {
    try { voices = window.speechSynthesis ? (window.speechSynthesis.getVoices() || []) : []; }
    catch (e) { voices = []; }
  }

  function pickVoice(lang) {
    if (!voices.length) refreshVoices();
    var code = lang === "en" ? "en" : "es";
    var match = null;
    for (var i = 0; i < voices.length; i++) {
      var v = voices[i];
      if (v.lang && v.lang.toLowerCase().indexOf(code) === 0) {
        // Preferimos voces locales (funcionan sin internet)
        if (!match) match = v;
        if (v.localService) return v;
      }
    }
    return match;
  }

  var speechAvailable = ("speechSynthesis" in window) && ("SpeechSynthesisUtterance" in window);

  if (speechAvailable) {
    refreshVoices();
    window.speechSynthesis.onvoiceschanged = refreshVoices;
    // En algunos navegadores hay que "despertar" la voz con una interacción.
    document.addEventListener("pointerdown", refreshVoices, { once: true });
  }

  function setTalking(on) {
    $$(".koala").forEach(function (k) { k.classList.toggle("is-talking", on); });
    if (pipi3d) pipi3d.talk(on);
  }

  function speak(text, lang) {
    if (!text || state.muted || !speechAvailable) return;
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = lang === "en" ? "en-US" : "es-MX";
      u.rate = 0.82;   // un poco lento, ideal para niños
      u.pitch = 1.15;  // voz más aguda y amigable
      var v = pickVoice(lang === "en" ? "en" : "es");
      if (v) u.voice = v;
      u.volume = 1;
      u.onstart = function () { setTalking(true); };
      u.onend = function () { setTalking(false); };
      u.onerror = function () { setTalking(false); };
      if (window.speechSynthesis.resume) { try { window.speechSynthesis.resume(); } catch (e) {} }
      window.speechSynthesis.speak(u);
    } catch (e) { setTalking(false); }
  }

  function stopSpeech() {
    if (speechAvailable) { try { window.speechSynthesis.cancel(); } catch (e) {} }
    setTalking(false);
  }

  var currentAudio = null;

  function stopAudio() {
    if (currentAudio) {
      try { currentAudio.pause(); currentAudio.currentTime = 0; } catch (e) {}
      currentAudio = null;
    }
    setTalking(false);
  }

  function stopAll() {
    stopAudio();
    stopSpeech();
  }

  /* Reproduce el audio real (MP3) y, si falla, usa la voz del dispositivo. */
  function playAudio(url, fallbackText, lang, onEnded) {
    if (state.muted) return;
    stopAudio();
    stopSpeech();
    var a;
    try { a = new Audio(url); } catch (e) { speak(fallbackText, lang); return; }
    currentAudio = a;
    a.volume = 1;
    a.onplay = function () { setTalking(true); };
    a.onended = function () {
      if (currentAudio === a) { currentAudio = null; }
      setTalking(false);
      if (onEnded) onEnded();
    };
    a.onerror = function () {
      if (currentAudio === a) { currentAudio = null; }
      setTalking(false);
      speak(fallbackText, lang);
    };
    var p = a.play();
    if (p && typeof p.catch === "function") {
      p.catch(function () {
        if (currentAudio === a) { currentAudio = null; }
        setTalking(false);
        speak(fallbackText, lang);
      });
    }
  }

  /* Dice una frase personalizada (con el nombre). Si el telefono no tiene
     voz, reproduce el audio grabado como respaldo. */
  function speakPersonalized(text, fallbackUrl, fallbackText, lang, name) {
    if (state.muted) return;
    stopAll();
    var lg = lang === "en" ? "en" : "es";
    // Siempre suena el audio grabado de PIPI (fiable).
    playAudio(fallbackUrl, fallbackText, lg, function () {
      if (name) speakName(name, lg);
    });
  }

  /* Audio grabado del nombre de la niña. Para no escribir su nombre en el
     código (el repositorio es público) guardamos solo una "huella" (hash
     FNV-1a) del nombre normalizado. tools/generate-name.mjs la calcula. */
  var NAME_AUDIO = { "f589a39d": "nombre.mp3" };

  function nameHash(s) {
    var x = 0x811c9dc5;
    for (var i = 0; i < s.length; i++) {
      x ^= s.charCodeAt(i);
      x = Math.imul(x, 0x01000193) >>> 0;
    }
    return ("0000000" + x.toString(16)).slice(-8);
  }

  function normalizeName(s) {
    return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "").trim();
  }

  function speakName(name) {
    if (!name || state.muted) return;
    var key = nameHash(normalizeName(name));
    var file = NAME_AUDIO[key];
    if (!file) return;
    try {
      var a = new Audio(audioBase + "ui/" + file);
      a.volume = 1;
      a.play().catch(function () {});
    } catch (e) {}
  }

  /* ---------------- Sonidos y música ---------------- */
  var sfxCtx = null;

  function ensureSfx() {
    if (!sfxCtx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (AC) sfxCtx = new AC();
    }
    if (sfxCtx && sfxCtx.state === "suspended") {
      try { sfxCtx.resume(); } catch (e) {}
    }
    return sfxCtx;
  }

  function tone(ctx, freq, start, dur, gain) {
    var o = ctx.createOscillator();
    var g = ctx.createGain();
    o.type = "triangle";
    o.frequency.setValueAtTime(freq, start);
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(gain || 0.1, start + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    o.connect(g);
    g.connect(ctx.destination);
    o.start(start);
    o.stop(start + dur + 0.02);
  }

  function playSfx(type) {
    if (state.muted) return;
    var ctx = ensureSfx();
    if (!ctx) return;
    var now = ctx.currentTime;
    if (type === "drag") {
      tone(ctx, 520, now, 0.08, 0.06);
    } else if (type === "drop") {
      tone(ctx, 700, now, 0.1, 0.1);
    } else if (type === "correct") {
      [523, 659, 784, 1047].forEach(function (f, i) { tone(ctx, f, now + i * 0.09, 0.18, 0.12); });
    } else if (type === "wrong") {
      tone(ctx, 220, now, 0.16, 0.1);
      tone(ctx, 180, now + 0.14, 0.2, 0.08);
    }
  }

  var partyMusicTimer = null;

  function playPartyMusic() {
    if (state.muted) return;
    var ctx = ensureSfx();
    if (!ctx) return;
    stopPartyMusic();
    var notes = [523, 659, 784, 1047, 784, 659, 523, 659, 784, 1047, 1319, 1047];
    var i = 0;
    function note() {
      if (!ctx) return;
      tone(ctx, notes[i % notes.length], ctx.currentTime, 0.18, 0.08);
      i++;
    }
    note();
    partyMusicTimer = setInterval(note, 220);
  }

  function stopPartyMusic() {
    if (partyMusicTimer) {
      clearInterval(partyMusicTimer);
      partyMusicTimer = null;
    }
  }

  /* ---------------- Personaje PIPI (SVG de respaldo, sin 3D) ----------------
     Dibujo igual al peluche real: huevo gris, cuerno de unicornio rosa,
     orejas de borrego, ojos y nariz bordados y corazón de brillantina. */
  function koalaSVG() {
    return (
      '<svg class="koala" viewBox="0 0 320 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="PIPI, el koala unicornio">' +
        '<defs>' +
          '<radialGradient id="pipiFur" cx="45%" cy="35%" r="75%">' +
            '<stop offset="0%" stop-color="#c4c2bc"/>' +
            '<stop offset="100%" stop-color="#97958f"/>' +
          '</radialGradient>' +
          '<linearGradient id="pipiHorn" x1="0" y1="1" x2="0" y2="0">' +
            '<stop offset="0%" stop-color="#e8458a"/>' +
            '<stop offset="65%" stop-color="#f2b9b0"/>' +
            '<stop offset="100%" stop-color="#f8d3c6"/>' +
          '</linearGradient>' +
          '<radialGradient id="pipiHeart" cx="45%" cy="40%" r="70%">' +
            '<stop offset="0%" stop-color="#f070ad"/>' +
            '<stop offset="100%" stop-color="#c94a8a"/>' +
          '</radialGradient>' +
        '</defs>' +

        /* Orejas de borrego */
        '<g class="ear ear-left"><ellipse cx="66" cy="140" rx="34" ry="46" fill="#d3cec2" stroke="#bdb7aa" stroke-width="4" stroke-dasharray="3 5"/></g>' +
        '<g class="ear ear-right"><ellipse cx="254" cy="140" rx="34" ry="46" fill="#d3cec2" stroke="#bdb7aa" stroke-width="4" stroke-dasharray="3 5"/></g>' +

        /* Cuerpo en forma de huevo */
        '<path class="body" d="M160 62 C238 62 282 150 282 222 C282 292 228 330 160 330 C92 330 38 292 38 222 C38 150 82 62 160 62 Z" fill="url(#pipiFur)"/>' +

        /* Cuerno (encima del cuerpo, como en el peluche) */
        '<path d="M140 74 L157 8 Q161 1 165 8 L182 74 Q161 82 140 74 Z" fill="url(#pipiHorn)"/>' +

        /* Ojos bordados */
        '<g class="eye eye-left">' +
          '<circle cx="110" cy="140" r="24" fill="#8f908b"/>' +
          '<circle cx="110" cy="140" r="21" fill="#23272a"/>' +
          '<ellipse cx="117" cy="131" rx="7" ry="6" fill="#f6f6f0"/>' +
          '<circle cx="103" cy="149" r="2.6" fill="#f6f6f0"/>' +
        '</g>' +
        '<g class="eye eye-right">' +
          '<circle cx="210" cy="140" r="24" fill="#8f908b"/>' +
          '<circle cx="210" cy="140" r="21" fill="#23272a"/>' +
          '<ellipse cx="217" cy="131" rx="7" ry="6" fill="#f6f6f0"/>' +
          '<circle cx="203" cy="149" r="2.6" fill="#f6f6f0"/>' +
        '</g>' +

        /* Nariz bordada */
        '<path class="nose" d="M160 118 C184 118 190 138 185 154 C181 168 171 178 160 178 C149 178 139 168 135 154 C130 138 136 118 160 118 Z" fill="#7f8183" stroke="#3f4245" stroke-width="4"/>' +
        '<path d="M152 172 q8 -5 16 0" stroke="#3f4245" stroke-width="3" fill="none" stroke-linecap="round"/>' +

        /* Boca: el peluche no tiene; solo se ve al hablar */
        '<path class="mouth-closed" d="M160 190 v0" stroke="none" fill="none"/>' +
        '<ellipse class="mouth-open" cx="160" cy="194" rx="11" ry="7" fill="#4a2f3a"/>' +

        /* Corazón de brillantina */
        '<path d="M160 214 C170 186 246 186 244 232 C242 262 196 286 160 314 C124 286 78 262 76 232 C74 186 150 186 160 214 Z" fill="#b98096"/>' +
        '<path d="M160 222 C169 198 234 198 232 234 C230 258 192 280 160 302 C128 280 90 258 88 234 C86 198 151 198 160 222 Z" fill="url(#pipiHeart)"/>' +
        '<g fill="#ffffff" opacity="0.8"><circle cx="120" cy="230" r="2"/><circle cx="196" cy="226" r="2.2"/><circle cx="150" cy="262" r="1.8"/><circle cx="182" cy="250" r="2"/><circle cx="135" cy="246" r="1.5"/><circle cx="210" cy="240" r="1.6"/><circle cx="165" cy="284" r="1.8"/></g>' +
      '</svg>'
    );
  }

  /* ---------------- Navegación ---------------- */
  var currentScreen = "home";
  var currentModule = "lectura";
  var currentCat = null;
  var currentIndex = 0;
  var busy = false;

  function show(name) {
    stopAll();
    currentScreen = name;
    $$(".screen").forEach(function (s) {
      s.classList.toggle("is-active", s.id === "screen-" + name);
    });
    var active = $("#screen-" + name);
    if (active) active.scrollTop = 0;

    if (pipi3d) {
      if (name === "home") { pipi3d.attach($("#koala-home")); pipi3d.setExpression("idle"); }
      else if (name === "welcome") { pipi3d.attach($("#koala-welcome")); pipi3d.setExpression("happy", 4000); }
      else if (name === "activity") pipi3d.attach($("#koala-mini"));
      else if (name === "settings") { pipi3d.attach($("#koala-settings")); pipi3d.setExpression("idle"); }
      else if (name === "wordsearch") { pipi3d.attach($("#koala-games")); pipi3d.setExpression("happy", 2000); }
      else pipi3d.hide();
    }

    if (name === "chat" && window.PipiChat) window.PipiChat.enter();
  }

  function goHome() { show("home"); }

  /* ---------------- Estrellas ---------------- */
  function updateStars() {
    var n = starCount();
    var a = $("#home-stars"); if (a) a.textContent = n;
    var b = $("#menu-stars"); if (b) b.textContent = n;
    var c = $("#rewards-stars"); if (c) c.textContent = n;
    var d = $("#games-stars"); if (d) d.textContent = n;
  }

  function isDone(mod, cat, idx) {
    return !!state.done[mod + ":" + cat + ":" + idx];
  }

  /* ---------------- Menú ---------------- */
  // Ícono de cada categoría: letras blancas o un dibujo dentro del cuadro de color.
  var CATEGORY_GLYPHS = {
    letras: { t: "Aa" },
    palabras: { t: "sol" }, frases: { t: "Mi" },
    saludos: { t: "Hi!" }, colores: { i: "palette" }, numeros: { t: "123" },
    animales: { i: "paw" }, familia: { i: "people" }, cuerpo: { i: "face" }
  };

  function categoryGlyph(key, cat) {
    var g = CATEGORY_GLYPHS[key];
    if (key.indexOf("silabas") === 0) {
      var n = parseInt(key.replace("silabas", ""), 10);
      return '<span class="glyph-text">ma</span><span class="glyph-level">' + n + "</span>";
    }
    if (g && g.i) return icon(g.i);
    if (g && g.t) return '<span class="glyph-text' + (g.t.length > 2 ? " glyph-text--small" : "") + '">' + g.t + "</span>";
    return '<span class="glyph-text">' + (cat.title || "?").charAt(0) + "</span>";
  }
  function openModule(mod) {
    currentModule = mod;
    var data = window.PIPI_LESSONS[mod];
    $("#menu-title").textContent = data.title;
    $("#menu-subtitle").textContent = data.subtitle || "";

    var grid = $("#menu-grid");
    grid.innerHTML = "";
    Object.keys(data.categories).forEach(function (key) {
      var cat = data.categories[key];
      var levelMatch = key.match(/^silabas(\d+)$/);
      var level = levelMatch ? parseInt(levelMatch[1], 10) : 0;
      var locked = level > state.unlockedSyllableLevel;
      var btn = document.createElement("button");
      btn.className = "menu-card menu-card--" + mod + (locked ? " is-locked" : "");
      btn.innerHTML =
        '<span class="menu-card__icon">' + categoryGlyph(key, cat) + "</span>" +
        '<span class="menu-card__title">' + cat.title + "</span>" +
        '<span class="menu-card__count">' + cat.items.length + " tarjetas</span>" +
        (locked ? '<span class="menu-card__lock">' + icon("lock") + "</span>" : "");
      btn.addEventListener("click", function () {
        if (locked) {
          showToast("Completa el nivel anterior para desbloquear 😊");
          return;
        }
        startCategory(mod, key);
      });
      grid.appendChild(btn);
    });

    updateStars();
    show("menu");
  }

  /* ---------------- Cuentos ---------------- */
  var currentStory = null;

  function openStories() {
    var grid = $("#stories-grid");
    if (!grid) return;
    grid.innerHTML = "";
    var stories = window.PIPI_STORIES || [];
    stories.forEach(function (s, i) {
      var b = document.createElement("button");
      b.className = "story-card";
      b.style.setProperty("--story-a", s.color);
      b.style.setProperty("--story-b", s.color2);
      var done = !!state.done["cuento:" + s.slug];
      b.innerHTML =
        '<span class="story-card__emoji">' + s.emoji + "</span>" +
        '<span class="story-card__body">' +
          '<span class="story-card__title">' + s.title + "</span>" +
          '<span class="story-card__count">' + (done ? "Leído · " : "") + s.lines.length + " líneas</span>" +
        "</span>" +
        (done ? '<span class="story-card__done">' + icon("check") + "</span>" : "") +
        '<span class="story-card__chev">' + icon("chevron-right") + "</span>";
      b.addEventListener("click", function () { openStory(i); });
      grid.appendChild(b);
    });
    show("stories");
  }

  function openStory(index) {
    var stories = window.PIPI_STORIES || [];
    var s = stories[index];
    if (!s) return;
    currentStory = s;
    var page = $("#story-page");
    if (page) {
      page.style.setProperty("--story-a", s.color);
      page.style.setProperty("--story-b", s.color2);
    }
    var emoji = $("#story-emoji"); if (emoji) emoji.textContent = s.emoji;
    var title = $("#story-title"); if (title) title.textContent = s.title;
    var head = $("#story-head-title"); if (head) head.textContent = s.title;
    var text = $("#story-text");
    if (text) {
      text.innerHTML = "";
      s.lines.forEach(function (line) {
        var p = document.createElement("p");
        p.textContent = line;
        text.appendChild(p);
      });
    }
    show("story");
  }

  function listenStory() {
    if (!currentStory) return;
    stopAll();
    playAudio(audioBase + "cuentos/" + currentStory.slug + ".mp3", currentStory.lines.join(" "), "es");
  }

  function awardStory() {
    if (!currentStory) return;
    var key = "cuento:" + currentStory.slug;
    var isNew = !state.done[key];
    if (isNew) {
      state.done[key] = true;
      saveState();
      updateStars();
    }
    burstStars();
    celebrateBanner("¡Leíste el cuento, " + childName() + "! 📚");
    var praise = randomPraise();
    var praiseText = praise.text.replace(/{name}/g, childName());
    speakPersonalized(praiseText, audioBase + "ui/" + praise.slug + ".mp3", praise.audioText, praise.lang, null);
    showToast("¡Cuento leído! ⭐");
  }

  /* ---------------- Actividad ---------------- */
  function getCategory() {
    return window.PIPI_LESSONS[currentModule].categories[currentCat];
  }

  function startCategory(mod, catKey) {
    currentModule = mod;
    currentCat = catKey;
    currentIndex = 0;
    show("activity");
    renderActivity();
  }

  function buildCard(kind, item, mod) {
    if (mod === "ingles") {
      return '<div class="card card--english">' +
        '<div class="card__emoji">' + (item.emoji || "💬") + "</div>" +
        '<div class="card__big">' + item.en + "</div>" +
        '<div class="card__word">' + item.es + "</div>" +
        "</div>";
    }
    if (kind === "letter") {
      return '<div class="card card--letter">' +
        '<div class="card__emoji">' + (item.emoji || "🔤") + "</div>" +
        '<div class="card__big">' + item.big + "</div>" +
        '<div class="card__word">' + (item.word || "") + "</div>" +
        "</div>";
    }
    if (kind === "syllables") {
      return '<div class="card card--syllables">' +
        '<div class="card__emoji">' + (item.emoji || "🔡") + "</div>" +
        '<div class="card__big card__big--small">' + item.big + "</div>" +
        "</div>";
    }
    if (kind === "sentence") {
      return '<div class="card card--sentence">' +
        '<div class="card__emoji">' + (item.emoji || "📖") + "</div>" +
        '<div class="card__sentence">' + item.big + "</div>" +
        "</div>";
    }
    // palabra
    return '<div class="card card--word">' +
      '<div class="card__emoji">' + (item.emoji || "📝") + "</div>" +
      '<div class="card__big">' + item.big + "</div>" +
      "</div>";
  }

  function autoSpeak(kind, item) {
    var lang = currentModule === "ingles" ? "en" : "es";
    var text = currentModule === "ingles" ? item.en : (item.say || item.big);
    var url = audioBase + currentModule + "/" + currentCat + "/" + currentIndex + ".mp3";
    playAudio(url, text, lang);
  }

  function renderActivity() {
    var cat = getCategory();
    var item = cat.items[currentIndex];

    $("#activity-title").textContent = cat.title;
    $("#activity-progress").textContent = (currentIndex + 1) + " / " + cat.items.length;

    var starBtn = $("#btn-star");
    if (starBtn) starBtn.style.display = cat.kind === "order" ? "none" : "";

    if (cat.kind === "order") {
      renderOrderGame(item);
      return;
    }

    $("#activity-stage").innerHTML = buildCard(cat.kind, item, currentModule);

    var card = $("#activity-stage .card");
    var hint = document.createElement("div");
    hint.className = "card__hint";
    hint.innerHTML = 'Primero inténtalo · toca <span class="inline-ico">' + icon("speaker") + "</span> para escuchar";
    if (card) card.appendChild(hint);

    if (pipi3d) pipi3d.setExpression("thinking", 120000);
  }

  function shuffleSyllables(arr, word) {
    var a = arr.slice();
    var same = true;
    for (var attempt = 0; attempt < 12; attempt++) {
      for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = a[i]; a[i] = a[j]; a[j] = t;
      }
      same = a.join("") === word;
      if (!same) break;
    }
    if (same && a.length > 1) {
      var t2 = a[0]; a[0] = a[1]; a[1] = t2;
    }
    return a;
  }

  function renderOrderGame(item) {
    var stage = $("#activity-stage");
    var syllables = item.syllables || [];
    var shuffled = shuffleSyllables(syllables, item.big);

    var slotsHtml = syllables.map(function () {
      return '<button type="button" class="order-slot" data-slot></button>';
    }).join("");
    var chipsHtml = shuffled.map(function (s, i) {
      return '<button type="button" class="order-chip" data-chip="' + i + '">' + s + "</button>";
    }).join("");

    stage.innerHTML =
      '<div class="card card--order">' +
        '<div class="card__emoji">' + (item.emoji || "🧩") + "</div>" +
        '<div class="order-slots" id="order-slots">' + slotsHtml + "</div>" +
        '<div class="order-pool" id="order-pool">' + chipsHtml + "</div>" +
        '<div class="card__hint">Arrastra o toca las sílabas en orden</div>' +
        '<div class="order-score" id="order-score"></div>' +
      "</div>";

    var slotEls = Array.prototype.slice.call(stage.querySelectorAll(".order-slot"));
    var chipEls = Array.prototype.slice.call(stage.querySelectorAll(".order-chip"));
    var slots = new Array(syllables.length).fill(null);
    var filled = 0;
    var drag = null;
    var lastDrop = 0;

    function levelStats() {
      var key = currentCat || "";
      if (!state.syllableStats.byLevel) state.syllableStats.byLevel = {};
      if (!state.syllableStats.byLevel[key]) state.syllableStats.byLevel[key] = { correct: 0, errors: 0 };
      return state.syllableStats.byLevel[key];
    }

    function updateScore() {
      var st = levelStats();
      var el = stage.querySelector("#order-score");
      if (el) el.innerHTML = scoreHtml(st.correct, st.errors);
    }

    function placeChip(chip, slotIndex) {
      if (!chip || chip.classList.contains("is-used")) return false;
      var idx = (typeof slotIndex === "number") ? slotIndex : -1;
      if (idx === -1) {
        for (var i = 0; i < slots.length; i++) {
          if (!slots[i]) { idx = i; break; }
        }
      }
      if (idx === -1 || slots[idx]) return false;
      slots[idx] = chip;
      chip.classList.add("is-used");
      chip.disabled = true;
      slotEls[idx].textContent = chip.textContent;
      slotEls[idx].classList.add("is-filled");
      filled++;
      if (filled === slots.length) checkOrder();
      return true;
    }

    function removeSlot(idx) {
      var chip = slots[idx];
      if (!chip) return;
      slots[idx] = null;
      chip.classList.remove("is-used");
      chip.disabled = false;
      slotEls[idx].textContent = "";
      slotEls[idx].classList.remove("is-filled", "is-correct", "is-wrong");
      filled--;
    }

    function checkOrder() {
      var formed = slots.map(function (c) { return c ? c.textContent : ""; }).join("");
      var st = levelStats();
      if (formed === item.big) {
        st.correct++;
        saveState();
        updateScore();
        slotEls.forEach(function (s) { s.classList.add("is-correct"); });
        playSfx("correct");
        awardStar();
      } else {
        st.errors++;
        saveState();
        updateScore();
        slotEls.forEach(function (s) { s.classList.add("is-wrong"); });
        playSfx("wrong");
        speak("Casi... inténtalo otra vez.", "es");
        setTimeout(function () {
          for (var i = 0; i < slots.length; i++) removeSlot(i);
          slotEls.forEach(function (s) { s.classList.remove("is-wrong", "is-correct"); });
        }, 900);
      }
    }

    function startDrag(e, chip) {
      if (chip.classList.contains("is-used")) return;
      if (e.button !== undefined && e.button !== 0) return;
      e.preventDefault();
      var ghost = chip.cloneNode(true);
      ghost.classList.add("order-chip--ghost");
      ghost.style.left = e.clientX + "px";
      ghost.style.top = e.clientY + "px";
      document.body.appendChild(ghost);
      chip.classList.add("is-dragging");
      drag = { chip: chip, ghost: ghost, startX: e.clientX, startY: e.clientY, moved: false };
      playSfx("drag");
      try { chip.setPointerCapture(e.pointerId); } catch (err) {}
      chip.addEventListener("pointermove", onDragMove);
      chip.addEventListener("pointerup", onDragEnd);
      chip.addEventListener("pointercancel", onDragEnd);
    }

    function onDragMove(e) {
      if (!drag) return;
      var dx = e.clientX - drag.startX;
      var dy = e.clientY - drag.startY;
      if (Math.abs(dx) > 6 || Math.abs(dy) > 6) drag.moved = true;
      drag.ghost.style.left = e.clientX + "px";
      drag.ghost.style.top = e.clientY + "px";
      var el = document.elementFromPoint(e.clientX, e.clientY);
      var slot = el && el.closest ? el.closest(".order-slot") : null;
      slotEls.forEach(function (s) {
        s.classList.toggle("is-hover", s === slot && !s.classList.contains("is-filled"));
      });
    }

    function onDragEnd(e) {
      if (!drag) return;
      var d = drag;
      drag = null;
      d.chip.removeEventListener("pointermove", onDragMove);
      d.chip.removeEventListener("pointerup", onDragEnd);
      d.chip.removeEventListener("pointercancel", onDragEnd);
      d.chip.classList.remove("is-dragging");
      if (d.ghost) d.ghost.remove();
      slotEls.forEach(function (s) { s.classList.remove("is-hover"); });

      var el = document.elementFromPoint(e.clientX, e.clientY);
      var slot = el && el.closest ? el.closest(".order-slot") : null;
      var placed = false;
      if (slot) {
        var idx = slotEls.indexOf(slot);
        if (idx !== -1) placed = placeChip(d.chip, idx);
      }
      if (!placed && !d.moved) placed = placeChip(d.chip);
      if (placed) {
        lastDrop = Date.now();
        playSfx("drop");
      }
    }

    chipEls.forEach(function (chip) {
      chip.addEventListener("pointerdown", function (e) { startDrag(e, chip); });
    });
    slotEls.forEach(function (slot, idx) {
      slot.addEventListener("click", function () {
        if (Date.now() - lastDrop < 350) return;
        removeSlot(idx);
      });
    });

    updateScore();
    if (pipi3d) pipi3d.setExpression("thinking", 120000);
  }

  function goPrev() {
    if (currentIndex > 0) { currentIndex -= 1; renderActivity(); }
  }

  function goNext() {
    var cat = getCategory();
    if (currentIndex < cat.items.length - 1) { currentIndex += 1; renderActivity(); }
    else finishCategory();
  }

  function finishCategory() {
    updateStars();

    var m = (currentCat || "").match(/^silabas(\d+)$/);
    if (m) {
      var lvl = parseInt(m[1], 10);
      var st = state.syllableStats.byLevel[currentCat] || { correct: 0, errors: 0 };
      var stars = st.errors <= 1 ? 3 : st.errors <= 3 ? 2 : 1;
      var grade = scoreHtml(st.correct, st.errors, true) + '<span class="score-stars">' + new Array(stars + 1).join(icon("star")) + "</span>";
      var unlockedNew = (lvl === state.unlockedSyllableLevel && lvl < 4);
      if (unlockedNew) {
        state.unlockedSyllableLevel = lvl + 1;
        saveState();
      }
      var sub = (lvl === 4) ? "¡Ganaste la copa! 🏆" : "¡Completaste el Nivel " + lvl + "! 🏆";
      showParty("¡FELICIDADES, " + childName() + "!", sub, grade, function () {
        if (unlockedNew) openModule(currentModule);
        else show("menu");
      });
      return;
    }

    var finishText = "¡Muy bien, " + childName() + "! Terminaste.";
    speakPersonalized(finishText, audioBase + "ui/terminaste.mp3", "¡Muy bien! Terminaste.", "es", null);
    if (pipi3d) pipi3d.celebrate();
    burstStars();
    celebrateBanner("¡Terminaste, " + childName() + "! 🏆");
    showToast("¡Muy bien! Terminaste esta lección 🎉");
    setTimeout(function () { show("menu"); }, 1500);
  }

  /* ---------------- Estrella / recompensa ---------------- */
  function awardStar() {
    if (busy) return;
    busy = true;

    var key = currentModule + ":" + currentCat + ":" + currentIndex;
    var isNew = !state.done[key];
    if (isNew) {
      state.done[key] = true;
      saveState();
      updateStars();
    }
    burstStars();
    celebrateBanner("¡Lo lograste, " + childName() + "! 🎉");

    var praise = randomPraise();
    var praiseText = praise.text.replace(/{name}/g, childName());
    speakPersonalized(praiseText, audioBase + "ui/" + praise.slug + ".mp3", praise.audioText, praise.lang, null);
    showToast(praiseText + " ⭐");
    if (pipi3d) pipi3d.celebrate();

    setTimeout(function () {
      busy = false;
      var cat = getCategory();
      if (currentIndex < cat.items.length - 1) { currentIndex += 1; renderActivity(); }
      else { finishCategory(); }
    }, 1500);
  }

  /* ---------------- Confeti ---------------- */
  function burstStars() {
    var emojis = ["⭐", "✨", "🌟", "💫", "❤️", "💖", "💕", "🌸", "🌺", "🌷", "🎉", "🎊", "🌈", "🦋"];
    for (var i = 0; i < 28; i++) {
      (function () {
        var s = document.createElement("span");
        s.className = "confetti";
        s.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        s.style.left = (Math.random() * 100) + "vw";
        s.style.animationDelay = (Math.random() * 0.3) + "s";
        s.style.fontSize = (16 + Math.random() * 24) + "px";
        document.body.appendChild(s);
        setTimeout(function () { s.remove(); }, 1700);
      })();
    }
  }

  function celebrateBanner(text) {
    var el = document.createElement("div");
    el.className = "celebrate";

    var e1 = document.createElement("div");
    e1.className = "celebrate__emoji";
    e1.textContent = "🎉 ❤️ 🌸";

    var t = document.createElement("div");
    t.className = "celebrate__text";
    t.textContent = text;

    var e2 = document.createElement("div");
    e2.className = "celebrate__emoji";
    e2.textContent = "🌟 🎊 💖";

    el.appendChild(e1);
    el.appendChild(t);
    el.appendChild(e2);
    document.body.appendChild(el);

    requestAnimationFrame(function () { el.classList.add("is-show"); });
    setTimeout(function () {
      el.classList.remove("is-show");
      setTimeout(function () { el.remove(); }, 400);
    }, 1800);
  }

  function celebrateTrophy(text) {
    var el = document.createElement("div");
    el.className = "celebrate celebrate--trophy";

    var tr = document.createElement("div");
    tr.className = "trophy";
    tr.textContent = "🏆";

    var t = document.createElement("div");
    t.className = "celebrate__text";
    t.textContent = text;

    var e = document.createElement("div");
    e.className = "celebrate__emoji";
    e.textContent = "🎉 ❤️ 🌸";

    el.appendChild(tr);
    el.appendChild(t);
    el.appendChild(e);
    document.body.appendChild(el);

    requestAnimationFrame(function () { el.classList.add("is-show"); });
    setTimeout(function () {
      el.classList.remove("is-show");
      setTimeout(function () { el.remove(); }, 400);
    }, 2400);
  }

  var partyCallback = null;

  function showParty(title, sub, grade, onContinue) {
    partyCallback = onContinue || null;
    var p = $("#party");
    if (!p) {
      if (onContinue) onContinue();
      return;
    }
    var t = $("#party-title"); if (t) t.textContent = title;
    var s = $("#party-sub"); if (s) s.textContent = sub;
    var g = $("#party-grade"); if (g) g.innerHTML = grade || "";
    p.hidden = false;
    burstStars();
    playPartyMusic();
    if (pipi3d) {
      pipi3d.attach($("#party-koala"));
      pipi3d.celebrate();
      pipi3d.setExpression("happy", 8000);
    }
  }

  function hideParty() {
    var p = $("#party");
    if (p) p.hidden = true;
    stopPartyMusic();
    if (pipi3d) pipi3d.hide();
    var cb = partyCallback;
    partyCallback = null;
    if (cb) cb();
  }

  /* ---------------- Aviso ---------------- */
  function showToast(text) {
    var t = document.createElement("div");
    t.className = "toast";
    t.textContent = text;
    document.body.appendChild(t);
    // forzar reflow para que anime
    void t.offsetWidth;
    t.classList.add("is-show");
    setTimeout(function () {
      t.classList.remove("is-show");
      setTimeout(function () { t.remove(); }, 300);
    }, 1300);
  }

  /* ---------------- Recompensas ---------------- */
  var STICKERS = [
    { n: 5, emoji: "🌱", name: "Primera estrella" },
    { n: 15, emoji: "🐣", name: "Pequeño lector" },
    { n: 30, emoji: "🐨", name: "Amigo de PIPI" },
    { n: 50, emoji: "🦋", name: "Mariposa" },
    { n: 80, emoji: "🌈", name: "Arcoíris" },
    { n: 100, emoji: "🏆", name: "¡Gran campeón!" }
  ];

  function renderRewards() {
    var n = starCount();
    $("#rewards-stars").textContent = n;

    var next = null;
    for (var i = 0; i < STICKERS.length; i++) {
      if (n < STICKERS[i].n) { next = STICKERS[i]; break; }
    }
    $("#rewards-msg").textContent = next
      ? "Te faltan " + (next.n - n) + " ⭐ para tu próxima pegatina."
      : "¡Ganaste todas las pegatinas! 🎉";

    var wrap = $("#stickers");
    wrap.innerHTML = "";
    STICKERS.forEach(function (s) {
      var unlocked = n >= s.n;
      var d = document.createElement("div");
      d.className = "sticker" + (unlocked ? " is-unlocked" : "");
      d.innerHTML =
        '<div class="sticker__emoji">' + (unlocked ? s.emoji : '<span class="sticker__lock">' + icon("lock") + "</span>") + "</div>" +
        '<div class="sticker__name">' + s.name + "</div>" +
        '<div class="sticker__need">' + s.n + " ⭐</div>";
      wrap.appendChild(d);
    });
  }

  /* ---------------- Sonido ---------------- */
  function updateSoundBtn() {
    var b = $("#sound-toggle");
    if (!b) return;
    if (window.PipiIcons) window.PipiIcons.set(b.querySelector(".ico") || b, state.muted ? "speaker-off" : "speaker");
    b.setAttribute("aria-label", state.muted ? "Activar sonido" : "Silenciar sonido");
  }

  /* ---------------- Saludo del koala ---------------- */
  var PHRASES = [
    { slug: "hola", text: "¡Hola, {name}! Soy PIPI 🐨", audioText: "¡Hola! Soy PIPI" },
    { slug: "jugamos-leer", text: "¿Jugamos a leer, {name}?", audioText: "¿Jugamos a leer?" },
    { slug: "vamos-ingles", text: "¡Vamos a aprender inglés, {name}!", audioText: "¡Vamos a aprender inglés!" },
    { slug: "sonries", text: "¡Me gusta cuando sonríes, {name}!", audioText: "¡Me gusta cuando sonríes!" },
    { slug: "estrella", text: "¿Quieres una estrella, {name}? ⭐", audioText: "¿Quieres una estrella?" },
    { slug: "tu-puedes", text: "¡Tú puedes, {name}! 💪", audioText: "¡Tú puedes!" },
    { slug: "tocame", text: "Tócame y te hablo, {name} 🐨", audioText: "Tócame y te hablo" }
  ];

  var PRAISE = [
    { slug: "feliz-1", text: "¡Muy bien, {name}!", audioText: "¡Muy bien!", lang: "es" },
    { slug: "feliz-2", text: "¡Excelente, {name}!", audioText: "¡Excelente!", lang: "es" },
    { slug: "feliz-3", text: "¡Lo hiciste genial, {name}!", audioText: "¡Lo hiciste genial!", lang: "es" },
    { slug: "feliz-4", text: "¡Qué bien lees, {name}!", audioText: "¡Qué bien lees!", lang: "es" },
    { slug: "feliz-5", text: "¡Bravo, {name}!", audioText: "¡Bravo!", lang: "es" },
    { slug: "feliz-6", text: "¡Eres una campeona, {name}!", audioText: "¡Eres una campeona!", lang: "es" },
    { slug: "feliz-7", text: "¡Eso es, {name}!", audioText: "¡Eso es!", lang: "es" },
    { slug: "feliz-8", text: "¡Genial, {name}!", audioText: "¡Genial!", lang: "es" },
    { slug: "feliz-9", text: "¡Pipi está muy feliz, {name}!", audioText: "¡Pipi está muy feliz!", lang: "es" },
    { slug: "feliz-10", text: "¡Sigue así, {name}!", audioText: "¡Sigue así!", lang: "es" },
    { slug: "en-1", text: "Great job, {name}!", audioText: "Great job!", lang: "en" },
    { slug: "en-2", text: "Excellent, {name}!", audioText: "Excellent!", lang: "en" },
    { slug: "en-3", text: "Well done, {name}!", audioText: "Well done!", lang: "en" },
    { slug: "en-4", text: "You are amazing, {name}!", audioText: "You are amazing!", lang: "en" },
    { slug: "en-5", text: "Keep it up, {name}!", audioText: "Keep it up!", lang: "en" }
  ];

  function randomPraise() {
    return PRAISE[Math.floor(Math.random() * PRAISE.length)];
  }

  function randomPhrase() {
    return PHRASES[Math.floor(Math.random() * PHRASES.length)];
  }

  // Al tocar a PIPI le brilla el corazón.
  function glowHeart(ms) {
    if (pipi3d && pipi3d.glowHeart) pipi3d.glowHeart(ms || 1800);
  }

  function greet() {
    glowHeart(1800);
    if (state.muted) {
      showToast("El sonido está apagado. Toca el altavoz.");
      return;
    }
    var p = randomPhrase();
    var display = p.text.replace(/{name}/g, childName());
    $("#speech-text").textContent = display;
    var moods = ["happy", "thinking", "surprised", "sleepy"];
    if (pipi3d) pipi3d.setExpression(moods[Math.floor(Math.random() * moods.length)], 1800);
    speakPersonalized(display, audioBase + "ui/" + p.slug + ".mp3", p.audioText, "es", null);
  }

  function greetName() {
    var display = "¡Hola, " + childName() + "! Soy PIPI";
    $("#speech-text").textContent = display;
    if (pipi3d) pipi3d.setExpression("happy", 2500);
    speakPersonalized(display, audioBase + "ui/hola.mp3", "¡Hola! Soy PIPI", "es", childName());
  }

  function startApp() {
    var inp = $("#name-input");
    var n = ((inp && inp.value) || "").trim().slice(0, 20);
    if (!n) {
      showToast("Escribe tu nombre 😊");
      if (inp) inp.focus();
      return;
    }
    state.name = n;
    saveState();
    updateHomeGreeting();
    show("home");
    greetName();
  }

  function populateSettings() {
    var inp = $("#settings-name");
    if (inp) inp.value = state.name || "";
    $$("#rate-chips .chip").forEach(function (c) {
      c.classList.toggle("is-active", c.getAttribute("data-rate") === state.expressionRate);
    });
    $$("#color-swatches .swatch").forEach(function (s) {
      var col = (s.getAttribute("data-color") || "").toLowerCase();
      s.classList.toggle("is-active", col === (state.furColor || "").toLowerCase());
    });
  }

  /* ---------------- Eventos ---------------- */
  function bind() {
    // Botones "ir a"
    $$("[data-go]").forEach(function (el) {
      el.addEventListener("click", function () {
        var go = el.getAttribute("data-go");
        if (go === "menu") openModule(el.getAttribute("data-module"));
        else if (go === "rewards") { renderRewards(); show("rewards"); }
        else if (go === "stories") openStories();
        else if (go === "games" && window.PipiGames) window.PipiGames.open();
        else show(go);
      });
    });

    // Volver
    $$("[data-back]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (currentScreen === "activity") show("menu");
        else if (currentScreen === "menu") show("home");
        else if (currentScreen === "story") show("stories");
        else if (currentScreen === "stories") show("home");
        else show("home");
      });
    });

    // Navegación de tarjetas
    var prev = $('[data-nav="prev"]');
    var next = $('[data-nav="next"]');
    if (prev) prev.addEventListener("click", goPrev);
    if (next) next.addEventListener("click", goNext);

    // Escuchar
    var listen = $("#btn-listen");
    if (listen) listen.addEventListener("click", function () {
      var cat = getCategory();
      if (!cat) return;
      autoSpeak(cat.kind, cat.items[currentIndex]);
    });

    // ¡Lo logré!
    var star = $("#btn-star");
    if (star) star.addEventListener("click", awardStar);

    // Sonido
    var snd = $("#sound-toggle");
    if (snd) snd.addEventListener("click", function () {
      state.muted = !state.muted;
      saveState();
      updateSoundBtn();
      if (state.muted) stopAll();
    });

    // Tocar al koala (home)
    var koala = $("#koala-home");
    if (koala) koala.addEventListener("click", greet);
    // En las demás pantallas, tocar a PIPI también hace brillar su corazón.
    ["#koala-welcome", "#koala-settings", "#koala-games", "#party-koala"].forEach(function (sel) {
      var el = $(sel);
      if (el) el.addEventListener("click", function () { glowHeart(1800); playSfx("drop"); });
    });

    // Reset
    var reset = $("#reset-btn");
    if (reset) reset.addEventListener("click", function () {
      if (window.confirm("¿Quieres borrar todas las estrellas y empezar de nuevo?")) {
        state.done = {};
        saveState();
        updateStars();
        renderRewards();
        showToast("¡Listo! Empezamos de nuevo.");
      }
    });

    // Cuentos
    var storyBack = $("#story-back");
    if (storyBack) storyBack.addEventListener("click", function () { show("stories"); });
    var storyListen = $("#story-listen");
    if (storyListen) storyListen.addEventListener("click", listenStory);
    var storyDone = $("#story-done");
    if (storyDone) storyDone.addEventListener("click", awardStory);

    // Fiesta de nivel
    var partyContinue = $("#party-continue");
    if (partyContinue) partyContinue.addEventListener("click", hideParty);

    // Bienvenida: nombre
    var startBtn = $("#start-btn");
    if (startBtn) {
      startBtn.addEventListener("click", startApp);
      var nameInput = $("#name-input");
      if (nameInput) nameInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") { e.preventDefault(); startApp(); }
      });
    }

    // Ajustes
    var settingsBtn = $("#settings-btn");
    if (settingsBtn) settingsBtn.addEventListener("click", function () {
      populateSettings();
      show("settings");
    });

    var saveName = $("#settings-save-name");
    if (saveName) saveName.addEventListener("click", function () {
      var inp = $("#settings-name");
      var n = ((inp && inp.value) || "").trim().slice(0, 20);
      if (!n) { showToast("Escribe un nombre 😊"); return; }
      state.name = n;
      saveState();
      updateHomeGreeting();
      var wi = $("#name-input"); if (wi) wi.value = n;
      showToast("¡Nombre guardado!");
    });

    $$("#rate-chips .chip").forEach(function (c) {
      c.addEventListener("click", function () {
        state.expressionRate = c.getAttribute("data-rate");
        saveState();
        if (pipi3d) pipi3d.setMoodInterval(rateMs());
        populateSettings();
        showToast("Expresiones: " + c.textContent);
      });
    });

    $$("#color-swatches .swatch").forEach(function (s) {
      s.addEventListener("click", function () {
        state.furColor = s.getAttribute("data-color");
        saveState();
        if (pipi3d) pipi3d.setFurColor(state.furColor);
        populateSettings();
      });
    });

    var testBtn = $("#settings-test");
    if (testBtn) testBtn.addEventListener("click", function () {
      if (!pipi3d) return;
      var moods = ["happy", "sad", "thinking", "sleepy", "surprised"];
      pipi3d.setExpression(moods[Math.floor(Math.random() * moods.length)], 3000);
    });
  }

  /* ---------------- Inicio ---------------- */
  function init() {
    loadState();
    currentScreen = "welcome";

    var koalaHost = $("#koala-welcome");
    if (window.Pipi3D && window.THREE) {
      try { pipi3d = window.Pipi3D.create(koalaHost); } catch (e) { pipi3d = null; }
    }
    if (!pipi3d) {
      koalaHost.innerHTML = koalaSVG();
      var homeHost = $("#koala-home"); if (homeHost) homeHost.innerHTML = koalaSVG();
    }
    if (pipi3d) {
      pipi3d.setMoodInterval(rateMs());
      pipi3d.setFurColor(state.furColor);
    }

    var nameInput = $("#name-input");
    if (nameInput) nameInput.value = state.name || "";
    if (state.name) {
      var wt = $("#welcome-title"); if (wt) wt.textContent = "¡Hola de nuevo!";
      var sb = $("#start-btn"); if (sb) sb.textContent = "¡Continuar!";
    }
    updateHomeGreeting();

    updateStars();
    updateSoundBtn();
    renderRewards();
    populateSettings();
    bind();

    window.PipiApp = {
      isMuted: function () { return state.muted; },
      toggleMute: function () {
        state.muted = !state.muted;
        saveState();
        updateSoundBtn();
        if (state.muted) stopAll();
        return state.muted;
      },
      getName: function () { return state.name || ""; },
      childName: childName,
      showToast: showToast,
      // Utilidades para los juegos (js/games.js, js/wordsearch.js)
      show: show,
      playAudio: playAudio,
      speak: speak,
      stopAll: stopAll,
      playSfx: playSfx,
      burstStars: burstStars,
      showParty: showParty,
      audioBase: audioBase,
      randomPraise: randomPraise,
      expression: function (mood, ms) { if (pipi3d) pipi3d.setExpression(mood, ms); },
      celebrate: function () { if (pipi3d) pipi3d.celebrate(); },
      glowHeart: glowHeart,
      addStar: function (key) {
        if (!key || state.done[key]) return false;
        state.done[key] = true;
        saveState();
        updateStars();
        return true;
      }
    };
    if (window.PipiChat) window.PipiChat.init();

    // Registrar service worker solo si se sirve por http(s)
    if ("serviceWorker" in navigator && location.protocol.indexOf("http") === 0) {
      var hadController = !!navigator.serviceWorker.controller;
      navigator.serviceWorker.addEventListener("controllerchange", function () {
        if (hadController && !window.__pipiReloading) {
          window.__pipiReloading = true;
          window.location.reload();
        }
      });
      window.addEventListener("load", function () {
        // updateViaCache "none": siempre pide sw.js nuevo al servidor.
        navigator.serviceWorker.register("sw.js", { updateViaCache: "none" }).then(function (reg) {
          // Busca versión nueva cada vez que la app vuelve a la pantalla
          // (en el celular la app instalada a veces solo se "despierta").
          var check = function () { try { reg.update(); } catch (e) {} };
          document.addEventListener("visibilitychange", function () {
            if (document.visibilityState === "visible") check();
          });
          setInterval(check, 30 * 60 * 1000);
        }).catch(function () {});
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();

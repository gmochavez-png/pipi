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
  var audioBase = "assets/audio/";

  var state = {
    done: {},      // {"lectura:letras:0": true, ...}
    muted: false
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
        }
      }
    } catch (e) { /* almacenamiento no disponible: seguimos en memoria */ }
  }

  function saveState() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({ done: state.done, muted: state.muted }));
    } catch (e) { /* modo privado: no pasa nada */ }
  }

  function starCount() { return Object.keys(state.done).length; }

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
  function playAudio(url, fallbackText, lang) {
    if (state.muted) return;
    stopAudio();
    stopSpeech();
    var a;
    try { a = new Audio(url); } catch (e) { speak(fallbackText, lang); return; }
    currentAudio = a;
    a.volume = 1;
    a.onplay = function () { setTalking(true); };
    a.onended = function () { if (currentAudio === a) { currentAudio = null; } setTalking(false); };
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

  /* ---------------- Personaje koala (SVG) ---------------- */
  function koalaSVG() {
    return (
      '<svg class="koala" viewBox="0 0 320 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="PIPI, el koala">' +
        '<defs>' +
          '<radialGradient id="fur" cx="50%" cy="35%" r="72%">' +
            '<stop offset="0%" stop-color="#d6dae1"/>' +
            '<stop offset="60%" stop-color="#bfc4cd"/>' +
            '<stop offset="100%" stop-color="#a5abb6"/>' +
          '</radialGradient>' +
          '<radialGradient id="belly" cx="50%" cy="40%" r="70%">' +
            '<stop offset="0%" stop-color="#ffffff"/>' +
            '<stop offset="100%" stop-color="#eceff0"/>' +
          '</radialGradient>' +
        '</defs>' +

        /* Orejas */
        '<g class="ear ear-left">' +
          '<circle cx="86" cy="76" r="56" fill="#b3b8c1"/>' +
          '<circle cx="86" cy="76" r="41" fill="#eef1f0"/>' +
          '<circle cx="86" cy="76" r="30" fill="#fbfcfb"/>' +
        '</g>' +
        '<g class="ear ear-right">' +
          '<circle cx="234" cy="76" r="56" fill="#b3b8c1"/>' +
          '<circle cx="234" cy="76" r="41" fill="#eef1f0"/>' +
          '<circle cx="234" cy="76" r="30" fill="#fbfcfb"/>' +
        '</g>' +

        /* Cuerpo y barriga */
        '<ellipse class="body" cx="160" cy="178" rx="122" ry="116" fill="url(#fur)"/>' +
        '<ellipse class="belly" cx="160" cy="212" rx="80" ry="74" fill="url(#belly)"/>' +

        /* Mejillas */
        '<circle class="cheek" cx="100" cy="182" r="20" fill="#f6a8c0" opacity="0.8"/>' +
        '<circle class="cheek" cx="220" cy="182" r="20" fill="#f6a8c0" opacity="0.8"/>' +

        /* Ojos */
        '<g class="eye eye-left">' +
          '<ellipse cx="120" cy="146" rx="18" ry="21" fill="#20242b"/>' +
          '<circle cx="113" cy="138" r="6" fill="#ffffff"/>' +
          '<circle cx="127" cy="153" r="2.6" fill="#ffffff" opacity="0.85"/>' +
        '</g>' +
        '<g class="eye eye-right">' +
          '<ellipse cx="200" cy="146" rx="18" ry="21" fill="#20242b"/>' +
          '<circle cx="193" cy="138" r="6" fill="#ffffff"/>' +
          '<circle cx="207" cy="153" r="2.6" fill="#ffffff" opacity="0.85"/>' +
        '</g>' +

        /* Nariz */
        '<path class="nose" d="M160 162 c-16 0 -27 11 -27 20 c0 11 12 18 27 18 c15 0 27 -7 27 -18 c0 -9 -11 -20 -27 -20 z" fill="#20242b"/>' +
        '<path d="M160 176 v16" stroke="#20242b" stroke-width="3.2" stroke-linecap="round"/>' +

        /* Boca */
        '<path class="mouth-closed" d="M145 208 q15 13 30 0" stroke="#20242b" stroke-width="5" fill="none" stroke-linecap="round"/>' +
        '<ellipse class="mouth-open" cx="160" cy="212" rx="16" ry="9" fill="#3a2b2f"/>' +
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
  }

  function goHome() { show("home"); }

  /* ---------------- Estrellas ---------------- */
  function updateStars() {
    var n = starCount();
    var a = $("#home-stars"); if (a) a.textContent = n;
    var b = $("#menu-stars"); if (b) b.textContent = n;
    var c = $("#rewards-stars"); if (c) c.textContent = n;
  }

  function isDone(mod, cat, idx) {
    return !!state.done[mod + ":" + cat + ":" + idx];
  }

  /* ---------------- Menú ---------------- */
  function openModule(mod) {
    currentModule = mod;
    var data = window.PIPI_LESSONS[mod];
    $("#menu-title").textContent = data.title;
    $("#menu-subtitle").textContent = data.subtitle || "";

    var grid = $("#menu-grid");
    grid.innerHTML = "";
    Object.keys(data.categories).forEach(function (key) {
      var cat = data.categories[key];
      var btn = document.createElement("button");
      btn.className = "menu-card menu-card--" + mod;
      btn.innerHTML =
        '<span class="menu-card__emoji">' + cat.emoji + "</span>" +
        '<span class="menu-card__title">' + cat.title + "</span>" +
        '<span class="menu-card__count">' + cat.items.length + " tarjetas</span>";
      btn.addEventListener("click", function () { startCategory(mod, key); });
      grid.appendChild(btn);
    });

    updateStars();
    show("menu");
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

    $("#activity-stage").innerHTML = buildCard(cat.kind, item, currentModule);

    autoSpeak(cat.kind, item);
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
    playAudio(audioBase + "ui/terminaste.mp3", "¡Muy bien! Terminaste.", "es");
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
      burstStars();
    }

    playAudio(audioBase + "ui/muy-bien.mp3", "¡Muy bien!", "es");

    setTimeout(function () {
      busy = false;
      var cat = getCategory();
      if (currentIndex < cat.items.length - 1) { currentIndex += 1; renderActivity(); }
      else { finishCategory(); }
    }, 1500);
  }

  /* ---------------- Confeti ---------------- */
  function burstStars() {
    var emojis = ["⭐", "✨", "🌟", "💫"];
    for (var i = 0; i < 14; i++) {
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
        '<div class="sticker__emoji">' + (unlocked ? s.emoji : "🔒") + "</div>" +
        '<div class="sticker__name">' + s.name + "</div>" +
        '<div class="sticker__need">' + s.n + " ⭐</div>";
      wrap.appendChild(d);
    });
  }

  /* ---------------- Sonido ---------------- */
  function updateSoundBtn() {
    var b = $("#sound-toggle");
    if (!b) return;
    b.textContent = state.muted ? "🔇" : "🔊";
    b.setAttribute("aria-label", state.muted ? "Activar sonido" : "Silenciar sonido");
  }

  /* ---------------- Saludo del koala ---------------- */
  var PHRASES = [
    { text: "¡Hola! Soy PIPI 🐨", slug: "hola" },
    { text: "¿Jugamos a leer?", slug: "jugamos-leer" },
    { text: "¡Vamos a aprender inglés!", slug: "vamos-ingles" },
    { text: "¡Me gusta cuando sonríes!", slug: "sonries" },
    { text: "¿Quieres una estrella? ⭐", slug: "estrella" },
    { text: "¡Tú puedes! 💪", slug: "tu-puedes" },
    { text: "Tócame y te hablo 🐨", slug: "tocame" }
  ];

  function randomPhrase() {
    return PHRASES[Math.floor(Math.random() * PHRASES.length)];
  }

  function greet() {
    var p = randomPhrase();
    $("#speech-text").textContent = p.text;
    playAudio(audioBase + "ui/" + p.slug + ".mp3", p.text, "es");
  }

  /* ---------------- Eventos ---------------- */
  function bind() {
    // Botones "ir a"
    $$("[data-go]").forEach(function (el) {
      el.addEventListener("click", function () {
        var go = el.getAttribute("data-go");
        if (go === "menu") openModule(el.getAttribute("data-module"));
        else if (go === "rewards") { renderRewards(); show("rewards"); }
        else show(go);
      });
    });

    // Volver
    $$("[data-back]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (currentScreen === "activity") show("menu");
        else if (currentScreen === "menu") show("home");
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
  }

  /* ---------------- Inicio ---------------- */
  function init() {
    loadState();

    $("#koala-home").innerHTML = koalaSVG();

    updateStars();
    updateSoundBtn();
    renderRewards();
    bind();

    // Registrar service worker solo si se sirve por http(s)
    if ("serviceWorker" in navigator && location.protocol.indexOf("http") === 0) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("sw.js").catch(function () {});
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();

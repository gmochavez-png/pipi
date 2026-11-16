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
  var pipi3d = null;

  var state = {
    done: {},      // {"lectura:letras:0": true, ...}
    muted: false,
    name: "",
    expressionRate: "normal",
    furColor: "#8b93a2"
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
          state.furColor = typeof saved.furColor === "string" && /^#[0-9a-fA-F]{6}$/.test(saved.furColor) ? saved.furColor : "#8b93a2";
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
        furColor: state.furColor
      }));
    } catch (e) { /* modo privado: no pasa nada */ }
  }

  function starCount() { return Object.keys(state.done).length; }

  var RATE_MS = { low: 30000, normal: 14000, high: 7000 };
  function rateMs() { return RATE_MS[state.expressionRate] || RATE_MS.normal; }
  function childName() { return (state.name || "").trim() || "amiga"; }

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

  function speakName(name, lang) {
    if (!name || state.muted || !speechAvailable) return;
    var lg = lang === "en" ? "en" : "es";
    var voice = pickVoice(lg);
    if (!voice) return;
    try {
      var u = new SpeechSynthesisUtterance(name);
      u.lang = lg === "en" ? "en-US" : "es-MX";
      u.rate = 0.9;
      u.pitch = 1.1;
      u.volume = 1;
      u.voice = voice;
      u.onstart = function () { setTalking(true); };
      u.onend = function () { setTalking(false); };
      window.speechSynthesis.speak(u);
    } catch (e) {}
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

    if (pipi3d) {
      if (name === "home") { pipi3d.attach($("#koala-home")); pipi3d.setExpression("idle"); }
      else if (name === "welcome") { pipi3d.attach($("#koala-welcome")); pipi3d.setExpression("happy", 4000); }
      else if (name === "activity") pipi3d.attach($("#koala-mini"));
      else if (name === "settings") { pipi3d.attach($("#koala-settings")); pipi3d.setExpression("idle"); }
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

    var card = $("#activity-stage .card");
    var hint = document.createElement("div");
    hint.className = "card__hint";
    hint.textContent = "Primero inténtalo · toca 🔊 para escuchar";
    if (card) card.appendChild(hint);

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
    var finishText = "¡Muy bien, " + childName() + "! Terminaste.";
    speakPersonalized(finishText, audioBase + "ui/terminaste.mp3", "¡Muy bien! Terminaste.", "es", childName());
    if (pipi3d) pipi3d.celebrate();
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

    var praise = randomPraise();
    var praiseText = praise.text.replace(/{name}/g, childName());
    speakPersonalized(praiseText, audioBase + "ui/" + praise.slug + ".mp3", praise.audioText, praise.lang, childName());
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

  function greet() {
    if (state.muted) {
      showToast("🔇 El sonido está apagado. Toca el altavoz.");
      return;
    }
    var p = randomPhrase();
    var display = p.text.replace(/{name}/g, childName());
    $("#speech-text").textContent = display;
    var moods = ["happy", "thinking", "surprised", "sleepy"];
    if (pipi3d) pipi3d.setExpression(moods[Math.floor(Math.random() * moods.length)], 1800);
    speakPersonalized(display, audioBase + "ui/" + p.slug + ".mp3", p.audioText, "es", childName());
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
      var wt = $("#welcome-title"); if (wt) wt.textContent = "¡Hola de nuevo! 🐨";
      var sb = $("#start-btn"); if (sb) sb.textContent = "¡Continuar!";
    }

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
      showToast: showToast
    };
    if (window.PipiChat) window.PipiChat.init();

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

/* =========================================================
   PIPI · Chat híbrido y seguro
   - Respuestas escolares curadas
   - Vikidia / Wikipedia (gratis, sin clave)
   - Juegos: chistes, adivinanzas, sumas, cuentos, veo veo
   - Modo padres: activa IA en la nube (Gemini) con clave local
   ========================================================= */

(function () {
  "use strict";

  var STORE = "pipi.chat.v1";
  var DEFAULT_PIN = "1234";

  var state = {
    settings: { useAI: false, geminiKey: "" },
    game: null,
    busy: false,
    greeted: false
  };

  var $ = function (sel) { return document.querySelector(sel); };

  function normalize(s) {
    return (s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[¿?¡!.,;:]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function childName() {
    return (window.PipiApp && window.PipiApp.getName && window.PipiApp.getName()) || "amiga";
  }

  function random(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /* ---------------- Seguridad ---------------- */
  var BLOCKED = [
    "sexo", "sexual", "porno", "matar", "muerte", "sangre", "droga", "drogas",
    "arma", "armas", "violencia", "suicidio", "desnudo", "desnuda", "apuesta",
    "fumar", "alcohol", "pelea", "herir"
  ];

  function containsBlocked(text) {
    var n = normalize(text);
    for (var i = 0; i < BLOCKED.length; i++) {
      if (n.indexOf(BLOCKED[i]) !== -1) return true;
    }
    return false;
  }

  /* ---------------- Respuestas escolares curadas ---------------- */
  var KB = [
    { keys: ["cielo", "azul"], a: "El cielo se ve azul porque la luz del sol se dispersa en el aire. El azul se dispersa más que los otros colores y llega a tus ojos." },
    { keys: ["llueve", "lluvia", "nube", "nubes"], a: "El agua de ríos y mares se evapora con el sol, sube y forma nubes. Cuando las nubes se llenan de gotitas, cae la lluvia." },
    { keys: ["sol"], a: "El sol es una estrella enorme y caliente. Nos da luz y calor, y ayuda a que las plantas crezcan." },
    { keys: ["luna"], a: "La luna es el satélite de la Tierra. Gira a nuestro alrededor y de noche nos ilumina con la luz del sol." },
    { keys: ["estrella", "estrellas"], a: "Las estrellas son bolas gigantes de gas que brillan. El sol también es una estrella." },
    { keys: ["dinosaurio", "dinosaurios"], a: "Los dinosaurios fueron animales muy grandes que vivieron hace millones de años. Ya no existen, pero conocemos sus huesos." },
    { keys: ["volcan"], a: "Un volcán es una montaña que puede expulsar lava y ceniza caliente desde dentro de la Tierra." },
    { keys: ["terremoto"], a: "Un terremoto es cuando la tierra tiembla porque las placas que forman el suelo se mueven." },
    { keys: ["mamifero", "mamiferos"], a: "Los mamíferos son animales que toman leche de su mamá cuando son bebés. El perro, el gato y el koala son mamíferos." },
    { keys: ["planta", "plantas"], a: "Las plantas son seres vivos que necesitan agua, luz y tierra. Hacen su comida con la luz del sol." },
    { keys: ["corazon"], a: "El corazón es un músculo que bombea sangre a todo el cuerpo. Late ¡pum, pum!" },
    { keys: ["cerebro"], a: "El cerebro está en la cabeza y nos ayuda a pensar, aprender y recordar." },
    { keys: ["vocal", "vocales"], a: "Las vocales son A, E, I, O, U. Se pueden pronunciar solas." },
    { keys: ["consonante", "consonantes"], a: "Las consonantes son las demás letras. Necesitan una vocal para formar sílabas." },
    { keys: ["suma", "sumar"], a: "Sumar es juntar cantidades. Por ejemplo, 2 + 2 = 4." },
    { keys: ["resta", "restar"], a: "Restar es quitar. Por ejemplo, 5 - 2 = 3." },
    { keys: ["pipi"], a: "¡Soy PIPI, tu koala amigo! Me gusta leer, jugar y aprender contigo." },
    { keys: ["hola", "buenas"], a: "¡Hola! ¿Qué quieres aprender hoy?" },
    { keys: ["gracias"], a: "¡De nada! Me alegra ayudarte." },
    { keys: ["adios"], a: "¡Hasta pronto! Vuelve a jugar conmigo." },
    { keys: ["fotosintesis"], a: "Las plantas usan la luz del sol, el agua y el aire para hacer su comida. Eso se llama fotosíntesis." },
    { keys: ["gravedad"], a: "La gravedad es la fuerza que tira de las cosas hacia la Tierra. Por eso, si sueltas una pelota, cae." },
    { keys: ["electricidad"], a: "La electricidad es una forma de energía. Hace que funcionen las luces, los juguetes y la tele." },
    { keys: ["iman", "imanes"], a: "Un imán atrae algunos metales, como el hierro. Por eso se pega a la nevera." },
    { keys: ["agua"], a: "El agua es un líquido transparente. La necesitamos para beber, cocinar y lavarnos." },
    { keys: ["aire"], a: "El aire es la mezcla de gases que respiramos. No se ve, pero está en todas partes." },
    { keys: ["energia"], a: "La energía es lo que hace que las cosas se muevan o funcionen. Viene del sol, la comida y la electricidad." },
    { keys: ["tierra", "planeta"], a: "La Tierra es el planeta donde vivimos. Tiene agua, aire y muchos seres vivos." },
    { keys: ["universo"], a: "El universo es todo lo que existe: la Tierra, el sol, las estrellas y el espacio." },
    { keys: ["reciclar", "reciclaje"], a: "Reciclar es separar la basura para hacer cosas nuevas con ella. Ayuda a cuidar el planeta." },
    { keys: ["mar", "oceano"], a: "El mar es una gran masa de agua salada. En él viven peces y otros animales." },
    { keys: ["camaleon", "camaleones"], a: "El camaleón es un lagarto que cambia de color para esconderse y comunicarse. Come insectos y tiene una lengua muy larga." },
    { keys: ["pinguino", "pinguinos"], a: "El pingüino es un ave que no vuela, pero nada muy bien. Vive en lugares fríos y come peces." },
    { keys: ["leon", "leones"], a: "El león es un mamífero grande que vive en África. El macho tiene una melena muy bonita." },
    { keys: ["tigre", "tigres"], a: "El tigre es un felino grande con rayas negras. Vive en Asia y es muy buen cazador." },
    { keys: ["elefante", "elefantes"], a: "El elefante es el animal terrestre más grande. Tiene trompa y orejas enormes." },
    { keys: ["jirafa", "jirafas"], a: "La jirafa es el animal más alto. Tiene un cuello muy largo para comer hojas de los árboles." },
    { keys: ["delfin", "delfines"], a: "El delfín es un mamífero marino muy inteligente. Le gusta saltar y jugar en el agua." },
    { keys: ["ballena", "ballenas"], a: "La ballena es el animal más grande del mar. Respira aire por un agujero en la espalda." },
    { keys: ["tiburon", "tiburones"], a: "El tiburón es un pez grande con dientes muy afilados. Vive en el mar." },
    { keys: ["mariposa", "mariposas"], a: "La mariposa es un insecto con alas de colores. Antes fue una oruga." },
    { keys: ["abeja", "abejas"], a: "La abeja es un insecto que hace miel. Vive en una colmena con muchas abejas." },
    { keys: ["arana", "aranas"], a: "La araña es un animal pequeño con ocho patas. Hace telarañas para atrapar insectos." },
    { keys: ["serpiente", "serpientes"], a: "La serpiente es un reptil sin patas. Se arrastra por el suelo y come animales pequeños." },
    { keys: ["conejo", "conejos"], a: "El conejo es un animal pequeño con orejas largas. Le encanta comer zanahorias." },
    { keys: ["tortuga", "tortugas"], a: "La tortuga es un animal con caparazón. Algunas viven en el mar y otras en la tierra." },
    { keys: ["caballo", "caballos"], a: "El caballo es un animal grande y veloz. Ayuda a las personas y le gusta comer hierba." }
  ];

  var JOKES = [
    "¿Qué le dice un pez a otro? ¡Nada!",
    "¿Cuál es el animal que siempre llega al final? El delfín.",
    "¿Qué hace una abeja en el gimnasio? ¡Zum-ba!",
    "¿Cómo se despiden los koalas? ¡Con un abrazo de oso!",
    "¿Qué le dijo el sol a la luna? ¡Nos vemos de noche!"
  ];

  var RIDDLES = [
    { q: "Tengo hojas pero no soy árbol. ¿Qué soy?", a: "libro" },
    { q: "Tiene patas pero no camina. ¿Qué es?", a: "mesa" },
    { q: "Brilla en el cielo de noche. ¿Qué es?", a: "luna" },
    { q: "Es amarillo y da calor. ¿Qué es?", a: "sol" },
    { q: "Tiene ruedas y lleva niños a la escuela. ¿Qué es?", a: "autobús" },
    { q: "Es blanco, frío y cae del cielo. ¿Qué es?", a: "nieve" },
    { q: "Tiene agujas pero no pincha. ¿Qué es?", a: "reloj" }
  ];

  var STORIES = [
    "Había una vez una niña llamada {name} que encontró un koala de peluche. El koala se llamaba PIPI y juntos aprendieron a leer. Al final, {name} se durmió abrazada a PIPI.",
    "Un día {name} y PIPI fueron al bosque. Encontraron una mariposa de colores y la siguieron hasta un arcoíris. Era un día mágico.",
    "{name} estaba triste porque no sabía una palabra. PIPI le dijo: '¡Tú puedes!'. Lo intentaron juntos y {name} lo logró. ¡Bravo!"
  ];

  /* ---------------- Utilidades de chat ---------------- */
  function addMsg(role, text, extraClass) {
    var log = $("#chat-log");
    if (!log) return null;
    var div = document.createElement("div");
    div.className = "msg msg--" + role + (extraClass ? " " + extraClass : "");
    div.textContent = text;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
    return div;
  }

  var thinkingEl = null;

  function setThinking(on) {
    if (on) {
      if (!thinkingEl) thinkingEl = addMsg("pipi", "PIPI está pensando...", "msg--thinking");
    } else if (thinkingEl) {
      thinkingEl.remove();
      thinkingEl = null;
    }
  }

  function speak(text) {
    if (window.PipiApp && window.PipiApp.isMuted && window.PipiApp.isMuted()) return;
    if (!("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = "es-MX";
      u.rate = 0.92;
      u.pitch = 1.08;
      u.volume = 1;
      var voices = window.speechSynthesis.getVoices() || [];
      var v = voices.filter(function (x) { return x.lang && x.lang.toLowerCase().indexOf("es") === 0; })[0];
      if (v) u.voice = v;
      window.speechSynthesis.speak(u);
    } catch (e) {}
  }

  function respond(text, speakIt) {
    setThinking(false);
    addMsg("pipi", text);
    if (speakIt !== false) speak(text);
  }

  /* ---------------- Juegos ---------------- */
  function startGame(text) {
    var n = normalize(text);
    if (n.indexOf("chiste") !== -1) { respond(random(JOKES)); return; }
    if (n.indexOf("adivin") !== -1) { startRiddle(); return; }
    if (n.indexOf("suma") !== -1) { startMath(); return; }
    if (n.indexOf("cuento") !== -1) { respond(random(STORIES).replace(/{name}/g, childName())); return; }
    if (n.indexOf("veo veo") !== -1) { startVeo(); return; }
    respond("¿A qué jugamos? Puedo contarte un chiste, una adivinanza, una suma o un cuento.");
  }

  function startRiddle() {
    var r = random(RIDDLES);
    state.game = { type: "riddle", answer: r.a };
    respond(r.q);
  }

  function startMath() {
    var a = 1 + Math.floor(Math.random() * 9);
    var b = 1 + Math.floor(Math.random() * 9);
    state.game = { type: "math", answer: a + b };
    respond("¿Cuánto es " + a + " + " + b + "?");
  }

  function startVeo() {
    var colors = ["rojo", "azul", "verde", "amarillo", "rosa"];
    state.game = { type: "veo", answer: random(colors) };
    respond("Veo, veo... algo de color " + state.game.answer + ". ¿Qué será?");
  }

  function checkGame(text) {
    var g = state.game;
    if (!g) return;
    var n = normalize(text);

    if (g.type === "math") {
      var m = n.match(/-?\d+/);
      var num = m ? parseInt(m[0], 10) : NaN;
      state.game = null;
      if (num === g.answer) respond("¡Correcto, " + childName() + "! 🎉");
      else respond("Casi... La respuesta es " + g.answer + ". ¡Sigue intentando!");
      return;
    }

    if (g.type === "riddle") {
      var a = normalize(g.answer);
      state.game = null;
      if (n.indexOf(a) !== -1 || a.indexOf(n) !== -1) respond("¡Correcto, " + childName() + "! 🎉");
      else respond("Casi... La respuesta es " + g.answer + ". ¡Sigue intentando!");
      return;
    }

    if (g.type === "veo") {
      state.game = null;
      respond("¡Puede ser! Me gusta jugar contigo. ¿Quieres otra adivinanza?");
    }
  }

  /* ---------------- Vikidia / Wikipedia ---------------- */
  function extractTopic(question) {
    var raw = question.toLowerCase().replace(/[¿?¡!.,;:]/g, " ").replace(/\s+/g, " ").trim();
    var prefixes = [
      "qué es ", "qué son ", "quién es ", "quiénes son ",
      "dónde está ", "dónde están ", "cómo funciona ", "para qué sirve ", "qué significa "
    ];
    for (var i = 0; i < prefixes.length; i++) {
      if (raw.indexOf(prefixes[i]) === 0) {
        var topic = raw.slice(prefixes[i].length).trim();
        topic = topic.replace(/^(un|una|el|la|los|las)\s+/i, "").trim();
        return topic;
      }
    }
    return "";
  }

  async function fetchExtract(host, title) {
    var url = "https://" + host + "/w/api.php?action=query&format=json&origin=*&prop=extracts&exintro=1&explaintext=1&redirects=1&titles=" + encodeURIComponent(title);
    var res = await fetch(url);
    if (!res.ok) return null;
    var data = await res.json();
    var pages = data.query && data.query.pages;
    if (!pages) return null;
    var first = Object.values(pages)[0];
    return first && first.extract ? first.extract : null;
  }

  async function searchTitles(topic) {
    var url = "https://es.wikipedia.org/w/api.php?action=query&format=json&origin=*&list=search&srsearch=" + encodeURIComponent(topic) + "&srlimit=3";
    var res = await fetch(url);
    if (!res.ok) return [];
    var data = await res.json();
    var s = data.query && data.query.search ? data.query.search : [];
    return s.map(function (x) { return x.title; });
  }

  function isKidSafe(text) {
    if (containsBlocked(text)) return false;
    var n = normalize(text);
    var bad = [
      "marvel", "dc comics", "supervillano", "superheroe", "comic", "pelicula",
      "videojuego", "serie de television", "anime", "manga", "personaje ficticio",
      "actor", "actriz", "cantante", "futbolista", "politico", "guerra", "arma",
      "muerte", "sangre", "violencia", "periodico", "diario", "revista",
      "ideologia", "partido", "empresa", "club", "equipo"
    ];
    for (var i = 0; i < bad.length; i++) {
      if (n.indexOf(bad[i]) !== -1) return false;
    }
    return true;
  }

  function simplify(extract) {
    var parts = extract.match(/[^.!?]+[.!?]+/g) || [extract];
    var s = parts.slice(0, 1).join(" ").trim();
    if (s.length > 260) s = s.slice(0, 257) + "...";
    return s;
  }

  async function wikiAnswer(text) {
    var topic = extractTopic(text);
    if (!topic) return null;

    var extract = await fetchExtract("es.vikidia.org", topic);
    if (extract && isKidSafe(extract)) return simplify(extract);

    var titles = await searchTitles(topic);
    for (var i = 0; i < titles.length; i++) {
      var e = await fetchExtract("es.wikipedia.org", titles[i]);
      if (e && isKidSafe(e)) return simplify(e);
    }

    var exact = await fetchExtract("es.wikipedia.org", topic);
    if (exact && isKidSafe(exact)) return simplify(exact);

    return null;
  }

  /* ---------------- IA en la nube (opcional) ---------------- */
  var SYSTEM_PROMPT =
    "Eres PIPI, un koala amable y divertido que ayuda a niños de 6 años. " +
    "Responde en español, con frases cortas y palabras sencillas. " +
    "Solo habla de temas escolares, animales, naturaleza, cuerpo, letras, números, cuentos y juegos. " +
    "Nunca des consejos peligrosos, violencia, contenido sexual, drogas ni datos personales. " +
    "Si no sabes algo, di 'No lo sé' y sugiere preguntar a un adulto. Máximo 3 frases.";

  async function geminiAnswer(text) {
    var s = loadSettings();
    if (!s.useAI || !s.geminiKey) return null;
    var url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + encodeURIComponent(s.geminiKey);
    var body = {
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ role: "user", parts: [{ text: text }] }],
      generationConfig: { temperature: 0.6, maxOutputTokens: 220, topP: 0.9 },
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_LOW_AND_ABOVE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_LOW_AND_ABOVE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_LOW_AND_ABOVE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_LOW_AND_ABOVE" }
      ]
    };
    try {
      var res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (!res.ok) return null;
      var data = await res.json();
      if (data.promptFeedback && data.promptFeedback.blockReason) return null;
      var cand = data.candidates && data.candidates[0];
      var parts = cand && cand.content && cand.content.parts ? cand.content.parts : [];
      var out = parts.map(function (p) { return p.text || ""; }).join("").trim();
      if (!out || containsBlocked(out)) return null;
      if (out.length > 400) out = out.slice(0, 397) + "...";
      return out;
    } catch (e) {
      return null;
    }
  }

  /* ---------------- Envío ---------------- */
  function tryMath(text) {
    var n = normalize(text);
    var m = n.match(/(\d+)\s*([+\-])\s*(\d+)/);
    if (!m) return null;
    var a = parseInt(m[1], 10);
    var b = parseInt(m[3], 10);
    var r = m[2] === "+" ? a + b : a - b;
    return "¡Muy bien! " + a + " " + m[2] + " " + b + " = " + r + ".";
  }

  function findKB(text) {
    var n = normalize(text);
    var best = null;
    var bestScore = 0;
    for (var i = 0; i < KB.length; i++) {
      var score = 0;
      for (var k = 0; k < KB[i].keys.length; k++) {
        if (n.indexOf(KB[i].keys[k]) !== -1) score++;
      }
      if (score > bestScore) { bestScore = score; best = KB[i]; }
    }
    return best ? best.a : null;
  }

  function isGameCommand(text) {
    var n = normalize(text);
    return /chiste|adivin|suma|cuento|juega|jugar|juguemos|veo veo/.test(n);
  }

  async function send(text) {
    text = (text || "").trim();
    if (!text || state.busy) return;
    if (text.length > 200) text = text.slice(0, 200);
    addMsg("user", text);

    if (containsBlocked(text)) {
      respond("Eso no lo puedo responder. Mejor pregúntale a un adulto. 😊");
      return;
    }
    if (state.game) { checkGame(text); return; }
    if (isGameCommand(text)) { startGame(text); return; }
    var math = tryMath(text);
    if (math) { respond(math); return; }
    var kb = findKB(text);
    if (kb) { respond(kb); return; }

    state.busy = true;
    setThinking(true);
    try {
      var wiki = await wikiAnswer(text);
      if (wiki) { respond(wiki); return; }
      var ai = await geminiAnswer(text);
      if (ai) { respond(ai); return; }
      respond("No lo sé todavía. Puedes preguntarme de animales, espacio, cuerpo, letras o sumas... ¡o decir 'juega conmigo'!");
    } catch (e) {
      respond("No pude buscar la respuesta. ¿Probamos otra pregunta? 😊");
    } finally {
      state.busy = false;
      setThinking(false);
    }
  }

  /* ---------------- Ajustes / modo padres ---------------- */
  function loadSettings() {
    try {
      var raw = localStorage.getItem(STORE);
      if (raw) {
        var s = JSON.parse(raw);
        state.settings = {
          useAI: !!s.useAI,
          geminiKey: typeof s.geminiKey === "string" ? s.geminiKey : ""
        };
      }
    } catch (e) {}
    return state.settings;
  }

  function saveSettings() {
    try { localStorage.setItem(STORE, JSON.stringify(state.settings)); } catch (e) {}
  }

  function getPin() {
    try { return localStorage.getItem("pipi.chat.pin") || DEFAULT_PIN; } catch (e) { return DEFAULT_PIN; }
  }

  function openParent() {
    var panel = $("#parent-panel");
    if (!panel) return;
    panel.hidden = false;
    var s = loadSettings();
    $("#ai-toggle").checked = !!s.useAI;
    $("#gemini-key").value = s.geminiKey || "";
    updateParentStatus();
  }

  function updateParentStatus() {
    var s = loadSettings();
    var el = $("#parent-status");
    if (el) el.textContent = s.useAI && s.geminiKey ? "IA activada" : "IA desactivada (solo respuestas seguras)";
  }

  function updateMuteBtn() {
    var b = $("#chat-mute");
    if (!b) return;
    var muted = window.PipiApp && window.PipiApp.isMuted ? window.PipiApp.isMuted() : false;
    b.textContent = muted ? "🔇" : "🔊";
  }

  /* ---------------- Inicio ---------------- */
  var QUICK = [
    "¿Por qué el cielo es azul?",
    "¿Qué es un dinosaurio?",
    "Cuéntame un chiste",
    "Juguemos a adivinar",
    "Hazme una suma",
    "Cuéntame un cuento"
  ];

  function renderQuick() {
    var wrap = $("#chat-quick");
    if (!wrap) return;
    wrap.innerHTML = "";
    QUICK.forEach(function (q) {
      var b = document.createElement("button");
      b.className = "chat-chip";
      b.textContent = q;
      b.addEventListener("click", function () { send(q); });
      wrap.appendChild(b);
    });
  }

  function enter() {
    updateMuteBtn();
    if (!state.greeted) {
      state.greeted = true;
      var name = window.PipiApp ? window.PipiApp.getName() : "";
      var hi = name ? "¡Hola, " + name + "! Soy PIPI." : "¡Hola! Soy PIPI.";
      respond(hi + " Puedes preguntarme de la escuela, animales, espacio... o jugar conmigo. 💬", true);
    }
  }

  function bind() {
    var sendBtn = $("#chat-send");
    var input = $("#chat-input");
    if (sendBtn) sendBtn.addEventListener("click", function () {
      if (!input) return;
      var t = input.value;
      input.value = "";
      send(t);
    });
    if (input) input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        var t = input.value;
        input.value = "";
        send(t);
      }
    });

    var mute = $("#chat-mute");
    if (mute) mute.addEventListener("click", function () {
      if (window.PipiApp && window.PipiApp.toggleMute) window.PipiApp.toggleMute();
      updateMuteBtn();
    });

    var parentBtn = $("#parent-btn");
    if (parentBtn) parentBtn.addEventListener("click", function () {
      var pin = prompt("PIN de padres (por defecto 1234):");
      if (pin === null) return;
      if (pin.trim() !== getPin()) { alert("PIN incorrecto"); return; }
      openParent();
    });

    var close = $("#parent-close");
    if (close) close.addEventListener("click", function () { $("#parent-panel").hidden = true; });

    var save = $("#parent-save");
    if (save) save.addEventListener("click", function () {
      state.settings = {
        useAI: $("#ai-toggle").checked,
        geminiKey: $("#gemini-key").value.trim()
      };
      saveSettings();
      updateParentStatus();
    });
  }

  function initMic() {
    var btn = $("#chat-mic");
    if (!btn) return;
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { btn.hidden = true; return; }

    var rec = new SR();
    rec.lang = "es-MX";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.continuous = false;
    var listening = false;
    var input = $("#chat-input");

    function setListening(on) {
      listening = on;
      btn.classList.toggle("is-listening", on);
      btn.textContent = on ? "⏹️" : "🎤";
      btn.setAttribute("aria-label", on ? "Detener micrófono" : "Hablar por micrófono");
      if (input) input.placeholder = on ? "Escuchando..." : "Escribe tu pregunta...";
    }

    rec.onstart = function () { setListening(true); };
    rec.onend = function () { setListening(false); };
    rec.onerror = function (e) {
      setListening(false);
      var err = e && e.error;
      if (err === "not-allowed" || err === "service-not-allowed") {
        respond("No tengo permiso para el micrófono. Actívalo en el navegador. 🎤", false);
      } else if (err === "no-speech") {
        respond("No te escuché. Toca 🎤 y habla otra vez.", false);
      } else if (err !== "aborted") {
        respond("No pude escuchar. Intenta otra vez. 🎤", false);
      }
    };
    rec.onresult = function (e) {
      var text = "";
      try { text = e.results[0][0].transcript || ""; } catch (err) {}
      text = text.trim();
      if (!text) return;
      if (input) input.value = "";
      send(text);
    };

    btn.addEventListener("click", function () {
      if (listening) {
        try { rec.stop(); } catch (e) {}
        return;
      }
      try {
        rec.start();
      } catch (e) {
        respond("No pude abrir el micrófono. Intenta otra vez. 🎤", false);
      }
    });
  }

  function init() {
    loadSettings();
    renderQuick();
    bind();
    initMic();
    updateMuteBtn();
  }

  window.PipiChat = { init: init, enter: enter };
})();

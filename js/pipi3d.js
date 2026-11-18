/* =========================================================
   PIPI · Personaje 3D con Three.js
   Modelado a partir de la foto del peluche real:
   - cuerpo en forma de huevo, de terciopelo gris
   - cuerno de unicornio rosa con brillantina
   - orejas pequeñas de borrego (sherpa) rizado
   - ojos y nariz bordados
   - corazón acolchado de brillantina rosa en la panza
   Expresiones: idle, blink, talking, happy, surprised, sad,
   thinking, sleepy. (El peluche no tiene boca: la boca solo
   aparece cuando PIPI habla o cambia de expresión.)
   ========================================================= */

(function () {
  "use strict";
  if (!window.THREE) { window.Pipi3D = null; return; }
  var THREE = window.THREE;

  /* Colores medidos en la foto del peluche real */
  var COLORS = {
    fur: "#a9a7a1",       // terciopelo gris
    ear: "#d3cec2",       // borrego gris claro
    hornBase: "#e8458a",  // rosa fuerte con brillantina
    hornTip: "#f2b9b0",   // punta rosa pálido
    heart: "#e0559a",     // corazón de brillantina
    heartEdge: "#b98096", // borde malva bordado
    nose: "#7f8183",
    noseLine: "#3f4245",
    eye: "#23272a",
    eyeRing: "#8f908b"
  };

  /* ---------- Utilidades de textura ---------- */
  function makeCanvas(w, h) {
    var c = document.createElement("canvas");
    c.width = w;
    c.height = h || w;
    return c;
  }

  // Pseudoaleatorio con semilla: el peluche se ve igual en cada carga.
  function rng(seed) {
    var s = seed >>> 0;
    return function () {
      s = (s + 0x6d2b79f5) >>> 0;
      var t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function canvasTexture(canvas, repeat) {
    var tex = new THREE.CanvasTexture(canvas);
    if (repeat) {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(repeat, repeat);
    }
    return tex;
  }

  // Pelo corto de terciopelo (claro/oscuro muy sutil).
  function velvetCanvas() {
    var c = makeCanvas(256), ctx = c.getContext("2d"), r = rng(7);
    ctx.fillStyle = "rgb(228,228,228)";
    ctx.fillRect(0, 0, 256, 256);
    for (var i = 0; i < 9000; i++) {
      var x = r() * 256, y = r() * 256, a = r() * Math.PI * 2, l = 1 + r() * 3;
      ctx.strokeStyle = r() < 0.5 ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.06)";
      ctx.lineWidth = 0.6 + r() * 0.8;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l);
      ctx.stroke();
    }
    return c;
  }

  // Rizos del borrego de las orejas.
  function sherpaCanvas() {
    var c = makeCanvas(256), ctx = c.getContext("2d"), r = rng(21);
    ctx.fillStyle = "rgb(225,225,225)";
    ctx.fillRect(0, 0, 256, 256);
    for (var i = 0; i < 1400; i++) {
      var x = r() * 256, y = r() * 256, rad = 2 + r() * 4;
      ctx.strokeStyle = r() < 0.5 ? "rgba(255,255,255,0.35)" : "rgba(70,70,70,0.25)";
      ctx.lineWidth = 1 + r() * 1.4;
      ctx.beginPath();
      ctx.arc(x, y, rad, r() * 6, r() * 6 + 4);
      ctx.stroke();
    }
    return c;
  }

  // Puntitos de brillantina (para el color) y destellos (para el brillo).
  function glitterCanvas(base, seed, sparkleOnly) {
    var c = makeCanvas(256), ctx = c.getContext("2d"), r = rng(seed);
    ctx.fillStyle = sparkleOnly ? "#000" : base;
    ctx.fillRect(0, 0, 256, 256);
    var tones = sparkleOnly
      ? ["#ffffff", "#ffffff", "#bff6ff", "#ffd6f0", "#d8ffe9"]
      : ["rgba(255,255,255,0.55)", "rgba(255,190,225,0.6)", "rgba(150,40,100,0.35)", "rgba(190,240,255,0.45)"];
    var n = sparkleOnly ? 260 : 2600;
    for (var i = 0; i < n; i++) {
      ctx.fillStyle = tones[Math.floor(r() * tones.length)];
      var s = sparkleOnly ? 1 + r() * 2.2 : 0.8 + r() * 1.8;
      ctx.fillRect(r() * 256, r() * 256, s, s);
    }
    return c;
  }

  /* ---------- Dibujos bordados (ojos, nariz, corazón, bocas) ---------- */
  function stitchHatch(ctx, w, h, color) {
    ctx.save();
    ctx.globalCompositeOperation = "source-atop";
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    for (var i = -h; i < w; i += 4) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + h, h);
      ctx.stroke();
    }
    ctx.restore();
  }

  function eyeCanvas() {
    var c = makeCanvas(256), ctx = c.getContext("2d");
    // anillo gris claro
    ctx.fillStyle = COLORS.eyeRing;
    ctx.beginPath(); ctx.arc(128, 128, 122, 0, Math.PI * 2); ctx.fill();
    // ojo negro con un poco de volumen
    var g = ctx.createRadialGradient(110, 100, 10, 128, 128, 112);
    g.addColorStop(0, "#3b4043");
    g.addColorStop(1, COLORS.eye);
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(128, 128, 108, 0, Math.PI * 2); ctx.fill();
    stitchHatch(ctx, 256, 256, "rgba(255,255,255,0.05)");
    // brillo grande arriba a la derecha y uno pequeño abajo
    ctx.fillStyle = "#f6f6f0";
    ctx.beginPath(); ctx.ellipse(160, 84, 36, 32, -0.4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(246,246,240,0.85)";
    ctx.beginPath(); ctx.arc(96, 168, 13, 0, Math.PI * 2); ctx.fill();
    return c;
  }

  // Ojo feliz: un arco bordado (∩), como cuando el peluche sonríe.
  function happyEyeCanvas() {
    var c = makeCanvas(256), ctx = c.getContext("2d");
    ctx.lineCap = "round";
    ctx.strokeStyle = COLORS.eye;
    ctx.lineWidth = 34;
    ctx.beginPath();
    ctx.arc(128, 168, 82, Math.PI * 1.08, Math.PI * 1.92);
    ctx.stroke();
    return c;
  }

  function nosePath(ctx) {
    // Nariz de koala: ancha y redonda arriba, más angosta abajo.
    ctx.beginPath();
    ctx.moveTo(128, 18);
    ctx.bezierCurveTo(218, 18, 236, 96, 214, 156);
    ctx.bezierCurveTo(196, 206, 160, 238, 128, 238);
    ctx.bezierCurveTo(96, 238, 60, 206, 42, 156);
    ctx.bezierCurveTo(20, 96, 38, 18, 128, 18);
    ctx.closePath();
  }

  function noseCanvas() {
    var c = makeCanvas(256), ctx = c.getContext("2d");
    nosePath(ctx);
    ctx.fillStyle = COLORS.noseLine;
    ctx.fill();
    ctx.save();
    ctx.translate(128, 128); ctx.scale(0.9, 0.9); ctx.translate(-128, -128);
    nosePath(ctx);
    var g = ctx.createRadialGradient(110, 90, 10, 128, 128, 130);
    g.addColorStop(0, "#8a8c8e");
    g.addColorStop(1, "#6c6e70");
    ctx.fillStyle = g;
    ctx.fill();
    ctx.restore();
    stitchHatch(ctx, 256, 256, "rgba(0,0,0,0.07)");
    // costurita de abajo
    ctx.strokeStyle = COLORS.noseLine;
    ctx.lineWidth = 9;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(104, 214); ctx.quadraticCurveTo(128, 196, 152, 214);
    ctx.stroke();
    return c;
  }

  function heartPath(ctx, s) {
    // Corazón centrado en (256,256) dentro de un lienzo de 512.
    ctx.save();
    ctx.translate(256, 256);
    ctx.scale(s, s);
    ctx.beginPath();
    ctx.moveTo(0, -120);
    ctx.bezierCurveTo(30, -215, 245, -215, 238, -60);
    ctx.bezierCurveTo(232, 40, 90, 120, 0, 215);
    ctx.bezierCurveTo(-90, 120, -232, 40, -238, -60);
    ctx.bezierCurveTo(-245, -215, -30, -215, 0, -120);
    ctx.closePath();
    ctx.restore();
  }

  function heartCanvas() {
    var c = makeCanvas(512), ctx = c.getContext("2d"), r = rng(33);
    // borde malva
    heartPath(ctx, 1);
    ctx.fillStyle = COLORS.heartEdge;
    ctx.fill();
    // costura del borde
    ctx.setLineDash([10, 8]);
    ctx.strokeStyle = "rgba(120,70,95,0.55)";
    ctx.lineWidth = 3;
    heartPath(ctx, 0.965);
    ctx.stroke();
    ctx.setLineDash([]);
    // brillantina rosa
    heartPath(ctx, 0.86);
    var g = ctx.createRadialGradient(230, 210, 20, 256, 256, 260);
    g.addColorStop(0, "#f070ad");
    g.addColorStop(1, "#c94a8a");
    ctx.fillStyle = g;
    ctx.fill();
    ctx.save();
    heartPath(ctx, 0.86);
    ctx.clip();
    var tones = ["rgba(255,255,255,0.75)", "rgba(255,200,235,0.8)", "rgba(160,40,110,0.4)", "rgba(180,245,255,0.7)", "rgba(210,255,230,0.6)"];
    for (var i = 0; i < 9000; i++) {
      ctx.fillStyle = tones[Math.floor(r() * tones.length)];
      var s = 1 + r() * 2.4;
      ctx.fillRect(r() * 512, r() * 512, s, s);
    }
    ctx.restore();
    return c;
  }

  function heartSparkleCanvas() {
    var c = makeCanvas(512), ctx = c.getContext("2d"), r = rng(77);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, 512, 512);
    ctx.save();
    heartPath(ctx, 0.9);
    ctx.clip();
    for (var i = 0; i < 700; i++) {
      ctx.fillStyle = ["#ffffff", "#c8f7ff", "#ffe0f3", "#e0ffef"][Math.floor(r() * 4)];
      var s = 1.5 + r() * 2.5;
      ctx.fillRect(r() * 512, r() * 512, s, s);
    }
    ctx.restore();
    return c;
  }

  function mouthCanvas(kind) {
    var c = makeCanvas(256, 128), ctx = c.getContext("2d");
    ctx.lineCap = "round";
    if (kind === "open") {
      ctx.fillStyle = "#4a2f3a";
      ctx.beginPath(); ctx.ellipse(128, 64, 60, 46, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#e07a96";
      ctx.beginPath(); ctx.ellipse(128, 88, 34, 18, 0, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.strokeStyle = COLORS.noseLine;
      ctx.lineWidth = 14;
      ctx.beginPath();
      if (kind === "smile") { ctx.moveTo(48, 40); ctx.quadraticCurveTo(128, 120, 208, 40); }
      else { ctx.moveTo(56, 100); ctx.quadraticCurveTo(128, 30, 200, 100); }
      ctx.stroke();
    }
    return c;
  }

  // Versión borrosa de la forma (para que los parches queden acolchados).
  function puffMask(canvas, blur) {
    var w = canvas.width, h = canvas.height;
    var m = makeCanvas(w, h), ctx = m.getContext("2d");
    try { ctx.filter = "blur(" + blur + "px)"; } catch (e) {}
    ctx.drawImage(canvas, 0, 0);
    var data = ctx.getImageData(0, 0, w, h).data;
    return { w: w, h: h, data: data };
  }

  function sampleMask(mask, u, v) {
    var x = Math.min(mask.w - 1, Math.max(0, Math.round(u * (mask.w - 1))));
    var y = Math.min(mask.h - 1, Math.max(0, Math.round(v * (mask.h - 1))));
    return mask.data[(y * mask.w + x) * 4 + 3] / 255;
  }

  /* ---------- Escena ---------- */
  function create(initialContainer) {
    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    } catch (e) {
      return null;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x000000, 0);
    var aniso = renderer.capabilities.getMaxAnisotropy ? renderer.capabilities.getMaxAnisotropy() : 1;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 0.5, 6.6);
    camera.lookAt(0, 0.28, 0);

    /* Luces suaves, como de foto con luz de ventana */
    scene.add(new THREE.HemisphereLight(0xffffff, 0xaab6c4, 0.55));
    var key = new THREE.DirectionalLight(0xfffaf3, 0.62);
    key.position.set(2.4, 5.5, 6);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 22;
    key.shadow.camera.left = -4;
    key.shadow.camera.right = 4;
    key.shadow.camera.top = 4;
    key.shadow.camera.bottom = -4;
    key.shadow.bias = -0.0005;
    scene.add(key);
    var fill = new THREE.DirectionalLight(0xdfe8ff, 0.3);
    fill.position.set(-4, 1.5, 4);
    scene.add(fill);
    var rim = new THREE.DirectionalLight(0xffffff, 0.3);
    rim.position.set(0, 3, -5);
    scene.add(rim);

    var koala = new THREE.Group();
    scene.add(koala);

    /* ---------- Cuerpo en forma de huevo ---------- */
    var A = 1.0;   // medio ancho
    var B = 1.12;  // media altura
    var C = 0.78;  // medio fondo

    // El huevo se angosta un poco hacia arriba.
    function taper(y) { return 1 - 0.09 * (y / B); }

    // Altura de la superficie del frente del cuerpo en (x, y).
    function surfaceZ(x, y) {
      var t = taper(y);
      var q = 1 - (y / B) * (y / B) - (x / (A * t)) * (x / (A * t));
      return C * t * Math.sqrt(Math.max(0, q));
    }

    var velvetTex = canvasTexture(velvetCanvas(), 5);
    velvetTex.anisotropy = aniso;
    var fur = new THREE.MeshPhysicalMaterial({
      color: COLORS.fur,
      map: velvetTex,
      bumpMap: velvetTex,
      bumpScale: 0.015,
      roughness: 0.92,
      metalness: 0,
      sheen: 0.55,
      sheenRoughness: 0.5,
      sheenColor: new THREE.Color("#cfccc4")
    });

    var bodyGeo = new THREE.SphereGeometry(1, 96, 72);
    var bp = bodyGeo.attributes.position;
    for (var i = 0; i < bp.count; i++) {
      var y = bp.getY(i) * B;
      var t = taper(y);
      // fondo un poco más plano, como el peluche sentado
      if (y < -B * 0.86) y = -B * 0.86 + (y + B * 0.86) * 0.55;
      bp.setXYZ(i, bp.getX(i) * A * t, y, bp.getZ(i) * C * t);
    }
    bodyGeo.computeVertexNormals();
    var body = new THREE.Mesh(bodyGeo, fur);
    body.castShadow = true;
    body.receiveShadow = true;
    koala.add(body);

    /* ---------- Parches bordados pegados al cuerpo ---------- */
    // Crea un parche que sigue la curva del cuerpo y queda un poco acolchado.
    function makePatch(canvas, w, h, cx, cy, opts) {
      opts = opts || {};
      var seg = opts.seg || 48;
      var geo = new THREE.PlaneGeometry(w, h, seg, Math.round(seg * h / w));
      var mask = puffMask(canvas, opts.blur || 10);
      var p = geo.attributes.position, uv = geo.attributes.uv;
      for (var k = 0; k < p.count; k++) {
        var lx = p.getX(k), ly = p.getY(k);
        var m = sampleMask(mask, uv.getX(k), 1 - uv.getY(k));
        var z = surfaceZ(cx + lx, cy + ly) + (opts.lift || 0.006) + (opts.puff || 0) * m;
        p.setXYZ(k, lx, ly, z);
      }
      geo.computeVertexNormals();
      var tex = canvasTexture(canvas);
      tex.anisotropy = aniso;
      var mat = new THREE.MeshPhysicalMaterial(Object.assign({
        map: tex,
        transparent: false,
        alphaTest: 0.5,
        roughness: 0.75,
        metalness: 0
      }, opts.material || {}));
      var mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(cx, cy, 0);
      mesh.castShadow = !!opts.shadow;
      return mesh;
    }

    /* Ojos bordados */
    var EYE_Y = 0.6, EYE_X = 0.47;
    var eyeCan = eyeCanvas();
    var eyeL = makePatch(eyeCan, 0.37, 0.37, -EYE_X, EYE_Y, { puff: 0.03, seg: 32, material: { roughness: 0.4, clearcoat: 0.4, clearcoatRoughness: 0.3 } });
    var eyeR = makePatch(eyeCan, 0.37, 0.37, EYE_X, EYE_Y, { puff: 0.03, seg: 32, material: { roughness: 0.4, clearcoat: 0.4, clearcoatRoughness: 0.3 } });
    koala.add(eyeL, eyeR);
    var happyCan = happyEyeCanvas();
    var happyL = makePatch(happyCan, 0.37, 0.37, -EYE_X, EYE_Y, { puff: 0.02, seg: 24, material: { roughness: 0.6 } });
    var happyR = makePatch(happyCan, 0.37, 0.37, EYE_X, EYE_Y, { puff: 0.02, seg: 24, material: { roughness: 0.6 } });
    happyL.visible = happyR.visible = false;
    koala.add(happyL, happyR);

    /* Nariz bordada */
    var nose = makePatch(noseCanvas(), 0.44, 0.5, 0, 0.55, { puff: 0.06, seg: 32, material: { roughness: 0.9 } });
    koala.add(nose);

    /* Corazón de brillantina */
    var heartSparkleTex = canvasTexture(heartSparkleCanvas());
    heartSparkleTex.wrapS = heartSparkleTex.wrapT = THREE.RepeatWrapping;
    var heart = makePatch(heartCanvas(), 1.42, 1.36, 0, -0.32, {
      puff: 0.1, seg: 72, blur: 18, shadow: true,
      material: {
        roughness: 0.32,
        metalness: 0.15,
        clearcoat: 0.8,
        clearcoatRoughness: 0.25,
        emissive: new THREE.Color("#ffffff"),
        emissiveMap: heartSparkleTex,
        emissiveIntensity: 0.55
      }
    });
    koala.add(heart);

    /* Brillo del corazón: un halo rosa y una luz que tiñe el pelaje. */
    function heartGlowCanvas() {
      var c = makeCanvas(512), ctx = c.getContext("2d");
      ctx.shadowColor = "rgba(255,90,170,1)";
      ctx.shadowBlur = 60;
      heartPath(ctx, 0.95);
      ctx.fillStyle = "rgba(255,120,190,0.55)";
      ctx.fill();
      ctx.shadowBlur = 120;
      ctx.fill();
      return c;
    }
    var heartHalo = new THREE.Sprite(new THREE.SpriteMaterial({
      map: canvasTexture(heartGlowCanvas()),
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    }));
    heartHalo.position.set(0, -0.32, surfaceZ(0, -0.32) + 0.16);
    heartHalo.scale.set(1.9, 1.9, 1);
    heartHalo.visible = false;
    koala.add(heartHalo);
    var heartLight = new THREE.PointLight(0xff5fae, 0, 3.2, 2);
    heartLight.position.set(0, -0.3, surfaceZ(0, -0.3) + 0.5);
    koala.add(heartLight);

    /* Bocas (el peluche no tiene: solo aparecen al hablar o con emociones) */
    var mouthOpen = makePatch(mouthCanvas("open"), 0.24, 0.13, 0, 0.19, { seg: 16, lift: 0.012 });
    var smile = makePatch(mouthCanvas("smile"), 0.26, 0.13, 0, 0.21, { seg: 16, lift: 0.012 });
    var frown = makePatch(mouthCanvas("frown"), 0.22, 0.11, 0, 0.19, { seg: 16, lift: 0.012 });
    mouthOpen.visible = smile.visible = frown.visible = false;
    koala.add(mouthOpen, smile, frown);

    /* ---------- Orejas de borrego ---------- */
    var sherpaTex = canvasTexture(sherpaCanvas(), 2);
    var earMat = new THREE.MeshStandardMaterial({
      color: COLORS.ear,
      map: sherpaTex,
      bumpMap: sherpaTex,
      bumpScale: 0.012,
      roughness: 1,
      metalness: 0,
      vertexColors: true
    });

    function makeEar(side) {
      var geo = new THREE.SphereGeometry(0.42, 64, 48);
      var p = geo.attributes.position;
      var colors = [];
      var r = rng(side > 0 ? 5 : 9);
      for (var k = 0; k < p.count; k++) {
        var x = p.getX(k), y = p.getY(k), z = p.getZ(k);
        var len = Math.sqrt(x * x + y * y + z * z) || 1;
        // grumos de rizos
        var n = Math.sin(x * 38 + 1.3) * Math.sin(y * 41 + 0.7) * Math.sin(z * 35 + 2.1);
        n += 0.5 * Math.sin(x * 83 + y * 17) * Math.sin(z * 77 + y * 23);
        var d = 1 + 0.06 * n + (r() - 0.5) * 0.03;
        p.setXYZ(k, x / len * 0.42 * d * 0.74, y / len * 0.42 * d, z / len * 0.42 * d * 0.4);
        var shade = 0.97 + 0.06 * n + (r() - 0.5) * 0.08;
        colors.push(shade, shade, shade);
      }
      geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
      geo.computeVertexNormals();
      var ear = new THREE.Mesh(geo, earMat);
      ear.castShadow = true;
      var g = new THREE.Group();
      g.add(ear);
      g.position.set(side * 0.86, 0.64, -0.04);
      g.rotation.set(0, side * 0.35, side * -0.18);
      return g;
    }
    var earL = makeEar(-1);
    var earR = makeEar(1);
    koala.add(earL, earR);

    /* ---------- Cuerno de unicornio ---------- */
    function hornCanvas() {
      var c = makeCanvas(128, 512), ctx = c.getContext("2d"), r = rng(55);
      var g = ctx.createLinearGradient(0, 512, 0, 0);
      g.addColorStop(0, COLORS.hornBase);
      g.addColorStop(0.4, "#ec74a2");
      g.addColorStop(0.62, COLORS.hornTip);
      g.addColorStop(1, "#f8d3c6");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 128, 512);
      var tones = ["rgba(255,255,255,0.7)", "rgba(255,210,235,0.7)", "rgba(170,40,110,0.35)", "rgba(190,245,255,0.6)"];
      for (var k = 0; k < 3500; k++) {
        ctx.fillStyle = tones[Math.floor(r() * tones.length)];
        var s = 0.8 + r() * 1.8;
        ctx.fillRect(r() * 128, r() * 512, s, s);
      }
      return c;
    }
    var hornSparkleTex = canvasTexture(glitterCanvas("#000", 91, true));
    hornSparkleTex.wrapS = hornSparkleTex.wrapT = THREE.RepeatWrapping;
    hornSparkleTex.repeat.set(1, 3);
    var hornPts = [];
    var HORN_H = 0.8;
    for (var hp = 0; hp <= 24; hp++) {
      var f = hp / 24;
      var rad = 0.17 * Math.pow(1 - f, 0.9) + 0.06;
      hornPts.push(new THREE.Vector2(rad, f * HORN_H));
    }
    // punta redondeada
    for (var tp = 1; tp <= 6; tp++) {
      var ang = (tp / 6) * Math.PI / 2;
      hornPts.push(new THREE.Vector2(0.06 * Math.cos(ang), HORN_H + 0.05 * Math.sin(ang)));
    }
    var hornGeo = new THREE.LatheGeometry(hornPts, 48);
    var horn = new THREE.Mesh(hornGeo, new THREE.MeshPhysicalMaterial({
      map: canvasTexture(hornCanvas()),
      roughness: 0.45,
      metalness: 0.1,
      clearcoat: 0.5,
      clearcoatRoughness: 0.35,
      emissive: new THREE.Color("#ffffff"),
      emissiveMap: hornSparkleTex,
      emissiveIntensity: 0.6
    }));
    horn.castShadow = true;
    horn.position.set(0.02, B * 0.93, 0.1);
    horn.rotation.set(0.12, 0, -0.07);
    koala.add(horn);

    /* ---------- Burbujas ? y Zzz ---------- */
    function makeTextSprite(text, color) {
      var canvas = makeCanvas(128);
      var ctx = canvas.getContext("2d");
      ctx.font = "bold 92px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = color;
      ctx.fillText(text, 64, 64);
      var mat = new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true, depthWrite: false });
      var sp = new THREE.Sprite(mat);
      sp.scale.set(0.55, 0.55, 0.55);
      return sp;
    }
    var question = makeTextSprite("?", "#ffb703");
    question.position.set(1.05, 1.35, 0.9);
    question.visible = false;
    koala.add(question);

    var zzz = makeTextSprite("Zzz", "#6b7a8f");
    zzz.position.set(1.05, 1.35, 0.9);
    zzz.visible = false;
    koala.add(zzz);

    /* ---------- Sombra en el piso ---------- */
    var floor = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), new THREE.ShadowMaterial({ opacity: 0.14 }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -B * 0.93;
    floor.receiveShadow = true;
    scene.add(floor);

    /* ---------- Estado ---------- */
    var state = {
      visible: true,
      talking: false,
      expression: "idle",
      eyeY: 1,
      eyeShift: 0,
      mouth: 0,
      headTilt: 0,
      happyUntil: 0,
      moodUntil: 0,
      moodInterval: 14000,
      nextMood: performance.now() + 14000,
      nextBlink: 2200 + Math.random() * 3000,
      blinkUntil: 0,
      nextSparkle: 0,
      glowStart: 0,
      glowUntil: 0
    };

    var activeContainer = null;

    function setExpression(name, duration) {
      state.expression = name;
      var now = performance.now();
      var until = now + (duration || 2200);
      if (name === "idle") {
        state.moodUntil = 0;
        state.nextMood = now + state.moodInterval * 0.6 + Math.random() * state.moodInterval * 0.4;
      } else if (name === "happy") {
        state.happyUntil = until;
      } else {
        state.moodUntil = until;
      }
      state.nextMood = Math.max(state.nextMood, until + state.moodInterval);
    }

    function talk(on) { state.talking = !!on; }

    // Hace brillar el corazón durante "ms" milisegundos (con latidos).
    function glowHeart(ms) {
      var now = performance.now();
      if (now > state.glowUntil) state.glowStart = now;
      state.glowUntil = Math.max(state.glowUntil, now + (ms || 1600));
    }

    function celebrate() {
      glowHeart(2200);
      setExpression("happy", 1500);
      state.mouth = 0;
    }

    function setMoodInterval(ms) {
      state.moodInterval = Math.max(4000, ms || 14000);
      state.nextMood = performance.now() + state.moodInterval;
    }

    // El color elegido en Ajustes tiñe el terciopelo; las orejas quedan un tono más claro.
    function setFurColor(color) {
      try {
        fur.color.set(color);
        earMat.color.set(color).lerp(new THREE.Color("#fff8ec"), 0.5);
      } catch (e) {}
    }

    function getFurColor() { return "#" + fur.color.getHexString(); }

    function resize() {
      if (!activeContainer) return;
      var w = activeContainer.clientWidth || 220;
      var h;
      if (activeContainer.id === "koala-home") h = w * 0.95;
      else h = activeContainer.clientHeight || w;
      renderer.setSize(w, h, true);
      renderer.domElement.style.display = "block";
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }

    function attach(cont) {
      if (!cont) return;
      activeContainer = cont;
      if (renderer.domElement.parentNode !== cont) cont.appendChild(renderer.domElement);
      state.visible = true;
      resize();
    }

    function hide() { state.visible = false; }

    var clock = new THREE.Clock();

    function update() {
      var t = clock.getElapsedTime();
      var now = performance.now();

      /* parpadeo */
      if (now > state.nextBlink && now > state.blinkUntil) {
        state.blinkUntil = now + 120;
        state.nextBlink = now + 2200 + Math.random() * 3500;
      }
      var blinking = now < state.blinkUntil;

      /* estado de ánimo automático cuando está quieto */
      if (!state.talking && state.expression === "idle" && now > state.nextMood) {
        var moods = ["thinking", "sleepy", "sad", "happy"];
        setExpression(moods[Math.floor(Math.random() * moods.length)], 2300);
      }

      /* objetivos */
      var targetEye = 1, targetMouth = 0, targetTilt = 0, targetShift = 0;
      if (state.talking) {
        targetMouth = 0.55; targetTilt = 0.03;
      } else if (state.expression === "happy") {
        targetMouth = 0.14; targetTilt = 0.06;
      } else if (state.expression === "surprised") {
        targetEye = 1.2; targetMouth = 0.7; targetTilt = -0.05;
      } else if (state.expression === "sad") {
        targetEye = 0.62; targetTilt = -0.1; targetShift = -0.025;
      } else if (state.expression === "thinking") {
        targetEye = 0.92; targetTilt = 0.08; targetShift = 0.03;
      } else if (state.expression === "sleepy") {
        targetEye = 0.14; targetTilt = -0.12; targetShift = -0.01;
      }
      if (blinking) targetEye = 0.1;

      state.eyeY += (targetEye - state.eyeY) * 0.25;
      state.eyeShift += (targetShift - state.eyeShift) * 0.15;
      state.mouth += (targetMouth - state.mouth) * 0.25;
      state.headTilt += (targetTilt - state.headTilt) * 0.12;

      var happyEyes = !state.talking && state.expression === "happy";
      happyL.visible = happyR.visible = happyEyes;
      eyeL.visible = eyeR.visible = !happyEyes;
      eyeL.scale.y = eyeR.scale.y = state.eyeY;
      eyeL.position.y = eyeR.position.y = EYE_Y + state.eyeShift;

      /* bocas */
      var talkingNow = state.talking;
      var surprised = state.expression === "surprised";
      smile.visible = !talkingNow && state.expression === "happy";
      frown.visible = !talkingNow && state.expression === "sad";
      mouthOpen.visible = talkingNow || surprised;
      if (talkingNow) {
        mouthOpen.scale.y = Math.max(0.25, 0.6 + Math.sin(t * 22) * 0.45);
      } else {
        mouthOpen.scale.y = surprised ? Math.max(0.3, state.mouth * 1.3) : 1;
      }

      /* destellos de la brillantina */
      if (now > state.nextSparkle) {
        state.nextSparkle = now + 140;
        heartSparkleTex.offset.set(Math.random(), Math.random());
        hornSparkleTex.offset.set(Math.random(), Math.random());
      }
      /* brillo del corazón (al tocar a PIPI y en cada logro) */
      var glow = 0;
      if (now < state.glowUntil) {
        var age = (now - state.glowStart) / 1000;
        var fadeIn = Math.min(1, age / 0.18);
        var fadeOut = Math.min(1, (state.glowUntil - now) / 450);
        var beat = 0.75 + 0.25 * Math.pow(Math.abs(Math.sin(age * 5.2)), 2);
        glow = fadeIn * fadeOut * beat;
      }
      heart.material.emissiveIntensity = 0.45 + Math.sin(t * 5) * 0.12 + glow * 1.3;
      heart.material.color.setScalar(1 + glow * 0.22);
      var hs = 1 + glow * 0.07;
      heart.scale.set(hs, hs, 1 + glow * 0.03);
      heartHalo.visible = glow > 0.01;
      heartHalo.material.opacity = glow * 0.45;
      heartHalo.scale.set(1.75 + glow * 0.2, 1.75 + glow * 0.2, 1);
      heartLight.intensity = glow * 0.7;

      /* burbujas */
      question.visible = state.expression === "thinking";
      zzz.visible = state.expression === "sleepy";
      if (question.visible) {
        question.position.y = 1.35 + Math.sin(t * 3) * 0.05;
        question.material.rotation = Math.sin(t * 2) * 0.1;
      }
      if (zzz.visible) {
        zzz.position.y = 1.35 + Math.sin(t * 1.6) * 0.07;
        zzz.material.opacity = 0.6 + Math.sin(t * 2) * 0.3;
      }

      /* movimiento */
      koala.rotation.z = state.headTilt;
      koala.rotation.y = Math.sin(t * 0.55) * 0.1;
      var bob = Math.sin(t * 1.7) * 0.03;
      if (state.expression === "happy") bob += Math.abs(Math.sin(t * 9)) * 0.045;
      if (state.expression === "sleepy") bob = Math.sin(t * 0.9) * 0.02;
      koala.position.y = bob;

      earL.rotation.z = 0.18 + Math.sin(t * 2.1) * 0.04;
      earR.rotation.z = -0.18 - Math.sin(t * 2.1) * 0.04;

      /* fin de expresión */
      if (state.expression === "happy" && now > state.happyUntil) {
        state.expression = "idle";
      } else if (
        (state.expression === "thinking" || state.expression === "sleepy" || state.expression === "sad" || state.expression === "surprised") &&
        now > state.moodUntil
      ) {
        state.expression = "idle";
      }
    }

    function loop() {
      requestAnimationFrame(loop);
      if (!state.visible) return;
      update();
      renderer.render(scene, camera);
    }

    attach(initialContainer);
    window.addEventListener("resize", resize);
    loop();

    return {
      attach: attach,
      hide: hide,
      resize: resize,
      talk: talk,
      setExpression: setExpression,
      celebrate: celebrate,
      glowHeart: glowHeart,
      setMoodInterval: setMoodInterval,
      setFurColor: setFurColor,
      getFurColor: getFurColor,
      renderer: renderer,
      scene: scene,
      camera: camera
    };
  }

  window.Pipi3D = { create: create };
})();

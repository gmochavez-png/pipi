/* =========================================================
   PIPI · Personaje 3D con Three.js
   Koala con expresiones: idle, blink, talking, happy,
   surprised, sad, thinking, sleepy.
   ========================================================= */

(function () {
  "use strict";
  if (!window.THREE) { window.Pipi3D = null; return; }
  var THREE = window.THREE;

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

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0.3, 6.0);
    camera.lookAt(0, 0.02, 0);

    /* ---------- Luces ---------- */
    scene.add(new THREE.HemisphereLight(0xffffff, 0x9db5cf, 0.7));

    var key = new THREE.DirectionalLight(0xffffff, 0.85);
    key.position.set(2.2, 6, 5.5);
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

    var fill = new THREE.DirectionalLight(0xbcd4ff, 0.22);
    fill.position.set(-4, 2, 4);
    scene.add(fill);

    var rim = new THREE.DirectionalLight(0xffffff, 0.25);
    rim.position.set(0, 2, -5);
    scene.add(rim);

    /* ---------- Materiales ---------- */
    var fur = new THREE.MeshStandardMaterial({ color: 0x8b93a2, roughness: 0.95, metalness: 0 });
    var white = new THREE.MeshStandardMaterial({ color: 0xfbfbf8, roughness: 0.9 });
    var black = new THREE.MeshStandardMaterial({ color: 0x20242b, roughness: 0.45 });
    var pink = new THREE.MeshStandardMaterial({ color: 0xf6a8c0, roughness: 1, transparent: true, opacity: 0.9 });
    var mouthMat = new THREE.MeshStandardMaterial({ color: 0x3a2b2f, roughness: 0.6 });
    var shine = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.15, metalness: 0 });

    var koala = new THREE.Group();
    scene.add(koala);

    /* ---------- Cuerpo ---------- */
    var body = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 48), fur);
    body.scale.set(1.1, 1.05, 1.0);
    body.castShadow = true;
    body.receiveShadow = true;
    koala.add(body);

    var belly = new THREE.Mesh(new THREE.SphereGeometry(0.68, 40, 40), white);
    belly.scale.set(0.92, 0.88, 0.55);
    belly.position.set(0, -0.3, 0.62);
    belly.castShadow = true;
    koala.add(belly);

    /* ---------- Orejas ---------- */
    function makeEar(side) {
      var g = new THREE.Group();
      var outer = new THREE.Mesh(new THREE.SphereGeometry(0.46, 32, 32), fur);
      outer.scale.set(1, 1, 0.5);
      outer.castShadow = true;
      g.add(outer);
      var inner = new THREE.Mesh(new THREE.SphereGeometry(0.26, 32, 32), white);
      inner.scale.set(1, 1, 0.42);
      inner.position.set(0, 0.02, 0.14);
      g.add(inner);
      g.position.set(side * 0.9, 0.8, 0.06);
      g.rotation.z = side * -0.16;
      return g;
    }
    var earL = makeEar(-1);
    var earR = makeEar(1);
    koala.add(earL, earR);

    /* ---------- Ojos ---------- */
    function makeEye(side) {
      var g = new THREE.Group();
      var e = new THREE.Mesh(new THREE.SphereGeometry(0.14, 32, 32), black);
      e.scale.set(1, 1.2, 0.75);
      g.add(e);
      var h1 = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 16), shine);
      h1.position.set(-0.035, 0.06, 0.11);
      g.add(h1);
      var h2 = new THREE.Mesh(new THREE.SphereGeometry(0.022, 12, 12), shine);
      h2.position.set(0.04, -0.02, 0.12);
      g.add(h2);
      g.position.set(side * 0.34, 0.2, 0.94);
      return g;
    }
    var eyeL = makeEye(-1);
    var eyeR = makeEye(1);
    koala.add(eyeL, eyeR);

    /* ---------- Nariz ---------- */
    var nose = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 32), black);
    nose.scale.set(1.25, 1.0, 0.82);
    nose.position.set(0, -0.06, 1.04);
    nose.castShadow = true;
    koala.add(nose);

    var noseShine = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 12), shine);
    noseShine.position.set(-0.06, 0.02, 1.19);
    koala.add(noseShine);

    /* ---------- Mejillas ---------- */
    function makeCheek(side) {
      var c = new THREE.Mesh(new THREE.SphereGeometry(0.17, 24, 24), pink.clone());
      c.scale.set(1, 0.78, 0.3);
      c.position.set(side * 0.58, -0.07, 0.88);
      return c;
    }
    var cheekL = makeCheek(-1);
    var cheekR = makeCheek(1);
    koala.add(cheekL, cheekR);

    /* ---------- Manitas ---------- */
    function makePaw(side) {
      var p = new THREE.Mesh(new THREE.SphereGeometry(0.16, 24, 24), fur);
      p.scale.set(1, 0.72, 0.45);
      p.position.set(side * 0.42, -0.4, 0.92);
      p.castShadow = true;
      return p;
    }
    koala.add(makePaw(-1), makePaw(1));

    /* ---------- Boca ---------- */
    var smile = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.035, 10, 28, Math.PI), black);
    smile.rotation.z = Math.PI;
    smile.position.set(0, -0.21, 1.0);
    koala.add(smile);

    var frown = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.032, 10, 28, Math.PI), black);
    frown.position.set(0, -0.3, 1.0);
    frown.visible = false;
    koala.add(frown);

    var mouthOpen = new THREE.Mesh(new THREE.SphereGeometry(0.15, 24, 24), mouthMat);
    mouthOpen.scale.set(1, 0.2, 0.55);
    mouthOpen.position.set(0, -0.23, 1.01);
    mouthOpen.visible = false;
    koala.add(mouthOpen);

    /* ---------- Burbujas ? y Zzz ---------- */
    function makeTextSprite(text, color) {
      var canvas = document.createElement("canvas");
      canvas.width = 128;
      canvas.height = 128;
      var ctx = canvas.getContext("2d");
      ctx.font = "bold 92px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = color;
      ctx.fillText(text, 64, 64);
      var tex = new THREE.CanvasTexture(canvas);
      var mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
      var sp = new THREE.Sprite(mat);
      sp.scale.set(0.55, 0.55, 0.55);
      return sp;
    }
    var question = makeTextSprite("?", "#ffb703");
    question.position.set(0.88, 0.95, 1.15);
    question.visible = false;
    koala.add(question);

    var zzz = makeTextSprite("Zzz", "#6b7a8f");
    zzz.position.set(0.88, 0.95, 1.15);
    zzz.visible = false;
    koala.add(zzz);

    /* ---------- Sombra ---------- */
    var floor = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), new THREE.ShadowMaterial({ opacity: 0.12 }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.2;
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
      cheek: 1,
      happyUntil: 0,
      moodUntil: 0,
      nextMood: performance.now() + 12000,
      nextBlink: 2200 + Math.random() * 3000,
      blinkUntil: 0
    };

    var activeContainer = null;

    function setExpression(name, duration) {
      state.expression = name;
      var now = performance.now();
      var until = now + (duration || 2200);
      if (name === "idle") {
        state.moodUntil = 0;
        state.nextMood = now + 9000 + Math.random() * 6000;
      } else if (name === "happy") {
        state.happyUntil = until;
      } else {
        state.moodUntil = until;
      }
      state.nextMood = Math.max(state.nextMood, until + 12000);
    }

    function talk(on) {
      state.talking = !!on;
    }

    function celebrate() {
      setExpression("happy", 1500);
      state.mouth = 0;
    }

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

      /* estado de animo automatico cuando esta idle */
      if (!state.talking && state.expression === "idle" && now > state.nextMood) {
        var moods = ["thinking", "sleepy", "sad", "happy"];
        var pick = moods[Math.floor(Math.random() * moods.length)];
        setExpression(pick, 2300);
      }

      /* objetivos */
      var targetEye = 1, targetMouth = 0, targetTilt = 0, targetCheek = 1, targetShift = 0;
      if (state.talking) {
        targetEye = 1; targetMouth = 0.55; targetTilt = 0.03; targetCheek = 1.05;
      } else if (state.expression === "happy") {
        targetEye = 0.42; targetMouth = 0.14; targetTilt = 0.06; targetCheek = 1.14;
      } else if (state.expression === "surprised") {
        targetEye = 1.25; targetMouth = 0.7; targetTilt = -0.05; targetCheek = 1;
      } else if (state.expression === "sad") {
        targetEye = 0.62; targetMouth = 0; targetTilt = -0.1; targetCheek = 0.9; targetShift = -0.025;
      } else if (state.expression === "thinking") {
        targetEye = 0.92; targetMouth = 0; targetTilt = 0.08; targetCheek = 1; targetShift = 0.035;
      } else if (state.expression === "sleepy") {
        targetEye = 0.14; targetMouth = 0; targetTilt = -0.12; targetCheek = 1; targetShift = -0.01;
      } else {
        targetEye = 1; targetMouth = 0; targetTilt = 0; targetCheek = 1;
      }
      if (blinking) targetEye = 0.1;

      state.eyeY += (targetEye - state.eyeY) * 0.25;
      state.eyeShift += (targetShift - state.eyeShift) * 0.15;
      state.mouth += (targetMouth - state.mouth) * 0.25;
      state.headTilt += (targetTilt - state.headTilt) * 0.12;
      state.cheek += (targetCheek - state.cheek) * 0.15;

      eyeL.scale.y = state.eyeY;
      eyeR.scale.y = state.eyeY;
      eyeL.position.y = 0.2 + state.eyeShift;
      eyeR.position.y = 0.2 + state.eyeShift;

      cheekL.scale.set(state.cheek, state.cheek * 0.78, 0.3);
      cheekR.scale.set(state.cheek, state.cheek * 0.78, 0.3);

      /* bocas */
      var talkingNow = state.talking;
      var surprised = state.expression === "surprised";
      var sad = state.expression === "sad";

      smile.visible = !talkingNow && !surprised && !sad;
      frown.visible = sad && !talkingNow;
      mouthOpen.visible = talkingNow || surprised;

      if (talkingNow) {
        var m = 0.35 + Math.sin(t * 22) * 0.35;
        mouthOpen.scale.y = Math.max(0.12, m);
      } else {
        mouthOpen.scale.y = surprised ? state.mouth : 0.2;
      }

      /* burbujas */
      question.visible = state.expression === "thinking";
      zzz.visible = state.expression === "sleepy";
      if (question.visible) {
        question.position.y = 0.95 + Math.sin(t * 3) * 0.05;
        question.material.rotation = Math.sin(t * 2) * 0.1;
      }
      if (zzz.visible) {
        zzz.position.y = 0.95 + Math.sin(t * 1.6) * 0.07;
        zzz.material.opacity = 0.6 + Math.sin(t * 2) * 0.3;
      }

      /* movimiento */
      koala.rotation.z = state.headTilt;
      koala.rotation.y = Math.sin(t * 0.55) * 0.08;
      var bob = Math.sin(t * 1.7) * 0.03;
      if (state.expression === "happy") bob += Math.abs(Math.sin(t * 9)) * 0.045;
      if (state.expression === "sleepy") bob = Math.sin(t * 0.9) * 0.02;
      koala.position.y = bob;

      earL.rotation.z = -0.16 + Math.sin(t * 2.1) * 0.06;
      earR.rotation.z = 0.16 - Math.sin(t * 2.1) * 0.06;

      /* fin de expresion */
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
      renderer: renderer,
      scene: scene,
      camera: camera
    };
  }

  window.Pipi3D = { create: create };
})();

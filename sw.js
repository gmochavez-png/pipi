/* =========================================================
   PIPI · Service Worker
   Guarda la app en el teléfono para que funcione sin conexión.
   - Guarda todos los archivos de la app (HTML, CSS, JS, iconos y los
     170 audios de assets/audio).
   - NO guarda respuestas de otros sitios (Vikidia, Gemini u otras APIs):
     esas peticiones van directo a internet y nunca se guardan.
   Al cambiar algo, sube el número de CACHE para que los teléfonos
   reciban la versión nueva.
   ========================================================= */

var CACHE = "pipi-v18";

var APP_FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/styles.css",
  "./js/lessons.js",
  "./js/stories.js",
  "./js/chat.js",
  "./js/wordsearch.js",
  "./js/games.js",
  "./js/app.js",
  "./js/pipi3d.js",
  "./js/vendor/three.min.js",
  "./assets/koala.jpg",
  "./assets/icons/apple-touch-icon.png",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/icon-maskable-512.png"
];

// Todos los audios (generado a partir de assets/audio).
var AUDIO_FILES = [
  "./assets/audio/cuentos/estrella.mp3",
  "./assets/audio/cuentos/gatito.mp3",
  "./assets/audio/cuentos/mariposa.mp3",
  "./assets/audio/cuentos/nube.mp3",
  "./assets/audio/cuentos/sol-luna.mp3",
  "./assets/audio/ingles/animales/0.mp3",
  "./assets/audio/ingles/animales/1.mp3",
  "./assets/audio/ingles/animales/2.mp3",
  "./assets/audio/ingles/animales/3.mp3",
  "./assets/audio/ingles/animales/4.mp3",
  "./assets/audio/ingles/animales/5.mp3",
  "./assets/audio/ingles/animales/6.mp3",
  "./assets/audio/ingles/animales/7.mp3",
  "./assets/audio/ingles/animales/8.mp3",
  "./assets/audio/ingles/animales/9.mp3",
  "./assets/audio/ingles/colores/0.mp3",
  "./assets/audio/ingles/colores/1.mp3",
  "./assets/audio/ingles/colores/2.mp3",
  "./assets/audio/ingles/colores/3.mp3",
  "./assets/audio/ingles/colores/4.mp3",
  "./assets/audio/ingles/colores/5.mp3",
  "./assets/audio/ingles/colores/6.mp3",
  "./assets/audio/ingles/colores/7.mp3",
  "./assets/audio/ingles/colores/8.mp3",
  "./assets/audio/ingles/colores/9.mp3",
  "./assets/audio/ingles/cuerpo/0.mp3",
  "./assets/audio/ingles/cuerpo/1.mp3",
  "./assets/audio/ingles/cuerpo/2.mp3",
  "./assets/audio/ingles/cuerpo/3.mp3",
  "./assets/audio/ingles/cuerpo/4.mp3",
  "./assets/audio/ingles/cuerpo/5.mp3",
  "./assets/audio/ingles/cuerpo/6.mp3",
  "./assets/audio/ingles/cuerpo/7.mp3",
  "./assets/audio/ingles/familia/0.mp3",
  "./assets/audio/ingles/familia/1.mp3",
  "./assets/audio/ingles/familia/2.mp3",
  "./assets/audio/ingles/familia/3.mp3",
  "./assets/audio/ingles/familia/4.mp3",
  "./assets/audio/ingles/familia/5.mp3",
  "./assets/audio/ingles/familia/6.mp3",
  "./assets/audio/ingles/familia/7.mp3",
  "./assets/audio/ingles/numeros/0.mp3",
  "./assets/audio/ingles/numeros/1.mp3",
  "./assets/audio/ingles/numeros/2.mp3",
  "./assets/audio/ingles/numeros/3.mp3",
  "./assets/audio/ingles/numeros/4.mp3",
  "./assets/audio/ingles/numeros/5.mp3",
  "./assets/audio/ingles/numeros/6.mp3",
  "./assets/audio/ingles/numeros/7.mp3",
  "./assets/audio/ingles/numeros/8.mp3",
  "./assets/audio/ingles/numeros/9.mp3",
  "./assets/audio/ingles/saludos/0.mp3",
  "./assets/audio/ingles/saludos/1.mp3",
  "./assets/audio/ingles/saludos/2.mp3",
  "./assets/audio/ingles/saludos/3.mp3",
  "./assets/audio/ingles/saludos/4.mp3",
  "./assets/audio/ingles/saludos/5.mp3",
  "./assets/audio/ingles/saludos/6.mp3",
  "./assets/audio/ingles/saludos/7.mp3",
  "./assets/audio/ingles/saludos/8.mp3",
  "./assets/audio/ingles/saludos/9.mp3",
  "./assets/audio/lectura/frases/0.mp3",
  "./assets/audio/lectura/frases/1.mp3",
  "./assets/audio/lectura/frases/2.mp3",
  "./assets/audio/lectura/frases/3.mp3",
  "./assets/audio/lectura/frases/4.mp3",
  "./assets/audio/lectura/frases/5.mp3",
  "./assets/audio/lectura/letras/0.mp3",
  "./assets/audio/lectura/letras/1.mp3",
  "./assets/audio/lectura/letras/2.mp3",
  "./assets/audio/lectura/letras/3.mp3",
  "./assets/audio/lectura/letras/4.mp3",
  "./assets/audio/lectura/letras/5.mp3",
  "./assets/audio/lectura/letras/6.mp3",
  "./assets/audio/lectura/letras/7.mp3",
  "./assets/audio/lectura/letras/8.mp3",
  "./assets/audio/lectura/letras/9.mp3",
  "./assets/audio/lectura/letras/10.mp3",
  "./assets/audio/lectura/letras/11.mp3",
  "./assets/audio/lectura/letras/12.mp3",
  "./assets/audio/lectura/letras/13.mp3",
  "./assets/audio/lectura/letras/14.mp3",
  "./assets/audio/lectura/letras/15.mp3",
  "./assets/audio/lectura/letras/16.mp3",
  "./assets/audio/lectura/letras/17.mp3",
  "./assets/audio/lectura/letras/18.mp3",
  "./assets/audio/lectura/letras/19.mp3",
  "./assets/audio/lectura/letras/20.mp3",
  "./assets/audio/lectura/letras/21.mp3",
  "./assets/audio/lectura/letras/22.mp3",
  "./assets/audio/lectura/letras/23.mp3",
  "./assets/audio/lectura/letras/24.mp3",
  "./assets/audio/lectura/letras/25.mp3",
  "./assets/audio/lectura/letras/26.mp3",
  "./assets/audio/lectura/palabras/0.mp3",
  "./assets/audio/lectura/palabras/1.mp3",
  "./assets/audio/lectura/palabras/2.mp3",
  "./assets/audio/lectura/palabras/3.mp3",
  "./assets/audio/lectura/palabras/4.mp3",
  "./assets/audio/lectura/palabras/5.mp3",
  "./assets/audio/lectura/palabras/6.mp3",
  "./assets/audio/lectura/palabras/7.mp3",
  "./assets/audio/lectura/palabras/8.mp3",
  "./assets/audio/lectura/palabras/9.mp3",
  "./assets/audio/lectura/palabras/10.mp3",
  "./assets/audio/lectura/palabras/11.mp3",
  "./assets/audio/lectura/palabras/12.mp3",
  "./assets/audio/lectura/palabras/13.mp3",
  "./assets/audio/lectura/palabras/14.mp3",
  "./assets/audio/lectura/silabas1/0.mp3",
  "./assets/audio/lectura/silabas1/1.mp3",
  "./assets/audio/lectura/silabas1/2.mp3",
  "./assets/audio/lectura/silabas1/3.mp3",
  "./assets/audio/lectura/silabas1/4.mp3",
  "./assets/audio/lectura/silabas1/5.mp3",
  "./assets/audio/lectura/silabas1/6.mp3",
  "./assets/audio/lectura/silabas1/7.mp3",
  "./assets/audio/lectura/silabas1/8.mp3",
  "./assets/audio/lectura/silabas1/9.mp3",
  "./assets/audio/lectura/silabas2/0.mp3",
  "./assets/audio/lectura/silabas2/1.mp3",
  "./assets/audio/lectura/silabas2/2.mp3",
  "./assets/audio/lectura/silabas2/3.mp3",
  "./assets/audio/lectura/silabas2/4.mp3",
  "./assets/audio/lectura/silabas2/5.mp3",
  "./assets/audio/lectura/silabas2/6.mp3",
  "./assets/audio/lectura/silabas2/7.mp3",
  "./assets/audio/lectura/silabas2/8.mp3",
  "./assets/audio/lectura/silabas2/9.mp3",
  "./assets/audio/lectura/silabas3/0.mp3",
  "./assets/audio/lectura/silabas3/1.mp3",
  "./assets/audio/lectura/silabas3/2.mp3",
  "./assets/audio/lectura/silabas3/3.mp3",
  "./assets/audio/lectura/silabas3/4.mp3",
  "./assets/audio/lectura/silabas3/5.mp3",
  "./assets/audio/lectura/silabas3/6.mp3",
  "./assets/audio/lectura/silabas3/7.mp3",
  "./assets/audio/lectura/silabas4/0.mp3",
  "./assets/audio/lectura/silabas4/1.mp3",
  "./assets/audio/lectura/silabas4/2.mp3",
  "./assets/audio/lectura/silabas4/3.mp3",
  "./assets/audio/lectura/silabas4/4.mp3",
  "./assets/audio/lectura/silabas4/5.mp3",
  "./assets/audio/lectura/silabas4/6.mp3",
  "./assets/audio/lectura/silabas4/7.mp3",
  "./assets/audio/ui/en-1.mp3",
  "./assets/audio/ui/en-2.mp3",
  "./assets/audio/ui/en-3.mp3",
  "./assets/audio/ui/en-4.mp3",
  "./assets/audio/ui/en-5.mp3",
  "./assets/audio/ui/estrella.mp3",
  "./assets/audio/ui/feliz-1.mp3",
  "./assets/audio/ui/feliz-10.mp3",
  "./assets/audio/ui/feliz-2.mp3",
  "./assets/audio/ui/feliz-3.mp3",
  "./assets/audio/ui/feliz-4.mp3",
  "./assets/audio/ui/feliz-5.mp3",
  "./assets/audio/ui/feliz-6.mp3",
  "./assets/audio/ui/feliz-7.mp3",
  "./assets/audio/ui/feliz-8.mp3",
  "./assets/audio/ui/feliz-9.mp3",
  "./assets/audio/ui/hola.mp3",
  "./assets/audio/ui/jugamos-leer.mp3",
  "./assets/audio/ui/muy-bien.mp3",
  "./assets/audio/ui/nombre.mp3",
  "./assets/audio/ui/sonries.mp3",
  "./assets/audio/ui/terminaste.mp3",
  "./assets/audio/ui/tocame.mp3",
  "./assets/audio/ui/tu-puedes.mp3",
  "./assets/audio/ui/vamos-ingles.mp3"
];

var ASSETS = APP_FILES.concat(AUDIO_FILES);

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.addAll(ASSETS);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k !== CACHE) return caches.delete(k);
      }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

/* Safari (iPhone) pide los audios por partes ("Range"). Si el audio está
   guardado, respondemos solo el trozo pedido para que suene sin internet. */
function rangeResponse(cached, range) {
  return cached.arrayBuffer().then(function (buf) {
    var m = /bytes=(\d*)-(\d*)/.exec(range);
    var size = buf.byteLength;
    var start = m && m[1] ? parseInt(m[1], 10) : 0;
    var end = m && m[2] ? parseInt(m[2], 10) : size - 1;
    if (!m || start >= size || end < start) {
      return new Response(null, { status: 416, headers: { "Content-Range": "bytes */" + size } });
    }
    end = Math.min(end, size - 1);
    return new Response(buf.slice(start, end + 1), {
      status: 206,
      headers: {
        "Content-Type": cached.headers.get("Content-Type") || "audio/mpeg",
        "Content-Range": "bytes " + start + "-" + end + "/" + size,
        "Content-Length": String(end - start + 1),
        "Accept-Ranges": "bytes"
      }
    });
  });
}

self.addEventListener("fetch", function (event) {
  var req = event.request;
  if (req.method !== "GET") return;

  // Solo manejamos archivos de la propia app. Vikidia, Gemini y cualquier
  // otra API van directo a la red, sin pasar por la caché.
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  var range = req.headers.get("range");

  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then(function (cached) {
      if (cached && range) return rangeResponse(cached, range);
      if (cached) return cached;
      return fetch(req).then(function (response) {
        if (response && response.status === 200 && response.type === "basic") {
          var copy = response.clone();
          caches.open(CACHE).then(function (cache) {
            cache.put(req, copy).catch(function () {});
          });
        }
        return response;
      }).catch(function () {
        // Sin red ni caché: si era una página, mostramos la app igualmente.
        if (req.mode === "navigate") return caches.match("./index.html");
        return Response.error();
      });
    })
  );
});

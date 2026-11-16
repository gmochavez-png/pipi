/* =========================================================
   PIPI · Service Worker
   Guarda la app en el teléfono para que funcione sin conexión.
   ========================================================= */

var CACHE = "pipi-v5";

var ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/styles.css",
  "./js/lessons.js",
  "./js/app.js",
  "./js/pipi3d.js",
  "./js/vendor/three.min.js",
  "./assets/koala.jpg",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/icon-maskable-512.png",
  "./assets/icons/apple-touch-icon.png",
  "./assets/audio/ui/hola.mp3",
  "./assets/audio/ui/jugamos-leer.mp3",
  "./assets/audio/ui/vamos-ingles.mp3",
  "./assets/audio/ui/sonries.mp3",
  "./assets/audio/ui/estrella.mp3",
  "./assets/audio/ui/tu-puedes.mp3",
  "./assets/audio/ui/tocame.mp3",
  "./assets/audio/ui/muy-bien.mp3",
  "./assets/audio/ui/terminaste.mp3",
  "./assets/audio/ui/feliz-1.mp3",
  "./assets/audio/ui/feliz-2.mp3",
  "./assets/audio/ui/feliz-3.mp3",
  "./assets/audio/ui/feliz-4.mp3",
  "./assets/audio/ui/feliz-5.mp3",
  "./assets/audio/ui/feliz-6.mp3",
  "./assets/audio/ui/feliz-7.mp3",
  "./assets/audio/ui/feliz-8.mp3",
  "./assets/audio/ui/feliz-9.mp3",
  "./assets/audio/ui/feliz-10.mp3"
];

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

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then(function (cached) {
      if (cached) return cached;
      return fetch(event.request).then(function (response) {
        var copy = response.clone();
        caches.open(CACHE).then(function (cache) {
          cache.put(event.request, copy).catch(function () {});
        });
        return response;
      }).catch(function () {
        // Si no hay red ni caché, mostramos la app igualmente.
        return caches.match("./index.html");
      });
    })
  );
});

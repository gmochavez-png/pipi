# 🐨 PIPI · Aprende jugando

App para que una niña de 6 años aprenda a leer y sus primeras palabras en inglés,
acompañada por **PIPI**, un koala de peluche simpático que habla y la anima.

Funciona como **PWA**: se instala en el teléfono (Android o iPhone), tiene su
propio icono y, una vez cargada, funciona **sin conexión**.

---

## ✨ Qué incluye

### 📖 Aprender a leer (español)
- **Letras**: A–Z (incluida la Ñ) con nombre, dibujo y palabra de ejemplo.
- **Sílabas**: ma me mi mo mu, pa pe pi po pu, etc.
- **Palabras**: mamá, papá, sol, luna, gato, perro…
- **Frases**: frases cortas para leer en voz alta.

### 🌎 Inglés básico
- **Saludos**: Hello, Thank you, Goodbye…
- **Colores**: red, blue, green…
- **Números**: one–ten.
- **Animales**: cat, dog, koala…
- **La familia**: mom, dad, sister…
- **El cuerpo**: head, eyes, nose…

### ⭐ Recompensas
- Cada tarjeta que la niña marca con **"¡Lo logré!"** da una estrella.
- Las estrellas desbloquean **pegatinas** (a las 5, 15, 30, 50, 80 y 100 estrellas).
- El progreso se guarda en el propio teléfono.

### 🐨 PIPI en 3D
- PIPI es un koala **3D** (Three.js) con **expresiones**: parpadeo, sonrisa, habla, celebración, sorpresa, tristeza, pensativo y dormido.
- En **Aprender a leer** y en **Inglés**, PIPI **no dice la respuesta** hasta que pulses **🔊 Escuchar**.
- Al acertar dice **frases distintas**: "¡Excelente!", "¡Bravo!", "¡Qué bien lees!"…

### 🔊 Voz (audios incluidos)
- PIPI tiene **voces reales grabadas**: 131 audios en español e inglés, incluidos en la app.
- Así suena igual en cualquier teléfono, sin depender de las voces del sistema.
- Si algún audio no cargara, usa la **voz del dispositivo** como respaldo.
- Botón de sonido 🔊/🔇 para silenciar.

---

## 🌐 Enlace público

La app ya está publicada en **GitHub Pages**:

**https://gmochavez-png.github.io/pipi/**

Ábrelo en el teléfono y añádela a la pantalla de inicio. Así funciona en
cualquier lugar, sin depender de la computadora.

---

## 🚀 Cómo probarla

### Opción A · En la computadora (rápido)
1. Abre `index.html` con doble clic.
   - Funciona, pero **sin instalación ni modo sin conexión**.
2. Mejor aún: doble clic en **`iniciar-app.bat`**.
   - Abre la app en el navegador con un servidor local (permite instalar y usar sin conexión).

### Opción B · En el teléfono, por WiFi (para probar)
1. En la computadora, ejecuta **`iniciar-app.bat`** (o `python -m http.server 8000`).
2. Averigua la IP de la PC: abre una consola y escribe `ipconfig`.
   Busca **"Dirección IPv4"** (ejemplo: `192.168.1.50`).
3. En el teléfono, abre `http://192.168.1.50:8000`.
4. Instálala:
   - **Android (Chrome)**: menú ⋮ → "Instalar aplicación" o "Añadir a pantalla de inicio".
   - **iPhone (Safari)**: botón **Compartir** → "Añadir a pantalla de inicio".

> La computadora debe estar encendida y en la misma red WiFi que el teléfono.
> Si tu router bloquea la conexión entre dispositivos (algunos módems lo hacen),
> usa la Opción C (publicar en internet).

### Opción C · Publicarla gratis (recomendada para uso diario)
Así funciona en cualquier lugar, sin depender de la computadora:

- **Netlify Drop** → https://app.netlify.com/drop
  Arrastra la carpeta `pipi-app` completa y obtienes un enlace (`https://...`).
  Ábrelo en el teléfono e instálalo como en la Opción B.
- Alternativa: **GitHub Pages** o **Vercel** (planes gratuitos).

> Tras la primera carga, la app queda guardada y funciona sin internet.

---

## 🛠️ Cómo cambiar el contenido

Todo el contenido está en **`js/lessons.js`**. Cada lección es una tarjeta.
Para añadir o cambiar algo, edita los `items`:

```js
{ big: "A a", say: "a", word: "Abeja", emoji: "🐝" }
```

| Campo    | Significado                                   |
|----------|-----------------------------------------------|
| `big`    | Lo que se muestra en grande                   |
| `say`    | Lo que dice la voz                            |
| `word`   | (letras) palabra de ejemplo                   |
| `emoji`  | Dibujo que acompaña                           |

En inglés cada tarjeta usa:

```js
{ en: "cat", es: "gato", emoji: "🐱" }
```

Puedes duplicar un bloque, cambiar textos y guardar. No hace falta tocar nada más.

---

## 📁 Estructura de archivos

```
pipi-app/
├─ index.html          → estructura de la app
├─ css/styles.css      → diseño infantil
├─ js/lessons.js       → contenido educativo (editable)
├─ js/app.js           → lógica: navegación, voz, estrellas
├─ js/pipi3d.js        → koala 3D (Three.js) y expresiones
├─ js/vendor/three.min.js → librería 3D (local, sin conexión)
├─ manifest.json       → datos para instalar la app
├─ sw.js               → modo sin conexión
├─ server.js           → servidor local opcional (Node.js)
├─ iniciar-app.bat     → abre la app en la PC con un doble clic
└─ assets/
   ├─ koala.jpg        → logo (recorte de la foto de PIPI)
   ├─ koala-source.jpg → foto original que enviaste
   ├─ icons/           → iconos de la app (192, 512, etc.)
   └─ audio/           → 131 audios MP3 (español e inglés)
```

---

## 📝 Notas importantes

- **Voz**: los audios vienen incluidos en `assets/audio/` (generados con Edge TTS,
  de Microsoft) y se usan solo para uso personal. Si algún audio faltara, la app
  recurre a la voz del dispositivo como respaldo.
- **Sin conexión**: después de la primera visita, el *service worker* guarda la app.
  Para ver cambios en el contenido, recarga la página (o vuelve a instalar).
- **Privacidad**: la app **no envía datos a ningún servidor**. Las estrellas se
  guardan solo en el propio teléfono (`localStorage`).
- **Derechos**: los dibujos son *emojis* del propio dispositivo. La foto del koala
  es la que tú aportaste. Los audios se generaron con un servicio TTS gratuito
  para uso personal; no se usa música ni voces con licencia.
- **Accesibilidad**: botones grandes, alto contraste, textos legibles y respeto a
  la opción "reducir movimiento" del teléfono.
- **Uso**: pensada para uso personal/familiar.

---

## 🔜 Ideas para crecer

- Practicar pronunciación con micrófono (reconocimiento de voz).
- Cuentos cortos leídos por PIPI.
- Ajustes de velocidad de la voz y modo solo lectura.
- Más idiomas o más lecciones.

---

Hecho con cariño para que leer sea un juego. 🐨💙

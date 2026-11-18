# 🐨 PIPI · Aprende jugando

App para que una niña de 6 años aprenda a leer y sus primeras palabras en inglés,
acompañada por **PIPI**, un koala de peluche simpático que habla y la anima.

Funciona como **PWA**: se instala en el teléfono (Android o iPhone), tiene su
propio icono y, una vez cargada, funciona **sin conexión**.

---

## ✨ Qué incluye

### 📖 Aprender a leer (español)
- **Letras**: A–Z (incluida la Ñ) con nombre, dibujo y palabra de ejemplo.
- **Sílabas**: 4 niveles (2, 3, 4 y 5 sílabas) para **arrastrar sílabas** y formar palabras. La palabra **no se muestra**: se oye con 🔊 Escuchar. Incluye **sonidos**, **marcador (✅ aciertos / ❌ errores)** y una **fiesta 🎉 con copa 🏆** al completar cada nivel.
- **Palabras**: mamá, papá, sol, luna, gato, perro…
- **Frases**: frases cortas para leer en voz alta.

### 🌎 Inglés básico
- **Saludos**: Hello, Thank you, Goodbye…
- **Colores**: red, blue, green…
- **Números**: one–ten.
- **Animales**: cat, dog, koala…
- **La familia**: mom, dad, sister…
- **El cuerpo**: head, eyes, nose…

### 🧩 Juegos
- Sección **Juegos** con su propio menú (se agregan más juegos en `js/games.js`).
- **Sopa de letras**: cuadrícula de 6×6 con letras grandes y 4 palabras cortas
  de "Las palabras" (sol, luna, gato, perro…). Las palabras van solo de
  izquierda a derecha ➡️ o de arriba hacia abajo ⬇️.
  - Se juega **arrastrando el dedo** o **tocando la primera y la última letra**.
  - Cada palabra de la lista tiene su emoji y se puede **oír** tocándola.
  - Al encontrarla se pinta de color y PIPI la festeja; al terminar todas hay
    **fiesta 🎉** y se gana **una estrella ⭐**. Cada partida es diferente.

### ⭐ Recompensas
- Cada tarjeta que la niña marca con **"¡Lo logré!"**, cada cuento leído y cada sopa de letras terminada dan una estrella.
- Las estrellas desbloquean **pegatinas** (a las 5, 15, 30, 50, 80 y 100 estrellas).
- Cada logro se celebra con **corazones, flores, confeti y un cartel de "¡Lo lograste!"**.
- Al completar un nivel de sílabas, PIPI hace una **fiesta** con música, colores, confeti y la **calificación**.
- El progreso se guarda en el propio teléfono.

### 📚 Cuentos
- **5 cuentos cortos** de ~15 líneas, con hoja **colorida** y botón **🔊 Escuchar** (voz de Liz).
- Botón **⭐ ¡Lo leí!** para guardar el cuento leído y ganar una estrella.

### 🐨 PIPI en 3D
- PIPI es un koala **3D** (Three.js) con **expresiones**: parpadeo, sonrisa, habla, celebración, sorpresa, tristeza, pensativo y dormido.
- En **Aprender a leer** y en **Inglés**, PIPI **no dice la respuesta** hasta que pulses **🔊 Escuchar**.
- Al acertar dice **frases distintas**, en **español e inglés**: "¡Excelente!", "¡Bravo!", "Great job!", "Well done!"…

### 👧 Nombre y ajustes
- Al abrir la app se escribe el **nombre** de la niña; PIPI lo usa para saludar y felicitar.
- El botón **⚙️ Ajustes** permite cambiar el nombre, la **frecuencia de expresiones** (pocas / normal / muchas) y el **color del pelaje** de PIPI (gris, marrón, blanco, rosa, azul, verde, naranja y morado).

### 💬 Chat con PIPI
- PIPI conversa con **respuestas escolares curadas** y busca en **Vikidia** (enciclopedia escrita para niños). No usa Wikipedia.
- Juegos: chistes, adivinanzas, sumas, cuentos y "veo veo".
- **Funciona sin clave** con el cerebro seguro (respuestas curadas + Vikidia + juegos).
- 🎤 **Micrófono:** toca 🎤 y habla; el navegador convierte tu voz en texto y PIPI responde. Solo escucha cuando tocas el botón.
- **IA en la nube opcional:** en el chat toca **🔒**. La primera vez se te pide **crear un PIN de padres** (4 a 8 números); después se pide ese PIN para entrar. Ahí puedes pegar una **API key gratis de Google Gemini** (aistudio.google.com/app/apikey). La clave y el PIN se guardan solo en ese teléfono.
- Incluye filtros de seguridad y modo padres.

### 🔊 Voz (ElevenLabs)
- Los 170 audios se generaron con **ElevenLabs** (modelo `eleven_v4`) para uso personal:
  - Español: voz **Liz** (dulce y cálida).
  - Inglés: voz **Jessica** (juguetona y brillante).
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
1. En la computadora, ejecuta **`iniciar-app.bat`** (o `node server.cjs`, o `python -m http.server 8000`).
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
├─ js/stories.js       → cuentos cortos
├─ js/app.js           → lógica: navegación, voz, estrellas
├─ js/chat.js          → chat seguro, Vikidia y juegos del chat
├─ js/games.js         → menú de Juegos (aquí se agregan juegos nuevos)
├─ js/wordsearch.js    → juego de sopa de letras
├─ js/pipi3d.js        → koala 3D (Three.js) y expresiones
├─ js/vendor/three.min.js → librería 3D (local, sin conexión)
├─ tools/              → scripts para regenerar los audios con ElevenLabs
├─ package.json        → dependencias del generador de voz
├─ .env.local          → clave de ElevenLabs (privada, no se publica)
├─ manifest.json       → datos para instalar la app
├─ sw.js               → modo sin conexión
├─ server.cjs          → servidor local opcional (Node.js)
├─ iniciar-app.bat     → abre la app en la PC con un doble clic
└─ assets/
   ├─ koala.jpg        → logo (recorte de la foto de PIPI)
   ├─ koala-source.jpg → foto original que enviaste
   ├─ icons/           → iconos de la app (192, 512, etc.)
   └─ audio/           → 170 audios MP3 (español, inglés, cuentos y nombre.mp3)
```

---

## 📝 Notas importantes

- **Voz**: los audios vienen incluidos en `assets/audio/` (generados con ElevenLabs)
  y son para uso personal. Si algún audio faltara, la app recurre a la voz del
  dispositivo como respaldo.
- **Nombre de la niña**: el audio de su nombre está en `assets/audio/ui/nombre.mp3`.
  El nombre no se escribe en el código: para regenerarlo agrega `PIPI_NAME=...`
  a `.env.local`, ejecuta `npm run voices:name` y copia la huella que imprime en
  `NAME_AUDIO` (`js/app.js`).
- **Sin conexión**: en la primera visita, el *service worker* (`sw.js`) guarda la
  app, todos los JS y los 170 audios. No guarda respuestas de Vikidia ni de otras
  APIs. Al publicar cambios, sube el número de `CACHE` en `sw.js` (por ejemplo
  `pipi-v18` → `pipi-v19`) para que los teléfonos reciban la versión nueva.
- **Privacidad**: las estrellas, el nombre y el PIN de padres se guardan solo en
  el propio teléfono (`localStorage`). La app solo se conecta a internet cuando
  en el chat se pregunta algo que PIPI no sabe (Vikidia) o si los padres activan
  la IA de Gemini.
- **Derechos**: los dibujos son *emojis* del propio dispositivo. La foto del koala
  es la que tú aportaste. Los audios se generaron con ElevenLabs para uso
  personal; no se usa música con licencia.
- **Accesibilidad**: botones grandes, alto contraste, textos legibles y respeto a
  la opción "reducir movimiento" del teléfono.
- **Uso**: pensada para uso personal/familiar.

---

## 🔜 Ideas para crecer

- Practicar la pronunciación de las palabras con el micrófono (hoy el micrófono solo se usa en el chat).
- Más juegos en la sección Juegos (memoria, une la palabra con el dibujo…).
- Ajustes de velocidad de la voz y modo solo lectura.
- Más idiomas, más lecciones y más cuentos.

---

Hecho con cariño para que leer sea un juego. 🐨💙

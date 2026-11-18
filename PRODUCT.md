# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

PWA (HTML/CSS/JS sin framework) publicada en GitHub Pages e instalada en la pantalla de inicio. Se usa por igual en iPhone y en iPad/tableta, y a veces en la computadora.

## Users

- **Usuaria principal:** una niña de 6 años que está aprendiendo a leer en español y sus primeras palabras en inglés. A veces usa la app sola y a veces con un adulto al lado.
- **Adulto (madre o padre):** acompaña algunas sesiones, cambia ajustes (nombre, color de PIPI) y entra al modo padres del chat con un PIN.

## Product Purpose

Que leer sea un juego: letras, sílabas, palabras, frases, inglés básico, cuentos y juegos (sopa de letras), con un compañero que habla y celebra cada logro. El éxito es que la niña quiera volver y avance de nivel por sí misma.

## Positioning

El compañero es **PIPI**, el peluche real de la niña (koala-unicornio gris con cuerno rosa y corazón de brillantina), recreado en 3D. No es una mascota genérica: es su juguete.

## Operating Context

- Sesiones cortas en casa, en teléfono vertical o tableta.
- Cuando usa la app sola, apenas sabe leer: los botones deben entenderse con dibujos, color y voz.
- Puede usarse sin internet después de la primera carga.

## Capabilities and Constraints

- Secciones: Aprender a leer (letras, sílabas en 4 niveles con arrastre, palabras, frases), Inglés (6 categorías), Cuentos (5), Juegos (sopa de letras; el menú admite más juegos), Hablar con PIPI (chat con respuestas curadas, Vikidia y juegos; modo padres con PIN y Gemini opcional), Mis estrellas (pegatinas) y Ajustes.
- 170 audios grabados (ElevenLabs); voz del dispositivo como respaldo.
- Estrellas, nombre, PIN y progreso se guardan solo en el teléfono (localStorage).
- Repositorio público: no se publica el nombre de la niña ni datos personales.
- Service worker con caché versionada (`pipi-vNN`); cada publicación sube la versión.

## Brand Commitments

- **PIPI 3D es el protagonista de la portada** (confirmado por el usuario).
- PIPI habla, parpadea, celebra y su corazón brilla al tocarlo y en cada logro.
- Textos en español, cálidos y cortos, dirigidos a la niña por su nombre.

## Evidence on Hand

- Contenido educativo real en `js/lessons.js` y `js/stories.js`.
- Audios en `assets/audio/`.
- Modelo 3D en `js/pipi3d.js`, hecho a partir de la foto del peluche (la foto no está en el repositorio).

## Product Principles

1. Se entiende sin leer: dibujo, color y voz primero; texto como apoyo.
2. Cada logro se celebra; los errores nunca castigan.
3. Botones grandes y fáciles de tocar para dedos de 6 años.
4. PIPI es su amigo de verdad: presente, expresivo y con su aspecto real.
5. Privado y sin internet obligatorio.

## Accessibility & Inclusion

- Lectora principiante: no depender solo de texto.
- Objetivos táctiles grandes; respetar "reducir movimiento".

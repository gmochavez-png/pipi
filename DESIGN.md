---
name: PIPI
description: App de lectura para una niña de 6 años con el lenguaje visual de una app de Apple para niños.
colors:
  bg: "#f2f2f7"
  surface: "#ffffff"
  surface-2: "#f7f7fa"
  fill: "#e9e9ee"
  fill-strong: "#dcdce2"
  separator: "rgba(60, 60, 67, 0.16)"
  ink: "#1c1c1e"
  ink-2: "#5a5a60"
  ink-3: "#6e6e73"
  blue: "#007aff"
  blue-ink: "#0064d1"
  orange: "#dd6200"
  orange-ink: "#b85500"
  teal: "#1fa3b8"
  teal-ink: "#0f7d8f"
  pink: "#e8306e"
  pink-ink: "#c21a55"
  indigo: "#5b45e0"
  green: "#28a745"
  green-ink: "#1d7f35"
  yellow: "#ffcc00"
  yellow-ink: "#6b4f00"
  red: "#d1292c"
typography:
  display:
    fontFamily: "ui-rounded, \"SF Pro Rounded\", \"PIPI Rounded\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", system-ui, sans-serif"
    fontSize: "clamp(2.6rem, 11vw, 4.2rem)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "ui-rounded, \"SF Pro Rounded\", \"PIPI Rounded\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", system-ui, sans-serif"
    fontSize: "34px"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "ui-rounded, \"SF Pro Rounded\", \"PIPI Rounded\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  body:
    fontFamily: "ui-rounded, \"SF Pro Rounded\", \"PIPI Rounded\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 600
    lineHeight: 1.3
  reading:
    fontFamily: "ui-rounded, \"SF Pro Rounded\", \"PIPI Rounded\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", system-ui, sans-serif"
    fontSize: "21px"
    fontWeight: 600
    lineHeight: 1.6
  label:
    fontFamily: "ui-rounded, \"SF Pro Rounded\", \"PIPI Rounded\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 700
    lineHeight: 1.3
rounded:
  sm: "12px"
  md: "18px"
  lg: "24px"
  xl: "30px"
  squircle: "22.5%"
  capsule: "999px"
spacing:
  grid-gap: "12px"
  card-pad: "16px"
  gutter: "20px"
  gutter-tablet: "28px"
components:
  button-filled:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.surface}"
    typography: "{typography.body}"
    rounded: "{rounded.capsule}"
    padding: "12px 22px"
    height: "50px"
  button-filled-large:
    backgroundColor: "{colors.orange}"
    textColor: "{colors.surface}"
    rounded: "{rounded.capsule}"
    padding: "14px 26px"
    height: "60px"
  button-tinted:
    backgroundColor: "color-mix(in srgb, #007aff 14%, transparent)"
    textColor: "{colors.blue-ink}"
    rounded: "{rounded.capsule}"
    padding: "12px 22px"
    height: "50px"
  circle-button:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.capsule}"
    size: "56px"
  star-capsule:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.yellow-ink}"
    rounded: "{rounded.capsule}"
    padding: "8px 16px 8px 12px"
    height: "48px"
  app-icon:
    textColor: "{colors.surface}"
    rounded: "{rounded.squircle}"
    size: "96px"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "{spacing.card-pad}"
  group:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
  group-row:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    padding: "8px 16px"
    height: "54px"
  field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "16px"
    padding: "14px 18px"
    height: "54px"
  segmented:
    backgroundColor: "{colors.fill}"
    textColor: "{colors.ink-2}"
    rounded: "13px"
    padding: "3px"
  segmented-active:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "10px"
    height: "42px"
  bubble-pipi:
    backgroundColor: "{colors.fill}"
    textColor: "{colors.ink}"
    rounded: "21px"
    padding: "10px 15px"
  bubble-user:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.surface}"
    rounded: "21px"
    padding: "10px 15px"
  chat-chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.blue-ink}"
    rounded: "{rounded.capsule}"
    padding: "8px 16px"
    height: "40px"
---

# Design System: PIPI

## Overview

**Creative North Star: "Una app de Apple para niños"**

PIPI vive en la pantalla de inicio de un iPhone o iPad y debe leerse como una app de primera parte de Apple hecha para una niña: fondo de sistema gris claro, tarjetas blancas agrupadas, tipografía SF Rounded, íconos de trazo al estilo SF Symbols, botones cápsula, control segmentado, interruptor, barras de navegación translúcidas y burbujas de iMessage. El mundo es el de iOS en modo claro; lo infantil está en la escala (todo es grande y fácil de tocar), en el color de los íconos de "app" y en PIPI 3D, que es el protagonista de la portada.

La densidad es baja: una columna de 560px como máximo en teléfono (720px en tableta), gutter de 20px, tarjetas con mucho aire y objetivos táctiles de 48px o más. Cada actividad se reconoce por su ícono de color (squircle con degradado y glifo blanco), no por el texto. La profundidad es suave y difusa, como en iOS; el mundo rechaza explícitamente el aspecto de "tienda de juguetes" del diseño anterior: botones gruesos con sombra dura inferior y teclas grises cuadradas.

El movimiento es de resorte y breve: los elementos tocables se encogen al presionarse (escala 0.88 a 0.97) y regresan con la curva `--spring`; las pantallas entran con un desliz de 8px. Todo se apaga con "reducir movimiento".

**Key Characteristics:**
- Fondo de sistema #F2F2F7 con tarjetas blancas agrupadas y sombras suaves en dos capas.
- Una sola familia tipográfica redondeada, en pesos 600 a 900.
- Íconos de app en squircle (radio 22.5%) con degradado a 160° y glifo SVG blanco.
- Botones cápsula; controles nativos de iOS (segmentado, interruptor, hoja inferior, lista agrupada).
- Firma: el marcador de la sopa de letras, una cápsula que se desliza bajo las letras.

## Colors

Neutros de sistema iOS en modo claro, más una familia de tintes de sistema oscurecidos lo justo para que el texto blanco sea legible.

### Primary
- **Azul Sistema** (`blue`): la acción interactiva por defecto: burbuja de la niña en el chat, botón de enviar, anillo de foco, cursor, marcador en vivo de la sopa de letras, muestra de color activa.
- **Azul Tinta** (`blue-ink`): el azul como texto: botón "atrás", filas de acción en Ajustes, chips del chat, íconos de escuchar.

### Secondary
- **Naranja Leer** (`orange` / `orange-ink`): la sección Aprender a leer; botón grande principal de las actividades; letra grande de la tarjeta de letras.
- **Turquesa Inglés** (`teal` / `teal-ink`): la sección Inglés y su palabra grande.
- **Rosa Cuentos** (`pink` / `pink-ink`): la sección Cuentos; texto del botón blanco de la fiesta.
- **Índigo Chat** (`indigo`): ícono de Hablar con PIPI y las sílabas de la tarjeta.

### Tertiary
- **Amarillo Estrella** (`yellow` / `yellow-ink`): estrellas y recompensas; el texto sobre amarillo siempre es `yellow-ink`, nunca blanco.
- **Verde Logro** (`green` / `green-ink`): aciertos, palabra encontrada, cuento terminado.
- **Rojo Aviso** (`red`): insignia "Nuevo", micrófono escuchando, error, acciones destructivas.

### Neutral
- **Gris Sistema** (`bg`): fondo de todas las pantallas y de las hojas inferiores; también la barra de navegación al 82% con desenfoque.
- **Blanco Tarjeta** (`surface`): tarjetas, grupos, campos, filas.
- **Blanco Hueco** (`surface-2`): fondo de las casillas vacías de sílabas.
- **Relleno** (`fill`) y **Relleno Fuerte** (`fill-strong`): burbujas de PIPI, control segmentado, botones circulares secundarios, interruptor apagado, asa de la hoja.
- **Separador** (`separator`): líneas de lista con sangría de 16px y bordes interiores de campos y chips.
- **Tinta** (`ink`), **Tinta 2** (`ink-2`), **Tinta 3** (`ink-3`): texto principal, secundario (subtítulos, contadores, encabezados de grupo) y terciario (placeholder, chevrones, pistas).

### Named Rules
**The Tinte Legible Rule.** Los tintes de sistema se usan en sus versiones oscurecidas (`orange` #dd6200, `teal` #1fa3b8, `pink` #e8306e) cuando llevan texto blanco, y en su variante `-ink` cuando son el texto. El contrato pedía los tonos puros de Apple (#FF9500, #30B0C7, #FF2D55); el build los oscureció por legibilidad, y esa es la regla.

**The Una Sección, Un Color Rule.** Cada sección tiene su tinte (Leer naranja, Inglés turquesa, Cuentos rosa, Juegos azul, Chat índigo) y lo repite en su ícono, su menú y su tarjeta. No se mezclan tintes de secciones distintas en una misma pantalla de actividad.

## Typography

**Display Font:** ui-rounded / SF Pro Rounded en Apple; "PIPI Rounded" (Nunito autoalojada en `assets/fonts/nunito-latin.woff2`, pesos 500-900) en Windows y Android; después -apple-system, Segoe UI, system-ui
**Body Font:** la misma familia
**Label/Mono Font:** la misma familia, con cifras tabulares (`font-variant-numeric: tabular-nums`) en contadores y estrellas

**Character:** una sola voz redondeada y gruesa, amable para una lectora principiante. Los pesos van de 600 (texto) a 800-900 (títulos, letras, cifras); no hay pesos ligeros.

Fuera de Apple se usa Nunito (licencia SIL Open Font License 1.1), guardada en el proyecto y en la caché del modo sin internet, para que la voz redondeada se mantenga en Windows y Android. Solo se incluye el subconjunto latino, que cubre todo el español (á, é, ñ, ¿, ¡).

### Hierarchy
- **Display** (800, clamp(2.6rem, 11vw, 4.2rem), 1.05): la letra, sílaba o palabra grande de la tarjeta de actividad. Las cifras de recompensa llegan a 56px/900 y el título de la fiesta a 36px/900.
- **Headline** (800, 34px, 1.1, -0.02em): títulos grandes de pantalla al estilo iOS y bienvenida; el saludo de inicio usa 30px.
- **Title** (800, 18px, 1.15, -0.01em): etiquetas de íconos de app, títulos de tarjetas de menú, cuentos y filas; 20px en tarjetas de juego, 21px en tableta.
- **Body** (600, 17px, 1.3): botones, filas, burbujas, campos. La base del documento es 17px.
- **Reading** (600, 21px, 1.6, máx. 34em): el texto de los cuentos; 23px en tableta.
- **Label** (700, 15px): encabezados de grupo, píldora de progreso, chips; las pistas bajan a 14px/600 en `ink-3`.

### Named Rules
**The Sin Mayúsculas Forzadas Rule.** Ningún texto usa `text-transform: uppercase` ni espaciado ancho; las palabras de la sopa de letras están en mayúsculas porque así son el contenido del juego, no por estilo.

## Layout

Una columna centrada: `.screen` tiene máximo 560px en teléfono y 720px a partir de 700px de ancho, con gutter de 20px (28px en tableta) y respeto a las zonas seguras de iOS. La barra de navegación es pegajosa, de 56px de alto mínimo, con rejilla de tres columnas (atrás, título centrado, acción) y sangra hasta el borde anulando el gutter.

El ritmo base es de 12px entre tarjetas de una rejilla (16px en tableta) y 16px de relleno interior de tarjeta. La portada pone la barra superior (sonido, ajustes, cápsula de estrellas), el widget de PIPI, una rejilla 2x2 de íconos de app (4 columnas en tableta) y una fila completa para el chat. Los menús usan rejilla de 2 columnas (3 en tableta); los juegos, una sola columna; las pegatinas, 3 columnas (6 en tableta). En pantallas de menos de 700px de alto se compactan PIPI, los íconos (76px) y los rellenos.

Los objetivos táctiles miden 48px o más (botones 50-60px, botones circulares 56px, filas 54px, celdas de la sopa al ancho completo de la rejilla).

## Elevation & Depth

Sistema híbrido al modo iOS: la jerarquía se construye por capas tonales (gris de sistema, blanco, relleno) y se refuerza con sombras suaves, difusas y de dos capas. Las superficies flotantes usan material translúcido con desenfoque (barra de navegación, celebración, aviso, calificación de la fiesta).

### Shadow Vocabulary
- **Tarjeta** (`box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(28,28,50,0.07)`): tarjetas, grupos, botones circulares, cápsula de estrellas, fila del chat.
- **Flotante** (`box-shadow: 0 2px 6px rgba(0,0,0,0.06), 0 18px 40px rgba(28,28,50,0.14)`): la tarjeta de actividad, la rejilla de la sopa, la celebración y la sílaba arrastrada.
- **Tecla** (`box-shadow: 0 1px 1px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.06)`): fichas de sílabas que se pueden arrastrar, como teclas del teclado de iOS.
- **Brillo de tinte**: los botones rellenos y los íconos de app proyectan una sombra difusa de su propio color (28-32% de opacidad), más un filo de luz interior de 1px en los íconos.

### Named Rules
**The Sombra Blanda Rule.** Toda sombra es difusa y con desenfoque; ninguna es un bloque sólido desplazado. La sombra dura inferior es exactamente el aspecto anterior que este mundo reemplazó.

**The Vidrio Arriba Rule.** Lo que flota sobre el contenido (barra, aviso, celebración) es translúcido con `saturate(180%) blur(20px)` o similar; las tarjetas del contenido son opacas.

## Shapes

Esquinas continuas y generosas en todo: 12px en elementos pequeños, 16px en campos y fichas, 18px en grupos y pegatinas, 24px en tarjetas de menú y de juego, 30px en la tarjeta de actividad, el widget de PIPI, la página del cuento y la rejilla de la sopa. Los íconos de app son squircles con radio de 22.5% de su lado. Todo lo que es acción o etiqueta corta es cápsula (999px); los botones de solo ícono son círculos. Las burbujas tienen 21-22px con la esquina del lado del hablante a 8px y una colita girada a 45°. No hay bordes visibles: los contornos se hacen con un anillo interior de 1px en `separator`, salvo la casilla vacía de sílabas, que usa un borde punteado.

## Components

### Buttons
Cápsulas táctiles que se hunden al tocarse.
- **Shape:** cápsula completa (999px).
- **Primary (relleno):** tinte de la sección con texto blanco, 50px de alto, relleno 12px 22px, 17px/700; grande 60px y 20px; pequeño 38px. Sombra difusa de su propio tinte. Amarillo lleva texto `yellow-ink`.
- **Tinted:** fondo del tinte al 14% con texto en su variante `-ink`.
- **Press / Focus:** al presionar, escala 0.96 y brillo 0.92 con la curva `--ease`; foco visible con contorno azul de 3px al 55% separado 2px.
- **Circular:** 56px, blanco al 90% con sombra de tarjeta (barra superior) o en `fill` sin sombra (secundario); se encoge a 0.9.

### Chips
- **Style:** cápsula blanca de 40px con anillo interior `separator` y texto `blue-ink` 15px/700 (respuestas rápidas del chat), en una fila con desplazamiento horizontal.
- **State:** al tocar, escala 0.95 y fondo azul pálido.

### Cards / Containers
- **Corner Style:** 24px (menú, juegos, fila del chat), 30px (actividad, widget de PIPI, cuento).
- **Background:** blanco sobre gris de sistema; los cuentos llevan un degradado del color del cuento que se funde a blanco en 200px.
- **Shadow Strategy:** Tarjeta en reposo; Flotante para la tarjeta de actividad.
- **Border:** ninguno. Las bloqueadas bajan a 55% de opacidad con candado en círculo `fill`; "Próximamente" es transparente con anillo de 2px `fill-strong`.
- **Internal Padding:** 16px (menú), 18px (juegos), 34px 24px 26px (actividad).

### Inputs / Fields
- **Style:** blanco, 54px, radio 16px, 19px/600, anillo interior de 1px `separator`.
- **Focus:** el anillo pasa a 2px azul. El campo del chat es una cápsula de 56px con botón de enviar azul circular dentro.

### Navigation
- **Barra:** translúcida sobre `bg` al 82% con desenfoque; "atrás" con chevron SVG y texto 18px/600 `blue-ink`, título centrado 17px/700, acción a la derecha. Al tocar, opacidad 0.45.
- **Listas agrupadas (Ajustes):** encabezado 15px/700 `ink-2`, grupo blanco de 18px, filas de 54px con separador sangrado, filas de acción en `blue-ink`, destructivas en `red`; pie de grupo 14px.
- **Control segmentado:** pista `fill` de 13px con segmento activo blanco de 10px y sombra corta.
- **Interruptor:** 52x32 con perilla blanca de 28px que se desliza con `--spring`.
- **Hoja inferior:** fondo `bg`, esquinas superiores de 26px, asa de 40x5, sube desde abajo.

### Íconos de app (firma de la portada)
Squircle de 96px (112px en tableta, 76px en pantallas bajas) con degradado a 160° del tono claro al profundo de la sección, glifo SVG blanco de 50px, filo de luz interior y brillo de su color. Debajo, la etiqueta en Title. Insignia "Nuevo" en cápsula roja con anillo blanco. Las tarjetas de menú (62px), de juego (72px) y la fila del chat (44px) repiten el mismo squircle.

### Íconos SVG
Conjunto propio en `js/icons.js` al estilo SF Symbols: trazo `currentColor` de 2.2 (2.6-2.8 en flechas y palomita), puntas y uniones redondeadas, caja de 24. Heredan el color del texto.

### Burbujas (iMessage)
PIPI habla en gris `fill` a la izquierda; la niña en azul con texto blanco a la derecha; radio 21px, esquina del hablante a 8px, colita girada. El globo de PIPI en portada y en la sopa usa el mismo lenguaje.

### Marcador de la sopa de letras (firma)
Una cápsula detrás de las letras que sigue el dedo: en vivo es azul al 20% con anillo de 2px; al encontrar la palabra se queda pintada con el color de esa palabra y aparece con un pequeño salto; si se equivoca, se tiñe de rojo pálido. La palabra encontrada se tacha y su tarjeta toma el mismo color pálido. Las letras son círculos de 800 sobre una rejilla blanca de 30px con sombra Flotante.

## Do's and Don'ts

### Do:
- **Do** poner el contenido en tarjetas blancas sobre el gris de sistema `bg` (#f2f2f7), con la sombra Tarjeta.
- **Do** dar a cada actividad un ícono squircle (22.5%) con el degradado de su sección y un glifo SVG blanco.
- **Do** hacer cápsula todo botón con texto y círculo todo botón de solo ícono, con al menos 48px de alto.
- **Do** usar los tintes oscurecidos con texto blanco y las variantes `-ink` cuando el tinte es texto.
- **Do** usar controles de iOS (lista agrupada, segmentado, interruptor, hoja inferior) para lo que configura el adulto.
- **Do** responder al toque con escala y la curva `--spring`, y apagar todo movimiento con "reducir movimiento".
- **Do** mantener los emoji como dibujos del contenido (la palabra, el cuento, la pegatina) y los SVG de trazo para los controles.

### Don't:
- **Don't** usar sombras duras desplazadas ni botones gruesos con borde inferior: es el aspecto anterior que este mundo reemplazó.
- **Don't** usar teclas grises cuadradas para letras o sílabas; las fichas son blancas, de 16px, con la sombra Tecla.
- **Don't** usar emoji ni caracteres como íconos de controles (atrás, sonido, ajustes, enviar).
- **Don't** poner texto blanco sobre amarillo.
- **Don't** añadir etiquetas pequeñas en mayúsculas sobre los títulos; los encabezados de grupo de Ajustes son de iOS, en tipo de oración.

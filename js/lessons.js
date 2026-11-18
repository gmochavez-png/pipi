/* =========================================================
   PIPI · Contenido educativo
   Todo el contenido es editable. Para añadir o cambiar
   lecciones, modifica los arrays "items".
   ========================================================= */

window.PIPI_LESSONS = {

  /* ---------------- LECTURA (español) ----------------
     Organizada por temas (group) y niveles (level).
     "audio": ruta del audio grabado; null = se usa la voz del teléfono. */
  lectura: {
    title: "Aprender a leer",
    subtitle: "Elige un tema y un nivel",
    groups: {
      letras:   { title: "Las letras",   color: "orange", glyph: "Aa",  note: "Conoce cada letra" },
      silabas:  { title: "Las sílabas",  color: "indigo", glyph: "ma",  note: "Forma palabras" },
      palabras: { title: "Las palabras", color: "green",  glyph: "sol", note: "Cada vez más largas" },
      frases:   { title: "Las frases",   color: "pink",   glyph: "Mi",  note: "Lee frases completas" }
    },
    categories: {

      /* ----- Las letras (4 niveles) ----- */
      letras1: {
        group: "letras", level: 1, title: "Las vocales", preview: "A E I O U",
        emoji: "🔤", kind: "letter",
        items: [
          { big: "A a", say: "a", word: "Abeja", emoji: "🐝", audio: "lectura/letras/0.mp3" },
          { big: "E e", say: "e", word: "Elefante", emoji: "🐘", audio: "lectura/letras/4.mp3" },
          { big: "I i", say: "i", word: "Iguana", emoji: "🦎", audio: "lectura/letras/8.mp3" },
          { big: "O o", say: "o", word: "Oso", emoji: "🐻", audio: "lectura/letras/15.mp3" },
          { big: "U u", say: "u", word: "Uva", emoji: "🍇", audio: "lectura/letras/21.mp3" }
        ]
      },
      letras2: {
        group: "letras", level: 2, title: "Letras fáciles", preview: "M P S L T N D",
        emoji: "🔤", kind: "letter",
        items: [
          { big: "M m", say: "eme", word: "Manzana", emoji: "🍎", audio: "lectura/letras/12.mp3" },
          { big: "P p", say: "pe", word: "Perro", emoji: "🐶", audio: "lectura/letras/16.mp3" },
          { big: "S s", say: "ese", word: "Sol", emoji: "☀️", audio: "lectura/letras/19.mp3" },
          { big: "L l", say: "ele", word: "Luna", emoji: "🌙", audio: "lectura/letras/11.mp3" },
          { big: "T t", say: "te", word: "Tortuga", emoji: "🐢", audio: "lectura/letras/20.mp3" },
          { big: "N n", say: "ene", word: "Nube", emoji: "☁️", audio: "lectura/letras/13.mp3" },
          { big: "D d", say: "de", word: "Delfín", emoji: "🐬", audio: "lectura/letras/3.mp3" }
        ]
      },
      letras3: {
        group: "letras", level: 3, title: "Más letras", preview: "B C F G R V J",
        emoji: "🔤", kind: "letter",
        items: [
          { big: "B b", say: "be", word: "Ballena", emoji: "🐋", audio: "lectura/letras/1.mp3" },
          { big: "C c", say: "ce", word: "Casa", emoji: "🏠", audio: "lectura/letras/2.mp3" },
          { big: "F f", say: "efe", word: "Flor", emoji: "🌸", audio: "lectura/letras/5.mp3" },
          { big: "G g", say: "ge", word: "Gato", emoji: "🐱", audio: "lectura/letras/6.mp3" },
          { big: "R r", say: "erre", word: "Ratón", emoji: "🐭", audio: "lectura/letras/18.mp3" },
          { big: "V v", say: "uve", word: "Vaca", emoji: "🐮", audio: "lectura/letras/22.mp3" },
          { big: "J j", say: "jota", word: "Jirafa", emoji: "🦒", audio: "lectura/letras/9.mp3" }
        ]
      },
      letras4: {
        group: "letras", level: 4, title: "Letras difíciles", preview: "H K Ñ Q W X Y Z",
        emoji: "🔤", kind: "letter",
        items: [
          { big: "H h", say: "hache", word: "Helado", emoji: "🍦", audio: "lectura/letras/7.mp3" },
          { big: "K k", say: "ka", word: "Kiwi", emoji: "🥝", audio: "lectura/letras/10.mp3" },
          { big: "Ñ ñ", say: "eñe", word: "Piña", emoji: "🍍", audio: "lectura/letras/14.mp3" },
          { big: "Q q", say: "cu", word: "Queso", emoji: "🧀", audio: "lectura/letras/17.mp3" },
          { big: "W w", say: "uve doble", word: "Wifi", emoji: "📶", audio: "lectura/letras/23.mp3" },
          { big: "X x", say: "equis", word: "Xilófono", emoji: "🎼", audio: "lectura/letras/24.mp3" },
          { big: "Y y", say: "ye", word: "Yoyo", emoji: "🪀", audio: "lectura/letras/25.mp3" },
          { big: "Z z", say: "zeta", word: "Zapato", emoji: "👟", audio: "lectura/letras/26.mp3" }
        ]
      },

      /* ----- Las sílabas (4 niveles, se desbloquean en orden) ----- */
      silabas1: {
        group: "silabas", level: 1, title: "2 sílabas", preview: "ma · má",
        emoji: "1️⃣", kind: "order",
        items: [
          { big: "mamá", syllables: ["ma", "má"], emoji: "👩" },
          { big: "papá", syllables: ["pa", "pá"], emoji: "👨" },
          { big: "casa", syllables: ["ca", "sa"], emoji: "🏠" },
          { big: "gato", syllables: ["ga", "to"], emoji: "🐱" },
          { big: "luna", syllables: ["lu", "na"], emoji: "🌙" },
          { big: "mesa", syllables: ["me", "sa"], emoji: "🪑" },
          { big: "pato", syllables: ["pa", "to"], emoji: "🦆" },
          { big: "oso", syllables: ["o", "so"], emoji: "🐻" },
          { big: "uva", syllables: ["u", "va"], emoji: "🍇" },
          { big: "nube", syllables: ["nu", "be"], emoji: "☁️" }
        ]
      },
      silabas2: {
        group: "silabas", level: 2, title: "3 sílabas", preview: "pe · lo · ta",
        emoji: "2️⃣", kind: "order",
        items: [
          { big: "pelota", syllables: ["pe", "lo", "ta"], emoji: "⚽" },
          { big: "zapato", syllables: ["za", "pa", "to"], emoji: "👟" },
          { big: "tortuga", syllables: ["tor", "tu", "ga"], emoji: "🐢" },
          { big: "ventana", syllables: ["ven", "ta", "na"], emoji: "🪟" },
          { big: "camisa", syllables: ["ca", "mi", "sa"], emoji: "👕" },
          { big: "comida", syllables: ["co", "mi", "da"], emoji: "🍽️" },
          { big: "escuela", syllables: ["es", "cue", "la"], emoji: "🏫" },
          { big: "maleta", syllables: ["ma", "le", "ta"], emoji: "🧳" },
          { big: "cuchara", syllables: ["cu", "cha", "ra"], emoji: "🥄" },
          { big: "sombrero", syllables: ["som", "bre", "ro"], emoji: "👒" }
        ]
      },
      silabas3: {
        group: "silabas", level: 3, title: "4 sílabas", preview: "ma · ri · po · sa",
        emoji: "3️⃣", kind: "order",
        items: [
          { big: "mariposa", syllables: ["ma", "ri", "po", "sa"], emoji: "🦋" },
          { big: "elefante", syllables: ["e", "le", "fan", "te"], emoji: "🐘" },
          { big: "chocolate", syllables: ["cho", "co", "la", "te"], emoji: "🍫" },
          { big: "bicicleta", syllables: ["bi", "ci", "cle", "ta"], emoji: "🚲" },
          { big: "calabaza", syllables: ["ca", "la", "ba", "za"], emoji: "🎃" },
          { big: "teléfono", syllables: ["te", "lé", "fo", "no"], emoji: "📞" },
          { big: "dinosaurio", syllables: ["di", "no", "sau", "rio"], emoji: "🦕" },
          { big: "mariquita", syllables: ["ma", "ri", "qui", "ta"], emoji: "🐞" }
        ]
      },
      silabas4: {
        group: "silabas", level: 4, title: "5 sílabas", preview: "hi · po · pó · ta · mo",
        emoji: "4️⃣", kind: "order",
        items: [
          { big: "matemáticas", syllables: ["ma", "te", "má", "ti", "cas"], emoji: "🔢" },
          { big: "computadora", syllables: ["com", "pu", "ta", "do", "ra"], emoji: "💻" },
          { big: "refrigerador", syllables: ["re", "fri", "ge", "ra", "dor"], emoji: "🧊" },
          { big: "electricidad", syllables: ["e", "lec", "tri", "ci", "dad"], emoji: "⚡" },
          { big: "universidad", syllables: ["u", "ni", "ver", "si", "dad"], emoji: "🎓" },
          { big: "hipopótamo", syllables: ["hi", "po", "pó", "ta", "mo"], emoji: "🦛" },
          { big: "murciélago", syllables: ["mur", "cié", "la", "go"], emoji: "🦇" },
          { big: "abecedario", syllables: ["a", "be", "ce", "da", "rio"], emoji: "🔤" }
        ]
      },

      /* ----- Las palabras (3 niveles) ----- */
      palabras1: {
        group: "palabras", level: 1, title: "Palabras cortas", preview: "sol · oso · mamá",
        emoji: "📝", kind: "word",
        items: [
          { big: "sol", say: "sol", emoji: "☀️", audio: "lectura/palabras/2.mp3" },
          { big: "oso", say: "oso", emoji: "🐻", audio: "lectura/palabras/12.mp3" },
          { big: "mamá", say: "mamá", emoji: "👩", audio: "lectura/palabras/0.mp3" },
          { big: "papá", say: "papá", emoji: "👨", audio: "lectura/palabras/1.mp3" },
          { big: "luna", say: "luna", emoji: "🌙", audio: "lectura/palabras/3.mp3" },
          { big: "gato", say: "gato", emoji: "🐱", audio: "lectura/palabras/4.mp3" },
          { big: "casa", say: "casa", emoji: "🏠", audio: "lectura/palabras/6.mp3" },
          { big: "mesa", say: "mesa", emoji: "🪑", audio: "lectura/palabras/9.mp3" },
          { big: "mano", say: "mano", emoji: "✋", audio: "lectura/palabras/11.mp3" },
          { big: "nube", say: "nube", emoji: "☁️", audio: "lectura/palabras/13.mp3" },
          { big: "pato", say: "pato", emoji: "🦆", audio: null },
          { big: "uva", say: "uva", emoji: "🍇", audio: null }
        ]
      },
      palabras2: {
        group: "palabras", level: 2, title: "Palabras medianas", preview: "perro · flor · agua",
        emoji: "📝", kind: "word",
        items: [
          { big: "perro", say: "perro", emoji: "🐶", audio: "lectura/palabras/5.mp3" },
          { big: "flor", say: "flor", emoji: "🌸", audio: "lectura/palabras/7.mp3" },
          { big: "agua", say: "agua", emoji: "💧", audio: "lectura/palabras/8.mp3" },
          { big: "lápiz", say: "lápiz", emoji: "✏️", audio: "lectura/palabras/14.mp3" },
          { big: "pelota", say: "pelota", emoji: "⚽", audio: "lectura/palabras/10.mp3" },
          { big: "queso", say: "queso", emoji: "🧀", audio: null },
          { big: "fresa", say: "fresa", emoji: "🍓", audio: null },
          { big: "tren", say: "tren", emoji: "🚂", audio: null },
          { big: "árbol", say: "árbol", emoji: "🌳", audio: null },
          { big: "libro", say: "libro", emoji: "📕", audio: null },
          { big: "globo", say: "globo", emoji: "🎈", audio: null },
          { big: "plato", say: "plato", emoji: "🍽️", audio: null }
        ]
      },
      palabras3: {
        group: "palabras", level: 3, title: "Palabras largas", preview: "mariposa · conejo",
        emoji: "📝", kind: "word",
        items: [
          { big: "mariposa", say: "mariposa", emoji: "🦋", audio: null },
          { big: "zapato", say: "zapato", emoji: "👟", audio: null },
          { big: "tortuga", say: "tortuga", emoji: "🐢", audio: null },
          { big: "conejo", say: "conejo", emoji: "🐰", audio: null },
          { big: "manzana", say: "manzana", emoji: "🍎", audio: null },
          { big: "helado", say: "helado", emoji: "🍦", audio: null },
          { big: "estrella", say: "estrella", emoji: "⭐", audio: null },
          { big: "pájaro", say: "pájaro", emoji: "🐦", audio: null },
          { big: "galleta", say: "galleta", emoji: "🍪", audio: null },
          { big: "plátano", say: "plátano", emoji: "🍌", audio: null },
          { big: "dinosaurio", say: "dinosaurio", emoji: "🦕", audio: null },
          { big: "arcoíris", say: "arcoíris", emoji: "🌈", audio: null }
        ]
      },

      /* ----- Las frases (3 niveles) ----- */
      frases1: {
        group: "frases", level: 1, title: "Frases cortas", preview: "Mi mamá me ama.",
        emoji: "📖", kind: "sentence",
        items: [
          { big: "Mi mamá me ama.", say: "Mi mamá me ama.", emoji: "👩", audio: "lectura/frases/0.mp3" },
          { big: "Me gusta jugar.", say: "Me gusta jugar.", emoji: "⚽", audio: "lectura/frases/5.mp3" },
          { big: "PIPI es un koala.", say: "Pipi es un koala.", emoji: "🐨", audio: "lectura/frases/4.mp3" },
          { big: "Yo leo.", say: "Yo leo.", emoji: "📖", audio: null },
          { big: "El gato come.", say: "El gato come.", emoji: "🐱", audio: null },
          { big: "Mi casa es azul.", say: "Mi casa es azul.", emoji: "🏠", audio: null }
        ]
      },
      frases2: {
        group: "frases", level: 2, title: "Frases medianas", preview: "El gato bebe agua.",
        emoji: "📖", kind: "sentence",
        items: [
          { big: "El sol es amarillo.", say: "El sol es amarillo.", emoji: "☀️", audio: "lectura/frases/1.mp3" },
          { big: "El gato bebe agua.", say: "El gato bebe agua.", emoji: "🐱", audio: "lectura/frases/2.mp3" },
          { big: "La niña lee un libro.", say: "La niña lee un libro.", emoji: "📖", audio: "lectura/frases/3.mp3" },
          { big: "La luna sale de noche.", say: "La luna sale de noche.", emoji: "🌙", audio: null },
          { big: "Me gusta comer fresas.", say: "Me gusta comer fresas.", emoji: "🍓", audio: null },
          { big: "La mariposa vuela alto.", say: "La mariposa vuela alto.", emoji: "🦋", audio: null }
        ]
      },
      frases3: {
        group: "frases", level: 3, title: "Frases largas", preview: "En el jardín hay flores…",
        emoji: "📖", kind: "sentence",
        items: [
          { big: "El perro corre en el parque.", say: "El perro corre en el parque.", emoji: "🐶", audio: null },
          { big: "PIPI tiene un corazón que brilla.", say: "Pipi tiene un corazón que brilla.", emoji: "💖", audio: null },
          { big: "En el jardín hay flores de colores.", say: "En el jardín hay flores de colores.", emoji: "🌷", audio: null },
          { big: "Mi mamá y yo vamos a la escuela.", say: "Mi mamá y yo vamos a la escuela.", emoji: "🏫", audio: null },
          { big: "Cuando llueve, me pongo mis botas.", say: "Cuando llueve, me pongo mis botas.", emoji: "🌧️", audio: null },
          { big: "El sol sale por la mañana.", say: "El sol sale por la mañana.", emoji: "🌅", audio: null }
        ]
      }

    }
  },

  /* ---------------- INGLÉS BÁSICO ---------------- */
  ingles: {
    title: "Inglés",
    subtitle: "Palabras básicas para niños",
    categories: {

      saludos: {
        title: "Saludos",
        emoji: "👋",
        kind: "word",
        items: [
          { en: "Hello", es: "Hola", emoji: "👋" },
          { en: "Good morning", es: "Buenos días", emoji: "🌅" },
          { en: "Good afternoon", es: "Buenas tardes", emoji: "☀️" },
          { en: "Good night", es: "Buenas noches", emoji: "🌙" },
          { en: "Thank you", es: "Gracias", emoji: "🙏" },
          { en: "Please", es: "Por favor", emoji: "🤲" },
          { en: "Yes", es: "Sí", emoji: "✅" },
          { en: "No", es: "No", emoji: "❌" },
          { en: "Goodbye", es: "Adiós", emoji: "👋" },
          { en: "How are you?", es: "¿Cómo estás?", emoji: "🙂" }
        ]
      },

      colores: {
        title: "Colores",
        emoji: "🎨",
        kind: "word",
        items: [
          { en: "red", es: "rojo", emoji: "🔴" },
          { en: "blue", es: "azul", emoji: "🔵" },
          { en: "green", es: "verde", emoji: "🟢" },
          { en: "yellow", es: "amarillo", emoji: "🟡" },
          { en: "orange", es: "naranja", emoji: "🟠" },
          { en: "purple", es: "morado", emoji: "🟣" },
          { en: "pink", es: "rosa", emoji: "🌸" },
          { en: "black", es: "negro", emoji: "⚫" },
          { en: "white", es: "blanco", emoji: "⚪" },
          { en: "brown", es: "marrón", emoji: "🟤" }
        ]
      },

      numeros: {
        title: "Números",
        emoji: "🔢",
        kind: "word",
        items: [
          { en: "one", es: "uno", emoji: "1️⃣" },
          { en: "two", es: "dos", emoji: "2️⃣" },
          { en: "three", es: "tres", emoji: "3️⃣" },
          { en: "four", es: "cuatro", emoji: "4️⃣" },
          { en: "five", es: "cinco", emoji: "5️⃣" },
          { en: "six", es: "seis", emoji: "6️⃣" },
          { en: "seven", es: "siete", emoji: "7️⃣" },
          { en: "eight", es: "ocho", emoji: "8️⃣" },
          { en: "nine", es: "nueve", emoji: "9️⃣" },
          { en: "ten", es: "diez", emoji: "🔟" }
        ]
      },

      animales: {
        title: "Animales",
        emoji: "🐾",
        kind: "word",
        items: [
          { en: "cat", es: "gato", emoji: "🐱" },
          { en: "dog", es: "perro", emoji: "🐶" },
          { en: "bird", es: "pájaro", emoji: "🐦" },
          { en: "fish", es: "pez", emoji: "🐟" },
          { en: "rabbit", es: "conejo", emoji: "🐰" },
          { en: "bear", es: "oso", emoji: "🐻" },
          { en: "koala", es: "koala", emoji: "🐨" },
          { en: "lion", es: "león", emoji: "🦁" },
          { en: "elephant", es: "elefante", emoji: "🐘" },
          { en: "monkey", es: "mono", emoji: "🐵" }
        ]
      },

      familia: {
        title: "La familia",
        emoji: "👨‍👩‍👧",
        kind: "word",
        items: [
          { en: "mom", es: "mamá", emoji: "👩" },
          { en: "dad", es: "papá", emoji: "👨" },
          { en: "sister", es: "hermana", emoji: "👧" },
          { en: "brother", es: "hermano", emoji: "👦" },
          { en: "baby", es: "bebé", emoji: "👶" },
          { en: "grandma", es: "abuela", emoji: "👵" },
          { en: "grandpa", es: "abuelo", emoji: "👴" },
          { en: "family", es: "familia", emoji: "👨‍👩‍👧" }
        ]
      },

      cuerpo: {
        title: "El cuerpo",
        emoji: "🙂",
        kind: "word",
        items: [
          { en: "head", es: "cabeza", emoji: "🙂" },
          { en: "eyes", es: "ojos", emoji: "👀" },
          { en: "nose", es: "nariz", emoji: "👃" },
          { en: "mouth", es: "boca", emoji: "👄" },
          { en: "ears", es: "orejas", emoji: "👂" },
          { en: "hands", es: "manos", emoji: "✋" },
          { en: "feet", es: "pies", emoji: "🦶" },
          { en: "hair", es: "cabello", emoji: "💇" }
        ]
      }

    }
  }

};

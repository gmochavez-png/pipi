/* =========================================================
   PIPI · Contenido educativo
   Todo el contenido es editable. Para añadir o cambiar
   lecciones, modifica los arrays "items".
   ========================================================= */

window.PIPI_LESSONS = {

  /* ---------------- LECTURA (español) ---------------- */
  lectura: {
    title: "Aprender a leer",
    subtitle: "Letras, sílabas, palabras y frases",
    categories: {

      letras: {
        title: "Las letras",
        emoji: "🔤",
        kind: "letter",
        items: [
          { big: "A a", say: "a", word: "Abeja", emoji: "🐝" },
          { big: "B b", say: "be", word: "Ballena", emoji: "🐋" },
          { big: "C c", say: "ce", word: "Casa", emoji: "🏠" },
          { big: "D d", say: "de", word: "Delfín", emoji: "🐬" },
          { big: "E e", say: "e", word: "Elefante", emoji: "🐘" },
          { big: "F f", say: "efe", word: "Flor", emoji: "🌸" },
          { big: "G g", say: "ge", word: "Gato", emoji: "🐱" },
          { big: "H h", say: "hache", word: "Helado", emoji: "🍦" },
          { big: "I i", say: "i", word: "Iguana", emoji: "🦎" },
          { big: "J j", say: "jota", word: "Jirafa", emoji: "🦒" },
          { big: "K k", say: "ka", word: "Kiwi", emoji: "🥝" },
          { big: "L l", say: "ele", word: "Luna", emoji: "🌙" },
          { big: "M m", say: "eme", word: "Manzana", emoji: "🍎" },
          { big: "N n", say: "ene", word: "Nube", emoji: "☁️" },
          { big: "Ñ ñ", say: "eñe", word: "Piña", emoji: "🍍" },
          { big: "O o", say: "o", word: "Oso", emoji: "🐻" },
          { big: "P p", say: "pe", word: "Perro", emoji: "🐶" },
          { big: "Q q", say: "cu", word: "Queso", emoji: "🧀" },
          { big: "R r", say: "erre", word: "Ratón", emoji: "🐭" },
          { big: "S s", say: "ese", word: "Sol", emoji: "☀️" },
          { big: "T t", say: "te", word: "Tortuga", emoji: "🐢" },
          { big: "U u", say: "u", word: "Uva", emoji: "🍇" },
          { big: "V v", say: "uve", word: "Vaca", emoji: "🐮" },
          { big: "W w", say: "uve doble", word: "Wifi", emoji: "📶" },
          { big: "X x", say: "equis", word: "Xilófono", emoji: "🎼" },
          { big: "Y y", say: "ye", word: "Yoyo", emoji: "🪀" },
          { big: "Z z", say: "zeta", word: "Zapato", emoji: "👟" }
        ]
      },

      silabas1: {
        title: "Sílabas 1",
        emoji: "1️⃣",
        kind: "order",
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
        title: "Sílabas 2",
        emoji: "2️⃣",
        kind: "order",
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
        title: "Sílabas 3",
        emoji: "3️⃣",
        kind: "order",
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
        title: "Sílabas 4",
        emoji: "4️⃣",
        kind: "order",
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

      palabras: {
        title: "Las palabras",
        emoji: "📝",
        kind: "word",
        items: [
          { big: "mamá", say: "mamá", emoji: "👩" },
          { big: "papá", say: "papá", emoji: "👨" },
          { big: "sol", say: "sol", emoji: "☀️" },
          { big: "luna", say: "luna", emoji: "🌙" },
          { big: "gato", say: "gato", emoji: "🐱" },
          { big: "perro", say: "perro", emoji: "🐶" },
          { big: "casa", say: "casa", emoji: "🏠" },
          { big: "flor", say: "flor", emoji: "🌸" },
          { big: "agua", say: "agua", emoji: "💧" },
          { big: "mesa", say: "mesa", emoji: "🪑" },
          { big: "pelota", say: "pelota", emoji: "⚽" },
          { big: "mano", say: "mano", emoji: "✋" },
          { big: "oso", say: "oso", emoji: "🐻" },
          { big: "nube", say: "nube", emoji: "☁️" },
          { big: "lápiz", say: "lápiz", emoji: "✏️" }
        ]
      },

      frases: {
        title: "Las frases",
        emoji: "📖",
        kind: "sentence",
        items: [
          { big: "Mi mamá me ama.", say: "Mi mamá me ama.", emoji: "👩" },
          { big: "El sol es amarillo.", say: "El sol es amarillo.", emoji: "☀️" },
          { big: "El gato bebe agua.", say: "El gato bebe agua.", emoji: "🐱" },
          { big: "La niña lee un libro.", say: "La niña lee un libro.", emoji: "📖" },
          { big: "PIPI es un koala.", say: "Pipi es un koala.", emoji: "🐨" },
          { big: "Me gusta jugar.", say: "Me gusta jugar.", emoji: "⚽" }
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

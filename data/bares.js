/**
 * GestoBares · Catálogo de bares de Huesca ciudad
 * ------------------------------------------------
 * Los 8 primeros bares son los originales del proyecto de Jaime Ferrer.
 * El resto se ha recopilado mediante búsquedas en internet (prensa local,
 * guías gastronómicas, directorios de hostelería y páginas de turismo de
 * Huesca) para ampliar el catálogo con establecimientos reales de la ciudad.
 *
 * Fuentes consultadas (septiembre 2026): aragondigital.es, hosteleriahuesca.com,
 * guiarepsol.com, salir.com, huescaya.com.es, paginasamarillas.es, espainfo.com,
 * huescaturismo.com, elespanol.com (Aragón) y hoyaragon.es.
 *
 * Las coordenadas son aproximadas (no se ha podido geocodificar cada
 * dirección exacta por restricciones de red del entorno de desarrollo);
 * sitúan cada bar en su calle/zona real dentro del casco urbano de Huesca.
 * Cualquiera puede añadir nuevos bares simplemente añadiendo un objeto a
 * este array: no hace falta tocar el resto de la aplicación.
 */
const BARES = [
  {
    id: "comomelocomo",
    nombre: "Bar Comomelocomo",
    tipo: "Tapas y raciones",
    zona: "Centro",
    direccion: "C. Padre Huesca, Huesca",
    lat: 42.1367, lng: -0.4097,
    telefono: "",
    descripcion: "Bar restaurante con terraza informal, situado en el centro de la ciudad, que sirve tapas y platos caseros. Especialista en cocina apta para celíacos.",
    etiquetas: ["tapas", "terraza", "sin gluten"],
    imagenTexto: "🍽️"
  },
  {
    id: "ricoricocu",
    nombre: "Bar RicoRico-Cu",
    tipo: "Tapas y raciones",
    zona: "Centro",
    direccion: "Centro de Huesca",
    lat: 42.1371, lng: -0.4088,
    telefono: "",
    descripcion: "Un clásico bar restaurante en el corazón de la ciudad, con una terraza muy cotizada, que ofrece una gran variedad de tapas y raciones caseras.",
    etiquetas: ["tapas", "terraza", "raciones"],
    imagenTexto: "🍤"
  },
  {
    id: "rugaca",
    nombre: "Bar Rugaca",
    tipo: "Cafetería y vermutería",
    zona: "Centro histórico",
    direccion: "Casco Viejo, Huesca",
    lat: 42.1378, lng: -0.4102,
    telefono: "",
    descripcion: "Un histórico bar en el centro de Huesca, famoso por su excelente café, tapas caseras y amplia selección de licores; perfecto para un vermut al sol o un cóctel por la tarde en un ambiente acogedor.",
    etiquetas: ["café", "vermú", "licores"],
    imagenTexto: "☕"
  },
  {
    id: "almeriz",
    nombre: "Bar Almeriz",
    tipo: "Desayunos y eventos",
    zona: "Almeriz",
    direccion: "Junto a las Piscinas Municipales de Almeriz, Huesca",
    lat: 42.1455, lng: -0.4083,
    telefono: "",
    descripcion: "Este novedoso bar ofrece desayunos, tapas, comidas y cenas con opciones saludables y sin gluten, además de servicios para eventos en un amplio local junto a las piscinas municipales de Almeriz.",
    etiquetas: ["desayunos", "saludable", "eventos"],
    imagenTexto: "🥐"
  },
  {
    id: "abadia",
    nombre: "Bar Abadía de los Templarios",
    tipo: "Copas y hamburguesas",
    zona: "Centro",
    direccion: "Centro de Huesca",
    lat: 42.1358, lng: -0.4079,
    telefono: "",
    descripcion: "Bar con una amplia terraza muy animada, que ofrece cócteles, cervezas y una selección de bocadillos, hamburguesas y raciones.",
    etiquetas: ["cócteles", "hamburguesas", "terraza"],
    imagenTexto: "🍔"
  },
  {
    id: "brasil",
    nombre: "Bar Brasil",
    tipo: "Bar histórico",
    zona: "Coso Alto",
    direccion: "Coso Alto, 24, Huesca",
    lat: 42.1381, lng: -0.4074,
    telefono: "",
    descripcion: "Bar emblemático de Huesca y punto de encuentro histórico y sociológico de la ciudad. Con más de 50 años de historia, regentado por Alegría Blan, es un símbolo de las Fiestas de San Lorenzo.",
    etiquetas: ["histórico", "san lorenzo", "tapas"],
    imagenTexto: "🎉"
  },
  {
    id: "punto",
    nombre: "Bar Punto de Encuentro",
    tipo: "Gastrobar",
    zona: "Los Olivos",
    direccion: "Barrio de Los Olivos, junto al Palacio de Congresos, Huesca",
    lat: 42.1285, lng: -0.4065,
    telefono: "",
    descripcion: "Situado en el barrio de Los Olivos, este bar ofrece una variedad gastronómica exquisita, con una terraza muy cotizada al lado del Palacio de Congresos de Huesca.",
    etiquetas: ["gastrobar", "terraza"],
    imagenTexto: "🍷"
  },
  {
    id: "ato",
    nombre: "Bar Ato",
    tipo: "Terraza y previas de fútbol",
    zona: "Parque Europa",
    direccion: "Junto al Parque Europa, cerca de El Alcoraz, Huesca",
    lat: 42.1288, lng: -0.4225,
    telefono: "",
    descripcion: "Situado al lado del Parque Europa, este bar tiene una terraza muy tranquila para pasar una tarde de cervezas y, si te gusta el fútbol, es de los mejores lugares para las previas de la SD Huesca, cerca de El Alcoraz.",
    etiquetas: ["terraza", "fútbol", "cervezas"],
    imagenTexto: "⚽"
  },

  /* ---------- Bares reales de Huesca añadidos vía búsqueda en internet ---------- */
  {
    id: "mibar",
    nombre: "Mi Bar",
    tipo: "Bar histórico",
    zona: "Coso Alto",
    direccion: "Coso Alto, 26, 22001 Huesca",
    lat: 42.1379, lng: -0.4076,
    telefono: "974 22 00 54",
    descripcion: "Institución centenaria del centro de Huesca, fundada por Gregorio Bitrián y regentada hoy por sus descendientes. Reconocido con el 'Solete con Solera' de la Guía Repsol por sus desayunos, su café y sus tapas de vermú.",
    etiquetas: ["histórico", "vermú", "desayunos"],
    imagenTexto: "🥂"
  },
  {
    id: "barcorreos",
    nombre: "Bar Correos",
    tipo: "Bar de barra",
    zona: "Coso Alto",
    direccion: "Coso Alto, Huesca",
    lat: 42.1383, lng: -0.4072,
    telefono: "",
    descripcion: "Bar tradicional de toda la vida en la zona del Coso, parada clásica para tapear frente a la antigua oficina de Correos.",
    etiquetas: ["tapas", "barra"],
    imagenTexto: "🍺"
  },
  {
    id: "hiedra1",
    nombre: "Hiedra 1",
    tipo: "Bar de tapas",
    zona: "Coso Alto",
    direccion: "Coso Alto, 57, Huesca",
    lat: 42.1390, lng: -0.4069,
    telefono: "618 09 61 03",
    descripcion: "Bar de tapas y raciones en pleno Coso Alto, con ambiente moderno y buen surtido de vinos de la D.O. Somontano.",
    etiquetas: ["tapas", "vinos"],
    imagenTexto: "🌿"
  },
  {
    id: "granjaanita",
    nombre: "Granja Anita",
    tipo: "Cafetería histórica",
    zona: "Plaza de Navarra",
    direccion: "Plaza de Navarra, 5, 22002 Huesca",
    lat: 42.1386, lng: -0.4068,
    telefono: "974 21 57 12",
    descripcion: "Cafetería clásica de Huesca en plena Plaza de Navarra, punto de encuentro habitual para desayunar o merendar en el centro.",
    etiquetas: ["café", "merienda"],
    imagenTexto: "🍰"
  },
  {
    id: "lagoyosa",
    nombre: "La Goyosa",
    tipo: "Bar de tapas",
    zona: "San Lorenzo",
    direccion: "C. San Lorenzo, 4, 22002 Huesca",
    lat: 42.1389, lng: -0.4088,
    telefono: "974 03 09 32",
    descripcion: "Bar de tapas y raciones junto a la Iglesia de San Lorenzo, en una de las zonas con más ambiente del casco antiguo.",
    etiquetas: ["tapas", "san lorenzo"],
    imagenTexto: "🥘"
  },
  {
    id: "bodegapirineos",
    nombre: "Bodega Bar Pirineos",
    tipo: "Bar de tapas",
    zona: "Calle Fraga",
    direccion: "C. Fraga, Huesca",
    lat: 42.1352, lng: -0.4118,
    telefono: "",
    descripcion: "Uno de los bares más tradicionales y queridos de Huesca, famoso por su ambiente acogedor y su variedad de vinagrillos, encurtidos, embutidos y quesos curados.",
    etiquetas: ["tapas", "vinagrillos", "quesos"],
    imagenTexto: "🧀"
  },
  {
    id: "dkanas",
    nombre: "D'KAÑAS",
    tipo: "Bar de tapas",
    zona: "San Lorenzo",
    direccion: "Cerca de la Iglesia de San Lorenzo, Huesca",
    lat: 42.1387, lng: -0.4092,
    telefono: "",
    descripcion: "Bar de tapas en una de las calles más bonitas del centro, con terraza y vistas a la Iglesia de San Lorenzo. Destacan su tartar de sardinas, el panini casero y sus tablas de queso.",
    etiquetas: ["tapas", "terraza"],
    imagenTexto: "🐟"
  },
  {
    id: "davinci",
    nombre: "Bar Da Vinci",
    tipo: "Bar de tapas",
    zona: "Calle Padre Huesca",
    direccion: "C. Padre Huesca, 13, Huesca",
    lat: 42.1369, lng: -0.4100,
    telefono: "",
    descripcion: "Bar situado en el centro de la ciudad que sirve una gran variedad de tapas y raciones para todos los gustos.",
    etiquetas: ["tapas", "raciones"],
    imagenTexto: "🎨"
  },
  {
    id: "tomatejamon",
    nombre: "TomateJamón",
    tipo: "Bar de tapas",
    zona: "Calle Padre Huesca",
    direccion: "C. Padre Huesca, 20, Huesca",
    lat: 42.1370, lng: -0.4101,
    telefono: "",
    descripcion: "Bar de tapas muy popular en el centro de Huesca, con una carta variada de raciones y buen ambiente para tapear.",
    etiquetas: ["tapas", "raciones"],
    imagenTexto: "🍅"
  },
  {
    id: "hervi",
    nombre: "Restaurante Hervi",
    tipo: "Bar restaurante",
    zona: "Plaza Navarra",
    direccion: "Cerca de la Plaza Navarra, Huesca",
    lat: 42.1382, lng: -0.4064,
    telefono: "",
    descripcion: "Bar restaurante con una excelente ubicación a escasos metros de la Plaza Navarra, ideal para comer o tapear en pleno centro.",
    etiquetas: ["restaurante", "tapas"],
    imagenTexto: "🍝"
  },
  {
    id: "elcirculo",
    nombre: "Bar El Círculo",
    tipo: "Coctelería",
    zona: "Centro",
    direccion: "Centro de Huesca",
    lat: 42.1365, lng: -0.4082,
    telefono: "",
    descripcion: "Coctelería del centro con ambiente agradable y una extensa carta de cócteles, entre clásicos y creaciones propias.",
    etiquetas: ["cócteles", "copas"],
    imagenTexto: "🍸"
  },
  {
    id: "tabernadellobo",
    nombre: "La Taberna del Lobo",
    tipo: "Bar de copas",
    zona: "Centro",
    direccion: "Centro de Huesca",
    lat: 42.1374, lng: -0.4108,
    telefono: "",
    descripcion: "Bar de copas céntrico, uno de los locales recomendados para salir de noche en Huesca.",
    etiquetas: ["copas", "noche"],
    imagenTexto: "🐺"
  },
  {
    id: "monasterio",
    nombre: "Monasterio Bar de Copas",
    tipo: "Bar de copas",
    zona: "San Lorenzo",
    direccion: "Junto a la Plaza de San Lorenzo, Huesca",
    lat: 42.1390, lng: -0.4085,
    telefono: "",
    descripcion: "Bar de copas cercano a la Plaza de San Lorenzo, muy concurrido los fines de semana por su amplia variedad de ofertas en bebidas.",
    etiquetas: ["copas", "noche"],
    imagenTexto: "🍹"
  },
  {
    id: "lasalastreettheatre",
    nombre: "La Sala Street Theatre",
    tipo: "Disco-bar",
    zona: "Centro",
    direccion: "Centro de Huesca",
    lat: 42.1360, lng: -0.4070,
    telefono: "",
    descripcion: "Disco-bar en pleno centro de la ciudad, con programación musical variada; una de las opciones favoritas para tomar una copa y bailar.",
    etiquetas: ["música en vivo", "noche"],
    imagenTexto: "🎶"
  },
  {
    id: "lazarza",
    nombre: "La Zarza",
    tipo: "Bar restaurante",
    zona: "Centro",
    direccion: "Centro de Huesca",
    lat: 42.1348, lng: -0.4095,
    telefono: "",
    descripcion: "Bar restaurante con una terraza con encanto, buena opción para comer o tomar algo tranquilamente en el centro.",
    etiquetas: ["terraza", "restaurante"],
    imagenTexto: "🌳"
  },
  {
    id: "alfresco",
    nombre: "Al Fresco Cervecería",
    tipo: "Cervecería artesana",
    zona: "Plaza de San Pedro",
    direccion: "Pl. de San Pedro, 5, 22001 Huesca",
    lat: 42.1345, lng: -0.4112,
    telefono: "",
    descripcion: "Cervecería artesana en pleno casco histórico que combina la cerveza de calidad con un espacio cultural: exposiciones, talleres, música y poesía.",
    etiquetas: ["cerveza artesana", "cultura"],
    imagenTexto: "🍻"
  },
  {
    id: "localbeer",
    nombre: "Local Beer",
    tipo: "Cervecería artesana",
    zona: "Centro",
    direccion: "Centro de Huesca",
    lat: 42.1355, lng: -0.4090,
    telefono: "",
    descripcion: "Cervecería especializada en cerveza artesana con una selecta variedad de estilos, abierta desde 2021.",
    etiquetas: ["cerveza artesana"],
    imagenTexto: "🍺"
  },
  {
    id: "casinohuesca",
    nombre: "Café del Casino de Huesca",
    tipo: "Café histórico",
    zona: "Plaza de Navarra",
    direccion: "Plaza de Navarra, 4, 22002 Huesca",
    lat: 42.1384, lng: -0.4066,
    telefono: "974 21 06 12",
    descripcion: "Café del histórico Casino de Huesca, en plena Plaza de Navarra; un clásico para tomar algo con solera en un edificio emblemático de la ciudad.",
    etiquetas: ["histórico", "café"],
    imagenTexto: "🏛️"
  }
];

// Exposición para los distintos scripts de la aplicación
if (typeof module !== "undefined" && module.exports) {
  module.exports = BARES;
}

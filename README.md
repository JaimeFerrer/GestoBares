# GestoBares

Aplicación web para descubrir, valorar y reservar mesa en los bares de
**Huesca ciudad**. Proyecto original de **Jaime Ferrer Ferrer** (Máster en
Gestión y Desarrollo de Aplicaciones Multiplataforma, INESEM), ampliado a
partir de la memoria del proyecto para cubrir todas las funcionalidades que
en ella se describen y con un catálogo de bares reales de Huesca.

Demo: `index.html` (pensado para publicarse en GitHub Pages, p. ej.
`jaimeferrer.github.io`).

## ¿Qué hay implementado?

A partir de los requisitos de la memoria del proyecto (`1.2. Funcionalidades
clave y especificaciones técnicas`):

| Funcionalidad (memoria) | Estado en esta versión |
|---|---|
| Reservas (mesa, sillas, interior/terraza, fecha/hora) | ✅ Formulario con validación, confirmación y gestión (modificar/cancelar) en `reservas.html` |
| Foro con opiniones y valoraciones | ✅ Comentarios + valoración de 1 a 5 estrellas por bar, con media calculada en vivo |
| Mapa interactivo (buscar, filtrar, zoom) | ✅ Leaflet + OpenStreetMap, con buscador y filtros por tipo/zona/valoración/favoritos |
| Notificaciones (confirmación, recordatorio, cambios) | ✅ Aviso en pantalla + notificaciones del navegador opcionales; recordatorio automático 24h antes |
| Chat por bar | ✅ Chat de demostración persistente en el navegador |
| Compatibilidad multi-dispositivo | ✅ Diseño responsive (probado en escritorio y móvil) |
| Seguridad básica (anti-spam / XSS) | ✅ Honeypot + pregunta anti-spam en foro, `escapeHTML()` en todo contenido de usuario |
| Pruebas | ✅ `tests.html` con pruebas unitarias de la capa de datos |
| Personalización de perfil (mejora futura en la memoria) | ✅ Versión ligera: perfil, favoritos y preferencias de notificación en `perfil.html` |
| Pago anticipado / app móvil nativa (mejoras futuras en la memoria) | ⏳ No implementado — ver "Mejoras futuras" |

## Por qué no hay un backend real (MySQL, SendGrid, Twilio…)

La memoria del proyecto plantea un backend con base de datos relacional y
envío de correos/SMS. Esta aplicación, igual que el proyecto original, se
publica como **sitio estático en GitHub Pages**, que no ejecuta servidor
propio. Para poder ofrecer igualmente reservas, foro y perfil "de verdad"
(que se guardan y se pueden modificar), `js/storage.js` implementa una capa
de persistencia con `localStorage` que reproduce la forma de la base de
datos descrita en la memoria (reservas, comentarios, chat, perfil). Toda la
aplicación llama únicamente a esas funciones, nunca a `localStorage`
directamente, así que el día de mañana basta con reescribir ese fichero
para hablar con una API REST real (Node/PHP + MySQL) sin tocar el resto del
código.

Como el correo de confirmación no se puede enviar de verdad sin un servidor
SMTP, cada reserva ofrece un enlace `mailto:` que abre el cliente de correo
del usuario con la confirmación ya redactada.

## Catálogo de bares de Huesca

`data/bares.js` incluye los 8 bares originales del proyecto más una veintena
de bares reales de Huesca ciudad recopilados mediante búsquedas en internet
(septiembre de 2026): prensa local (Aragón Digital, El Español Aragón),
guías gastronómicas (Guía Repsol, Salir.com), directorios de hostelería
(hosteleriahuesca.com) y páginas de turismo/directorios locales
(huescaya.com.es, páginas amarillas, espainfo.com). Cada bar incluye nombre,
tipo, zona, dirección (cuando se ha podido confirmar) y una descripción
breve.

**Limitaciones honestas:**
- El entorno de desarrollo usado para construir esta versión tiene salida a
  internet muy restringida (no permite consultar Overpass/OSM ni scrapear
  directorios), así que la recopilación se hizo a partir de resúmenes de
  búsqueda. La lista es amplia pero **no pretende ser el 100% de los bares
  de Huesca** — Huesca tiene varios cientos de establecimientos de
  hostelería y muchos no tienen presencia online suficiente para
  verificarlos automáticamente.
- Las coordenadas son aproximadas (ubican cada bar en su calle/plaza real,
  pero no se han geocodificado una a una).
- Añadir un bar nuevo es tan sencillo como añadir un objeto al array de
  `data/bares.js`; no hace falta tocar ninguna otra parte de la aplicación.

## Estructura del proyecto

```
index.html         Página principal: listado + buscador/filtros + mapa
bar.html            Ficha de un bar (?id=...): reserva, foro, chat, mini-mapa
reservas.html        "Mis reservas": ver, modificar y cancelar
perfil.html          Perfil, favoritos y preferencias de notificación
tests.html            Pruebas unitarias de la capa de datos
data/bares.js         Catálogo de bares (fuente única de datos)
js/storage.js         Capa de persistencia (simula el backend)
js/ui.js               Cabecera/pie comunes, valoraciones, anti-spam
js/map.js              Integración con Leaflet/OpenStreetMap
js/main.js, bar.js,
js/reservas.js, perfil.js   Lógica específica de cada página
css/style.css          Estilos compartidos (responsive)
Principal.html         Redirección a index.html (compatibilidad con enlaces antiguos)
```

## Tecnología

HTML5, CSS3 y JavaScript "vanilla" (sin frameworks ni paso de compilación),
tal y como se decidió en la memoria del proyecto, más
[Leaflet](https://leafletjs.com/) y [OpenStreetMap](https://www.openstreetmap.org/)
para el mapa interactivo (alternativa gratuita a Google Maps API que ya se
contemplaba en la memoria).

## Cómo probarlo en local

No requiere instalación: basta con servir la carpeta con cualquier servidor
estático, por ejemplo:

```bash
python3 -m http.server 8000
# abrir http://localhost:8000/index.html
```

(Abrir los archivos con `file://` también funciona, salvo el mapa en
algunos navegadores por restricciones de CORS al cargar `data/bares.js`.)

## Mejoras futuras

Recogiendo el apartado "Posibles mejoras futuras" de la memoria original:

- **Backend real**: sustituir `js/storage.js` por una API REST con base de
  datos (MySQL/PostgreSQL) para que reservas, foro y chat sean compartidos
  entre todos los usuarios y no solo por navegador.
- **Chat en tiempo real**: con un servidor y websockets, para que la
  conversación sea compartida entre el bar y todos los clientes.
- **Notificaciones por email/SMS reales**: integrar SendGrid/SMTP y Twilio
  desde el backend.
- **Funcionalidad de pago**: pasarela de pago (Stripe/PayPal) para reservas
  con pago anticipado, como se planteaba en la memoria.
- **Aplicación móvil nativa** (iOS/Android).
- **Moderación real del foro**: panel de administración para aprobar o
  rechazar comentarios antes de publicarlos.
- Completar y verificar el catálogo de bares con una fuente de datos
  geolocalizados fiable (p. ej. la API de Google Places o una exportación
  de OpenStreetMap/Overpass) para cubrir el 100% de los establecimientos y
  coordenadas exactas.

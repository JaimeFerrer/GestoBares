/**
 * GestoBares · Mapa interactivo
 * Usa Leaflet + OpenStreetMap (gratuito, sin necesidad de clave de API),
 * tal y como contemplaba la memoria del proyecto como alternativa a Google
 * Maps API.
 */
const GestoMap = (() => {
  const HUESCA_CENTRO = [42.1362, -0.4087];

  function crearIcono() {
    return L.divIcon({
      className: "gesto-marker",
      html: '<div style="background:#3f8f46;width:26px;height:26px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.4);"></div>',
      iconSize: [26, 26],
      iconAnchor: [13, 26],
      popupAnchor: [0, -26],
    });
  }

  /** Mapa con un marcador por cada bar del catálogo. Devuelve {map, marcadores}. */
  function crearMapaGeneral(containerId, bares, onSeleccionar) {
    const map = L.map(containerId).setView(HUESCA_CENTRO, 15);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    const marcadores = {};
    bares.forEach(bar => {
      const marker = L.marker([bar.lat, bar.lng], { icon: crearIcono() }).addTo(map);
      marker.bindPopup(
        `<h3>${bar.nombre}</h3><p>${bar.direccion}</p><a href="bar.html?id=${bar.id}">Ver ficha y reservar →</a>`
      );
      if (onSeleccionar) marker.on("click", () => onSeleccionar(bar.id));
      marcadores[bar.id] = marker;
    });

    return { map, marcadores };
  }

  /** Mini-mapa centrado en un único bar (página de ficha). */
  function crearMapaBar(containerId, bar) {
    const map = L.map(containerId, { scrollWheelZoom: false }).setView([bar.lat, bar.lng], 16);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);
    L.marker([bar.lat, bar.lng], { icon: crearIcono() }).addTo(map)
      .bindPopup(`<h3>${bar.nombre}</h3><p>${bar.direccion}</p>`).openPopup();
    return map;
  }

  function enlaceComoLlegar(bar) {
    return `https://www.google.com/maps/dir/?api=1&destination=${bar.lat},${bar.lng}`;
  }

  return { crearMapaGeneral, crearMapaBar, enlaceComoLlegar, HUESCA_CENTRO };
})();

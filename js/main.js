/**
 * GestoBares · Lógica de la página principal
 * Listado de bares con buscador, filtros (tipo, zona, valoración y
 * favoritos) sincronizado con el mapa interactivo.
 */
document.addEventListener("DOMContentLoaded", () => {
  const lista = document.getElementById("bar-list");
  const buscador = document.getElementById("search-bar");
  const filtroTipo = document.getElementById("filtro-tipo");
  const filtroZona = document.getElementById("filtro-zona");
  const filtroValoracion = document.getElementById("filtro-valoracion");
  const filtroFavoritos = document.getElementById("filtro-favoritos");
  const contador = document.getElementById("contador-resultados");

  // Rellenar selects de filtros a partir del propio catálogo de datos
  const tipos = [...new Set(BARES.map(b => b.tipo))].sort();
  const zonas = [...new Set(BARES.map(b => b.zona))].sort();
  tipos.forEach(t => filtroTipo.insertAdjacentHTML("beforeend", `<option value="${t}">${t}</option>`));
  zonas.forEach(z => filtroZona.insertAdjacentHTML("beforeend", `<option value="${z}">${z}</option>`));

  let marcadores = {};
  try {
    ({ marcadores } = GestoMap.crearMapaGeneral("map", BARES, (id) => {
      const card = document.querySelector(`[data-card-id="${id}"]`);
      if (card) { card.scrollIntoView({ behavior: "smooth", block: "center" }); resaltar(card); }
    }));
  } catch (e) {
    console.warn("No se pudo cargar el mapa (Leaflet/OpenStreetMap no disponible):", e);
    const mapEl = document.getElementById("map");
    if (mapEl) mapEl.outerHTML = `<p class="muted">Mapa no disponible en este momento. Puedes seguir buscando y filtrando bares en el listado de abajo.</p>`;
  }

  function resaltar(card) {
    document.querySelectorAll(".bar-card.destacada").forEach(c => c.classList.remove("destacada"));
    card.classList.add("destacada");
    card.style.outline = "3px solid var(--accent-color)";
    setTimeout(() => (card.style.outline = ""), 1600);
  }

  function tarjetaHTML(bar) {
    const media = GestoStorage.valoracionMedia(bar.id);
    const esFav = GestoStorage.esFavorito(bar.id);
    return `
      <article class="bar-card" data-card-id="${bar.id}">
        <div class="bar-card__media">
          ${bar.imagenTexto}
          <button class="bar-card__fav" data-fav="${bar.id}" title="Marcar como favorito" aria-label="Favorito">${esFav ? "❤️" : "🤍"}</button>
        </div>
        <div class="bar-card__body">
          <h3>${GestoStorage.escapeHTML(bar.nombre)}</h3>
          <div class="bar-card__meta">${GestoStorage.escapeHTML(bar.tipo)} · ${GestoStorage.escapeHTML(bar.zona)}</div>
          ${GestoUI.estrellas(media)}
          <p class="bar-card__desc">${GestoStorage.escapeHTML(bar.descripcion)}</p>
          <div>${bar.etiquetas.map(t => `<span class="tag">${GestoStorage.escapeHTML(t)}</span>`).join("")}</div>
        </div>
        <div class="bar-card__actions">
          <a href="bar.html?id=${bar.id}" class="btn btn-primary btn-block">Ver ficha y reservar</a>
        </div>
      </article>`;
  }

  function pintarLista(bares) {
    lista.innerHTML = bares.map(tarjetaHTML).join("") || `<p class="muted">No se han encontrado bares con esos filtros.</p>`;
    contador.textContent = `${bares.length} bar${bares.length === 1 ? "" : "es"} encontrados`;
    lista.querySelectorAll("[data-fav]").forEach(btn => {
      btn.addEventListener("click", () => {
        const activo = GestoStorage.toggleFavorito(btn.dataset.fav);
        btn.textContent = activo ? "❤️" : "🤍";
      });
    });
  }

  function aplicarFiltros() {
    const texto = buscador.value.trim().toLowerCase();
    const tipo = filtroTipo.value;
    const zona = filtroZona.value;
    const minValoracion = parseInt(filtroValoracion.value, 10) || 0;
    const soloFavoritos = filtroFavoritos.checked;

    const visibles = BARES.filter(b => {
      if (texto && !(b.nombre.toLowerCase().includes(texto) || b.tipo.toLowerCase().includes(texto) || b.zona.toLowerCase().includes(texto))) return false;
      if (tipo && b.tipo !== tipo) return false;
      if (zona && b.zona !== zona) return false;
      if (minValoracion && (GestoStorage.valoracionMedia(b.id) || 0) < minValoracion) return false;
      if (soloFavoritos && !GestoStorage.esFavorito(b.id)) return false;
      return true;
    });

    pintarLista(visibles);

    // El mapa muestra siempre todos los bares, pero resaltamos con opacidad los filtrados fuera
    const idsVisibles = new Set(visibles.map(b => b.id));
    Object.entries(marcadores).forEach(([id, marker]) => {
      marker.setOpacity(idsVisibles.has(id) ? 1 : 0.25);
    });
  }

  [buscador, filtroTipo, filtroZona, filtroValoracion].forEach(el => el.addEventListener("input", aplicarFiltros));
  filtroFavoritos.addEventListener("change", aplicarFiltros);

  aplicarFiltros();
  GestoStorage.comprobarRecordatorios();
});

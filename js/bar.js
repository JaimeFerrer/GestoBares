/**
 * GestoBares · Ficha de bar (reservas + foro/valoraciones + chat + mapa)
 */
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(location.search);
  const barId = params.get("id");
  const bar = BARES.find(b => b.id === barId);
  const raiz = document.getElementById("ficha-bar");

  if (!bar) {
    raiz.innerHTML = `<div class="card"><p>No se ha encontrado ese bar. <a href="index.html">Volver al listado</a>.</p></div>`;
    return;
  }

  document.title = `${bar.nombre} · GestoBares`;

  raiz.innerHTML = `
    <section class="card">
      <div class="flex-between">
        <div>
          <h1 class="mt-0">${GestoStorage.escapeHTML(bar.nombre)}</h1>
          <p class="muted">${GestoStorage.escapeHTML(bar.tipo)} · ${GestoStorage.escapeHTML(bar.zona)} · ${GestoStorage.escapeHTML(bar.direccion)}${bar.telefono ? " · ☎ " + bar.telefono : ""}</p>
          <div id="valoracion-media"></div>
        </div>
        <button class="btn btn-outline" id="btn-favorito">${GestoStorage.esFavorito(bar.id) ? "❤️ En favoritos" : "🤍 Añadir a favoritos"}</button>
      </div>
      <div class="bar-card__media" style="height:160px;border-radius:8px;font-size:4rem;margin:14px 0;">${bar.imagenTexto}</div>
      <p>${GestoStorage.escapeHTML(bar.descripcion)}</p>
      <div>${bar.etiquetas.map(t => `<span class="tag">${GestoStorage.escapeHTML(t)}</span>`).join("")}</div>
    </section>

    <section class="card">
      <h2>Ubicación</h2>
      <div id="mapa-bar" class="mapa-mini"></div>
      <p><a class="btn btn-outline" id="link-como-llegar" target="_blank" rel="noopener">📍 Cómo llegar</a></p>
    </section>

    <section class="card" id="seccion-reserva">
      <h2>Reservar mesa</h2>
      <div id="reserva-mensaje"></div>
      <form id="form-reserva" novalidate>
        <div class="form-grid">
          <div class="campo">
            <label for="r-nombre">Nombre</label>
            <input type="text" id="r-nombre" required>
          </div>
          <div class="campo">
            <label for="r-email">Correo electrónico</label>
            <input type="email" id="r-email" required>
          </div>
          <div class="campo">
            <label for="r-fecha">Fecha</label>
            <input type="date" id="r-fecha" required>
          </div>
          <div class="campo">
            <label for="r-hora">Hora</label>
            <input type="time" id="r-hora" required>
          </div>
          <div class="campo">
            <label for="r-ubicacion">Ubicación</label>
            <select id="r-ubicacion" required>
              <option value="interior">Dentro del bar</option>
              <option value="terraza">Terraza</option>
            </select>
          </div>
          <div class="campo">
            <label for="r-mesas">Número de mesas</label>
            <input type="number" id="r-mesas" min="1" value="1" required>
          </div>
          <div class="campo">
            <label for="r-sillas">Número de sillas</label>
            <input type="number" id="r-sillas" min="1" value="2" required>
          </div>
        </div>
        <p style="margin-top:14px;"><button type="submit" class="btn btn-primary">Reservar</button></p>
      </form>
    </section>

    <section class="card" id="seccion-foro">
      <h2>Foro y valoraciones</h2>
      <div id="foro-mensaje"></div>
      <form id="form-comentario" novalidate>
        <div class="form-grid">
          <div class="campo">
            <label for="c-nombre">Nombre</label>
            <input type="text" id="c-nombre" required>
          </div>
          <div class="campo">
            <label for="c-email">Correo electrónico</label>
            <input type="email" id="c-email" required>
          </div>
        </div>
        ${GestoUI.selectorEstrellas("c-valoracion")}
        <div class="campo">
          <label for="c-mensaje">Tu opinión</label>
          <textarea id="c-mensaje" required></textarea>
        </div>
        <div id="captcha-comentario">${GestoUI.captchaHTML()}</div>
        <p><button type="submit" class="btn btn-primary">Publicar opinión</button></p>
      </form>
      <div id="lista-comentarios"></div>
    </section>

    <section class="card" id="seccion-chat">
      <h2>Chat con ${GestoStorage.escapeHTML(bar.nombre)}</h2>
      <p class="muted">Escribe al bar para consultar disponibilidad, hacer una petición especial o cualquier duda antes de tu visita.</p>
      <ul id="chat-messages"></ul>
      <form id="chat-form">
        <input type="text" id="chat-input" placeholder="Escribe tu mensaje…" required>
        <button type="submit" class="btn btn-primary">Enviar</button>
      </form>
    </section>
  `;

  // ----- Valoración media -----
  document.getElementById("valoracion-media").innerHTML = GestoUI.estrellas(GestoStorage.valoracionMedia(bar.id));

  // ----- Favorito -----
  document.getElementById("btn-favorito").addEventListener("click", (e) => {
    const activo = GestoStorage.toggleFavorito(bar.id);
    e.target.textContent = activo ? "❤️ En favoritos" : "🤍 Añadir a favoritos";
  });

  // ----- Mapa -----
  try {
    GestoMap.crearMapaBar("mapa-bar", bar);
  } catch (e) {
    console.warn("No se pudo cargar el mapa (Leaflet/OpenStreetMap no disponible):", e);
    document.getElementById("mapa-bar").outerHTML = `<p class="muted">Mapa no disponible en este momento. Consulta la dirección arriba.</p>`;
  }
  document.getElementById("link-como-llegar").href = GestoMap.enlaceComoLlegar(bar);

  // ----- Reserva -----
  const formReserva = document.getElementById("form-reserva");
  document.getElementById("r-fecha").min = new Date().toISOString().slice(0, 10);

  formReserva.addEventListener("submit", (e) => {
    e.preventDefault();
    const datos = {
      barId: bar.id,
      barNombre: bar.nombre,
      nombre: document.getElementById("r-nombre").value,
      email: document.getElementById("r-email").value,
      fecha: document.getElementById("r-fecha").value,
      hora: document.getElementById("r-hora").value,
      ubicacion: document.getElementById("r-ubicacion").value,
      mesas: document.getElementById("r-mesas").value,
      sillas: document.getElementById("r-sillas").value,
    };
    const resultado = GestoStorage.crearReserva(datos);
    const contenedor = document.getElementById("reserva-mensaje");
    if (!resultado.ok) {
      contenedor.innerHTML = `<div class="mensaje error">${resultado.errores.map(GestoStorage.escapeHTML).join("<br>")}</div>`;
      return;
    }
    const perfil = GestoStorage.getPerfil();
    if (!perfil.email) GestoStorage.guardarPerfil(Object.assign(perfil, { nombre: datos.nombre, email: datos.email }));

    const asunto = encodeURIComponent(`Confirmación de tu reserva en ${bar.nombre}`);
    const cuerpo = encodeURIComponent(
      `Hola ${datos.nombre},\n\nTu reserva ha sido confirmada:\n` +
      `Bar: ${bar.nombre}\nFecha: ${datos.fecha}\nHora: ${datos.hora}\nUbicación: ${datos.ubicacion}\n` +
      `Mesas: ${datos.mesas}\nSillas: ${datos.sillas}\n\n¡Te esperamos!\nGestoBares`
    );
    contenedor.innerHTML = `
      <div class="mensaje ok">
        ✅ Reserva confirmada para el ${datos.fecha} a las ${datos.hora}.
        Puedes gestionarla en <a href="reservas.html">Mis reservas</a>.<br>
        <a href="mailto:${datos.email}?subject=${asunto}&body=${cuerpo}">✉️ Enviarme el correo de confirmación</a>
      </div>`;
    formReserva.reset();
    document.getElementById("r-fecha").min = new Date().toISOString().slice(0, 10);
    GestoUI.showToast("Reserva confirmada en " + bar.nombre);
    GestoUI.pedirPermisoNotificaciones();
  });

  // ----- Foro -----
  const captchaBox = document.querySelector("#captcha-comentario .captcha-box");
  GestoUI.generarCaptcha(captchaBox);
  GestoUI.activarSelectorEstrellas(document.getElementById("form-comentario"));

  function pintarComentarios() {
    const comentarios = GestoStorage.getComentarios(bar.id).sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    const cont = document.getElementById("lista-comentarios");
    if (!comentarios.length) {
      cont.innerHTML = `<p class="muted">Todavía no hay opiniones. ¡Sé el primero en comentar!</p>`;
      return;
    }
    cont.innerHTML = comentarios.map(c => `
      <div class="comentario">
        <div class="comentario__cabecera">
          <strong>${GestoStorage.escapeHTML(c.nombre)}</strong>
          <span>${GestoStorage.formatFecha(c.fecha)}</span>
        </div>
        ${c.valoracion ? GestoUI.estrellas(c.valoracion) : ""}
        <p>${GestoStorage.escapeHTML(c.mensaje)}</p>
      </div>`).join("");
  }
  pintarComentarios();

  document.getElementById("form-comentario").addEventListener("submit", (e) => {
    e.preventDefault();
    const respuesta = parseInt(captchaBox.querySelector(".captcha-respuesta").value, 10);
    const datos = {
      barId: bar.id,
      nombre: document.getElementById("c-nombre").value,
      email: document.getElementById("c-email").value,
      mensaje: document.getElementById("c-mensaje").value,
      valoracion: document.querySelector('input[name="c-valoracion"]').value,
      honeypot: document.querySelector("#form-comentario .campo-honeypot").value,
      captchaOk: respuesta === parseInt(captchaBox.dataset.solucion, 10),
    };
    const resultado = GestoStorage.crearComentario(datos);
    const contenedor = document.getElementById("foro-mensaje");
    if (!resultado.ok) {
      contenedor.innerHTML = `<div class="mensaje error">${resultado.errores.map(GestoStorage.escapeHTML).join("<br>")}</div>`;
      GestoUI.generarCaptcha(captchaBox);
      return;
    }
    contenedor.innerHTML = `<div class="mensaje ok">Gracias por tu opinión, ¡ya está publicada!</div>`;
    e.target.reset();
    GestoUI.generarCaptcha(captchaBox);
    document.getElementById("valoracion-media").innerHTML = GestoUI.estrellas(GestoStorage.valoracionMedia(bar.id));
    pintarComentarios();
  });

  // ----- Chat -----
  const chatMessages = document.getElementById("chat-messages");
  function pintarChat() {
    const chat = GestoStorage.getChat(bar.id);
    chatMessages.innerHTML = chat.map(m => `
      <li><div class="mensaje-chat">${GestoStorage.escapeHTML(m.mensaje)}<span class="autor">${GestoStorage.escapeHTML(m.nombre)} · ${GestoStorage.formatFecha(m.fecha)}</span></div></li>
    `).join("");
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  pintarChat();

  document.getElementById("chat-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("chat-input");
    const perfil = GestoStorage.getPerfil();
    GestoStorage.enviarMensajeChat(bar.id, perfil.nombre || "Tú", input.value);
    input.value = "";
    pintarChat();
  });
});

/**
 * GestoBares · Perfil de usuario
 * Datos básicos, bares favoritos y preferencias de notificación.
 * (Personalización de perfiles y funcionalidad de pago se identifican en la
 * memoria del proyecto como mejoras futuras; aquí se implementa una primera
 * versión ligera de perfil y favoritos que no requiere backend ni pagos.)
 */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-perfil");
  const perfil = GestoStorage.getPerfil();

  document.getElementById("p-nombre").value = perfil.nombre || "";
  document.getElementById("p-email").value = perfil.email || "";
  document.getElementById("p-notif-email").checked = !!perfil.notifEmail;
  document.getElementById("p-notif-push").checked = !!perfil.notifPush;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nuevo = Object.assign({}, perfil, {
      nombre: document.getElementById("p-nombre").value.trim(),
      email: document.getElementById("p-email").value.trim(),
      notifEmail: document.getElementById("p-notif-email").checked,
      notifPush: document.getElementById("p-notif-push").checked,
    });
    if (nuevo.notifPush) {
      const permiso = await GestoUI.pedirPermisoNotificaciones();
      if (permiso !== "granted") {
        nuevo.notifPush = false;
        document.getElementById("p-notif-push").checked = false;
        GestoUI.showToast("El navegador no ha concedido permiso para notificaciones.", "error");
      }
    }
    GestoStorage.guardarPerfil(nuevo);
    GestoUI.showToast("Perfil guardado.");
  });

  function pintarFavoritos() {
    const cont = document.getElementById("lista-favoritos");
    const favoritos = GestoStorage.getPerfil().favoritos.map(id => BARES.find(b => b.id === id)).filter(Boolean);
    if (!favoritos.length) {
      cont.innerHTML = `<p class="muted">Aún no has marcado ningún bar como favorito. Ve al <a href="index.html">listado de bares</a> y pulsa el corazón 🤍.</p>`;
      return;
    }
    cont.innerHTML = favoritos.map(b => `
      <div class="bar-card">
        <div class="bar-card__media">${b.imagenTexto}</div>
        <div class="bar-card__body">
          <h3>${GestoStorage.escapeHTML(b.nombre)}</h3>
          <p class="bar-card__meta">${GestoStorage.escapeHTML(b.zona)}</p>
        </div>
        <div class="bar-card__actions">
          <a href="bar.html?id=${b.id}" class="btn btn-primary btn-block">Ver ficha</a>
        </div>
      </div>`).join("");
  }
  pintarFavoritos();

  const emailReservas = document.getElementById("resumen-reservas");
  function pintarResumen() {
    if (!perfil.email) { emailReservas.innerHTML = `<p class="muted">Guarda tu correo para ver aquí un resumen de tus reservas.</p>`; return; }
    const reservas = GestoStorage.getReservasDeEmail(perfil.email);
    const activas = reservas.filter(r => r.estado === "confirmada").length;
    emailReservas.innerHTML = `<p>Tienes <strong>${activas}</strong> reserva(s) activa(s). <a href="reservas.html">Ver todas →</a></p>`;
  }
  pintarResumen();
});

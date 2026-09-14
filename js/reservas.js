/**
 * GestoBares · Gestión de reservas ("Mis reservas")
 * Como la app no tiene sistema de login real, se localizan las reservas de
 * una persona por su correo electrónico (el mismo que usó al reservar).
 */
document.addEventListener("DOMContentLoaded", () => {
  const inputEmail = document.getElementById("buscar-email");
  const lista = document.getElementById("lista-reservas");
  const perfil = GestoStorage.getPerfil();
  if (perfil.email) inputEmail.value = perfil.email;

  function nombreBar(id) {
    const b = BARES.find(x => x.id === id);
    return b ? b.nombre : id;
  }

  function pintar() {
    const email = inputEmail.value.trim();
    if (!email) {
      lista.innerHTML = `<p class="muted">Escribe el correo con el que reservaste para ver y gestionar tus reservas.</p>`;
      return;
    }
    const reservas = GestoStorage.getReservasDeEmail(email).sort((a, b) => new Date(b.creado) - new Date(a.creado));
    if (!reservas.length) {
      lista.innerHTML = `<p class="muted">No hay reservas asociadas a ese correo.</p>`;
      return;
    }
    lista.innerHTML = reservas.map(r => `
      <div class="reserva-card ${r.estado === "cancelada" ? "cancelada" : ""}" data-id="${r.id}">
        <div class="reserva-card__info">
          <h3 style="margin:0 0 4px;">${GestoStorage.escapeHTML(r.barNombre || nombreBar(r.barId))} <span class="estado-badge ${r.estado}">${r.estado}</span></h3>
          <p>📅 ${r.fecha} · 🕒 ${r.hora} · ${r.ubicacion === "terraza" ? "Terraza" : "Interior"}</p>
          <p>🍽️ ${r.mesas} mesa(s) · 🪑 ${r.sillas} silla(s)</p>
        </div>
        <div class="reserva-card__acciones">
          ${r.estado === "confirmada" ? `
            <button class="btn btn-outline" data-editar="${r.id}">Modificar</button>
            <button class="btn btn-secondary" data-cancelar="${r.id}">Cancelar</button>
          ` : `<a href="bar.html?id=${r.barId}" class="btn btn-outline">Volver a reservar</a>`}
        </div>
      </div>
    `).join("");

    lista.querySelectorAll("[data-cancelar]").forEach(btn => btn.addEventListener("click", () => {
      if (confirm("¿Seguro que quieres cancelar esta reserva?")) {
        GestoStorage.cancelarReserva(btn.dataset.cancelar);
        GestoUI.showToast("Reserva cancelada.");
        pintar();
      }
    }));

    lista.querySelectorAll("[data-editar]").forEach(btn => btn.addEventListener("click", () => {
      abrirEdicion(btn.dataset.editar, reservas.find(r => r.id === btn.dataset.editar));
    }));
  }

  function abrirEdicion(id, reserva) {
    const card = lista.querySelector(`[data-id="${id}"]`);
    card.querySelector(".reserva-card__info").innerHTML = `
      <h3 style="margin:0 0 8px;">${GestoStorage.escapeHTML(reserva.barNombre)}</h3>
      <div class="form-grid">
        <div class="campo"><label>Fecha</label><input type="date" value="${reserva.fecha}" id="edit-fecha-${id}"></div>
        <div class="campo"><label>Hora</label><input type="time" value="${reserva.hora}" id="edit-hora-${id}"></div>
        <div class="campo"><label>Mesas</label><input type="number" min="1" value="${reserva.mesas}" id="edit-mesas-${id}"></div>
        <div class="campo"><label>Sillas</label><input type="number" min="1" value="${reserva.sillas}" id="edit-sillas-${id}"></div>
      </div>`;
    card.querySelector(".reserva-card__acciones").innerHTML = `<button class="btn btn-primary" id="guardar-${id}">Guardar cambios</button>`;
    document.getElementById(`guardar-${id}`).addEventListener("click", () => {
      const cambios = {
        fecha: document.getElementById(`edit-fecha-${id}`).value,
        hora: document.getElementById(`edit-hora-${id}`).value,
        mesas: parseInt(document.getElementById(`edit-mesas-${id}`).value, 10),
        sillas: parseInt(document.getElementById(`edit-sillas-${id}`).value, 10),
      };
      GestoStorage.modificarReserva(id, cambios);
      GestoUI.showToast("Reserva actualizada.");
      pintar();
    });
  }

  inputEmail.addEventListener("input", pintar);
  pintar();
});

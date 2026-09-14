/**
 * GestoBares · Capa de persistencia
 * ----------------------------------
 * GestoBares se publica como sitio estático en GitHub Pages (jaimeferrer.github.io),
 * por lo que no dispone de un servidor propio ni de una base de datos MySQL real.
 * Para poder ofrecer igualmente reservas, foro, chat y perfil "de verdad" (que
 * se guardan, se pueden modificar y sobreviven a recargar la página), esta capa
 * simula el backend descrito en la memoria del proyecto usando `localStorage`
 * como almacén de datos, con la misma forma de "tablas" (reservas, comentarios,
 * mensajes, perfil) que tendría una base de datos relacional.
 *
 * Si en el futuro se despliega un backend real (Node/PHP + MySQL, tal y como
 * se planteaba en el documento del proyecto), basta con sustituir las
 * funciones de este fichero por llamadas `fetch()` a la API REST correspondiente:
 * el resto de la aplicación solo conoce estas funciones, nunca `localStorage`
 * directamente.
 */
const GestoStorage = (() => {
  const KEYS = {
    RESERVAS: "gestobares_reservas",
    COMENTARIOS: "gestobares_comentarios",
    CHAT: "gestobares_chat_",
    PERFIL: "gestobares_perfil",
  };

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function leer(clave, porDefecto) {
    try {
      const raw = localStorage.getItem(clave);
      return raw ? JSON.parse(raw) : porDefecto;
    } catch (e) {
      console.warn("GestoStorage: no se pudo leer", clave, e);
      return porDefecto;
    }
  }

  function escribir(clave, valor) {
    try {
      localStorage.setItem(clave, JSON.stringify(valor));
      return true;
    } catch (e) {
      console.warn("GestoStorage: no se pudo escribir", clave, e);
      return false;
    }
  }

  // ---------- Utilidades comunes ----------

  function escapeHTML(texto) {
    const div = document.createElement("div");
    div.textContent = texto == null ? "" : String(texto);
    return div.innerHTML;
  }

  function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
  }

  function formatFecha(iso) {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" }) +
        " " + d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
    } catch (e) {
      return iso;
    }
  }

  // ---------- Reservas ----------

  function getReservas() {
    return leer(KEYS.RESERVAS, []);
  }

  function getReservasDeBar(barId) {
    return getReservas().filter(r => r.barId === barId);
  }

  function getReservasDeEmail(email) {
    const e = String(email).trim().toLowerCase();
    return getReservas().filter(r => r.email.toLowerCase() === e);
  }

  /**
   * Crea una reserva tras validar los campos obligatorios que exige la
   * memoria del proyecto: nombre, correo, fecha, hora, ubicación, mesas y sillas.
   * Devuelve { ok: true, reserva } o { ok: false, errores: [...] }.
   */
  function crearReserva(datos) {
    const errores = [];
    if (!datos.nombre || !datos.nombre.trim()) errores.push("El nombre es obligatorio.");
    if (!validarEmail(datos.email)) errores.push("El correo electrónico no es válido.");
    if (!datos.fecha) errores.push("La fecha es obligatoria.");
    else if (new Date(datos.fecha) < new Date(new Date().toDateString())) {
      errores.push("La fecha no puede ser anterior a hoy.");
    }
    if (!datos.hora) errores.push("La hora es obligatoria.");
    if (!datos.ubicacion) errores.push("Selecciona interior o terraza.");
    const mesas = parseInt(datos.mesas, 10);
    const sillas = parseInt(datos.sillas, 10);
    if (!mesas || mesas < 1) errores.push("Indica un número de mesas válido.");
    if (!sillas || sillas < 1) errores.push("Indica un número de sillas válido.");

    if (errores.length) return { ok: false, errores };

    const reserva = {
      id: uid(),
      barId: datos.barId,
      barNombre: datos.barNombre || "",
      nombre: datos.nombre.trim(),
      email: datos.email.trim(),
      fecha: datos.fecha,
      hora: datos.hora,
      ubicacion: datos.ubicacion,
      mesas, sillas,
      estado: "confirmada",
      creado: new Date().toISOString(),
    };
    const todas = getReservas();
    todas.push(reserva);
    escribir(KEYS.RESERVAS, todas);
    registrarNotificacion(reserva, "confirmacion");
    return { ok: true, reserva };
  }

  function modificarReserva(id, cambios) {
    const todas = getReservas();
    const idx = todas.findIndex(r => r.id === id);
    if (idx === -1) return { ok: false, errores: ["La reserva no existe."] };
    todas[idx] = Object.assign({}, todas[idx], cambios);
    escribir(KEYS.RESERVAS, todas);
    registrarNotificacion(todas[idx], "cambio");
    return { ok: true, reserva: todas[idx] };
  }

  function cancelarReserva(id) {
    const todas = getReservas();
    const idx = todas.findIndex(r => r.id === id);
    if (idx === -1) return false;
    todas[idx].estado = "cancelada";
    escribir(KEYS.RESERVAS, todas);
    registrarNotificacion(todas[idx], "cancelacion");
    return true;
  }

  // ---------- Notificaciones ----------
  // Registro simple de "avisos" (confirmación / cambio / cancelación / recordatorio).
  // Simula el correo/SMS de la memoria del proyecto: como no hay servidor de
  // envío (SMTP/Twilio), se muestran como notificaciones dentro de la propia
  // app y, si el usuario lo permite, como notificaciones del navegador.

  function registrarNotificacion(reserva, tipo) {
    const perfil = getPerfil();
    if (perfil.notifPush && "Notification" in window && Notification.permission === "granted") {
      const textos = {
        confirmacion: `Reserva confirmada en ${reserva.barNombre} el ${reserva.fecha} a las ${reserva.hora}.`,
        cambio: `Tu reserva en ${reserva.barNombre} se ha actualizado.`,
        cancelacion: `Tu reserva en ${reserva.barNombre} ha sido cancelada.`,
        recordatorio: `Recuerda: tienes mesa en ${reserva.barNombre} el ${reserva.fecha} a las ${reserva.hora}.`,
      };
      try {
        new Notification("GestoBares", { body: textos[tipo] || "Actualización de tu reserva." });
      } catch (e) { /* algunos navegadores móviles no permiten new Notification() directo */ }
    }
  }

  /** Comprueba si hay reservas dentro de las próximas 24h y avisa una sola vez por reserva. */
  function comprobarRecordatorios() {
    const avisadas = leer("gestobares_recordatorios_enviados", []);
    const ahora = Date.now();
    getReservas().forEach(r => {
      if (r.estado !== "confirmada" || avisadas.includes(r.id)) return;
      const inicio = new Date(r.fecha + "T" + (r.hora || "00:00")).getTime();
      const diff = inicio - ahora;
      if (diff > 0 && diff < 24 * 60 * 60 * 1000) {
        registrarNotificacion(r, "recordatorio");
        avisadas.push(r.id);
      }
    });
    escribir("gestobares_recordatorios_enviados", avisadas);
  }

  // ---------- Foro / comentarios y valoraciones ----------

  function getComentarios(barId) {
    return leer(KEYS.COMENTARIOS, []).filter(c => c.barId === barId);
  }

  /**
   * Publica un comentario. `honeypot` debe llegar vacío y `captchaOk` a true:
   * es la medida antispam ligera que sustituye a un CAPTCHA con servidor
   * (reCAPTCHA, etc.) en una web sin backend.
   */
  function crearComentario(datos) {
    const errores = [];
    if (!datos.nombre || !datos.nombre.trim()) errores.push("El nombre es obligatorio.");
    if (!validarEmail(datos.email)) errores.push("El correo electrónico no es válido.");
    if (!datos.mensaje || !datos.mensaje.trim()) errores.push("Escribe un mensaje.");
    if (datos.honeypot) errores.push("No se pudo verificar que eres una persona.");
    if (!datos.captchaOk) errores.push("Responde correctamente la comprobación anti-spam.");
    const valoracion = parseInt(datos.valoracion, 10) || 0;

    if (errores.length) return { ok: false, errores };

    const comentario = {
      id: uid(),
      barId: datos.barId,
      nombre: datos.nombre.trim(),
      email: datos.email.trim(),
      mensaje: datos.mensaje.trim(),
      valoracion,
      estado: "publicado", // sin moderador humano se publica tras pasar el filtro antispam
      fecha: new Date().toISOString(),
    };
    const todos = leer(KEYS.COMENTARIOS, []);
    todos.push(comentario);
    escribir(KEYS.COMENTARIOS, todos);
    return { ok: true, comentario };
  }

  function valoracionMedia(barId) {
    const comentarios = getComentarios(barId).filter(c => c.valoracion > 0);
    if (!comentarios.length) return null;
    const suma = comentarios.reduce((acc, c) => acc + c.valoracion, 0);
    return Math.round((suma / comentarios.length) * 10) / 10;
  }

  // ---------- Chat por bar ----------
  // Chat de demostración: cada navegador guarda su propia conversación con el
  // bar (no hay servidor con websockets para tiempo real multiusuario; queda
  // documentado como mejora futura en el README).

  function getChat(barId) {
    return leer(KEYS.CHAT + barId, []);
  }

  function enviarMensajeChat(barId, nombre, mensaje) {
    if (!mensaje || !mensaje.trim()) return null;
    const msg = { nombre: nombre || "Tú", mensaje: mensaje.trim(), fecha: new Date().toISOString() };
    const chat = getChat(barId);
    chat.push(msg);
    escribir(KEYS.CHAT + barId, chat);
    return msg;
  }

  // ---------- Perfil y preferencias ----------

  function getPerfil() {
    return leer(KEYS.PERFIL, { nombre: "", email: "", favoritos: [], notifEmail: true, notifPush: false });
  }

  function guardarPerfil(perfil) {
    escribir(KEYS.PERFIL, perfil);
    return perfil;
  }

  function toggleFavorito(barId) {
    const perfil = getPerfil();
    const i = perfil.favoritos.indexOf(barId);
    if (i === -1) perfil.favoritos.push(barId); else perfil.favoritos.splice(i, 1);
    guardarPerfil(perfil);
    return perfil.favoritos.includes(barId);
  }

  function esFavorito(barId) {
    return getPerfil().favoritos.includes(barId);
  }

  return {
    uid, escapeHTML, validarEmail, formatFecha,
    getReservas, getReservasDeBar, getReservasDeEmail, crearReserva, modificarReserva, cancelarReserva,
    comprobarRecordatorios,
    getComentarios, crearComentario, valoracionMedia,
    getChat, enviarMensajeChat,
    getPerfil, guardarPerfil, toggleFavorito, esFavorito,
  };
})();

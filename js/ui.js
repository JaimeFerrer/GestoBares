/**
 * GestoBares · Utilidades de interfaz compartidas
 * Cabecera/pie comunes, aviso "toast", estrellas de valoración y una
 * comprobación anti-spam ligera (pregunta matemática) que sustituye a un
 * CAPTCHA con servidor en las páginas de foro y reservas.
 */
const GestoUI = (() => {
  const paginas = [
    { href: "index.html", texto: "Bares" },
    { href: "index.html#mapa", texto: "Mapa" },
    { href: "reservas.html", texto: "Mis reservas" },
    { href: "perfil.html", texto: "Perfil" },
  ];

  function renderHeader(activo) {
    const links = paginas.map(p => {
      const esActivo = p.href.split("#")[0] === activo ? " active" : "";
      return `<li class="nav-item"><a href="${p.href}" class="nav-link${esActivo}">${p.texto}</a></li>`;
    }).join("");
    return `
      <header class="header">
        <a href="index.html" class="logo">🍻 GestoBares</a>
        <nav class="nav"><ul class="nav-list">${links}</ul></nav>
      </header>`;
  }

  function renderFooter() {
    const anio = new Date().getFullYear();
    return `
      <footer class="footer">
        <p>&copy; ${anio} GestoBares — Gestión de reservas y comunidad de bares de Huesca. Proyecto de Jaime Ferrer Ferrer.</p>
      </footer>`;
  }

  function montarLayout(activo) {
    document.addEventListener("DOMContentLoaded", () => {
      const h = document.getElementById("app-header");
      const f = document.getElementById("app-footer");
      if (h) h.outerHTML = renderHeader(activo);
      if (f) f.outerHTML = renderFooter();
    });
  }

  function showToast(mensaje, tipo) {
    const div = document.createElement("div");
    div.className = "toast";
    if (tipo === "error") div.style.background = "#8f2c2c";
    div.textContent = mensaje;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 4500);
  }

  function estrellas(valor) {
    if (!valor) return `<span class="rating muted">Sin valoraciones aún</span>`;
    const llenas = Math.round(valor);
    return `<span class="rating">${"★".repeat(llenas)}${"☆".repeat(5 - llenas)} (${valor})</span>`;
  }

  function selectorEstrellas(nombreCampo) {
    let html = `<div class="campo"><label>Tu valoración</label><div class="estrellas-input" data-campo="${nombreCampo}">`;
    for (let i = 1; i <= 5; i++) {
      html += `<button type="button" class="estrella-btn" data-valor="${i}" aria-label="${i} estrellas" style="font-size:1.3rem;background:none;border:none;cursor:pointer;color:#ccc;">★</button>`;
    }
    html += `<input type="hidden" name="${nombreCampo}" value="0"></div></div>`;
    return html;
  }

  function activarSelectorEstrellas(contenedor) {
    const wrap = contenedor.querySelector(".estrellas-input");
    if (!wrap) return;
    const input = wrap.querySelector("input[type=hidden]");
    const botones = [...wrap.querySelectorAll(".estrella-btn")];
    function pintar(valor) {
      botones.forEach(b => b.style.color = parseInt(b.dataset.valor, 10) <= valor ? "#b8860b" : "#ccc");
    }
    botones.forEach(b => b.addEventListener("click", () => {
      input.value = b.dataset.valor;
      pintar(parseInt(b.dataset.valor, 10));
    }));
  }

  /** Genera una pregunta matemática sencilla como comprobación anti-spam sin servidor. */
  function generarCaptcha(contenedor) {
    const a = 1 + Math.floor(Math.random() * 8);
    const b = 1 + Math.floor(Math.random() * 8);
    contenedor.dataset.solucion = a + b;
    contenedor.querySelector(".captcha-pregunta").textContent = `¿Cuánto es ${a} + ${b}?`;
    contenedor.querySelector(".captcha-respuesta").value = "";
  }

  function captchaHTML() {
    return `
      <div class="campo captcha-box">
        <label>Comprobación anti-spam</label>
        <p class="captcha-pregunta muted" style="margin:2px 0 6px;"></p>
        <input type="text" class="captcha-respuesta" inputmode="numeric" placeholder="Escribe el resultado" required>
      </div>
      <div class="honeypot" aria-hidden="true">
        <label>No rellenar este campo</label>
        <input type="text" class="campo-honeypot" tabindex="-1" autocomplete="off">
      </div>`;
  }

  function pedirPermisoNotificaciones() {
    if (!("Notification" in window)) return Promise.resolve("unsupported");
    if (Notification.permission === "granted") return Promise.resolve("granted");
    return Notification.requestPermission();
  }

  return {
    renderHeader, renderFooter, montarLayout, showToast,
    estrellas, selectorEstrellas, activarSelectorEstrellas,
    generarCaptcha, captchaHTML, pedirPermisoNotificaciones,
  };
})();

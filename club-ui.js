/* =========================================================
   Club DRINKA · utilidades compartidas (tarjeta y panel)
   ========================================================= */
(function () {
  const C = window.CLUB;

  // Íconos
  document.body.insertAdjacentHTML("afterbegin", `<svg class="sprite" aria-hidden="true">
    <symbol id="i-cup" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5.5 8.5h13"/><path d="M6.5 8.5l1.3 11a2 2 0 0 0 2 1.7h4.4a2 2 0 0 0 2-1.7l1.3-11"/><path d="M14.5 8.5 16 2.5"/></g><g fill="currentColor"><circle cx="10" cy="17" r="1.1"/><circle cx="13.6" cy="16.4" r="1.1"/><circle cx="11.8" cy="19" r="1"/><circle cx="14.4" cy="18.8" r=".8"/></g></symbol>
    <symbol id="i-gift" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 0 1 0 5"/></g></symbol>
    <symbol id="i-left" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="m15 18-6-6 6-6"/></symbol>
    <symbol id="i-plus" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" d="M12 5v14M5 12h14"/></symbol>
    <symbol id="i-minus" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" d="M5 12h14"/></symbol>
    <symbol id="i-flip" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 15.5-6.2L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.5 6.2L3 16"/><path d="M3 21v-5h5"/></g></symbol>
    <symbol id="i-out" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/></g></symbol>
    <symbol id="i-search" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></g></symbol>
    <symbol id="i-key" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.5" cy="15.5" r="4.5"/><path d="m10.7 12.3 9.3-9.3M17 6l3 3M14 9l2 2"/></g></symbol>
    <symbol id="i-wa" viewBox="0 0 24 24"><path fill="currentColor" d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5.3-.5v-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5 2.5 1 3 .8 3.6.7.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4l-.6-.4zM12 21.8a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1 1 12 21.8zM20.5 3.5A11.8 11.8 0 0 0 1.9 17.7L.2 24l6.4-1.7A11.8 11.8 0 0 0 20.5 3.5z"/></symbol>
  </svg>`);

  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const icon = id => `<svg><use href="#i-${id}"/></svg>`;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  function stampsHTML(sellos, nuevo = 0) {
    let html = "";
    for (let i = 1; i <= C.total; i++) {
      const p = C.premios[i];
      const on = i <= sellos;
      const marca = p ? (p.icono ? icon(p.icono) : esc(p.corto)) : "";
      const ink = on ? `<span class="stamp__ink" style="--r:${((i * 37) % 24) - 12}deg">${p ? marca : icon("cup")}</span>` : "";
      html += `<span class="stamp${p ? " stamp--prize" : ""}${i === nuevo ? " is-new" : ""}">${marca}${ink}</span>`;
    }
    return html;
  }

  function siguiente(sellos) {
    const n = Object.keys(C.premios).map(Number).sort((a, b) => a - b).find(k => k > sellos);
    return n ? { n, falta: n - sellos, premio: C.premios[n] } : null;
  }

  let toastT;
  function toast(msg, ms = 3000) {
    let t = document.getElementById("toast");
    if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; t.setAttribute("role", "status"); document.body.append(t); }
    t.textContent = msg; t.classList.add("is-on");
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("is-on"), ms);
  }

  function confetti(el) {
    if (reduce) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const colores = ["#2a1a12", "#D1E7CF", "#B2DAED", "#98B3E0", "#F4C24F", "#A88FE0"];
    for (let i = 0; i < 40; i++) {
      const d = document.createElement("span");
      d.className = "confetti";
      const s = 8 + Math.random() * 12;
      Object.assign(d.style, { left: `${cx}px`, top: `${cy}px`, width: `${s}px`, height: `${s}px`, background: colores[i % colores.length] });
      document.body.append(d);
      const a = Math.random() * Math.PI * 2, v = 140 + Math.random() * 240;
      d.animate([
        { transform: "translate(-50%,-50%) scale(.4)", opacity: 1 },
        { transform: `translate(${Math.cos(a) * v}px, ${Math.sin(a) * v - 40}px) scale(1)`, opacity: 1, offset: .6 },
        { transform: `translate(${Math.cos(a) * v * 1.1}px, ${Math.sin(a) * v + 160}px) scale(.8)`, opacity: 0 },
      ], { duration: 1500 + Math.random() * 500, easing: "cubic-bezier(.2,.7,.3,1)" }).finished.then(() => d.remove());
    }
  }

  // Conexión con la base de datos
  let sb = null;
  function db(opciones) {
    if (!C.listo || !window.supabase) return null;
    if (!sb) sb = window.supabase.createClient(C.supabaseUrl, C.supabaseKey, opciones);
    return sb;
  }
  async function rpc(nombre, args) {
    const cliente = db();
    if (!cliente) return { error: "config" };
    try {
      const { data, error } = await cliente.rpc(nombre, args);
      if (error) return { error: error.message.includes("permission") ? "no_autorizado" : "red", detalle: error.message };
      return data || {};
    } catch (e) {
      return { error: "red", detalle: String(e) };
    }
  }

  const fecha = iso => new Date(iso).toLocaleDateString("es-EC", { month: "short", year: "numeric" }).replace(".", "");

  window.CLUBUI = { esc, icon, stampsHTML, siguiente, toast, confetti, db, rpc, fecha, reduce };
})();

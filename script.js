/* =========================================================
   DRINKA by Kai Bobba · sitio web
   ========================================================= */

/* =========================================================
   ✏️  EDITA AQUÍ: datos del negocio y menú
   ========================================================= */
const DRINKA = {
  nombre: "DRINKA by Kai Bobba",
  whatsappEnlace: "https://wa.me/message/SKFIZFLHBJT5J1",
  whatsapp: "593961087609",               // sin "+" ni espacios (para enviar el pedido escrito)
  instagram: "https://www.instagram.com/drinka.ec/",
  tiktok: "https://www.tiktok.com/@drinka.ec",
  mapa: "https://maps.google.com/?q=-2.138061,-79.593803",
  direccion: "Milagro, Ecuador",
  zonaHoraria: "America/Guayaquil",
  horario: {                              // 24 h. null = cerrado
    lunes: null,
    martes: ["14:00", "21:00"],
    miercoles: ["14:00", "21:00"],
    jueves: ["14:00", "21:00"],
    viernes: ["14:00", "21:00"],
    sabado: ["14:00", "21:00"],
    domingo: ["14:00", "21:00"],
  },
};

// color = color de la categoría (franjas del menú) · on = texto sobre ese color
// vivo = color de la tarjeta destacada sobre fondo azul marino
// hero = colores del fondo grande cuando ese sabor está activo
// foto = nombre del archivo en PNG/ y assets/vasos/
const MENU = [
  {
    id: "matcha", nombre: "Matcha", palabra: "matcha", color: "#6F8A3A", on: "#FFFFFF", vivo: "#A9C874",
    lema: "Verde, cremoso y suave.",
    hero: { bg: "#8DB34A", deep: "#4F6B22", cta1: "#D2F57A", cta2: "#A4DA4C" },
    bebidas: [
      { nombre: "Matcha Latte", precio: 3.00, favorito: true, foto: "matcha-latte", sup: "latte",
        desc: "Matcha cremoso con leche y hielo. Suave, verde y perfecto para empezar tranquilo." },
      { nombre: "Matcha Strawberry", precio: 3.50, foto: "matcha-strawberry" },
      { nombre: "Matcha & Café", precio: 3.50, foto: "matcha-cafe" },
      { nombre: "Matcha Oreo", precio: 3.50, foto: "matcha-oreo" },
      { nombre: "Matcha & Taro", precio: 4.50, foto: "matcha-taro" },
    ],
  },
  {
    id: "taro", nombre: "Taro", palabra: "taro", color: "#9E86D6", on: "#2B1D4D", vivo: "#A88FE0",
    lema: "Dulce, cremoso y bien morado.",
    hero: { bg: "#A68BE3", deep: "#5B3FA6", cta1: "#F1EAFF", cta2: "#CDB9FF" },
    bebidas: [
      { nombre: "Taro Latte", precio: 3.00, favorito: true, foto: "taro-latte", sup: "latte",
        desc: "Dulce, cremoso y con ese color morado que enamora desde el primer sorbo." },
      { nombre: "Taro & Matcha", precio: 4.50, foto: "taro-matcha" },
      { nombre: "Taro & Café", precio: 3.50, foto: "taro-cafe" },
      { nombre: "Taro & Chocolate", precio: 3.50, foto: "taro-chocolate" },
    ],
  },
  {
    id: "tes", nombre: "Tés", palabra: "té", color: "#EE8A34", on: "#1F2A4D", vivo: "#EE8A34",
    lema: "Fríos, ligeros y refrescantes.",
    hero: { bg: "#EE8A34", deep: "#A9501A", cta1: "#FFE1A8", cta2: "#F4C24F" },
    bebidas: [
      { nombre: "Drinka Tea", precio: 2.00, favorito: true, foto: "drinka-tea", sup: "drinka",
        desc: "Nuestro té de la casa: frío, refrescante y con un toque cítrico." },
      { nombre: "Té Negro", precio: 2.00, foto: "te-negro" },
      { nombre: "Té de Jengibre", precio: 2.00, foto: "te-jengibre" },
      { nombre: "Flor de Jamaica", precio: 2.00, foto: "flor-jamaica" },
    ],
  },
  {
    id: "cafe", nombre: "Café", palabra: "café", color: "#1F2A4D", on: "#FBEBDD", vivo: "#B2DAED", banda: "#34437A",
    lema: "Para las tardes que piden energía.",
    hero: { bg: "#1F2A4D", deep: "#5A6CA8", cta1: "#D1E7CF", cta2: "#98B3E0" },
    bebidas: [
      { nombre: "Ice Latte", precio: 2.50, favorito: true, foto: "ice-latte", sup: "ice latte",
        desc: "Café con leche bien frío y en capas. Para las tardes que piden energía." },
      { nombre: "Caramel Latte", precio: 3.50, foto: "caramel-latte" },
      { nombre: "Mocca", precio: 3.50, foto: "mocca" },
      { nombre: "Capuchino", precio: 3.50, foto: "capuchino" },
      { nombre: "Café Americano", precio: 2.00, foto: "cafe-americano" },
    ],
  },
];
/* ========================================================= */


const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = matchMedia("(pointer: fine)").matches;
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const money = n => `$${n.toFixed(2)}`;
const pad = n => String(n).padStart(2, "0");
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const slug = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const big = b => `PNG/${b.foto}.png`;
const mini = b => `assets/vasos/${b.foto}-mini.webp`;
const waLink = text => `https://wa.me/${DRINKA.whatsapp}?text=${encodeURIComponent(text)}`;
const restart = (el, cls) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };

// Índice de bebidas
const ALL = [];
MENU.forEach(cat => cat.bebidas.forEach(b => {
  b.id = slug(`${cat.id}-${b.nombre}`);
  b.cat = cat;
  ALL.push(b);
}));
const byId = Object.fromEntries(ALL.map(b => [b.id, b]));
const FAVS = MENU.map(cat => cat.bebidas.find(b => b.favorito) || cat.bebidas[0]);

/* ---------- Enlaces y textos ---------- */
const LINKS = {
  whatsapp: DRINKA.whatsappEnlace,
  instagram: DRINKA.instagram,
  tiktok: DRINKA.tiktok,
  mapa: DRINKA.mapa,
};
$$("[data-link]").forEach(a => { if (LINKS[a.dataset.link]) a.href = LINKS[a.dataset.link]; });
$$("[data-text]").forEach(el => { if (DRINKA[el.dataset.text]) el.textContent = DRINKA[el.dataset.text]; });
$("#year").textContent = new Date().getFullYear();

/* ---------- Cintas ---------- */
$$("[data-words]").forEach(t => {
  const chunk = t.dataset.words.split("|").map(w => `<span>${esc(w)}</span><i></i>`).join("");
  t.innerHTML = chunk.repeat(t.dataset.words.includes("|") ? 4 : 6);
});

/* ---------- Partículas: perlas, burbujas y hielo ---------- */
function particles(box, list) {
  if (!box) return;
  box.innerHTML = list.map(p => `<span class="pt pt--${p.t}${p.blur ? " pt--blur" : ""}${p.desk ? " pt--desk" : ""}"
    style="--x:${p.x}%;--y:${p.y}%;--s:${p.s}px;--d:${p.d || .4};--t:${p.dur || 6}s;--dl:-${p.dl || 0}s;--r:${p.r || 0}deg"><i></i></span>`).join("");
}
particles($("#pts-back"), [
  { t: "pearl", x: 6, y: 62, s: 38, d: .5, dur: 5.5, dl: 1 },
  { t: "bubble", x: 14, y: 24, s: 26, d: .3, dur: 7 },
  { t: "ice", x: 86, y: 14, s: 56, d: .6, r: 14, dur: 6.5, dl: 2 },
  { t: "pearl", x: 79, y: 60, s: 22, d: .35, dur: 5, dl: 3, desk: true },
  { t: "bubble", x: 66, y: 8, s: 16, d: .2, dur: 8, desk: true },
  { t: "ice", x: 20, y: 46, s: 40, d: .45, r: -18, dur: 7, dl: 1.5, desk: true },
  { t: "pearl", x: 40, y: 10, s: 14, d: .25, dur: 6, desk: true },
]);
particles($("#pts-front"), [
  { t: "pearl", x: 27, y: 84, s: 78, d: 1.2, blur: true, dur: 6, dl: 2, desk: true },
  { t: "ice", x: 72, y: 72, s: 96, d: 1.4, r: 22, blur: true, dur: 7.5 },
  { t: "bubble", x: 55, y: 6, s: 34, d: 1, blur: true, dur: 6.5, dl: 3, desk: true },
]);
particles($("#pts-menu"), [
  { t: "pearl", x: 4, y: 6, s: 46, d: .3, blur: true, dur: 7 },
  { t: "bubble", x: 92, y: 3, s: 30, d: .2, dur: 6 },
  { t: "pearl", x: 94, y: 40, s: 22, d: .2, dur: 5.5, desk: true },
]);
particles($("#pts-favs"), [
  { t: "pearl", x: 30, y: 26, s: 40, d: .4, dur: 5.5 },
  { t: "ice", x: 64, y: 18, s: 64, d: .5, r: 16, dur: 7 },
  { t: "pearl", x: 66, y: 66, s: 26, d: .3, dur: 6, dl: 2 },
  { t: "pearl", x: 76, y: 78, s: 90, d: 1, blur: true, dur: 6.5, desk: true },
]);
particles($("#pts-final"), [
  { t: "pearl", x: 6, y: 14, s: 36, d: .3, dur: 6 },
  { t: "bubble", x: 46, y: 80, s: 26, d: .3, dur: 7 },
  { t: "pearl", x: 90, y: 86, s: 70, d: .5, blur: true, dur: 6.5 },
]);

/* =========================================================
   NAVEGACIÓN
   ========================================================= */
const nav = $("#nav");
const hero = $(".hero");
const burger = $("#burger");
const onScrollNav = () => nav.classList.toggle("nav--solid", scrollY > hero.offsetHeight - 90 || nav.classList.contains("is-open"));
addEventListener("scroll", onScrollNav, { passive: true });
onScrollNav();
const closeMenu = () => { nav.classList.remove("is-open"); burger.setAttribute("aria-expanded", "false"); onScrollNav(); };
burger.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  burger.setAttribute("aria-expanded", open);
  onScrollNav();
});
$$("#nav-links a").forEach(a => a.addEventListener("click", closeMenu));

// Enlace activo según la sección visible
const secIO = new IntersectionObserver(entries => entries.forEach(en => {
  if (!en.isIntersecting) return;
  $$("#nav-links a").forEach(a => a.classList.toggle("is-active", a.dataset.sec === en.target.id));
}), { rootMargin: "-45% 0px -50% 0px" });
["inicio", "menu", "nosotros", "favs", "delivery", "visitanos"].forEach(id => secIO.observe($(`#${id}`)));

/* =========================================================
   HERO: cambio de sabor
   ========================================================= */
const stage = $("#hero-stage");
const flavorsBox = $("#hero-flavors");
const bar = $("#hero-bar");
let current = 0;

FAVS.forEach(b => { const i = new Image(); i.src = big(b); });

flavorsBox.innerHTML = MENU.map((cat, i) => `
  <button type="button" class="flavor" role="tab" aria-selected="${i === 0}" aria-label="${esc(cat.nombre)}" data-i="${i}">
    <img src="${mini(FAVS[i])}" alt="">
    <span class="flavor__label">${esc(cat.nombre)}</span>
  </button>`).join("");

// Copia del título con letras de contorno: se ve "delante" del vaso
const ghost = document.createElement("div");
ghost.className = "hero__title hero__title--ghost";
ghost.setAttribute("aria-hidden", "true");
ghost.innerHTML = $("#hero-title").innerHTML;
$$("[id]", ghost).forEach(el => el.removeAttribute("id"));
stage.after(ghost);

const splitWord = text => [...text].map(ch => `<span class="ch">${esc(ch)}</span>`).join("");
const heroWords = $$(".hero__word");
heroWords.forEach(w => { w.innerHTML = splitWord(MENU[0].palabra); });

const animateLetters = (els, from, to, step) => Promise.all(els.map((el, k) => el.animate(
  [{ transform: from }, { transform: to }],
  { duration: 560, delay: k * step, easing: "cubic-bezier(.2,.75,.2,1)", fill: "forwards" }
).finished.catch(() => {})));

const setHeroCount = i => { $("#hero-count").innerHTML = `<b>${pad(i + 1)}</b> / ${pad(MENU.length)}`; };
setHeroCount(0);

async function setFlavor(i) {
  if (i === current) return;
  const cat = MENU[i];
  const fav = FAVS[i];
  current = i;

  hero.style.setProperty("--bg", cat.hero.bg);
  hero.style.setProperty("--deep", cat.hero.deep);
  hero.style.setProperty("--cta1", cat.hero.cta1);
  hero.style.setProperty("--cta2", cat.hero.cta2);
  $$(".flavor", flavorsBox).forEach((b, k) => b.setAttribute("aria-selected", k === i));
  $("#hero-name").textContent = fav.nombre;
  $("#hero-price").textContent = money(fav.precio);
  $("#hero-sup").textContent = fav.sup || "";
  setHeroCount(i);
  bar.style.animation = "none"; void bar.offsetWidth; bar.style.animation = "";

  // vaso
  const old = $(".hero__cup", stage);
  const cup = document.createElement("div");
  cup.className = "hero__cup is-in";
  cup.innerHTML = `<img src="${big(fav)}" alt="${esc(fav.nombre)}">`;
  if (reduceMotion) { old?.remove(); stage.append(cup); }
  else {
    old?.classList.add("is-out");
    setTimeout(() => old?.remove(), 700);
    setTimeout(() => stage.append(cup), 220);
    cup.addEventListener("animationend", e => { if (e.animationName === "cupIn") cup.classList.remove("is-in"); });
  }

  // palabra gigante (normal + contorno)
  if (reduceMotion) { heroWords.forEach(w => { w.innerHTML = splitWord(cat.palabra); }); return; }
  await Promise.all(heroWords.map(w => animateLetters($$(".ch", w), "translateY(0)", "translateY(-115%)", 30)));
  if (current !== i) return;
  heroWords.forEach(w => {
    w.innerHTML = splitWord(cat.palabra);
    animateLetters($$(".ch", w), "translateY(115%)", "translateY(0)", 45);
  });
}

// La barra de progreso marca el cambio automático (se pausa al pasar el mouse)
bar.addEventListener("animationend", () => { if (!reduceMotion) setFlavor((current + 1) % MENU.length); });
flavorsBox.addEventListener("click", e => {
  const btn = e.target.closest(".flavor");
  if (btn) setFlavor(+btn.dataset.i);
});
if (finePointer) {
  hero.addEventListener("pointerenter", () => hero.classList.add("is-paused"));
  hero.addEventListener("pointerleave", () => hero.classList.remove("is-paused"));
}

// Profundidad con el mouse
if (!reduceMotion && finePointer) {
  let raf = 0;
  hero.addEventListener("pointermove", e => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      const x = e.clientX / innerWidth - .5;
      const y = e.clientY / innerHeight - .5;
      hero.style.setProperty("--mx", x.toFixed(3));
      hero.style.setProperty("--my", y.toFixed(3));
      $$(".hero__cup", stage).forEach(c => {
        c.style.setProperty("--ry", `${x * 16}deg`);
        c.style.setProperty("--rx", `${-y * 10}deg`);
      });
      heroWords.forEach(w => { w.style.transform = `translate(${x * -18}px, ${y * -10}px)`; });
    });
  });
}

// Botón magnético
const cta = $("#hero-cta");
if (!reduceMotion && finePointer) {
  cta.addEventListener("pointermove", e => {
    const r = cta.getBoundingClientRect();
    cta.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .35}px, ${(e.clientY - r.top - r.height / 2) * .45}px) scale(1.06)`;
  });
  cta.addEventListener("pointerleave", () => { cta.style.transform = ""; });
}

/* =========================================================
   PEDIDO (estado)
   ========================================================= */
let cart = {};
try { cart = JSON.parse(localStorage.getItem("drinka-pedido")) || {}; } catch { cart = {}; }
Object.keys(cart).forEach(id => { if (!byId[id]) delete cart[id]; });

const qtyHTML = b => `
  <div class="qty" data-id="${b.id}" data-n="${cart[b.id] || 0}">
    <button type="button" class="qty__btn qty__minus" data-step="-1" aria-label="Quitar un ${esc(b.nombre)}">−</button>
    <span class="qty__n">${cart[b.id] || 0}</span>
    <button type="button" class="qty__btn qty__plus" data-step="1" aria-label="Agregar ${esc(b.nombre)}">+</button>
  </div>`;

/* =========================================================
   MENÚ: pestañas + carrusel
   ========================================================= */
const tabsBox = $("#tabs");
const pill = $("#tabs-pill");
const carousel = $("#carousel");
const track = $("#track");
let catActual = 0;
let active = 0;
let prevOff = {};

tabsBox.insertAdjacentHTML("beforeend", MENU.map((c, i) => `
  <button type="button" class="tab" role="tab" aria-selected="${i === 0}" data-i="${i}">
    <img src="${mini(FAVS[i])}" alt=""><span>${esc(c.nombre)}</span><small>${c.bebidas.length}</small>
  </button>`).join(""));

function movePill() {
  const t = $(`.tab[data-i="${catActual}"]`, tabsBox);
  pill.style.width = `${t.offsetWidth}px`;
  pill.style.transform = `translateX(${t.offsetLeft}px)`;
}

function setCategory(i, first = false) {
  catActual = i;
  const cat = MENU[i];
  $$(".tab", tabsBox).forEach(t => t.setAttribute("aria-selected", +t.dataset.i === i));
  carousel.parentElement.style.setProperty("--v", cat.vivo);
  movePill();

  track.innerHTML = cat.bebidas.map((b, k) => `
    <article class="ccard" data-k="${k}" aria-label="${esc(b.nombre)}, ${money(b.precio)}">
      <div class="ccard__media"><span class="ccard__blob"></span><img src="${big(b)}" alt="${esc(b.nombre)}" draggable="false"></div>
      <span class="ccard__tag">${b.favorito ? "★ Favorito de la casa" : esc(cat.nombre)}</span>
      <h3 class="ccard__name">${esc(b.nombre)}</h3>
      <p class="ccard__desc">${esc(b.desc || cat.lema)}</p>
      <div class="ccard__row"><span class="price">${money(b.precio)}</span>${qtyHTML(b)}</div>
    </article>`).join("");
  $("#cdots").innerHTML = cat.bebidas.map((b, k) => `<button type="button" data-k="${k}" aria-label="Ver ${esc(b.nombre)}"></button>`).join("");

  active = 0;
  prevOff = {};
  layout(true);
  if (!first) $$(".ccard", track).forEach(c => restart(c, "is-enter"));
}

function offsetOf(k, n) {
  let o = k - active;
  if (o > n / 2) o -= n;
  if (o < -n / 2) o += n;
  return o;
}

function layout(instant = false) {
  const cards = $$(".ccard", track);
  const n = cards.length;
  cards.forEach((c, k) => {
    const o = offsetOf(k, n);
    const jump = prevOff[k] !== undefined && Math.abs(o - prevOff[k]) > 1;
    if (instant || jump) c.style.transition = "none";
    c.style.setProperty("--o", o);
    c.style.setProperty("--abs", Math.abs(o));
    c.classList.toggle("is-active", o === 0);
    c.classList.toggle("is-far", Math.abs(o) > 2);
    if (instant || jump) { void c.offsetWidth; c.style.transition = ""; }
    if (jump) restart(c, "is-wrap");
    prevOff[k] = o;
  });
  $$("#cdots button").forEach((d, k) => d.classList.toggle("on", k === active));
}

const n = () => MENU[catActual].bebidas.length;
const go = k => { active = (k + n()) % n(); layout(); };

tabsBox.addEventListener("click", e => {
  const t = e.target.closest(".tab");
  if (t && +t.dataset.i !== catActual) setCategory(+t.dataset.i);
});
$("#prev").addEventListener("click", () => go(active - 1));
$("#next").addEventListener("click", () => go(active + 1));
$("#cdots").addEventListener("click", e => { const d = e.target.closest("button"); if (d) go(+d.dataset.k); });
carousel.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") { go(active - 1); e.preventDefault(); }
  if (e.key === "ArrowRight") { go(active + 1); e.preventDefault(); }
});

// Deslizar con el dedo o el mouse
let sx = null, swiped = false;
const endDrag = () => { track.classList.remove("is-dragging"); track.style.setProperty("--drag", "0px"); };
track.addEventListener("pointerdown", e => { if (!e.target.closest(".qty")) { sx = e.clientX; swiped = false; } });
track.addEventListener("pointermove", e => {
  if (sx === null) return;
  const dx = e.clientX - sx;
  if (Math.abs(dx) > 6) {
    track.classList.add("is-dragging");
    track.style.setProperty("--drag", `${dx * .6}px`);
  }
});
addEventListener("pointerup", e => {
  if (sx === null) return;
  const dx = e.clientX - sx;
  sx = null;
  endDrag();
  if (Math.abs(dx) > 40) { swiped = true; go(active + (dx < 0 ? 1 : -1)); }
});
addEventListener("pointercancel", () => { sx = null; endDrag(); });
track.addEventListener("click", e => {
  if (swiped) { swiped = false; return; }
  if (e.target.closest(".qty")) return;
  const c = e.target.closest(".ccard");
  if (c && !c.classList.contains("is-active")) go(+c.dataset.k);
});

addEventListener("resize", movePill);
document.fonts?.ready.then(movePill);

/* ---------- Menú completo ---------- */
$("#blocks").innerHTML = MENU.map((cat, i) => `
  <section class="block reveal" style="--c:${cat.banda || cat.color};--on:${cat.on};--d:${i % 2}">
    <h4 class="block__band">${esc(cat.nombre)}</h4>
    <ul class="block__list">
      ${cat.bebidas.map(b => `
        <li class="block__item">
          <img src="${mini(b)}" alt="" loading="lazy">
          <span class="block__name">${esc(b.nombre)}${b.favorito ? " <i>★</i>" : ""}</span>
          <span class="block__price">${money(b.precio)}</span>
          ${qtyHTML(b)}
        </li>`).join("")}
    </ul>
  </section>`).join("");

/* =========================================================
   PEDIDO (panel, barra y WhatsApp)
   ========================================================= */
const drawer = $("#drawer");
const scrim = $("#scrim");
const cartbar = $("#cartbar");

function openCart() {
  scrim.hidden = false;
  requestAnimationFrame(() => { scrim.classList.add("is-on"); drawer.classList.add("is-on"); });
  drawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  cartbar.classList.remove("is-on");
  $("#close-cart").focus();
}
function closeCart() {
  scrim.classList.remove("is-on");
  drawer.classList.remove("is-on");
  drawer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  setTimeout(() => { scrim.hidden = true; }, 400);
  syncCartbar();
}
$("#open-cart").addEventListener("click", openCart);
$("#cartbar-open").addEventListener("click", openCart);
$("#close-cart").addEventListener("click", closeCart);
$("#empty-go").addEventListener("click", closeCart);
scrim.addEventListener("click", closeCart);
addEventListener("keydown", e => {
  if (e.key !== "Escape") return;
  if (checkout.classList.contains("is-on")) closeCheckout();
  else if (drawer.classList.contains("is-on")) closeCart();
});
$("#cart-clear").addEventListener("click", () => { cart = {}; updateCart(); });

// En el celular el pedido se cierra deslizándolo hacia abajo
let dy0 = null, dyNow = 0;
drawer.addEventListener("pointerdown", e => {
  if (!e.target.closest(".drawer__handle, .drawer__head") || e.target.closest("button")) return;
  dy0 = e.clientY; dyNow = 0;
  drawer.setPointerCapture(e.pointerId);
  drawer.classList.add("is-dragging");
});
drawer.addEventListener("pointermove", e => {
  if (dy0 === null) return;
  dyNow = Math.max(0, e.clientY - dy0);
  drawer.style.setProperty("--dy", `${dyNow}px`);
});
const dropDrawer = () => {
  if (dy0 === null) return;
  dy0 = null;
  drawer.classList.remove("is-dragging");
  drawer.style.setProperty("--dy", "0px");
  if (dyNow > 90) closeCart();
};
drawer.addEventListener("pointerup", dropDrawer);
drawer.addEventListener("pointercancel", dropDrawer);

const countAll = () => Object.values(cart).reduce((a, b) => a + b, 0);
function syncCartbar() {
  const on = countAll() > 0 && !drawer.classList.contains("is-on");
  cartbar.classList.toggle("is-on", on);
  cartbar.setAttribute("aria-hidden", !on);
  document.body.classList.toggle("has-cart", countAll() > 0);
  $("#cartbar-open").tabIndex = on ? 0 : -1;
}

function orderLines(entries) {
  let total = 0;
  const lines = entries.map(([id, n]) => {
    const b = byId[id];
    total += n * b.precio;
    return { b, n, text: `• ${n} × ${b.nombre} (${money(n * b.precio)})` };
  });
  return { lines, total };
}

let lastId = null;
function setQty(id, n) {
  n = clamp(n, 0, 30);
  if (n > (cart[id] || 0)) lastId = id;
  if (n) cart[id] = n; else delete cart[id];
  updateCart();
}

function updateCart() {
  localStorage.setItem("drinka-pedido", JSON.stringify(cart));
  const entries = Object.entries(cart);
  const { lines, total } = orderLines(entries);
  const count = countAll();

  const c = $("#nav-count");
  if (c.textContent !== String(count)) { c.textContent = count; restart(c, "is-bump"); }

  $$(".qty").forEach(q => {
    const v = cart[q.dataset.id] || 0;
    q.dataset.n = v;
    $(".qty__n", q).textContent = v;
  });

  // barra inferior
  $("#cartbar-count").textContent = `${count} ${count === 1 ? "bebida" : "bebidas"}`;
  $("#cartbar-total").textContent = money(total);
  const last = byId[lastId] || (entries.length ? byId[entries[entries.length - 1][0]] : null);
  if (last) $("#cartbar-img").src = mini(last);
  syncCartbar();

  // panel
  drawer.classList.toggle("is-empty", !entries.length);
  $("#cart-list").innerHTML = lines.map(({ b }) => `
    <li class="citem">
      <span class="citem__img"><img src="${mini(b)}" alt=""></span>
      <div><p class="citem__name">${esc(b.nombre)}</p><p class="citem__price">${money(b.precio)} c/u</p></div>
      ${qtyHTML(b)}
    </li>`).join("");
  $("#cart-total").textContent = money(total);

  renderChat();
  renderCheckout();
}

// El vasito vuela hasta el pedido
function fly(src, rect) {
  if (reduceMotion || !rect || !rect.width) return;
  const target = $("#open-cart").getBoundingClientRect();
  const img = document.createElement("img");
  img.src = src;
  img.className = "flyer";
  Object.assign(img.style, { left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px` });
  document.body.append(img);
  const dx = target.left + target.width / 2 - (rect.left + rect.width / 2);
  const dy = target.top + target.height / 2 - (rect.top + rect.height / 2);
  img.animate([
    { transform: "translate(0,0) scale(1) rotate(0deg)", opacity: 1 },
    { transform: `translate(${dx * .45}px, ${dy * .45 - 90}px) scale(.6) rotate(-18deg)`, opacity: 1, offset: .5 },
    { transform: `translate(${dx}px, ${dy}px) scale(.1) rotate(-40deg)`, opacity: .4 },
  ], { duration: 850, easing: "cubic-bezier(.5,0,.35,1)" }).finished.then(() => {
    img.remove();
    restart($("#open-cart"), "is-bump");
  });
}

document.addEventListener("click", e => {
  const btn = e.target.closest(".qty__btn");
  if (!btn) return;
  const q = btn.closest(".qty");
  const id = q.dataset.id;
  const step = +btn.dataset.step;
  if (step > 0) {
    const host = btn.closest(".ccard, .block__item");
    const img = host && $(".ccard__media img, img", host);
    if (img) fly(img.currentSrc || img.src, img.getBoundingClientRect());
  }
  setQty(id, (cart[id] || 0) + step);
});

/* =========================================================
   FINALIZAR PEDIDO: retiro o delivery + vista previa del WhatsApp
   ========================================================= */
const checkout = $("#checkout");
const datos = { modo: "retiro", nombre: "", direccion: "", referencia: "", ubicacion: "", nota: "" };
try { Object.assign(datos, JSON.parse(localStorage.getItem("drinka-datos")) || {}); } catch {}
datos.ubicacion = ""; datos.nota = "";
const saveDatos = () => {
  const { modo, nombre, direccion, referencia } = datos;
  localStorage.setItem("drinka-datos", JSON.stringify({ modo, nombre, direccion, referencia }));
};

// Arma el texto exacto que se envía (los *asteriscos* salen en negrita en WhatsApp)
function buildMessage(entries, d, ejemplo = false) {
  const { lines, total } = orderLines(entries);
  const out = ["¡Hola Drinka! Quiero hacer un pedido:", "", ...lines.map(l => l.text), "", `*Total: ${money(total)}*`, ""];
  if (d.nombre.trim()) out.push(`*Nombre:* ${d.nombre.trim()}`);
  if (d.modo === "delivery") {
    out.push("*Entrega:* Delivery a domicilio");
    out.push(`*Dirección:* ${d.direccion.trim() || (ejemplo ? "{{Tu dirección exacta}}" : "{{Escribe tu dirección}}")}`);
    if (d.referencia.trim()) out.push(`*Referencia:* ${d.referencia.trim()}`);
    if (d.ubicacion) out.push(`*Ubicación:* ${d.ubicacion}`);
  } else {
    out.push("*Entrega:* Retiro en el local");
  }
  if (d.nota.trim()) out.push(`*Nota:* ${d.nota.trim()}`);
  out.push("", "¿Me confirman? ¡Gracias!");
  return out.join("\n");
}
// Lo muestra como en WhatsApp: negritas, enlaces y espacios por llenar
const waHTML = text => esc(text)
  .replace(/\*([^*\n]+)\*/g, "<b>$1</b>")
  .replace(/\{\{([^}]+)\}\}/g, '<span class="ph">$1</span>')
  .replace(/(https:\/\/maps\.google\.com\/\?q=[\d.,-]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')
  .replace(/\n/g, "<br>");

const coSend = $("#co-send");
const dirField = $("#co-dir-field");
const necesitaDireccion = () => datos.modo === "delivery" && datos.direccion.trim().length < 6;

function renderCheckout() {
  const entries = Object.entries(cart);
  const text = buildMessage(entries, datos);
  $("#co-preview").innerHTML = `${waHTML(text)}<time>${hora()}</time>`;
  $("#co-total").textContent = money(orderLines(entries).total);
  $("#co-delivery").hidden = datos.modo !== "delivery";
  coSend.href = waLink(text);
  coSend.classList.toggle("is-off", necesitaDireccion());
  if (!necesitaDireccion()) dirField.classList.remove("is-error");
}

// Rellena el formulario con lo guardado
$$('input[name="modo"]').forEach(r => { r.checked = r.value === datos.modo; });
[["#co-nombre", "nombre"], ["#co-direccion", "direccion"], ["#co-referencia", "referencia"], ["#co-nota", "nota"]].forEach(([sel, key]) => {
  const el = $(sel);
  el.value = datos[key];
  el.addEventListener("input", () => { datos[key] = el.value; saveDatos(); renderCheckout(); renderChat(); });
});
$("#co-form").addEventListener("change", e => {
  if (e.target.name !== "modo") return;
  datos.modo = e.target.value;
  saveDatos(); renderCheckout(); renderChat();
  if (datos.modo === "delivery" && !datos.direccion && finePointer) $("#co-direccion").focus();
});
$("#co-form").addEventListener("submit", e => e.preventDefault());

// Ubicación actual como enlace de Google Maps
const geo = $("#co-geo");
const geoText = t => { $("span", geo).textContent = t; };
geo.addEventListener("click", () => {
  if (datos.ubicacion) {
    datos.ubicacion = ""; geo.className = "geo"; geoText("Agregar mi ubicación actual"); renderCheckout(); return;
  }
  if (!navigator.geolocation) { geo.className = "geo is-error"; geoText("Tu navegador no permite compartir ubicación"); return; }
  geo.className = "geo is-busy"; geoText("Buscando tu ubicación…");
  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude: la, longitude: lo } = pos.coords;
    datos.ubicacion = `https://maps.google.com/?q=${la.toFixed(6)},${lo.toFixed(6)}`;
    geo.className = "geo is-done"; geoText("Ubicación agregada · toca para quitarla");
    renderCheckout();
  }, () => {
    geo.className = "geo is-error"; geoText("No pudimos obtener tu ubicación. Escribe la dirección.");
  }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 });
});

function openCheckout() {
  if (!countAll()) return;
  drawer.classList.remove("is-on");
  drawer.setAttribute("aria-hidden", "true");
  scrim.classList.remove("is-on");
  setTimeout(() => { scrim.hidden = true; }, 400);
  checkout.classList.remove("is-sent");
  renderCheckout();
  checkout.classList.add("is-on");
  checkout.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  cartbar.classList.remove("is-on");
  $(".checkout__body").scrollTop = 0;
  setTimeout(() => $("#co-title").focus({ preventScroll: true }), 50);
}
function closeCheckout() {
  checkout.classList.remove("is-on", "is-sent");
  checkout.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  syncCartbar();
}
$("#cart-next").addEventListener("click", openCheckout);
$("#co-close").addEventListener("click", closeCheckout);
$("#co-back").addEventListener("click", () => { closeCheckout(); openCart(); });
checkout.addEventListener("click", e => { if (e.target === checkout) closeCheckout(); });

coSend.addEventListener("click", e => {
  if (necesitaDireccion()) {
    e.preventDefault();
    dirField.classList.remove("is-error"); void dirField.offsetWidth; dirField.classList.add("is-error");
    $("#co-direccion").focus();
    dirField.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  setTimeout(() => checkout.classList.add("is-sent"), 400);
});
$("#co-finish").addEventListener("click", () => { cart = {}; updateCart(); closeCheckout(); });
$("#co-again").addEventListener("click", () => checkout.classList.remove("is-sent"));

// "Pedir a domicilio": deja marcado delivery y lleva al pedido (o al menú si está vacío)
let toastT;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("is-on");
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove("is-on"), 2600);
}
$("#delivery-cta").addEventListener("click", e => {
  datos.modo = "delivery";
  $$('input[name="modo"]').forEach(r => { r.checked = r.value === "delivery"; });
  saveDatos(); renderCheckout(); renderChat();
  if (countAll()) { e.preventDefault(); openCheckout(); }
  else toast("Primero elige tus bebidas y luego escribes tu dirección 🧋");
});

/* =========================================================
   DELIVERY: el chat del teléfono muestra tu pedido
   ========================================================= */
const SAMPLE = [[FAVS[0].id, 1], [FAVS[1].id, 1]];
const hora = () => new Date().toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" });
function renderChat() {
  const entries = Object.keys(cart).length ? Object.entries(cart) : SAMPLE;
  const data = datos.modo === "delivery" && datos.direccion.trim() ? datos : { ...datos, modo: "delivery", direccion: "" };
  const msg = $("#chat-msg");
  msg.innerHTML = `${waHTML(buildMessage(entries, data, true))}<time>${hora()} ✓✓</time>`;
  restart(msg, "is-flash");
}
const phoneIO = new IntersectionObserver(([en]) => {
  if (!en.isIntersecting) return;
  phoneIO.disconnect();
  const reply = $("#chat-reply");
  setTimeout(() => { reply.hidden = false; reply.innerHTML = `<span class="typing"><i></i><i></i><i></i></span>`; }, 900);
  setTimeout(() => { reply.innerHTML = `¡Recibido! 🧋 Ya lo estamos preparando y te avisamos cuando salga.<time>${hora()}</time>`; }, 2600);
}, { threshold: .5 });
phoneIO.observe($("#phone"));

/* =========================================================
   NOSOTROS: estadísticas animadas
   ========================================================= */
const openDays = Object.values(DRINKA.horario).filter(Boolean).length;
const minPrice = Math.min(...ALL.map(b => b.precio));
const STATS = [
  { n: ALL.length, label: "bebidas en el menú", c: "#6F8A3A" },
  { n: MENU.length, label: "mundos de sabor", c: "#9E86D6" },
  { n: openDays, label: "días a la semana", c: "#EE8A34" },
  { n: minPrice, pre: "$", label: "precios desde", c: "#1F2A4D" },
];
$("#stats").innerHTML = STATS.map((s, i) => `
  <div class="stat reveal" style="--c:${s.c};--d:${i}"><b data-n="${s.n}" data-pre="${s.pre || ""}">${s.pre || ""}0</b><span>${s.label}</span></div>`).join("");
const statIO = new IntersectionObserver(entries => entries.forEach(en => {
  if (!en.isIntersecting) return;
  statIO.unobserve(en.target);
  const b = $("b", en.target), to = +b.dataset.n, pre = b.dataset.pre;
  const t0 = performance.now(), dur = reduceMotion ? 1 : 1400;
  const tick = t => {
    const p = clamp((t - t0) / dur, 0, 1);
    b.textContent = pre + Math.round(to * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}), { threshold: .6 });
$$(".stat").forEach(s => statIO.observe(s));

/* =========================================================
   FAVORITOS: sección fija
   ========================================================= */
const favs = $("#favs");
$("#favs-cups").innerHTML = FAVS.map(b => `<img class="favs__cup" src="${big(b)}" alt="${esc(b.nombre)}" loading="lazy">`).join("");
$("#favs-dots").innerHTML = FAVS.map(() => "<i></i>").join("");
const favCups = $$(".favs__cup");
const favDots = $$("#favs-dots i");
let favIdx = -1;

function setFav(i) {
  if (i === favIdx) return;
  favIdx = i;
  const b = FAVS[i], cat = MENU[i];
  favs.style.setProperty("--fbg", cat.hero.bg);
  favs.style.setProperty("--fdeep", cat.hero.deep);
  favCups.forEach((c, k) => {
    c.classList.toggle("is-on", k === i);
    c.classList.toggle("is-past", k < i);
  });
  favDots.forEach((d, k) => d.classList.toggle("on", k === i));
  $("#favs-count").innerHTML = `<b>${pad(i + 1)}</b> / ${pad(FAVS.length)}`;
  const bigW = $("#favs-big");
  bigW.textContent = cat.palabra;
  restart(bigW, "is-swap");
  $("#favs-cat").textContent = cat.nombre;
  $("#favs-name").textContent = b.nombre;
  $("#favs-desc").textContent = b.desc || cat.lema;
  $("#favs-price").textContent = money(b.precio);
  restart($("#favs-card"), "is-swap");
}
$("#favs-add").addEventListener("click", () => {
  const b = FAVS[favIdx];
  fly(big(b), favCups[favIdx].getBoundingClientRect());
  setQty(b.id, (cart[b.id] || 0) + 1);
});
setFav(0);

/* =========================================================
   BUCLE DE SCROLL
   ========================================================= */
const qSec = $("#nosotros");
const qL1 = $("#q-l1"), qL2 = $("#q-l2"), qCup = $("#q-cup");
let ticking = false;
function onScroll() {
  ticking = false;
  const vh = innerHeight;

  // "Hecho al momento": las líneas se cruzan y el vaso gira
  const qr = qSec.getBoundingClientRect();
  if (qr.bottom > 0 && qr.top < vh && !reduceMotion) {
    const p = clamp((vh - qr.top) / (vh + qr.height), 0, 1) - .5;
    qL1.style.transform = `translateX(${p * -22}vw)`;
    qL2.style.transform = `translateX(${p * 22}vw)`;
    qCup.style.transform = `translateY(${p * -120}px) rotate(${p * 26}deg)`;
  }

  // Favoritos
  const fr = favs.getBoundingClientRect();
  const total = fr.height - vh;
  const fp = clamp(-fr.top / total, 0, .9999);
  setFav(Math.floor(fp * FAVS.length));
  favCups[favIdx].style.setProperty("--spin", `${((fp * FAVS.length) % 1 - .5) * 10}deg`);
}
addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
addEventListener("resize", onScroll);

/* =========================================================
   HORARIO EN VIVO
   ========================================================= */
const DIAS = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
const ORDEN = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];
const NOMBRES = { lunes: "Lunes", martes: "Martes", miercoles: "Miércoles", jueves: "Jueves", viernes: "Viernes", sabado: "Sábado", domingo: "Domingo" };
const toMin = h => { const [a, b] = h.split(":").map(Number); return a * 60 + b; };
const fmt = h => {
  const [a, b] = h.split(":").map(Number);
  return `${a % 12 || 12}:${pad(b)} ${a >= 12 ? "pm" : "am"}`;
};
const rango = h => (h ? `${fmt(h[0])} – ${fmt(h[1])}` : "Cerrado");

function nowLocal() {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-US", {
    timeZone: DRINKA.zonaHoraria, weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false,
  }).formatToParts(new Date()).map(p => [p.type, p.value]));
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(parts.weekday);
  return { day, min: (+parts.hour % 24) * 60 + +parts.minute };
}

function renderHours() {
  const { day, min } = nowLocal();
  const hoy = DIAS[day];
  $("#hours").innerHTML = ORDEN.map(d => {
    const h = DRINKA.horario[d];
    return `<li class="${d === hoy ? "is-today" : ""} ${h ? "" : "is-closed"}">
      <span>${NOMBRES[d]}${d === hoy ? '<span class="tag">Hoy</span>' : ""}</span><span>${rango(h)}</span></li>`;
  }).join("");

  const h = DRINKA.horario[hoy];
  const abierto = !!h && min >= toMin(h[0]) && min < toMin(h[1]);
  let texto = "";
  if (abierto) texto = `Abierto ahora · cierra a las ${fmt(h[1])}`;
  else if (h && min < toMin(h[0])) texto = `Cerrado · abre hoy a las ${fmt(h[0])}`;
  else {
    for (let k = 1; k <= 7; k++) {
      const d = DIAS[(day + k) % 7], hh = DRINKA.horario[d];
      if (hh) { texto = `Cerrado · abre ${k === 1 ? "mañana" : `el ${NOMBRES[d].toLowerCase()}`} a las ${fmt(hh[0])}`; break; }
    }
  }
  const pillEl = $("#pill"), status = $("#status");
  pillEl.textContent = abierto ? "Abierto" : "Cerrado";
  pillEl.className = `pill ${abierto ? "is-open" : "is-closed"}`;
  status.className = `status ${abierto ? "is-open" : "is-closed"}`;
  $("#status-text").textContent = texto;
}

// Resumen para el footer: agrupa días seguidos con el mismo horario
function renderFootHours() {
  const groups = [];
  ORDEN.forEach(d => {
    const txt = rango(DRINKA.horario[d]);
    const last = groups[groups.length - 1];
    if (last && last.txt === txt) last.to = d; else groups.push({ from: d, to: d, txt });
  });
  $("#foot-hours").innerHTML = groups.map(g =>
    `<p><b>${NOMBRES[g.from]}${g.to !== g.from ? ` a ${NOMBRES[g.to].toLowerCase()}` : ""}</b><br>${g.txt}</p>`).join("");
}

/* =========================================================
   ARRANQUE
   ========================================================= */
setCategory(0, true);
updateCart();
renderHours();
renderFootHours();
setInterval(renderHours, 60000);
onScroll();

// Aparición al hacer scroll
const io = new IntersectionObserver(entries => entries.forEach(en => {
  if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
}), { threshold: .15, rootMargin: "0px 0px -40px 0px" });
$$(".reveal").forEach(el => io.observe(el));

// Intro con el logo (solo la primera vez por sesión)
const intro = $("#intro");
const ready = () => { document.body.classList.add("is-ready"); movePill(); };
if (!intro || document.documentElement.classList.contains("no-intro") || reduceMotion) {
  intro?.remove();
  ready();
} else {
  document.body.classList.add("is-loading");
  try { sessionStorage.setItem("drinka-intro", "1"); } catch {}
  setTimeout(() => { intro.classList.add("is-out"); document.body.classList.remove("is-loading"); }, 2000);
  setTimeout(ready, 2250);
  setTimeout(() => intro.remove(), 3200);
}

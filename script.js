const CONFIG = {
  whatsapp: "5491171388777",
  compraMinima: 50000
};

// Precios de DEMO: reemplazalos por tus precios reales.
const productos = [
  {
    id: "p1",
    nombre: "Cargador 45W PD",
    categoria: "cargadores",
    precio: 8500,
    imagen: "assets/cargador-45w.jpg",
    descripcion: "Adaptador USB-C Power Delivery de 45W. Incluye cable USB-C a USB-C 5A.",
    tag: "Más buscado"
  },
  {
    id: "p2",
    nombre: "Cargador USB para Auto",
    categoria: "cargadores",
    precio: 6500,
    imagen: "assets/cargador-auto.jpg",
    descripcion: "Cargador para vehículo con carga rápida. Ideal para stock de alta rotación.",
    tag: "Auto"
  },
  {
    id: "p3",
    nombre: "Auricular P47 Wireless",
    categoria: "audio",
    precio: 12000,
    imagen: "assets/auricular-p47.jpg",
    descripcion: "Auricular inalámbrico P47 5.0 + EDR. Disponible en distintos colores según stock.",
    tag: "Wireless"
  }
];

const combos = [
  {
    id: "c1",
    nombre: "Combo Emprendedor",
    precio: 50000,
    etiqueta: "Entrada",
    icono: "⚡",
    destacado: false,
    descripcion: "Una base de productos de alta rotación para comenzar a vender.",
    items: ["Cargadores y accesorios", "Compra mínima incluida", "Ideal para reventa"]
  },
  {
    id: "c2",
    nombre: "Combo Full Negocio",
    precio: 200000,
    etiqueta: "Recomendado",
    icono: "★",
    destacado: true,
    descripcion: "Surtido pensado para ampliar categorías y tener variedad de stock.",
    items: ["Audio + cargadores", "Mayor variedad", "Pensado para revendedores"]
  },
  {
    id: "c3",
    nombre: "Combo a medida",
    precio: null,
    etiqueta: "Consultar",
    icono: "✦",
    destacado: false,
    descripcion: "Decinos cuánto querés invertir y armamos una propuesta según disponibilidad.",
    items: ["Presupuesto personalizado", "Consultá stock", "Coordinación por WhatsApp"]
  }
];

let carrito = JSON.parse(localStorage.getItem("powertechCarrito") || "[]");

const $ = (selector) => document.querySelector(selector);
const money = (n) => "$" + Number(n).toLocaleString("es-AR");
const wa = (text) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;

function setupWhatsApp() {
  const message = "Hola Powertech, vengo desde la tienda web y quiero consultar stock y precios mayoristas.";
  ["#topWhatsapp","#heroWhatsapp","#ctaWhatsapp"].forEach(sel => {
    const el = $(sel);
    if (el) el.href = wa(message);
  });
  $("#topMinimo").textContent = money(CONFIG.compraMinima);
  $("#trustMinimo").textContent = money(CONFIG.compraMinima);
}

function renderProducts() {
  const query = $("#searchInput").value.trim().toLowerCase();
  const category = $("#categoryFilter").value;

  const filtered = productos.filter(p => {
    const text = `${p.nombre} ${p.categoria} ${p.descripcion}`.toLowerCase();
    return (category === "todos" || p.categoria === category) && text.includes(query);
  });

  $("#emptyState").hidden = filtered.length > 0;
  $("#productGrid").innerHTML = filtered.map(p => `
    <article class="product-card">
      <div class="product-media">
        <span class="tag">${p.tag}</span>
        <img src="${p.imagen}" alt="${p.nombre}" loading="lazy">
      </div>
      <div class="product-info">
        <span class="product-category">${p.categoria}</span>
        <h3>${p.nombre}</h3>
        <p>${p.descripcion}</p>
        <div class="product-bottom">
          <div class="price">
            <strong>${money(p.precio)}</strong>
            <small>precio demo / unidad</small>
          </div>
          <button class="add-button" onclick="addProduct('${p.id}')">Agregar</button>
        </div>
      </div>
    </article>
  `).join("");
}

function renderCombos() {
  $("#comboGrid").innerHTML = combos.map(c => `
    <article class="combo-card ${c.destacado ? "featured" : ""}">
      <div class="combo-top">
        <span class="combo-label">${c.etiqueta}</span>
        <span class="combo-icon">${c.icono}</span>
      </div>
      <h3>${c.nombre}</h3>
      <p>${c.descripcion}</p>
      <ul class="combo-list">${c.items.map(item => `<li>${item}</li>`).join("")}</ul>
      <div class="combo-price">${c.precio ? money(c.precio) : "Consultar"}</div>
      ${
        c.precio
        ? `<button class="btn btn-gold" onclick="addCombo('${c.id}')">Agregar al carrito</button>`
        : `<a class="btn btn-ghost" href="${wa(`Hola Powertech, quiero consultar por el ${c.nombre}.`)}" target="_blank" rel="noopener">Consultar por WhatsApp</a>`
      }
    </article>
  `).join("");
}

function addProduct(id) {
  const product = productos.find(p => p.id === id);
  if (!product) return;
  addToCart({ id: product.id, nombre: product.nombre, precio: product.precio });
  openCart();
  toast("Producto agregado");
}

function addCombo(id) {
  const combo = combos.find(c => c.id === id);
  if (!combo) return;
  addToCart({ id: combo.id, nombre: combo.nombre, precio: combo.precio });
  openCart();
  toast("Combo agregado");
}

function addToCart(item) {
  const existing = carrito.find(x => x.id === item.id);
  if (existing) existing.cantidad += 1;
  else carrito.push({ ...item, cantidad: 1 });
  saveCart();
}

function changeQty(id, delta) {
  const item = carrito.find(x => x.id === id);
  if (!item) return;
  item.cantidad += delta;
  if (item.cantidad <= 0) carrito = carrito.filter(x => x.id !== id);
  saveCart();
}

function removeItem(id) {
  carrito = carrito.filter(x => x.id !== id);
  saveCart();
}

function saveCart() {
  localStorage.setItem("powertechCarrito", JSON.stringify(carrito));
  renderCart();
}

function cartTotal() {
  return carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
}

function cartUnits() {
  return carrito.reduce((sum, item) => sum + item.cantidad, 0);
}

function renderCart() {
  const units = cartUnits();
  const total = cartTotal();
  $("#cartCount").textContent = units;
  $("#cartCountMobile").textContent = units;
  $("#cartSubtotal").textContent = money(total);

  if (!carrito.length) {
    $("#cartItems").innerHTML = `
      <div class="cart-empty">
        <div>🛒</div>
        <p>Tu carrito está vacío.</p>
        <small>Agregá productos para armar tu pedido.</small>
      </div>`;
  } else {
    $("#cartItems").innerHTML = carrito.map(item => `
      <div class="cart-item">
        <div class="cart-item-top">
          <div>
            <h3>${item.nombre}</h3>
            <small>${money(item.precio)} c/u</small>
          </div>
          <button class="remove" onclick="removeItem('${item.id}')" aria-label="Eliminar">✕</button>
        </div>
        <div class="qty">
          <button onclick="changeQty('${item.id}',-1)">−</button>
          <strong>${item.cantidad}</strong>
          <button onclick="changeQty('${item.id}',1)">+</button>
          <span class="line-total">${money(item.precio * item.cantidad)}</span>
        </div>
      </div>
    `).join("");
  }

  if (!carrito.length) {
    $("#minimumMessage").textContent = "Compra mínima: " + money(CONFIG.compraMinima);
  } else if (total < CONFIG.compraMinima) {
    $("#minimumMessage").textContent = `Faltan ${money(CONFIG.compraMinima - total)} para alcanzar la compra mínima de ${money(CONFIG.compraMinima)}.`;
  } else {
    $("#minimumMessage").textContent = "✓ Pedido habilitado para enviar por WhatsApp.";
  }

  $("#checkout").disabled = !carrito.length || total < CONFIG.compraMinima;
  $("#checkout").style.opacity = $("#checkout").disabled ? ".45" : "1";
  $("#checkout").style.cursor = $("#checkout").disabled ? "not-allowed" : "pointer";
}

function openCart() {
  $("#cartDrawer").classList.add("open");
  $("#cartDrawer").setAttribute("aria-hidden", "false");
  $("#overlay").hidden = false;
  document.body.classList.add("locked");
}

function closeCart() {
  $("#cartDrawer").classList.remove("open");
  $("#cartDrawer").setAttribute("aria-hidden", "true");
  $("#overlay").hidden = true;
  document.body.classList.remove("locked");
}

function checkout() {
  if (!carrito.length) return toast("El carrito está vacío");
  const total = cartTotal();
  if (total < CONFIG.compraMinima) {
    return toast(`La compra mínima es ${money(CONFIG.compraMinima)}`);
  }
  const lines = carrito.map(x => `• ${x.cantidad} × ${x.nombre} — ${money(x.precio * x.cantidad)}`);
  const text = [
    "Hola Powertech! Quiero realizar este pedido:",
    "",
    ...lines,
    "",
    `TOTAL: ${money(total)}`,
    "",
    "Vengo desde la tienda web. Quiero confirmar stock, forma de pago y envío."
  ].join("\n");
  window.open(wa(text), "_blank", "noopener");
}

function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
}

$("#searchInput").addEventListener("input", renderProducts);
$("#categoryFilter").addEventListener("change", renderProducts);
$("#openCart").addEventListener("click", openCart);
$("#openCartMobile").addEventListener("click", openCart);
$("#closeCart").addEventListener("click", closeCart);
$("#overlay").addEventListener("click", closeCart);
$("#checkout").addEventListener("click", checkout);
$("#clearCart").addEventListener("click", () => {
  carrito = [];
  saveCart();
  toast("Carrito vacío");
});
$("#menuButton").addEventListener("click", () => $("#mobileNav").classList.toggle("open"));
document.querySelectorAll(".mobile-nav a").forEach(a => a.addEventListener("click", () => $("#mobileNav").classList.remove("open")));

$("#year").textContent = new Date().getFullYear();

setupWhatsApp();
renderProducts();
renderCombos();
renderCart();


const TELEFONO_WHATSAPP = "5491171388777";
const COMPRA_MINIMA = 50000;

const productos = [
  {id:"p1", nombre:"Cargador Turbo USB-C 20W", categoria:"cargadores", precio:8500, emoji:"🔌", descripcion:"Cargador compacto de carga rápida, ideal para celulares compatibles."},
  {id:"p2", nombre:"Cable USB-C a USB-C 1 m", categoria:"cables", precio:4500, emoji:"🔗", descripcion:"Cable Tipo C para carga y transferencia de datos."},
  {id:"p3", nombre:"Cable USB-A a Lightning 1 m", categoria:"cables", precio:4200, emoji:"🍎", descripcion:"Cable compatible con dispositivos con conector Lightning."},
  {id:"p4", nombre:"Auriculares Bluetooth TWS", categoria:"audio", precio:12000, emoji:"🎧", descripcion:"Auriculares inalámbricos para uso diario."},
  {id:"p5", nombre:"Cargador USB para Auto", categoria:"auto", precio:6500, emoji:"🚗", descripcion:"Cargador doble USB para vehículo."},
  {id:"p6", nombre:"Power Bank 10.000 mAh", categoria:"energia", precio:14500, emoji:"🔋", descripcion:"Batería portátil para llevar carga a cualquier lugar."}
];

const combos = [
  {id:"c1", nombre:"Combo 1: Emprendedor", precio:50000, etiqueta:"¡El más vendido!", descripcion:"Surtido de productos de alta rotación para comenzar a vender.", items:["Cables y cargadores de alta rotación","Ideal para empezar a vender","Compra mínima incluida"], emoji:"🔥"},
  {id:"c2", nombre:"Combo Especial iPhone", precio:null, etiqueta:"Línea Premium", descripcion:"Surtido orientado a clientes que trabajan con productos Apple.", items:["Lightning y Tipo C a Lightning","Cargadores Turbo compatibles","Precio a consultar"], emoji:"🍎"},
  {id:"c3", nombre:"Combo Full Negocio", precio:200000, etiqueta:"Surtido Completo", descripcion:"Variedad para stockear el negocio y tener diferentes categorías.", items:["Auriculares","Cables y cargadores rápidos","No incluye fundas ni vidrios"], emoji:"⭐"}
];

let carrito = JSON.parse(localStorage.getItem("powertechCarrito") || "[]");

const money = n => "$" + n.toLocaleString("es-AR");
const waUrl = msg => `https://wa.me/${TELEFONO_WHATSAPP}?text=${encodeURIComponent(msg)}`;

document.getElementById("btn-wsp").href = waUrl("Hola Powertech, vengo desde la web y quiero hacer una consulta.");

function renderCombos(){
  document.getElementById("combos").innerHTML = combos.map(c => `
    <article class="bg-negro-tarjeta p-5 rounded-2xl border ${c.id==="c3"?"border-dorado":"border-gray-800"} flex flex-col justify-between shadow-xl card-hover">
      <div>
        <div class="flex justify-between items-start gap-2">
          <span class="bg-gray-700 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">${c.etiqueta}</span>
          <span class="text-2xl">${c.emoji}</span>
        </div>
        <h3 class="font-bold text-lg text-gray-100 mt-3">${c.nombre}</h3>
        <p class="text-xs text-gray-400 mt-1">${c.descripcion}</p>
        <ul class="text-xs text-gray-500 mt-4 space-y-1 bg-black p-3 rounded-lg border border-gray-950">
          ${c.items.map(x=>`<li>• ${x}</li>`).join("")}
        </ul>
      </div>
      <div class="mt-6">
        <p class="text-dorado font-black text-2xl">${c.precio ? money(c.precio) : "Consultar precio"}</p>
        <button onclick="agregarCombo('${c.id}')" class="w-full mt-3 bg-dorado text-black font-bold py-2 rounded-xl text-sm bg-dorado-hover transition shadow-lg">
          ${c.precio ? "Agregar al carrito" : "Consultar por WhatsApp"}
        </button>
      </div>
    </article>
  `).join("");
}

function renderProductos(){
  const q = document.getElementById("buscador").value.trim().toLowerCase();
  const cat = document.getElementById("filtroCategoria").value;
  const lista = productos.filter(p =>
    (cat==="todos" || p.categoria===cat) &&
    `${p.nombre} ${p.categoria} ${p.descripcion}`.toLowerCase().includes(q)
  );
  document.getElementById("sinResultados").classList.toggle("hidden", lista.length>0);
  document.getElementById("productos").innerHTML = lista.map(p => `
    <article class="bg-negro-tarjeta rounded-2xl border border-gray-800 overflow-hidden shadow-xl card-hover flex flex-col">
      <div class="product-img flex items-center justify-center text-7xl">${p.emoji}</div>
      <div class="p-5 flex-1 flex flex-col">
        <span class="text-[10px] uppercase tracking-wider text-gray-500">${p.categoria}</span>
        <h3 class="font-bold text-lg text-gray-100 mt-1">${p.nombre}</h3>
        <p class="text-xs text-gray-400 mt-2 flex-1">${p.descripcion}</p>
        <div class="flex items-end justify-between gap-3 mt-5">
          <strong class="text-dorado text-xl">${money(p.precio)}</strong>
          <button onclick="agregarProducto('${p.id}')" class="bg-dorado text-black font-black px-4 py-2 rounded-xl text-sm bg-dorado-hover">Agregar</button>
        </div>
      </div>
    </article>
  `).join("");
}

function agregarProducto(id){
  const p = productos.find(x=>x.id===id);
  const existente = carrito.find(x=>x.id===id);
  if(existente) existente.cantidad++;
  else carrito.push({id:p.id,nombre:p.nombre,precio:p.precio,cantidad:1});
  guardar();
  abrirCarrito();
  toast("Producto agregado al carrito");
}

function agregarCombo(id){
  const c = combos.find(x=>x.id===id);
  if(!c.precio){
    window.open(waUrl(`Hola Powertech! Quiero consultar el precio del "${c.nombre}".`), "_blank");
    return;
  }
  const existente = carrito.find(x=>x.id===id);
  if(existente) existente.cantidad++;
  else carrito.push({id:c.id,nombre:c.nombre,precio:c.precio,cantidad:1});
  guardar();
  abrirCarrito();
  toast("Combo agregado al carrito");
}

function cambiarCantidad(id, delta){
  const item = carrito.find(x=>x.id===id);
  if(!item) return;
  item.cantidad += delta;
  if(item.cantidad<=0) carrito = carrito.filter(x=>x.id!==id);
  guardar();
}

function eliminar(id){
  carrito = carrito.filter(x=>x.id!==id);
  guardar();
}

function guardar(){
  localStorage.setItem("powertechCarrito", JSON.stringify(carrito));
  renderCarrito();
}

function renderCarrito(){
  const cont = document.getElementById("carritoItems");
  const totalUnidades = carrito.reduce((a,x)=>a+x.cantidad,0);
  const total = carrito.reduce((a,x)=>a+x.precio*x.cantidad,0);
  document.getElementById("contadorCarrito").textContent = totalUnidades;
  document.getElementById("subtotal").textContent = money(total);

  if(!carrito.length){
    cont.innerHTML = `<div class="text-center py-16 text-gray-500"><div class="text-5xl mb-4">🛒</div><p>Tu carrito está vacío.</p></div>`;
  } else {
    cont.innerHTML = carrito.map(x=>`
      <div class="bg-black border border-gray-800 rounded-xl p-3">
        <div class="flex justify-between gap-3">
          <div>
            <p class="font-bold text-sm">${x.nombre}</p>
            <p class="text-dorado text-sm font-bold mt-1">${money(x.precio)}</p>
          </div>
          <button onclick="eliminar('${x.id}')" class="text-gray-600 hover:text-red-400">✕</button>
        </div>
        <div class="flex items-center gap-3 mt-3">
          <button onclick="cambiarCantidad('${x.id}',-1)" class="w-8 h-8 rounded-lg border border-gray-700">−</button>
          <span class="font-bold">${x.cantidad}</span>
          <button onclick="cambiarCantidad('${x.id}',1)" class="w-8 h-8 rounded-lg border border-gray-700">+</button>
          <span class="ml-auto text-sm font-bold">${money(x.precio*x.cantidad)}</span>
        </div>
      </div>
    `).join("");
  }

  const aviso = document.getElementById("minimoAviso");
  if(!carrito.length) aviso.textContent = "Agregá productos para comenzar.";
  else if(total < COMPRA_MINIMA) aviso.textContent = `Faltan ${money(COMPRA_MINIMA-total)} para alcanzar la compra mínima.`;
  else aviso.textContent = "✓ Pedido habilitado para finalizar.";
}

function abrirCarrito(){
  document.getElementById("carritoPanel").classList.remove("translate-x-full");
  document.getElementById("overlay").classList.remove("hidden");
  document.body.classList.add("no-scroll");
}
function cerrarCarrito(){
  document.getElementById("carritoPanel").classList.add("translate-x-full");
  document.getElementById("overlay").classList.add("hidden");
  document.body.classList.remove("no-scroll");
}

function finalizarPedido(){
  if(!carrito.length){ toast("El carrito está vacío"); return; }
  const total = carrito.reduce((a,x)=>a+x.precio*x.cantidad,0);
  if(total < COMPRA_MINIMA){
    toast(`La compra mínima es de ${money(COMPRA_MINIMA)}`);
    return;
  }
  const lineas = carrito.map(x=>`• ${x.cantidad} × ${x.nombre} — ${money(x.precio*x.cantidad)}`);
  const mensaje = `Hola Powertech! Quiero realizar el siguiente pedido:\n\n${lineas.join("\n")}\n\nTOTAL: ${money(total)}\n\nVengo desde la tienda web. ¿Cómo coordinamos el pago y envío?`;
  window.open(waUrl(mensaje), "_blank");
}

function toast(text){
  const t=document.getElementById("toast");
  t.textContent=text; t.classList.remove("hidden");
  clearTimeout(window.__toast);
  window.__toast=setTimeout(()=>t.classList.add("hidden"),2200);
}

document.getElementById("buscador").addEventListener("input", renderProductos);
document.getElementById("filtroCategoria").addEventListener("change", renderProductos);
document.getElementById("abrirCarrito").addEventListener("click", abrirCarrito);
document.getElementById("cerrarCarrito").addEventListener("click", cerrarCarrito);
document.getElementById("overlay").addEventListener("click", cerrarCarrito);
document.getElementById("finalizarPedido").addEventListener("click", finalizarPedido);

renderCombos();
renderProductos();
renderCarrito();

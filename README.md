# POWERTECH — Tienda online para GitHub Pages

Tienda estática lista para publicar en GitHub Pages, armada con HTML + CSS + JavaScript, sin backend.

## Incluye

- Diseño responsive para celular, tablet y PC.
- Identidad visual negra + dorado.
- Logo y fotos reales provistas para el catálogo.
- Buscador y filtro por categoría.
- Carrito con cantidades, subtotal y `localStorage`.
- Compra mínima configurable.
- Pedido final por WhatsApp.
- Sección de combos mayoristas.
- Sección "Cómo comprar".
- Sin base de datos ni servidor: ideal para GitHub Pages.

## Archivos

```text
index.html
style.css
script.js
assets/
  logo.png
  favicon.jpg
  cargador-45w.jpg
  cargador-auto.jpg
  auricular-p47.jpg
```

## 1. Subir a GitHub

1. Creá un repositorio, por ejemplo `powertech-tienda`.
2. Subí **todos los archivos y la carpeta `assets`** manteniendo la estructura.
3. Entrá a **Settings → Pages**.
4. En **Build and deployment**, elegí **Deploy from a branch**.
5. Seleccioná `main` y `/ (root)`.
6. Guardá y esperá la publicación.

## 2. Cambiar teléfono y compra mínima

Abrí `script.js` y editá:

```js
const CONFIG = {
  whatsapp: "5491171388777",
  compraMinima: 50000
};
```

El número debe estar en formato internacional, sin `+`, espacios ni guiones.

## 3. Cambiar productos y precios

Los productos están al principio de `script.js`, en la variable `productos`.

Ejemplo:

```js
{
  id: "p1",
  nombre: "Cargador 45W PD",
  categoria: "cargadores",
  precio: 8500,
  imagen: "assets/cargador-45w.jpg",
  descripcion: "Descripción del producto.",
  tag: "Más buscado"
}
```

**Importante:** los precios incluidos son de demostración y deben reemplazarse por tus precios reales.

## 4. Cambiar fotos

Colocá las nuevas fotos dentro de `assets/` y actualizá la propiedad `imagen` de cada producto.

## 5. Dominio propio

Cuando la tienda esté publicada, podés conectar un dominio propio desde GitHub Pages. La web no necesita hosting adicional.

## Nota

El checkout abre WhatsApp con el detalle del pedido. No procesa pagos automáticamente. El pago, stock y envío se confirman con el vendedor por WhatsApp.

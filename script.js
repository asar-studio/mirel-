const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz1-O1R1CcxjU1kvyMdpdKjkvaUOxMLoGvv8b3G-DpbXgeWBtrFPHYBENU0r-N-ME4s/exec";
const CURRENCY = "$";
const FREE_SIZE_NOTE = "Supplier recommendation: approximately 70–80 kg. Fit may vary.";

// Each entry is one available model + color. Keep image filenames in /image.
const products = [
  // Scarf Pants — 5 colors
  {id:1, model:"Scarf Pants", category:"pants", color:"Brown", image:"image/pants1-brown.jpg", price:25},
  {id:2, model:"Scarf Pants", category:"pants", color:"Green", image:"image/pants2-green.jpg", price:25},
  {id:3, model:"Scarf Pants", category:"pants", color:"Grey", image:"image/pants3-grey.jpg", price:25},
  {id:4, model:"Scarf Pants", category:"pants", color:"Black", image:"image/pants4-black.jpg", price:25},
  {id:5, model:"Scarf Pants", category:"pants", color:"Burgundy", image:"image/pants5-burgundy.jpg", price:25},

  // Sweetpants — 5 colors
  {id:6, model:"Sweetpants", category:"pants", color:"Grey", image:"image/pants6-grey.jpg", price:25},
  {id:7, model:"Sweetpants", category:"pants", color:"Green", image:"image/pants7-green.jpg", price:25},
  {id:8, model:"Sweetpants", category:"pants", color:"Black", image:"image/pants8-black.jpg", price:25},
  {id:9, model:"Sweetpants", category:"pants", color:"Burgundy", image:"image/pants9-burgundy.jpg", price:25},
  {id:10, model:"Sweetpants", category:"pants", color:"Brown", image:"image/pants10-brown.jpg", price:25},

  // Cammer Pants — 8 colors
  {id:11, model:"Cammer Pants", category:"pants", color:"Black", image:"image/pants11-black.jpg", price:25},
  {id:12, model:"Cammer Pants", category:"pants", color:"Green", image:"image/pants12-green.jpg", price:25},
  {id:13, model:"Cammer Pants", category:"pants", color:"Dark Blue", image:"image/pants13-dark-blue.jpg", price:25},
  {id:14, model:"Cammer Pants", category:"pants", color:"Grey", image:"image/pants14-grey.jpg", price:25},
  {id:15, model:"Cammer Pants", category:"pants", color:"Off White", image:"image/pants15-off-white.jpg", price:25},
  {id:16, model:"Cammer Pants", category:"pants", color:"Beige", image:"image/pants16-beige.jpg", price:25},
  {id:17, model:"Cammer Pants", category:"pants", color:"Brown", image:"image/pants17-brown.jpg", price:25},
  {id:18, model:"Cammer Pants", category:"pants", color:"Burgundy", image:"image/pants18-burgundy.jpg", price:25},

  // Zip Shirt — 8 colors
  {id:19, model:"Zip Shirt", category:"zip-shirts", color:"Brown", image:"image/zip-shirt1-brown.jpg", price:25},
  {id:20, model:"Zip Shirt", category:"zip-shirts", color:"Grey", image:"image/zip-shirt2-grey.jpg", price:25, alternateImage:"image/zip-shirt6-grey.jpg"},
  {id:21, model:"Zip Shirt", category:"zip-shirts", color:"Burgundy", image:"image/zip-shirt3-burgundy.jpg", price:25},
  {id:22, model:"Zip Shirt", category:"zip-shirts", color:"Off White", image:"image/zip-shirt4-off-white.jpg", price:25},
  {id:23, model:"Zip Shirt", category:"zip-shirts", color:"Green", image:"image/zip-shirt5-green.jpg", price:25},
  {id:24, model:"Zip Shirt", category:"zip-shirts", color:"Black", image:"image/zip-shirt7-black.jpg", price:25},
  {id:25, model:"Zip Shirt", category:"zip-shirts", color:"Red", image:"image/zip-shirt8-red.jpg", price:25},
  {id:26, model:"Zip Shirt", category:"zip-shirts", color:"Beige", image:"image/zip-shirt9-beige.jpg", price:25}
];

let cart = [];
let selectedProductId = null;
let selectedOptionQuantity = 1;
let toastTimer = null;
let orderSubmitting = false;

const money = amount => `${CURRENCY}${Number(amount || 0).toFixed(2)}`;
const getProduct = id => products.find(product => product.id === Number(id));
const getModelProducts = model => products.filter(product => product.model === model);

function renderProducts(category = "all") {
  const grid = document.getElementById("product-grid");
  if (!grid) return;
  const visible = category === "all" ? products : products.filter(product => product.category === category);
  grid.innerHTML = visible.map(product => `
    <article class="product-card" data-product-id="${product.id}" data-category="${product.category}" tabindex="0" role="button" aria-label="View ${product.model}, ${product.color}" onclick="openProductOptions(${product.id})" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openProductOptions(${product.id})}">
      <div class="product-image-wrap">
        <img class="product-image" src="${product.image}" alt="${product.model} - ${product.color}" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/600x800/f1e9e7/9c5369?text=Mirel';">
        <span class="product-tag">${product.category === "pants" ? "PANTS" : "ZIP SHIRT"}</span>
      </div>
      <div class="product-info">
        <div><h3>${product.model}</h3><span class="product-category">${product.color.toUpperCase()} · FREE SIZE</span></div>
        <span class="product-price">${money(product.price)}</span>
      </div>
      <button class="product-open" type="button" onclick="event.stopPropagation();openProductOptions(${product.id})">VIEW PRODUCT</button>
    </article>`).join("");
}

function filterProducts(category, button) {
  document.querySelectorAll(".filter-btn").forEach(item => item.classList.toggle("active", item === button));
  renderProducts(category);
}

function openProductOptions(productId) {
  const product = getProduct(productId);
  if (!product) return;
  selectedProductId = product.id;
  selectedOptionQuantity = 1;
  updateProductModal(product);
  document.getElementById("option-quantity").textContent = "1";
  document.getElementById("options-overlay").classList.add("show");
  document.getElementById("options-modal").classList.add("show");
  updateBodyScroll();
}

function updateProductModal(product) {
  const image = document.getElementById("options-product-image");
  image.src = product.image;
  image.alt = `${product.model} - ${product.color}`;
  image.onerror = function () { this.onerror = null; this.src = product.alternateImage || "https://placehold.co/600x800/f1e9e7/9c5369?text=Mirel"; };
  document.getElementById("options-product-name").textContent = product.model;
  document.getElementById("options-product-price").textContent = money(product.price);
  document.getElementById("selected-color-label").textContent = product.color;

  const colorContainer = document.getElementById("color-options-container");
  colorContainer.innerHTML = getModelProducts(product.model).map(variant => `
    <button type="button" class="color-option ${variant.id === product.id ? "selected" : ""}" data-color="${variant.color}" aria-pressed="${variant.id === product.id}" onclick="selectColor(${variant.id})">${variant.color}</button>
  `).join("");
}

function closeProductOptions() {
  document.getElementById("options-overlay").classList.remove("show");
  document.getElementById("options-modal").classList.remove("show");
  selectedProductId = null;
  updateBodyScroll();
}

function selectColor(productId) {
  const product = getProduct(productId);
  if (!product || !selectedProductId) return;
  const current = getProduct(selectedProductId);
  if (!current || current.model !== product.model) return;
  selectedProductId = product.id;
  updateProductModal(product);
}

function changeOptionQuantity(change) {
  selectedOptionQuantity = Math.max(1, Math.min(20, selectedOptionQuantity + Number(change)));
  document.getElementById("option-quantity").textContent = String(selectedOptionQuantity);
}

function confirmProductSelection() {
  const product = getProduct(selectedProductId);
  if (!product) return;
  addToCart(product, selectedOptionQuantity);
  closeProductOptions();
  showToast("Added to bag ✓");
}

function addToCart(product, quantity = 1) {
  const existing = cart.find(item => item.id === product.id);
  if (existing) existing.quantity += quantity;
  else cart.push({
    id: product.id,
    model: product.model,
    name: product.model,
    category: product.category,
    price: product.price,
    size: "Free Size",
    color: product.color,
    image: product.image,
    quantity
  });
  saveCart();
  updateCart();
}

function saveCart() {
  try { localStorage.setItem("mirelCart", JSON.stringify(cart)); }
  catch (error) { console.warn("Could not save cart:", error); }
}

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem("mirelCart") || "[]");
    if (!Array.isArray(saved)) return;
    cart = saved.map(item => {
      const product = getProduct(item.id);
      if (!product) return null;
      return { id: product.id, model: product.model, name: product.model, category: product.category, price: product.price, size: "Free Size", color: product.color, image: product.image, quantity: Math.max(1, Number(item.quantity) || 1) };
    }).filter(Boolean);
  } catch (error) {
    cart = [];
    console.warn("Could not load cart:", error);
  }
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== Number(productId));
  saveCart();
  updateCart();
}

function changeQuantity(productId, change) {
  const item = cart.find(entry => entry.id === Number(productId));
  if (!item) return;
  item.quantity += Number(change);
  if (item.quantity <= 0) return removeFromCart(productId);
  saveCart();
  updateCart();
}

function updateCart() {
  const cartItems = document.getElementById("cart-items");
  if (!cartItems) return;
  cartItems.innerHTML = "";
  let total = 0;
  let count = 0;

  if (!cart.length) {
    cartItems.innerHTML = '<p class="empty-cart">Your bag is waiting for something lovely.</p>';
  } else {
    cart.forEach(item => {
      total += item.price * item.quantity;
      count += item.quantity;
      const row = document.createElement("div");
      row.className = "cart-item";
      const img = document.createElement("img");
      img.src = item.image;
      img.alt = `${item.model} - ${item.color}`;
      img.onerror = function () { this.onerror = null; this.src = "https://placehold.co/160x200/f1e9e7/9c5369?text=Mirel"; };
      const info = document.createElement("div");
      info.className = "cart-item-info";
      const heading = document.createElement("h3");
      heading.textContent = item.model;
      const meta = document.createElement("p");
      meta.textContent = `Size: Free Size · Color: ${item.color}`;
      const price = document.createElement("p");
      price.className = "cart-item-price";
      price.textContent = money(item.price);
      const actions = document.createElement("div");
      actions.className = "cart-item-actions";
      const minus = document.createElement("button");
      minus.type = "button"; minus.textContent = "−"; minus.setAttribute("aria-label", "Decrease quantity");
      minus.addEventListener("click", () => changeQuantity(item.id, -1));
      const qty = document.createElement("span"); qty.textContent = String(item.quantity);
      const plus = document.createElement("button");
      plus.type = "button"; plus.textContent = "+"; plus.setAttribute("aria-label", "Increase quantity");
      plus.addEventListener("click", () => changeQuantity(item.id, 1));
      actions.append(minus, qty, plus);
      const remove = document.createElement("button");
      remove.type = "button"; remove.className = "remove-item"; remove.textContent = "Remove";
      remove.addEventListener("click", () => removeFromCart(item.id));
      info.append(heading, meta, price, actions, remove);
      row.append(img, info);
      cartItems.appendChild(row);
    });
  }

  const countNode = document.getElementById("cart-count");
  const totalNode = document.getElementById("cart-total");
  const checkoutTotal = document.getElementById("checkout-total");
  if (countNode) countNode.textContent = String(count);
  if (totalNode) totalNode.textContent = money(total);
  if (checkoutTotal) checkoutTotal.textContent = money(total);
}

function openCart() {
  document.getElementById("cart-overlay").classList.add("show");
  document.getElementById("cart-panel").classList.add("show");
  updateCart();
  updateBodyScroll();
}

function closeCart() {
  document.getElementById("cart-overlay").classList.remove("show");
  document.getElementById("cart-panel").classList.remove("show");
  updateBodyScroll();
}

function openCheckout() {
  if (!cart.length) { showToast("Your bag is empty."); return; }
  closeCart();
  document.getElementById("checkout-overlay").classList.add("show");
  document.getElementById("checkout-modal").classList.add("show");
  updateCart();
  updateBodyScroll();
}

function closeCheckout() {
  document.getElementById("checkout-overlay").classList.remove("show");
  document.getElementById("checkout-modal").classList.remove("show");
  updateBodyScroll();
  resetPlaceOrderButton();
}

function updateBodyScroll() {
  const anyOpen = document.querySelector(".options-modal.show, .cart-panel.show, .checkout-modal.show");
  document.body.classList.toggle("no-scroll", Boolean(anyOpen));
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function resetPlaceOrderButton() {
  const button = document.getElementById("place-order-button");
  if (!button) return;
  button.disabled = false;
  button.innerHTML = 'Place order <span>↗</span>';
}

async function placeOrder(event) {
  event.preventDefault();
  if (orderSubmitting) return;
  if (!cart.length) { showToast("Your bag is empty."); return; }
  const form = document.getElementById("checkout-form");
  if (!form || !form.reportValidity()) return;
  const data = new FormData(form);
  const order = {
    brand: "Mirel",
    category: "Women's Fashion",
    customer: {
      fullName: String(data.get("name") || "").trim(),
      phone1: String(data.get("phone") || "").trim(),
      phone2: String(data.get("secondPhone") || "").trim()
    },
    address: {
      city: String(data.get("city") || "").trim(),
      street: String(data.get("street") || "").trim(),
      building: String(data.get("building") || "").trim(),
      floor: String(data.get("floor") || "").trim(),
      apartment: String(data.get("apartment") || "").trim(),
      extra: String(data.get("extraAddress") || "").trim()
    },
    paymentMethod: String(data.get("payment") || ""),
    items: cart.map(item => ({ id:item.id, name:item.model, model:item.model, category:item.category, price:item.price, size:item.size, color:item.color, image:item.image, quantity:item.quantity })),
    total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  };

  orderSubmitting = true;
  const button = document.getElementById("place-order-button");
  button.disabled = true;
  button.textContent = "Sending order...";
  try {
    // no-cors returns an opaque response; it confirms dispatch, not spreadsheet receipt.
    await fetch(SCRIPT_URL, { method:"POST", mode:"no-cors", body:JSON.stringify(order) });
    cart = [];
    saveCart();
    updateCart();
    form.reset();
    closeCheckout();
    showToast("Order request sent. We'll contact you soon ♡");
  } catch (error) {
    console.error("Order request error:", error);
    showToast("Could not send the order. Please try again.");
  } finally {
    orderSubmitting = false;
    resetPlaceOrderButton();
  }
}

document.addEventListener("keydown", event => {
  if (event.key !== "Escape") return;
  closeProductOptions();
  closeCart();
  closeCheckout();
});

document.addEventListener("DOMContentLoaded", () => {
  loadCart();
  renderProducts();
  updateCart();
});

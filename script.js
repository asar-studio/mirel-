// =========================
// FRONT / BACK IMAGES
// =========================

const imageSets = {
    2: [
        "image/work2-front.jpg",
        "image/work2-back.jpg"
    ],

    7: [
        "image/work7-front.jpg",
        "image/work7-back.jpg"
    ],

    9: [
        "image/work9-front.jpg",
        "image/work9-back.jpg"
    ],

    11: [
        "image/work11-front.jpg",
        "image/work11-back.jpg"
    ],

    13: [
        "image/work13-front.jpg",
        "image/work13-back.jpg"
    ],

    17: [
        "image/work17-front.jpg",
        "image/work17-back.jpg"
    ]
};

const currentImage = {
    2: 0,
    7: 0,
    9: 0,
    11: 0,
    13: 0,
    17: 0
};

function changeImage(id, direction) {

    const img =
        document.getElementById(`product-image-${id}`);

    if (!img || !imageSets[id]) {
        return;
    }

    const images = imageSets[id];

    currentImage[id] =
        (currentImage[id] + direction + images.length) %
        images.length;

    img.src = images[currentImage[id]];

    img.alt =
        currentImage[id] === 0
            ? "T-Shirt Front"
            : "T-Shirt Back";
}


// =========================
// PRODUCTS
// =========================

const products = [];

for (let i = 1; i <= 22; i++) {

    products.push({
        id: i,
        name: "T-Shirt",
        price: 25
    });
}


// =========================
// CART
// =========================

let cart = [];


// =========================
// ADD TO CART
// =========================

function addToCart(productId, button = null) {

    const product =
        products.find(item => item.id === productId);

    if (!product) {
        return;
    }

    const existingItem =
        cart.find(item => item.id === productId);

    if (existingItem) {

        existingItem.quantity += 1;

    } else {

        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    updateCart();

    if (button) {

        const oldText =
            button.textContent;

        button.textContent = "Added ✓";
        button.classList.add("added");

        setTimeout(() => {

            button.textContent = oldText;
            button.classList.remove("added");

        }, 1000);
    }
}


// =========================
// REMOVE FROM CART
// =========================

function removeFromCart(productId) {

    cart =
        cart.filter(item => item.id !== productId);

    updateCart();
}


// =========================
// CHANGE QUANTITY
// =========================

function changeQuantity(productId, change) {

    const item =
        cart.find(item => item.id === productId);

    if (!item) {
        return;
    }

    item.quantity += change;

    if (item.quantity <= 0) {

        removeFromCart(productId);
        return;
    }

    updateCart();
}


// =========================
// UPDATE CART
// =========================

function updateCart() {

    const cartItems =
        document.getElementById("cart-items");

    const cartCount =
        document.getElementById("cart-count");

    const cartTotal =
        document.getElementById("cart-total");

    const checkoutTotal =
        document.getElementById("checkout-total");

    if (!cartItems) {
        return;
    }

    cartItems.innerHTML = "";

    let total = 0;
    let count = 0;


    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p class="empty-cart">
                Your cart is empty.
            </p>
        `;

    } else {

        cart.forEach(item => {

            const itemTotal =
                item.price * item.quantity;

            total += itemTotal;
            count += item.quantity;

            const cartItem =
                document.createElement("div");

            cartItem.className = "cart-item";

            cartItem.innerHTML = `
                <div>
                    <h4>${item.name}</h4>
                    <p>$${item.price}</p>
                </div>

                <div class="quantity-controls">

                    <button
                        type="button"
                        onclick="changeQuantity(${item.id}, -1)">
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        type="button"
                        onclick="changeQuantity(${item.id}, 1)">
                        +
                    </button>

                </div>
            `;

            cartItems.appendChild(cartItem);
        });
    }


    if (cartCount) {
        cartCount.textContent = count;
    }

    if (cartTotal) {
        cartTotal.textContent = total;
    }

    if (checkoutTotal) {
        checkoutTotal.textContent = total;
    }
}


// =========================
// OPEN CART
// =========================

function openCart() {

    const overlay =
        document.getElementById("cart-overlay");

    const panel =
        document.getElementById("cart-panel");

    if (overlay) {
        overlay.classList.add("show");
    }

    if (panel) {
        panel.classList.add("open");
    }

    updateCart();
}


// =========================
// CLOSE CART
// =========================

function closeCart() {

    const overlay =
        document.getElementById("cart-overlay");

    const panel =
        document.getElementById("cart-panel");

    if (overlay) {
        overlay.classList.remove("show");
    }

    if (panel) {
        panel.classList.remove("open");
    }
}


// =========================
// OPEN CHECKOUT
// =========================

function openCheckout() {

    if (cart.length === 0) {

        alert("Your cart is empty.");
        return;
    }

    closeCart();

    const checkout =
        document.getElementById("checkout-content");

    if (checkout) {
        checkout.classList.add("show");
    }

    updateCart();
}


// =========================
// CLOSE CHECKOUT
// =========================

function closeCheckout() {

    const checkout =
        document.getElementById("checkout-content");

    if (checkout) {
        checkout.classList.remove("show");
    }
}


// =========================
// GOOGLE APPS SCRIPT
// =========================

const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbz1-O1R1CcxjU1kvyMdpdKjkvaUOxMLoGvv8b3G-DpbXgeWBtrFPHYBENU0rN-ME4s/exec";


// =========================
// PLACE ORDER
// =========================

async function placeOrder(event) {

    event.preventDefault();

    if (cart.length === 0) {

        alert("Your cart is empty.");
        return;
    }


    const fullName =
        document.getElementById("full-name");

    const phone1 =
        document.getElementById("phone1");

    const phone2 =
        document.getElementById("phone2");

    const street =
        document.getElementById("street");

    const building =
        document.getElementById("building");

    const floor =
        document.getElementById("floor");

    const apartment =
        document.getElementById("apartment");

    const city =
        document.getElementById("city");

    const extraAddress =
        document.getElementById("extra-address");

    const payment =
        document.querySelector(
            'input[name="payment"]:checked'
        );


    if (
        !fullName.value.trim() ||
        !phone1.value.trim() ||
        !street.value.trim() ||
        !building.value.trim() ||
        !floor.value.trim() ||
        !apartment.value.trim() ||
        !city.value.trim()
    ) {

        alert(
            "Please fill in all required fields."
        );

        return;
    }


    if (!payment) {

        alert(
            "Please select a payment method."
        );

        return;
    }


    const order = {

        customer: {

            fullName:
                fullName.value.trim(),

            phone1:
                phone1.value.trim(),

            phone2:
                phone2.value.trim()
        },


        address: {

            street:
                street.value.trim(),

            building:
                building.value.trim(),

            floor:
                floor.value.trim(),

            apartment:
                apartment.value.trim(),

            city:
                city.value.trim(),

            extra:
                extraAddress.value.trim()
        },


        paymentMethod:
            payment.value,


        items:
            cart.map(item => ({

                id:
                    item.id,

                name:
                    item.name,

                price:
                    item.price,

                quantity:
                    item.quantity
            })),


        total:
            cart.reduce(
                (sum, item) =>
                    sum + item.price * item.quantity,
                0
            )
    };


    try {

        await fetch(SCRIPT_URL, {

            method: "POST",

            mode: "no-cors",

            body: JSON.stringify(order)
        });


        alert(
            "Order placed successfully! Thank you for shopping with Asar."
        );


        cart = [];

        updateCart();


        const form =
            document.getElementById("checkout-form");

        if (form) {
            form.reset();
        }


        closeCheckout();


    } catch (error) {

        console.error(
            "Order error:",
            error
        );

        alert(
            "Something went wrong. Please try again."
        );
    }
}


// =========================
// INITIALIZE
// =========================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateCart();

    }
);

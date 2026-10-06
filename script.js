// ======================================================
// MIREL — WOMEN'S FASHION
// ======================================================


// ======================================================
// GOOGLE APPS SCRIPT
// ======================================================

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz1-O1R1CcxjU1kvyMdpdKjkvaUOxMLoGvv8b3G-DpbXgeWBtrFPHYBENU0rN-ME4s/exec";


// ======================================================
// PRODUCT IMAGES
// ======================================================

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


// ======================================================
// CHANGE PRODUCT IMAGE
// ======================================================

function changeImage(id, direction) {

    const img =
        document.getElementById(
            `product-image-${id}`
        );

    if (!img || !imageSets[id]) {
        return;
    }

    const images = imageSets[id];

    currentImage[id] =
        (
            currentImage[id] +
            direction +
            images.length
        ) % images.length;

    img.src =
        images[currentImage[id]];

    img.alt =
        currentImage[id] === 0
            ? "Mirel Women's Fashion Front"
            : "Mirel Women's Fashion Back";
}


// ======================================================
// PRODUCTS
// ======================================================

const products = [];

for (let i = 1; i <= 22; i++) {

    products.push({

        id: i,

        name: "Mirel Top",

        price: 25

    });

}


// ======================================================
// CART
// ======================================================

let cart = [];


// ======================================================
// PRODUCT OPTIONS
// ======================================================

let selectedProductId = null;

let selectedSize = null;

let selectedColor = null;

let selectedOptionQuantity = 1;


// ======================================================
// ORDER LOCK
// ======================================================

let orderSubmitting = false;


// ======================================================
// OPEN PRODUCT OPTIONS
// ======================================================

function openProductOptions(productId) {

    productId =
        Number(productId);

    const product =
        products.find(
            item => item.id === productId
        );

    if (!product) {
        return;
    }


    selectedProductId =
        productId;

    selectedSize =
        null;

    selectedColor =
        null;

    selectedOptionQuantity =
        1;


    const card =
        document.querySelector(
            `.product-card[data-product-id="${productId}"]`
        );


    const productImage =
        card
            ? card.querySelector(".product-image")
            : null;


    const optionsImage =
        document.getElementById(
            "options-product-image"
        );


    const optionsName =
        document.getElementById(
            "options-product-name"
        );


    const optionsPrice =
        document.getElementById(
            "options-product-price"
        );


    const optionsQuantity =
        document.getElementById(
            "options-quantity"
        );


    if (
        optionsImage &&
        productImage
    ) {

        optionsImage.src =
            productImage.src;

        optionsImage.alt =
            "Mirel Women's Fashion";

    }


    if (optionsName) {

        optionsName.textContent =
            product.name;

    }


    if (optionsPrice) {

        optionsPrice.textContent =
            product.price;

    }


    if (optionsQuantity) {

        optionsQuantity.textContent =
            selectedOptionQuantity;

    }


    document
        .querySelectorAll(".size-option")
        .forEach(button => {

            button.classList.remove(
                "selected"
            );

        });


    document
        .querySelectorAll(".color-option")
        .forEach(button => {

            button.classList.remove(
                "selected"
            );

        });


    const overlay =
        document.getElementById(
            "product-options-overlay"
        );


    const modal =
        document.getElementById(
            "product-options"
        );


    if (overlay) {

        overlay.classList.add(
            "active"
        );

    }


    if (modal) {

        modal.classList.add(
            "active"
        );

    }


    document.body.style.overflow =
        "hidden";

}


// ======================================================
// CLOSE PRODUCT OPTIONS
// ======================================================

function closeProductOptions() {

    const overlay =
        document.getElementById(
            "product-options-overlay"
        );


    const modal =
        document.getElementById(
            "product-options"
        );


    if (overlay) {

        overlay.classList.remove(
            "active"
        );

    }


    if (modal) {

        modal.classList.remove(
            "active"
        );

    }


    document.body.style.overflow =
        "";


    selectedProductId =
        null;

    selectedSize =
        null;

    selectedColor =
        null;

    selectedOptionQuantity =
        1;

}


// ======================================================
// SELECT SIZE
// ======================================================

function selectSize(size) {

    selectedSize =
        size;


    document
        .querySelectorAll(".size-option")
        .forEach(button => {

            button.classList.remove(
                "selected"
            );

            if (
                button.textContent.trim() ===
                size
            ) {

                button.classList.add(
                    "selected"
                );

            }

        });

}


// ======================================================
// SELECT COLOR
// ======================================================

function selectColor(color) {

    selectedColor =
        color;


    document
        .querySelectorAll(".color-option")
        .forEach(button => {

            button.classList.remove(
                "selected"
            );

        });


    const button =
        document.querySelector(
            `.color-option[data-color="${color}"]`
        );


    if (button) {

        button.classList.add(
            "selected"
        );

    }

}


// ======================================================
// OPTION QUANTITY
// ======================================================

function changeOptionQuantity(change) {

    selectedOptionQuantity +=
        Number(change);


    if (
        selectedOptionQuantity < 1
    ) {

        selectedOptionQuantity =
            1;

    }


    if (
        selectedOptionQuantity > 20
    ) {

        selectedOptionQuantity =
            20;

    }


    const quantity =
        document.getElementById(
            "options-quantity"
        );


    if (quantity) {

        quantity.textContent =
            selectedOptionQuantity;

    }

}


// ======================================================
// CONFIRM PRODUCT
// ======================================================

function confirmProductSelection() {

    if (!selectedProductId) {
        return;
    }


    if (!selectedSize) {

        alert(
            "Please select a size."
        );

        return;

    }


    if (!selectedColor) {

        alert(
            "Please select a color."
        );

        return;

    }


    addToCart(

        selectedProductId,

        null,

        selectedSize,

        selectedColor,

        selectedOptionQuantity

    );


    closeProductOptions();


    showToast(
        "Added to cart ✓"
    );

}


// ======================================================
// ADD TO CART
// ======================================================

function addToCart(

    productId,

    button = null,

    size = null,

    color = null,

    quantity = 1

) {

    productId =
        Number(productId);


    const product =
        products.find(
            item => item.id === productId
        );


    if (!product) {
        return;
    }


    const existingItem =
        cart.find(item =>

            item.id === productId &&

            item.size === size &&

            item.color === color

        );


    if (existingItem) {

        existingItem.quantity +=
            Number(quantity);

    } else {

        cart.push({

            id:
                product.id,

            name:
                product.name,

            price:
                product.price,

            size:
                size,

            color:
                color,

            quantity:
                Number(quantity)

        });

    }


    saveCart();

    updateCart();


    if (button) {

        const oldText =
            button.textContent;


        button.textContent =
            "Added ✓";


        button.classList.add(
            "added"
        );


        setTimeout(() => {

            button.textContent =
                oldText;

            button.classList.remove(
                "added"
            );

        }, 1000);

    }

}


// ======================================================
// SAVE CART
// ======================================================

function saveCart() {

    try {

        localStorage.setItem(

            "mirelCart",

            JSON.stringify(cart)

        );

    } catch (error) {

        console.warn(
            "Could not save cart:",
            error
        );

    }

}


// ======================================================
// LOAD CART
// ======================================================

function loadCart() {

    try {

        const savedCart =
            localStorage.getItem(
                "mirelCart"
            );


        if (!savedCart) {
            return;
        }


        const parsed =
            JSON.parse(savedCart);


        if (Array.isArray(parsed)) {

            cart =
                parsed;

        }

    } catch (error) {

        cart = [];

        console.warn(
            "Could not load cart:",
            error
        );

    }

}


// ======================================================
// REMOVE FROM CART
// ======================================================

function removeFromCart(

    productId,

    size,

    color

) {

    productId =
        Number(productId);


    cart =
        cart.filter(item =>

            !(
                item.id === productId &&

                item.size === size &&

                item.color === color
            )

        );


    saveCart();

    updateCart();

}


// ======================================================
// CHANGE CART QUANTITY
// ======================================================

function changeQuantity(

    productId,

    change,

    size,

    color

) {

    productId =
        Number(productId);


    const item =
        cart.find(item =>

            item.id === productId &&

            item.size === size &&

            item.color === color

        );


    if (!item) {
        return;
    }


    item.quantity +=
        Number(change);


    if (
        item.quantity <= 0
    ) {

        removeFromCart(

            productId,

            size,

            color

        );

        return;

    }


    saveCart();

    updateCart();

}


// ======================================================
// GET PRODUCT IMAGE
// ======================================================

function getProductImage(productId) {

    const card =
        document.querySelector(
            `.product-card[data-product-id="${productId}"]`
        );


    const image =
        card
            ? card.querySelector(".product-image")
            : null;


    return image
        ? image.src
        : "";

}


// ======================================================
// UPDATE CART
// ======================================================

function updateCart() {

    const cartItems =
        document.getElementById(
            "cart-items"
        );


    const cartCount =
        document.getElementById(
            "cart-count"
        );


    const cartTotal =
        document.getElementById(
            "cart-total"
        );


    const checkoutTotal =
        document.getElementById(
            "checkout-total"
        );


    if (!cartItems) {
        return;
    }


    cartItems.innerHTML =
        "";


    let total =
        0;

    let count =
        0;


    if (cart.length === 0) {

        cartItems.innerHTML = `

            <p class="empty-cart">
                Your cart is empty.
            </p>

        `;

    } else {

        cart.forEach(item => {

            const itemTotal =
                Number(item.price) *
                Number(item.quantity);


            total +=
                itemTotal;


            count +=
                Number(item.quantity);


            const cartItem =
                document.createElement(
                    "div"
                );


            cartItem.className =
                "cart-item";


            const image =
                getProductImage(
                    item.id
                );


            cartItem.innerHTML = `

                ${
                    image
                        ? `
                            <img
                                src="${image}"
                                class="cart-item-image"
                                alt="${item.name}"
                            >
                          `
                        : ""
                }


                <div class="cart-item-info">

                    <h3>
                        ${item.name}
                    </h3>


                    <p class="cart-item-meta">
                        Size: ${item.size}
                        ·
                        Color: ${item.color}
                    </p>


                    <p class="cart-item-price">
                        $${item.price}
                    </p>


                    <div class="cart-quantity">

                        <button
                            type="button"
                            onclick="changeQuantity(
                                ${item.id},
                                -1,
                                '${item.size}',
                                '${item.color}'
                            )"
                        >
                            −
                        </button>


                        <span>
                            ${item.quantity}
                        </span>


                        <button
                            type="button"
                            onclick="changeQuantity(
                                ${item.id},
                                1,
                                '${item.size}',
                                '${item.color}'
                            )"
                        >
                            +
                        </button>

                    </div>


                    <button
                        type="button"
                        class="remove-item"
                        onclick="removeFromCart(
                            ${item.id},
                            '${item.size}',
                            '${item.color}'
                        )"
                    >
                        Remove
                    </button>

                </div>

            `;


            cartItems.appendChild(
                cartItem
            );

        });

    }


    if (cartCount) {

        cartCount.textContent =
            count;

    }


    if (cartTotal) {

        cartTotal.textContent =
            total.toFixed(2);

    }


    if (checkoutTotal) {

        checkoutTotal.textContent =
            total.toFixed(2);

    }

}


// ======================================================
// OPEN CART
// ======================================================

function openCart() {

    const overlay =
        document.getElementById(
            "cart-overlay"
        );


    const panel =
        document.getElementById(
            "cart-panel"
        );


    if (overlay) {

        overlay.classList.add(
            "active"
        );

    }


    if (panel) {

        panel.classList.add(
            "active"
        );

    }


    updateCart();

}


// ======================================================
// CLOSE CART
// ======================================================

function closeCart() {

    const overlay =
        document.getElementById(
            "cart-overlay"
        );


    const panel =
        document.getElementById(
            "cart-panel"
        );


    if (overlay) {

        overlay.classList.remove(
            "active"
        );

    }


    if (panel) {

        panel.classList.remove(
            "active"
        );

    }

}


// ======================================================
// OPEN CHECKOUT
// ======================================================

function openCheckout() {

    if (cart.length === 0) {

        alert(
            "Your cart is empty."
        );

        return;

    }


    closeCart();


    const checkout =
        document.getElementById(
            "checkout-content"
        );


    if (checkout) {

        checkout.classList.add(
            "active"
        );


        checkout.scrollIntoView({

            behavior:
                "smooth",

            block:
                "start"

        });

    }


    updateCart();

}


// ======================================================
// CLOSE CHECKOUT
// ======================================================

function closeCheckout() {

    const checkout =
        document.getElementById(
            "checkout-content"
        );


    if (checkout) {

        checkout.classList.remove(
            "active"
        );

    }


    resetPlaceOrderButton();

}


// ======================================================
// TOAST
// ======================================================

function showToast(message) {

    let toast =
        document.getElementById(
            "mirel-toast"
        );


    if (!toast) {

        toast =
            document.createElement(
                "div"
            );


        toast.id =
            "mirel-toast";


        toast.style.position =
            "fixed";


        toast.style.left =
            "50%";


        toast.style.bottom =
            "25px";


        toast.style.transform =
            "translate(-50%, 20px)";


        toast.style.background =
            "#9c5369";


        toast.style.color =
            "#ffffff";


        toast.style.padding =
            "12px 22px";


        toast.style.borderRadius =
            "30px";


        toast.style.fontSize =
            "12px";


        toast.style.zIndex =
            "9999";


        toast.style.opacity =
            "0";


        toast.style.pointerEvents =
            "none";


        toast.style.transition =
            "0.3s ease";


        document.body.appendChild(
            toast
        );

    }


    toast.textContent =
        message;


    requestAnimationFrame(() => {

        toast.style.opacity =
            "1";


        toast.style.transform =
            "translate(-50%, 0)";

    });


    clearTimeout(
        toast._timer
    );


    toast._timer =
        setTimeout(() => {

            toast.style.opacity =
                "0";


            toast.style.transform =
                "translate(-50%, 20px)";

        }, 1800);

}


// ======================================================
// RESET PLACE ORDER BUTTON
// ======================================================

function resetPlaceOrderButton() {

    const button =
        document.getElementById(
            "place-order-button"
        );


    if (!button) {
        return;
    }


    button.disabled =
        false;


    button.textContent =
        "Place Order";

}


// ======================================================
// PLACE ORDER
// ======================================================

async function placeOrder(event) {

    event.preventDefault();


    if (orderSubmitting) {
        return;
    }


    if (cart.length === 0) {

        alert(
            "Your cart is empty."
        );

        return;

    }


    const fullName =
        document.getElementById(
            "full-name"
        );


    const phone1 =
        document.getElementById(
            "phone1"
        );


    const phone2 =
        document.getElementById(
            "phone2"
        );


    const street =
        document.getElementById(
            "street"
        );


    const building =
        document.getElementById(
            "building"
        );


    const floor =
        document.getElementById(
            "floor"
        );


    const apartment =
        document.getElementById(
            "apartment"
        );


    const city =
        document.getElementById(
            "city"
        );


    const extraAddress =
        document.getElementById(
            "extra-address"
        );


    const payment =
        document.querySelector(
            'input[name="payment"]:checked'
        );


    if (
        !fullName ||
        !phone1 ||
        !street ||
        !building ||
        !floor ||
        !apartment ||
        !city
    ) {

        alert(
            "Please fill in the required fields."
        );

        return;

    }


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


    orderSubmitting =
        true;


    const button =
        document.getElementById(
            "place-order-button"
        );


    if (button) {

        button.disabled =
            true;


        button.textContent =
            "Processing...";

    }


    const order = {

        brand:
            "Mirel",


        category:
            "Women's Fashion",


        customer: {

            fullName:
                fullName.value.trim(),

            phone1:
                phone1.value.trim(),

            phone2:
                phone2
                    ? phone2.value.trim()
                    : ""

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
                extraAddress
                    ? extraAddress.value.trim()
                    : ""

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
                    Number(item.price),

                size:
                    item.size || "",

                color:
                    item.color || "",

                quantity:
                    Number(item.quantity) || 1

            })),


        total:
            cart.reduce(

                (sum, item) =>

                    sum +
                    (
                        Number(item.price) *
                        Number(item.quantity)
                    ),

                0

            )

    };


    console.log(
        "MIREL ORDER:",
        order
    );


    try {

        /*
         * Google Apps Script Web Apps work reliably
         * with text/plain requests.
         */

        await fetch(

            SCRIPT_URL,

            {

                method:
                    "POST",

                mode:
                    "no-cors",

                headers: {

                    "Content-Type":
                        "text/plain;charset=utf-8"

                },

                body:
                    JSON.stringify(order)

            }

        );


        /*
         * Because no-cors does not expose the
         * Google response, reaching this point
         * means the browser sent the request.
         */

        cart =
            [];


        saveCart();

        updateCart();


        const form =
            document.getElementById(
                "checkout-form"
            );


        if (form) {

            form.reset();

        }


        closeCheckout();


        showToast(
            "Order placed successfully ♡"
        );


    } catch (error) {

        console.error(
            "MIREL ORDER ERROR:",
            error
        );


        alert(
            "Something went wrong. Please try again."
        );


        orderSubmitting =
            false;


        resetPlaceOrderButton();


        return;

    }


    orderSubmitting =
        false;


    resetPlaceOrderButton();

}


// ======================================================
// PRODUCT CARD EVENTS
// ======================================================

function setupProductCards() {

    document
        .querySelectorAll(".product-card")
        .forEach(card => {

            const productId =
                Number(
                    card.dataset.productId
                );


            if (!productId) {
                return;
            }


            card.addEventListener(
                "click",
                function(event) {

                    if (
                        event.target.closest(
                            ".image-arrow"
                        )
                    ) {

                        return;

                    }


                    openProductOptions(
                        productId
                    );

                }
            );


            const viewButton =
                card.querySelector(
                    ".add-cart"
                );


            if (viewButton) {

                viewButton.addEventListener(
                    "click",
                    function(event) {

                        event.preventDefault();

                        event.stopPropagation();


                        openProductOptions(
                            productId
                        );

                    }
                );

            }

        });

}


// ======================================================
// KEYBOARD
// ======================================================

function setupKeyboardControls() {

    document.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key ===
                "Escape"
            ) {

                closeProductOptions();

                closeCart();

            }

        }
    );

}


// ======================================================
// INITIALIZE
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadCart();

        updateCart();

        setupProductCards();

        setupKeyboardControls();

    }
);

document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // MOBILE MENU
    // =========================

    const menuToggle = document.querySelector(".menu-toggle");
    const menu = document.querySelector(".nav-links");
    const navLinks = document.querySelectorAll(".nav-links a");

    if (menuToggle) {
        menuToggle.addEventListener("click", function () {
            menu.classList.toggle("active");
        });
    }

    navLinks.forEach(function(link){
        link.addEventListener("click", function(){
            menu.classList.remove("active");
        });
    });



    // =========================
    // BACK TO TOP
    // =========================

    const backToTop = document.querySelector(".back-to-top");

    window.addEventListener("scroll", function(){
        if(window.scrollY > 300){
            backToTop.classList.add("show");
        }else{
            backToTop.classList.remove("show");
        }
    });



    // =========================
    // SEARCH
    // =========================

    const search = document.querySelector("#search");
    const foodCards = document.querySelectorAll(".food-card");

    if (search) {
        search.addEventListener("input", function(){
            const searchValue = search.value.toLowerCase();
            foodCards.forEach(function(card){
                const foodName = card.querySelector("h3").textContent.toLowerCase();
                if(foodName.includes(searchValue)){
                    card.style.display = "block";
                }else{
                    card.style.display = "none";
                }
            });
        });
    }

// =========================
// BUILD YOUR MEAL
// =========================

const mealOptions = document.querySelectorAll(".meal-option");

mealOptions.forEach(function(option) {

    const minusButton = option.querySelector(".quantity-minus");
    const plusButton = option.querySelector(".quantity-plus");
    const quantityDisplay = option.querySelector(".quantity");

    plusButton.addEventListener("click", function() {

        const category = option.closest(".meal-category");

        // Get the CURRENT quantity from the screen
        let quantity = Number(quantityDisplay.textContent);

        // Proteins can be selected multiple times
        const isProtein =
            category.querySelector("h3").textContent.includes("Proteins");

        // Main meals, extras and water can only be selected once
        if (!isProtein && quantity >= 1) {
            return;
        }

        quantity++;

        quantityDisplay.textContent = quantity;

    });


    minusButton.addEventListener("click", function() {

        // Get the CURRENT quantity from the screen
        let quantity = Number(quantityDisplay.textContent);

        if (quantity > 0) {

            quantity--;

            quantityDisplay.textContent = quantity;

        }

    });

});

// =========================
// MEAL PREVIEW
// =========================

const addMealButton = document.querySelector("#add-built-meal");

if(addMealButton) {

    const mealPreview = document.createElement("div");

    mealPreview.id = "meal-preview";

mealPreview.innerHTML = `
    <h3>Your Meal</h3>

    <div id="meal-preview-images"></div>

    <div id="meal-preview-items">
        Select a main meal to preview your order.
    </div>

    <h4>
        Meal Total: ₦<span id="meal-preview-total">0</span>
    </h4>
`;
    addMealButton.parentNode.insertBefore(
        mealPreview,
        addMealButton
    );


    function updateMealPreview() {

        let mainMeal = null;
        let previewItems = [];
        let previewTotal = 0;


        mealOptions.forEach(function(option) {

            const quantity = Number(
                option.querySelector(".quantity").textContent
            );

            if(quantity > 0) {

                const category =
                    option.closest(".meal-category");

                const categoryName =
                    category.querySelector("h3").textContent.trim();

                const itemName =
                    option.querySelector("h4").textContent.trim();

              const priceText = option
    .querySelector("p")
    .textContent;

const priceMatch = priceText.match(/[\d,]+/);

const price = priceMatch
    ? Number(priceMatch[0].replace(/,/g, ""))
    : 0;


                previewItems.push({
                    name: itemName,
                    quantity: quantity,
                    price: price
                });


                previewTotal += price * quantity;


                if(categoryName.includes("Main Meals")) {

                    mainMeal = option;

                }

            }

        });


       const previewImagesContainer =
    document.querySelector("#meal-preview-images");

const previewItemsContainer =
    document.querySelector("#meal-preview-items");

const previewTotalElement =
    document.querySelector("#meal-preview-total");


        previewImagesContainer.innerHTML = "";

mealOptions.forEach(function(option) {

    const quantity = Number(
        option.querySelector(".quantity").textContent
    );

    if(quantity > 0) {

        const image =
            option.querySelector("img");

        if(image) {

            const previewImage =
                document.createElement("img");

            previewImage.src = image.src;
            previewImage.alt =
                option.querySelector("h4").textContent.trim();

            previewImagesContainer.appendChild(
                previewImage
            );

        }

    }

});

        if(previewItems.length === 0) {

            previewItemsContainer.innerHTML =
                "Select a main meal to preview your order.";

        } else {

            previewItemsContainer.innerHTML = "";

            previewItems.forEach(function(item) {

                const row =
                    document.createElement("p");

                row.textContent =
                    `${item.name} ×${item.quantity}`;

                previewItemsContainer.appendChild(row);

            });

        }


        previewTotalElement.textContent =
            previewTotal.toLocaleString();

    }


    mealOptions.forEach(function(option) {

        const plus =
            option.querySelector(".quantity-plus");

        const minus =
            option.querySelector(".quantity-minus");


        plus.addEventListener(
            "click",
            updateMealPreview
        );

        minus.addEventListener(
            "click",
            updateMealPreview
        );

    });


    updateMealPreview();

}

   // =========================
// SHOPPING CART
// =========================

let cart = [];
let total = 0;

const addToCartButtons = document.querySelectorAll(".add-to-cart");
const cartCount = document.querySelector("#cart-count");
const cartItems = document.querySelector("#cart-items");
const cartTotal = document.querySelector("#cart-total");
const addBuiltMealButton = document.querySelector("#add-built-meal");
const cartIcon = document.querySelector(".cart-icon");
const cartBox = document.querySelector(".cart-box");


// =========================
// ADD OLD FOOD CARDS TO CART
// =========================


addToCartButtons.forEach(function(button){

   button.addEventListener("click", function(e){

    e.stopPropagation();

    const card = button.closest(".food-card");

        const foodName = card.querySelector("h3").textContent;
        const foodPrice = Number(button.dataset.price);

        cart.push({
            name: foodName,
            price: foodPrice,
            quantity: 1
        });

        total += foodPrice;

updateCart();

// Automatically open cart
if (cartBox) {
    cartBox.style.display = "block";
}

    });

});


// =========================
// ADD BUILT MEAL TO CART
// =========================

if (addBuiltMealButton) {

    addBuiltMealButton.addEventListener("click", function(e){

        e.stopPropagation();
        
        let selectedItems = [];
        let mealTotal = 0;

        mealOptions.forEach(function(option){

            const quantity = Number(
                option.querySelector(".quantity").textContent
            );

            if(quantity > 0){

                const itemName =
                    option.querySelector("h4").textContent.trim();

                const priceText =
                    option.querySelector("p").textContent;

                let itemPrice = 0;

                if(itemName === "Can of Water"){

                    itemPrice = 0;

                }else{

                    itemPrice = Number(
                        priceText.replace(/[₦,]/g, "").trim()
                    );

                }

                selectedItems.push({
                    name: itemName,
                    price: itemPrice,
                    quantity: quantity
                });

                mealTotal += itemPrice * quantity;

            }

        });


       // =========================
// MAIN MEAL IS REQUIRED
// =========================

let hasMainMeal = false;

mealOptions.forEach(function(option) {

    const quantity = Number(
        option.querySelector(".quantity").textContent
    );

    if(quantity > 0) {

        const category = option.closest(".meal-category");

        if(category) {

            const categoryName =
                category.querySelector("h3").textContent.trim();

            if(categoryName.includes("Main Meals")) {
                hasMainMeal = true;
            }

        }

    }

});


if(!hasMainMeal) {

    alert(
        "Please select at least one Main Meal before adding to cart."
    );

    return;

}


        // Add the complete meal

        cart.push({

            type: "meal",

            items: selectedItems,

            price: mealTotal

        });


        total += mealTotal;


        // Reset meal builder

        mealOptions.forEach(function(option){

            option.querySelector(".quantity").textContent = "0";

        });


        updateCart();

// Automatically open the cart
if(cartBox) {
    cartBox.style.display = "block";
}

alert("Your meal has been added to the cart! 🛒");

    });

}


// =========================
// UPDATE CART
// =========================

function updateCart(){

    if(!cartItems) return;

    cartItems.innerHTML = "";

    let itemCount = 0;


    cart.forEach(function(item, index){

        const div = document.createElement("div");

        div.classList.add("cart-item");


        // BUILT MEAL

        if(item.type === "meal"){

            item.items.forEach(function(food){

                itemCount += food.quantity;

            });


            let mealHTML = `
                <div class="cart-meal">

                    <div class="cart-meal-header">

                        <strong>🍛 Meal ${index + 1}</strong>

                        <button
                            class="remove-meal"
                            data-index="${index}">
                            ❌
                        </button>

                    </div>
            `;


            item.items.forEach(function(food){

                mealHTML += `
                    <div class="cart-meal-item">

                        <span>
                            ${food.name} ×${food.quantity}
                        </span>

                        <span>
                            ₦${(food.price * food.quantity).toLocaleString()}
                        </span>

                    </div>
                `;

            });


            mealHTML += `

                    <div class="cart-meal-total">

                        <strong>
                            Meal Total:
                            ₦${item.price.toLocaleString()}
                        </strong>

                    </div>

                </div>

            `;


            div.innerHTML = mealHTML;


        }else{

            // OLD FOOD CARD ITEM

            itemCount += item.quantity;


            div.innerHTML = `

                <div class="cart-item-row">

                    <span class="food-name">
                        ${item.name}
                    </span>

                    <span class="food-qty">
                        ×${item.quantity}
                    </span>

                    <span>
                        ₦${(item.price * item.quantity).toLocaleString()}
                    </span>

                    <button
                        class="remove-btn"
                        data-index="${index}">
                        ❌
                    </button>

                </div>

            `;

        }


        cartItems.appendChild(div);

    });


    // EMPTY CART

    if(cart.length === 0){

        cartItems.innerHTML = "Your cart is empty";

    }


    // UPDATE CART NUMBER

    if(cartCount){

        cartCount.textContent = itemCount;

    }


    // UPDATE TOTAL

    if(cartTotal){

        cartTotal.textContent =
            total.toLocaleString();

    }


    // =========================
    // REMOVE COMPLETE MEAL
    // =========================

    const removeMeals =
        document.querySelectorAll(".remove-meal");


    removeMeals.forEach(function(button){

        button.addEventListener("click", function(){

            const index =
                Number(button.dataset.index);

            if(cart[index]){

                total -= cart[index].price;

                cart.splice(index, 1);

                updateCart();

            }

        });

    });


    // =========================
    // REMOVE OLD CART ITEM
    // =========================

    const removeButtons =
        document.querySelectorAll(".remove-btn");


    removeButtons.forEach(function(button){

        button.addEventListener("click", function(){

            const index =
                Number(button.dataset.index);


            if(cart[index]){

                total -=
                    cart[index].price *
                    cart[index].quantity;


                cart.splice(index, 1);

                updateCart();

            }

        });

    });

}

    // =========================
// CART TOGGLE
// =========================

if (cartIcon && cartBox) {

    cartIcon.addEventListener("click", function(e) {

        e.stopPropagation();

        if (cartBox.style.display === "block") {
            cartBox.style.display = "none";
        } else {
            cartBox.style.display = "block";
        }

    });


    // Clicking inside the cart should NOT close it
    cartBox.addEventListener("click", function(e) {
        e.stopPropagation();
    });


    // Clicking anywhere outside the cart closes it
    document.addEventListener("click", function(e) {

        if (
            cartBox.style.display === "block" &&
            !cartBox.contains(e.target) &&
            !cartIcon.contains(e.target)
        ) {

            cartBox.style.display = "none";

        }

    });

}

    // =========================
// CHECKOUT
// =========================

const checkoutBtn = document.querySelector("#checkout-btn");
const checkoutForm = document.querySelector("#checkout-form");

if (checkoutBtn && checkoutForm) {

    checkoutBtn.addEventListener("click", function(e) {

        e.stopPropagation();

        // Cart is empty
        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        // Open checkout form
        if (checkoutForm.style.display === "block") {
            checkoutForm.style.display = "none";
        } else {
            checkoutForm.style.display = "block";
        }

    });

}

// =========================
// PAYMENT VARIABLES
// =========================

const placeOrder = document.querySelector("#place-order");
const paymentPopup = document.querySelector("#payment-popup");
const paymentCheck = document.querySelector("#payment-check");
const paymentDone = document.querySelector("#payment-done");
const copyAccount = document.querySelector("#copy-account");
const accountNumber = document.querySelector("#account-number");

let orderMessage = "";

// =========================
// RECEIPT ELEMENTS
// =========================

const receiptContainer = document.querySelector("#receipt-container");
const receiptOrderNumber = document.querySelector("#receipt-order-number");
const receiptDate = document.querySelector("#receipt-date");
const receiptCustomerName = document.querySelector("#receipt-customer-name");
const receiptCustomerPhone = document.querySelector("#receipt-customer-phone");
const receiptCustomerAddress = document.querySelector("#receipt-customer-address");
const receiptItems = document.querySelector("#receipt-items");
const receiptTotal = document.querySelector("#receipt-total");
const downloadReceipt = document.querySelector("#download-receipt");

// =========================
// PROCEED TO PAYMENT
// =========================

if (placeOrder) {

    placeOrder.addEventListener("click", function(e) {

        e.preventDefault();

        const name =
            document.querySelector("#customer-name").value.trim();

        const phone =
            document.querySelector("#customer-phone").value.trim();

        const address =
            document.querySelector("#customer-address").value.trim();


        // Make sure cart isn't empty

        if (cart.length === 0) {

            alert("Your cart is empty!");

            return;

        }


        // Make sure customer details are filled

        if (name === "" || phone === "" || address === "") {

            alert("Please fill in all your details.");

            return;

        }


        // Build WhatsApp order message

        let items = "";

        cart.forEach(function(item, index) {

            if (item.type === "meal") {

                items += `\n🍛 MEAL ${index + 1}\n`;

                item.items.forEach(function(food) {

                    const foodTotal =
                        food.price * food.quantity;

                    items +=
                        `• ${food.name} ×${food.quantity} — ₦${foodTotal.toLocaleString()}\n`;

                });

                items +=
                    `Meal Total: ₦${item.price.toLocaleString()}\n`;

            } else {

                const itemTotal =
                    item.price * item.quantity;

                items +=
                    `• ${item.name} ×${item.quantity} — ₦${itemTotal.toLocaleString()}\n`;

            }

        });


        orderMessage = `Hello Beta Food! 🍛

*NEW ORDER*

👤 Customer: ${name}

📞 Phone: ${phone}

📍 Address:
${address}

🛒 ORDER:
${items}

💰 TOTAL: ₦${total.toLocaleString()}
`;


        // Hide checkout form

        checkoutForm.style.display = "none";


        // Show payment popup

        if (paymentPopup) {

            paymentPopup.style.display = "block";

        }


        // Reset payment confirmation

        if (paymentCheck) {

            paymentCheck.checked = false;

        }


        if (paymentDone) {

            paymentDone.disabled = true;
            paymentDone.style.opacity = "0.5";
            paymentDone.style.pointerEvents = "none";

        }

    });

}

    // =========================
    // COPY ACCOUNT NUMBER
    // =========================

    if (copyAccount && accountNumber) {
        copyAccount.addEventListener("click", function(){
            navigator.clipboard.writeText(accountNumber.textContent).then(function() {
                alert("Account number copied successfully!");
            }).catch(function() {
                const textArea = document.createElement("textarea");
                textArea.value = accountNumber.textContent;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand("copy");
                document.body.removeChild(textArea);
                alert("Account number copied successfully!");
            });
        });
    }



    // =========================
    // ENABLE PAYMENT BUTTON
    // =========================

    if (paymentCheck && paymentDone) {
        paymentCheck.addEventListener("change", function(){
            if(paymentCheck.checked){
                paymentDone.disabled = false;
                paymentDone.style.opacity = "1";
                paymentDone.style.pointerEvents = "auto";
            }else{
                paymentDone.disabled = true;
                paymentDone.style.opacity = "0.5";
                paymentDone.style.pointerEvents = "none";
            }
        });
    }


    

    // =========================
    // SEND TO WHATSAPP
    // =========================

    function sendWhatsAppMessage() {
        if (!orderMessage || orderMessage === "") {
            alert("Please place an order first.");
            return;
        }

        const whatsappNumber = "2349169452392";
        const whatsappURL = 
            "https://wa.me/" + 
            whatsappNumber + 
            "?text=" + 
            encodeURIComponent(
                orderMessage + 
                "\n\n✅ I have completed payment.\n\nI am about to attach my payment receipt."
            );

            
        window.open(whatsappURL, "_blank");

        // Reset everything
        cart = [];
        total = 0;
        updateCart();

        paymentPopup.style.display = "none";
        checkoutForm.style.display = "none";

        paymentCheck.checked = false;
        paymentDone.disabled = true;
        paymentDone.style.opacity = "0.5";
        paymentDone.style.pointerEvents = "none";

        document.querySelector("#customer-name").value = "";
        document.querySelector("#customer-phone").value = "";
        document.querySelector("#customer-address").value = "";

        alert("Thank you! Kindly attach your payment receipt in WhatsApp and send it.");
    }

    // Attach click event to payment button (simple, no cloning)
    if (paymentDone) {
        paymentDone.addEventListener("click", function(e) {
            e.preventDefault();
            sendWhatsAppMessage();
        });
    }

    // Also add a fallback using onclick (just in case)
    if (paymentDone) {
        paymentDone.onclick = function(e) {
            e.preventDefault();
            sendWhatsAppMessage();
            return false;
        };
    }

    console.log("✅ All event listeners attached.");


// ==========================
// DARK MODE
// ==========================

const themeToggle = document.querySelector("#theme-toggle");

if(themeToggle){

    if(localStorage.getItem("theme") === "dark"){

        document.body.classList.add("dark");
        themeToggle.innerHTML =
        '<i class="fa-solid fa-sun"></i>';

    }

    themeToggle.addEventListener("click",function(){

        document.body.classList.toggle("dark");

        if(document.body.classList.contains("dark")){

            localStorage.setItem("theme","dark");

            themeToggle.innerHTML =
            '<i class="fa-solid fa-sun"></i>';

        }else{

            localStorage.setItem("theme","light");

            themeToggle.innerHTML =
            '<i class="fa-solid fa-moon"></i>';

        }

    });

}

});

window.addEventListener("load",function(){

document.getElementById("loader").classList.add("hide");

});

// =========================
// GENERATE RESTAURANT RECEIPT
// =========================

function generateReceipt() {

    if (!receiptContainer) return;

    // Order number
    const orderNumber =
        "BF-" + Date.now().toString().slice(-6);

    // Date and time
    const now = new Date();

    const date =
        now.toLocaleDateString("en-NG", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });

    const time =
        now.toLocaleTimeString("en-NG", {
            hour: "2-digit",
            minute: "2-digit"
        });

    // Customer details
    const customerName =
        document.querySelector("#customer-name").value.trim();

    const customerPhone =
        document.querySelector("#customer-phone").value.trim();

    const customerAddress =
        document.querySelector("#customer-address").value.trim();


    // Put information into receipt

    receiptOrderNumber.textContent = orderNumber;

    receiptDate.textContent =
        date + " • " + time;

    receiptCustomerName.textContent =
        customerName;

    receiptCustomerPhone.textContent =
        customerPhone;

    receiptCustomerAddress.textContent =
        customerAddress;


    // Clear old receipt items

    receiptItems.innerHTML = "";


    // Add cart items

    cart.forEach(function(item) {

        if (item.type === "meal") {

            // Meal heading

            const mealHeading =
                document.createElement("div");

            mealHeading.style.fontWeight = "600";
            mealHeading.style.marginTop = "12px";
            mealHeading.textContent =
                "🍛 Meal";

            receiptItems.appendChild(mealHeading);


            // Items inside meal

            item.items.forEach(function(food) {

                const row =
                    document.createElement("div");

                row.className =
                    "receipt-item";

                row.innerHTML = `

                    <span class="receipt-item-name">
                        ${food.name} ×${food.quantity}
                    </span>

                    <span class="receipt-item-price">
                        ₦${(
                            food.price *
                            food.quantity
                        ).toLocaleString()}
                    </span>

                `;

                receiptItems.appendChild(row);

            });


        } else {

            const row =
                document.createElement("div");

            row.className =
                "receipt-item";

            row.innerHTML = `

                <span class="receipt-item-name">
                    ${item.name} ×${item.quantity}
                </span>

                <span class="receipt-item-price">
                    ₦${(
                        item.price *
                        item.quantity
                    ).toLocaleString()}
                </span>

            `;

            receiptItems.appendChild(row);

        }

    });


    // Total

    receiptTotal.textContent =
        total.toLocaleString();


    // Show receipt

    receiptContainer.style.display =
        "block";

}


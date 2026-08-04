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
    // SHOPPING CART
    // =========================

    let cart = {};
    let total = 0;

    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    const cartCount = document.querySelector("#cart-count");
    const cartItems = document.querySelector("#cart-items");
    const cartTotal = document.querySelector("#cart-total");

    addToCartButtons.forEach(function(button){
        button.addEventListener("click", function(){
            const card = button.closest(".food-card");
            const foodName = card.querySelector("h3").textContent;
            const foodPrice = Number(button.dataset.price);

            if(cart[foodName]){
                cart[foodName].quantity++;
            }else{
                cart[foodName] = {
                    price: foodPrice,
                    quantity: 1
                };
            }

            total += foodPrice;
            updateCart();
        });
    });

    function updateCart(){
        if (!cartItems) return;

        cartItems.innerHTML = "";
        let itemCount = 0;

        for(const food in cart){
            const item = cart[food];
            itemCount += item.quantity;

            const div = document.createElement("div");
            div.classList.add("cart-item");

            div.innerHTML = `
<div class="cart-item-row">
    <span class="food-name">${food}</span>
    <span class="food-qty">×${item.quantity}</span>
    <button class="remove-btn" data-food="${food}">❌</button>
</div>
`;
            cartItems.appendChild(div);
        }

        if(itemCount === 0){
            cartItems.innerHTML = "Your cart is empty";
        }

        if (cartCount) cartCount.textContent = itemCount;
        if (cartTotal) cartTotal.textContent = total.toLocaleString();

        // REMOVE ITEMS
        const removeButtons = document.querySelectorAll(".remove-btn");
        removeButtons.forEach(function(button){
            button.addEventListener("click", function(){
                const food = button.dataset.food;
                if(cart[food]){
                    cart[food].quantity--;
                    total -= cart[food].price;
                    if(cart[food].quantity <= 0){
                        delete cart[food];
                    }
                    updateCart();
                }
            });
        });
    }

    // =========================
    // CART TOGGLE
    // =========================

    const cartIcon = document.querySelector(".cart-icon");
    const cartBox = document.querySelector(".cart-box");

    if (cartIcon && cartBox) {
        cartIcon.addEventListener("click", function(){
            if(cartBox.style.display === "block"){
                cartBox.style.display = "none";
            }else{
                cartBox.style.display = "block";
            }
        });
    }



    // =========================
    // CHECKOUT
    // =========================

    const checkoutBtn = document.querySelector("#checkout-btn");
    const checkoutForm = document.querySelector("#checkout-form");

    if (checkoutBtn && checkoutForm) {
        checkoutBtn.addEventListener("click", function(){
            if(Object.keys(cart).length === 0){
                alert("Your cart is empty!");
                return;
            }
            if(checkoutForm.style.display === "block"){
                checkoutForm.style.display = "none";
            }else{
                checkoutForm.style.display = "block";
            }
        });
    }



    // =========================
    // PLACE ORDER → SHOW PAYMENT POPUP
    // =========================

    const placeOrder = document.querySelector("#place-order");
    const paymentPopup = document.querySelector("#payment-popup");
    const paymentCheck = document.querySelector("#payment-check");
    const paymentDone = document.querySelector("#payment-done");
    const copyAccount = document.querySelector("#copy-account");
    const accountNumber = document.querySelector("#account-number");

    let orderMessage = "";

    // Disable payment button initially
    if (paymentDone) {
        paymentDone.disabled = true;
        paymentDone.style.opacity = "0.5";
        paymentDone.style.pointerEvents = "none";
    }

    if (placeOrder) {
        placeOrder.addEventListener("click", function(){
            const name = document.querySelector("#customer-name").value.trim();
            const phone = document.querySelector("#customer-phone").value.trim();
            const address = document.querySelector("#customer-address").value.trim();

            if(Object.keys(cart).length === 0){
                alert("Your cart is empty!");
                return;
            }

            if(name === "" || phone === "" || address === ""){
                alert("Please fill in all your details.");
                return;
            }

            let items = "";
            for(const food in cart){
                items += `• ${food} ×${cart[food].quantity}\n`;
            }

            orderMessage = 
`Hello Beta Food! 🍛

*NEW ORDER*

👤 Customer: ${name}

📞 Phone: ${phone}

📍 Address:
${address}

🛒 Order:
${items}

💰 Total: ₦${total.toLocaleString()}
`;

            // Hide checkout form, show payment popup
            checkoutForm.style.display = "none";
            paymentPopup.style.display = "block";

            // Reset checkbox and button
            paymentCheck.checked = false;
            paymentDone.disabled = true;
            paymentDone.style.opacity = "0.5";
            paymentDone.style.pointerEvents = "none";

            console.log("Payment popup should be visible now.");
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
        cart = {};
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
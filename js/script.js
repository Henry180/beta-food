document.addEventListener("DOMContentLoaded", function () {

    // =========================================================
    // MOBILE MENU
    // =========================================================

    const menuToggle = document.querySelector(".menu-toggle");
    const menu = document.querySelector(".nav-links");
    const navLinks = document.querySelectorAll(".nav-links a");

    if (menuToggle && menu) {
        menuToggle.addEventListener("click", function () {
            menu.classList.toggle("active");
        });
    }

    navLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            if (menu) {
                menu.classList.remove("active");
            }
        });
    });


    // =========================================================
    // BACK TO TOP
    // =========================================================

    const backToTop = document.querySelector(".back-to-top");

    if (backToTop) {
        window.addEventListener("scroll", function () {

            if (window.scrollY > 300) {
                backToTop.classList.add("show");
            } else {
                backToTop.classList.remove("show");
            }

        });
    }


    // =========================================================
    // SEARCH
    // =========================================================

    const search = document.querySelector("#search");
    const foodCards = document.querySelectorAll(".food-card");

    if (search) {

        search.addEventListener("input", function () {

            const searchValue =
                search.value.toLowerCase().trim();

            foodCards.forEach(function (card) {

                const heading =
                    card.querySelector("h3");

                if (!heading) return;

                const foodName =
                    heading.textContent.toLowerCase();

                if (foodName.includes(searchValue)) {
                    card.style.display = "block";
                } else {
                    card.style.display = "none";
                }

            });

        });

    }


    // =========================================================
    // BUILD YOUR MEAL
    // =========================================================

    const mealOptions =
        document.querySelectorAll(".meal-option");


    // =========================================================
    // GET MAIN MEAL OPTIONS
    // =========================================================

    function getMainMealOptions() {

        const mainMealCategory =
            document.querySelector(
                ".meal-category:not(.water-option)"
            );

        if (!mainMealCategory) {
            return [];
        }

        /*
         * The first .meal-category in your HTML is Main Meals.
         * We identify it using its heading instead of relying
         * only on position.
         */

        const categories =
            document.querySelectorAll(".meal-category");

        let mainCategory = null;

        categories.forEach(function (category) {

            const heading =
                category.querySelector("h3");

            if (!heading) return;

            const text =
                heading.textContent.toLowerCase();

            if (
                text.includes("main meal")
            ) {
                mainCategory = category;
            }

        });

        if (!mainCategory) {
            return [];
        }

        return Array.from(
            mainCategory.querySelectorAll(".meal-option")
        );

    }


    // =========================================================
    // CHECK WHETHER MAIN MEAL HAS BEEN SELECTED
    // =========================================================

    function hasMainMealSelected() {

        const mainMeals =
            getMainMealOptions();

        return mainMeals.some(function (meal) {

            const quantityElement =
                meal.querySelector(".quantity");

            if (!quantityElement) {
                return false;
            }

            return (
                Number(
                    quantityElement.textContent
                ) > 0
            );

        });

    }


    // =========================================================
    // CHECK WHETHER OPTION IS WATER
    // =========================================================

    function isWaterOption(option) {

        if (!option) {
            return false;
        }

        const category =
            option.closest(".meal-category");

        if (
            category &&
            category.classList.contains(
                "water-option"
            )
        ) {
            return true;
        }

        const heading =
            option.querySelector("h4");

        if (!heading) {
            return false;
        }

        return (
            heading.textContent
                .trim()
                .toLowerCase() ===
            "can of water"
        );

    }


    // =========================================================
    // GET WATER OPTION
    // =========================================================

    function getWaterOption() {

        let waterOption = null;

        mealOptions.forEach(function (option) {

            if (isWaterOption(option)) {
                waterOption = option;
            }

        });

        return waterOption;

    }


    // =========================================================
    // REMOVE FREE WATER IF MAIN MEAL IS REMOVED
    // =========================================================

    function validateFreeWater() {

        const waterOption =
            getWaterOption();

        if (!waterOption) {
            return;
        }

        const quantityElement =
            waterOption.querySelector(".quantity");

        if (!quantityElement) {
            return;
        }

        const waterQuantity =
            Number(
                quantityElement.textContent
            );

        /*
         * If there is no main meal, water is no longer valid.
         */

        if (
            waterQuantity > 0 &&
            !hasMainMealSelected()
        ) {

            quantityElement.textContent = "0";

            alert(
                "Your free water was removed because a main meal is required for the free water offer. 💧🍛"
            );

        }

    }


    // =========================================================
    // QUANTITY CONTROLS
    // =========================================================

    mealOptions.forEach(function (option) {

        const minusButton =
            option.querySelector(
                ".quantity-minus"
            );

        const plusButton =
            option.querySelector(
                ".quantity-plus"
            );

        const quantityDisplay =
            option.querySelector(
                ".quantity"
            );

        if (
            !minusButton ||
            !plusButton ||
            !quantityDisplay
        ) {
            return;
        }


        // -----------------------------------------------------
        // PLUS BUTTON
        // -----------------------------------------------------

        plusButton.addEventListener(
            "click",
            function () {

                let quantity =
                    Number(
                        quantityDisplay.textContent
                    );


                // =================================================
                // FREE WATER RULE
                // =================================================

                if (isWaterOption(option)) {

                    /*
                     * Only one free water is allowed.
                     */

                    if (quantity >= 1) {

                        alert(
                            "Only one free can of water is allowed with each order. 💧"
                        );

                        return;

                    }


                    /*
                     * IMPORTANT:
                     * Water is tied specifically to a MAIN MEAL.
                     *
                     * A protein or extra alone does NOT qualify.
                     */

                    if (!hasMainMealSelected()) {

                        alert(
                            "Free water is available only when you order a main meal. 💧🍛"
                        );

                        return;

                    }

                }


                quantity++;

                quantityDisplay.textContent =
                    quantity;


                validateFreeWater();

            }
        );


        // -----------------------------------------------------
        // MINUS BUTTON
        // -----------------------------------------------------

        minusButton.addEventListener(
            "click",
            function () {

                let quantity =
                    Number(
                        quantityDisplay.textContent
                    );

                if (quantity > 0) {

                    quantity--;

                    quantityDisplay.textContent =
                        quantity;

                }


                /*
                 * If a main meal was removed,
                 * make sure free water is still valid.
                 */

                setTimeout(
                    validateFreeWater,
                    0
                );

            }
        );

    });


    // =========================================================
    // MEAL PREVIEW
    // =========================================================

    const addMealButton =
        document.querySelector(
            "#add-built-meal"
        );

    if (addMealButton) {

        const mealPreview =
            document.createElement("div");

        mealPreview.id =
            "meal-preview";

        mealPreview.innerHTML = `
            <h3>Your Meal</h3>

            <div id="meal-preview-images"></div>

            <div id="meal-preview-items">
                Select an item to preview your order.
            </div>

            <h4>
                Meal Total: ₦
                <span id="meal-preview-total">0</span>
            </h4>
        `;


        addMealButton.parentNode.insertBefore(
            mealPreview,
            addMealButton
        );


        function updateMealPreview() {

            let previewItems = [];
            let previewTotal = 0;


            validateFreeWater();


            mealOptions.forEach(function (option) {

                const quantityElement =
                    option.querySelector(
                        ".quantity"
                    );

                if (!quantityElement) {
                    return;
                }

                const quantity =
                    Number(
                        quantityElement.textContent
                    );


                if (quantity > 0) {

                    const itemName =
                        option.querySelector(
                            "h4"
                        ).textContent.trim();


                    const priceText =
                        option.querySelector(
                            "p"
                        ).textContent;


                    /*
                     * Water is always free.
                     */

                    let price = 0;

                    if (
                        !isWaterOption(option)
                    ) {

                        const priceMatch =
                            priceText.match(
                                /[\d,]+/
                            );

                        price =
                            priceMatch
                                ? Number(
                                    priceMatch[0]
                                        .replace(
                                            /,/g,
                                            ""
                                        )
                                )
                                : 0;

                    }


                    previewItems.push({

                        name:
                            itemName,

                        quantity:
                            quantity,

                        price:
                            price

                    });


                    previewTotal +=
                        price * quantity;

                }

            });


            const previewImagesContainer =
                document.querySelector(
                    "#meal-preview-images"
                );

            const previewItemsContainer =
                document.querySelector(
                    "#meal-preview-items"
                );

            const previewTotalElement =
                document.querySelector(
                    "#meal-preview-total"
                );


            // -------------------------------------------------
            // PREVIEW IMAGES
            // -------------------------------------------------

            if (previewImagesContainer) {

                previewImagesContainer.innerHTML =
                    "";

                mealOptions.forEach(
                    function (option) {

                        const quantity =
                            Number(
                                option.querySelector(
                                    ".quantity"
                                ).textContent
                            );

                        if (quantity > 0) {

                            const image =
                                option.querySelector(
                                    "img"
                                );

                            if (image) {

                                const previewImage =
                                    document.createElement(
                                        "img"
                                    );

                                previewImage.src =
                                    image.src;

                                previewImage.alt =
                                    option.querySelector(
                                        "h4"
                                    )
                                    .textContent
                                    .trim();

                                previewImagesContainer.appendChild(
                                    previewImage
                                );

                            }

                        }

                    }
                );

            }


            // -------------------------------------------------
            // PREVIEW ITEMS
            // -------------------------------------------------

            if (previewItemsContainer) {

                if (
                    previewItems.length === 0
                ) {

                    previewItemsContainer.innerHTML =
                        "Select an item to preview your order.";

                } else {

                    previewItemsContainer.innerHTML =
                        "";

                    previewItems.forEach(
                        function (item) {

                            const row =
                                document.createElement(
                                    "p"
                                );


                            if (
                                item.price === 0 &&
                                item.name
                                    .toLowerCase()
                                    .includes("water")
                            ) {

                                row.textContent =
                                    `${item.name} ×${item.quantity} — FREE 💧`;

                            } else {

                                row.textContent =
                                    `${item.name} ×${item.quantity}`;

                            }


                            previewItemsContainer.appendChild(
                                row
                            );

                        }
                    );

                }

            }


            // -------------------------------------------------
            // PREVIEW TOTAL
            // -------------------------------------------------

            if (previewTotalElement) {

                previewTotalElement.textContent =
                    previewTotal.toLocaleString();

            }

        }


        mealOptions.forEach(function (option) {

            const plus =
                option.querySelector(
                    ".quantity-plus"
                );

            const minus =
                option.querySelector(
                    ".quantity-minus"
                );

            if (plus) {

                plus.addEventListener(
                    "click",
                    updateMealPreview
                );

            }

            if (minus) {

                minus.addEventListener(
                    "click",
                    updateMealPreview
                );

            }

        });


        updateMealPreview();

    }


    // =========================================================
    // SHOPPING CART
    // =========================================================

    let cart = [];


    // =========================================================
    // DELIVERY
    // =========================================================

    const DELIVERY_FEE = 500;
    const FREE_DELIVERY_THRESHOLD = 10000;

    let deliveryFee = 0;


    function calculateDelivery(subtotal) {

        if (subtotal <= 0) {
            return 0;
        }

        if (
            subtotal >=
            FREE_DELIVERY_THRESHOLD
        ) {
            return 0;
        }

        return DELIVERY_FEE;

    }


    // =========================================================
    // CALCULATE CART SUBTOTAL
    // =========================================================

    function calculateCartSubtotal() {

        let subtotal = 0;


        cart.forEach(function (item) {

            if (item.type === "meal") {

                subtotal +=
                    Number(item.price) || 0;

            } else {

                subtotal +=
                    (
                        Number(item.price) ||
                        0
                    ) *
                    (
                        Number(item.quantity) ||
                        0
                    );

            }

        });


        return subtotal;

    }


    // =========================================================
    // CART ELEMENTS
    // =========================================================

    const addToCartButtons =
        document.querySelectorAll(
            ".add-to-cart"
        );

    const cartCount =
        document.querySelector(
            "#cart-count"
        );

    const cartItems =
        document.querySelector(
            "#cart-items"
        );

    const cartTotal =
        document.querySelector(
            "#cart-total"
        );

    const addBuiltMealButton =
        document.querySelector(
            "#add-built-meal"
        );

    const cartIcon =
        document.querySelector(
            ".cart-icon"
        );

    const cartBox =
        document.querySelector(
            ".cart-box"
        );


    // =========================================================
    // ADD OLD FOOD CARDS TO CART
    // =========================================================

    addToCartButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function (e) {

                e.stopPropagation();


                const card =
                    button.closest(
                        ".food-card"
                    );

                if (!card) {
                    return;
                }


                const foodNameElement =
                    card.querySelector(
                        "h3"
                    );

                if (!foodNameElement) {
                    return;
                }


                const foodName =
                    foodNameElement.textContent.trim();


                const foodPrice =
                    Number(
                        button.dataset.price
                    );


                if (
                    isNaN(foodPrice) ||
                    foodPrice < 0
                ) {
                    return;
                }


                cart.push({

                    name:
                        foodName,

                    price:
                        foodPrice,

                    quantity:
                        1

                });


                updateCart();


                if (cartBox) {
                    forceOpenCart();
                }

            }
        );

    });


    // =========================================================
    // ADD BUILT MEAL TO CART
    // =========================================================

    if (addBuiltMealButton) {

        addBuiltMealButton.addEventListener(
            "click",
            function (e) {

                e.stopPropagation();


                /*
                 * Make sure water is still valid before
                 * creating the cart item.
                 */

                validateFreeWater();


                let selectedItems = [];
                let mealTotal = 0;


                mealOptions.forEach(function (option) {

                    const quantityElement =
                        option.querySelector(
                            ".quantity"
                        );

                    if (!quantityElement) {
                        return;
                    }


                    const quantity =
                        Number(
                            quantityElement.textContent
                        );


                    if (quantity <= 0) {
                        return;
                    }


                    const itemName =
                        option.querySelector(
                            "h4"
                        )
                        .textContent
                        .trim();


                    const priceText =
                        option.querySelector(
                            "p"
                        )
                        .textContent;


                    let itemPrice = 0;


                    // =================================================
                    // WATER IS ALWAYS FREE
                    // =================================================

                    if (
                        isWaterOption(option)
                    ) {

                        itemPrice = 0;

                    } else {

                        const priceMatch =
                            priceText.match(
                                /[\d,]+/
                            );


                        itemPrice =
                            priceMatch
                                ? Number(
                                    priceMatch[0]
                                        .replace(
                                            /,/g,
                                            ""
                                        )
                                )
                                : 0;

                    }


                    selectedItems.push({

                        name:
                            itemName,

                        price:
                            itemPrice,

                        quantity:
                            quantity

                    });


                    mealTotal +=
                        itemPrice *
                        quantity;

                });


                // =================================================
                // MAKE SURE SOMETHING WAS SELECTED
                // =================================================

                if (
                    selectedItems.length === 0
                ) {

                    alert(
                        "Please select at least one item before adding to cart."
                    );

                    return;

                }


                // =================================================
                // MAIN MEAL CHECK
                // =================================================

                const mainMealSelected =
                    hasMainMealSelected();


                // =================================================
                // WATER CHECK
                // =================================================

                const waterItems =
                    selectedItems.filter(
                        function (item) {

                            return (
                                item.name
                                    .toLowerCase() ===
                                "can of water"
                                    .toLowerCase()
                            );

                        }
                    );


                /*
                 * If water is selected, a MAIN MEAL
                 * must also be selected.
                 *
                 * Protein alone or extras alone do NOT qualify.
                 */

                if (
                    waterItems.length > 0 &&
                    !mainMealSelected
                ) {

                    alert(
                        "Free water is available only with a main meal. Please select a main meal first. 💧🍛"
                    );

                    return;

                }


                // =================================================
                // WATER QUANTITY LIMIT
                // =================================================

                const waterQuantity =
                    waterItems.reduce(
                        function (total, item) {

                            return (
                                total +
                                item.quantity
                            );

                        },
                        0
                    );


                if (
                    waterQuantity > 1
                ) {

                    alert(
                        "Only one free can of water is allowed per order. 💧"
                    );

                    return;

                }


                // =================================================
                // ADD COMPLETE SELECTION TO CART
                // =================================================

                cart.push({

                    type:
                        "meal",

                    items:
                        selectedItems,

                    price:
                        mealTotal

                });


                // =================================================
                // RESET MEAL BUILDER
                // =================================================

                mealOptions.forEach(
                    function (option) {

                        const quantity =
                            option.querySelector(
                                ".quantity"
                            );

                        if (quantity) {

                            quantity.textContent =
                                "0";

                        }

                    }
                );


                updateMealPreview();


                updateCart();


                // =================================================
                // OPEN CART
                // =================================================

                if (cartBox) {
                    forceOpenCart();
                }


                alert(
                    "Your meal has been added to the cart! 🛒"
                );

            }
        );

    }


    // =========================================================
    // UPDATE CART
    // =========================================================

    function updateCart() {

        if (!cartItems) {
            return;
        }


        cartItems.innerHTML = "";


        let itemCount = 0;


        // -----------------------------------------------------
        // ALWAYS RECALCULATE SUBTOTAL
        // -----------------------------------------------------

        const subtotal =
            calculateCartSubtotal();


        // -----------------------------------------------------
        // DISPLAY CART ITEMS
        // -----------------------------------------------------

        cart.forEach(function (item, index) {

            const div =
                document.createElement(
                    "div"
                );

            div.classList.add(
                "cart-item"
            );


            // =================================================
            // BUILT MEAL
            // =================================================

            if (
                item.type === "meal"
            ) {

                item.items.forEach(
                    function (food) {

                        itemCount +=
                            food.quantity;

                    }
                );


                let mealHTML = `
                    <div class="cart-meal">

                        <div class="cart-meal-header">

                            <strong>
                                🍛 Meal ${index + 1}
                            </strong>

                            <button
                                type="button"
                                class="remove-meal"
                                data-index="${index}">
                                ❌
                            </button>

                        </div>
                `;


                item.items.forEach(
                    function (food) {

                        const isFreeWater =
                            food.name
                                .toLowerCase() ===
                            "can of water"
                                .toLowerCase();


                        const foodTotal =
                            food.price *
                            food.quantity;


                        mealHTML += `
                            <div class="cart-meal-item">

                                <span>
                                    ${food.name} ×${food.quantity}
                                </span>

                                <span>
                                    ${
                                        isFreeWater
                                            ? "FREE"
                                            : "₦" +
                                              foodTotal.toLocaleString()
                                    }
                                </span>

                            </div>
                        `;

                    }
                );


                mealHTML += `
                        <div class="cart-meal-total">

                            <strong>
                                Meal Total:
                                ₦${item.price.toLocaleString()}
                            </strong>

                        </div>

                    </div>
                `;


                div.innerHTML =
                    mealHTML;


            } else {

                // =============================================
                // NORMAL FOOD CARD ITEM
                // =============================================

                itemCount +=
                    item.quantity;


                div.innerHTML = `
                    <div class="cart-item-row">

                        <span class="food-name">
                            ${item.name}
                        </span>

                        <span class="food-qty">
                            ×${item.quantity}
                        </span>

                        <span>
                            ₦${(
                                item.price *
                                item.quantity
                            ).toLocaleString()}
                        </span>

                        <button
                            type="button"
                            class="remove-btn"
                            data-index="${index}">
                            ❌
                        </button>

                    </div>
                `;

            }


            cartItems.appendChild(
                div
            );

        });


        // -----------------------------------------------------
        // EMPTY CART
        // -----------------------------------------------------

        if (cart.length === 0) {

            cartItems.innerHTML =
                "Your cart is empty";

        }


        // =====================================================
        // DELIVERY
        // =====================================================

        deliveryFee =
            calculateDelivery(
                subtotal
            );


        // =====================================================
        // GRAND TOTAL
        // =====================================================

        const grandTotal =
            subtotal +
            deliveryFee;


        // -----------------------------------------------------
        // CART COUNT
        // -----------------------------------------------------

        if (cartCount) {

            cartCount.textContent =
                itemCount;

        }


        // -----------------------------------------------------
        // CART TOTAL
        // -----------------------------------------------------

        if (cartTotal) {

            cartTotal.textContent =
                grandTotal.toLocaleString();

        }


        // =====================================================
        // DELIVERY DISPLAY
        // =====================================================

        let deliveryDisplay =
            document.querySelector(
                "#cart-delivery"
            );


        if (
            !deliveryDisplay &&
            cartItems.parentNode
        ) {

            deliveryDisplay =
                document.createElement(
                    "div"
                );

            deliveryDisplay.id =
                "cart-delivery";

            deliveryDisplay.style.marginTop =
                "10px";

            deliveryDisplay.style.padding =
                "10px 0";

            deliveryDisplay.style.borderTop =
                "1px solid #ddd";


            const totalElement =
                cartTotal
                    ? cartTotal.closest(
                        "h4"
                    )
                    : null;


            if (totalElement) {

                totalElement.parentNode.insertBefore(
                    deliveryDisplay,
                    totalElement
                );

            } else {

                cartItems.parentNode.appendChild(
                    deliveryDisplay
                );

            }

        }


        if (deliveryDisplay) {

            if (subtotal === 0) {

                deliveryDisplay.innerHTML =
                    "";

            } else if (
                deliveryFee === 0
            ) {

                deliveryDisplay.innerHTML = `
                    🚚 Delivery:
                    <strong>FREE</strong>
                `;

            } else {

                deliveryDisplay.innerHTML = `
                    🚚 Delivery:
                    <strong>
                        ₦${deliveryFee.toLocaleString()}
                    </strong>
                `;

            }

        }


        // =====================================================
        // FREE DELIVERY MESSAGE
        // =====================================================

        let freeDeliveryMessage =
            document.querySelector(
                "#free-delivery-message"
            );


        if (
            !freeDeliveryMessage &&
            cartItems.parentNode
        ) {

            freeDeliveryMessage =
                document.createElement(
                    "p"
                );

            freeDeliveryMessage.id =
                "free-delivery-message";

            freeDeliveryMessage.style.fontSize =
                "13px";

            freeDeliveryMessage.style.marginTop =
                "8px";


            const totalElement =
                cartTotal
                    ? cartTotal.closest(
                        "h4"
                    )
                    : null;


            if (totalElement) {

                totalElement.parentNode.insertBefore(
                    freeDeliveryMessage,
                    totalElement
                );

            } else {

                cartItems.parentNode.appendChild(
                    freeDeliveryMessage
                );

            }

        }


        if (freeDeliveryMessage) {

            if (subtotal === 0) {

                freeDeliveryMessage.textContent =
                    "";

            } else if (
                subtotal >=
                FREE_DELIVERY_THRESHOLD
            ) {

                freeDeliveryMessage.textContent =
                    "🎉 You qualify for FREE delivery!";

            } else {

                const remaining =
                    FREE_DELIVERY_THRESHOLD -
                    subtotal;

                freeDeliveryMessage.textContent =
                    `Add ₦${remaining.toLocaleString()} more ` +
                    `to get FREE delivery! 🚚`;

            }

        }


        // =====================================================
        // REMOVE COMPLETE MEAL
        // =====================================================

        const removeMeals =
            document.querySelectorAll(
                ".remove-meal"
            );


        removeMeals.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function (e) {

                        e.stopPropagation();


                        const index =
                            Number(
                                button.dataset.index
                            );


                        if (cart[index]) {

                            cart.splice(
                                index,
                                1
                            );

                            updateCart();

                        }

                    }
                );

            }
        );


        // =====================================================
        // REMOVE NORMAL CART ITEM
        // =====================================================

        const removeButtons =
            document.querySelectorAll(
                ".remove-btn"
            );


        removeButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function (e) {

                        e.stopPropagation();


                        const index =
                            Number(
                                button.dataset.index
                            );


                        if (cart[index]) {

                            cart.splice(
                                index,
                                1
                            );

                            updateCart();

                        }

                    }
                );

            }
        );

    }


    // =========================================================
    // FORCE CART OPEN
    // =========================================================

    function forceOpenCart() {

        if (!cartBox) {
            return;
        }


        cartBox.style.display =
            "block";


        if (
            window.innerWidth <= 768
        ) {

            cartBox.style.position =
                "fixed";

            cartBox.style.top =
                "120px";

            cartBox.style.right =
                "10px";

            cartBox.style.left =
                "auto";

            cartBox.style.width =
                "92vw";

            cartBox.style.maxWidth =
                "420px";

            cartBox.style.maxHeight =
                "80vh";

            cartBox.style.zIndex =
                "999999";

            cartBox.style.background =
                "#ffffff";

            cartBox.style.padding =
                "20px";

            cartBox.style.borderRadius =
                "12px";

            cartBox.style.boxShadow =
                "0 15px 40px rgba(0,0,0,0.3)";

            cartBox.style.overflowY =
                "auto";

            cartBox.style.boxSizing =
                "border-box";

        } else {

            cartBox.style.position =
                "";

            cartBox.style.top =
                "";

            cartBox.style.right =
                "";

            cartBox.style.left =
                "";

            cartBox.style.width =
                "";

            cartBox.style.maxWidth =
                "";

            cartBox.style.maxHeight =
                "";

            cartBox.style.zIndex =
                "";

            cartBox.style.background =
                "";

            cartBox.style.padding =
                "";

            cartBox.style.borderRadius =
                "";

            cartBox.style.boxShadow =
                "";

            cartBox.style.overflowY =
                "";

        }

    }


    // =========================================================
    // CLOSE CART
    // =========================================================

    function closeCart() {

        if (cartBox) {

            cartBox.style.display =
                "none";

        }

    }


    // =========================================================
    // CART TOGGLE
    // =========================================================

    if (
        cartIcon &&
        cartBox
    ) {

        cartIcon.addEventListener(
            "click",
            function (e) {

                e.stopPropagation();


                if (
                    cartBox.style.display ===
                    "block"
                ) {

                    closeCart();

                } else {

                    forceOpenCart();

                }

            }
        );


        cartBox.addEventListener(
            "click",
            function (e) {

                e.stopPropagation();

            }
        );


        document.addEventListener(
            "click",
            function (e) {

                if (
                    cartBox.style.display ===
                    "block" &&
                    !cartBox.contains(
                        e.target
                    ) &&
                    !cartIcon.contains(
                        e.target
                    )
                ) {

                    closeCart();

                }

            }
        );

    }


    // =========================================================
    // CHECKOUT
    // =========================================================

    const checkoutBtn =
        document.querySelector(
            "#checkout-btn"
        );

    const checkoutForm =
        document.querySelector(
            "#checkout-form"
        );


    if (
        checkoutBtn &&
        checkoutForm
    ) {

        checkoutBtn.addEventListener(
            "click",
            function (e) {

                e.stopPropagation();


                if (
                    cart.length === 0
                ) {

                    alert(
                        "Your cart is empty!"
                    );

                    return;

                }


                if (
                    checkoutForm.style.display ===
                    "block"
                ) {

                    checkoutForm.style.display =
                        "none";

                } else {

                    checkoutForm.style.display =
                        "block";

                }

            }
        );

    }


    // =========================================================
    // PAYMENT VARIABLES
    // =========================================================

    const placeOrder =
        document.querySelector(
            "#place-order"
        );

    const paymentPopup =
        document.querySelector(
            "#payment-popup"
        );

    const paymentCheck =
        document.querySelector(
            "#payment-check"
        );

    const paymentDone =
        document.querySelector(
            "#payment-done"
        );

    const copyAccount =
        document.querySelector(
            "#copy-account"
        );

    const accountNumber =
        document.querySelector(
            "#account-number"
        );


    let orderMessage = "";


    // =========================================================
    // RECEIPT ELEMENTS
    // =========================================================

    const receiptContainer =
        document.querySelector(
            "#receipt"
        );

    const receiptOrderNumber =
        document.querySelector(
            "#receipt-order-number"
        );

    const receiptDate =
        document.querySelector(
            "#receipt-date"
        );

    const receiptCustomerName =
        document.querySelector(
            "#receipt-customer-name"
        );

    const receiptCustomerPhone =
        document.querySelector(
            "#receipt-customer-phone"
        );

    const receiptCustomerAddress =
        document.querySelector(
            "#receipt-customer-address"
        );

    const receiptItems =
        document.querySelector(
            "#receipt-items"
        );

    const receiptTotal =
        document.querySelector(
            "#receipt-total"
        );

    const downloadReceipt =
        document.querySelector(
            "#download-receipt"
        );

    const sendReceiptWhatsApp =
        document.querySelector(
            "#send-receipt-whatsapp"
        );


    // =========================================================
    // CURRENT ORDER DATA
    // =========================================================

    let currentOrderNumber = "";
    let currentOrderDate = "";


    // =========================================================
    // PROCEED TO PAYMENT
    // =========================================================

    if (placeOrder) {

        placeOrder.addEventListener(
            "click",
            function (e) {

                e.preventDefault();


                const nameInput =
                    document.querySelector(
                        "#customer-name"
                    );

                const phoneInput =
                    document.querySelector(
                        "#customer-phone"
                    );

                const addressInput =
                    document.querySelector(
                        "#customer-address"
                    );


                const name =
                    nameInput
                        ? nameInput.value.trim()
                        : "";

                const phone =
                    phoneInput
                        ? phoneInput.value.trim()
                        : "";

                const address =
                    addressInput
                        ? addressInput.value.trim()
                        : "";


                // -------------------------------------------------
                // CART CHECK
                // -------------------------------------------------

                if (
                    cart.length === 0
                ) {

                    alert(
                        "Your cart is empty!"
                    );

                    return;

                }


                // -------------------------------------------------
                // CUSTOMER DETAILS CHECK
                // -------------------------------------------------

                if (
                    name === "" ||
                    phone === "" ||
                    address === ""
                ) {

                    alert(
                        "Please fill in all your details."
                    );

                    return;

                }


                // =================================================
                // CALCULATE FINAL TOTAL
                // =================================================

                const subtotal =
                    calculateCartSubtotal();


                deliveryFee =
                    calculateDelivery(
                        subtotal
                    );


                const grandTotal =
                    subtotal +
                    deliveryFee;


                // =================================================
                // BUILD WHATSAPP ORDER MESSAGE
                // =================================================

                let items = "";


                cart.forEach(
                    function (item, index) {

                        if (
                            item.type ===
                            "meal"
                        ) {

                            items +=
                                `\n🍛 MEAL ${index + 1}\n`;


                            item.items.forEach(
                                function (food) {

                                    const foodTotal =
                                        food.price *
                                        food.quantity;


                                    const isFreeWater =
                                        food.name
                                            .toLowerCase() ===
                                        "can of water"
                                            .toLowerCase();


                                    items +=
                                        `• ${food.name} ×${food.quantity} — ` +
                                        (
                                            isFreeWater
                                                ? "FREE"
                                                : `₦${foodTotal.toLocaleString()}`
                                        ) +
                                        `\n`;

                                }
                            );


                            items +=
                                `Meal Total: ₦${item.price.toLocaleString()}\n`;


                        } else {

                            const itemTotal =
                                item.price *
                                item.quantity;


                            items +=
                                `• ${item.name} ×${item.quantity} — ` +
                                `₦${itemTotal.toLocaleString()}\n`;

                        }

                    }
                );


                // =================================================
                // WHATSAPP MESSAGE
                // =================================================

                orderMessage =
                    `Hello Beta Food! 🍛\n\n` +
                    `*NEW ORDER*\n\n` +
                    `👤 Customer: ${name}\n\n` +
                    `📞 Phone: ${phone}\n\n` +
                    `📍 Address:\n${address}\n\n` +
                    `🛒 ORDER:\n${items}\n` +
                    `\n💵 SUBTOTAL: ₦${subtotal.toLocaleString()}\n` +
                    `🚚 DELIVERY: ${
                        deliveryFee === 0
                            ? "FREE"
                            : "₦" +
                              deliveryFee.toLocaleString()
                    }\n` +
                    `💰 TOTAL: ₦${grandTotal.toLocaleString()}`;


                // =================================================
                // HIDE CHECKOUT
                // =================================================

                if (checkoutForm) {

                    checkoutForm.style.display =
                        "none";

                }


                // =================================================
                // SHOW PAYMENT POPUP
                // =================================================

                if (paymentPopup) {

                    paymentPopup.style.display =
                        "block";

                }


                // =================================================
                // RESET PAYMENT CONFIRMATION
                // =================================================

                if (paymentCheck) {

                    paymentCheck.checked =
                        false;

                }


                if (paymentDone) {

                    paymentDone.disabled =
                        true;

                    paymentDone.style.opacity =
                        "0.5";

                    paymentDone.style.pointerEvents =
                        "none";

                }

            }
        );

    }


    // =========================================================
    // COPY ACCOUNT NUMBER
    // =========================================================

    if (
        copyAccount &&
        accountNumber
    ) {

        copyAccount.addEventListener(
            "click",
            function () {

                const text =
                    accountNumber.textContent.trim();


                if (
                    navigator.clipboard &&
                    navigator.clipboard.writeText
                ) {

                    navigator.clipboard
                        .writeText(text)
                        .then(function () {

                            alert(
                                "Account number copied successfully!"
                            );

                        })
                        .catch(function () {

                            fallbackCopy(text);

                        });

                } else {

                    fallbackCopy(text);

                }

            }
        );

    }


    function fallbackCopy(text) {

        const textArea =
            document.createElement(
                "textarea"
            );

        textArea.value =
            text;

        document.body.appendChild(
            textArea
        );

        textArea.select();

        document.execCommand(
            "copy"
        );

        document.body.removeChild(
            textArea
        );

        alert(
            "Account number copied successfully!"
        );

    }


    // =========================================================
    // ENABLE PAYMENT BUTTON
    // =========================================================

    if (
        paymentCheck &&
        paymentDone
    ) {

        paymentCheck.addEventListener(
            "change",
            function () {

                if (
                    paymentCheck.checked
                ) {

                    paymentDone.disabled =
                        false;

                    paymentDone.style.opacity =
                        "1";

                    paymentDone.style.pointerEvents =
                        "auto";

                } else {

                    paymentDone.disabled =
                        true;

                    paymentDone.style.opacity =
                        "0.5";

                    paymentDone.style.pointerEvents =
                        "none";

                }

            }
        );

    }


    // =========================================================
    // GENERATE RESTAURANT RECEIPT
    // =========================================================

    window.generateReceipt =
        function generateReceipt() {

            if (!receiptContainer) {
                return;
            }


            // -------------------------------------------------
            // ORDER NUMBER
            // -------------------------------------------------

            const orderNumber =
                "BF-" +
                Date.now()
                    .toString()
                    .slice(-6);


            currentOrderNumber =
                orderNumber;


            // -------------------------------------------------
            // DATE AND TIME
            // -------------------------------------------------

            const now =
                new Date();


            const date =
                now.toLocaleDateString(
                    "en-NG",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    }
                );


            const time =
                now.toLocaleTimeString(
                    "en-NG",
                    {
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                );


            currentOrderDate =
                date +
                " • " +
                time;


            // -------------------------------------------------
            // CUSTOMER DETAILS
            // -------------------------------------------------

            const customerName =
                document.querySelector(
                    "#customer-name"
                )?.value.trim() || "";


            const customerPhone =
                document.querySelector(
                    "#customer-phone"
                )?.value.trim() || "";


            const customerAddress =
                document.querySelector(
                    "#customer-address"
                )?.value.trim() || "";


            // -------------------------------------------------
            // PUT INFORMATION INTO RECEIPT
            // -------------------------------------------------

            if (receiptOrderNumber) {

                receiptOrderNumber.textContent =
                    orderNumber;

            }


            if (receiptDate) {

                receiptDate.textContent =
                    currentOrderDate;

            }


            if (receiptCustomerName) {

                receiptCustomerName.textContent =
                    customerName;

            }


            if (receiptCustomerPhone) {

                receiptCustomerPhone.textContent =
                    customerPhone;

            }


            if (receiptCustomerAddress) {

                receiptCustomerAddress.textContent =
                    customerAddress;

            }


            // -------------------------------------------------
            // CLEAR OLD RECEIPT ITEMS
            // -------------------------------------------------

            if (receiptItems) {

                receiptItems.innerHTML =
                    "";


                // -------------------------------------------------
                // ADD CART ITEMS
                // -------------------------------------------------

                cart.forEach(
                    function (item, index) {

                        if (
                            item.type ===
                            "meal"
                        ) {

                            const mealHeading =
                                document.createElement(
                                    "div"
                                );


                            mealHeading.style.fontWeight =
                                "600";

                            mealHeading.style.marginTop =
                                "12px";


                            mealHeading.textContent =
                                `🍛 Meal ${index + 1}`;


                            receiptItems.appendChild(
                                mealHeading
                            );


                            item.items.forEach(
                                function (food) {

                                    const row =
                                        document.createElement(
                                            "div"
                                        );


                                    row.className =
                                        "receipt-item";


                                    const isFreeWater =
                                        food.name
                                            .toLowerCase() ===
                                        "can of water"
                                            .toLowerCase();


                                    row.innerHTML = `
                                        <span class="receipt-item-name">
                                            ${escapeHTML(food.name)} ×${food.quantity}
                                        </span>

                                        <span class="receipt-item-price">
                                            ${
                                                isFreeWater
                                                    ? "FREE"
                                                    : "₦" +
                                                      (
                                                          food.price *
                                                          food.quantity
                                                      ).toLocaleString()
                                            }
                                        </span>
                                    `;


                                    receiptItems.appendChild(
                                        row
                                    );

                                }
                            );


                        } else {

                            const row =
                                document.createElement(
                                    "div"
                                );


                            row.className =
                                "receipt-item";


                            row.innerHTML = `
                                <span class="receipt-item-name">
                                    ${escapeHTML(item.name)} ×${item.quantity}
                                </span>

                                <span class="receipt-item-price">
                                    ₦${(
                                        item.price *
                                        item.quantity
                                    ).toLocaleString()}
                                </span>
                            `;


                            receiptItems.appendChild(
                                row
                            );

                        }

                    }
                );

            }


            // -------------------------------------------------
            // RECEIPT TOTAL
            // -------------------------------------------------

            const finalSubtotal =
                calculateCartSubtotal();


            const finalDelivery =
                calculateDelivery(
                    finalSubtotal
                );


            const finalGrandTotal =
                finalSubtotal +
                finalDelivery;


            if (receiptTotal) {

                receiptTotal.textContent =
                    finalGrandTotal.toLocaleString();

            }


            // -------------------------------------------------
            // SHOW RECEIPT
            // -------------------------------------------------

            receiptContainer.style.display =
                "block";


            /*
             * Scroll to the receipt so the customer
             * can see it immediately.
             */

            setTimeout(
                function () {

                    receiptContainer.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                },
                100
            );

        };


    // =========================================================
    // SEND ORDER TO WHATSAPP
    // =========================================================

    function sendWhatsAppMessage() {

        if (
            !orderMessage ||
            orderMessage === ""
        ) {

            alert(
                "Please place an order first."
            );

            return;

        }


        const whatsappNumber =
            "2349169452392";


        const whatsappURL =
            "https://wa.me/" +
            whatsappNumber +
            "?text=" +
            encodeURIComponent(
                orderMessage +
                "\n\n" +
                "✅ I have completed payment." +
                "\n\n" +
                "I am about to attach my payment receipt."
            );


        window.open(
            whatsappURL,
            "_blank"
        );


        /*
         * IMPORTANT:
         * The receipt must be generated BEFORE
         * the cart is cleared.
         */

        window.generateReceipt();


        // =====================================================
        // RESET EVERYTHING
        // =====================================================

        cart = [];

        deliveryFee = 0;


        updateCart();


        if (paymentPopup) {

            paymentPopup.style.display =
                "none";

        }


        if (checkoutForm) {

            checkoutForm.style.display =
                "none";

        }


        if (paymentCheck) {

            paymentCheck.checked =
                false;

        }


        if (paymentDone) {

            paymentDone.disabled =
                true;

            paymentDone.style.opacity =
                "0.5";

            paymentDone.style.pointerEvents =
                "none";

        }


        const customerName =
            document.querySelector(
                "#customer-name"
            );

        const customerPhone =
            document.querySelector(
                "#customer-phone"
            );

        const customerAddress =
            document.querySelector(
                "#customer-address"
            );


        if (customerName) {
            customerName.value = "";
        }


        if (customerPhone) {
            customerPhone.value = "";
        }


        if (customerAddress) {
            customerAddress.value = "";
        }


        alert(
            "Thank you! Kindly attach your payment receipt in WhatsApp and send it."
        );

    }


    // =========================================================
    // PAYMENT BUTTON
    // =========================================================

    if (paymentDone) {

        paymentDone.addEventListener(
            "click",
            function (e) {

                e.preventDefault();


                /*
                 * Generate the receipt first while
                 * the cart and customer information
                 * are still available.
                 */

                window.generateReceipt();


                /*
                 * Send the order to WhatsApp.
                 */

                sendWhatsAppMessage();

            }
        );

    }


    // =========================================================
    // SAVE RECEIPT
    // =========================================================

    if (downloadReceipt) {

        downloadReceipt.addEventListener(
            "click",
            function () {

                if (
                    !receiptContainer ||
                    receiptContainer.style.display ===
                    "none"
                ) {

                    alert(
                        "Please complete an order first."
                    );

                    return;

                }


                /*
                 * Print the receipt.
                 * The customer can choose
                 * "Save as PDF" from the browser.
                 */

                const receiptContent =
                    receiptContainer.innerHTML;


                const printWindow =
                    window.open(
                        "",
                        "_blank",
                        "width=800,height=900"
                    );


                if (!printWindow) {

                    alert(
                        "Please allow pop-ups in your browser to save the receipt."
                    );

                    return;

                }


                printWindow.document.write(`
                    <!DOCTYPE html>
                    <html>

                    <head>

                        <title>Beta Food Receipt ${currentOrderNumber}</title>

                        <meta charset="UTF-8">

                        <style>

                            * {
                                box-sizing: border-box;
                            }

                            body {
                                font-family: Arial, sans-serif;
                                background: #ffffff;
                                color: #222;
                                padding: 30px;
                                margin: 0;
                            }

                            #receipt {
                                max-width: 700px;
                                margin: 0 auto;
                            }

                            img {
                                max-width: 150px;
                                height: auto;
                            }

                            .receipt-item {
                                display: flex;
                                justify-content: space-between;
                                gap: 20px;
                                padding: 8px 0;
                                border-bottom: 1px solid #ddd;
                            }

                            .receipt-divider {
                                border-top: 1px solid #222;
                                margin: 15px 0;
                            }

                            .receipt-total {
                                display: flex;
                                justify-content: space-between;
                                font-size: 20px;
                                font-weight: bold;
                                padding: 15px 0;
                            }

                            .payment-confirmed {
                                font-weight: bold;
                            }

                            button {
                                display: none;
                            }

                            @media print {
                                body {
                                    padding: 0;
                                }
                            }

                        </style>

                    </head>

                    <body>

                        <div id="receipt">
                            ${receiptContent}
                        </div>

                    </body>

                    </html>
                `);


                printWindow.document.close();


                printWindow.focus();


                setTimeout(
                    function () {

                        printWindow.print();

                    },
                    500
                );

            }
        );

    }


    // =========================================================
    // SEND RECEIPT TO WHATSAPP
    // =========================================================

    if (sendReceiptWhatsApp) {

        sendReceiptWhatsApp.addEventListener(
            "click",
            function () {

                if (
                    !currentOrderNumber
                ) {

                    alert(
                        "Please complete an order first."
                    );

                    return;

                }


                const customerName =
                    document.querySelector(
                        "#receipt-customer-name"
                    )?.textContent || "";


                const customerPhone =
                    document.querySelector(
                        "#receipt-customer-phone"
                    )?.textContent || "";


                const customerAddress =
                    document.querySelector(
                        "#receipt-customer-address"
                    )?.textContent || "";


                const total =
                    receiptTotal
                        ? receiptTotal.textContent
                        : "0";


                const receiptMessage =
                    `Hello Beta Food! 🍛\n\n` +
                    `*ORDER RECEIPT*\n\n` +
                    `🧾 Order No: ${currentOrderNumber}\n` +
                    `📅 Date: ${currentOrderDate}\n\n` +
                    `👤 Name: ${customerName}\n` +
                    `📞 Phone: ${customerPhone}\n` +
                    `📍 Address: ${customerAddress}\n\n` +
                    `💰 TOTAL: ₦${total}\n\n` +
                    `✅ Payment confirmed.\n\n` +
                    `Thank you for ordering from Beta Food! ❤️`;


                const whatsappNumber =
                    "2349169452392";


                const whatsappURL =
                    "https://wa.me/" +
                    whatsappNumber +
                    "?text=" +
                    encodeURIComponent(
                        receiptMessage
                    );


                window.open(
                    whatsappURL,
                    "_blank"
                );

            }
        );

    }


    // =========================================================
    // ESCAPE HTML
    // =========================================================

    function escapeHTML(text) {

        const div =
            document.createElement(
                "div"
            );

        div.textContent =
            text;

        return div.innerHTML;

    }


    // =========================================================
    // DARK MODE
    // =========================================================

    const themeToggle =
        document.querySelector(
            "#theme-toggle"
        );


    if (themeToggle) {

        if (
            localStorage.getItem(
                "theme"
            ) === "dark"
        ) {

            document.body.classList.add(
                "dark"
            );

            themeToggle.innerHTML =
                '<i class="fa-solid fa-sun"></i>';

        }


        themeToggle.addEventListener(
            "click",
            function () {

                document.body.classList.toggle(
                    "dark"
                );


                if (
                    document.body.classList.contains(
                        "dark"
                    )
                ) {

                    localStorage.setItem(
                        "theme",
                        "dark"
                    );

                    themeToggle.innerHTML =
                        '<i class="fa-solid fa-sun"></i>';

                } else {

                    localStorage.setItem(
                        "theme",
                        "light"
                    );

                    themeToggle.innerHTML =
                        '<i class="fa-solid fa-moon"></i>';

                }


                fixPlusButtons();

            }
        );

    }


    // =========================================================
    // FIX PLUS BUTTONS IN DARK MODE
    // =========================================================

    function fixPlusButtons() {

        const isDark =
            document.body.classList.contains(
                "dark"
            );


        const plusButtons =
            document.querySelectorAll(
                ".quantity-plus"
            );


        plusButtons.forEach(
            function (btn) {

                if (isDark) {

                    btn.style.backgroundColor =
                        "#4CAF50";

                    btn.style.borderColor =
                        "#4CAF50";

                    btn.style.color =
                        "#ffffff";

                } else {

                    btn.style.backgroundColor =
                        "";

                    btn.style.borderColor =
                        "";

                    btn.style.color =
                        "";

                }

            }
        );

    }


    setTimeout(
        fixPlusButtons,
        100
    );

    setTimeout(
        fixPlusButtons,
        300
    );


    // =========================================================
    // FLOATING ADD TO CART BUTTON
    // =========================================================

    (function () {

        const originalBtn =
            document.getElementById(
                "add-built-meal"
            );


        if (!originalBtn) {
            return;
        }


        let floatingBtn =
            document.getElementById(
                "floating-add-btn"
            );


        if (!floatingBtn) {

            floatingBtn =
                document.createElement(
                    "button"
                );


            floatingBtn.id =
                "floating-add-btn";


            floatingBtn.className =
                "btn";


            floatingBtn.textContent =
                "🛒 Add Meal to Cart";


            floatingBtn.style.position =
                "fixed";


            floatingBtn.style.bottom =
                "30px";


            floatingBtn.style.left =
                "50%";


            floatingBtn.style.transform =
                "translateX(-50%) translateY(20px) scale(0.9)";


            floatingBtn.style.opacity =
                "0";


            floatingBtn.style.pointerEvents =
                "none";


            floatingBtn.style.zIndex =
                "999999";


            floatingBtn.style.width =
                "90%";


            floatingBtn.style.maxWidth =
                "400px";


            floatingBtn.style.padding =
                "16px 20px";


            floatingBtn.style.borderRadius =
                "50px";


            floatingBtn.style.boxShadow =
                "0 8px 30px rgba(0,0,0,0.3)";


            floatingBtn.style.fontSize =
                "16px";


            floatingBtn.style.fontWeight =
                "600";


            floatingBtn.style.cursor =
                "pointer";


            floatingBtn.style.border =
                "none";


            floatingBtn.style.background =
                "#FF6B35";


            floatingBtn.style.color =
                "#fff";


            floatingBtn.style.transition =
                "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)";


            floatingBtn.style.willChange =
                "transform, opacity";


            document.body.appendChild(
                floatingBtn
            );

        }


        function hasSelectedItems() {

            const quantities =
                document.querySelectorAll(
                    ".quantity"
                );


            let selectedTotal = 0;


            quantities.forEach(
                function (el) {

                    selectedTotal +=
                        parseInt(
                            el.textContent ||
                            "0",
                            10
                        );

                }
            );


            return selectedTotal > 0;

        }


        function openCart() {

            const icon =
                document.querySelector(
                    ".cart-icon"
                );


            if (icon) {

                icon.click();

            }

        }


        function handleAddToCart() {

            setTimeout(
                openCart,
                150
            );

        }


        originalBtn.addEventListener(
            "click",
            handleAddToCart
        );


        floatingBtn.addEventListener(
            "click",
            function () {

                originalBtn.click();

            }
        );


        let isFloatingVisible =
            false;


        function updateFloatingButton() {

            const rect =
                originalBtn.getBoundingClientRect();


            const viewportHeight =
                window.innerHeight;


            const hasItems =
                hasSelectedItems();


            const isOriginalOnScreen =
                rect.bottom > 30 &&
                rect.top <
                    viewportHeight - 30;


            const shouldShow =
                !isOriginalOnScreen &&
                hasItems;


            if (
                shouldShow ===
                isFloatingVisible
            ) {

                return;

            }


            isFloatingVisible =
                shouldShow;


            if (shouldShow) {

                floatingBtn.style.pointerEvents =
                    "auto";

                floatingBtn.style.opacity =
                    "1";

                floatingBtn.style.transform =
                    "translateX(-50%) translateY(0) scale(1)";

            } else {

                floatingBtn.style.pointerEvents =
                    "none";

                floatingBtn.style.opacity =
                    "0";

                floatingBtn.style.transform =
                    "translateX(-50%) translateY(20px) scale(0.9)";

            }

        }


        let scrollTimeout;


        window.addEventListener(
            "scroll",
            function () {

                if (scrollTimeout) {
                    return;
                }


                scrollTimeout =
                    setTimeout(
                        function () {

                            updateFloatingButton();

                            scrollTimeout =
                                null;

                        },
                        50
                    );

            }
        );


        let resizeTimeout;


        window.addEventListener(
            "resize",
            function () {

                if (resizeTimeout) {
                    return;
                }


                resizeTimeout =
                    setTimeout(
                        function () {

                            updateFloatingButton();

                            resizeTimeout =
                                null;

                        },
                        100
                    );

            }
        );


        document.addEventListener(
            "click",
            function (e) {

                if (
                    e.target.closest(
                        ".quantity-plus, .quantity-minus"
                    )
                ) {

                    setTimeout(
                        updateFloatingButton,
                        50
                    );

                }

            }
        );


        setTimeout(
            updateFloatingButton,
            100
        );

        setTimeout(
            updateFloatingButton,
            300
        );

    })();


    // =========================================================
    // CUSTOMER REVIEWS SYSTEM
    // =========================================================

    (function () {

        const stars =
            document.querySelectorAll(
                ".star"
            );


        let selectedRating =
            0;


        const ratingText =
            document.querySelector(
                ".rating-text"
            );


        // -----------------------------------------------------
        // STAR RATING
        // -----------------------------------------------------

        stars.forEach(
            function (star) {

                star.addEventListener(
                    "click",
                    function () {

                        selectedRating =
                            parseInt(
                                this.dataset.value,
                                10
                            );


                        updateStars(
                            selectedRating
                        );


                        if (ratingText) {

                            const messages = [
                                "",
                                "⭐ Poor - We'll do better!",
                                "⭐⭐ Fair - Room for improvement!",
                                "⭐⭐⭐ Good - Thank you!",
                                "⭐⭐⭐⭐ Great - We appreciate you!",
                                "⭐⭐⭐⭐⭐ Excellent - You made our day!"
                            ];


                            ratingText.textContent =
                                messages[
                                    selectedRating
                                ] ||
                                "Tap a star to rate";


                            ratingText.style.color =
                                "#FF6B35";


                            ratingText.style.fontWeight =
                                "600";

                        }

                    }
                );


                star.addEventListener(
                    "mouseenter",
                    function () {

                        const value =
                            parseInt(
                                this.dataset.value,
                                10
                            );


                        updateStars(
                            value
                        );

                    }
                );


                star.addEventListener(
                    "mouseleave",
                    function () {

                        updateStars(
                            selectedRating
                        );

                    }
                );

            }
        );


        function updateStars(rating) {

            stars.forEach(
                function (star) {

                    const value =
                        parseInt(
                            star.dataset.value,
                            10
                        );


                    if (
                        value <=
                        rating
                    ) {

                        star.classList.add(
                            "active"
                        );

                    } else {

                        star.classList.remove(
                            "active"
                        );

                    }

                }
            );

        }


        // -----------------------------------------------------
        // SUBMIT REVIEW
        // -----------------------------------------------------

        const submitBtn =
            document.getElementById(
                "submit-review"
            );


        if (!submitBtn) {
            return;
        }


        submitBtn.addEventListener(
            "click",
            function () {

                const comment =
                    document.getElementById(
                        "review-comment"
                    );


                const nameInput =
                    document.getElementById(
                        "review-name"
                    );


                if (
                    selectedRating ===
                    0
                ) {

                    alert(
                        "Please select a star rating! ⭐"
                    );

                    return;

                }


                if (
                    !comment ||
                    !comment.value.trim()
                ) {

                    alert(
                        "Please write your review! 📝"
                    );

                    return;

                }


                const review = {

                    rating:
                        selectedRating,

                    comment:
                        comment.value.trim(),

                    name:
                        nameInput &&
                        nameInput.value.trim()
                            ? nameInput.value.trim()
                            : "Anonymous",

                    date:
                        new Date().toLocaleDateString(
                            "en-US",
                            {
                                year:
                                    "numeric",

                                month:
                                    "long",

                                day:
                                    "numeric"
                            }
                        ),

                    id:
                        Date.now()

                };


                saveReview(
                    review
                );


                comment.value =
                    "";


                if (nameInput) {

                    nameInput.value =
                        "";

                }


                selectedRating =
                    0;


                updateStars(
                    0
                );


                if (ratingText) {

                    ratingText.textContent =
                        "Tap a star to rate";


                    ratingText.style.color =
                        "#888";


                    ratingText.style.fontWeight =
                        "400";

                }


                displayReviews();


                const btn =
                    this;


                const originalText =
                    btn.textContent;


                btn.textContent =
                    "✅ Review Submitted!";


                btn.style.background =
                    "#28a745";


                setTimeout(
                    function () {

                        btn.textContent =
                            originalText;


                        btn.style.background =
                            "#FF6B35";

                    },
                    2000
                );

            }
        );


        // -----------------------------------------------------
        // SAVE REVIEW
        // -----------------------------------------------------

        function saveReview(review) {

            let reviews =
                JSON.parse(
                    localStorage.getItem(
                        "betaFoodReviews"
                    ) || "[]"
                );


            reviews.unshift(
                review
            );


            localStorage.setItem(
                "betaFoodReviews",
                JSON.stringify(
                    reviews
                )
            );

        }


        // -----------------------------------------------------
        // DELETE REVIEW
        // -----------------------------------------------------

        function deleteReview(id) {

            if (
                !confirm(
                    "Delete this review? This cannot be undone."
                )
            ) {

                return;

            }


            let reviews =
                JSON.parse(
                    localStorage.getItem(
                        "betaFoodReviews"
                    ) || "[]"
                );


            reviews =
                reviews.filter(
                    function (review) {

                        return (
                            review.id !==
                            id
                        );

                    }
                );


            localStorage.setItem(
                "betaFoodReviews",
                JSON.stringify(
                    reviews
                )
            );


            displayReviews();

        }


        // -----------------------------------------------------
        // DISPLAY REVIEWS
        // -----------------------------------------------------

        function displayReviews() {

            const container =
                document.getElementById(
                    "reviews-list"
                );


            if (!container) {
                return;
            }


            const reviews =
                JSON.parse(
                    localStorage.getItem(
                        "betaFoodReviews"
                    ) || "[]"
                );


            if (
                reviews.length === 0
            ) {

                container.innerHTML =
                    '<p class="no-reviews">Be the first to leave a review! 🌟</p>';

                return;

            }


            let html =
                "";


            reviews.forEach(
                function (review) {

                    const starsHTML =
                        "⭐".repeat(
                            review.rating
                        ) +
                        "☆".repeat(
                            5 -
                            review.rating
                        );


                    html += `
                        <div class="review-item">

                            <div class="review-header">

                                <span class="review-name">
                                    ${escapeHTML(review.name)}
                                </span>

                                <div>

                                    <span class="review-stars">
                                        ${starsHTML}
                                    </span>

                                    <button
                                        type="button"
                                        class="delete-review"
                                        data-id="${review.id}"
                                        title="Delete this review">
                                        🗑️
                                    </button>

                                </div>

                            </div>

                            <p class="review-comment">
                                ${escapeHTML(review.comment)}
                            </p>

                            <span class="review-date">
                                ${review.date}
                            </span>

                        </div>
                    `;

                }
            );


            container.innerHTML =
                html;

        }


        // -----------------------------------------------------
        // DELETE CLICK
        // -----------------------------------------------------

        document.addEventListener(
            "click",
            function (e) {

                const deleteBtn =
                    e.target.closest(
                        ".delete-review"
                    );


                if (deleteBtn) {

                    const id =
                        parseInt(
                            deleteBtn.dataset.id,
                            10
                        );


                    deleteReview(
                        id
                    );

                }

            }
        );


        // -----------------------------------------------------
        // LOAD REVIEWS
        // -----------------------------------------------------

        displayReviews();

    })();


    // =========================================================
    // INITIAL CART UPDATE
    // =========================================================

    updateCart();


    // =========================================================
    // LOADER
    // =========================================================

    window.addEventListener(
        "load",
        function () {

            const loader =
                document.getElementById(
                    "loader"
                );


            if (loader) {

                loader.classList.add(
                    "hide"
                );

            }

        }
    );


    // =========================================================
    // FINAL CONSOLE MESSAGE
    // =========================================================

    console.log(
        "✅ Beta Food script loaded successfully."
    );

});
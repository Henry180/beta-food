/* =========================================================
   BETA FOOD — UI/UX ENHANCEMENTS
   Purely additive: does not touch cart / checkout / meal
   builder logic in script.js. Safe to load after it.
   ========================================================= */
(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {

        /* =====================================================
           0. ANNOUNCEMENT BAR (dismiss + remember for session)
        ===================================================== */
        var bar = document.getElementById("announcement-bar");
        if (bar) {
            try {
                if (sessionStorage.getItem("bf-announcement-dismissed") === "1") {
                    bar.style.display = "none";
                }
            } catch (e) { /* storage unavailable, ignore */ }

            var closeBtn = document.getElementById("close-announcement");
            if (closeBtn) {
                closeBtn.addEventListener("click", function () {
                    bar.style.display = "none";
                    try { sessionStorage.setItem("bf-announcement-dismissed", "1"); } catch (e) {}
                });
            }
        }

        /* =====================================================
           1. TOAST NOTIFICATIONS (replaces plain alert() popups)
        ===================================================== */
        var stack = document.createElement("div");
        stack.id = "toast-stack";
        document.body.appendChild(stack);

        function showToast(message) {
            var toast = document.createElement("div");
            toast.className = "bf-toast";
            toast.textContent = message;
            stack.appendChild(toast);
            setTimeout(function () {
                toast.classList.add("leaving");
                setTimeout(function () { toast.remove(); }, 300);
            }, 3200);
        }

        var nativeAlert = window.alert;
        window.alert = function (msg) {
            try {
                showToast(String(msg));
            } catch (e) {
                nativeAlert(msg);
            }
        };

        /* =====================================================
           2. LIVE "OPEN NOW / CLOSED" STATUS BADGE
        ===================================================== */
        var statusEl = document.getElementById("status-badge");
        if (statusEl) {
            var hours = {
                0: [12, 18],  // Sunday
                1: [8, 20], 2: [8, 20], 3: [8, 20], 4: [8, 20], 5: [8, 20], // Mon-Fri
                6: [9, 21]  // Saturday
            };
            var now = new Date();
            var day = now.getDay();
            var todayHours = hours[day];
            var currentHour = now.getHours() + now.getMinutes() / 60;
            var isOpen = todayHours && currentHour >= todayHours[0] && currentHour < todayHours[1];

            var dot = document.createElement("span");
            dot.className = "status-dot";
            var text = document.createElement("span");

            if (isOpen) {
                var closeHour = todayHours[1];
                var closeLabel = (closeHour > 12 ? closeHour - 12 : closeHour) + (closeHour >= 12 ? "PM" : "AM");
                text.textContent = "Open Now \u2014 closes " + closeLabel;
            } else {
                statusEl.classList.add("closed");
                text.textContent = "Closed right now \u2014 see hours below";
            }
            statusEl.appendChild(dot);
            statusEl.appendChild(text);
        }

        /* =====================================================
           3. SCROLL PROGRESS BAR
        ===================================================== */
        var progress = document.createElement("div");
        progress.id = "scroll-progress";
        document.body.appendChild(progress);
        window.addEventListener("scroll", function () {
            var scrollTop = window.scrollY;
            var docHeight = document.documentElement.scrollHeight - window.innerHeight;
            var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            progress.style.width = pct + "%";
        }, { passive: true });

        /* =====================================================
           4. STICKY MOBILE ORDER BAR
           Mirrors #cart-count / #cart-total so mobile users
           always see a quick path to checkout.
        ===================================================== */
        var cartCountEl = document.getElementById("cart-count");
        var cartTotalEl = document.getElementById("cart-total");
        var cartIcon = document.querySelector(".cart-icon");

        if (cartCountEl && cartTotalEl && cartIcon) {
            var bar = document.createElement("div");
            bar.id = "mobile-order-bar";
            bar.innerHTML =
                '<div class="mob-info"><span id="mob-count">0 items</span><strong>\u20A6<span id="mob-total">0</span></strong></div>' +
                '<button type="button" id="mob-view-cart">View Cart</button>';
            document.body.appendChild(bar);

            var mobCount = document.getElementById("mob-count");
            var mobTotal = document.getElementById("mob-total");

            function syncBar() {
                var count = parseInt(cartCountEl.textContent || "0", 10) || 0;
                mobCount.textContent = count + (count === 1 ? " item" : " items");
                mobTotal.textContent = cartTotalEl.textContent || "0";
                bar.classList.toggle("show", count > 0);
            }

            document.getElementById("mob-view-cart").addEventListener("click", function () {
                cartIcon.click();
                window.scrollTo({ top: 0, behavior: "smooth" });
            });

            var obs = new MutationObserver(syncBar);
            obs.observe(cartCountEl, { childList: true, characterData: true, subtree: true });
            obs.observe(cartTotalEl, { childList: true, characterData: true, subtree: true });
            syncBar();
        }

        /* =====================================================
           5. FAQ ACCORDION
        ===================================================== */
        document.querySelectorAll(".faq-question").forEach(function (q) {
            q.addEventListener("click", function () {
                var item = q.closest(".faq-item");
                var wasOpen = item.classList.contains("open");
                document.querySelectorAll(".faq-item.open").forEach(function (openItem) {
                    if (openItem !== item) openItem.classList.remove("open");
                });
                item.classList.toggle("open", !wasOpen);
            });
        });

        /* =====================================================
           6. CANCEL ORDER
           Clears the cart by driving the existing remove-item
           buttons (safe: doesn't touch script.js's cart array
           directly), resets the checkout form, and closes it.
        ===================================================== */
        var cancelBtn = document.getElementById("cancel-order");
        if (cancelBtn) {
            cancelBtn.addEventListener("click", function () {
                if (!confirm("Cancel this order and empty your cart?")) return;

                var guard = 0;
                var btn;
                while (guard < 200 && (btn = document.querySelector(".remove-btn, .remove-meal"))) {
                    btn.click();
                    guard++;
                }

                var nameField = document.getElementById("customer-name");
                var phoneField = document.getElementById("customer-phone");
                var addressField = document.getElementById("customer-address");
                if (nameField) nameField.value = "";
                if (phoneField) phoneField.value = "";
                if (addressField) addressField.value = "";

                var form = document.getElementById("checkout-form");
                if (form) {
                    form.classList.remove("open");
                    form.style.display = "none";
                }

                var box = document.querySelector(".cart-box");
                if (box) box.style.display = "none";

                showToast("Your order has been cancelled.");
            });
        }

    });
})();

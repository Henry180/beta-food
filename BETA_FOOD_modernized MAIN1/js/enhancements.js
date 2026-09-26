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

        /* =====================================================
           7. FLOATING QUICK-ORDER BUTTON (landing page only)
           Shows once the main hero "Order From Our Menu" button
           has scrolled out of view.
        ===================================================== */
        var floatingMenuBtn = document.getElementById("floating-menu-btn");
        var heroOrderBtn = document.querySelector(".hero .cta-glow");
        if (floatingMenuBtn && heroOrderBtn && "IntersectionObserver" in window) {
            var heroBtnObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    floatingMenuBtn.classList.toggle("show", !entry.isIntersecting);
                });
            }, { threshold: 0 });
            heroBtnObserver.observe(heroOrderBtn);
        }

        /* =====================================================
           8. SOLD-OUT ITEMS (from a published Google Sheet)
           Set SOLD_OUT_SHEET_URL below to your sheet's published
           CSV link. Leave it as null to skip this feature.
           Expected columns: Item Name | Status
           Row is treated as sold out if Status contains "sold out"
           (case-insensitive). Item Name must match the <h4> text
           of a meal-option exactly (e.g. "Jollof Rice").
        ===================================================== */
        var SOLD_OUT_SHEET_URL = null; // e.g. "https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?output=csv"

        function parseCSV(text) {
            var rows = [];
            var row = [];
            var field = "";
            var inQuotes = false;
            for (var i = 0; i < text.length; i++) {
                var ch = text[i];
                if (inQuotes) {
                    if (ch === '"') {
                        if (text[i + 1] === '"') { field += '"'; i++; }
                        else { inQuotes = false; }
                    } else {
                        field += ch;
                    }
                } else {
                    if (ch === '"') inQuotes = true;
                    else if (ch === ',') { row.push(field); field = ""; }
                    else if (ch === '\n' || ch === '\r') {
                        if (ch === '\r' && text[i + 1] === '\n') i++;
                        row.push(field); field = "";
                        if (row.length > 1 || row[0] !== "") rows.push(row);
                        row = [];
                    } else {
                        field += ch;
                    }
                }
            }
            if (field !== "" || row.length) { row.push(field); rows.push(row); }
            return rows;
        }

        if (SOLD_OUT_SHEET_URL && document.querySelector(".meal-option")) {
            fetch(SOLD_OUT_SHEET_URL)
                .then(function (res) { return res.text(); })
                .then(function (csv) {
                    var rows = parseCSV(csv);
                    if (!rows.length) return;
                    var header = rows[0].map(function (h) { return h.trim().toLowerCase(); });
                    var nameCol = header.indexOf("item name");
                    var statusCol = header.indexOf("status");
                    if (nameCol === -1) nameCol = 0;
                    if (statusCol === -1) statusCol = 1;

                    var soldOutNames = [];
                    for (var r = 1; r < rows.length; r++) {
                        var statusVal = (rows[r][statusCol] || "").toLowerCase();
                        if (statusVal.indexOf("sold out") !== -1) {
                            soldOutNames.push((rows[r][nameCol] || "").trim().toLowerCase());
                        }
                    }
                    if (!soldOutNames.length) return;

                    document.querySelectorAll(".meal-option").forEach(function (option) {
                        var heading = option.querySelector("h4");
                        if (!heading) return;
                        var itemName = heading.textContent.trim().toLowerCase();
                        if (soldOutNames.indexOf(itemName) !== -1) {
                            option.classList.add("sold-out");
                            var badge = document.createElement("span");
                            badge.className = "meal-badge sold-out-badge";
                            badge.textContent = "Sold Out";
                            option.appendChild(badge);
                            option.querySelectorAll(".quantity-plus, .quantity-minus").forEach(function (btn) {
                                btn.disabled = true;
                            });
                        }
                    });
                })
                .catch(function () { /* sheet unreachable — fail silently, menu still works normally */ });
        }

        /* =====================================================
           9. REVIEW MODERATION
           New reviews are still saved to the visitor's own
           device (script.js handles that) so they get instant
           feedback, but they are NOT what other visitors see.
           Instead, submitting a review opens a pre-filled
           WhatsApp message to the restaurant so they can review
           it and add it to the public Reviews Sheet below.
        ===================================================== */
        var submitReviewBtn = document.getElementById("submit-review");
        if (submitReviewBtn) {
            submitReviewBtn.addEventListener("click", function () {
                var commentField = document.getElementById("review-comment");
                var nameField = document.getElementById("review-name");
                var rating = document.querySelectorAll(".star.active").length;
                var comment = commentField ? commentField.value.trim() : "";
                if (rating === 0 || !comment) return; // same validation as the main handler

                var name = (nameField && nameField.value.trim()) ? nameField.value.trim() : "Anonymous";
                var stars = "";
                for (var i = 0; i < rating; i++) stars += "\u2b50";
                var msg = "New review for approval:\n\n" + stars + "\nName: " + name + "\nReview: " + comment;
                var waUrl = "https://wa.me/2349169452392?text=" + encodeURIComponent(msg);
                setTimeout(function () {
                    window.open(waUrl, "_blank");
                    showToast("Thanks! Your review has been sent for approval and will appear here once reviewed.");
                }, 400);
            }, true); // capture phase: read values before script.js clears the form
        }

        /* =====================================================
           10. PUBLIC REVIEWS (from a published Google Sheet)
           Set REVIEWS_SHEET_URL below to your sheet's published
           CSV link. Leave it as null to skip this feature (the
           page will just show each visitor's own local reviews
           as before).
           Expected columns: Name | Rating | Comment | Date
        ===================================================== */
        var REVIEWS_SHEET_URL = null; // e.g. "https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?output=csv"

        var reviewsListEl = document.getElementById("reviews-list");
        if (REVIEWS_SHEET_URL && reviewsListEl) {
            fetch(REVIEWS_SHEET_URL)
                .then(function (res) { return res.text(); })
                .then(function (csv) {
                    var rows = parseCSV(csv);
                    if (!rows.length) return;
                    var header = rows[0].map(function (h) { return h.trim().toLowerCase(); });
                    var nameCol = header.indexOf("name");
                    var ratingCol = header.indexOf("rating");
                    var commentCol = header.indexOf("comment");
                    var dateCol = header.indexOf("date");
                    if (nameCol === -1) nameCol = 0;
                    if (ratingCol === -1) ratingCol = 1;
                    if (commentCol === -1) commentCol = 2;
                    if (dateCol === -1) dateCol = 3;

                    var approved = [];
                    for (var r = 1; r < rows.length; r++) {
                        var row = rows[r];
                        if (!row[commentCol] && !row[nameCol]) continue;
                        approved.push({
                            name: (row[nameCol] || "Anonymous").trim(),
                            rating: parseInt(row[ratingCol], 10) || 0,
                            comment: (row[commentCol] || "").trim(),
                            date: (row[dateCol] || "").trim()
                        });
                    }
                    if (!approved.length) return;

                    reviewsListEl.innerHTML = "";
                    approved.slice().reverse().forEach(function (rev) {
                        var starsHtml = "";
                        for (var i = 0; i < 5; i++) {
                            starsHtml += '<i class="fa-solid fa-star" style="color:' + (i < rev.rating ? 'var(--gold)' : 'var(--border)') + '"></i>';
                        }
                        var item = document.createElement("div");
                        item.className = "review-item";
                        item.innerHTML =
                            '<p class="rating-text">' + starsHtml + '</p>' +
                            '<p><strong>' + rev.name.replace(/</g, "&lt;") + '</strong>' +
                            (rev.date ? ' <span style="color:var(--text-muted);font-size:12px;">' + rev.date.replace(/</g, "&lt;") + '</span>' : '') + '</p>' +
                            '<p>' + rev.comment.replace(/</g, "&lt;") + '</p>';
                        reviewsListEl.appendChild(item);
                    });

                    var avgStarsEl = document.getElementById("average-stars");
                    var avgTextEl = document.getElementById("average-rating-text");
                    var countEl = document.getElementById("review-count");
                    if (avgStarsEl && countEl) {
                        var total = approved.reduce(function (sum, r) { return sum + r.rating; }, 0);
                        var avg = Math.round(total / approved.length);
                        var starsOut = "";
                        for (var j = 0; j < 5; j++) {
                            starsOut += '<i class="fa-solid fa-star" style="color:' + (j < avg ? 'var(--gold)' : 'var(--border)') + '"></i>';
                        }
                        avgStarsEl.innerHTML = starsOut;
                        countEl.textContent = String(approved.length);
                        if (avgTextEl) avgTextEl.childNodes[0].nodeValue = "Based on ";
                    }
                })
                .catch(function () { /* sheet unreachable — fall back to local reviews already shown */ });
        }

        /* =====================================================
           11. INSTALL APP — on-demand only, no auto-popup
           A small "Install App" link appears in the footer once
           the browser confirms the site is installable. Nothing
           pops up automatically, and nothing here can affect the
           page layout since it's just an inline footer link.
        ===================================================== */
        var deferredInstallPrompt = null;

        window.addEventListener("beforeinstallprompt", function (e) {
            e.preventDefault();
            deferredInstallPrompt = e;
            document.querySelectorAll(".install-app-link").forEach(function (link) {
                link.style.display = "inline";
            });
        });

        window.addEventListener("appinstalled", function () {
            deferredInstallPrompt = null;
            document.querySelectorAll(".install-app-link").forEach(function (link) {
                link.style.display = "none";
            });
        });

        if (!window.matchMedia("(display-mode: standalone)").matches) {
            var footerEl = document.querySelector("footer");
            if (footerEl && !document.querySelector(".install-app-link")) {
                var installLink = document.createElement("a");
                installLink.href = "#";
                installLink.className = "install-app-link";
                installLink.style.display = "none"; // shown only once beforeinstallprompt fires
                installLink.innerHTML = '<i class="fa-solid fa-mobile-screen-button"></i> Install App';
                installLink.addEventListener("click", function (e) {
                    e.preventDefault();
                    if (deferredInstallPrompt) {
                        deferredInstallPrompt.prompt();
                        deferredInstallPrompt.userChoice.then(function () {
                            deferredInstallPrompt = null;
                        });
                    } else {
                        showToast('On iPhone: tap Share, then "Add to Home Screen".');
                    }
                });
                var installP = document.createElement("p");
                installP.appendChild(installLink);
                footerEl.appendChild(installP);
            }
        }

    });
})();

(() => {
    "use strict";
    const { get, save, escape } = MoveNest;
    let toastTimer;
    window.notify = (message) => {
        const el = document.querySelector(".toast");
        if (!el) return;
        el.textContent = message;
        el.hidden = false;
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => (el.hidden = true), 5000);
    };
    function syncAppearanceControls() {
        const dark = document.documentElement.dataset.theme === "dark";
        const rtl = document.documentElement.dir === "rtl";
        const moon = '<path d="M20 14A9 9 0 0 1 10 3a9 9 0 1 0 10 11Z"/>';
        const sun =
            '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M5 19l1.4-1.4M17.6 6.4 19 5"/>';
        document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
            const label = dark ? "Switch to light mode" : "Switch to dark mode";
            button.innerHTML =
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-theme-icon="' +
                (dark ? "sun" : "moon") +
                '">' +
                (dark ? sun : moon) +
                "</svg>";
            button.setAttribute("aria-label", label);
            button.title = label;
            button.setAttribute("aria-pressed", String(dark));
        });
        document.querySelectorAll("[data-rtl-toggle]").forEach((button) => {
            const label = rtl ? "Switch to left-to-right layout" : "Switch to right-to-left layout";
            button
                .querySelector("[data-direction-label]")
                ?.replaceChildren(document.createTextNode(rtl ? "LTR" : "RTL"));
            button.setAttribute("aria-label", label);
            button.title = label;
            button.setAttribute("aria-pressed", String(rtl));
        });
    }
    syncAppearanceControls();
    window.addEventListener("theme-change", syncAppearanceControls);
    window.addEventListener("direction-change", syncAppearanceControls);
    document.querySelectorAll("[data-theme-toggle]").forEach((button) =>
        button.addEventListener("click", () => {
            const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
            document.documentElement.dataset.theme = theme;
            localStorage.setItem("movenest-theme", theme);
            window.dispatchEvent(new Event("theme-change"));
        }),
    );
    document.querySelectorAll("[data-rtl-toggle]").forEach((button) =>
        button.addEventListener("click", () => {
            const dir = document.documentElement.dir === "rtl" ? "ltr" : "rtl";
            document.documentElement.dir = dir;
            localStorage.setItem("movenest-dir", dir);
            window.dispatchEvent(new Event("direction-change"));
        }),
    );
    document.querySelector(".back-top")?.addEventListener("click", () =>
        window.scrollTo({
            top: 0,
            behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
        }),
    );
    document.querySelectorAll("[data-form]").forEach((form) =>
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            if (!form.reportValidity()) return;
            const data = Object.fromEntries(new FormData(form));
            const output = form.querySelector(".form-message");
            switch (form.dataset.form) {
                case "contact": {
                    const store = get();
                    store.messages.unshift({
                        id: "M" + Date.now(),
                        name: data.name,
                        email: data.email,
                        message: `${data.message}\n\nRoute: ${data.pickup} → ${data.delivery}\nPhone: ${data.phone}`,
                        date: new Date().toISOString().slice(0, 10),
                        read: false,
                    });
                    save(store);
                    output.textContent =
                        "Your sample inquiry is saved. View it in Admin → Messages. No message was sent externally.";
                    form.reset();
                    break;
                }
                case "password":
                    output.textContent =
                        data["new-password"].length < 8
                            ? "Use at least 8 characters."
                            : data["new-password"] !== data["confirm-password"]
                              ? "The passwords do not match."
                              : "Validation passed. No real password was changed or stored.";
                    break;
                case "newsletter":
                    output.textContent =
                        "Your checklist is ready. Use the link below to save a local copy.";
                    {
                        const a = document.createElement("a");
                        a.href = "../documentation/moving-checklist.txt";
                        a.download = "movenest-moving-checklist.txt";
                        a.textContent = "Download moving checklist";
                        a.className = "text-link";
                        output.append(document.createElement("br"), a);
                    }
                    break;
                case "launch":
                    localStorage.setItem("movenest-launch-interest", "true");
                    output.textContent = "Interest saved in this browser. No email was sent.";
                    break;
            }
        }),
    );
    document.querySelector("#availability-form")?.addEventListener("submit", (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const data = new FormData(form);
        const cities = ["bengaluru", "hyderabad", "chennai", "pune", "mumbai", "delhi ncr"];
        const found = ["pickup-city", "delivery-city"].every((k) =>
            cities.includes(data.get(k).trim().toLowerCase()),
        );
        form.querySelector(".form-message").textContent = found
            ? "Both cities are in the fictional sample network. Contact a real provider to confirm route and dates."
            : "This route is outside the sample city list. Submit an inquiry to explore the website contact flow.";
    });
    function applyArticleCategory(category) {
        const tabs = [...document.querySelectorAll("[data-blog-filter]")];
        const selected =
            tabs.find((tab) => tab.dataset.blogFilter.toLowerCase() === category.toLowerCase()) ||
            tabs[0];
        if (!selected) return;
        tabs.forEach((tab) => {
            const active = tab === selected;
            tab.classList.toggle("active", active);
            tab.setAttribute("aria-pressed", String(active));
            if (active) tab.setAttribute("aria-current", "page");
            else tab.removeAttribute("aria-current");
        });
        document.querySelectorAll("[data-category]").forEach((card) => {
            card.hidden =
                selected.dataset.blogFilter !== "All" &&
                card.dataset.category !== selected.dataset.blogFilter;
        });
    }
    document.querySelectorAll("[data-blog-filter]").forEach((tab) =>
        tab.addEventListener("click", (event) => {
            if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            history.pushState(null, "", tab.href);
            applyArticleCategory(tab.dataset.blogFilter);
        }),
    );
    window.addEventListener("popstate", () =>
        applyArticleCategory(new URLSearchParams(location.search).get("category") || "All"),
    );
    applyArticleCategory(new URLSearchParams(location.search).get("category") || "All");
    document
        .querySelector("#blog-pagination button")
        ?.addEventListener("click", () =>
            notify("You’re viewing all three articles in this sample."),
        );
    const params = new URLSearchParams(location.search);
    if (document.querySelector("[data-service-title]")) {
        const key = params.get("service") || "local";
        const title = MoveNest.serviceNames[key] || MoveNest.serviceNames.local;
        document.querySelectorAll("[data-service-title]").forEach((el) => (el.textContent = title));
        const descriptions = {
            local: "Move across your city with a clear plan, organized packing and careful delivery.",
            intercity:
                "Plan a considered long-distance move with inventory checks, transit coordination and a clear delivery handover.",
            packing:
                "Give your belongings thoughtful protection with room-by-room packing, suitable materials and organized unpacking.",
            office: "Coordinate workstation packing, equipment inventory and scheduled loading to support your business move.",
        };
        document.querySelector("[data-service-description]").textContent =
            descriptions[key] || descriptions.local;
        const hero = document.querySelector(".inner-hero-media img");
        if (hero && ["intercity", "packing", "office"].includes(key)) {
            hero.src = "../assets/images/hero-service-" + key + ".webp";
            hero.alt = {
                intercity: "Moving truck on a scenic long-distance route",
                packing: "Specialist protecting a large framed artwork",
                office: "A professional team relocating an office",
            }[key];
        }
        const introduction = document.querySelector(".inner-hero-copy > p");
        if (introduction) introduction.textContent = descriptions[key] || descriptions.local;
        const overviewTitle = document.querySelector("main > section:nth-of-type(2) h2");
        const titles = {
            intercity: "A new city.<br>A familiar kind of care.",
            packing: "Thoughtful protection.<br>For the things you love.",
            office: "Business as usual.<br>A brand-new workspace.",
        };
        if (overviewTitle && titles[key]) overviewTitle.innerHTML = titles[key];
        document.title = title + " | MoveNest";
    }
    if (document.querySelector("[data-article-title]")) {
        const key = params.get("article");
        const title =
            key === "moving-day"
                ? "Your calm, collected moving-day checklist"
                : key === "reliable"
                  ? "How to choose a moving company with confidence"
                  : null;
        if (title) {
            document
                .querySelectorAll("[data-article-title]")
                .forEach((element) => (element.textContent = title));
            document.title = title + " | MoveNest";
            const hero = document.querySelector(".inner-hero-media img");
            if (hero) {
                hero.src = "../assets/images/hero-article-" + key + ".webp";
                hero.alt =
                    key === "moving-day"
                        ? "Family preparing a moving-day checklist"
                        : "Customer reviewing written plans with a move coordinator";
            }
            const feature = document.querySelector("main > section:nth-of-type(2) img");
            if (feature) {
                feature.src =
                    "../assets/images/" +
                    (key === "moving-day" ? "article-move-checklist" : "article-company") +
                    ".webp";
                feature.alt =
                    key === "moving-day"
                        ? "A first-night essentials box ready beside the door"
                        : "Moving crew reviewing loading and inventory";
            }
            document.querySelector(".inner-hero-copy > p").textContent =
                key === "moving-day"
                    ? "A practical room-by-room plan for the days before, during and after your move."
                    : "A thoughtful set of questions for finding the right moving partner.";
            const paragraphs =
                key === "moving-day"
                    ? [
                          [
                              "Two weeks before your move",
                              "Confirm your inventory, compare a written quotation and check access at both addresses. Set a folder aside for essential documents.",
                          ],
                          [
                              "The week before",
                              "Label boxes by room. Arrange utility changes with the relevant providers, pack items you rarely use and share any changes with your coordinator.",
                          ],
                          [
                              "Your first-night essentials",
                              "Keep medicines, chargers, toiletries, a change of clothes, drinking water and important documents with you.",
                          ],
                          [
                              "On moving day",
                              "Walk through the inventory with your crew, point out fragile belongings and check every room before handing over your keys.",
                          ],
                          [
                              "At your new home",
                              "Check the delivered inventory, place boxes in their rooms and unpack what makes your first evening comfortable.",
                          ],
                      ]
                    : [
                          [
                              "Compare a clear written scope",
                              "Ask each provider to list inventory, distance, packing, labour and optional services. Check how changes to the plan are priced.",
                          ],
                          [
                              "Ask about people and protection",
                              "Discuss crew training, handling practices and the protection offered for delicate items. Request the actual terms of any insurance arrangement.",
                          ],
                          [
                              "Verify real business details",
                              "Use independently verifiable company information and relevant local registration records. This fictional website does not demonstrate certification.",
                          ],
                          [
                              "Understand the payment schedule",
                              "Read cancellation terms, deposit requirements and delivery expectations before confirming. Never treat a browser sample as a real booking.",
                          ],
                          [
                              "Keep communication practical",
                              "Choose a provider who answers questions clearly and gives you a named contact for moving day.",
                          ],
                      ];
            document.querySelector("#article-content").innerHTML = paragraphs
                .map(([h, p]) => `<h2>${h}</h2><p>${p}</p>`)
                .join("");
        }
    }
    const countdown = document.querySelector("[data-countdown]");
    if (countdown) {
        let launch = Number(localStorage.getItem("movenest-launch-date"));
        if (!launch || launch < Date.now()) {
            launch = Date.now() + 30 * 86400000;
            localStorage.setItem("movenest-launch-date", launch);
        }
        const tick = () => {
            const remaining = Math.max(0, launch - Date.now());
            const values = [
                Math.floor(remaining / 86400000),
                Math.floor(remaining / 3600000) % 24,
                Math.floor(remaining / 60000) % 60,
                Math.floor(remaining / 1000) % 60,
            ];
            countdown.innerHTML = values
                .map(
                    (v, i) =>
                        `<div><strong>${String(v).padStart(2, "0")}</strong><span>${["Days", "Hours", "Minutes", "Seconds"][i]}</span></div>`,
                )
                .join("");
        };
        tick();
        setInterval(tick, 1000);
    }
    document.querySelectorAll("[data-reset]").forEach((button) =>
        button.addEventListener("click", () => {
            const dialog = document.querySelector("#detail-dialog");
            document.querySelector("#dialog-title").textContent = "Reset the sample?";
            document.querySelector("#dialog-body").innerHTML =
                '<p>This removes local changes and restores the original fictional bookings and messages.</p><button class="btn" id="confirm-reset">Reset sample data</button>';
            dialog.showModal();
            document.querySelector("#confirm-reset").addEventListener("click", () => {
                save(MoveNest.seed());
                location.reload();
            });
        }),
    );
    document
        .querySelector("[data-close-dialog]")
        ?.addEventListener("click", () => document.querySelector("#detail-dialog").close());
    document.querySelector("#detail-dialog")?.addEventListener("click", (e) => {
        if (e.target === e.currentTarget) {
            const r = e.currentTarget.getBoundingClientRect();
            if (
                e.clientX < r.left ||
                e.clientX > r.right ||
                e.clientY < r.top ||
                e.clientY > r.bottom
            )
                e.currentTarget.close();
        }
    });
    document
        .querySelector("[data-notifications]")
        ?.addEventListener("click", () =>
            notify(
                `${get().messages.filter((m) => !m.read).length} unread sample inquiries. Open Admin → Messages to view them.`,
            ),
        );
    document
        .querySelector("[data-logout]")
        ?.addEventListener("click", () => localStorage.removeItem("movenest-session"));
    window.addEventListener("storage-unavailable", () =>
        notify("Browser storage is unavailable. Changes will last for this page only."),
    );
})();

/* Match sibling card heading heights per visible row, without truncating text. */
(() => {
    if (document.body.classList.contains("dashboard-page")) return;
    const groups = [
        ...document.querySelectorAll(
            "#main .grid, #main .service-collection, #main .process-gallery, #main .home-size-grid",
        ),
    ];
    let pending = false;
    function alignCardHeadings() {
        pending = false;
        for (const group of groups) {
            const cards = [...group.children].filter((el) => el.matches("article, .panel, .card"));
            const entries = cards
                .map((card) => ({ card, heading: card.querySelector("h3") }))
                .filter((item) => item.heading);
            for (const { card, heading } of entries) {
                heading.style.minHeight = "";
                const meta = card.querySelector(".card-body > .article-meta");
                if (meta) meta.style.minHeight = "";
            }
            const rows = new Map();
            for (const item of entries) {
                const top = Math.round(item.card.getBoundingClientRect().top);
                if (!rows.has(top)) rows.set(top, []);
                rows.get(top).push(item.heading);
            }
            for (const row of new Set(
                entries.map((item) => Math.round(item.card.getBoundingClientRect().top)),
            )) {
                const metas = entries
                    .filter((item) => Math.round(item.card.getBoundingClientRect().top) === row)
                    .map((item) => item.card.querySelector(".card-body > .article-meta"))
                    .filter(Boolean);
                if (metas.length > 1) {
                    const height = Math.max(
                        ...metas.map((el) => el.getBoundingClientRect().height),
                    );
                    metas.forEach((el) => (el.style.minHeight = `${height}px`));
                }
            }
            for (const headings of rows.values()) {
                if (headings.length < 2) continue;
                const height = Math.max(...headings.map((el) => el.getBoundingClientRect().height));
                for (const heading of headings) heading.style.minHeight = `${height}px`;
            }
        }
    }
    function schedule() {
        if (pending) return;
        pending = true;
        requestAnimationFrame(alignCardHeadings);
    }
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener("load", schedule);
    window.addEventListener("direction-change", schedule);
    document.fonts.ready.then(schedule);
    schedule();
})();

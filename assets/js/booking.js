(() => {
    "use strict";
    const form = document.querySelector("#booking-form");
    if (!form) return;
    const { get, save, escape, estimate, serviceNames } = MoveNest;
    let step = 0;
    const fields = [...form.querySelectorAll("[data-step]")];
    const next = document.querySelector("#booking-next");
    const prev = document.querySelector("#booking-prev");
    const date = form.elements.date;
    date.min = new Date().toLocaleDateString("en-CA");
    function values() {
        return Object.fromEntries(new FormData(form));
    }
    function show() {
        fields.forEach((field, i) => (field.hidden = i !== step));
        document.querySelectorAll("[data-step-label]").forEach((label, i) => {
            label.classList.toggle("active", i <= step);
            label.setAttribute("aria-current", i === step ? "step" : "false");
        });
        prev.disabled = step === 0;
        next.textContent = step === 4 ? "Submit sample booking" : "Continue →";
        document.querySelector("#step-counter").textContent = `Step ${step + 1} of 5`;
        if (step === 4) {
            const data = values();
            const result = estimate(data);
            document.querySelector("#booking-review").innerHTML =
                `<dl class="detail-grid"><div><dt>Service</dt><dd>${serviceNames[data.service]}</dd></div><div><dt>Moving date</dt><dd>${escape(data.date)}</dd></div><div><dt>Pickup</dt><dd>${escape(data.pickup)}</dd></div><div><dt>Delivery</dt><dd>${escape(data.delivery)}</dd></div><div><dt>Inventory</dt><dd>${escape(data.inventory)}</dd></div><div><dt>Boxes</dt><dd>${escape(data.boxes)}</dd></div></dl>${estimateTable(result)}<p class="form-note">Taxes excluded. A real provider must confirm inventory, route and availability.</p>`;
        }
        fields[step].querySelector("input,select,textarea")?.focus({ preventScroll: true });
    }
    function validateStep() {
        for (const input of fields[step].querySelectorAll("input,select,textarea")) {
            if (!input.checkValidity()) {
                input.reportValidity();
                return false;
            }
        }
        return true;
    }
    next.addEventListener("click", () => {
        if (!validateStep()) return;
        if (step < 4) {
            step++;
            show();
            return;
        }
        const data = values();
        const result = estimate(data);
        const store = get();
        const booking = {
            ...data,
            ...result,
            id: "MN-" + Date.now().toString().slice(-8),
            customer: "C001",
            status: "Pending",
            crew: "",
            paid: false,
            size: Number(data.size),
        };
        store.bookings.unshift(booking);
        save(store);
        next.disabled = true;
        const output = form.querySelector(".form-message");
        output.innerHTML = `Sample booking <strong>${escape(booking.id)}</strong> saved. <a class="text-link" href="move-tracking.html?booking=${booking.id}">View tracking →</a>`;
        sessionStorage.removeItem("movenest-estimate");
    });
    prev.addEventListener("click", () => {
        if (step > 0) {
            step--;
            show();
        }
    });
    form.addEventListener("submit", (e) => e.preventDefault());
    try {
        const saved = JSON.parse(sessionStorage.getItem("movenest-estimate"));
        if (saved)
            for (const [key, value] of Object.entries(saved))
                if (form.elements[key] && typeof value !== "object")
                    form.elements[key].value = value;
    } catch {}
    show();
})();

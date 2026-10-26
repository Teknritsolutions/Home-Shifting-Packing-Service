(() => {
    "use strict";
    const { estimate, money } = MoveNest;
    const form = document.querySelector("#calculator");
    const labels = {
        base: "Base moving charge",
        distance: "Distance charge",
        packing: "Packing materials",
        labor: "Labour & access",
        extras: "Additional services",
    };
    window.estimateTable = (result) =>
        `<table class="breakdown"><tbody>${Object.entries(result.breakdown)
            .map(([k, v]) => `<tr><td>${labels[k]}</td><td>${money(v)}</td></tr>`)
            .join(
                "",
            )}</tbody><tfoot><tr><td>Illustrative total</td><td>${money(result.total)}</td></tr></tfoot></table>`;
    form?.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!form.reportValidity()) return;
        const values = Object.fromEntries(new FormData(form));
        const result = estimate(values);
        document.querySelector("#estimate-breakdown").innerHTML = estimateTable(result);
        sessionStorage.setItem("movenest-estimate", JSON.stringify({ ...values, ...result }));
    });
    document.querySelector("#quick-quote")?.addEventListener("submit", (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (!form.reportValidity()) return;
        sessionStorage.setItem(
            "movenest-quick-quote",
            JSON.stringify(Object.fromEntries(new FormData(form))),
        );
        location.href = "pricing.html";
    });
    if (form) {
        try {
            const saved = JSON.parse(sessionStorage.getItem("movenest-quick-quote"));
            if (saved) {
                form.elements.pickup.value = saved.pickup;
                form.elements.delivery.value = saved.destination;
                form.elements.size.value = saved.size;
            }
        } catch {}
    }
})();

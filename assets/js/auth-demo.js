(() => {
    "use strict";
    document.querySelectorAll(".password-toggle").forEach((button) =>
        button.addEventListener("click", () => {
            const input = button.previousElementSibling;
            input.type = input.type === "password" ? "text" : "password";
            button.textContent = input.type === "password" ? "Show" : "Hide";
            button.setAttribute(
                "aria-label",
                input.type === "password" ? "Show password" : "Hide password",
            );
        }),
    );
    const form = document.querySelector("#auth-form");
    form?.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!form.reportValidity()) return;
        const values = Object.fromEntries(new FormData(form));
        if (form.dataset.auth === "forgot-password") {
            form.querySelector(".form-message").textContent =
                "Recovery sample complete. No email was sent. Return to login and use any valid email with an 8+ character password.";
            return;
        }
        const store = MoveNest.get();
        if (form.dataset.auth === "register") {
            store.profile = { ...store.profile, name: values.name, email: values.email };
            const customer = store.customers.find((c) => c.id === "C001");
            customer.name = values.name;
            customer.email = values.email;
            MoveNest.save(store);
        }
        localStorage.setItem(
            "movenest-session",
            JSON.stringify({
                role: values.role === "1" ? "admin" : "customer",
                email: values.email,
            }),
        );
        location.href =
            "../dashboard/" +
            (values.role === "1" ? "admin-dashboard" : "customer-dashboard") +
            ".html";
    });
})();

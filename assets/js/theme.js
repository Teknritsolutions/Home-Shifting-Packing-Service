(() => {
    "use strict";
    try {
        const preference = localStorage.getItem("movenest-theme");
        document.documentElement.dataset.theme =
            preference || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
        document.documentElement.dir = localStorage.getItem("movenest-dir") || "ltr";
    } catch {
        document.documentElement.dataset.theme = "light";
    }
    matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
        try {
            if (!localStorage.getItem("movenest-theme")) {
                document.documentElement.dataset.theme = event.matches ? "dark" : "light";
                window.dispatchEvent(new Event("theme-change"));
            }
        } catch {}
    });
})();

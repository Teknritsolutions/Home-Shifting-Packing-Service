const { chromium } = require("playwright");
(async () => {
    const b = await chromium.launch({
        headless: true,
        executablePath:
            "C:/Users/Dell/AppData/Local/ms-playwright/chromium-1248/chrome-win64/chrome.exe",
    });
    const p = await b.newPage();
    let failures = [],
        checks = 0;
    for (const type of ["login", "register", "forgot-password", "404", "coming-soon"]) {
        await p.goto("http://127.0.0.1:4173/pages/" + type + ".html");
        if (await p.locator(".site-header,.site-footer").count()) failures.push(type + " chrome");
        for (const width of [320, 390, 768, 1024, 1440])
            for (const theme of ["light", "dark"])
                for (const dir of ["ltr", "rtl"]) {
                    await p.setViewportSize({ width, height: 1000 });
                    await p.evaluate(
                        (x) => {
                            document.documentElement.dataset.theme = x.theme;
                            document.documentElement.dir = x.dir;
                            window.dispatchEvent(new Event("theme-change"));
                        },
                        { theme, dir },
                    );
                    checks++;
                    if (
                        await p.evaluate(
                            () => document.documentElement.scrollWidth > innerWidth + 1,
                        )
                    )
                        failures.push({ type, width, theme, dir });
                }
        await p.locator("[data-theme-toggle]").click();
        await p.locator("[data-rtl-toggle]").click();
    }
    for (const width of [390, 768, 1024]) {
        await p.setViewportSize({ width, height: 900 });
        await p.goto("http://127.0.0.1:4173/pages/home-1.html");
        await p.locator(".menu-toggle").click();
        if (!(await p.locator(".nav-backdrop").isVisible())) failures.push("backdrop missing");
        await p.locator(".mobile-nav-close").click();
        if (await p.locator(".nav-main").isVisible()) failures.push("close failed");
        await p.locator(".menu-toggle").click();
        await p.keyboard.press("Escape");
        if (await p.locator(".nav-main").isVisible()) failures.push("escape failed");
    }
    await p.setViewportSize({ width: 1024, height: 900 });
    await p.goto("http://127.0.0.1:4173/pages/home-1.html");
    await p.locator(".menu-toggle").click();
    await p.screenshot({ path: "test-results/tablet-navigation-drawer.png" });
    await p.goto("http://127.0.0.1:4173/pages/login.html");
    await p.screenshot({ path: "test-results/login-standalone.png", fullPage: true });
    console.log({ checks, failures });
    await b.close();
    if (failures.length) process.exitCode = 1;
})();

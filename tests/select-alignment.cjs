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
    for (const page of [
        "pages/contact",
        "pages/pricing",
        "dashboard/new-booking",
        "dashboard/admin-bookings",
    ]) {
        await p.goto("http://127.0.0.1:4173/" + page + ".html");
        for (const width of [320, 390, 768, 1024, 1440])
            for (const theme of ["light", "dark"]) {
                await p.setViewportSize({ width, height: 900 });
                await p.evaluate((t) => (document.documentElement.dataset.theme = t), theme);
                checks++;
                const bad = await p
                    .locator("select:visible")
                    .evaluateAll((es) =>
                        es
                            .filter(
                                (e) =>
                                    e.getBoundingClientRect().height > 55 ||
                                    getComputedStyle(e).whiteSpace !== "nowrap",
                            )
                            .map((e) => ({ id: e.id, h: e.getBoundingClientRect().height })),
                    );
                if (
                    bad.length ||
                    (await p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1))
                )
                    failures.push({ page, width, theme, bad });
            }
    }
    await p.setViewportSize({ width: 768, height: 900 });
    await p.goto("http://127.0.0.1:4173/pages/contact.html");
    await p
        .locator("[data-form=contact]")
        .screenshot({ path: "test-results/contact-select-alignment.png" });
    console.log({ checks, failures });
    await b.close();
    if (failures.length) process.exitCode = 1;
})();

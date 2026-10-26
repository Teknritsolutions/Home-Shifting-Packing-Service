const { chromium } = require("playwright");
(async () => {
    const b = await chromium.launch({
        headless: true,
        executablePath:
            "C:/Users/Dell/AppData/Local/ms-playwright/chromium-1248/chrome-win64/chrome.exe",
    });
    const p = await b.newPage();
    await p.goto("http://127.0.0.1:4173/pages/pricing.html");
    await p.evaluate(() => document.fonts.ready);
    let failures = [],
        checks = 0;
    for (const width of [320, 390, 768, 1024, 1280, 1440])
        for (const theme of ["light", "dark"])
            for (const dir of ["ltr", "rtl"]) {
                await p.setViewportSize({ width, height: 1000 });
                await p.evaluate(
                    (x) => {
                        document.documentElement.dataset.theme = x.theme;
                        document.documentElement.dir = x.dir;
                    },
                    { theme, dir },
                );
                const r = await p.locator(".pricing-calculator-layout").evaluate((e) => {
                    const a = e.children[0].getBoundingClientRect(),
                        b = e.children[1].getBoundingClientRect();
                    return {
                        gap: Math.abs(a.bottom - b.bottom),
                        overflow: document.documentElement.scrollWidth > innerWidth + 1,
                    };
                });
                checks++;
                if (r.overflow || (width >= 768 && r.gap > 1))
                    failures.push({ width, theme, dir, r });
            }
    await p.setViewportSize({ width: 1440, height: 1100 });
    await p.evaluate(async () => {
        document.documentElement.dataset.theme = "light";
        document.documentElement.dir = "ltr";
        await Promise.all(
            [...document.querySelectorAll(".estimate-photo img,.cost-factor-photo")].map((e) => {
                e.loading = "eager";
                return e.decode();
            }),
        );
    });
    await p
        .locator(".pricing-calculator-layout")
        .screenshot({ path: "test-results/pricing-image-layout.png" });
    await p
        .locator(".cost-factor-card")
        .first()
        .locator("..")
        .screenshot({ path: "test-results/pricing-factor-backgrounds.png" });
    await p.locator("#calculator [name=pickup]").fill("Bengaluru");
    await p.locator("#calculator [name=delivery]").fill("Pune");
    await p.locator("#calculator button[type=submit]").click();
    if ((await p.locator("#estimate-breakdown table").count()) !== 1)
        failures.push("calculator result missing");
    console.log(JSON.stringify({ checks, failures }));
    await b.close();
    if (failures.length) process.exitCode = 1;
})();

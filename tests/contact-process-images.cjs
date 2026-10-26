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
    for (const file of ["contact", "how-it-works"]) {
        await p.goto("http://127.0.0.1:4173/pages/" + file + ".html");
        for (const width of [320, 390, 768, 1024, 1440])
            for (const theme of ["light", "dark"]) {
                await p.setViewportSize({ width, height: 900 });
                await p.evaluate((t) => (document.documentElement.dataset.theme = t), theme);
                await p.evaluate(() => document.fonts.ready);
                checks++;
                if (await p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1))
                    failures.push({ file, width, theme, overflow: true });
                if (width >= 768 && file === "contact") {
                    const gap = await p
                        .locator(".contact-inquiry-layout")
                        .evaluate((e) =>
                            Math.abs(
                                e.children[0].getBoundingClientRect().bottom -
                                    e.children[1].getBoundingClientRect().bottom,
                            ),
                        );
                    if (gap > 1) failures.push({ gap, width });
                }
                if (width >= 768 && file === "how-it-works") {
                    const ys = await p
                        .locator(".journey-overview .check-list")
                        .evaluateAll((es) => es.map((e) => e.getBoundingClientRect().top));
                    if (Math.max(...ys) - Math.min(...ys) > 2) failures.push({ ys, width });
                }
            }
        await p.setViewportSize({ width: 1440, height: 900 });
        await p.evaluate(() => (document.documentElement.dataset.theme = "light"));
        if (file === "how-it-works")
            await p.screenshot({ path: "test-results/how-hero-layout.png" });
        else
            await p
                .locator(".contact-inquiry-layout")
                .screenshot({ path: "test-results/contact-inquiry-layout.png" });
    }
    console.log({ checks, failures });
    await b.close();
    if (failures.length) process.exitCode = 1;
})();

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
    for (const page of ["pages/home-1.html", "pages/home-2.html", "pages/about.html", "pages/pricing.html"]) {
        await p.goto("http://127.0.0.1:4173/" + page);
        await p.evaluate(() => document.fonts.ready);
        for (const width of [320, 390, 768, 820, 1024, 1280, 1440])
            for (const theme of ["light", "dark"]) {
                await p.setViewportSize({ width, height: 1000 });
                await p.evaluate((t) => (document.documentElement.dataset.theme = t), theme);
                checks++;
                if (await p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1))
                    failures.push({ page, width, overflow: true });
                if (width >= 768) {
                    const bad = await p.locator(".home-size-grid").evaluateAll((gs) =>
                        gs.flatMap((g) => {
                            const cards = [...g.children];
                            if (
                                cards.length < 2 ||
                                Math.abs(
                                    cards[0].getBoundingClientRect().top -
                                        cards[1].getBoundingClientRect().top,
                                ) > 2
                            )
                                return [];
                            return [0, 1, 2].flatMap((i) => {
                                const ys = cards
                                    .map(
                                        (c) =>
                                            c
                                                .querySelectorAll(".check-list li")
                                                [i]?.getBoundingClientRect().top,
                                    )
                                    .filter((v) => v !== undefined);
                                return Math.max(...ys) - Math.min(...ys) > 2 ? [{ i, ys }] : [];
                            });
                        }),
                    );
                    if (bad.length) failures.push({ page, width, bad });
                }
            }
    }
    console.log({ checks, failures });
    await b.close();
    if (failures.length) process.exitCode = 1;
})();

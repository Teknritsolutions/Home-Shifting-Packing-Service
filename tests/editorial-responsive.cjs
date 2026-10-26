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
    for (const page of ["pages/home-1.html", "pages/home-2.html", "pages/blog.html", "pages/about.html"]) {
        await p.goto("http://127.0.0.1:4173/" + page);
        await p.evaluate(() => document.fonts.ready);
        for (const width of [320, 390, 768, 820, 1024, 1280, 1440]) {
            await p.setViewportSize({ width, height: 1000 });
            await p.waitForTimeout(120);
            checks++;
            if (await p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1))
                failures.push({ page, width });
            const issue = await p.locator(".grid-3").evaluateAll((groups) =>
                groups.flatMap((group) => {
                    const cards = [...group.children].filter((e) => e.matches(".card"));
                    const rows = new Map();
                    for (const card of cards) {
                        const y = Math.round(card.getBoundingClientRect().top);
                        if (!rows.has(y)) rows.set(y, []);
                        rows.get(y).push(card);
                    }
                    return [...rows.values()]
                        .filter((cs) => cs.length > 1)
                        .flatMap((cs) => {
                            for (const selector of ["h3", ".card-body > p"]) {
                                const ys = cs
                                    .map(
                                        (c) =>
                                            c.querySelector(selector)?.getBoundingClientRect().top,
                                    )
                                    .filter((v) => v !== undefined);
                                if (Math.max(...ys) - Math.min(...ys) > 2)
                                    return [{ selector, ys }];
                            }
                            return [];
                        });
                }),
            );
            if (issue.length) failures.push({ page, width, issue });
        }
        await p.setViewportSize({ width: 820, height: 1000 });
        if (page === "pages/home-1.html")
            await p
                .locator(".home-care-layout")
                .screenshot({ path: "test-results/home-care-tablet.png" });
        if (page === "pages/home-2.html") {
            await p
                .locator(".home2-benefits")
                .screenshot({ path: "test-results/home-benefits-tablet.png" });
            await p
                .locator(".packing-care-layout")
                .screenshot({ path: "test-results/packing-care-tablet.png" });
        }
    }
    console.log({ checks, failures });
    await b.close();
    if (failures.length) process.exitCode = 1;
})();

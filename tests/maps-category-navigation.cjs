const { chromium } = require("playwright");
(async () => {
    const b = await chromium.launch({
        headless: true,
        executablePath:
            "C:/Users/Dell/AppData/Local/ms-playwright/chromium-1248/chrome-win64/chrome.exe",
    });
    const p = await b.newPage();
    let errors = [];
    for (const name of ["Packing", "Planning", "Moving tips", "All"]) {
        await p.goto("http://127.0.0.1:4173/pages/blog.html");
        await p.locator('[data-blog-filter="' + name + '"]').click();
        await p.waitForURL((u) => u.searchParams.get("category") === name.toLowerCase());
        await p.reload();
        const count = await p.locator("[data-category]:visible").count();
        if (count !== (name === "All" ? 3 : 1)) errors.push({ name, count });
    }
    for (const page of ["blog", "service-areas", "contact"])
        for (const width of [320, 390, 768, 1440]) {
            await p.setViewportSize({ width, height: 900 });
            await p.goto("http://127.0.0.1:4173/pages/" + page + ".html");
            if (await p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1))
                errors.push({ page, width });
        }
    await p.goto("http://127.0.0.1:4173/pages/service-areas.html");
    if ((await p.locator(".grid-3 > article").count()) !== 6) errors.push("city count");
    for (const page of ["service-areas", "contact"]) {
        await p.goto("http://127.0.0.1:4173/pages/" + page + ".html");
        const map = p.locator("iframe");
        await map.scrollIntoViewIfNeeded();
        await p.waitForTimeout(2000);
        console.log(
            page +
                " map frame: " +
                p
                    .frames()
                    .map((f) => f.url())
                    .find((u) => u.includes("google.com/maps")),
        );
        await map.screenshot({ path: "test-results/google-map-" + page + ".png" });
    }
    console.log({ errors });
    await b.close();
    if (errors.length) process.exitCode = 1;
})();

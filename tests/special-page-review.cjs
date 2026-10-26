const { chromium } = require("playwright");
(async () => {
    const b = await chromium.launch({
        headless: true,
        executablePath:
            "C:/Users/Dell/AppData/Local/ms-playwright/chromium-1248/chrome-win64/chrome.exe",
    });
    const p = await b.newPage({ viewport: { width: 1024, height: 900 } });
    for (const name of ["404", "coming-soon"]) {
        await p.goto("http://127.0.0.1:4173/pages/" + name + ".html");
        await p.screenshot({ path: "test-results/standalone-" + name + ".png", fullPage: true });
    }
    await p.goto("http://127.0.0.1:4173/pages/services.html");
    const r = await p.locator('.split:has(img[src$="storage.webp"])').evaluate((el) => {
        const [img, copy] = el.children;
        const a = img.getBoundingClientRect(),
            b = copy.getBoundingClientRect();
        return { imageBottom: a.bottom, copyTop: b.top, stacked: b.top >= a.bottom };
    });
    console.log(r);
    if (!r.stacked) process.exitCode = 1;
    await b.close();
})();

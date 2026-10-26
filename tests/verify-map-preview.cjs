const { chromium } = require("playwright");
(async () => {
    const b = await chromium.launch({
        headless: true,
        executablePath:
            "C:/Users/Dell/AppData/Local/ms-playwright/chromium-1248/chrome-win64/chrome.exe",
    });
    const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
    await p.goto("http://127.0.0.1:4173/pages/contact.html");
    const f = p.locator(".location-map iframe");
    await f.scrollIntoViewIfNeeded();
    try {
        await p
            .frameLocator(".location-map iframe")
            .locator("body")
            .first()
            .waitFor({ timeout: 25000 });
        console.log("Interactive Google Maps frame loaded");
    } catch (e) {
        console.log("MAP_LOAD_UNVERIFIED " + e.message.split("\n")[0]);
    }
    await p.locator(".location-map").screenshot({ path: "test-results/contact-real-map.png" });
    await p.locator(".contact-inquiry-layout img").evaluate((e) => e.decode());
    await p
        .locator(".contact-inquiry-layout")
        .screenshot({ path: "test-results/contact-inquiry-layout.png" });
    await p.goto("http://127.0.0.1:4173/pages/how-it-works.html");
    await p.locator(".packing-photo-card").first().scrollIntoViewIfNeeded();
    await p
        .locator(".packing-step-photo")
        .evaluateAll((es) => Promise.all(es.map((e) => e.decode())));
    await p
        .locator(".packing-photo-card")
        .first()
        .locator("..")
        .screenshot({ path: "test-results/packing-photo-cards.png" });
    await b.close();
})();

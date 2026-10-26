const { chromium } = require("playwright");
const fs = require("fs");
const references = [
    "https://teknritsolutions-2.github.io/Local-Farm-or-Community-Supported-Agriculture-CSA-/pages/public/pages/home-1.html",
    "https://teknrit-maker.github.io/High-End-Event-Planning/pages/home-1.html",
    "https://teknrit-maker.github.io/Local-Indie-Bookstore/pages/home-1.html",
    "https://teknrit-maker.github.io/FoodTruck/Pages/menu.html",
    "https://ravivarmaadepu123.github.io/boutique-yarn-and-craft-supply/pages/",
];
(async () => {
    const browser = await chromium.launch({
        headless: true,
        executablePath:
            process.env.MOVENEST_BROWSER ||
            "C:/Users/Dell/AppData/Local/ms-playwright/chromium-1248/chrome-win64/chrome.exe",
    });
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const results = [];
    fs.mkdirSync("test-results/references", { recursive: true });
    for (const [i, url] of references.entries()) {
        try {
            const response = await page.goto(url, {
                waitUntil: "domcontentloaded",
                timeout: 20000,
            });
            await page.waitForTimeout(1200);
            const info = await page.evaluate(() => ({
                title: document.title,
                headings: [...document.querySelectorAll("h1,h2")]
                    .slice(0, 8)
                    .map((x) => x.innerText),
                bodyFont: getComputedStyle(document.body).fontFamily,
            }));
            await page.screenshot({ path: `test-results/references/reference-${i + 1}.png` });
            results.push({ url, status: response.status(), ...info });
        } catch (error) {
            results.push({ url, error: error.message.split("\n")[0] });
        }
    }
    fs.writeFileSync("test-results/references/results.json", JSON.stringify(results, null, 2));
    console.log(JSON.stringify(results, null, 2));
    await browser.close();
})();

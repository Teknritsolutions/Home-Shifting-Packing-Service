const { chromium } = require("playwright");
(async () => {
    const b = await chromium.launch({
        headless: true,
        executablePath:
            "C:/Users/Dell/AppData/Local/ms-playwright/chromium-1248/chrome-win64/chrome.exe",
    });
    const p = await b.newPage();
    await p.goto("http://127.0.0.1:4173/index.html?source=test#main");
    await p.waitForURL("**/pages/home-1.html?source=test#main");
    console.log("Root redirect passed, preserving query and fragment");
    await p.locator(".nav-dropdown-toggle").first().focus();
    await p.keyboard.press("Enter");
    await p.getByRole("link", { name: "Homepage 2", exact: true }).click();
    await p.waitForURL("**/pages/home-2.html");
    console.log("Homepage 2 navigation passed");
    await p.getByRole("link", { name: "MoveNest home", exact: true }).first().click();
    await p.waitForURL("**/pages/home-1.html");
    console.log("Home brand link passed");
    await b.close();
})();

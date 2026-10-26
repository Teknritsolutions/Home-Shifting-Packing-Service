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
        "customer-dashboard",
        "move-tracking",
        "admin-dashboard",
        "admin-reports",
    ]) {
        await p.goto("http://127.0.0.1:4173/dashboard/" + page + ".html");
        for (const width of [320, 390, 768, 1024, 1440])
            for (const theme of ["light", "dark"])
                for (const dir of ["ltr", "rtl"]) {
                    await p.setViewportSize({ width, height: 1000 });
                    await p.evaluate(
                        (x) => {
                            document.documentElement.dataset.theme = x.theme;
                            document.documentElement.dir = x.dir;
                            window.dispatchEvent(new Event("theme-change"));
                        },
                        { theme, dir },
                    );
                    checks++;
                    if (
                        await p.evaluate(
                            () => document.documentElement.scrollWidth > innerWidth + 1,
                        )
                    )
                        failures.push({ page, width, theme, dir, overflow: true });
                }
        await p.setViewportSize({ width: 1440, height: 1000 });
        await p.evaluate(() => {
            document.documentElement.dataset.theme = "light";
            document.documentElement.dir = "ltr";
            window.dispatchEvent(new Event("theme-change"));
        });
        await p.waitForTimeout(300);
        if (page === "customer-dashboard") {
            const data = await p.evaluate(() =>
                ["customer-activity", "customer-status", "customer-payments"].map((id) => {
                    const c = Chart.getChart(id);
                    return { id, values: c.data.datasets[0].data, max: c.scales.y?.max };
                }),
            );
            if (data.some((c) => !c.values.length)) failures.push({ data });
            console.log(data);
            await p
                .locator(".dashboard-grid")
                .first()
                .screenshot({ path: "test-results/customer-progress-graphs.png" });
            await p
                .locator(".customer-analytics")
                .screenshot({ path: "test-results/customer-new-graphs.png" });
        }
        if (page === "move-tracking")
            await p
                .locator("#tracking-content")
                .screenshot({ path: "test-results/tracking-details-redesign.png" });
    }
    console.log({ checks, failures });
    await b.close();
    if (failures.length) process.exitCode = 1;
})();

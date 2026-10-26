const { chromium } = require("playwright");
(async () => {
    const b = await chromium.launch({
        headless: true,
        executablePath:
            "C:/Users/Dell/AppData/Local/ms-playwright/chromium-1248/chrome-win64/chrome.exe",
    });
    const p = await b.newPage();
    let checks = 0,
        failures = [];
    await p.goto("http://127.0.0.1:4173/pages/home-2.html");
    await p.evaluate(() => document.fonts.ready);
    for (const width of [320, 390, 576, 768, 820, 1024, 1280, 1440, 1920]) {
        await p.setViewportSize({ width, height: 900 });
        for (const theme of ["light", "dark"])
            for (const dir of ["ltr", "rtl"]) {
                await p.evaluate(
                    ({ theme, dir }) => {
                        document.documentElement.dataset.theme = theme;
                        document.documentElement.dir = dir;
                    },
                    { theme, dir },
                );
                const result = await p.evaluate(() => {
                    const rect = (e) => {
                        let r = e.getBoundingClientRect();
                        return {
                            top: r.top,
                            bottom: r.bottom,
                            left: r.left,
                            right: r.right,
                        };
                    };
                    return {
                        overflow:
                            document.documentElement.scrollWidth >
                            innerWidth + 1,
                        sections: [
                            "home2-benefits",
                            "home2-journey",
                            "personal-intro",
                        ].map((cls) => {
                            let e = document.querySelector("." + cls);
                            return {
                                cls,
                                columns: [...e.children].map(rect),
                                image: rect(e.querySelector("img")),
                            };
                        }),
                    };
                });
                checks++;
                if (result.overflow)
                    failures.push({ width, theme, dir, overflow: true });
                if (width >= 1024)
                    for (const section of result.sections) {
                        checks++;
                        const [a, c] = section.columns;
                        if (
                            Math.abs(a.top - c.top) > 1 ||
                            Math.abs(a.bottom - c.bottom) > 1 ||
                            Math.abs(section.image.bottom - c.bottom) > 1
                        )
                            failures.push({ width, theme, dir, ...section });
                    }
            }
    }
    console.log(JSON.stringify({ checks, failures }, null, 2));
    await p.setViewportSize({ width: 1440, height: 900 });
    await p.locator(".home2-journey img").evaluateAll((es) =>
        Promise.all(
            es.map((e) => {
                e.loading = "eager";
                return e.decode();
            }),
        ),
    );
    await p
        .locator(".home2-journey")
        .screenshot({ path: "test-results/journey-aligned.png" });
    await b.close();
    if (failures.length) process.exitCode = 1;
})();

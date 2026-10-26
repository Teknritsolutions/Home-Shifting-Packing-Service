const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, "..");
const origin = "http://127.0.0.1:4173";
const files = [
    "documentation/index.html",
    ...["pages", "dashboard"].flatMap((dir) =>
        fs
            .readdirSync(path.join(root, dir))
            .filter((f) => f.endsWith(".html"))
            .map((f) => dir + "/" + f),
    ),
];
const widths = [320, 360, 375, 390, 420, 480, 576, 768, 820, 1024, 1280, 1440, 1920];
const failures = [];
const errors = [];
const results = [];
let activePage;
let activeBrowser;
const check = (value, message) => {
    if (!value) failures.push(message);
};
(async () => {
    fs.mkdirSync(path.join(root, "test-results"), { recursive: true });
    const browser = await chromium.launch({
        headless: true,
        executablePath:
            process.env.MOVENEST_BROWSER ||
            (fs.existsSync(
                "C:/Users/Dell/AppData/Local/ms-playwright/chromium-1248/chrome-win64/chrome.exe",
            )
                ? "C:/Users/Dell/AppData/Local/ms-playwright/chromium-1248/chrome-win64/chrome.exe"
                : undefined),
    });
    activeBrowser = browser;
    const context = await browser.newContext({
        viewport: { width: 1440, height: 1000 },
        reducedMotion: "reduce",
    });
    const page = await context.newPage();
    activePage = page;
    if (process.argv.includes("--readability")) {
        await require("./readability.spec.cjs")({ browser, page, origin, root, check, failures });
        await browser.close();
        if (failures.length) process.exitCode = 1;
        return;
    }
    if (process.argv.includes("--design")) {
        await require("./premium.spec.cjs")({
            browser,
            context,
            page,
            origin,
            root,
            check,
            failures,
        });
        await browser.close();
        if (failures.length) process.exitCode = 1;
        return;
    }
    if (process.argv.includes("--navigation")) {
        await page.goto(origin + "/pages/home-1.html");
        for (const width of widths) {
            await page.setViewportSize({ width, height: 900 });
            if (width < 1280) {
                await page.locator(".menu-toggle").click();
                check(await page.locator(".nav-main").isVisible(), "Menu opens at " + width);
                if (width < 768)
                    check(
                        await page.locator(".mobile-nav-actions").isVisible(),
                        "Mobile login and quote available at " + width,
                    );
                check(
                    await page.evaluate(
                        () => document.documentElement.scrollWidth <= innerWidth + 1,
                    ),
                    "Open-menu overflow at " + width,
                );
                await page.keyboard.press("Escape");
            }
        }
        await page.setViewportSize({ width: 390, height: 844 });
        await page.goto(origin + "/dashboard/customer-dashboard.html");
        check(
            await page
                .locator(".dashboard-sidebar")
                .evaluate((el) => getComputedStyle(el).visibility === "hidden"),
            "Closed drawer must be hidden from focus",
        );
        await page.locator(".sidebar-toggle").click();
        check(await page.locator(".dashboard-sidebar").isVisible(), "Drawer opens");
        await page.locator(".dashboard-sidebar nav a").first().focus();
        await page.keyboard.press("Escape");
        check(
            await page.locator(".sidebar-toggle").evaluate((el) => document.activeElement === el),
            "Escape returns drawer focus",
        );
        fs.writeFileSync(
            path.join(root, "test-results", "navigation-results.json"),
            JSON.stringify({ widths, failures }, null, 2),
        );
        console.log(JSON.stringify({ navigationWidths: widths.length, failures }, null, 2));
        await browser.close();
        if (failures.length) process.exitCode = 1;
        return;
    }
    page.on("pageerror", (err) => errors.push(err.message));
    page.on("response", (response) => {
        if (response.status() >= 400 && response.url().startsWith(origin))
            errors.push(response.status() + " " + response.url());
    });
    for (const file of process.argv.includes("--flows") ? [] : files) {
        await page.goto(origin + "/" + file);
        await page.evaluate(() => document.fonts.ready);
        await page.setViewportSize({ width: 1440, height: 1000 });
        await page.evaluate(async () => {
            await Promise.all(
                [...document.images].map((img) => {
                    img.loading = "eager";
                    return img.decode().catch(() => {});
                }),
            );
        });
        const info = await page.evaluate(() => ({
            h1: document.querySelectorAll("h1").length,
            broken: [...document.images]
                .filter((i) => i.complete && i.naturalWidth === 0)
                .map((i) => i.src),
            sections: document.querySelectorAll("main>section").length,
        }));
        const alignment = await page.evaluate(() => {
            const issues = [];
            document.querySelectorAll(".grid").forEach((grid) => {
                const cards = [...grid.children].filter((el) => el.classList.contains("card"));
                const rows = new Map();
                cards.forEach((card) => {
                    const r = card.getBoundingClientRect();
                    const row = Math.round(r.top);
                    if (!rows.has(row)) rows.set(row, []);
                    rows.get(row).push(r);
                });
                for (const row of rows.values())
                    if (
                        row.length > 1 &&
                        Math.max(...row.map((r) => r.bottom)) -
                            Math.min(...row.map((r) => r.bottom)) >
                            2
                    )
                        issues.push("Unequal card row");
            });
            const chartRows = new Map();
            document.querySelectorAll(".chart-card").forEach((el) => {
                const rect = el.getBoundingClientRect();
                const top = Math.round(rect.top);
                if (!chartRows.has(top)) chartRows.set(top, []);
                chartRows.get(top).push(rect.height);
            });
            for (const charts of chartRows.values()) {
                if (charts.length > 1 && Math.max(...charts) - Math.min(...charts) > 2)
                    issues.push("Unequal chart cards in the same row");
            }
            return issues;
        });
        check(alignment.length === 0, file + " alignment: " + alignment.join(", "));
        check(info.h1 === 1, file + " must have one h1");
        check(info.broken.length === 0, file + " broken images " + info.broken.join(","));
        if (file === "pages/home-1.html" || file === "pages/home-2.html")
            check(info.sections === 10, file + " has " + info.sections + " sections");
        if (
            /^pages\/(about|services|service-details|pricing|how-it-works|service-areas|contact)\.html$/.test(
                file,
            )
        )
            check(info.sections === 6, file + " has " + info.sections + " sections");
        if (/^pages\/blog/.test(file))
            check(info.sections === 5, file + " has " + info.sections + " sections");
        for (const mode of [
            { theme: "light", dir: "ltr" },
            { theme: "dark", dir: "ltr" },
            { theme: "light", dir: "rtl" },
            { theme: "dark", dir: "rtl" },
        ]) {
            await page.evaluate(({ theme, dir }) => {
                document.documentElement.dataset.theme = theme;
                document.documentElement.dir = dir;
                window.dispatchEvent(new Event("theme-change"));
            }, mode);
            for (const width of widths) {
                await page.setViewportSize({ width, height: 900 });
                const overflow = await page.evaluate(() => ({
                    body: document.documentElement.scrollWidth,
                    viewport: innerWidth,
                    elements: [...document.querySelectorAll("body *")]
                        .filter((el) => {
                            const r = el.getBoundingClientRect();
                            return (
                                r.width > 0 &&
                                (r.right > innerWidth + 2 || r.left < -2) &&
                                getComputedStyle(el).position !== "fixed" &&
                                !el.closest(".table-scroll,.dashboard-sidebar")
                            );
                        })
                        .slice(0, 5)
                        .map((el) => el.tagName + "." + el.className),
                }));
                if (width === 390 || width === 1440) {
                    const textIssues = await page.evaluate(() => {
                        const expected = 16;
                        const issues = [];
                        const rgb = (value) => (value.match(/[\d.]+/g) || []).map(Number);
                        const luminance = (color) =>
                            color
                                .slice(0, 3)
                                .map((v) => {
                                    const c = v / 255;
                                    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
                                })
                                .reduce((v, c, i) => v + c * [0.2126, 0.7152, 0.0722][i], 0);
                        for (const paragraph of document.querySelectorAll("p")) {
                            if (!paragraph.getClientRects().length || !paragraph.textContent.trim())
                                continue;
                            const style = getComputedStyle(paragraph);
                            if (Math.abs(parseFloat(style.fontSize) - expected) > 0.1)
                                issues.push(
                                    "Paragraph size " +
                                        style.fontSize +
                                        ": " +
                                        paragraph.textContent.slice(0, 35),
                                );
                            if (
                                paragraph.closest(
                                    ".cta,.photo-cta,.editorial-hero,.auth-copy,.toast,dialog",
                                )
                            )
                                continue;
                            let parent = paragraph;
                            let background;
                            while (parent) {
                                const value = rgb(getComputedStyle(parent).backgroundColor);
                                if (value.length >= 3 && (value.length < 4 || value[3] > 0.99)) {
                                    background = value;
                                    break;
                                }
                                parent = parent.parentElement;
                            }
                            if (!background)
                                background = rgb(getComputedStyle(document.body).backgroundColor);
                            const foreground = rgb(style.color);
                            if (foreground.length < 3 || background.length < 3) continue;
                            const a = luminance(foreground),
                                b = luminance(background);
                            const contrast = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
                            if (contrast < 4.5)
                                issues.push(
                                    "Paragraph contrast " +
                                        contrast.toFixed(2) +
                                        ": " +
                                        paragraph.textContent.slice(0, 35),
                                );
                        }
                        return issues;
                    });
                    check(
                        textIssues.length === 0,
                        file +
                            " " +
                            mode.theme +
                            " " +
                            mode.dir +
                            " " +
                            width +
                            " text: " +
                            textIssues.join("; "),
                    );
                }
                check(
                    overflow.body <= width + 1,
                    file +
                        " " +
                        mode.theme +
                        " " +
                        mode.dir +
                        " overflow at " +
                        width +
                        ": " +
                        JSON.stringify(overflow),
                );
                results.push({ file, width, ...mode, overflow: overflow.body > width + 1 });
            }
        }
        await page.setViewportSize({ width: 390, height: 900 });
        await page.evaluate(() => {
            document.documentElement.dataset.theme = "dark";
            document.documentElement.dir = "rtl";
            window.dispatchEvent(new Event("theme-change"));
        });
        await page.waitForTimeout(40);
        check(
            await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
            file + " dark RTL overflow at 390",
        );
        await page.evaluate(() => {
            document.documentElement.dataset.theme = "light";
            document.documentElement.dir = "ltr";
            window.dispatchEvent(new Event("theme-change"));
        });
        if (
            [
                "pages/home-1.html",
                "pages/home-2.html",
                "pages/pricing.html",
                "dashboard/admin-dashboard.html",
                "dashboard/customer-dashboard.html",
            ].includes(file)
        ) {
            await page.setViewportSize({ width: 1440, height: 1000 });
            await page.screenshot({
                path: path.join(root, "test-results", file.replaceAll("/", "-") + ".png"),
                fullPage: true,
            });
            await page.setViewportSize({ width: 390, height: 844 });
            await page.screenshot({
                path: path.join(root, "test-results", file.replaceAll("/", "-") + "-mobile.png"),
                fullPage: true,
            });
            await page.evaluate(() => {
                document.documentElement.dataset.theme = "dark";
                window.dispatchEvent(new Event("theme-change"));
            });
            await page.screenshot({
                path: path.join(
                    root,
                    "test-results",
                    file.replaceAll("/", "-") + "-dark-mobile.png",
                ),
                fullPage: true,
            });
            await page.setViewportSize({ width: 1440, height: 1000 });
            await page.screenshot({
                path: path.join(root, "test-results", file.replaceAll("/", "-") + "-dark.png"),
                fullPage: true,
            });
        } else {
            await page.setViewportSize({ width: 1440, height: 1000 });
            await page.screenshot({
                path: path.join(root, "test-results", file.replaceAll("/", "-") + "-overview.png"),
            });
        }
        console.log("Checked " + file);
    }
    fs.writeFileSync(
        path.join(root, "test-results", "responsive-results.json"),
        JSON.stringify({ checks: results.length, failures, results }, null, 2),
    );
    console.log(
        "Responsive matrix complete: " +
            results.length +
            " checks, " +
            failures.length +
            " failures.",
    );
    // Pricing math and persistence.
    await page.goto(origin + "/pages/pricing.html");
    await page.locator("#pickup").fill("Bengaluru");
    await page.locator("#delivery").fill("Pune");
    await page.locator("#distance").fill("100");
    await page.locator("#floor").fill("2");
    await page.locator("#elevator").selectOption("1");
    await page.locator("#packing").selectOption("1");
    await page.locator("#extras").selectOption("3");
    await page.locator("#calculator button").click();
    check(
        (await page.locator("#estimate-breakdown").innerText()).includes("12,400"),
        "Calculator should total ₹12,400",
    );
    await page.goto(origin + "/dashboard/new-booking.html");
    await page.locator("#booking-next").click();
    await page.locator("#pickup").fill("12 Demo Lane, Bengaluru");
    await page.locator("#delivery").fill("24 Demo Street, Pune");
    await page.locator("#phone").fill("+91 80000 11111");
    await page.locator("#booking-next").click();
    await page.locator("#inventory").fill("Sofa, desk and 20 boxes");
    await page.locator("#booking-next").click();
    const date = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
    await page.locator("#date").fill(date);
    await page.locator("#booking-next").click();
    await page.locator("[name=consent]").check();
    await page.locator("#booking-next").click();
    check((await page.locator(".form-message").innerText()).includes("saved"), "Booking must save");
    const booking = await page.evaluate(() => MoveNest.get().bookings[0]);
    await page.goto(origin + "/dashboard/admin-bookings.html");
    await page.locator("#booking-search").fill(booking.id);
    await page.locator("[data-booking]").first().click();
    await page.locator("#edit-status").selectOption("Delivered");
    await page.locator("#status-form button").click();
    await page.locator("[data-close-dialog]").click();
    await page.goto(origin + "/dashboard/move-tracking.html?booking=" + booking.id);
    check(
        (await page.locator("#tracking-content").innerText()).includes("Delivered"),
        "Status must sync to tracking",
    );
    await page.goto(origin + "/dashboard/invoices.html?booking=" + booking.id);
    check(
        (await page.locator("#invoice-detail").innerText()).includes(booking.id),
        "Invoice must match booking",
    );
    await page.evaluate(() => (window.print = () => (window.__printRequested = true)));
    await page.locator("[data-print]").click();
    check(await page.evaluate(() => window.__printRequested), "Print button must invoke printing");
    await page.emulateMedia({ media: "print" });
    await page.screenshot({
        path: path.join(root, "test-results", "invoice-print.png"),
        fullPage: true,
    });
    await page.emulateMedia({ media: "screen" });
    await page.goto(origin + "/pages/blog.html");
    await page.locator("[data-blog-filter=Packing]").click();
    check(
        (await page.locator("[data-category]:visible").count()) === 1,
        "Blog filter must show one article",
    );
    await page.goto(origin + "/pages/contact.html");
    for (const [id, value] of Object.entries({
        name: "QA Demo",
        email: "qa@example.com",
        phone: "+91 80000 00000",
        pickup: "Bengaluru",
        delivery: "Pune",
        message: "QA fictional inquiry",
    }))
        await page.locator("#" + id).fill(value);
    await page.locator("input[type=checkbox]").check();
    await page.locator("form[data-form=contact] button").click();
    await page.goto(origin + "/dashboard/admin-messages.html");
    check(
        (await page.locator("#message-list").innerText()).includes("QA Demo"),
        "Contact must sync to messages",
    );
    await page.locator("[data-message]").first().click();
    check(
        (await page.locator("#message-detail").innerText()).includes("QA fictional inquiry"),
        "Message detail must work",
    );
    await page.goto(origin + "/pages/login.html");
    await page.locator("#email").fill("qa@example.com");
    await page.locator("#password").fill("demopassword");
    await page.locator("#role").selectOption("1");
    await page.locator("#auth-form button[type=submit]").click();
    await page.waitForURL("**/admin-dashboard.html");
    check((await page.locator("canvas").count()) === 4, "Admin must have four charts");
    check(
        await page.evaluate(() => Chart.getChart(document.querySelector("#revenue")) != null),
        "Chart must render",
    );
    await page.locator("[data-theme-toggle]").click();
    const theme = await page.evaluate(() => document.documentElement.dataset.theme);
    await page.goto(origin + "/pages/home-1.html");
    check(
        (await page.evaluate(() => document.documentElement.dataset.theme)) === theme,
        "Theme must persist",
    );
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator(".menu-toggle").click();
    check(await page.locator(".nav-main").isVisible(), "Mobile menu must open");
    await page.keyboard.press("Escape");
    check(!(await page.locator(".nav-main").isVisible()), "Escape closes menu");
    await page.goto(origin + "/dashboard/customer-dashboard.html");
    await page.locator(".sidebar-toggle").click();
    check(
        await page.locator(".dashboard-sidebar").evaluate((el) => el.classList.contains("is-open")),
        "Sidebar must open",
    );
    await page.goto(origin + "/dashboard/admin-reports.html");
    await page.locator("#from").fill("2026-01-01");
    await page.locator("#to").fill("2026-07-31");
    await page.locator("#report-filter button[type=submit]").click();
    check(
        (await page.locator("#report-filter .form-message").innerText()).includes(
            "selected date range",
        ),
        "Report dates must apply",
    );
    const download = page.waitForEvent("download");
    await page.locator("[data-export=report]").click();
    check((await download).suggestedFilename().endsWith(".csv"), "CSV download must work");
    await page.goto(origin + "/dashboard/admin-invoices.html?booking=" + booking.id);
    await page.locator("[data-paid]").click();
    check(
        await page.evaluate(
            (id) => MoveNest.get().bookings.find((b) => b.id === id).paid,
            booking.id,
        ),
        "Admin payment marker must persist",
    );
    await page.goto(origin + "/dashboard/admin-crew.html");
    await page.locator("#crew-booking").selectOption("MN-1038");
    await page.locator("#crew-choice").selectOption("T01");
    await page.locator("#crew-form button").click();
    check(
        await page.evaluate(
            () => MoveNest.get().bookings.find((b) => b.id === "MN-1038").crew === "T01",
        ),
        "Crew assignment must persist",
    );
    await page.goto(origin + "/dashboard/admin-settings.html");
    await page.locator("#base0").fill("3100");
    await page.locator("#settings-form button[type=submit]").click();
    check(
        await page.evaluate(
            () => MoveNest.estimate({ size: 0, distance: 0, packing: 2 }).total === 4100,
        ),
        "Configurable pricing must affect calculator",
    );
    await page.locator("[data-reset]").click();
    await page.locator("#confirm-reset").click();
    await page.waitForLoadState("load");
    check(
        await page.evaluate(
            () =>
                MoveNest.get().bookings.length === 12 &&
                Number(MoveNest.get().settings.base0) === 3000,
        ),
        "Reset demo must restore seed",
    );
    // Restore pristine demo data after tests.
    await page.evaluate(() => {
        MoveNest.save(MoveNest.seed());
        localStorage.removeItem("movenest-theme");
        localStorage.removeItem("movenest-dir");
    });
    await browser.close();
    fs.writeFileSync(
        path.join(root, "test-results", "qa-results.json"),
        JSON.stringify(
            {
                pages: files.length,
                widths,
                checks: results.length,
                failures,
                errors: [...new Set(errors)],
                results,
            },
            null,
            2,
        ),
    );
    console.log(
        JSON.stringify(
            {
                pages: files.length,
                responsiveChecks: results.length,
                failures,
                errors: [...new Set(errors)],
            },
            null,
            2,
        ),
    );
    if (failures.length || errors.length) process.exitCode = 1;
})().catch(async (err) => {
    if (activePage)
        await activePage
            .screenshot({ path: path.join(root, "test-results", "failure.png"), fullPage: true })
            .catch(() => {});
    if (activeBrowser) await activeBrowser.close().catch(() => {});
    console.error(err);
    process.exitCode = 1;
});

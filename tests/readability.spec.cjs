const fs = require("fs");
const path = require("path");
module.exports = async ({ browser, page, origin, root, check, failures }) => {
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("response", (response) => {
        if (response.status() >= 400 && response.url().startsWith(origin))
            errors.push(response.status() + " " + response.url());
    });
    const ready = async () =>
        page.evaluate(async () => {
            await document.fonts.ready;
            await Promise.all(
                [...document.images].map((img) => {
                    img.loading = "eager";
                    return img.decode().catch(() => {});
                }),
            );
        });
    await page.goto(origin + "/pages/home-1.html");
    await ready();
    check(
        (await page.locator("[data-theme-toggle] [data-theme-icon=moon]").count()) === 1,
        "Light theme shows moon action",
    );
    await page.locator("[data-theme-toggle]").click();
    check(
        (await page.locator("[data-theme-toggle] [data-theme-icon=sun]").count()) === 1,
        "Dark theme shows sun action",
    );
    check(
        (await page.locator("[data-theme-toggle]").getAttribute("aria-label")) ===
            "Switch to light mode",
        "Theme action label updates",
    );
    check(
        await page
            .locator("[data-theme-toggle]")
            .evaluate((el) => el.nextElementSibling.hasAttribute("data-rtl-toggle")),
        "RTL control follows theme control",
    );
    await page.locator("[data-rtl-toggle]").click();
    check(
        await page.evaluate(() => document.documentElement.dir === "rtl"),
        "RTL button changes direction",
    );
    check(
        (await page.locator("[data-direction-label]").innerText()) === "LTR",
        "Direction control offers reverse action",
    );
    await page.goto(origin + "/pages/about.html");
    await ready();
    check(
        await page.evaluate(
            () =>
                document.documentElement.dir === "rtl" &&
                document.documentElement.dataset.theme === "dark",
        ),
        "Theme and direction persist across pages",
    );
    check(
        (await page.locator("[data-theme-icon=sun]").count()) === 1,
        "Persisted dark theme retains sun icon",
    );
    await page.locator("[data-rtl-toggle]").click();
    await page.locator("[data-theme-toggle]").click();
    check(
        (await page.locator("[data-theme-icon=moon]").count()) === 1,
        "Returning to light restores moon icon",
    );
    const footer = page.locator(".site-footer");
    check(
        (await footer.locator("a[href*=dashboard]").count()) === 0,
        "Footer has no dashboard links",
    );
    check(
        !/demo|template|front.end demonstration/i.test(await footer.innerText()),
        "Footer omits demo/template labels",
    );
    check(
        (await footer.locator("[data-rtl-toggle]").count()) === 0,
        "Direction control is absent from footer",
    );
    check(
        (await footer.locator('a[href$="documentation/index.html"]').count()) === 0,
        "Footer omits documentation link",
    );
    check(
        await footer
            .locator(".footer-grid a:not(.brand)")
            .evaluateAll((links) =>
                links.every((link) => parseFloat(getComputedStyle(link).fontSize) >= 16),
            ),
        "Footer links are at least 16px",
    );
    check(
        await footer
            .locator(".brand small")
            .evaluate((el) => parseFloat(getComputedStyle(el).fontSize) >= 12),
        "Footer brand description matches the 12px header scale",
    );
    await footer.screenshot({
        path: path.join(root, "test-results", "readability-footer-desktop.png"),
    });
    await page.goto(origin + "/documentation/index.html");
    await page.waitForURL("**/documentation/index.html");
    check(
        (await page.locator("h1").innerText()).includes("guide"),
        "Footer documentation opens styled guide",
    );
    await page.goto(origin + "/pages/home-1.html");
    await ready();
    const reviews = page.locator(".testimonial");
    check(
        (await reviews.locator(".avatar-photo").count()) === 3,
        "All three testimonials contain portraits",
    );
    check(
        await reviews
            .locator(".avatar-photo")
            .evaluateAll((images) =>
                images.every(
                    (img) => img.naturalWidth > 0 && getComputedStyle(img).borderRadius === "50%",
                ),
            ),
        "Portraits load and use circular crops",
    );
    check(
        await page
            .locator(".home-size-top .small")
            .evaluateAll((elements) =>
                elements.every((el) => parseFloat(getComputedStyle(el).fontSize) >= 14),
            ),
        "Home collection captions are at least 14px",
    );
    await reviews
        .first()
        .locator("..")
        .screenshot({
            path: path.join(root, "test-results", "readability-testimonials.png"),
        });
    await page.locator("[data-nav-group=dashboards] .nav-link").hover();
    check(await page.locator("#dashboards-menu").isVisible(), "Dashboards menu opens on hover");
    await page.screenshot({
        path: path.join(root, "test-results", "readability-header-dashboard-menu.png"),
    });
    await page.locator('#dashboards-menu a[href$="customer-dashboard.html"]').click();
    await page.waitForURL("**/dashboard/customer-dashboard.html");
    check(
        await page
            .locator("[data-theme-toggle]")
            .evaluate((el) => el.nextElementSibling.hasAttribute("data-rtl-toggle")),
        "Workspace control order matches public header",
    );
    await page.locator("[data-theme-toggle]").click();
    check(
        (await page.locator("[data-theme-icon=sun]").count()) === 1,
        "Workspace theme icon updates",
    );
    await page.locator("[data-rtl-toggle]").click();
    check(
        await page.evaluate(() => document.documentElement.dir === "rtl"),
        "Workspace direction control works",
    );
    await page.goto(origin + "/pages/home-2.html");
    await ready();
    check(
        (await page.locator(".reviewer .avatar-photo").count()) === 3,
        "Second homepage also uses testimonial portraits",
    );
    const widths = [320, 360, 375, 390, 420, 480, 576, 768, 820, 1024, 1280, 1440, 1920];
    let headerChecks = 0;
    for (const width of widths) {
        await page.setViewportSize({ width, height: 900 });
        const geometry = await page.locator(".site-header").evaluate((header) => {
            const items = [...header.querySelectorAll(".brand,.header-actions,.nav-main")]
                .filter((el) => getComputedStyle(el).display !== "none")
                .map((el) => ({ cls: el.className, r: el.getBoundingClientRect() }));
            return {
                viewport: innerWidth,
                overflow: document.documentElement.scrollWidth > innerWidth + 1,
                items: items.map((item) => ({
                    cls: item.cls,
                    left: item.r.left,
                    right: item.r.right,
                })),
            };
        });
        check(!geometry.overflow, "Header/page fits " + width);
        if (width < 1280) {
            await page.locator(".menu-toggle").click();
            await page.locator("[data-nav-group=dashboards] .nav-dropdown-toggle").click();
            check(
                await page.locator("#dashboards-menu").isVisible(),
                "Dashboard drawer links open at " + width,
            );
            await page.keyboard.press("Escape");
        }
        headerChecks++;
    }
    await page.setViewportSize({ width: 320, height: 844 });
    await page.goto(origin + "/pages/about.html");
    await ready();
    await page.locator(".site-footer").screenshot({
        path: path.join(root, "test-results", "readability-footer-mobile-dark.png"),
    });
    await page.screenshot({
        path: path.join(root, "test-results", "readability-header-mobile-dark.png"),
    });
    check(errors.length === 0, "New control/portrait resource errors: " + errors.join("; "));
    await page.evaluate(() => {
        localStorage.removeItem("movenest-theme");
        localStorage.removeItem("movenest-dir");
    });
    fs.writeFileSync(
        path.join(root, "test-results", "readability-review.json"),
        JSON.stringify({ headerChecks, portraits: 6, errors, failures }, null, 2),
    );
    console.log(
        JSON.stringify({ readabilityReview: "complete", headerChecks, errors, failures }, null, 2),
    );
};

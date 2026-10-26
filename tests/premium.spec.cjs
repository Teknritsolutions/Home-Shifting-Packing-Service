const fs = require("fs");
const path = require("path");
module.exports = async function ({ browser, context, page, origin, root, check, failures }) {
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
    await page.locator("[data-nav-group=home] .nav-link").hover();
    check(await page.locator("#home-menu").isVisible(), "Desktop Home dropdown opens on hover");
    check(
        (await page.locator("#home-menu a").count()) === 2,
        "Home dropdown contains both homepages",
    );
    await page.screenshot({ path: path.join(root, "test-results", "premium-home-dropdown.png") });
    await page.locator('#home-menu a[href="pages/home-2.html"]').click();
    await page.waitForURL("**/pages/home-2.html");
    check(
        await page
            .locator("[data-nav-group=home]")
            .evaluate((el) => el.classList.contains("is-active")),
        "Homepage 2 marks Home as active",
    );
    await page.goto(origin + "/pages/about.html");
    await ready();
    check(
        (await page.locator('.nav-main a[href="about.html"]').count()) === 0,
        "Nested page paths stay relative to the site root",
    );
    check(
        await page
            .locator(".nav-main a.active")
            .evaluateAll((links) => links.some((a) => a.href.endsWith("/pages/about.html"))),
        "About link is active",
    );
    await page.screenshot({
        path: path.join(root, "test-results", "premium-about-desktop.png"),
        fullPage: true,
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({
        path: path.join(root, "test-results", "premium-about-mobile.png"),
        fullPage: true,
    });
    await page.locator(".menu-toggle").click();
    await page.locator("[data-nav-group=home] .nav-dropdown-toggle").click();
    check(
        await page.locator("#home-menu").isVisible(),
        "Mobile Home dropdown opens by touch/click",
    );
    await page.locator('#home-menu a[href="../pages/home-2.html"]').click();
    await page.waitForURL("**/pages/home-2.html");
    const services = {
        local: "Local home shifting",
        intercity: "Intercity relocation",
        packing: "Packing & unpacking",
        office: "Office relocation",
    };
    await page.setViewportSize({ width: 1440, height: 1000 });
    for (const [key, title] of Object.entries(services)) {
        await page.goto(origin + "/pages/services.html");
        await page.locator("[data-nav-group=services] .nav-link").hover();
        await page.locator('#services-menu a[href$="service=' + key + '"]').click();
        await page.waitForURL("**/service-details.html?service=" + key);
        await ready();
        check(
            (await page.locator("h1").innerText()) === title,
            "Service navigation opens " + key + " content",
        );
        check(
            (await page.locator("#services-menu a.active").count()) === 1,
            "Only the selected service is active for " + key,
        );
        check(
            await page.locator(".inner-hero-media img").evaluate((img) => img.naturalWidth > 0),
            "Service hero loads for " + key,
        );
        if (key === "office")
            await page.screenshot({
                path: path.join(root, "test-results", "premium-office-service.png"),
            });
    }
    for (const [key, title] of Object.entries({
        fragile: "fragile favourites",
        "moving-day": "moving-day checklist",
        reliable: "moving company with confidence",
    })) {
        await page.goto(origin + "/pages/blog-details.html?article=" + key);
        await ready();
        check(
            (await page.locator("h1").innerText()).includes(title),
            "Article route opens " + key + " content",
        );
        check(
            await page.locator(".inner-hero-media img").evaluate((img) => img.naturalWidth > 0),
            "Article hero loads for " + key,
        );
        check(
            await page
                .locator("main > section:nth-of-type(2) img")
                .evaluate((img) => img.naturalWidth > 0),
            "Article feature loads for " + key,
        );
    }
    await page.goto(origin + "/pages/home-1.html");
    await ready();
    check(
        (await page.locator(".process-card").count()) === 4,
        "Home process has four photographic steps",
    );
    check(
        await page
            .locator(".process-card img")
            .evaluateAll((images) => images.every((img) => img.naturalWidth > 0)),
        "Process images all load",
    );
    await page
        .locator(".process-gallery")
        .screenshot({ path: path.join(root, "test-results", "premium-process-cards.png") });
    const action = page.locator(".process-card .text-link").first();
    const neutral = await action.evaluate((el) => getComputedStyle(el).backgroundColor);
    await action.hover();
    await page.waitForTimeout(220);
    check(
        (await action.evaluate((el) => getComputedStyle(el).backgroundColor)) !== neutral,
        "Card button receives brand fill on hover",
    );
    await page.evaluate(() => {
        document.documentElement.dataset.theme = "dark";
        window.dispatchEvent(new Event("theme-change"));
    });
    await page
        .locator(".process-gallery")
        .screenshot({ path: path.join(root, "test-results", "premium-process-cards-dark.png") });
    await page.goto(origin + "/pages/blog-details.html");
    await ready();
    await page.evaluate(() => {
        document.documentElement.dataset.theme = "dark";
        window.dispatchEvent(new Event("theme-change"));
    });
    const related = page.locator("main > section").nth(3);
    await related.screenshot({ path: path.join(root, "test-results", "premium-related-dark.png") });
    const relatedStyle = await related
        .locator(".card p")
        .first()
        .evaluate((el) => ({
            color: getComputedStyle(el).color,
            size: getComputedStyle(el).fontSize,
        }));
    check(relatedStyle.size === "16px", "Related-card paragraphs match 16px body text");
    check(
        relatedStyle.color === "rgb(185, 201, 191)",
        "Dark-mode card text uses the readable theme color",
    );
    await page.goto(origin + "/pages/pricing.html");
    await ready();
    const label = page.locator("label").first();
    check(
        await label.evaluate((el) => getComputedStyle(el).color === "rgb(23, 76, 60)"),
        "Form labels use forest green in light mode",
    );
    await page.locator("#size").click();
    await page.mouse.move(1350, 190);
    check(
        await page
            .locator("#size option")
            .first()
            .evaluate((el) => getComputedStyle(el).backgroundColor === "rgb(255, 255, 255)"),
        "First picker option stays neutral without hover",
    );
    await page.screenshot({ path: path.join(root, "test-results", "premium-form-picker.png") });
    await page.keyboard.press("Escape");
    const entries = [
        "pages/home-1.html",
        "pages/home-2.html",
        ...["pages", "dashboard"].flatMap((dir) =>
            fs
                .readdirSync(path.join(root, dir))
                .filter((f) => f.endsWith(".html"))
                .map((f) => dir + "/" + f),
        ),
    ];
    const placeholderIssues = [];
    for (const file of entries) {
        const html = fs.readFileSync(path.join(root, file), "utf8");
        for (const match of html.matchAll(/<input\b[^>]*>/g)) {
            const tag = match[0];
            if (
                /type="(?:text|email|tel|password|number|search)"/.test(tag) &&
                !/placeholder="[^"]+"/.test(tag)
            )
                placeholderIssues.push(file + ": " + (tag.match(/id="([^"]+)"/)?.[1] || "input"));
        }
    }
    check(
        placeholderIssues.length === 0,
        "Text-input placeholders: " + placeholderIssues.join(", "),
    );
    check(errors.length === 0, "Variant page and resource errors: " + errors.join("; "));
    let layoutChecks = 0;
    const widths = [320, 360, 375, 390, 420, 480, 576, 768, 820, 1024, 1280, 1440, 1920];
    for (const file of ["pages/services.html", "pages/contact.html", "pages/blog-details.html"]) {
        await page.goto(origin + "/" + file);
        await ready();
        for (const theme of ["light", "dark"])
            for (const dir of ["ltr", "rtl"]) {
                await page.evaluate(
                    ({ theme, dir }) => {
                        document.documentElement.dataset.theme = theme;
                        document.documentElement.dir = dir;
                    },
                    { theme, dir },
                );
                for (const width of widths) {
                    await page.setViewportSize({ width, height: 900 });
                    check(
                        await page.evaluate(
                            () => document.documentElement.scrollWidth <= innerWidth + 1,
                        ),
                        file + " " + theme + " " + dir + " overflow at " + width,
                    );
                    layoutChecks++;
                }
            }
        await page.evaluate(() => {
            document.documentElement.dataset.theme = "light";
            document.documentElement.dir = "ltr";
        });
        await page.setViewportSize({ width: 1440, height: 1000 });
        await page.screenshot({
            path: path.join(
                root,
                "test-results",
                "premium-final-" + file.replaceAll("/", "-") + ".png",
            ),
            fullPage: true,
        });
    }
    fs.writeFileSync(
        path.join(root, "test-results", "premium-review.json"),
        JSON.stringify(
            {
                serviceVariants: 4,
                articleVariants: 3,
                photographicProcessSteps: 4,
                placeholderIssues,
                layoutChecks,
                errors,
                failures,
            },
            null,
            2,
        ),
    );
    console.log(
        JSON.stringify({ premiumReview: "complete", layoutChecks, errors, failures }, null, 2),
    );
};

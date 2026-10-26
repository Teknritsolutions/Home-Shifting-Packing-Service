/* Upgrade legacy captions and keep the generated documents in sync with shared UI. */
const fs = require("fs");
for (const file of [
    "assets/css/style.css",
    "assets/css/responsive.css",
    "assets/css/dashboard.css",
    "assets/css/premium.css",
]) {
    const source = fs
        .readFileSync(file, "utf8")
        .replace(/font-size:\s*(\d+(?:\.\d+)?)px/g, (match, size) =>
            Number(size) < 14 ? "font-size: 14px" : match,
        );
    fs.writeFileSync(file, source);
}
let charts = fs
    .readFileSync("assets/js/charts.js", "utf8")
    .replace(/size:\s*(?:10|11|12|13)\b/g, "size: 14");
fs.writeFileSync("assets/js/charts.js", charts);
let source = fs.readFileSync("scripts/build.cjs", "utf8");
source = source.replace('"premium", "rtl"', '"premium", "readability", "rtl"');
source = source.replace(
    "Fictional business story · Template content",
    "Thoughtful planning · Careful handling",
);
if (!source.includes("documentation-page.cjs")) {
    source = source.replace(
        /write\(\s*"sitemap.xml"/,
        `shell('documentation/index.html','MoveNest guide',()=>require('./documentation-page.cjs')({section,href,icon}));\nwrite("sitemap.xml"`,
    );
}
source = source.replace(
    '<div class="avatars"><span class="avatar">AR</span><span class="avatar">VS</span><span class="avatar">MK</span></div>',
    '<div class="avatars">${portrait("ananya","Illustrative portrait of Ananya")}${portrait("vikram","Illustrative portrait of Vikram")}${portrait("meera","Illustrative portrait of Meera")}</div>',
);
source = source.replace(
    "A little love from our demo customers",
    "Illustrative customer experiences",
);
source = source.replace(
    "A few fictional customer stories to show how your testimonials could look.",
    "Illustrative customer stories about thoughtful planning and careful moves.",
);
source = source.replace(
    "<p>Rhea D. · Fictional demo customer</p>",
    '<div class="reviewer featured-reviewer">${portrait("ishaan","Illustrative portrait of Ishaan")}<div><strong>Ishaan P.</strong><small>Home relocation · Illustrative story</small></div></div>',
);
source = source.replace("([n, , q]) =>", "([n, location, q], index) =>");
source = source.replace(
    "<strong>${n}</strong><small> · Demo review</small>",
    '<div class="reviewer">${portrait(index===0?"rhea":"kabir","Illustrative portrait of "+n)}<div><strong>${n}</strong><small>${location}</small></div></div>',
);
source = source.replace(
    '<span class="badge">Local demo</span><button class="icon-btn" data-rtl-toggle aria-label="Toggle text direction">⇄</button><button class="icon-btn" data-theme-toggle aria-label="Toggle dark mode">${icon("moon")}</button>',
    "${appearanceControls()}",
);
fs.writeFileSync("scripts/build.cjs", source);

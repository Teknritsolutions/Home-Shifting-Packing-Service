/* Remove component-specific paragraph sizing in favour of one responsive text token. */
const fs = require("fs");
for (const file of [
    "assets/css/style.css",
    "assets/css/responsive.css",
    "assets/css/dashboard.css",
]) {
    let css = fs.readFileSync(file, "utf8");
    css = css.replace(/([^{}]+)\{([^{}]*)\}/g, (match, selector, body) => {
        const paragraph =
            /(?:^|[\s>])p\s*(?:,|$)|blockquote|\.lead\s*$|\.article-body\s*$|\.form-note\s*$/.test(
                selector.trim(),
            );
        if (!paragraph) return match;
        return (
            selector +
            "{" +
            body
                .replace(/font-size\s*:[^;]+;/g, "font-size: var(--body-size);")
                .replace(/line-height\s*:[^;]+;/g, "line-height: 1.75;") +
            "}"
        );
    });
    fs.writeFileSync(file, css);
}
const build = "scripts/build.cjs";
let source = fs.readFileSync(build, "utf8");
source = source.replace(
    'aria-label="Back to top">↑</button>',
    'aria-label="Back to top">${icon("arrow")}</button>',
);
source = source.replace(
    'id="password" name="password" type="password" required',
    'id="password" name="password" type="password" placeholder="Enter at least 8 characters" required',
);
source = source.replace(
    '["bootstrap.min", "style", "dark-mode", "dashboard", "responsive", "rtl"]',
    '["bootstrap.min", "style", "dark-mode", "dashboard", "responsive", "premium", "rtl"]',
);
source = source.replace(
    'photos ? image(img, t) : filter ? image(["blog-packing", "blog-planning", "blog-choosing"][index], t) : ""',
    'photos ? image(img, t) : filter ? image(["blog-packing", "blog-planning", "blog-choosing"][index], t) : image(["related-packing", "related-planning", "related-company"][index], t)',
);
// Formatting may introduce line breaks; keep the replacement independent of source layout.
source = source.replace(
    /: filter\s*\? image\(\["blog-packing", "blog-planning", "blog-choosing"\]\[index\], t\)\s*: ""/g,
    ': filter ? image(["blog-packing", "blog-planning", "blog-choosing"][index], t) : image(["related-packing", "related-planning", "related-company"][index], t)',
);
fs.writeFileSync(build, source);

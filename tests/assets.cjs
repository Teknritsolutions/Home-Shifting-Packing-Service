const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const root = path.resolve(__dirname, "..");
const pages = [
    "documentation/index.html",
    ...["pages", "dashboard"].flatMap((dir) =>
        fs
            .readdirSync(path.join(root, dir))
            .filter((f) => f.endsWith(".html"))
            .map((f) => dir + "/" + f),
    ),
];
const problems = [];
const photographs = new Map();
for (const file of pages) {
    const source = fs.readFileSync(path.join(root, file), "utf8");
    for (const match of source.matchAll(/(?:src|href)="([^"]+)"/g)) {
        const reference = match[1].split(/[?#]/)[0];
        if (!reference || /^(https?:|mailto:|tel:|data:)/.test(reference)) continue;
        const absolute = path.resolve(root, path.dirname(file), reference);
        if (!fs.existsSync(absolute)) problems.push(file + " missing " + reference);
    }
    for (const match of source.matchAll(/<img[^>]+src="([^"]+\.webp)"[^>]+>/g)) {
        const image = path.resolve(root, path.dirname(file), match[1]);
        photographs.set(image, [...(photographs.get(image) || []), file]);
        if (!/alt="[^\"]+"/.test(match[0])) problems.push(file + " image lacks meaningful alt");
    }
    if (/â€|ï¿½|�/.test(source)) problems.push(file + " broken encoding");
}
const staticPhotoPlacements = photographs.size;
const variants = {
    "hero-service-intercity": "pages/service-details.html?service=intercity",
    "hero-service-packing": "pages/service-details.html?service=packing",
    "hero-service-office": "pages/service-details.html?service=office",
    "hero-article-moving-day": "pages/blog-details.html?article=moving-day",
    "hero-article-reliable": "pages/blog-details.html?article=reliable",
    "article-move-checklist": "pages/blog-details.html?article=moving-day feature",
    "article-company": "pages/blog-details.html?article=reliable feature",
};
for (const [name, usage] of Object.entries(variants)) {
    const file = path.join(root, "assets/images", name + ".webp");
    if (!fs.existsSync(file)) problems.push("Missing query-variant image " + name);
    photographs.set(file, [...(photographs.get(file) || []), usage]);
}
const hashes = new Map();
for (const [file, uses] of photographs) {
    if (uses.length > 1) problems.push(path.basename(file) + " repeated: " + uses.join(", "));
    if (!fs.existsSync(file)) continue;
    const hash = crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
    if (hashes.has(hash))
        problems.push("Duplicate photographic content: " + file + " and " + hashes.get(hash));
    hashes.set(hash, file);
}
console.log(
    JSON.stringify(
        {
            htmlPages: pages.length,
            staticPhotoPlacements,
            queryVariantPhotos: Object.keys(variants).length,
            uniquePhotoPlacements: photographs.size,
            uniquePhotoHashes: hashes.size,
            problems,
        },
        null,
        2,
    ),
);
fs.mkdirSync(path.join(root, "test-results"), { recursive: true });
fs.writeFileSync(
    path.join(root, "test-results", "asset-audit.json"),
    JSON.stringify(
        {
            htmlPages: pages.length,
            staticPhotoPlacements,
            queryVariantPhotos: Object.keys(variants).length,
            uniquePhotoPlacements: photographs.size,
            uniquePhotoHashes: hashes.size,
            problems,
        },
        null,
        2,
    ),
);
if (problems.length) process.exitCode = 1;

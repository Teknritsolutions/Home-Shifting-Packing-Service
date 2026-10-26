const fs = require("fs");
const directory = "assets/images/branding";
fs.mkdirSync(directory, { recursive: true });
const house = require("./premium-design.cjs")
    .mark.replace(/^<svg[^>]*>/, "")
    .replace(/<\/svg>$/, "")
    .replaceAll("var(--logo-ink, white)", "#fff")
    .replaceAll("var(--logo-detail, #D9BE87)", "#dfc28d");
fs.writeFileSync(
    directory + "/favicon.svg",
    `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 48 48" fill="none" style="color:#174c3c"><rect width="48" height="48" rx="14" fill="#f0f5ef"/>${house}</svg>`,
);
for (const [name, color] of [
    ["logo", "#174c3c"],
    ["logo-dark", "#a5cdb1"],
    ["logo-footer", "#174c3c"],
]) {
    const themedHouse =
        name === "logo-dark"
            ? house.replaceAll("#fff", "#123a2c").replaceAll("#dfc28d", "#3c604c")
            : house;
    fs.writeFileSync(
        directory + "/" + name + ".svg",
        `<svg xmlns="http://www.w3.org/2000/svg" width="340" height="92" viewBox="0 0 340 92" fill="none" style="color:${color}"><g transform="translate(0 12) scale(1.4)">${themedHouse}</g><text x="83" y="46" fill="currentColor" font-family="Manrope,Arial,sans-serif" font-size="36" font-weight="700" letter-spacing="-.8">Move<tspan font-weight="650">Nest</tspan></text><text x="84" y="69" fill="currentColor" font-family="Arial,sans-serif" font-size="12" letter-spacing=".8">PACKING &amp; RELOCATION</text></svg>`,
    );
}

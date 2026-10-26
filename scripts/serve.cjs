const http = require("http");
const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, "..");
const mime = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css",
    ".js": "text/javascript",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".woff2": "font/woff2",
    ".json": "application/json",
};
http.createServer((req, res) => {
    let file = path.resolve(root, "." + decodeURIComponent(req.url.split("?")[0]));
    if (!file.startsWith(root + path.sep) && file !== root) {
        res.writeHead(403);
        return res.end();
    }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory())
        file = path.join(file, "index.html");
    fs.readFile(file, (err, data) => {
        res.writeHead(err ? 404 : 200, {
            "Content-Type": mime[path.extname(file)] || "text/plain",
        });
        res.end(err ? "Not found" : data);
    });
}).listen(4173, "127.0.0.1", () => console.log("MoveNest: http://127.0.0.1:4173"));

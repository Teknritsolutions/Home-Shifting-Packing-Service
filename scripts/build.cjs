/* Generate readable, independent HTML documents from shared website components. */
const fs = require("fs");
const path = require("path");
const design = require("./premium-design.cjs");
const root = path.resolve(__dirname, "..");
const write = (file, text) => fs.writeFileSync(path.join(root, file), text);
const icons = {
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/><path d="m15 9 6-6m-4 0h4v4"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0l-1 1-1-1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
    headset:
        '<path d="M4 13v-2a8 8 0 0 1 16 0v2M4 12H3v6h4v-6H4Zm16 0h1v6h-4v-6h3Zm0 6v1a3 3 0 0 1-3 3h-4"/><path d="M10 22h3"/>',
    building:
        '<path d="M5 21V3h14v18M3 21h18M9 7h1m4 0h1M9 11h1m4 0h1M9 15h1m4 0h1M10 21v-3h4v3"/>',
    calendar:
        '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 11h18m-13 5 2 2 5-4"/>',
    wallet: '<path d="M20 8V5H5a2 2 0 0 1 0-4h13M3 3v16a2 2 0 0 0 2 2h15V8H5a2 2 0 0 1-2-2"/><path d="M20 12h-5v5h5m-3-2.5h.1"/>',
    arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    box: '<path d="m12 3 9 5v9l-9 5-9-5V8l9-5Zm0 10 9-5M3 8l9 5v9M7.5 5.5l9 5v4"/>',
    shield: '<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z"/><path d="m8 12 3 3 5-6"/>',
    truck: '<path d="M2 6a2 2 0 0 1 2-2h10v13H2V6Zm12 3h4l4 5v3h-8"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M14 14h8"/>',
    home: '<path d="m3 10 9-7 9 7M5 9v12h14V9M9 21v-8h6v8"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/>',
    people: '<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6m3 10v-3a6 6 0 0 0-3-5"/>',
    leaf: '<path d="M20 3C7 2 2 9 6 16s15 3 14-13ZM5 21 16 9"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
    phone: '<path d="m5 3 4 1 1 5-3 2a15 15 0 0 0 6 6l2-3 5 1 1 4c-1 6-9 3-14-2S0 4 5 3Z"/>',
    chart: '<path d="M4 3v18h17M8 16v-5m5 5V6m5 10V9"/>',
    file: '<path d="M6 3h8l4 4v14H6zM14 3v5h4M9 12h6m-6 4h6"/>',
    settings:
        '<path d="m9 3-.6 2.2-2 .9-2-.6L2 10l1.8 1.5v2L2 15l2.4 4.5 2-.6 2 .9L9 22h6l.6-2.2 2-.9 2 .6L22 15l-1.8-1.5v-2L22 10l-2.4-4.5-2 .6-2-.9L15 3H9Z"/><circle cx="12" cy="12.5" r="3"/>',
    chevron: '<path d="m9 5 7 7-7 7"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    moon: '<path d="M20 14A9 9 0 0 1 10 3a9 9 0 1 0 10 11Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M5 19l1.4-1.4M17.6 6.4 19 5"/>',
    direction: '<path d="M20 5H4m4-3L4 5l4 3M4 12h16M4 19h16m-4-3 4 3-4 3"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>',
    logout: '<path d="M9 4H4v16h5m4-4 4-4-4-4m-6 4h13"/>',
    bell: '<path d="M5 17h14l-2-4V8a5 5 0 0 0-10 0v5l-2 4Zm5 4h4"/>',
};
const icon = (name = "box") =>
    `<svg class="${name === "arrow" ? "arrow-icon" : ""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-icon="${name}">${icons[name] || icons.box}</svg>`;
const mark = design.mark;
let base = "";
let currentFile = "";
const href = (p) => base + p;
const brand = () =>
    `<a class="brand" href="${href("pages/home-1.html")}" aria-label="MoveNest home">${mark}<span class="brand-copy">Move<span class="brand-light">Nest</span><small><span class="brand-description-full">Packing & Relocation</span><span class="brand-description-compact">Move with care</span></small></span></a>`;
const appearanceControls = () =>
    `<button class="icon-btn theme-toggle" data-theme-toggle aria-label="Switch to dark mode" title="Switch to dark mode">${icon("moon")}</button><button class="icon-btn direction-toggle" data-rtl-toggle aria-label="Switch to right-to-left layout" title="Switch to right-to-left layout">${icon("direction")}<span data-direction-label>RTL</span></button>`;
const portrait = (name, alt) =>
    `<img class="avatar-photo" src="${href("assets/images/portrait-" + name + ".webp")}" alt="${alt}" width="56" height="56" loading="lazy">`;
const btn = (text, url = "pages/contact.html", style = "") =>
    `<a class="btn ${style}" href="${href(url)}">${text}${icon("arrow")}</a>`;
const image = (file, alt, cls = "", eager = false) =>
    `<img src="${href("assets/images/" + file + ".webp")}" alt="${alt}" class="${cls}" width="1200" height="800" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'}>`;
const heading = (label, title, desc = "", center = false) =>
    `<div class="section-heading ${center ? "center" : ""}"><span class="eyebrow">${label}</span><h2>${title}</h2>${desc ? `<p>${desc}</p>` : ""}</div>`;
const section = (body, cls = "") =>
    `<section class="section ${cls}"><div class="site-container">${body}</div></section>`;
const pageHero = (title, desc, eyebrow = "A little care. A better move.") =>
    design.pageHero(title, desc, eyebrow, {
        file: currentFile,
        image,
        href,
        icon,
    });
const cta = (
    title = "Ready for a smoother move?",
    desc = "Leave the heavy lifting to us. Let’s plan a move that feels right from the very first box.",
) =>
    design.cta(title, desc, {
        file: currentFile,
        section,
        image,
        icon,
        btn,
        href,
    });
const services = [
    [
        "Local home shifting",
        "A fresh start, just around the corner. Careful door-to-door moves within your city.",
        "local",
        "home",
        "local",
    ],
    [
        "Intercity relocation",
        "New city. Same peace of mind. Thoughtful planning for every mile of your journey.",
        "intercity",
        "truck",
        "intercity",
    ],
    [
        "Packing & unpacking",
        "From your favourite mug to your largest sofa, every little detail is protected.",
        "packing",
        "box",
        "packing",
    ],
    [
        "Office relocation",
        "Keep your business moving with an organized, carefully coordinated office move.",
        "office",
        "building",
        "office",
    ],
];
const serviceCards = (photographs = true) =>
    `<div class="grid ${photographs ? "grid-4" : "grid-2 service-catalog"}">${services.map(([title, desc, img, ic, key]) => `<article class="card">${image(photographs ? img : "service-" + img, title)}<div class="card-body"><h3>${title}</h3><p>${desc}</p><a class="text-link" href="${href("pages/service-details.html?service=" + key)}">Explore service ${icon("arrow")}</a></div></article>`).join("")}</div>`;
const benefits = [
    ["shield", "Care in every detail", "Purposeful packing for the things you love."],
    ["people", "A team you can trust", "Trained professionals, thoughtful people."],
    ["clock", "On your schedule", "A clear plan that respects your time."],
    ["file", "Transparent estimates", "Know your options before moving day."],
    ["leaf", "Thoughtful materials", "Reusable protection wherever practical."],
    ["phone", "A real point of contact", "One coordinator, from start to finish."],
];
const benefitList = () =>
    `<div class="feature-list">${(design.benefits[currentFile] || benefits).map(([ic, t, d]) => `<div class="feature-item">${icon(ic)}<div><h3>${t}</h3><p>${d}</p></div></div>`).join("")}</div>`;
const process = [
    ["Request a quote", "Tell us where you’re going and what you’re taking."],
    ["Plan your move", "We help you choose the right service and schedule."],
    ["Pack & transport", "Careful packing. Organized loading. A considered journey."],
    ["Settle in, happily", "We deliver, unpack and help you feel at home."],
];
const steps = () => design.process({ file: currentFile, image, href, icon });
const timeline = () =>
    `<div class="timeline">${(currentFile === "pages/how-it-works.html"
        ? [
              ["Loading check", "Your packed inventory is reviewed before the vehicle leaves."],
              [
                  "Journey underway",
                  "The sample tracking page shows the shared in-transit milestone.",
              ],
              [
                  "Delivery coordination",
                  "The receiving address and access plan are checked for handover.",
              ],
              [
                  "Arrival & inventory",
                  "Delivered items are matched with the moving list before closure.",
              ],
          ]
        : process
    )
        .map(
            ([t, d], i) =>
                `<article class="timeline-item"><span class="eyebrow">${currentFile === "pages/how-it-works.html" ? "Milestone" : "Step"} 0${i + 1}</span><h3>${t}</h3><p>${d}</p></article>`,
        )
        .join("")}</div>`;
const prices = () =>
    currentFile === "pages/home-1.html"
        ? design.solutions({ href, icon })
        : `<div class="grid grid-3">${[
              [
                  "Studio / 1 BHK",
                  "4,500",
                  "A small space, a big new beginning.",
                  [
                      "Up to 20 moving boxes",
                      "Small furniture handling",
                      "Local transport & loading",
                  ],
              ],
              [
                  "2–3 BHK",
                  "8,500",
                  "Room for everything that makes you, you.",
                  ["Up to 45 moving boxes", "Furniture disassembly", "Dedicated move coordinator"],
              ],
              [
                  "Large home / villa",
                  "15,000",
                  "A little extra care for a larger move.",
                  [
                      "Custom inventory planning",
                      "Specialist furniture protection",
                      "Priority move coordination",
                  ],
              ],
          ]
              .map(
                  ([t, p, d, ls], i) =>
                      `<article class="card price-card ${i === 1 ? "featured" : ""}"><span class="badge">${i === 1 ? "A popular choice" : "Tailored to your home"}</span><h3>${t}</h3><p>${d}</p><div class="price">₹${p}<small> / starting estimate</small></div><ul class="check-list">${ls.map((l) => `<li>${l}</li>`).join("")}</ul>${btn("Calculate estimate", "pages/pricing.html", "btn-outline")}</article>`,
              )
              .join(
                  "",
              )}</div><p class="demo-note center" style="margin-top:22px">Illustrative website estimates only. Your actual quotation depends on inventory, distance, access and service availability.</p>`;
const cities = ["Bengaluru", "Hyderabad", "Chennai", "Pune", "Mumbai", "Delhi"];
const faq = (items) =>
    `<div class="faq">${items.map(([q, a], i) => `<details><summary><span class="faq-number">0${i + 1}</span><span class="faq-question">${q}</span><span class="faq-toggle">${icon("chevronDown")}</span></summary><div class="faq-answer"><p>${a}</p></div></details>`).join("")}</div>`;
const faqLayout = (label, title, items) => {
    const pricing = currentFile === "pages/pricing.html";
    return `<div class="faq-layout"><div class="faq-intro">${heading(label, title)}<p>${pricing ? "Understand the details behind your estimate, from packing choices to access requirements." : "A little clarity makes planning easier. Find the practical details before your next step."}</p><div class="faq-assistance"><span class="round-icon">${icon(pricing ? "file" : "headset")}</span><h3>${pricing ? "Make the estimate yours." : "Still have a question?"}</h3><p>${pricing ? "Share your route and inventory for a more personal conversation." : "Talk through your route, belongings and moving-day plans with us."}</p>${btn(pricing ? "Discuss your estimate" : "Talk to our team", "pages/contact.html", "btn-outline")}</div></div>${faq(items)}</div>`;
};
const faqs = [
    [
        "How far ahead should I plan my move?",
        "For this sample, we recommend planning two to four weeks ahead. A real provider must confirm crew and vehicle availability before a booking becomes binding.",
    ],
    [
        "What does a moving estimate include?",
        "The illustrative calculator separates transport, packing materials, labour and optional services. A real quotation requires a verified inventory and access assessment.",
    ],
    [
        "Can you help with fragile items?",
        "Yes, this website demonstrates custom packing services. Share details of glassware, artwork and delicate items when requesting a quotation.",
    ],
    [
        "How do I track my booking?",
        "Open the customer dashboard to view sample move milestones. Admin status changes and newly created bookings are saved in this browser.",
    ],
];
const reviewData = [
    [
        "Ananya R.",
        "Bengaluru → Pune",
        "From the first call to the last box, everything felt considered. Our new beginning was a genuinely calm one.",
        "AR",
    ],
    [
        "Vikram S.",
        "Local home move",
        "The team took such care with our furniture. A clear plan, friendly people and no moving-day confusion.",
        "VS",
    ],
    [
        "Meera K.",
        "2 BHK relocation",
        "I loved having one person to speak with throughout. It made a complicated move feel wonderfully simple.",
        "MK",
    ],
];
const reviews = () =>
    `<div class="grid grid-3">${reviewData.map(([n, loc, q], i) => `<article class="card testimonial"><span class="stars" aria-label="5 out of 5 illustrative rating">★★★★★</span><blockquote>“${q}”</blockquote><div class="reviewer">${portrait(["ananya", "vikram", "meera"][i], "Illustrative portrait of " + n)}<div><strong>${n}</strong><small>${loc}</small></div></div></article>`).join("")}</div>`;
const articles = [
    [
        "Packing",
        "A little extra care for your fragile favourites",
        "fragile",
        "8 min read",
        "fragile",
    ],
    [
        "Planning",
        "Your calm, collected moving-day checklist",
        "moving-day",
        "6 min read",
        "moving-day",
    ],
    [
        "Moving tips",
        "How to choose a moving company with confidence",
        "reliable",
        "5 min read",
        "reliable",
    ],
];
const articleCards = (photos = true, filter = false) =>
    `<div class="grid grid-3" ${filter ? 'id="article-grid"' : ""}>${articles.map(([cat, t, img, read, key], index) => `<article class="card" data-category="${cat}">${photos ? image(img, t) : filter ? image(["blog-packing", "blog-planning", "blog-choosing"][index], t) : image(["related-packing", "related-planning", "related-company"][index], t)}<div class="card-body"><span class="article-meta">${cat} · ${read}</span><h3>${t}</h3><p>${key === "fragile" ? "Smart protection for the irreplaceable little things." : key === "moving-day" ? "A practical guide to an easier first day in your next home." : "The right questions to ask before you book your next move."}</p><a class="text-link" href="${href("pages/blog-details.html?article=" + key)}">Read the guide ${icon("arrow")}</a></div></article>`).join("")}</div>`;
const newsletter = () =>
    currentFile === "pages/blog-details.html"
        ? section(
              `<div class="reader-kit"><div class="reader-kit-icon">${icon("file")}</div><div><span class="eyebrow">Put a little advice into practice</span><h2>Take a calmer plan<br>into moving day.</h2><p>Keep a simple room-by-room checklist close, or explore the next practical step for your move.</p><div class="actions"><a class="btn" href="${href("documentation/moving-checklist.txt")}" download>Download the checklist${icon("arrow")}</a>${btn("Explore an estimate", "pages/pricing.html", "btn-outline")}</div></div></div>`,
              "soft",
          )
        : section(
              `<div class="panel split newsletter-panel"><div><span class="eyebrow">A little guidance goes a long way</span><h2>Good moves start with good advice.</h2><p>Get a practical checklist for your next chapter.</p></div><form data-form="newsletter"><label for="newsletter-email">Your email address</label><div class="actions"><input id="newsletter-email" type="email" name="email" required placeholder="you@example.com" style="flex:1;min-width:150px"><button class="btn" type="submit">Send me the checklist</button></div><p class="form-note">No email is sent or subscription created.</p><p class="form-message" role="status"></p></form></div>`,
              "soft",
          );
function header() {
    const dropdown = (label, url, items, id) =>
        `<div class="nav-dropdown" data-nav-group="${id}"><div class="nav-dropdown-heading">${url ? `<a class="nav-link" href="${href(url)}">${label}</a>` : `<button class="nav-link nav-group-label" type="button" aria-expanded="false" aria-controls="${id}-menu">${label}</button>`}<button class="nav-dropdown-toggle" type="button" aria-label="Show ${label.toLowerCase()} pages" aria-expanded="false" aria-controls="${id}-menu">${icon("chevronDown")}</button></div><div class="dropdown" id="${id}-menu" hidden>${items.map(([t, p]) => `<a href="${href(p)}">${t}${icon("arrow")}</a>`).join("")}</div></div>`;
    return `<a class="skip-link" href="#main">Skip to content</a><header class="site-header"><div class="site-container header-inner">${brand()}<nav class="nav-main" id="main-nav" aria-label="Main navigation"><div class="mobile-nav-heading">${brand()}<button class="icon-btn mobile-nav-close" type="button" aria-label="Close navigation">${icon("close")}</button></div>${dropdown(
        "Home",
        "pages/home-1.html",
        [
            ["Homepage 1", "pages/home-1.html"],
            ["Homepage 2", "pages/home-2.html"],
        ],
        "home",
    )}<a class="nav-link" href="${href("pages/about.html")}">About Us</a>${dropdown("Services", "pages/services.html", [["All services", "pages/services.html"], ...services.map((s) => [s[0], "pages/service-details.html?service=" + s[4]])], "services")}${[
        ["Pricing", "pricing"],
    ]
        .map(([t, p]) => `<a class="nav-link" href="${href("pages/" + p + ".html")}">${t}</a>`)
        .join("")}${dropdown(
        "More",
        null,
        [
            ["How it works", "pages/how-it-works.html"],
            ["Service areas", "pages/service-areas.html"],
            ["Moving journal", "pages/blog.html"],
        ],
        "more",
    )}<a class="nav-link" href="${href("pages/contact.html")}">Contact</a>${dropdown(
        "Dashboards",
        "dashboard/customer-dashboard.html",
        [
            ["Customer dashboard", "dashboard/customer-dashboard.html"],
            ["Admin dashboard", "dashboard/admin-dashboard.html"],
        ],
        "dashboards",
    )}<div class="mobile-nav-actions"><a class="btn btn-login" href="${href("pages/login.html")}">Login</a>${btn("Get a free quote", "pages/contact.html")}</div></nav><div class="header-actions">${appearanceControls()}<a class="btn btn-login login-link" href="${href("pages/login.html")}">Login</a>${btn("Get a free quote", "pages/contact.html")}<button class="icon-btn menu-toggle" aria-label="Open navigation" aria-controls="main-nav" aria-expanded="false">${icon("menu")}</button></div></div><button class="nav-backdrop" type="button" aria-label="Close navigation" tabindex="-1" hidden></button></header>`;
}
function footer() {
    return `<footer class="site-footer"><div class="site-container"><div class="footer-grid"><div class="footer-brand">${brand()}<p>Thoughtful packing, careful handling and a clear plan. A little more care for the things that make a home yours.</p><p class="footer-care-note">For apartments, family homes and growing workplaces.</p><nav class="footer-social" aria-label="Social media"><a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Facebook"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 21v-8h3l.5-4H14V7c0-1 .3-2 2-2h2V1.5L15 1c-3 0-5 2-5 5v3H7v4h3v8"/></svg></a><a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/></svg></a><a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M7 10v7m4 0v-7m0 3c0-4 6-4 6 0v4"/><circle cx="7" cy="7" r=".8" fill="currentColor" stroke="none"/></svg></a><a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="YouTube" title="YouTube"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3Z"/></svg></a></nav></div><div><h3>Moving services</h3>${services.map((s) => `<a href="${href("pages/service-details.html?service=" + s[4])}">${s[0]}</a>`).join("")}<a href="${href("pages/service-areas.html")}">Service areas</a></div><div><h3>Explore MoveNest</h3>${[
        ["Our story", "pages/about.html"],
        ["Pricing & estimates", "pages/pricing.html"],
        ["How it works", "pages/how-it-works.html"],
        ["Moving journal", "pages/blog.html"],
        ["Plan your move", "pages/contact.html"],
    ]
        .map(([t, p]) => `<a href="${href(p)}">${t}</a>`)
        .join(
            "",
        )}</div><div><h3>Let’s talk</h3><a class="footer-contact-link" href="tel:+918000000000">${icon("phone")} +91 80000 00000</a><a class="footer-contact-link" href="mailto:hello@movenest.example">${icon("mail")} hello@movenest.example</a><dl class="footer-hours"><dt>A good time to call</dt><dd>Monday–Saturday<br>9:00 AM–7:00 PM IST</dd></dl><a href="${href("pages/contact.html")}">Contact our team ${icon("arrow")}</a></div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} MoveNest. All rights reserved.</span><span>Thoughtful packing. Carefully coordinated moves.</span></div></div></footer><button class="back-top" aria-label="Back to top">${icon("arrow")}</button>`;
}
function shell(file, title, body, { dashboard = false, auth = false } = {}) {
    currentFile = file;
    base = file.includes("/") ? "../" : "";
    const description = `${title} — MoveNest premium packing and relocation HTML website. Thoughtful moving services and interactive front-end examples.`;
    const scripts = [
        "theme",
        "demo-store",
        "navigation",
        "main",
        "calculator",
        "auth-demo",
        "booking",
        "dashboard",
        "charts",
    ];
    const html = `<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1">\n    <title>${title} | MoveNest</title>\n    <meta name="description" content="${description}">\n    <meta property="og:title" content="${title} | MoveNest">\n    <meta property="og:description" content="${description}">\n    <meta property="og:type" content="website">\n    <link rel="canonical" href="https://movenest.example/${file}">\n    <link rel="icon" href="${href("assets/images/branding/favicon.svg")}" type="image/svg+xml">\n    <link rel="icon" href="${href("assets/images/branding/favicon.png")}" type="image/png">\n    <link rel="apple-touch-icon" href="${href("assets/images/branding/apple-touch-icon.png")}">\n    <link rel="preload" href="${href("assets/fonts/inter.woff2")}" as="font" type="font/woff2" crossorigin>\n    <script src="${href("assets/js/theme.js")}"></script>\n    ${["bootstrap.min", "style", "dark-mode", "dashboard", "responsive", "premium", "readability", "rtl"].map((x) => `<link rel="stylesheet" href="${href("assets/css/" + x + ".css")}">`).join("\n    ")}\n    <script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "WebPage", name: title, description, url: "https://movenest.example/" + file })}</script>\n</head>\n<body${dashboard ? ' class="dashboard-page"' : auth ? ' class="auth-page"' : ""}>\n    ${dashboard || auth ? "" : header()}${auth ? `<div class="auth-appearance" aria-label="Appearance settings">${appearanceControls()}</div>` : ""}\n    <main id="main">\n        ${body()}\n    </main>\n    ${dashboard || auth ? "" : footer()}\n    <div class="toast" role="status" hidden></div>\n    ${dashboard ? `<script defer src="${href("assets/js/chart.umd.min.js")}"></script>` : ""}\n    ${scripts
        .filter((s) => s !== "theme")
        .map((s) => `<script defer src="${href("assets/js/" + s + ".js")}"></script>`)
        .join("\n    ")}\n</body>\n</html>\n`;
    // Expand adjacent elements onto new lines for an editable source distribution.
    let sectionNumber = 0;
    write(
        file,
        html
            .replace(/<section\b/g, () => `<!-- Content section ${++sectionNumber} -->\n<section`)
            .replace(/></g, ">\n<"),
    );
}
shell(
    "pages/home-1.html",
    "Moving homes. Keeping the feeling.",
    () =>
        `<!-- 01 · Premium split hero -->
    <section class="hero"><div class="site-container split"><div><span class="trust-pill">Thoughtful moves. Beautiful new beginnings.</span><h1>A fresh start.<br>A smoother move.<br><em>A little more care.</em></h1><p class="lead">Home is more than a place. We take care of the things that make it yours, so you can look forward to what comes next.</p><div class="actions">${btn("Get a free quote")}${btn("Explore services", "pages/services.html", "btn-outline")}</div><div class="rating"><div class="avatars">${portrait("home-welcome-a", "Portrait of a smiling customer")}${portrait("home-welcome-b", "Portrait of a smiling customer")}${portrait("home-welcome-c", "Portrait of a smiling customer")}</div><div><span class="stars">★★★★★</span><p><strong>4.9/5</strong> · Illustrative customer experiences</p></div></div></div><div class="hero-media">${image("home-hero", "Professional movers carrying boxes outside a contemporary home", "", true)}<div class="floating-card"><span class="round-icon" style="margin:0">${icon("shield")}</span><div><strong>Handled with care.</strong><small>From your first box to your front door.</small></div></div></div></div></section>` +
        `<section class="stats-strip" aria-label="Illustrative company statistics"><div class="site-container stats-grid">${[
            ["12+", "Years of experience"],
            ["8,500+", "Successful moves"],
            ["35+", "Service cities"],
            ["98%", "Customer satisfaction"],
        ]
            .map(
                ([n, t]) =>
                    `<div class="stat"><strong>${n}</strong><span>${t} · Sample</span></div>`,
            )
            .join("")}</div></section>` +
        section(
            `<div class="heading-row">${heading("Our moving services", "Every move is different.<br>Our care stays the same.", "From one room to a whole new city, find a little help for your next big step.")}${btn("View all services", "pages/services.html", "btn-outline")}</div>${serviceCards()}`,
        ) +
        section(
            `<div class="split home-care-layout">${image("care", "Mover carefully wrapping a cream sofa", "feature-image")}<div>${heading("The MoveNest difference", "Good hands.<br>Great peace of mind.", "We believe the best moves feel effortless. That’s why we put thought into every detail, long before moving day.")}${benefitList()}${btn("Get to know us", "pages/about.html", "btn-outline")}</div></div>`,
            "soft",
        ) +
        section(
            `${heading("Simple from the start", "Four steps. One happy beginning.", "A clear plan and a caring team, every step of the way.", true)}${steps()}`,
        ) +
        section(
            `${heading("A move that fits your life", "Small studio. Big family home.<br>We make room for it all.", "Find a starting point, then make it yours with a personalized estimate.", true)}${prices()}`,
            "soft",
        ) +
        section(
            `<div class="split"><div>${heading("Near or far, we’re here", "New neighbourhood?<br>New city? Let’s go.", "Our sample service network connects the places you call home. Check your route and start planning with confidence.")}<div class="city-tags">${cities.map((c) => `<span>${c}</span>`).join("")}</div>${btn("Check your location", "pages/service-areas.html", "btn-outline")}</div>${image("coverage", "Moving truck on a leafy residential street", "coverage-image")}</div>`,
        ) +
        section(
            `${heading("Stories from the other side", "Happy moves. Happier beginnings.", "Illustrative customer stories about thoughtful planning and careful moves.", true)}${reviews()}`,
            "soft",
        ) +
        section(
            `<div class="heading-row">${heading("The moving journal", "A little know-how.<br>A whole lot less stress.", "Practical advice for before, during and after your move.")}${btn("Visit the journal", "pages/blog.html", "btn-outline")}</div>${articleCards()}`,
        ) +
        cta(),
);
shell(
    "pages/home-2.html",
    "Make room for your next chapter",
    () =>
        `<section class="editorial-hero">${image("home2-hero", "Moving crew at an elegant home at sunrise", "", true)}<div class="site-container"><span class="eyebrow">Life moves. We move with you.</span><h1>Make room for<br>your next chapter.</h1><p>Thoughtful moving services for the places you’re going and the things you’re taking with you.</p><div class="actions">${btn("Plan my move", "pages/contact.html", "btn-light")}</div></div></section>` +
        section(
            `<form class="quote-bar" id="quick-quote"><div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr));align-items:end">${field("Pickup city", "pickup", "text", "Bengaluru")}${field("Destination city", "destination", "text", "Pune")}${selectField("Home size", "size", ["Studio / 1 BHK", "2–3 BHK", "Large home / villa"])}${field("Moving date", "date", "date")}<button class="btn" type="submit">Get estimate ${icon("arrow")}</button></div><p class="form-message" role="status"></p></form>`,
        ) +
        section(
            `<div class="split personal-intro"><div class="collage">${image("expertise", "Movers carrying an oak table through a doorway")}${image("materials", "Recyclable packing materials")}</div><div>${heading("Built around you", "Moving is personal.<br>We treat it that way.", "There’s a story in every room. Our considered approach makes space for yours, from the first conversation to the final unpacked box.")}<p>Thoughtful planning, careful hands and a dedicated coordinator turn a complicated day into a welcome beginning.</p>${btn("Discover our approach", "pages/about.html", "btn-outline")}</div></div>`,
            "soft",
        ) +
        section(
            `${heading("A considered collection of services", "The right help.<br>Right where you need it.")}<div class="service-collection">${services.map(([t, d, , ic, key], i) => `<article class="collection-card">${image("home2-service-" + key, t)}<div class="collection-body"><div class="collection-label"><span class="round-icon">${icon(ic)}</span><span class="small">Service / 0${i + 1}</span></div><h3>${t}</h3><p>${d}</p><a class="text-link" href="${href("pages/service-details.html?service=" + key)}">Find out more ${icon("arrow")}</a></div></article>`).join("")}</div>`,
        ) +
        section(
            `<div class="split home2-benefits"><div>${heading("Less worry. More possibility.", "The difference<br>is in the details.")}<p>A written plan, purposeful protection and one familiar coordinator bring clarity to every stage of your move.</p>${image("home2-care-coordinator", "A moving coordinator preparing a household packing plan", "section-detail-photo")}</div><div>${benefitList()}</div></div>`,
            "soft",
        ) +
        section(
            `<div class="split packing-care-layout">${image("safety", "Protected furniture secured in a moving truck", "feature-image")}<div>${heading("Packed with purpose", "Everything has a place.<br>Everything gets our care.")}<ul class="check-list"><li>Room-by-room inventory planning</li><li>Layered protection for fragile belongings</li><li>Reusable moving blankets for furniture</li><li>Organized loading and secure transport</li><li>A final walkthrough before we leave</li></ul>${btn("Explore packing services", "pages/service-details.html?service=packing", "btn-outline")}</div></div>`,
        ) +
        section(
            `<div class="split home2-journey"><div>${heading("Your moving journey", "A good plan makes<br>all the difference.")}<p>A move has many moving parts. Here’s how we help them come together.</p>${btn("See how it works", "pages/how-it-works.html", "btn-outline")}${image("home2-journey-advisor", "An advisor helping prepare a moving quote", "section-detail-photo")}</div>${timeline()}</div>`,
            "soft",
        ) +
        section(
            `${heading("From here to happily settled", "Every doorstep has a story.", "Explore three illustrative relocation plans.")}<div class="grid grid-3">${[
                ["project1", "A city apartment, a fresh perspective", "Bengaluru · 2 BHK"],
                ["project2", "A growing team, a bigger workspace", "Hyderabad · Office move"],
                ["project3", "More room for family memories", "Pune · Villa relocation"],
            ]
                .map(
                    ([im, t, d], projectIndex) =>
                        `<article class="card">${image(im, t)}<div class="card-body"><span class="article-meta">${d}</span><h3>${t}</h3><p>${["A room-by-room packing plan for a compact apartment, with lift access arranged and essentials delivered first.", "Workstations, equipment and files organized by team, with a phased handover to help the office settle in.", "Layered protection for family furniture, labeled boxes for every room and careful placement across a larger home."][projectIndex]}</p></div></article>`,
                )
                .join("")}</div>`,
        ) +
        section(
            `<div class="split"><div><span class="eyebrow">A new beginning, beautifully handled</span><blockquote class="quote-feature">“The plan made space for us to enjoy our first evening in the new home.”</blockquote><div class="reviewer featured-reviewer">${portrait("ishaan", "Illustrative portrait of Ishaan")}<div><strong>Ishaan P.</strong><small>Home relocation · Illustrative story</small></div></div></div><div class="grid">${design.home2Reviews
                .map(
                    ([n, location, q], index) =>
                        `<article class="panel"><span class="stars">★★★★★</span><p>“${q}”</p><div class="reviewer">${portrait(index === 0 ? "rhea" : "kabir", "Illustrative portrait of " + n)}<div><strong>${n}</strong><small>${location}</small></div></div></article>`,
                )
                .join("")}</div></div>`,
            "soft",
        ) +
        section(
            `<div class="cta split"><div>${image("welcome", "Family opening the door of their new home", "coverage-image")}</div><div><span class="eyebrow">Here’s to what’s next</span><h2>Your next chapter<br>deserves a gentle start.</h2><p>Tell us a little about your plans. We’ll help you find your way home.</p><div class="actions" style="margin-top:26px">${btn("Let’s plan your move", "pages/contact.html", "btn-light")}</div></div></div>`,
        ),
);
function field(label, name, type = "text", placeholder = "", required = true, value = "") {
    const maximum = name.startsWith("base") ? 1000000 : name === "floor" ? 200 : 10000;
    const examples = {
        distance: "e.g. 25",
        floor: "e.g. 2",
        boxes: "e.g. 20",
        base0: "e.g. 3000",
        base1: "e.g. 6000",
        base2: "e.g. 11000",
        distanceRate: "e.g. 25",
        name: "Your full name",
        email: "you@example.com",
        phone: "+91 98765 43210",
        address: "Street, neighbourhood and city",
        "new-password": "Create a password with 8+ characters",
        "confirm-password": "Re-enter your new password",
    };
    placeholder =
        placeholder ||
        examples[name] ||
        (type === "password"
            ? "Enter at least 8 characters"
            : type === "number"
              ? "Enter an amount"
              : `Enter ${label.toLowerCase()}`);
    return `<div><label for="${name}">${label}</label><input id="${name}" name="${name}" type="${type}" ${required ? "required" : ""} ${type === "number" ? `min="0" max="${maximum}"` : ""} placeholder="${placeholder}" ${value !== "" ? `value="${value}"` : ""}></div>`;
}
function selectField(label, name, options) {
    return `<div><label for="${name}">${label}</label><select id="${name}" name="${name}">${options.map((x, i) => `<option value="${i}">${x}</option>`).join("")}</select></div>`;
}
shell(
    "pages/about.html",
    "A little more heart in every move",
    () =>
        pageHero(
            "A little more heart in every move",
            "Meet the idea behind MoveNest: a moving experience built around care, clarity and the people who make a house a home.",
            "Our story",
        ) +
        section(
            `<div class="split about-story-layout">${image("story", "A moving team standing in their organized depot", "feature-image")}<div>${heading("More than moving boxes", "We’re here for<br>the people behind them.")}<p>MoveNest is built around a simple belief: starting over should feel exciting. This illustrative company story begins with a small team and a big commitment to making relocation a little more human.</p><p>Our approach reflects that commitment, from thoughtful service planning to a clear view of your move.</p><span class="badge">Thoughtful planning · Careful handling</span></div></div>`,
        ) +
        section(
            `${heading("What guides us", "Good values. Better beginnings.", "", true)}<div class="grid grid-3">${[
                [
                    "Our mission",
                    "Make the path to a new home feel clear, comfortable and cared for.",
                ],
                [
                    "Our vision",
                    "A world where a new address feels like an opportunity, without the overwhelm.",
                ],
                [
                    "Our values",
                    "Listen carefully, communicate honestly and treat every belonging with respect.",
                ],
            ]
                .map(
                    ([t, d]) =>
                        `<article class="panel values-card"><span class="round-icon">${icon({ "Our mission": "target", "Our vision": "eye", "Our values": "heart" }[t])}</span><h3>${t}</h3><p>${d}</p></article>`,
                )
                .join("")}</div>`,
            "soft",
        ) +
        section(
            `<div class="company-history"><div>${heading("Growing with every journey", "Small beginnings. Thoughtful progress.")}<p>A look at the milestones that shape our approach.</p></div><div class="timeline">${[
                [
                    "2014",
                    "Our first local move",
                    "A small team, carefully helping one home at a time.",
                ],
                ["2018", "A wider circle of care", "Intercity planning becomes part of our story."],
                [
                    "2022",
                    "A more considered approach",
                    "Reusable materials and dedicated move coordinators.",
                ],
                [
                    "Today",
                    "Ready for your next chapter",
                    "A full range of home and business moving services.",
                ],
            ]
                .map(
                    ([y, t, d]) =>
                        `<article class="timeline-item"><span class="eyebrow">${y} · Sample milestone</span><h3>${t}</h3><p>${d}</p></article>`,
                )
                .join("")}</div></div>`,
        ) +
        section(
            `${heading("People make the difference", "Meet your moving minds.", "Fictional team profiles; replace these with your own people.", true)}<div class="grid grid-3">${[
                ["RK", "Rohan Kapoor", "Operations lead", "Keeps the details working together."],
                ["AS", "Aditi Shah", "Customer experience", "Your calm voice throughout the move."],
                [
                    "SN",
                    "Sameer Nair",
                    "Packing specialist",
                    "Thoughtful protection for everyday treasures.",
                ],
            ]
                .map(
                    ([a, n, r, d]) =>
                        `<article class="card">${image({ RK: "team-rohan", AS: "team-aditi", SN: "team-sameer" }[a], "Fictional team portrait of " + n)}<div class="card-body"><h3>${n}</h3><span class="eyebrow">${r}</span><p>${d}</p></div></article>`,
                )
                .join("")}</div>`,
            "soft",
        ) +
        cta("Let’s make your next move a good one."),
);
shell(
    "pages/services.html",
    "A little help for every kind of move",
    () =>
        pageHero(
            "A little help for every kind of move",
            "From a few carefully packed boxes to a whole new office, find the service that makes your next step simpler.",
            "Our services",
        ) +
        section(
            `${heading("Find your perfect fit", "Your move, thoughtfully handled.")} ${serviceCards(false)}`,
        ) +
        section(
            `<div class="split">${image("storage", "Clean organized storage warehouse", "feature-image")}<div>${heading("Beyond the basics", "Some things need<br>a little extra thought.")}<ul class="check-list"><li>Fragile glassware and artwork protection</li><li>Furniture dismantling and reassembly</li><li>Room-by-room labeling and inventory</li><li>Short-term storage coordination</li><li>Packing material recommendations</li></ul>${btn("Discuss your requirements")}</div></div>`,
            "soft",
        ) +
        section(
            `${heading("Home or work", "A different plan for every doorstep.")}<div class="grid grid-2"><article class="panel"><span class="round-icon">${icon("home")}</span><h3>For your home</h3><p>A personal, room-by-room approach that protects belongings and keeps essentials close.</p><ul class="check-list"><li>Flexible home-size options</li><li>Furniture and fragile-item handling</li><li>Thoughtful delivery and unpacking</li></ul></article><article class="panel"><span class="round-icon">${icon("building")}</span><h3>For your business</h3><p>A coordinated move that keeps your team informed and helps you get back to work.</p><ul class="check-list"><li>Department and workstation labeling</li><li>Equipment packing and inventory</li><li>Scheduled loading and handover</li></ul></article></div>`,
        ) +
        section(
            `<div class="split service-promise"><div class="promise-introduction">${heading("A practical promise", "Care you can see.<br>Clarity you can feel.")}<p>A clear estimate, an organized plan and people who listen. That’s a strong foundation for any move.</p><div class="promise-photo-frame">${image("service-promise-artwork", "Moving specialist carefully protecting artwork for safe transport", "promise-photo", true)}</div></div><div>${benefitList()}</div></div>`,
            "soft",
        ) +
        cta(),
);
shell(
    "pages/service-details.html",
    "Local home shifting",
    () =>
        pageHero(
            "<span data-service-title>Local home shifting</span>",
            "A thoughtful, door-to-door service for the place you’re going and the things you love.",
            "Your move. Our care.",
        ) +
        section(
            `<div class="split"><div>${heading("Designed around your day", "A familiar kind of care.<br>A brand-new address.")}<p data-service-description>Our local home shifting service helps you move across the city with a clear plan, organized packing and careful delivery.</p><p>Start with an inventory, choose the protection you need and let your coordinator bring the details together. All services shown are illustrative website content.</p>${btn("Estimate this move", "pages/pricing.html")}</div>${image("detail", "Professional carefully packing household belongings", "feature-image")}</div>`,
        ) +
        section(
            `<div class="split"><div>${heading("What’s included", "A considered service,<br>from start to finish.")}<ul class="check-list"><li>Pre-move inventory and access assessment</li><li>Appropriate packing material planning</li><li>Furniture protection and organized loading</li><li>Coordinated transport to your new address</li><li>Delivery walkthrough and inventory check</li></ul></div><div class="panel"><h3>A clear plan before moving day</h3><p>Share your home size, pickup and delivery addresses, floor access and any special items. These details help a real moving provider prepare an accurate quotation.</p><div class="city-tags"><span>Flexible planning</span><span>Careful handling</span><span>Clear communication</span></div>${btn("Talk to a coordinator")}</div></div>`,
            "soft",
        ) +
        section(
            `${heading("The simple steps", "Good planning goes a long way.", "", true)}${steps()}`,
        ) +
        section(
            `${faqLayout("Good questions, clear answers", "Before you make your move.", faqs)}`,
            "soft",
        ) +
        cta("A fresh address starts with a conversation."),
);
shell(
    "pages/pricing.html",
    "A clearer picture of your moving costs",
    () =>
        pageHero(
            "A clearer picture of your moving costs",
            "Explore an illustrative estimate and see how your moving choices affect the total. A little clarity makes planning easier.",
            "Transparent by design",
        ) +
        section(
            `${heading("Moving cost calculator", "A starting point for your plans.", "Sample pricing, calculated in your browser. This is not a confirmed quotation.")}<div class="split pricing-calculator-layout"><form class="panel form-grid" id="calculator">${field("Pickup location", "pickup", "text", "Bengaluru")}${field("Delivery location", "delivery", "text", "Pune")}${selectField("Home size", "size", ["Studio / 1 BHK", "2–3 BHK", "Large home / villa"])}${field("Approximate distance (km)", "distance", "number", "", true, 20)}${field("Floor number", "floor", "number", "", true, 0)}${selectField("Elevator available?", "elevator", ["Yes", "No"])}${selectField("Packing requirements", "packing", ["Standard packing", "Premium protection", "No packing"])}${selectField("Additional services", "extras", ["None", "Unpacking · ₹1,200", "Furniture assembly · ₹1,800", "Both · ₹3,000"])}<button class="btn full" type="submit">Calculate my estimate ${icon("arrow")}</button></form><div class="estimate-column"><div class="panel" aria-live="polite"><span class="eyebrow">Your illustrative estimate</span><h3>A little transparency.</h3><div id="estimate-breakdown"><p>Complete the calculator to see the costs of your example move.</p></div><p class="form-note">Subject to confirmed inventory, route, access, taxes and provider availability. No payment is collected.</p><a class="text-link" href="${href("dashboard/new-booking.html")}">Use this estimate in a booking ${icon("arrow")}</a></div><figure class="estimate-photo">${image("pricing-estimate-care", "Moving advisor discussing an estimate and protected belongings with a homeowner", "", true)}<figcaption>${icon("shield")}A considered plan for everything you bring.</figcaption></figure></div></div>`,
        ) +
        section(
            `${heading("Sized to your home", "Find your starting point.", "", true)}${prices()}`,
            "soft",
        ) +
        section(
            `${heading("The details that make a difference", "What shapes your estimate?", "", true)}<div class="grid grid-4">${[
                ["truck", "Distance", "Your route and vehicle requirements."],
                ["box", "Inventory", "The volume and type of belongings."],
                ["home", "Access", "Floors, elevators and loading space."],
                ["shield", "Protection", "Packing needs and specialist handling."],
            ]
                .map(
                    ([ic, t, d]) =>
                        `<article class="panel cost-factor-card">${image("pricing-factor-" + t.toLowerCase(), { Distance: "Moving truck on an intercity road", Inventory: "Organized boxes and household belongings", Access: "Boxes being moved near an apartment elevator", Protection: "Delicate ceramic protected with packing materials" }[t], "cost-factor-photo")}<div class="cost-factor-content"><span class="round-icon">${icon(ic)}</span><h3>${t}</h3><p>${d}</p></div></article>`,
                )
                .join("")}</div>`,
        ) +
        section(
            `${heading("No mystery in the numbers", "How the sample estimate is built.")}<div class="panel"><table class="breakdown"><thead><tr><th scope="col">Charge</th><th scope="col">Configurable sample rule</th></tr></thead><tbody><tr><td>Base moving charge</td><td>₹3,000 / ₹6,000 / ₹11,000</td></tr><tr><td>Distance</td><td>₹25 per km</td></tr><tr><td>Packing materials</td><td>₹0 / ₹1,000 / ₹2,200</td></tr><tr><td>Labour & access</td><td>₹1,000 + floor surcharge without elevator</td></tr><tr><td>Additional services</td><td>Based on your selection</td></tr></tbody></table><p class="form-note">Change the rates in the admin settings. Taxes are excluded from this illustrative estimate.</p></div>`,
            "soft",
        ) +
        section(
            `${faqLayout("A few more details", "Questions about your estimate?", design.priceFaqs)}`,
        ),
);
shell(
    "pages/how-it-works.html",
    "An easier way from here to home",
    () =>
        pageHero(
            "An easier way from here to home",
            "One clear journey, from your first question to your final unpacked box.",
            "How it works",
        ) +
        section(
            `${heading("A plan you can follow", "Your move, made manageable.", "", true)}${steps()}`,
        ) +
        section(
            `<div class="split">${image("planning", "Moving checklist and home plan on an oak desk", "feature-image")}<div>${heading("01 · Book & plan", "The best moves start<br>with a good conversation.")}<p>Tell us about your home, your route and the things that matter most. A room-by-room inventory and an access check give your plan a solid foundation.</p><ul class="check-list"><li>Choose a service and preferred date</li><li>Share pickup and delivery access</li><li>Identify fragile and bulky belongings</li></ul>${btn("Start your sample booking", "dashboard/new-booking.html")}</div></div>`,
            "soft",
        ) +
        section(
            `<div class="split"><div>${heading("02 · Pack with care", "A place for everything.<br>Protection for every place.")}<p>Choose the right materials, label boxes by room and keep your first-night essentials together. Organizing before loading makes unpacking a little gentler.</p></div><div class="grid grid-2">${[
                ["01", "Sort & label", "packing-sort-label"],
                ["02", "Wrap & protect", "packing-wrap-protect"],
                ["03", "Check inventory", "packing-inventory-check"],
                ["04", "Load in order", "packing-load-order"],
            ]
                .map(
                    ([n, t, photo]) =>
                        `<article class="panel packing-photo-card">${image(photo, t + " during a carefully organized move", "packing-step-photo")}<div><span class="eyebrow">${n}</span><h3>${t}</h3></div></article>`,
                )
                .join("")}</div></div>`,
        ) +
        section(
            `<div class="split"><div>${heading("03 · Transport & track", "Stay in the know,<br>all along the way.")}<p>View your booking’s sample progress in the dashboard. Your move shows confirmed, crew assigned, packing, in transit and delivered milestones.</p>${btn("Explore move tracking", "dashboard/move-tracking.html", "btn-outline")}</div><div class="panel">${timeline()}</div></div>`,
            "soft",
        ) +
        section(
            `<div class="cta"><span class="eyebrow">04 · Settle in</span><h2>Welcome to your next chapter.</h2><p>A final inventory check, the essentials in place and a little room to breathe. Plan your next move with care.</p><div class="actions" style="margin-top:25px">${btn("Let’s get started", "pages/contact.html", "btn-light")}</div></div>`,
        ),
);
shell(
    "pages/service-areas.html",
    "A little closer to your next home",
    () =>
        pageHero(
            "A little closer to your next home",
            "Explore a fictional service network connecting neighbourhoods, cities and new beginnings.",
            "Where we move",
        ) +
        section(
            `<div class="split"><div>${heading("A considered network", "Across the street.<br>Across the country.")}<p>The MoveNest sample network illustrates local and intercity moving services across major Indian cities. Always confirm a real provider’s route and schedule before booking.</p><span class="badge">Illustrative coverage · Not live availability</span></div><div class="google-map-panel"><iframe title="Google Maps service area map of India" src="https://maps.google.com/maps?q=India&amp;z=5&amp;output=embed" loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade"></iframe><a class="map-app-link" href="https://www.google.com/maps/search/?api=1&amp;query=India" target="_blank" rel="noopener">Open in Google Maps ${icon("arrow")}</a></div></div>`,
        ) +
        section(
            `${heading("Places for new beginnings", "Find your next city.")}<div class="grid grid-3">${cities.map((c) => `<article class="panel"><span class="round-icon">${icon("pin")}</span><h3>${c}</h3><p>Sample local shifting and intercity connections. Route confirmation required.</p><a class="text-link" href="#availability">Check your route ${icon("arrow")}</a></article>`).join("")}</div>`,
            "soft",
        ) +
        section(
            `<div class="grid grid-2"><article class="panel">${heading("Near", "A move within your city.")}<p>A familiar route deserves the same thoughtful planning. Consider building access, parking and your preferred time window.</p></article><article class="panel">${heading("Far", "A move to somewhere new.")}<p>Longer journeys need a detailed inventory, transit planning and clear delivery expectations. Leave a little room for the unexpected.</p></article></div>`,
        ) +
        section(
            `<div class="split" id="availability"><div>${heading("Explore your route", "Let’s see where you’re going.")}<p>This checker looks up sample cities only. It does not query a live dispatch or booking system.</p></div><form class="panel" id="availability-form"><div class="form-grid">${field("Pickup city", "pickup-city", "text", "Bengaluru")}${field("Delivery city", "delivery-city", "text", "Pune")}</div><button class="btn" type="submit" style="margin-top:22px">Check sample coverage</button><p class="form-message" role="status"></p></form></div>`,
            "soft",
        ) +
        cta("Wherever comes next, start with a plan."),
);
shell(
    "pages/blog.html",
    "A little know-how for the road ahead",
    () =>
        pageHero(
            "A little know-how for the road ahead",
            "Practical packing tips, thoughtful checklists and a calmer approach to your next move.",
            "The moving journal",
        ) +
        section(
            `<div class="split">${image("blog-feature", "Organized moving boxes in a sunlit apartment", "coverage-image")}<div><span class="eyebrow">The editor’s pick · Planning</span><h2>A fresh start begins<br>before moving day.</h2><p>How to turn a long list of tasks into a clear, comfortable plan for your next chapter.</p>${btn("Read the checklist", "pages/blog-details.html?article=moving-day", "btn-outline")}</div></div>`,
        ) +
        section(
            `<div class="filter-row" aria-label="Article categories">${["All", "Packing", "Planning", "Moving tips"].map((c, i) => `<a class="filter-btn ${i === 0 ? "active" : ""}" href="${href("pages/blog.html?category=" + encodeURIComponent(c.toLowerCase()) + "#article-grid")}" data-blog-filter="${c}" aria-pressed="${i === 0}">${c}</a>`).join("")}</div>`,
            "soft",
        ) +
        section(
            `${articleCards(false, true)}<div class="pagination" id="blog-pagination"><button class="active" aria-label="Current page 1">1</button></div>`,
        ) +
        newsletter(),
);
shell(
    "pages/blog-details.html",
    "A little extra care for your fragile favourites",
    () =>
        pageHero(
            "<span data-article-title>A little extra care for your fragile favourites</span>",
            "A practical guide to giving your most delicate belongings a safer journey.",
            "The moving journal · 8 min read",
        ) +
        section(
            image("article", "Homeowner labeling a carefully packed moving box", "feature-image"),
        ) +
        section(
            `<div class="article-layout"><article class="article-body" id="article-content"><p>Some belongings are more than objects. They’re the mugs from slow Sunday mornings, the vase from a favourite trip, the plates that always make it to the family table. Give those things a little extra time before moving day.</p><h2>Start with a thoughtful sort</h2><p>Set fragile pieces aside before packing the rest of the room. Check their condition, measure unusually shaped items and decide what needs its own box.</p><h2>Choose the right materials</h2><ul><li>Strong double-wall boxes in manageable sizes</li><li>Clean packing paper and honeycomb wrap</li><li>Cardboard dividers for glasses and cups</li><li>Paper tape and a clearly readable marker</li></ul><blockquote>Good packing fills the empty space around your belongings, while keeping pressure off the belongings themselves.</blockquote><h2>Wrap each item separately</h2><p>Cushion the bottom of your box. Wrap each piece on its own and separate hard surfaces. Plates travel best on their edges with padding between them. Avoid making a single box too heavy to handle comfortably.</p><h2>Label for a gentler arrival</h2><p>Write the destination room, a short contents list and a visible fragile note on at least two sides. Keep a quick inventory so unpacking becomes a simple room-by-room process.</p><h2>A final check before you close</h2><p>Fill gaps with paper so items stay still. Close the lid without force, tape the seams and keep valuable personal documents with you. Ask your moving provider about specialist packing for artwork, mirrors and unusual items.</p></article><aside class="panel sticky"><span class="eyebrow">Your next step</span><h3>Make room for a little help.</h3><p>Explore a practical estimate for your next move.</p>${btn("Calculate an estimate", "pages/pricing.html")}<hr style="border:0;border-top:1px solid var(--border);margin:25px 0"><a class="text-link" href="${href("pages/blog.html")}">Back to the journal ${icon("arrow")}</a></aside></div>`,
        ) +
        section(
            `${heading("More for your next chapter", "A little more reading.")}${articleCards(false)}`,
            "soft",
        ) +
        newsletter(),
);
shell(
    "pages/contact.html",
    "Let’s talk about your next chapter",
    () =>
        pageHero(
            "Let’s talk about your next chapter",
            "A few details are all it takes to begin. Share your plans and explore how a thoughtful moving service could help.",
            "We’re here to listen",
        ) +
        section(
            `<div class="grid grid-3">${[
                ["phone", "Give us a call", "+91 80000 00000", "Fictional sample phone"],
                [
                    "mail",
                    "Write us a note",
                    "hello@movenest.example",
                    "Sample address · No email delivery",
                ],
                ["pin", "Come say hello", "24 Greenway Avenue", "Bengaluru · Fictional address"],
            ]
                .map(
                    ([ic, t, d, n]) =>
                        `<article class="panel"><span class="round-icon">${icon(ic)}</span><h3>${t}</h3><p>${d}<br><small>${n}</small></p></article>`,
                )
                .join("")}</div>`,
        ) +
        section(
            `<div class="split contact-inquiry-layout"><div class="contact-inquiry-intro">${heading("Start with a conversation", "Tell us what’s<br>on the move.")}<p>Fill out the form to see a validated front-end inquiry flow. Your message is saved locally for the admin sample, and no external message is sent.</p><div class="feature-item">${icon("shield")}<p class="small">Use fictional information when exploring this website.</p></div><figure class="contact-advisor-photo">${image("contact-move-advisor", "Moving advisor ready to discuss your plans")}</figure></div><form class="panel form-grid" data-form="contact">${field("Your name", "name", "text", "Ananya Rao")}${field("Email address", "email", "email", "you@example.com")}${field("Phone number", "phone", "tel", "+91 …")}${selectField(
                "I’m interested in",
                "service",
                services.map((s) => s[0]),
            )}${field("Pickup city", "pickup", "text", "Bengaluru")}${field("Delivery city", "delivery", "text", "Pune")}<div class="full"><label for="message">A little about your move</label><textarea id="message" name="message" required placeholder="Dates, home size and anything that needs a little extra care…"></textarea></div><label class="checkbox full"><input type="checkbox" required> I understand this is a local front-end sample.</label><button type="submit" class="btn full">Save sample inquiry ${icon("arrow")}</button><p class="form-message full" role="status"></p></form></div>`,
            "soft",
        ) +
        section(
            `<div class="location-map"><div class="location-map-heading"><div><span class="eyebrow">Explore the city</span><h2>Bengaluru, India</h2><p>City map for planning your route.</p></div><a class="btn btn-outline" href="https://www.google.com/maps/search/?api=1&amp;query=Bengaluru%2CIndia" target="_blank" rel="noopener">Open in Google Maps ${icon("arrow")}</a></div><iframe title="Google Maps interactive map of Bengaluru, India" src="https://maps.google.com/maps?q=Bengaluru%2CIndia&amp;z=12&amp;output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>`,
        ) +
        section(
            `<div class="grid grid-2"><article class="panel"><h3>A good time to talk</h3><p>Monday–Saturday · 9:00 AM–7:00 PM IST<br>Sunday · By prior arrangement</p><small>Illustrative business hours for this website.</small></article><article class="panel"><h3>Already planning a sample move?</h3><p>View your booking details and progress from your customer space.</p>${btn("Open customer dashboard", "dashboard/customer-dashboard.html", "btn-outline")}</article></div>`,
            "soft",
        ) +
        section(
            `${faqLayout("A little clarity before you begin", "Your questions, thoughtfully answered.", design.contactFaqs)}`,
        ),
);
for (const type of ["login", "register", "forgot-password"])
    shell(
        "pages/" + type + ".html",
        type === "login"
            ? "Welcome back"
            : type === "register"
              ? "A fresh start begins here"
              : "Let’s get you back home",
        () =>
            `<section class="auth-layout"><div class="auth-art">${image(type === "forgot-password" ? "recovery" : type, type === "login" ? "Warm new home with moving boxes" : type === "register" ? "New house keys on a packing box" : "Cozy unpacked reading corner", "", true)}<div class="auth-copy"><span class="eyebrow" style="color:#d5e5cd">A little care. A better beginning.</span><h2>There’s a good move<br>ahead of you.</h2><p>Make space for your next chapter.</p></div></div><div class="auth-form">${brand()}<span class="eyebrow">Your MoveNest space</span><h1>${type === "login" ? "Welcome back." : type === "register" ? "Here’s to a fresh start." : "Find your way back."}</h1><p>${type === "login" ? "Your plans, bookings and next beginnings." : type === "register" ? "Create a profile to organize your next move." : "Enter your email to explore the recovery sample."}</p><form id="auth-form" data-auth="${type}">${type === "register" ? field("Full name", "name", "text", "Your name") : ""}${field("Email address", "email", "email", "you@example.com")}${type !== "forgot-password" ? `<div><label for="password">Password</label><div class="password-wrap"><input id="password" name="password" type="password" placeholder="Enter at least 8 characters" required minlength="8" autocomplete="${type === "login" ? "current-password" : "new-password"}"><button type="button" class="password-toggle" aria-label="Show password">Show</button></div></div>` : ""}${type === "register" ? `<label class="checkbox"><input type="checkbox" required> I understand this is a browser-local sample.</label>` : ""}${type === "login" ? selectField("Explore as", "role", ["Customer", "Admin"]) : ""}<button class="btn" type="submit">${type === "login" ? "Open dashboard" : type === "register" ? "Create profile" : "Show recovery guidance"} ${icon("arrow")}</button><p class="form-message" role="status"></p></form><p class="form-note">${type === "login" ? `New here? <a class="text-link" href="register.html">Create a profile</a><br><a href="forgot-password.html">Forgot your password?</a>` : `<a class="text-link" href="login.html">Back to login</a>`}</p><p class="demo-note">Any valid email and 8+ character password work. Passwords are never stored. Real authentication requires a secure backend.</p><a class="auth-home-link" href="${href("pages/home-1.html")}">Back to home ${icon("arrow")}</a></div></section>`,
        { auth: true },
    );
shell(
    "pages/404.html",
    "A small detour",
    () =>
        `<section class="special-page standalone-special"><div class="site-container">${brand()}<span class="eyebrow">A little off the route</span><h1>404</h1><h2>Let’s get you back home.</h2><p>We couldn’t find that page. A fresh start is just a click away.</p><div class="actions">${btn("Back to home", "pages/home-1.html")}${btn("Explore services", "pages/services.html", "btn-outline")}</div></div></section>`,
    { auth: true },
);
shell(
    "pages/coming-soon.html",
    "Something good is on the move",
    () =>
        `<section class="special-page standalone-special"><div class="site-container">${brand()}<span class="round-icon">${icon("home")}</span><span class="eyebrow">A new beginning is on its way</span><h1 style="font-size:clamp(38px,5vw,64px)">Good things<br>are moving in.</h1><p>We’re making room for something special. Explore a sample launch countdown and save your interest locally.</p><div class="countdown" data-countdown aria-label="Sample launch countdown"></div><form data-form="launch" style="max-width:470px;margin:auto"><label for="launch-email">Email address</label><div class="actions"><input id="launch-email" name="email" type="email" required placeholder="you@example.com" style="flex:1;min-width:130px"><button class="btn" type="submit">Keep me posted</button></div><p class="form-message" role="status"></p><p class="form-note">Sample only. No email will be sent.</p></form><a class="auth-home-link" href="${href("pages/home-1.html")}">Back to home ${icon("arrow")}</a></div></section>`,
    { auth: true },
);

// Dashboard documents use functional application layouts rather than marketing sections.
const customerNav = [
    ["Overview", "customer-dashboard", "home"],
    ["New booking", "new-booking", "box"],
    ["My bookings", "my-bookings", "file"],
    ["Move tracking", "move-tracking", "truck"],
    ["Invoices", "invoices", "file"],
    ["Profile & settings", "customer-profile", "settings"],
];
const adminNav = [
    ["Overview", "admin-dashboard", "chart"],
    ["Bookings", "admin-bookings", "box"],
    ["Customers", "admin-customers", "people"],
    ["Crew & schedules", "admin-crew", "truck"],
    ["Invoices", "admin-invoices", "file"],
    ["Messages", "admin-messages", "mail"],
    ["Reports", "admin-reports", "chart"],
    ["Settings", "admin-settings", "settings"],
];
function dash(file, title, content) {
    const admin = file.startsWith("admin-");
    shell(
        "dashboard/" + file + ".html",
        title,
        () =>
            `<div class="dashboard-shell" data-dashboard="${admin ? "admin" : "customer"}"><aside class="dashboard-sidebar" id="dash-sidebar">${brand()}<span class="sidebar-label">${admin ? "Workspace" : "Your moving space"}</span><nav aria-label="${admin ? "Admin" : "Customer"} navigation">${(admin ? adminNav : customerNav).map(([t, p, ic]) => `<a class="${file === p ? "active" : ""}" href="${p}.html">${icon(ic)}${t}</a>`).join("")}</nav><div class="sidebar-bottom"><div class="panel"><span class="round-icon">${icon("headset")}</span><h4>A little help?</h4><p>Your next step starts with a conversation.</p><a class="text-link" href="../pages/contact.html">Contact support ${icon("arrow")}</a></div><a class="sidebar-exit" href="../pages/login.html" data-logout>${icon("logout")} Sign out</a><a class="sidebar-exit" href="${admin ? "customer-dashboard" : "admin-dashboard"}.html">${icon("people")} ${admin ? "Customer" : "Admin"} sample</a></div></aside><div class="dashboard-content"><header class="dashboard-topbar"><div class="actions"><button class="icon-btn sidebar-toggle" aria-label="Toggle sidebar" aria-controls="dash-sidebar" aria-expanded="false">${icon("menu")}</button><span class="small">Workspace <span class="muted">/</span> ${title}</span></div><div class="actions">${appearanceControls()}<button class="icon-btn" data-notifications aria-label="Show notifications">${icon("bell")}</button><span class="avatar">${admin ? "AD" : "AR"}</span></div></header><div class="dashboard-main"><div class="dashboard-heading"><div><span class="eyebrow">${admin ? "MoveNest workspace" : "Your next chapter"}</span><h1>${title}</h1><p>${admin ? "A thoughtful overview of your moving business." : "A little clarity for every step of your move."}</p></div>${btn(admin ? "View bookings" : "Book a move", admin ? "dashboard/admin-bookings.html" : "dashboard/new-booking.html")}</div>${content()}<p class="dashboard-disclaimer">Fictional data · Browser-local front-end sample · No live dispatch, authentication or payments.</p></div></div></div><dialog id="detail-dialog" aria-labelledby="dialog-title"><div class="dialog-head"><h2 id="dialog-title">Booking details</h2><button class="icon-btn" data-close-dialog aria-label="Close dialog">${icon("close")}</button></div><div id="dialog-body"></div></dialog>`,
        { dashboard: true },
    );
}
const kpis = (admin) => `<div class="kpi-grid ${admin ? "six" : ""}" id="kpis"></div>`;
const chartPanel = (title, id, type = "line") =>
    `<article class="panel chart-card"><div class="chart-heading"><h3>${title}</h3><span class="small">Sample data</span></div><div class="chart-wrap"><canvas id="${id}" data-chart="${type}" role="img" aria-label="${title}"></canvas></div></article>`;
const bookTable = (admin = false) =>
    `<section class="panel"><div class="panel-heading"><div><h2>${admin ? "Manage bookings" : "Your bookings"}</h2><p class="small">All the details, in one place.</p></div><button class="filter-btn" data-export="bookings">Export CSV</button></div><div class="table-controls"><div><label for="booking-search">Search bookings</label><input type="search" id="booking-search" placeholder="Booking ID, customer or city…"></div><div><label for="booking-status">Status</label><select id="booking-status"><option value="">All statuses</option>${["Pending", "Confirmed", "Crew Assigned", "Packing", "In Transit", "Delivered", "Cancelled"].map((s) => `<option>${s}</option>`).join("")}</select></div><div><label for="booking-sort">Sort</label><select id="booking-sort"><option value="date-desc">Newest first</option><option value="date-asc">Oldest first</option><option value="amount-desc">Highest estimate</option></select></div></div><div class="table-scroll"><table class="data-table"><thead><tr>${["Booking", "Customer / route", "Date", "Estimate", "Status", "Action"].map((t) => `<th scope="col">${t}</th>`).join("")}</tr></thead><tbody id="bookings-body"></tbody></table></div><div class="pagination" id="booking-pagination"></div></section>`;
dash(
    "customer-dashboard",
    "Welcome back, Ananya",
    () =>
        kpis(false) +
        `<div class="dashboard-grid"><section class="panel"><div class="panel-heading"><h2>Your active move</h2><a class="text-link" href="move-tracking.html">View tracking ${icon("arrow")}</a></div><div id="active-move"></div></section>${chartPanel("Your booking activity", "customer-activity", "bar")}</div><div class="dashboard-grid customer-analytics">${chartPanel("Your move status", "customer-status", "doughnut")}${chartPanel("Your payment overview", "customer-payments", "bar")}</div><div class="quick-actions">${[
            ["New booking", "new-booking", "box"],
            ["Track a move", "move-tracking", "truck"],
            ["View invoices", "invoices", "file"],
            ["Contact support", "../pages/contact", "phone"],
        ]
            .map(
                ([t, p, ic]) =>
                    `<a class="panel" href="${p}.html">${icon(ic)}<span>${t}</span>${icon("arrow")}</a>`,
            )
            .join("")}</div>${bookTable()}`,
);
dash("my-bookings", "My bookings", () => kpis(false) + bookTable());
dash(
    "new-booking",
    "Plan a new move",
    () =>
        `<section class="panel booking-panel"><div class="booking-progress" aria-label="Booking steps">${["Service", "Addresses", "Inventory", "Schedule", "Review"].map((s, i) => `<span data-step-label="${i}" class="${i === 0 ? "active" : ""}"><b>${i + 1}</b>${s}</span>`).join("")}</div><form id="booking-form"><fieldset data-step="0"><legend>What’s on the move?</legend><p>Choose the kind of help you need.</p><div class="grid grid-2">${services.map(([t, d, , ic, key], i) => `<label class="service-option"><input type="radio" name="service" value="${key}" ${i === 0 ? "checked" : ""}>${icon(ic)}<span><strong>${t}</strong><small>${d}</small></span></label>`).join("")}</div></fieldset><fieldset data-step="1" hidden><legend>From here to your next chapter.</legend><div class="form-grid">${field("Pickup address", "pickup", "text", "Street, area, city")}${field("Delivery address", "delivery", "text", "Street, area, city")}${field("Approximate distance (km)", "distance", "number", "", true, 20)}${field("Pickup floor", "floor", "number", "", true, 0)}${selectField("Elevator available?", "elevator", ["Yes", "No"])}${field("Contact phone", "phone", "tel", "+91 …")}</div></fieldset><fieldset data-step="2" hidden><legend>Make room for everything.</legend><div class="form-grid">${selectField("Home size", "size", ["Studio / 1 BHK", "2–3 BHK", "Large home / villa"])}${field("Approximate number of boxes", "boxes", "number", "", true, 20)}<div class="full"><label for="inventory">Furniture & special belongings</label><textarea id="inventory" name="inventory" required placeholder="Sofa, dining table, fragile artwork…"></textarea></div></div></fieldset><fieldset data-step="3" hidden><legend>A date for your fresh start.</legend><div class="form-grid">${field("Preferred moving date", "date", "date")}${selectField("Preferred time window", "time", ["Morning · 8 AM–12 PM", "Afternoon · 12 PM–4 PM"])}${selectField("Packing requirements", "packing", ["Standard packing", "Premium protection", "No packing"])}${selectField("Additional services", "extras", ["None", "Unpacking", "Furniture assembly", "Both"])}<div class="full"><label for="notes">Anything else we should know?</label><textarea id="notes" name="notes" placeholder="Access restrictions, parking or a little extra care…"></textarea></div></div></fieldset><fieldset data-step="4" hidden><legend>A little check before you go.</legend><div id="booking-review"></div><label class="checkbox"><input type="checkbox" name="consent" required> I understand this is an illustrative local booking, not a confirmed service.</label></fieldset><div class="booking-actions"><button type="button" class="btn btn-outline" id="booking-prev" disabled>Previous</button><span class="small" id="step-counter">Step 1 of 5</span><button type="button" class="btn" id="booking-next">Continue ${icon("arrow")}</button></div><p class="form-message" role="status"></p></form></section>`,
);
dash(
    "move-tracking",
    "Your move, step by step",
    () =>
        `<section class="panel"><div class="panel-heading"><div><h2>A clear view of the journey.</h2><p>Milestones update from the shared local sample store.</p></div><div><label for="tracking-select">Choose a booking</label><select id="tracking-select"></select></div></div><div id="tracking-content"></div></section>`,
);
const invoices = (admin) =>
    `<div id="invoice-summary" class="kpi-grid"></div><section class="panel"><div class="panel-heading"><h2>${admin ? "All invoices" : "Your invoices"}</h2><button class="filter-btn" data-export="invoices">Export CSV</button></div><div class="table-controls"><div><label for="invoice-search">Search invoices</label><input id="invoice-search" type="search" placeholder="Invoice or booking ID"></div><div><label for="invoice-filter">Payment status</label><select id="invoice-filter"><option value="">All statuses</option><option>Paid</option><option>Unpaid</option></select></div></div><div class="table-scroll"><table class="data-table"><thead><tr>${["Invoice / booking", "Customer", "Date", "Total", "Payment", "Action"].map((t) => `<th scope="col">${t}</th>`).join("")}</tr></thead><tbody id="invoices-body"></tbody></table></div></section><section id="invoice-detail" class="panel" hidden></section>`;
dash("invoices", "Invoices & payments", () => invoices(false));
function profileForm(admin = false) {
    return `<form class="panel" id="${admin ? "settings" : "profile"}-form"><div class="panel-heading"><div><h2>${admin ? "Business profile" : "A little about you"}</h2><p class="small">Saved only in this browser.</p></div><button class="btn" type="submit">Save changes</button></div><div class="form-grid">${field(admin ? "Business name" : "Full name", "name", "text", "", true, admin ? "MoveNest" : "Ananya Rao")}${field("Email address", "email", "email", "", true, admin ? "hello@movenest.example" : "ananya@example.com")}${field("Phone number", "phone", "tel", "", false, "+91 80000 00000")}${field(admin ? "Business address" : "Saved pickup address", "address", "text", "", false, "24 Greenway Avenue, Bengaluru")}${selectField("Theme preference", "theme", ["System preference", "Light", "Dark"])}<div><label class="checkbox"><input name="notifications" type="checkbox" checked> Enable sample notifications</label><label class="checkbox"><input name="updates" type="checkbox" checked> Moving updates</label></div></div>${admin ? `<hr class="divider"><h3>Configurable sample pricing</h3><div class="form-grid">${field("Studio base (₹)", "base0", "number", "", true, 3000)}${field("2–3 BHK base (₹)", "base1", "number", "", true, 6000)}${field("Villa base (₹)", "base2", "number", "", true, 11000)}${field("Distance rate (₹ / km)", "distanceRate", "number", "", true, 25)}</div>` : ""}<p class="form-message" role="status"></p></form>`;
}
dash(
    "customer-profile",
    "Your profile & preferences",
    () =>
        profileForm() +
        `<section class="panel"><h2>Password settings</h2><p>Explore validation only. No password is stored or changed.</p><form data-form="password" class="form-grid">${field("New password", "new-password", "password")}${field("Confirm new password", "confirm-password", "password")}<button class="btn" type="submit">Validate sample password</button><p class="form-message full" role="status"></p></form></section><section class="panel"><h3>A fresh sample start</h3><p>Reset bookings, settings and messages to their original fictional values.</p><button class="btn btn-outline" data-reset>Reset sample data</button></section>`,
);
dash(
    "admin-dashboard",
    "A clear view of your business",
    () =>
        kpis(true) +
        `<div class="dashboard-grid">${chartPanel("Revenue overview", "revenue")}${chartPanel("Booking performance", "performance", "bar")}${chartPanel("Service distribution", "distribution", "doughnut")}${chartPanel("Booking status", "status-chart", "bar")}</div>${bookTable(true)}<div class="dashboard-grid"><section class="panel"><h2>Customer activity</h2><div id="recent-customers"></div></section><section class="panel"><h2>Crew assignments</h2><div id="recent-crew"></div></section><section class="panel"><h2>Pending invoices</h2><div id="pending-invoices"></div></section></div>`,
);
dash("admin-bookings", "Bookings, thoughtfully managed", () => kpis(true) + bookTable(true));
dash(
    "admin-customers",
    "Your customer community",
    () =>
        `<section class="panel"><div class="panel-heading"><h2>Customer directory</h2><button class="filter-btn" data-export="customers">Export CSV</button></div><label for="customer-search">Find a customer</label><input id="customer-search" type="search" placeholder="Name, email or city"><div class="table-scroll"><table class="data-table"><thead><tr>${["Customer", "Email", "City", "Bookings", "Action"].map((t) => `<th scope="col">${t}</th>`).join("")}</tr></thead><tbody id="customers-body"></tbody></table></div></section>`,
);
dash(
    "admin-crew",
    "Good people. Well-planned moves.",
    () =>
        `<div id="crew-directory" class="grid grid-3"></div><section class="panel"><h2>Assign a moving crew</h2><form id="crew-form" class="form-grid"><div><label for="crew-booking">Booking</label><select id="crew-booking" name="booking"></select></div><div><label for="crew-choice">Crew</label><select id="crew-choice" name="crew"></select></div><button class="btn" type="submit">Save assignment</button><p class="form-message full" role="status"></p></form></section><section class="panel"><h2>Upcoming crew schedule</h2><div class="table-scroll"><table class="data-table"><thead><tr><th>Booking</th><th>Date</th><th>Crew</th><th>Route</th></tr></thead><tbody id="crew-schedule"></tbody></table></div></section>`,
);
dash("admin-invoices", "Invoices & payment records", () => invoices(true));
dash(
    "admin-messages",
    "Every conversation matters",
    () =>
        `<section class="panel"><div class="panel-heading"><h2>Customer inquiries</h2><span class="badge" id="unread-count"></span></div><label for="message-search">Search inquiries</label><input id="message-search" type="search" placeholder="Name or message"><div class="messages-layout"><div id="message-list"></div><article id="message-detail" class="message-detail"><p>Select a conversation to read it.</p></article></div></section>`,
);
dash(
    "admin-reports",
    "Insights for the road ahead",
    () =>
        `<section class="panel"><form id="report-filter" class="form-grid">${field("From date", "from", "date", "", true, "2026-01-01")}${field("To date", "to", "date", "", true, "2026-12-31")}<button class="btn" type="submit">Update report</button><button type="button" class="btn btn-outline" data-export="report">Export filtered CSV</button><p class="form-message full" role="status"></p></form></section><div id="report-summary" class="kpi-grid"></div><div class="dashboard-grid">${chartPanel("Revenue by month", "revenue")}${chartPanel("Booking trends", "performance", "bar")}${chartPanel("Service distribution", "distribution", "doughnut")}${chartPanel("Booking status", "status-chart", "bar")}</div>`,
);
dash(
    "admin-settings",
    "Your workspace, your way",
    () =>
        profileForm(true) +
        `<section class="panel"><h2>Sample data controls</h2><p>Return the local sample to its starting state. This removes locally created bookings, profile changes and messages.</p><button class="btn btn-outline" data-reset>Reset sample data</button><p class="form-note">Real business settings require authenticated server-side storage.</p></section>`,
);
shell("documentation/index.html", "MoveNest guide", () =>
    require("./documentation-page.cjs")({ section, href, icon }),
);
write(
    "sitemap.xml",
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
        [
            ...fs
                .readdirSync(path.join(root, "pages"))
                .filter((x) => x.endsWith(".html"))
                .map((x) => "pages/" + x),
        ]
            .map((p) => "  <url><loc>https://movenest.example/" + p + "</loc></url>")
            .join("\n") +
        "\n</urlset>",
);
write(
    "robots.txt",
    "User-agent: *\nAllow: /\nDisallow: /dashboard/\nSitemap: https://movenest.example/sitemap.xml\n",
);
console.log("Built all 30 MoveNest HTML pages.");

write(
    "index.html",
    `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>MoveNest</title><meta http-equiv="refresh" content="0;url=pages/home-1.html"><link rel="canonical" href="https://movenest.example/pages/home-1.html"><script>location.replace("pages/home-1.html" + location.search + location.hash);</script></head><body><p><a href="pages/home-1.html">Open MoveNest Homepage 1</a></p></body></html>
`,
);

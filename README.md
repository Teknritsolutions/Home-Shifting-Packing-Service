# MoveNest — Premium Packing & Relocation

A complete, buildless HTML5 site with 30 core pages and a styled documentation guide, including two homepages, public service pages, customer tools and an admin workspace. Built in the existing project folder with Bootstrap 5, CSS, vanilla JavaScript and Chart.js. No SPA framework.

## Run locally

With Node.js installed, run:

```powershell
npm start
```

Open **http://127.0.0.1:4173**. The delivered HTML works without a build step or internet connection. Use an HTTP server for consistent browser storage and font loading. Stop the server with Ctrl+C.

## Explore

- Home 1: `index.html` — split hero and ten content sections.
- Home 2: `home-2.html` — editorial hero, quote bar and ten different sections.
- Customer: `dashboard/customer-dashboard.html`.
- Admin: `dashboard/admin-dashboard.html`.
- Login: `pages/login.html` — any valid email and at least eight password characters; choose a demo role.
- Full page list: [documentation/page-structure.md](documentation/page-structure.md).
- Functional and responsive verification: [documentation/qa-report.md](documentation/qa-report.md).

## Included

Persistent light/dark themes, RTL switch, keyboard-friendly navigation, cost calculator with itemized estimate, five-step booking, shared booking status, tracking timeline, invoice print layout, customer search/history, crew assignment with same-day conflict check, inquiry inbox with unread state, date-filtered reports, Chart.js visualizations, CSV export, profile/business settings, configurable demo rates, reset action, category filters and local checklist download.

All data is fictional. Bookings, inquiries, profiles, settings and payment markers persist **only in the current browser and origin**. Admin and customer pages deliberately remain directly accessible as template demos. Passwords are never stored. There is no production authentication, message delivery, payment processing, GPS tracking or backend.

## Assets and editing

87 original AI-generated photographs are optimized to local WebP files: 80 static assets and 7 service/article variant assets. Each content photograph has one placement, including nine distinct customer portraits. Fonts, Bootstrap and Chart.js are local. The custom folded-roof/nest monogram has readable header/footer wordmarks, dark variants, favicons and touch-icon versions. See the image manifest and credits for sources and dependencies.

Edit the delivered HTML directly, or edit `scripts/build.cjs` and run `npm run build` to regenerate shared layouts. Regeneration overwrites the 30 core pages and documentation guide, so choose one editing approach. Core styles are in `assets/css/`; behavior is separated into `assets/js/` files. All pages use the same container, typography and theme variables.

The premium revision is defined in `scripts/premium-design.cjs` and `assets/css/premium.css`: photographic page heroes and process steps, page-specific closing sections, neutral controls with green hover states, consistent paragraph sizing, branded form pickers and readable dark surfaces. Desktop navigation opens on hover; touch and keyboard controls use the same real page links. Active destinations receive underlines.

The readability revision in `assets/css/readability.css` keeps body text at 16px on all devices and enlarges captions, chart labels, navigation and footer links. Dashboard destinations are grouped in the main header. Documentation is available directly at `documentation/index.html`. The theme control shows the action's sun/moon icon; the adjacent RTL/LTR control updates and persists the reading direction.

## Developer checks

```powershell
npm install
npm test
```

The QA script expects `npm start` to be running on port 4173 and uses an installed Chromium browser. Set `MOVENEST_BROWSER` to a Chrome/Chromium executable if it differs from the development machine, or install the Playwright browser with `npx playwright install chromium`. Browser testing may require OS execution permission. See the QA report for the actual checks performed.

Before publishing, replace fictional company content, prices, metadata domain (`movenest.example`), contact details, and demo claims. Integrate secure server-side services for real operations. This project has been created locally; it has not been published.

Homepage entry points: `pages/home-1.html` and `pages/home-2.html`. The root `index.html` redirects to Homepage 1 and preserves query parameters and the URL fragment. The generator maintains these paths and the sitemap.

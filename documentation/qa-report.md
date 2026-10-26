# MoveNest quality assurance report

Date: October 21, 2026

## Delivered inventory

- 31 independent HTML documents: 16 public, 6 customer and 8 admin core pages, plus a styled documentation guide.
- Two distinct homepages with exactly 10 main sections each.
- Seven public content pages with 6 main sections each; blog and article pages with 5 each.
- 87 original AI-generated photographs, locally optimized to WebP, approximately 11.60 MiB combined, including nine distinct customer portraits. Every content photograph has one placement.
- Local Inter and Manrope fonts, Bootstrap 5.3.3, Chart.js 4.4.7, SVG brand variants, SVG/PNG favicon and Apple touch icon.
- Shared demo data, editable settings and documentation with dependency licenses.

The exact page inventory is in `page-structure.md`; all photographic placements are in `image-manifest.md`.

## Browser and responsive verification

Actual rendered pages were tested in headless Chromium on Windows using Playwright. All 31 pages were checked at:

**320, 360, 375, 390, 420, 480, 576, 768, 820, 1024, 1280, 1440 and 1920 px.**

Each width was checked in light/LTR, dark/LTR, light/RTL and dark/RTL modes: **1,612 responsive checks passed, with zero full-page horizontal overflows.** Table content scrolls within its own container on small screens. Numeric charts retain LTR plotting in RTL layouts.

The final services, contact and article closing-layout revisions received **156 additional checks** at the same 13 widths and four theme/direction combinations. All passed. The final targeted design review also passed hover/touch navigation, all four service routes, all three article routes, matching image loads, neutral picker defaults and descriptive input placeholders.

All visible paragraphs were checked for the common 16px text size at 1440px and 390px in each theme/direction combination, covering 248 page/mode/width audits. Computed text contrast for paragraphs on solid backgrounds passed the 4.5:1 threshold in those audits. Photo-overlay paragraphs were excluded from the computed-background contrast calculation and reviewed visually instead; this is not a full accessibility certification.

Additional checks verified one H1 per document, required section counts, equal card-row boundaries and equal chart-card heights. The browser run reported **zero JavaScript page errors and zero failed local-resource responses**.

The final navigation and readability follow-up passed at all 13 widths. Mobile navigation exposes login, quote and dashboard links; the closed dashboard drawer is hidden from keyboard focus; Escape closes the drawer and restores focus to its toggle. Theme icons change from moon to sun and back, RTL/LTR controls follow them, and both preferences persist across pages. Footer links were verified at 16px and the footer brand description at 13px. The footer contains no dashboard links, direction controls or demo/template label, and its Documentation link opens the styled guide.

Screenshots were visually reviewed for both homepages, pricing, customer and admin dashboards in desktop/mobile layouts, plus overview screenshots for the remaining 25 pages. Dark dashboard screenshots and an image contact sheet were also reviewed. Below-the-fold images were explicitly decoded before screenshot capture so lazy loading did not create misleading blank areas. The five supplied reference URLs loaded successfully in Chromium and their header/hero layouts were inspected.

Revision screenshots additionally cover the desktop Home hover menu, redesigned About page on desktop/mobile, photographic process cards in both themes, dark related-article cards, the office service variant, branded form picker and the final services/contact/article layouts.

## Functional checks passed

- Calculator charge breakdown and arithmetic, including a ₹12,400 example with distance, floor access, premium packing and optional services.
- Estimate transfer into the five-step booking form; required-field validation and review submission; booking persistence.
- A customer-created booking appearing in admin management; admin status change reflected in customer tracking.
- Invoice matching the same booking; print action invocation and print-media rendering.
- Admin demo payment marker persistence, with no real payment processing.
- Crew assignment persistence.
- Admin base-price changes affecting the estimate function.
- Reset controls restoring the original bookings and pricing.
- Inquiry form persisting to the admin inbox; message detail and read state.
- Blog category filtering.
- Demo customer/admin login routing and actual Chart.js instance creation.
- Theme persistence across page navigation and chart redraw after theme changes.
- Mobile navigation opening/closing, dashboard drawer behavior and Escape handling.
- Report date filters and CSV download.

## Asset audit passed

All internal HTML links, scripts, styles, images, favicon files and linked documents resolve to existing files. All photographs have meaningful alt text. There are **60 static photographic assets, 7 query-variant photographs and 67 distinct SHA-256 file hashes**. Testimonial portraits are intentionally reused for the same person's hero-summary avatar; other content photographs remain unique across static sections. No broken text-encoding sequences were detected.

Generated images were visually reviewed for relevance, cropping, watermarks and obvious defects. Content is explicitly fictional, including portraits, reviews, projects, milestones, statistics and coverage. Reusable service/article documents select matching hero photographs for each query variant; the moving-day and company-selection articles also have their own feature images.

## Issues found and corrected

1. Chart canvases could briefly overflow their cards when the viewport changed. Their rendering surface is now bounded by the chart wrapper.
2. Hover transforms remained active under reduced-motion preference and interfered with stable automated booking clicks. Transform movement is now disabled in reduced-motion mode.
3. Bootstrap hover text could reduce contrast on a primary button. Explicit hover text colors now preserve contrast.
4. A generic numeric limit rejected the villa base price in admin settings. Pricing fields now use a suitable upper bound, and the saved-rate integration check passes.
5. Mobile login/quote actions and hidden-drawer keyboard behavior received a final dedicated navigation verification.
6. Bootstrap card text inherited its original dark text color in dark mode. Bootstrap color variables now map to the site's theme, and all card/panel paragraphs receive the shared readable text color.
7. Component-specific paragraph sizes varied across cards and sections. They now use one responsive body-size token, including dashboard notices.
8. The Home menu needed pointer-hover support and a cleaner arrow. Header groups now have real navigation links, separate SVG chevron buttons, hover/touch/keyboard behavior and current-page underlines, including exact service query matching.
9. Plain process steps, repeated closing banners and repeated article newsletter layouts were replaced with photographic process cards, page-specific closing sections, a distinct service catalog and a downloadable reader kit.
10. Branded customizable select pickers now align their chevrons with the selected value. Options remain neutral without hover, and the default selected item is not given a green fill.
11. Small 10–12px captions, reviewer details, chart labels and footer links were increased. The resulting long About-page label now wraps cleanly at 320px.
12. Footer workspace links were moved into the header, and the footer gained a readable brand layout and styled documentation destination. Initials in testimonial circles were replaced with six original portrait assets.
13. The static moon icon was replaced with state-aware sun/moon rendering. The adjacent RTL/LTR action updates its text, accessible label and persisted direction in public and workspace headers.

## Evidence and reproduction

The `test-results/` directory contains `qa-results.json`, `responsive-results.json`, `asset-audit.json`, `navigation-results.json`, `premium-review.json`, `readability-review.json`, reference-review results and screenshots. It is intentionally excluded from Git by default because generated screenshots are large.

Run `npm start` in one terminal, then `npm test` in another. Run `node tests/assets.cjs` for the static asset audit. `node tests/qa.cjs --navigation` checks navigation independently. Configure `MOVENEST_BROWSER` when the installed Chrome/Chromium executable differs; otherwise the test uses the development browser if present or Playwright's default browser.

Run `node tests/qa.cjs --design` for the premium interaction, variant-image, picker and final page-layout checks.

Run `node tests/qa.cjs --readability` for the larger-text, testimonial portraits, footer, documentation navigation and appearance-control checks.

## Verification limits and integration boundaries

No Lighthouse score was measured, and no full automated WCAG certification, screen-reader audit, Firefox or Safari test was performed. The site includes semantic landmarks, labels, visible focus styles, native dialogs, keyboard-operable controls and reduced-motion rules; production accessibility should receive its own formal review.

This is a front-end template with browser-local state. There is no real authentication, server authorization, email delivery, confirmed availability, dispatch/GPS, payment collection or legally valid tax invoicing. Storage does not synchronize between devices. Demo pages remain directly accessible. Real business use requires the backend integrations described in `customization.md`.

The project has been delivered in the requested existing local folder. It has not been published or deployed.

## Pricing imagery and uniqueness checks

- Added an estimate photo that stretches the right column to the calculator form baseline.
- Four pricing factors have distinct photographic backgrounds with readable overlays in both themes.
- Asset audit: 31 documents, 80 static photographs and 7 query-variant photographs; 87 unique paths and 87 unique file hashes, with no repeated content images.
- Pricing verification: 24 viewport/theme/direction combinations passed; calculator result generation passed.

Full-site verification completed: 1,612 responsive checks across 31 pages, with zero failures or browser errors. After compacting the pricing cards and lightening their overlays, all 24 pricing combinations passed again.

Contact and process revision (October 22, 2026): interactive OpenStreetMap rendered with zoom controls; contact columns share a bottom edge; process hero preserves faces; moving-stage checklist rows align. All 20 focused responsive/theme checks and 1,612 full-site checks passed, with zero browser errors. Asset audit confirms 87 unique photographic placements and hashes.

Google Maps and journal navigation revision (October 22, 2026): both Google Maps embeds visually rendered. Category links navigate to persistent URL categories and survive reload; all four category checks passed. Six city cards complete the grid. Blog, service-area and contact pages passed overflow checks at 320, 390, 768 and 1440px.
Category switching now updates immediately with browser history and real fallback links. The 1,612 responsive checks passed; after correcting a category-navigation timing issue, the functional suite passed with zero failures.

Dashboard alignment revision (October 22, 2026): active move uses a vertical connected milestone list; full tracking uses numbered stages and bordered detail rows. Added customer-only status and payment charts from the shared booking store. Chart headroom prevents bars from touching the top; monthly labels and graph/card sizing were verified visually. All 80 targeted responsive/theme/direction checks and the functional suite passed.

Editorial responsive revision (October 22, 2026): article/project metadata and heading rows share baselines on desktop; card collections stack below 1101px to avoid narrow text columns. Care and packing sections retain the complete image frame, with full-width image rows above copy on tablets and phones. Home 2 coordinator and journey photos use top framing, with natural image dimensions at tablet/mobile sizes. All 28 targeted width checks passed and all 87 content photographs remain unique. Chart alignment validation now compares cards within the same visual row.
Final editorial verification: all 1,612 full-site responsive checks and functional checks passed, with zero failures or browser errors.

Collection checklist revision: corresponding checklist entries share grid rows so wrapped text preserves the next row baseline. About story uses the complete image frame and stacks above copy at tablet/mobile widths. All 56 targeted width/theme checks passed; functional checks passed.

Standalone account and drawer revision (October 22, 2026): login, registration and recovery use a shared standalone shell without public header/footer; icon-only theme and direction controls remain at the top-right. Account forms include brand/home links. Public navigation below 1280px opens a full-height side drawer with branded heading, content icons, backdrop, close button, keyboard focus loop, Escape handling and full-width actions. All 60 focused account theme/direction/width checks and navigation checks at 13 widths passed. The asset audit remains at 87 unique photographs.
Final standalone account and drawer verification: all 1,612 full-site responsive checks and functional tests passed, with zero browser errors.

Site-wide image/copy and standalone-page audit (October 22, 2026): image/copy sections now use a full uncropped image row above copy at widths up to 1100px, resolving the services storage-section gap. 404 and coming-soon now use standalone branded cards without public header/footer, with theme/direction controls at the physical top-right. All standalone pages reuse the header direction glyph with the text label visually hidden. All 100 focused width/theme/direction checks passed; both special pages were visually reviewed and the service section stacking was checked at 1024px. Asset audit: 31 documents, 87 unique photographic placements and hashes, zero missing references or duplicates.
Final audit completed: all 1,612 responsive combinations across 31 pages and the functional suite passed with zero failures and zero browser errors.

Homepage directory revision (October 22, 2026): primary homepages now live at pages/home-1.html and pages/home-2.html. Root index.html redirects to Homepage 1 while preserving query and fragment. Shared navigation, branding links, generator page keys, sitemap, documentation breadcrumb and homepage quick-quote redirect use the new paths. Both homepage navigation and root redirect were verified in Chromium; all 1,612 responsive checks and functional checks passed. Asset audit confirms no missing references or duplicated content photos.

# Customization & integration

## Brand, style and layout

- Shared header, footer, content and page-generation logic: `scripts/build.cjs`.
- Main variables, typography and components: `assets/css/style.css`.
- Premium controls, editorial heroes, photographic process cards and closing compositions: `assets/css/premium.css` and `scripts/premium-design.cjs`.
- Larger captions, footer, portrait crops, monogram typography and header controls: `assets/css/readability.css`.
- Responsive breakpoints: `assets/css/responsive.css`.
- Dashboard shell, charts, tables and print rules: `assets/css/dashboard.css`.
- Dark variables and RTL refinements: `dark-mode.css` and `rtl.css`.
- Brand assets: `assets/images/branding/`; regenerate SVGs with `node scripts/branding.cjs`.

Container width is 1240px with 24px desktop gutters and 16px mobile gutters. Spacing uses 96px, 72px and 56px section intervals. Heading font is Manrope, body font is Inter. Fonts are self-hosted. The shared `--body-size` token keeps all paragraphs, including card paragraphs, at 16px across devices. Secondary captions and labels generally use 14px or larger; footer links use 16px, reviewer names 17px and the footer brand description 13px. Metadata and headings retain their own hierarchy.

Change company details in the shared footer and contact page. Replace `movenest.example` in canonical metadata, Open Graph copy, sitemap and robots.txt before release. Metadata intentionally describes an editable demo template; no real certifications, verified ratings or customer claims are supplied.

Services are selected through `service-details.html?service=local`, `intercity`, `packing` or `office`. Article content is selected through `blog-details.html?article=fragile`, `moving-day` or `reliable`. Service variants have matching introduction text, active navigation and hero photographs. Article variants have matching headlines, article content, hero photographs and feature images. Variant-specific image changes live in `assets/js/main.js`.

The header uses real links for Home, Services and every dropdown destination. Desktop pointer hover opens submenus, separate arrow buttons support touch, and ArrowDown/ArrowUp/Escape support keyboard use. `assets/js/navigation.js` matches both pathname and service query to mark the correct destination. Parent sections receive an active underline.

Buttons and category tabs begin with neutral surfaces and receive their green fill on hover. Active navigation is underlined. Form labels, focus rings and supported customizable native select pickers use the theme palette. Select options remain neutral until hovered; browsers without customizable native picker support retain their accessible native controls. Bootstrap body and heading variables are mapped to the site's theme variables to prevent black card text in dark mode.

## Data and behavior

`assets/js/demo-store.js` contains the seed records, store version, safe output escaping, currency formatting and estimate rules. `MoveNest.get()` reads the store; `MoveNest.save(data)` persists it and emits `demo-data-change`. The localStorage key is `movenest-demo-v1`.

Customer C001 is the shared demo account. Its bookings appear in both roles. A booking generates a corresponding invoice view from the same record; its amount is the sum of the stored charge breakdown. Admin payment actions only mark a record; they do not charge a payment method. Dates use local display formatting. Dashboard analytics derive from the demo records. Date filters affect reports and report CSV exports. Monthly revenue counts paid invoices whose move date falls in the current month.

Theme (`movenest-theme`) and direction (`movenest-dir`) persist separately. Theme follows the OS preference when no choice is saved, and chart colors update on theme changes. Public and dashboard headers place the RTL/LTR switch immediately after the theme control. The theme button shows a moon in light mode and a sun in dark mode, with its accessible label naming the next action. Direction labels likewise show the next available direction. Charts retain left-to-right numeric plotting.

Dashboard destinations are in the public header's Dashboards dropdown. Process, coverage and journal links sit under More to preserve readable navigation spacing. The footer omits workspace links, appearance controls and template/demo branding, while retaining a link to the styled documentation guide. Operational limitations remain documented in the guide and relevant forms.

Pricing is editable in admin settings: home-size base rates and distance rate. Packing, access and optional-service rules are in `MoveNest.estimate()`. Estimates exclude taxes and require a real quotation before commercial use.

## Production integration requirements

- Replace simulated login with server-validated identities, secure sessions, password hashing, authorization and CSRF protection.
- Persist bookings, inventory, status changes and invoices in a secured backend with appropriate validation and access rules.
- Connect inquiry and newsletter forms to a real delivery/subscription service with consent handling.
- Obtain real routing, availability and scheduling data before promising service dates.
- Use a payment provider and appropriate tax/invoice rules before accepting payments.
- Add server-side file upload, audit history and notifications only when required by your actual business.

Do not enter real confidential information into this browser-local template demo.

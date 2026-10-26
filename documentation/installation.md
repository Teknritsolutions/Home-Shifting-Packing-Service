# Installation & local preview

1. Keep the project folder structure intact.
2. Install Node.js if it is not available.
3. Open a terminal in this folder and run `npm start`.
4. Visit `http://127.0.0.1:4173`.

No dependency installation or compilation is needed to view the website. All runtime libraries, fonts and images are local. A standard static hosting provider can serve the project. Configure its missing-page handler to use `pages/404.html`; this local preview server returns a plain 404 response for unknown files.

For development tooling, run `npm install`. `npm run build` regenerates all HTML documents from `scripts/build.cjs` and overwrites manual HTML changes. `npm test` runs browser QA against the active preview server.

Use the customer and admin links in the footer to explore both roles. Login accepts any valid email and 8+ character password as an explicitly simulated flow. Registration changes the shared demo customer's profile. No passwords are retained.

Storage is scoped to browser, origin and port. Data entered at a different hostname or port will not appear in the original browser session. Use Admin Settings → Reset demo data to restore the original fictional dataset.

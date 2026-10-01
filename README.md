# FindMyID

A mobile-first Next.js / TypeScript implementation of the 15 Visily screenshots provided in this folder. The original JPGs are preserved. The welcome illustration and profile portrait reuse those references.

## Run

```sh
npm install
npm run dev
```

Open http://localhost:3000. Select **Explore the demo** to open the home screen directly. For the account forms, use a sample email ending in `@st.ug.edu.gh` or `@ug.edu.gh` and a password of at least eight characters. This is a demo session, not real authentication; passwords are neither stored nor checked against an account.

## Included

At 900px and wider, the app uses a desktop workspace with persistent sidebar navigation, an account header, a two-column dashboard and search results, a two-column report form, and wider profile/settings pages. Welcome and account pages have separate desktop layouts. Smaller screens retain the original mobile layout. Desktop layouts are checked at widths of 900, 1024, 1440, and 1920 pixels; search and reporting flows run on both desktop and mobile.

Welcome, create account, login, home, search, report found ID, review, success, ID details, contact finder, my reports, notifications, profile, and settings. Search works by name, full index number, or matching last four digits. Try `22012345` or `Ama`. Report an ID using an 8-digit index, location, and a JPG, PNG, or WebP under 2 MB. Reports and settings persist locally; marking an ID resolved updates the report list. Dark mode is supported.

## Validation

```sh
npm run typecheck
npm run build
npx playwright test
```

Browser tests use the installed Google Chrome browser and the production build on port 3100. Run `npm run build` first.

## Data and backend

This is a UI prototype with local browser storage. Use sample information. Account forms do not authenticate, uploaded photos remain local, notification updates derive from local reports, and messages are saved as demo messages without delivery. A backend, authenticated authorization, private photo storage, identity verification, and real messaging are needed for production. Preferences for alerts/email are saved, but do not subscribe to push/email services. Data is shared across demo profiles on the same browser; sign-out exits the demo session and preserves demo reports.

Implementation follows the [Next.js App Router setup](https://nextjs.org/docs/app/getting-started/installation).
# frontend

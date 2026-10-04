# FindMyID frontend

A responsive Next.js / TypeScript frontend connected to the ASP.NET Core C# backend in `../backend` with SQLite persistence.

Run the backend with `dotnet run --project backend` from the project root, then run `npm install` and `npm run dev` here. Open http://localhost:3000. See [the project README](../README.md) for setup, API endpoints, deployment configuration, limitations, and tests.

Development seed accounts: `ama@st.ug.edu.gh`, `kwame@st.ug.edu.gh`, and `abena@st.ug.edu.gh`, each with password `FindMyID123!` when newly created. See [the backend README](../backend/README.md) for the seed command and account/report details.

The browser sends requests through the Next.js `/api` proxy, which defaults to the deployed backend at https://backend-findmyid.onrender.com. To use a local backend instead, set `API_BASE_URL=http://localhost:5050` in `.env.local`, then restart the Next.js server. See `.env.example`.

Included screens: welcome, create account, login, home, public ID search, report found ID, review, success, ID details, contact finder, my reports, notifications/messages, profile, and settings. Accounts authenticate with stored password hashes and HttpOnly cookies. Reports, photos, messages, feedback, profiles, and preferences persist in SQLite. Unsaved report drafts remain in session storage.

Loaders cover initial data, search, and mutations. Buttons are disabled during submissions, failures show errors, and initial loading failures provide retry. Desktop layouts use persistent navigation at 900px and wider; smaller screens use mobile navigation.

```sh
npm run typecheck
npm run build
npx playwright test
```

Playwright starts both services on test ports and uses a separate database. Google Chrome must be installed.

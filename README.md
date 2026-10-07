# LMS Dashboard

This is a frontend-only React LMS dashboard built with Vite.

## Source structure

- `src/api` contains the demo data-access layer. Replace these modules with HTTP calls later without changing page components.
- `src/context` contains small domain providers for authentication, assignments, messages, and teacher planning.
- `src/pages` contains route-level screens grouped by user role.
- `src/layouts` contains the shared application shell, header, sidebar, and footer.
- `src/components` contains reusable feature and UI components.
- `src/routes` contains routing helpers such as the role guard.
- `src/data` and `src/utils` contain demo data and framework-independent helpers.

## Run locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the front-end app:

   ```bash
   npm run dev
   ```

3. Open the Vite URL shown in the terminal.

## Notes

- This repository contains no Express server or backend credentials.
- Features that call `/api/*` require a separately deployed API and will otherwise use their existing frontend fallback or show an unavailable message.

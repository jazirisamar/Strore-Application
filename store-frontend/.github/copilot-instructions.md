# AI Coding Guidance for store-frontend

- This is a Create React App frontend only. Use `npm start`, `npm test`, and `npm run build` from `package.json`.
- The app assumes a backend API at `http://localhost:8081`. All network calls live in `src/services/*`.

## Architecture

- `src/App.js` defines the routing surface. Primary routes are:
  - `/` → `src/pages/HomePage.js`
  - `/contact` → `src/pages/ContactPages.js`
  - `/login` → `src/pages/LoginPage.js`
  - `/register` → `src/pages/RegisterPage.js`
  - `/provider-dashboard` → `src/pages/ProviderDashboard.js`
  - `/client-dashboard` → `src/pages/ClientDashboard.js`
- There is no centralized state management library. Authentication state is stored in `localStorage` under `currentUser`.
- The app is role-based:
  - `role === "fournisseur"` goes to provider dashboard
  - `role === "client"` goes to client dashboard
- `src/pages/products.js` exists but is not wired in `App.js`; treat it as stale or legacy unless routing is updated intentionally.

## API / Service conventions

- `src/services/authService.js` uses axios with `URLSearchParams` and `POST` to `/auth/login` and `/auth/register`.
- `src/services/productsService.js` exposes:
  - `getProducts(email = null)` ⇒ if email provided, sends `fournisseurEmail` param for provider-specific products
  - `addProduct(formData)` ⇒ multipart file upload
  - `deleteProduct(id)`
  - `addLigneCommande(productId, quantity)` ⇒ POST to `/products/ligneCommande`
  - `addPanier(user, ligneCommandeIds)` ⇒ POST with repeated `ligneCommandeIds` params
  - `getOrders(email)` ⇒ GET `/products/panier` by email
- `src/services/categoryService.js` is a single GET call to `/categories`.

## Page and data flow patterns

- `LoginPage.js` and `RegisterPage.js` validate inputs, call service methods, store `currentUser`, then route based on role.
- `ProviderDashboard.js` is protected by checking `localStorage.currentUser` and `user.role === "fournisseur"`.
- `ClientDashboard.js` is protected by checking `localStorage.currentUser` and `user.role === "client"`.
- `ProviderDashboard.js` loads categories and provider-owned products using the current user email.
- `ClientDashboard.js` loads all products, categories, and orders, and builds cart/order logic in the component.

## UI and styling

- Styling is plain CSS under `src/css/`; no CSS modules or styled-components are used.
- Animated elements use `framer-motion` in page-level components.
- Common pages import CSS directly, e.g. `src/pages/LoginPage.js` imports `../css/Auth.css`.

## Practical notes for changes

- If a new API endpoint is needed, add it to the relevant service file and keep the page-level component as a thin consumer.
- For auth-related changes, update both login/register flows and the dashboard redirect guards.
- Keep route names consistent with `App.js`; adding a new page usually means updating `src/App.js` and the navigation buttons.
- Avoid changing backend URL in many places; there is no environment variable handling in this repo.

## Testing and debugging

- Use browser devtools to inspect network requests from axios and verify `localStorage.currentUser`.
- `npm test` runs the default CRA test runner; there are no custom test scripts present.
- `npm run build` produces the production bundle under `build/`.

## When editing

- Prefer updating `src/services/*` rather than duplicating API logic in pages.
- Preserve `currentUser` role logic and existing `navigate(...)` control flow.
- Keep form submission and modal handling inside the page component unless you are refactoring to shared components.

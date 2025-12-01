# Website Audit & To-Do List

## 🚨 Critical Priority (P0)

- [ ] **[PERF/SEO] Enable SSR for `LiveServerHero`**
  - **File:** `components/HomeClient.js`
  - **Issue:** `LiveServerHero` is currently dynamically imported with `ssr: false`. This causes the most important part of the page (the Hero section) to be invisible to search engine crawlers and delays the Largest Contentful Paint (LCP) for users until JavaScript loads.
  - **Fix:** Change `ssr: false` to `ssr: true` or remove the dynamic import if not strictly necessary for bundle splitting. The component's internal logic (`window` usage) is inside event handlers, so it is safe for SSR.

- [ ] **[SEO] Update Placeholder Links & Metadata**
  - **File:** `lib/config.json`
  - **Issue:** The configuration file contains placeholder links (e.g., `discord.gg/your-invite-link`, `facebook.com/your-page`).
  - **Fix:** Replace all `"your-..."` placeholders with actual URLs.

## 🔥 High Priority (P1)

- [ ] **[PERF] Optimize External Images**
  - **File:** `lib/config.json`, `next.config.js`
  - **Issue:** The site relies on `placehold.co` for placeholder images. These can be slow and affect performance scores.
  - **Fix:** Replace placeholder images with local optimized assets (WebP/AVIF) in `public/images/` or use a dedicated CDN.

- [ ] **[UX/A11Y] Fix Mobile Menu Accessibility**
  - **File:** `components/Navbar.js`
  - **Issue:** The mobile menu toggle button should have `aria-expanded` and `aria-controls` attributes dynamically updated (already present, but verify behavior). Ensure focus trap is implemented if the menu covers the screen.
  - **Fix:** Verify keyboard navigation works inside the mobile menu.

- [ ] **[SEO] Add `alt` Text to Images**
  - **File:** `components/Footer.js`, `components/FeatureTabs.js`
  - **Issue:** Ensure all `Image` components have descriptive `alt` text. Currently, some might use generic text or config values that need to be descriptive.
  - **Fix:** Review all `Image` usages and ensure `alt` props describe the image content for screen readers.

## 🛠️ Medium Priority (P2)

- [ ] **[CLEANUP] Remove Console Logs**
  - **File:** `components/HomeClient.js`
  - **Issue:** `console.log('Server status changed, refreshing...');` is present in production code.
  - **Fix:** Remove the log or wrap it in `if (process.env.NODE_ENV === 'development')`.

- [ ] **[DX] Type Checking / Prop Validation**
  - **File:** `components/FeatureTabs.js`, `components/LiveServerHero.js`
  - **Issue:** No PropTypes or TypeScript interfaces.
  - **Fix:** Add PropTypes or migrate to TypeScript for better type safety, especially for `siteConfig` and `features` props.

- [ ] **[UX] Loading Skeletons**
  - **File:** `components/HomeClient.js`
  - **Issue:** The loading skeletons for dynamic components (`FeatureTabs`, `NewsSection`) are generic gray boxes.
  - **Fix:** Create custom skeleton components that match the actual layout of the content to reduce layout shift perception.

## 🔒 Security (P2)

- [ ] **[SEC] Verify NextAuth Secret**
  - **File:** `.env` (not visible, but implied)
  - **Issue:** Ensure `NEXTAUTH_SECRET` is set to a strong random string in production.
  - **Fix:** Run `openssl rand -base64 32` to generate a secret and add it to `.env`.

- [ ] **[SEC] Review External Link Security**
  - **File:** `components/Navbar.js`, `components/Footer.js`
  - **Issue:** External links (`target="_blank"`) should have `rel="noopener noreferrer"` to prevent tabnabbing (already present in Navbar, check Footer and others).
  - **Fix:** Audit all `<a>` tags or `Link` components opening in new tabs.

## 💡 Low Priority (P3)

- [ ] **[UI] Consistent Button Styles**
  - **File:** `components/LiveServerHero.js`, `components/Navbar.js`
  - **Issue:** Check if button hover effects and shadows are consistent across the site (e.g., shadow colors matching brand colors).
  - **Fix:** Standardize button variants in `components/ui/button.jsx` if needed.

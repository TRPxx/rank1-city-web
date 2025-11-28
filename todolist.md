# OWASP Top 10 Security Audit & Remediation Plan

## A1: Injection
- [x] **[P0] [SEC]** Check SQL queries for parameterization in `lib/db.js` (Verified: using `pool.execute`).
- [x] **[P0] [SEC]** Check `app/api/user/profile/route.js` (Verified: using parameterized `?`).

## A2: Broken Authentication
- [x] **[P1] [SEC]** Create `middleware.js` to protect `/profile` and other private routes at the edge (Implemented).
- [x] **[P1] [SEC]** Verify `next-auth` configuration (Verified: checks Discord Guild ID).

## A3: Sensitive Data Exposure
- [x] **[P0] [SEC]** Ensure no hardcoded secrets (Verified: using `process.env`).
- [x] **[P1] [SEC]** Check API responses for sensitive data (Verified: `/api/user/profile` selects specific fields).

## A4: XML External Entities (XXE)
- [x] **[P2] [SEC]** Verify no unsafe XML parsing (Verified: None found).

## A5: Broken Access Control
- [x] **[P0] [SEC]** Check API routes for `getServerSession` checks (Verified).
- [x] **[P0] [SEC]** Verify IDOR protection (Verified: `/api/user/profile` uses session ID).

## A6: Security Misconfiguration
- [x] **[P1] [SEC]** Configure Security Headers (CSP, X-Frame-Options) in `next.config.js` (Implemented).
- [x] **[P1] [SEC]** Disable `X-Powered-By` header in `next.config.js` (Implemented).

## A7: Cross-Site Scripting (XSS)
- [x] **[P0] [SEC]** Scan for `dangerouslySetInnerHTML` (Verified: None in user code).
- [ ] **[P2] [SEC]** Review `dangerouslyAllowSVG: true` in `next.config.js` (Acceptable for trusted domains).

## A8: Insecure Deserialization
- [x] **[P2] [SEC]** Check for unsafe object deserialization (Verified: `JSON.parse` used on internal DB data only).

## A9: Using Components with Known Vulnerabilities
- [x] **[P1] [SEC]** Dependencies appear up-to-date (`next@latest`, `next-auth@^4.24.13`).

## A10: Insufficient Logging & Monitoring
- [x] **[P2] [SEC]** Basic logging exists in API routes.

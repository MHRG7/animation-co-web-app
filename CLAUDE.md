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
- **Logging**: Winston 3 (environment-aware structured logging)

---

## 📊 CURRENT STATUS

**Last Review**: October 26, 2025
**Build Status**: ✅ Compiles (TypeScript + ESLint pass)
**Test Status**: ✅ 3/3 integration tests passing
**Completion**: ✅ **Phase 1A: 100% COMPLETE**

### ✅ What's Working
- **TypeScript/ESLint**: Code compiles cleanly, no errors
- **Zod v4**: Correct usage of `z.email()`, `z.enum()`, `z.treeifyError()` APIs
- **Express 5**: Proper async handler typing with return statements
- **Testing Infrastructure**: Vitest + Supertest configured with test database
- **Integration Tests**: 3 passing tests for registration endpoint
  - ✅ Successful user registration (201 response)
  - ✅ Duplicate email rejection (409 response)
  - ✅ Invalid input validation (400 response with details)
- **Test Database**: Separate PostgreSQL database (`animation_app_test`) in Docker
- **Cross-Platform Testing**: `cross-env` for Windows/Mac/Linux compatibility
- **Environment Configuration**: Centralized `config/env.ts` with Zod validation
  - ✅ All env vars validated on startup (fail-fast)
  - ✅ Type-safe config exports (`env.JWT_SECRET`, `env.BCRYPT_ROUNDS`, etc.)
  - ✅ `.env.example` template for new developers
  - ✅ No hardcoded values (CORS, bcrypt rounds, rate limits all configurable)
- **Winston Logging**: Structured logging with environment-aware configuration
  - ✅ Development: Colorful console output with all log levels
  - ✅ Production: JSON format for log aggregation services
  - ✅ Test: Silent (no console clutter)
  - ✅ Timestamps, log levels, and structured metadata
  - ✅ No `console.*` in application code (only in env validation)
- **Registration Endpoint**: Logic implemented, tested, and proven to work
- **Validation Middleware**: Zod integration working correctly
- **Docker + PostgreSQL**: Both dev and test databases running
- **Prisma**: Schema defined with User model, roles, soft deletes

### ⚠️ Known Technical Debt (Non-blocking)

1. **Prisma Singleton Incomplete**
   - No graceful shutdown handling
   - No query logging in development
   - Missing connection pool configuration
   - **Impact**: Low - can be addressed in Phase 1B or later

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

### ✅ Priority 2: Environment Configuration - COMPLETE
**Status**: All environment variables configured and validated

**What was implemented:**
- ✅ `src/config/env.ts` - Zod schema for environment validation
- ✅ `.env.example` - Template documenting all required variables
- ✅ Added all missing env vars: `JWT_SECRET`, `BCRYPT_ROUNDS`, `FRONTEND_URL`, `RATE_LIMIT_*`
- ✅ Removed hardcoded values from codebase:
  - CORS origin now uses `env.FRONTEND_URL`
  - Bcrypt rounds now uses `env.BCRYPT_ROUNDS`
  - Rate limiter now uses `env.RATE_LIMIT_MAX` and `env.RATE_LIMIT_WINDOW_MS`
  - Server port now uses `env.PORT`
- ✅ Fail-fast validation: Server won't start if env vars are missing/invalid
- ✅ Type-safe config: TypeScript knows all env vars are strings/numbers

**Key learnings:**
- Zod v4 API changes (`z.enum()` for enums, `z.treeifyError()` for errors)
- Environment validation patterns (validate on startup, not runtime)
- 12-factor app principles (configuration via environment)

---

### ✅ Priority 3: Winston Logging - COMPLETE
**Status**: Structured logging implemented throughout application

**What was implemented:**
- ✅ `src/lib/logger.ts` - Winston configuration with environment-aware transports
- ✅ Development mode: Colorful console output with timestamps
- ✅ Production mode: JSON format for log aggregation (CloudWatch, etc.)
- ✅ Test mode: Silent (no console clutter during tests)
- ✅ Replaced `console.log()` in `server.ts` with `logger.info()`
- ✅ Replaced `console.error()` in `auth.ts` with `logger.error()`
- ✅ Kept `console.error()` in `env.ts` (runs before logger exists)

**Key learnings:**
- Log levels hierarchy: error > warn > info > debug
- Structured logs with metadata for production debugging
- Environment-specific formats (human-readable vs JSON)
- Avoiding PII in logs (passwords, tokens, sensitive user data)

---

## 🧠 Phase 1A Completion Criteria

All requirements met for Phase 1B (login implementation):

- ✅ Code compiles (`pnpm typecheck` passes) - **DONE**
- ✅ Linting passes (`pnpm lint` passes) - **DONE**
- ✅ **Integration tests written and passing** (3+ test cases) - **DONE**
- ✅ **Environment variables configured** (`.env` + `.env.example`) - **DONE**
- ✅ **Winston logging implemented** (no `console.*` in application code) - **DONE**
- ✅ **Hardcoded values removed** (config from env vars) - **DONE**
- ✅ Registration endpoint tested - **DONE**

**Phase 1A: 7/7 complete (100%)**

---

## 🔄 Development Workflow (Phase 1A)

**Pattern Used**: Implement → Lint/Typecheck → Test → Commit → Repeat

### Commits Made During Phase 1A:

**Commit 1: Test Infrastructure**
```bash
git commit -m "test: Add integration tests for user registration

- Add Vitest + Supertest configuration
- Create test database helper (resetTestDatabase)
- Implement 3 integration tests (success, duplicate email, validation)
- Add test database to Docker Compose (animation_app_test)
- Install cross-env for cross-platform compatibility
- Configure test environment to disable rate limiter

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
```
**Why**: Tests prove the registration endpoint works. No feature is complete without tests.

---

**Commit 2: Environment Configuration**
```bash
git commit -m "feat: Add environment configuration with Zod validation

- Create config/env.ts with comprehensive Zod schema
- Add .env.example documenting all required variables
- Remove hardcoded values (CORS, bcrypt rounds, rate limits)
- Add fail-fast validation on server startup
- Fix Zod v4 deprecations (z.enum, error.issues loop)
- Add type-safe environment helpers (isDevelopment, isProduction, isTest)

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
```
**Why**: 12-factor app principle - configuration belongs in environment, not code.

---

**Commit 3: Documentation Update**
```bash
git commit -m "docs: Update CLAUDE.md with Phase 1A progress (85% complete)

- Mark integration tests as complete (Priority 1)
- Mark environment configuration as complete (Priority 2)
- Document Zod v4 learnings and API changes
- Update completion status to 6/7 (85%)
- Add commit history and workflow documentation

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
```
**Why**: Documentation tracks progress and knowledge gained during development.

---

**Commit 4: Winston Logging**
```bash
git commit -m "feat: Implement Winston structured logging

- Create lib/logger.ts with environment-aware configuration
- Development: Colorful console output with timestamps
- Production: JSON format for log aggregation
- Test: Silent mode (no console clutter)
- Replace console.log() in server.ts with logger.info()
- Replace console.error() in auth.ts with logger.error()
- Keep console.error() in env.ts (runs before logger exists)

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
```
**Why**: Production systems need structured logs. console.log doesn't scale.

---

### Key Workflow Lessons:

1. **Always run checks before committing**:
   ```bash
   pnpm typecheck  # TypeScript compilation
   pnpm lint       # ESLint validation
   pnpm test       # Integration tests
   ```

2. **Commit message format**:
   - Type prefix: `feat:`, `test:`, `docs:`, `fix:`, `refactor:`
   - Short summary (imperative mood: "Add" not "Added")
   - Bullet points for details (what changed and why)
   - Co-authored with Claude Code footer

3. **One feature per commit**:
   - Tests → separate commit
   - Environment config → separate commit
   - Logging → separate commit
   - Makes git history readable and revertible

4. **Test everything manually**:
   - TypeScript/ESLint pass ≠ working code
   - Run the server, test endpoints with Postman/curl
   - Verify database state in PostgreSQL
   - Check logs in different environments

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

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

**Last Review**: October 29, 2025
**Build Status**: ✅ Compiles (TypeScript + ESLint pass)
**Test Status**: ✅ 7/7 integration tests passing
**Completion**: ✅ **Phase 1B: 100% COMPLETE**

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
- **Login Endpoint**: Email/password authentication with JWT tokens
  - ✅ Password verification with bcrypt.compare
  - ✅ Access token generation (15 min expiry)
  - ✅ Refresh token generation (7 day expiry)
  - ✅ Refresh tokens stored in database with expiry
  - ✅ Service layer architecture (authService)
  - ✅ 4 passing integration tests for login
- **RefreshToken Model**: Prisma schema with user relation and cascade delete
- **Service Layer**: Refactored auth logic to service functions with explicit return types

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

**Commit 5: Phase 1A Documentation**
```bash
git commit -m "docs: Complete Phase 1A documentation (100%)

- Mark all Phase 1A priorities as complete
- Document Winston logging implementation
- Add commit history and workflow lessons
- Update completion status to 100%

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
```
**Why**: Keep documentation in sync with implementation progress.

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

## 🧠 Phase 1B Completion Criteria

All requirements met for Phase 1C (auth middleware + token management):

- ✅ Code compiles (`pnpm typecheck` passes) - **DONE**
- ✅ Linting passes (`pnpm lint` passes) - **DONE**
- ✅ **RefreshToken database model** (Prisma schema) - **DONE**
- ✅ **JWT token generation** (access + refresh) - **DONE**
- ✅ **Login service function** (password verification) - **DONE**
- ✅ **Login endpoint** (POST /auth/login) - **DONE**
- ✅ **Integration tests written and passing** (4 login test cases) - **DONE**
- ✅ **Service layer refactoring** (explicit return types) - **DONE**
- ✅ **Security best practices** (vague error messages) - **DONE**

**Phase 1B: 9/9 complete (100%)**

---

## 🔄 Development Workflow (Phase 1B)

**Pattern Used**: Implement → Lint/Typecheck → Test → Commit → Repeat

### Commits Made During Phase 1B:

**Commit 6: Login Implementation**
```bash
git commit -m "feat: Implement login endpoint with JWT tokens

- Add login Zod schema (email + password validation)
- Implement authService.login() with password verification
- Generate access tokens (15 min) and refresh tokens (7 days)
- Store refresh tokens in database with expiry
- Create POST /auth/login endpoint (returns tokens + user)
- Add 4 integration tests for login flow:
  * Successful login (200)
  * Non-existent email (401)
  * Wrong password (401)
  * Invalid input (400)
- Refactor registration to use service layer
- Add explicit return types to auth service functions
- Security: Vague error messages for auth failures

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
```
**Why**: Users can now authenticate and receive JWT tokens. Refresh tokens stored for later use.

---

### Key Learnings from Phase 1B:

1. **Refresh Token Architecture**:
   - Access tokens: Short-lived (15 min), stateless, multi-use
   - Refresh tokens: Long-lived (7 days), stateful (DB), used to get new access tokens
   - Security benefit: Stolen access token only valid 15 min, refresh tokens can be revoked

2. **Security Through Vague Errors**:
   - Login failures return same generic "Invalid credentials" error
   - Never reveal if email exists or password is wrong
   - Prevents account enumeration attacks

3. **HTTP Status Codes**:
   - 200 OK: Login success (returning existing data)
   - 201 Created: Registration success (creating new resource)
   - 400 Bad Request: Validation errors
   - 401 Unauthorized: Authentication failures
   - 403 Forbidden: Authenticated but insufficient permissions
   - 409 Conflict: Duplicate resource (email already exists)

4. **Service Layer Pattern**:
   - Routes handle HTTP concerns (status codes, error mapping)
   - Services handle business logic (password verification, token generation)
   - Benefits: testability, reusability, separation of concerns

5. **TypeScript Best Practices**:
   - Explicit return types on exported functions
   - `interface` over `type` for object shapes (TypeScript-ESLint recommendation)
   - Type aliases for complex return structures
   - Strict ESLint config with `strictTypeChecked` + `stylisticTypeChecked`

6. **Integration Testing Strategy**:
   - Test happy path (successful login)
   - Test security scenarios (invalid email, wrong password)
   - Test validation (bad input)
   - Same vague error for security tests

---

## 📋 Phase 1C Roadmap (Auth Middleware + Token Management)

**Goal**: Make JWT tokens actually usable for protecting routes

1. **JWT Verification Middleware**
   - Verify access token signature
   - Check token expiration
   - Extract user info from payload
   - Attach user to request object
   - Return 401 if invalid/expired

2. **POST /auth/refresh Endpoint**
   - Accept refresh token
   - Verify token exists in database
   - Check expiration
   - Generate new access token
   - Optional: Implement token rotation (new refresh token)

3. **POST /auth/logout Endpoint**
   - Accept refresh token
   - Delete from database (revoke)
   - Return 204 No Content

4. **Protected Route Testing**
   - Create test protected route (e.g., GET /api/profile)
   - Test with valid token (200)
   - Test with expired token (401)
   - Test with invalid token (401)
   - Test with no token (401)

5. **Integration Tests for Token Flow**
   - Full flow: Register → Login → Use token → Token expires → Refresh → Use new token
   - Logout flow: Login → Logout → Try to use token (should fail)
   - Try to refresh with revoked token (should fail)

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

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

**Last Review**: November 17, 2025
**Build Status**: ✅ Compiles (TypeScript + ESLint pass) - Backend + Frontend
**Test Status**: ✅ 20/20 backend integration tests passing
**Completion**: ✅ **Phase 1D: 100% COMPLETE - Frontend Authentication UI**

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
- **JWT Verification Middleware**: Authenticates requests and attaches user info
  - ✅ Validates access token signature and expiration
  - ✅ Extracts user info (userId, email, role) from JWT
  - ✅ Attaches to req.user for route handlers
  - ✅ Returns 401 for invalid/expired tokens
- **Protected Routes**: GET /auth/me endpoint demonstrating middleware usage
- **Token Refresh System**: POST /auth/refresh endpoint
  - ✅ Validates refresh token from database
  - ✅ Checks token expiration (JWT + database)
  - ✅ Generates new access token
  - ✅ Returns 401 for invalid/expired refresh tokens
- **Logout System**: POST /auth/logout endpoint
  - ✅ Revokes refresh tokens from database
  - ✅ Returns 204 No Content on success
  - ✅ Prevents token reuse after logout
- **Type Safety Enhancements**: Shared types and Express extensions
  - ✅ Created shared JWTPayload type (apps/backend/src/types/auth.ts)
  - ✅ Extended Express Request with user property
  - ✅ Full type safety across authentication system
- **Frontend Infrastructure**: React 19 + Vite 7 + Tailwind CSS v4
  - ✅ Vite dev server with /api proxy to backend
  - ✅ Tailwind CSS v4 with @tailwindcss/vite plugin (CSS-in-JS)
  - ✅ Path aliases (@/, @components, @pages, @hooks, @lib, @types)
  - ✅ React Router v7 for navigation
  - ✅ TanStack Query v5 for server state management
- **Authentication UI**: Login, Register, Dashboard pages
  - ✅ Controlled forms with React state
  - ✅ Error handling and loading states
  - ✅ Protected routes with ProtectedRoute component
  - ✅ Smart redirects (logged-in users redirected from auth pages)
- **Auth Context & Hooks**: useAuth hook with React Context
  - ✅ Token storage in localStorage
  - ✅ Automatic token attachment via axios interceptors
  - ✅ User query on mount (fetches current user if token exists)
  - ✅ Login, register, logout mutations with React Query
  - ✅ Global auth state accessible throughout app
- **API Integration**: Axios client with interceptors
  - ✅ Request interceptor: Attaches Authorization header from token getter
  - ✅ Response interceptor: Handles 401 errors with automatic token refresh
  - ✅ BaseURL configured to /api (proxied to backend)
- **Hybrid Token Storage**: Access token in memory, refresh in localStorage
  - ✅ Access token stored in React state (immune to XSS)
  - ✅ Refresh token stored in localStorage (persists across sessions)
  - ✅ Token getter/setter pattern bridges React and axios
  - ✅ Auto-refresh on mount restores session after page reload
  - ✅ No flash of unauthenticated content (isRefreshing state)
  - ✅ Users stay logged in for 7 days (refresh token expiry)

### ⚠️ Known Technical Debt (Non-blocking)

1. **Prisma Singleton Incomplete**
   - No graceful shutdown handling
   - No query logging in development
   - Missing connection pool configuration
   - **Impact**: Low - can be addressed in Phase 2 or later

2. **No CSP Headers**
   - Content Security Policy not configured
   - XSS protection relies solely on hybrid token storage
   - **Impact**: Medium - should add before production

3. **No Frontend Tests**
   - Backend has 20 integration tests, frontend has none
   - No component tests, no integration tests
   - **Impact**: Medium - acceptable for MVP, should add before production

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

## 🧠 Phase 1C Completion Criteria

All requirements met - Full authentication system complete:

- ✅ Code compiles (`pnpm typecheck` passes) - **DONE**
- ✅ Linting passes (`pnpm lint` passes) - **DONE**
- ✅ **JWT verification middleware** (authenticateJWT) - **DONE**
- ✅ **Express Request type extension** (req.user) - **DONE**
- ✅ **Shared JWTPayload type** (types/auth.ts) - **DONE**
- ✅ **Protected route** (GET /auth/me) - **DONE**
- ✅ **POST /auth/refresh endpoint** (token renewal) - **DONE**
- ✅ **POST /auth/logout endpoint** (token revocation) - **DONE**
- ✅ **Integration tests written and passing** (13 auth tests) - **DONE**

**Phase 1C: 9/9 complete (100%)**

---

## 🔄 Development Workflow (Phase 1C)

**Pattern Used**: Implement → Lint/Typecheck → Test → Commit → Repeat

### Commits Made During Phase 1C:

**Commit 7: Auth Middleware & Token Management**
```bash
git commit -m "feat: Implement auth middleware, refresh and logout endpoints

- Add JWT verification middleware (authenticateJWT)
- Extend Express Request type with user property
- Create shared JWTPayload type in types/auth.ts
- Implement GET /auth/me protected route
- Implement POST /auth/refresh endpoint
  * Validates refresh token from database
  * Generates new access token
  * Checks token expiration
- Implement POST /auth/logout endpoint
  * Revokes refresh token from database
  * Returns 204 No Content
- Add 13 integration tests:
  * 5 tests for protected route access
  * 4 tests for token refresh flow
  * 4 tests for logout flow
- All 20 tests passing (registration + login + auth)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```
**Why**: Completes the authentication system - users can now securely access protected resources.

---

### Key Learnings from Phase 1C:

1. **JWT Middleware Pattern**:
   - Middleware extracts and validates access tokens from Authorization header
   - Attaches user info to req.user for downstream handlers
   - Returns 401 for invalid/expired tokens before route execution
   - Enables reusable authentication across multiple routes

2. **Express Type Extensions**:
   - Use TypeScript declaration merging to extend Express types
   - Declare global namespace to augment third-party types
   - Enables type-safe access to custom request properties

3. **Token Lifecycle Management**:
   - Access tokens: Short-lived (15 min), stateless, verified via signature
   - Refresh tokens: Long-lived (7 days), stateful (database), can be revoked
   - Refresh endpoint validates both JWT signature AND database existence
   - Logout revokes refresh tokens to prevent reuse

4. **Authorization vs Authentication**:
   - Authentication: "Who are you?" (login, JWT verification)
   - Authorization: "What can you do?" (role-based access control - future phase)
   - Current system handles authentication; authorization will come later

5. **HTTP Status Code Usage**:
   - 200 OK: Success with data (refresh endpoint)
   - 204 No Content: Success without data (logout endpoint)
   - 401 Unauthorized: Authentication required/failed
   - Both 200 and 204 indicate success; choice depends on response body

6. **DRY Principle (Don't Repeat Yourself)**:
   - Identified duplicate JWTPayload interface across two files
   - Refactored to shared type in types/auth.ts
   - Benefits: Single source of truth, easier maintenance, consistency

7. **Test Coverage Strategy**:
   - Test happy path (valid tokens work)
   - Test security scenarios (invalid/expired tokens rejected)
   - Test edge cases (missing tokens, malformed headers)
   - Test full flows (logout → refresh should fail)

---

## 🧠 Phase 1D Completion Criteria

All requirements met - Frontend authentication UI complete:

- ✅ Code compiles (`pnpm typecheck` passes) - **DONE**
- ✅ Linting passes (`pnpm lint` passes) - **DONE**
- ✅ **Vite + React + Tailwind setup** (modern build tooling) - **DONE**
- ✅ **useAuth context hook** (global auth state) - **DONE**
- ✅ **Axios client with interceptors** (automatic token attachment) - **DONE**
- ✅ **Login page** (form with error handling) - **DONE**
- ✅ **Register page** (form with password confirmation) - **DONE**
- ✅ **Dashboard page** (protected route, user info display) - **DONE**
- ✅ **ProtectedRoute component** (authentication guard) - **DONE**
- ✅ **Smart redirects** (prevent logged-in users from auth pages) - **DONE**
- ✅ **Manual testing** (full auth flow verified) - **DONE**

**Phase 1D: 11/11 complete (100%)**

---

## 🔄 Development Workflow (Phase 1D)

**Pattern Used**: Implement → Lint/Typecheck → Test → Commit → Repeat

### Commits Made During Phase 1D:

**Commit 8: Backend Route Refactor**
```bash
git commit -m "refactor: Add /api prefix to auth routes

- Modify apps/backend/src/app.ts to add /api prefix
- Update all test endpoints from /auth/* to /api/auth/*
- Fix typos in logger.ts and authService.ts
- All 20 backend tests still passing

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
```
**Why**: Consistent API structure - all backend routes under /api prefix for cleaner separation.

---

**Commit 9: Frontend Authentication UI**
```bash
git commit -m "feat: Implement phase 1 Frontend - Authentication UI

- Add Vite configuration with Tailwind v4 plugin and API proxy
- Create index.html entry point
- Implement useAuth context hook with React Query
- Create axios client with request/response interceptors
- Build LoginPage with form validation and error handling
- Build RegisterPage with password confirmation
- Build DashboardPage with user info display
- Implement ProtectedRoute component for auth guards
- Add smart redirects (logged-in users can't access login/register)
- Configure React Router with protected routes
- Set up TanStack Query with devtools
- Add frontend TypeScript types (User, LoginRequest, etc.)
- Update pnpm-lock.yaml with new dependencies

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
```
**Why**: Complete frontend authentication UI - users can register, login, and access protected dashboard.

---

**Commit 10: Automatic Token Refresh**
```bash
git commit -m "feat: Implement automatic token refresh on frontend

- Add refreshAccessToken() function to call /api/auth/refresh
- Update axios response interceptor to handle 401 errors
- Auto-refresh access token when expired, retry original request
- Logout user only if refresh token is invalid/expired
- Use Vite proxy (/api) to avoid CORS issues

Fixes: Users no longer logged out every 15 minutes
Testing: Manually verified with JWT_EXPIRES_IN=30s

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
```
**Why**: Users no longer forcibly logged out every 15 minutes. Seamless UX.

---

**Commit 11: Hybrid Token Storage**
```bash
git commit -m "feat: Implement hybrid token storage (access in memory, refresh in localStorage)

- Store access token in React state (memory only, immune to XSS)
- Store refresh token in localStorage (persists across sessions)
- Implement token getter/setter pattern for axios-React bridge
- Auto-refresh on mount to restore session after page reload
- Fix race condition with queryKey and enabled flag
- Add isRefreshing state to prevent flash of unauthenticated content
- Move RefreshTokenResponse to shared types

Security: Access tokens no longer stored in localStorage (XSS protection)
UX: Users stay logged in after page refresh (7 day session)

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
```
**Why**: Significant security improvement - access tokens can't be stolen via XSS attacks.

---

### Key Learnings from Phase 1D:

1. **Tailwind CSS v4 Architecture Change**:
   - v4 no longer uses PostCSS plugin directly
   - Use @tailwindcss/vite plugin instead
   - Single `@import 'tailwindcss';` in CSS (replaces three @tailwind directives)
   - No tailwind.config.ts needed (zero-config by default)
   - IntelliSense works better without config file

2. **React Context Pattern for Auth**:
   - Context provides global auth state across all components
   - Custom hook (useAuth) ensures type safety and prevents misuse
   - Context wraps QueryClient and Router for provider composition order
   - All pages have access to auth state, even public pages
   - Security: Auth state determines what users see, not what they access (backend enforces)

3. **React Query Loading States**:
   - Query loading state: For initial data fetching (useQuery.isLoading)
   - Mutation loading state: For submit actions (useMutation.isPending)
   - Local loading state: For component-specific UI control (useState)
   - Choice depends on API needs: local state gives full control, mutation state is automatic

4. **Protected Route Pattern**:
   - Wrapper component checks authentication before rendering children
   - Redirects to login if not authenticated
   - Shows loading spinner while checking auth status
   - Can be extended with role-based access control (e.g., requiredRole prop)

5. **Smart Redirects for UX**:
   - Logged-in users shouldn't see login/register pages
   - Use `<Navigate to="/dashboard" replace />` for instant redirect
   - `replace` prevents back button from returning to auth page
   - Improves UX and prevents confusion

6. **Controlled Components in React**:
   - Input value controlled by React state (useState)
   - onChange updates state, state updates input
   - Form submission prevents default and handles async logic
   - Benefits: React has single source of truth, easy validation

7. **Axios Interceptors**:
   - Request interceptor: Runs before every request (attach token from localStorage)
   - Response interceptor: Runs after every response (handle 401 errors globally)
   - Centralizes cross-cutting concerns (auth, error handling, logging)
   - No need to manually add Authorization header in every API call

8. **localStorage for Token Persistence**:
   - Simple API: getItem, setItem, removeItem
   - Persists across browser sessions (unlike sessionStorage)
   - Synchronous (no async/await needed)
   - Security consideration: XSS attacks can access localStorage (use CSP headers)

9. **useEffect and Dependency Arrays**:
   - Empty array []: Runs once on mount
   - No array: Runs on every render (infinite loop risk)
   - [dep1, dep2]: Runs when dependencies change
   - Return function: Cleanup (runs before next effect or unmount)

10. **TypeScript void Operator**:
    - Used when intentionally not awaiting a promise
    - Documents intent: "I know this returns a promise, I don't need the result"
    - Not suppression - it's explicit communication
    - Example: `void navigate('/login')` for React Router navigation

11. **ESLint Error Reading**:
    - Error format: `file:line:col  error  message  rule-name`
    - Rule name links to documentation
    - Fix properly by addressing root cause, not suppressing
    - Suppressions (@ts-ignore, eslint-disable) hide problems, don't fix them

12. **Git Commit Best Practices**:
    - Separate logical changes into different commits
    - Commit message format: `type: summary` + bullet points
    - Always commit lock files (pnpm-lock.yaml) for reproducible builds
    - Review changes before committing (git status, git diff)
    - Can use `git add .` for related changes, or individual files for precision

13. **Boolean Short-Circuit Evaluation**:
    - JavaScript evaluates left to right
    - Stops at first falsy value in && chain
    - Order matters: cheapest/safest checks first
    - Example: `if (user && user.role === 'ADMIN')` - checks user exists before accessing role
    - Prevents null/undefined access errors

---

## 🎯 Wave 1 Security Progress (66% Complete)

**Completed:**
- ✅ Automatic token refresh (Commit 10)
- ✅ Hybrid token storage (Commit 11)

**Remaining:**
- ❌ CSP headers (next task - 1-2 hours)
- ⏸️ Token rotation (optional, advanced security)

### Key Learnings (Hybrid Storage):

1. **Token Getter/Setter Pattern**:
   - Store function reference, not value
   - Bridges non-React code (axios) with React state
   - `() => accessToken` always returns current value
   - Used by Auth0, AWS Amplify, Firebase

2. **React Query Dependencies**:
   - queryKey must include all dependencies: `queryKey: ['user', accessToken]`
   - `enabled` flag controls when query runs: `enabled: !!accessToken`
   - Prevents race conditions on mount

3. **Loading State Management**:
   - Separate `isRefreshing` for initial auth check
   - Combine with React Query `isLoading`
   - Prevents flash of unauthenticated content

4. **Optional Chaining with Function Calls**:
   - `tokenGetter?.()` = "if exists, call it"
   - Prevents crashes when function is null
   - Used when function might not be registered yet

---

## 📋 Next Steps

**Immediate (Wave 1 completion):**
1. **CSP Headers** (1-2 hours) - Prevent XSS at browser level
2. **Frontend Tests** (4-6 hours) - Test auth flows

**Then (Phase 2):**
1. Role-based authorization middleware
2. Content management CRUD endpoints

---

## 📋 Phase 2 Roadmap (Content Management API)

**Goal**: Build admin-only CRUD endpoints for portfolio content

1. **Role-Based Authorization Middleware**
   - Check user role from JWT (admin, editor, user)
   - Protect admin-only routes
   - Return 403 for insufficient permissions

2. **Project CRUD Endpoints**
   - POST /api/projects (admin only)
   - GET /api/projects (public)
   - GET /api/projects/:id (public)
   - PATCH /api/projects/:id (admin only)
   - DELETE /api/projects/:id (admin only)

3. **File Upload System**
   - Image upload endpoint
   - File validation (type, size)
   - Cloud storage integration (AWS S3 or similar)

4. **Database Schema Expansion**
   - Project model (title, description, images, etc.)
   - Category/Tag system
   - Relations and constraints

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

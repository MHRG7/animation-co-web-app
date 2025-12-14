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
3. **Small bites teaching approach**:
   - **First**: Explain what we want to do and WHY (context and reasoning)
   - **Second**: Show what needs to be done (code/steps/examples)
   - **Third**: Explain the reason and what we accomplished (after completion)
   - Break complex tasks into small, digestible pieces
   - Let user implement each piece before moving to the next
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

**Last Review**: December 13, 2025
**Build Status**: ✅ Compiles (TypeScript + ESLint pass) - Backend + Frontend
**Test Status**: ✅ 20/20 backend tests | ⚠️ 15/28+ frontend tests (54% coverage)
**Completion**: 🔄 **Phase 1G: IN PROGRESS - LoginPage + RegisterPage Complete, 3 Components Pending**

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
- **Content Security Policy (CSP)**: Browser-level XSS prevention
  - ✅ Helmet middleware with custom CSP directives
  - ✅ Environment-aware security rules (dev vs production)
  - ✅ Comprehensive CSP directives (script-src, style-src, connect-src, etc.)
  - ✅ Prevents XSS attacks at browser level
  - ✅ Blocks unauthorized external resources
  - ✅ Mitigates clickjacking and injection attacks
  - ✅ Defense in depth with hybrid token storage
- **Shared Types Package**: Monorepo-wide type safety with Zod validation
  - ✅ @animation-co/shared-types workspace package
  - ✅ Common types: User interface, UserRole enum
  - ✅ Auth schemas: Zod validation with TypeScript inference
  - ✅ Request/Response types for API contract
  - ✅ Type converter pattern (toApiUser helper)
  - ✅ Backend fully migrated to shared types
  - ✅ Frontend fully migrated to shared types
  - ✅ Build order dependencies configured
  - ✅ Single source of truth for API contract
  - ✅ Input/Output type separation (z.input vs z.output)
  - ✅ Validation middleware applies Zod transformations

### ⚠️ Known Technical Debt (Non-blocking)

1. **Prisma Singleton Incomplete**
   - No graceful shutdown handling
   - No query logging in development
   - Missing connection pool configuration
   - **Impact**: Low - can be addressed in Phase 2 or later

2. **Incomplete Frontend Test Coverage**
   - Backend has 20 integration tests (100% of auth flows)
   - Frontend has 15 tests: LoginPage (8/8) + RegisterPage (7/7) - both at 100% coverage
   - Missing tests: DashboardPage (0/3), ProtectedRoute (0/4), useAuth hook (0/6)
   - **Impact**: Medium - critical user flows (login/register) fully tested, but 3 components remain untested

3. **CSP Nonce-Based Approach** (Future Enhancement)
   - Currently using 'unsafe-inline' for Tailwind CSS v4 styles
   - Nonce-based approach would provide 95% vs current 90% XSS protection
   - **Impact**: Low - current approach is production-ready, nonces are optimization

---

## 📜 Completed Phases (See HISTORY.md for full details)

**Phase 1A-1F Complete** (December 2025) - See [HISTORY.md](./HISTORY.md) for comprehensive documentation

### Quick Summary of Completed Phases:

**Phase 1A: Backend Foundation**
- Integration tests (Vitest + Supertest)
- Environment configuration (Zod validation)
- Winston logging (structured, environment-aware)
- Registration endpoint with tests

**Phase 1B: Login System**
- RefreshToken model (Prisma schema)
- JWT token generation (access + refresh)
- Login endpoint with password verification
- Service layer architecture

**Phase 1C: Auth Middleware & Token Management**
- JWT verification middleware
- Protected routes (GET /auth/me)
- Token refresh endpoint
- Logout endpoint with token revocation

**Phase 1D: Frontend Authentication UI**
- Vite + React + Tailwind CSS v4
- useAuth context hook
- Login, Register, Dashboard pages
- Automatic token refresh
- Hybrid token storage (access in memory, refresh in localStorage)
- CSP headers for XSS prevention

**Phase 1E: Shared Types Package**
- @animation-co/shared-types monorepo package
- Zod schemas with TypeScript inference
- Type converter pattern (toApiUser)
- Build order dependencies

**Phase 1F: Frontend Migration to Shared Types**
- Frontend uses shared-types
- Input/Output type separation
- Validation middleware applies transformations
- Single source of truth for API contract

---

## 🧠 Phase 1G: Frontend Testing Infrastructure (IN PROGRESS)

**Goal**: Establish frontend testing patterns and achieve minimum viable test coverage

### ✅ Completed (December 4-13, 2025)

**Test Infrastructure Setup**:
- ✅ `vitest.config.ts` - Configured with jsdom, React plugin, path aliases
- ✅ `src/test/setup.ts` - jest-dom matchers, cleanup hooks
- ✅ `src/test/vitest.d.ts` - TypeScript declarations for matchers
- ✅ Path alias resolution in Vitest (matches tsconfig.json)
- ✅ ESLint config updated to ignore `**/*.config.ts` files

**LoginPage Tests** (8/8 tests - 100% coverage ✅):
- ✅ Successful login with valid credentials
- ✅ Error message on invalid credentials
- ✅ Loading state during API call (button text + disabled)
- ✅ Disabled inputs during loading
- ✅ Register link navigation
- ✅ Navigation to dashboard after successful login
- ✅ Already authenticated redirect
- ✅ Form validation (required fields)

**RegisterPage Tests** (7/7 tests - 100% coverage ✅):
- ✅ Successful registration with valid credentials
- ✅ Password mismatch validation (client-side)
- ✅ Duplicate email error (server-side 409)
- ✅ Weak password validation (client-side Zod)
- ✅ Loading state (button text + disabled inputs)
- ✅ Login link navigation
- ✅ Already authenticated redirect

### ⚠️ Current State: LoginPage + RegisterPage COMPLETE, 3 Components Pending

**Test Coverage Reality Check**:
```
Backend:  20/20 tests (100% of auth endpoints)
Frontend: 15/28 tests (54% overall coverage)

LoginPage:      8/8 tests (100% coverage) ✅
RegisterPage:   7/7 tests (100% coverage) ✅
DashboardPage:  0/3 tests (0% coverage) ❌
ProtectedRoute: 0/4 tests (0% coverage) ❌
useAuth hook:   0/6 tests (0% coverage) ❌
```

**What Works**:
- ✅ Mocking axios with `vi.mock()`
- ✅ Rendering components with providers (QueryClient, Router, Auth)
- ✅ Simulating user interactions (`userEvent.type()`, `userEvent.click()`)
- ✅ Finding elements accessibly (`getByRole`, `getByLabelText`)
- ✅ Testing async behavior (`waitFor`, `findBy`)
- ✅ Verifying API calls and side effects

**What's Missing**:
- ❌ DashboardPage testing (user info display, logout)
- ❌ ProtectedRoute testing (auth guards, redirects)
- ❌ useAuth hook testing (login, register, logout, token refresh)
- ❌ Integration flows (multi-component user journeys)

### 📚 Key Learnings

1. **React Testing Library Philosophy**:
   - "Test how users interact, not implementation details"
   - Find elements by accessibility (roles, labels)
   - Simulate real user behavior (type, click, wait)
   - Don't test React internals (state, props)

2. **Mocking Strategy**:
   - Mock external dependencies (axios, APIs)
   - Don't mock internal components
   - Control what mocks return for each test scenario
   - Use `vi.clearAllMocks()` in `beforeEach` for isolation

3. **Provider Wrapping Pattern**:
   - Components need context providers to function
   - Create helper function with all providers
   - Fresh QueryClient for each test (no state leakage)
   - Order matters: QueryClient → Router → Auth → Component

4. **Accessible Element Queries (Priority Order)**:
   - `getByRole` - Most semantic, accessibility-first
   - `getByLabelText` - For form inputs with labels
   - `getByPlaceholderText` - When no label exists
   - `getByText` - For plain text content
   - `getByTestId` - Last resort only

5. **ARIA Roles vs HTML Elements**:
   - Roles are accessibility concepts, not HTML tags
   - `<button>` has implicit `role="button"`
   - `<input type="email">` has implicit `role="textbox"`
   - `<p>` and `<div>` have no implicit role (use `getByText`)

6. **Accessible Name Concept**:
   - `{ name: /submit/i }` matches visible text or aria-label
   - NOT the `name=""` HTML attribute
   - What screen readers announce to users
   - For buttons: text content = accessible name

7. **TypeScript Integration**:
   - jest-dom matchers require type declarations
   - Use `declare module 'vitest'` to extend types
   - Vitest uses different types than Jest
   - Path aliases must match tsconfig.json

8. **Common Pitfalls Encountered**:
   - Path aliases not configured (imports fail)
   - Missing AuthProvider (context errors)
   - Typos in queries (element not found)
   - Forgetting `await` on user events (race conditions)

9. **Regex Anchors for Label Matching** (December 13):
   - `/password/i` matches both "Password" and "Confirm Password"
   - `/^password$/i` matches ONLY "Password" (exact match with anchors)
   - Anchors: `^` (start) and `$` (end) ensure exact string matching
   - Critical when multiple labels contain the same substring

10. **Frontend Zod Validation** (December 13):
   - Use `schema.safeParse()` for client-side validation
   - Returns `{ success: boolean, data?, error? }` instead of throwing
   - Show specific error messages to users (better UX)
   - Prevents invalid API requests (reduces server load)
   - Security consideration: LoginPage uses vague errors, RegisterPage uses specific errors

11. **Axios Error Handling** (December 13):
   - Axios errors have structure: `{ response: { data: { error } } }`
   - TypeScript requires type guards: `typeof err === 'object' && 'response' in err`
   - Use type assertion for structure: `err as { response: { data: { error?: string } } }`
   - Extract custom error messages with optional chaining: `response?.data?.error`

12. **Nullish Coalescing (`??`) vs Logical OR (`||`)** (December 13):
   - `||` returns right side if left is falsy (0, '', false, null, undefined)
   - `??` returns right side ONLY if left is null or undefined
   - `??` is safer for error messages (empty string is valid, not falsy)
   - ESLint prefers `??` for null/undefined checks (`prefer-nullish-coalescing`)

13. **Professional Testing Discipline** (December 13):
   - Finish one component completely before moving to the next
   - Don't assume untested code works because similar code does
   - Each component needs its own tests (even if patterns are similar)
   - 50% coverage on critical flows is not production-ready

### 🎯 Minimum Viable Testing (Definition)

**Current approach is NOT acceptable for production**. Here's what "complete" means:

**For Each Component**:
- ✅ Happy path (success flow)
- ✅ Sad path (error handling)
- ✅ Loading states (during async operations)
- ✅ Disabled states (buttons, inputs)
- ✅ Navigation/redirects
- ✅ Form validation

**Estimated Work Remaining**:
- ~~LoginPage: 6 more tests~~ ✅ DONE (8/8 tests complete)
- ~~RegisterPage: 8 tests~~ ✅ DONE (7/7 tests complete)
- DashboardPage: 3 tests (2-3 hours)
- ProtectedRoute: 4 tests (3-4 hours)
- useAuth hook: 6 tests (4-6 hours)

**Total**: ~10-13 hours to achieve production-ready coverage

### 🚨 Honest Assessment

**What was accomplished**:
- ✅ Learned testing patterns (mocking, rendering, user interactions)
- ✅ Proved infrastructure works (Vitest, jsdom, React Testing Library)
- ✅ **LoginPage: 100% coverage** (8 comprehensive tests)
- ✅ **RegisterPage: 100% coverage** (7 comprehensive tests)
- ✅ Frontend Zod validation (better UX, reduces API load)
- ✅ Fixed error handling bug (axios error extraction)
- ✅ Professional testing discipline (finished RegisterPage completely)

**What's still missing**:
- 46% of frontend tests (3 components untested)
- DashboardPage, ProtectedRoute, useAuth hook
- Can't refactor untested components safely
- Would NOT pass production review for incomplete coverage

**Status**: **Two critical components production-ready** (login + registration flows complete). Good progress, but still 10-13 hours from full coverage.

---

## 📋 Next Steps

**Currently In Progress:**
- 🔄 **Frontend Tests** (Phase 1G) - DashboardPage, ProtectedRoute, useAuth hook (~10-13 hours remaining)

**Recently Completed (December 13, 2025):**
- ✅ **RegisterPage Tests** - 7/7 tests (100% coverage)
- ✅ **Frontend Zod Validation** - Client-side validation with specific error messages
- ✅ **Error Handling Fix** - Axios error extraction with nullish coalescing
- ✅ **Shared Types Package** (Phase 1E) - Monorepo-wide type safety with Zod validation
- ✅ **Frontend Migration to Shared Types** (Phase 1F) - Eliminated duplicate types, single source of truth

**Deferred Until Tests Complete:**
1. **Frontend Tests Completion** (10-13 hours) - DashboardPage, ProtectedRoute, useAuth hook
2. **CSP Nonce-Based Approach** (2-3 hours) - Upgrade from 90% to 95% XSS protection
3. **Prisma Singleton Improvements** (1-2 hours) - Graceful shutdown, query logging, connection pooling

**Phase 2 (Content Management API):**
1. Role-based authorization middleware
2. Content management CRUD endpoints
3. File upload system for project images

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

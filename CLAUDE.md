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
- **Auth**: JWT with httpOnly cookie refresh tokens + token rotation + bcryptjs
- **Testing**: Vitest 3 + Supertest 7 + Testing Library
- **Logging**: Winston 3 (environment-aware structured logging)

---

## 📊 CURRENT STATUS

**Last Review**: January 17, 2026
**Build Status**: ✅ Compiles (TypeScript + ESLint pass)
**Test Status**: ✅ 22/22 backend | ✅ 27/27 frontend (49 total)
**Phase**: Ready for **Phase 2B: Project CRUD Endpoints**

### ✅ Completed Features

**Authentication System (Phase 1)**:
- Registration (admin-only), Login, Logout endpoints
- JWT access tokens (15 min) + httpOnly cookie refresh tokens (7 days)
- Token rotation on refresh (replay attack prevention)
- Automatic session restoration on page reload
- Role-based authorization middleware

**Frontend (Phase 1D-1G)**:
- React 19 + Vite 7 + Tailwind CSS v4
- Login, Register, Dashboard pages
- Protected routes with ProtectedRoute component
- useAuth context hook with React Query
- 100% test coverage (27 tests)

**Infrastructure**:
- Shared types package (@animation-co/shared-types)
- Zod validation with input/output type separation
- Winston structured logging
- CSP headers for XSS prevention
- Graceful server shutdown
- Database seed file for development

### 📁 Key Files

| Purpose | Location |
|---------|----------|
| Auth routes | [apps/backend/src/routes/auth.ts](apps/backend/src/routes/auth.ts) |
| Auth service | [apps/backend/src/services/authService.ts](apps/backend/src/services/authService.ts) |
| Auth middleware | [apps/backend/src/middleware/authenticate.ts](apps/backend/src/middleware/authenticate.ts) |
| Authorization | [apps/backend/src/middleware/authorize.ts](apps/backend/src/middleware/authorize.ts) |
| useAuth hook | [apps/frontend/src/hooks/useAuth.tsx](apps/frontend/src/hooks/useAuth.tsx) |
| Axios client | [apps/frontend/src/lib/axios.ts](apps/frontend/src/lib/axios.ts) |
| Shared types | [packages/shared-types/src/auth.ts](packages/shared-types/src/auth.ts) |
| Prisma schema | [apps/backend/prisma/schema.prisma](apps/backend/prisma/schema.prisma) |
| Database seed | [apps/backend/prisma/seed.ts](apps/backend/prisma/seed.ts) |

### 🔧 Development Commands

```bash
# Start development
pnpm dev                    # Run backend + frontend

# Checks
pnpm typecheck              # TypeScript compilation
pnpm lint                   # ESLint validation

# Testing
cd apps/backend && pnpm test   # Backend tests
cd apps/frontend && pnpm test  # Frontend tests

# Database
cd apps/backend && npx prisma studio    # View database
cd apps/backend && npx prisma db seed   # Seed database
```

### 👤 Dev Users (from seed)

| Email | Password | Role |
|-------|----------|------|
| admin@example.com | Admin123! | ADMIN |
| test@example.com | Test123! | USER |

---

## 📋 Phase 2 Roadmap

### ✅ Phase 2A: Authorization Middleware (COMPLETE)
- Higher-order function: `requireRole([UserRole.ADMIN])`
- Returns 401/403 for unauthorized access
- Protects registration endpoint

### ✅ Phase 2A.5: httpOnly Cookies + Bug Fixes (COMPLETE - Jan 17)
- Refresh tokens in httpOnly cookies with rotation
- Fixed axios interceptor (excludes all /auth/ endpoints)
- Fixed RegisterPage admin access
- Added graceful shutdown, query logging, token cleanup
- Added database seed file

### Phase 2B: Project CRUD Endpoints (NEXT)
- POST /api/projects (admin only)
- GET /api/projects (public)
- GET /api/projects/:id (public)
- PATCH /api/projects/:id (admin only)
- DELETE /api/projects/:id (admin only)

### Phase 2C: File Upload System
- Image upload endpoint
- File validation (type, size)
- Cloud storage integration

### Phase 2D: Database Schema Expansion
- Project model (title, description, images)
- Category/Tag system
- Relations and constraints

---

## ⚠️ Known Issues / TODOs

1. **No root route** - Need to add home page or redirect `/` to `/login`
2. **CSP uses 'unsafe-inline'** - Tailwind v4 requires it; nonce-based approach is optional optimization

---

## 📜 History

See [HISTORY.md](./HISTORY.md) for detailed documentation of completed phases including:
- Phase 1A-1C: Backend authentication system
- Phase 1D: Frontend authentication UI
- Phase 1E-1F: Shared types package migration
- Phase 1G: Frontend testing (100% coverage)
- Phase 2A: Authorization middleware
- Key learnings and commit history

---

## 💡 Mentor Notes

**Tone**: Brutally honest, no false praise. Focus on gaps and reality checks.

**Red Flags to Call Out**:
- Missing tests
- Hardcoded configuration values
- Console.log instead of structured logging
- Claiming "complete" without test coverage

**Good Habits to Reinforce**:
- Running `pnpm typecheck` and `pnpm lint` before claiming done
- Writing tests alongside features
- Environment-based configuration
- Proper error handling and logging

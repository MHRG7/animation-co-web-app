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

## 🏗️ Tech Stack (Latest 2025)
- **Backend**: Node.js 22 + Express 5 + TypeScript 5.9 + Prisma 6 + PostgreSQL 16
- **Frontend**: React 19 + Vite 7 + TypeScript 5.9 + TanStack Query 5 + Tailwind CSS 4
- **DevOps**: Docker + PNPM 10 monorepo + ESLint 9 flat config
- **Auth**: JWT with refresh tokens + bcrypt password hashing

## ✅ COMPLETED (September 2025)

### Phase 1A: Authentication Foundation
- ✅ **Docker PostgreSQL setup** - Professional isolated environment
- ✅ **Prisma User model** - Role-based access (ADMIN/EDITOR/USER)
- ✅ **Express 5 backend** - Professional TypeScript structure
- ✅ **User registration endpoint** - bcrypt hashing + validation
- ✅ **Singleton DB pattern** - Efficient connection management
- ✅ **Error handling** - Professional HTTP status codes

### Current Status
**Working:** `POST /auth/register` with admin user creation
**Database:** PostgreSQL 16 in Docker with proper auth
**Architecture:** Clean separation, professional patterns
**Validation:** All TypeScript strict mode, ESLint passing

## 🎯 NEXT PHASE: Authentication Completion

### Phase 1B: Login & JWT System
- [ ] **Login endpoint** - Email/password validation with JWT generation
- [ ] **JWT middleware** - Token validation and user context
- [ ] **Refresh token system** - Secure token rotation
- [ ] **Protected routes** - Admin-only endpoint protection
- [ ] **Integration tests** - Comprehensive auth flow testing

### Key Files Structure
```
apps/backend/src/
├── lib/prisma.ts          # Singleton DB client
├── routes/auth.ts         # Registration endpoint
├── app.ts                 # Express setup
└── server.ts              # Server startup
```

### Environment Setup
```
DATABASE_URL="postgresql://app_user:dev_password_123@localhost:5432/animation_app"
PORT=3001
```

### Professional Patterns Implemented
- **Singleton pattern** for database connections
- **Role-based access control** with enum types
- **Professional error handling** with proper HTTP codes
- **Input validation** and security best practices
- **Docker environment isolation** for development

## 🤔 Key Questions for Next Session
1. How should JWT tokens be structured for role-based access?
2. What's the security difference between access and refresh tokens?
3. How do you test authentication flows professionally?
4. What middleware patterns protect admin routes?
5. How do you handle token expiration gracefully?

---

**Ready for:** Login implementation, JWT generation, protected routes, testing strategy
**Architecture:** Professional foundation complete, auth system 50% done
**Next Focus:** Complete authentication system before moving to portfolio management
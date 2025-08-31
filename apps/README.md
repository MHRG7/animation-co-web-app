# Apps

This directory contains the main applications of our monorepo.

## Structure

- **backend/**: Express.js API server with TypeScript
  - Authentication and authorization
  - RESTful API endpoints
  - Database integration with Prisma
  - File upload and processing

- **frontend/**: React application with Vite and TypeScript
  - Public portfolio showcase
  - Admin dashboard for content management
  - Responsive design with Tailwind CSS
  - State management with TanStack Query

## Development Commands

Each app has its own `package.json` and can be run independently during development. Use the workspace commands from the root to run multiple apps simultaneously.
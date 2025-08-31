# Packages

This directory contains shared code and utilities that can be used across multiple applications in our monorepo.

## Structure

- **shared-types/**: TypeScript type definitions and interfaces shared between frontend and backend
  - API request/response types
  - Database entity types
  - Common enums and constants

- **ui-components/**: Reusable React components with TypeScript
  - Form components with validation
  - Layout and navigation components
  - Data display components
  - Loading and error state components

- **utils/**: Common utility functions and helpers
  - Date and time formatting
  - Validation functions
  - API helpers
  - Configuration utilities

## Usage

Each package exports its functionality through an `index.ts` file and can be imported by the apps using workspace references. This promotes code reuse and maintains consistency across the application.
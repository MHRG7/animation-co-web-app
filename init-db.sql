-- This script runs automatically when PostgreSQL container first starts
-- Creates the test database for running integration tests

-- Check if test database exists, create if not
SELECT 'CREATE DATABASE animation_app_test'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'animation_app_test')\gexec

-- Grant all provileges to app_user
GRANT ALL PRIVILEGES ON DATABASE animation_app_test TO app_user;
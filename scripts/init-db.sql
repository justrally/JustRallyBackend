-- Initialize local development database
-- This script runs when the PostgreSQL container starts

-- Create additional schemas if needed
-- CREATE SCHEMA IF NOT EXISTS app;

-- Set default permissions
GRANT ALL PRIVILEGES ON DATABASE "dev-db" TO justrally_user;

-- Create extensions if needed
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- The Prisma migrations will handle table creation
-- PostgreSQL Database Setup Script
-- Run this script after installing PostgreSQL

-- Create production database
CREATE DATABASE meetup_clone;

-- Create test database
CREATE DATABASE meetup_clone_test;

-- Grant privileges to postgres user (adjust if using different user)
GRANT ALL PRIVILEGES ON DATABASE meetup_clone TO postgres;
GRANT ALL PRIVILEGES ON DATABASE meetup_clone_test TO postgres;

-- Connect to production database and create extensions if needed
\c meetup_clone;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Connect to test database and create extensions if needed
\c meetup_clone_test;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Show created databases
\l

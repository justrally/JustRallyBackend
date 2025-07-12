# JustRally Backend

Node.js monorepo with NestJS authentication API for the JustRally platform.

## Architecture

- **Monorepo Structure**: npm workspaces with shared libraries
- **Authentication API**: NestJS service with Firebase auth integration
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Google Cloud Run with automated CI/CD

## Status

✅ CI Pipeline: Passing  
🚀 Deployment: Ready for testing

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test
```

## Services

- **auth-api**: Authentication and user management
- **shared**: Common types and utilities  
- **prisma**: Database schema and client

## Infrastructure

- **Development**: justrallydev GCP project
- **Production**: justrallyprod GCP project
- **Database**: Cloud SQL PostgreSQL
- **Container Registry**: Artifact Registry# Last updated: Sat Jul 12 15:09:42 PDT 2025

# JustRally Backend - Task List for Claude

## Prerequisites
Before starting implementation, Claude will need the following information:

### Required Information
1. **GCP Project IDs**
   - Development project ID
   - Production project ID
   - Billing account ID
   - Preferred region (default: us-central1)

2. **Firebase Configuration**
   - Development Firebase project ID
   - Production Firebase project ID
   - iOS bundle identifier

3. **GitHub Repository**
   - Repository name
   - GitHub username/organization

4. **Domain Names**
   - Production API domain
   - Development API domain

5. **Database Names**
   - Development database name
   - Production database name

## Implementation Tasks

### Phase 1: Project Setup (Day 1)

#### 1.1 Repository Initialization
- [ ] Create new GitHub repository
- [ ] Clone repository locally
- [ ] Initialize npm monorepo with workspaces
- [ ] Create base folder structure
- [ ] Setup .gitignore file
- [ ] Initial commit

#### 1.2 Development Environment Setup
- [ ] Configure TypeScript (tsconfig.json)
- [ ] Setup ESLint with TypeScript rules
- [ ] Configure Prettier
- [ ] Setup Husky pre-commit hooks
- [ ] Configure commitlint
- [ ] Create workspace configuration

#### 1.3 Shared Libraries Setup
- [ ] Create libs/shared workspace
- [ ] Setup TypeScript configuration for shared lib
- [ ] Create utility functions module
- [ ] Create types/interfaces module
- [ ] Export shared modules

### Phase 2: Database & Prisma Setup (Day 1-2)

#### 2.1 Prisma Configuration
- [ ] Create libs/prisma workspace
- [ ] Install Prisma dependencies
- [ ] Initialize Prisma with PostgreSQL
- [ ] Create schema.prisma with User and RefreshToken models
- [ ] Configure database connection strings
- [ ] Generate Prisma client

#### 2.2 Database Setup Scripts
- [ ] Create Cloud SQL instance creation script
- [ ] Create database initialization script
- [ ] Create migration runner script
- [ ] Create seed data script
- [ ] Document database setup process

### Phase 3: Auth API Development (Day 2-3)

#### 3.1 NestJS Setup
- [ ] Create apps/auth-api workspace
- [ ] Initialize NestJS application
- [ ] Configure module structure
- [ ] Setup environment configuration
- [ ] Create main.ts with proper configuration

#### 3.2 Core Services
- [ ] Create Firebase service module
- [ ] Implement Firebase Admin SDK integration
- [ ] Create JWT service with RS256
- [ ] Create Prisma service module
- [ ] Create user service (CRUD operations)
- [ ] Create refresh token service

#### 3.3 Auth Module Implementation
- [ ] Create auth module structure
- [ ] Implement auth controller
- [ ] Create DTOs for auth endpoints
- [ ] Implement /auth/login endpoint
- [ ] Implement /auth/refresh endpoint
- [ ] Implement /auth/logout endpoint
- [ ] Implement /auth/verify endpoint

#### 3.4 Middleware & Guards
- [ ] Create JWT authentication guard
- [ ] Create validation middleware
- [ ] Create error handling middleware
- [ ] Create logging middleware
- [ ] Configure global exception filter

#### 3.5 API Features
- [ ] Add health check endpoint
- [ ] Add API versioning
- [ ] Create Swagger documentation
- [ ] Add request validation pipes
- [ ] Configure rate limiting

### Phase 4: Docker & Local Development (Day 3)

#### 4.1 Docker Configuration
- [ ] Create Dockerfile for auth-api
- [ ] Create docker-compose.yml for local development
- [ ] Add Cloud SQL proxy to docker-compose
- [ ] Create .dockerignore file
- [ ] Test Docker build

#### 4.2 Local Development Setup
- [ ] Create local environment files
- [ ] Setup local database connection
- [ ] Create development scripts
- [ ] Document local setup process
- [ ] Test full local environment

### Phase 5: GCP Infrastructure (Day 4)

#### 5.1 GCP Project Setup
- [ ] Create setup script for GCP projects
- [ ] Enable required APIs script
- [ ] Create service accounts script
- [ ] Setup IAM permissions script
- [ ] Configure Secret Manager script

#### 5.2 Cloud SQL Setup
- [ ] Create Cloud SQL instances script
- [ ] Configure database users script
- [ ] Setup connection security script
- [ ] Configure backups script
- [ ] Test database connections

#### 5.3 Cloud Run Configuration
- [ ] Create Cloud Run service script
- [ ] Configure service settings script
- [ ] Setup environment variables script
- [ ] Configure Cloud SQL connections script
- [ ] Test deployment manually

### Phase 6: CI/CD Pipeline (Day 4-5)

#### 6.1 GitHub Actions - CI Workflow
- [ ] Create .github/workflows/ci.yml
- [ ] Configure Node.js setup
- [ ] Add dependency caching
- [ ] Configure linting step
- [ ] Configure testing step
- [ ] Configure build step

#### 6.2 GitHub Actions - Dev Deployment
- [ ] Create .github/workflows/deploy-dev.yml
- [ ] Configure GCP authentication
- [ ] Add Prisma migration step
- [ ] Configure Docker build and push
- [ ] Configure Cloud Run deployment
- [ ] Add health check verification

#### 6.3 GitHub Actions - Prod Deployment
- [ ] Create .github/workflows/deploy-prod.yml
- [ ] Configure manual approval
- [ ] Add production safeguards
- [ ] Configure rollback mechanism
- [ ] Add deployment notifications

#### 6.4 GitHub Secrets Setup
- [ ] Document required secrets
- [ ] Create secrets setup script
- [ ] Configure branch protection
- [ ] Setup deployment environments
- [ ] Test full CI/CD pipeline

### Phase 7: Testing (Day 5)

#### 7.1 Unit Tests
- [ ] Setup Jest configuration
- [ ] Write tests for JWT service
- [ ] Write tests for user service
- [ ] Write tests for auth service
- [ ] Achieve 70% code coverage

#### 7.2 Integration Tests
- [ ] Setup Supertest
- [ ] Write tests for auth endpoints
- [ ] Test error scenarios
- [ ] Test token refresh flow
- [ ] Test database operations

### Phase 8: Documentation (Day 5)

#### 8.1 API Documentation
- [ ] Configure Swagger/OpenAPI
- [ ] Document all endpoints
- [ ] Add request/response examples
- [ ] Document error codes
- [ ] Create API usage guide

#### 8.2 Deployment Documentation
- [ ] Create deployment README
- [ ] Document environment variables
- [ ] Create troubleshooting guide
- [ ] Document rollback procedures
- [ ] Create architecture diagram

### Phase 9: Security & Monitoring (Day 5)

#### 9.1 Security Configuration
- [ ] Configure HTTPS/SSL
- [ ] Setup domain mapping
- [ ] Configure security headers
- [ ] Review and fix security issues
- [ ] Document security practices

#### 9.2 Monitoring Setup
- [ ] Configure Google Cloud Logging
- [ ] Setup error tracking
- [ ] Create monitoring dashboard
- [ ] Configure alerts
- [ ] Test monitoring setup

## Deliverables Checklist

### Code Deliverables
- [ ] Complete monorepo with all services
- [ ] Fully functional auth-api service
- [ ] Database schema and migrations
- [ ] Docker configuration files
- [ ] CI/CD pipeline configurations

### Documentation Deliverables
- [ ] API documentation (Swagger)
- [ ] Deployment guide
- [ ] Local development guide
- [ ] Architecture documentation
- [ ] Security guidelines

### Infrastructure Deliverables
- [ ] GCP projects configured
- [ ] Cloud SQL databases running
- [ ] Cloud Run services deployed
- [ ] Domains mapped with SSL
- [ ] CI/CD pipelines operational

### Testing Deliverables
- [ ] Unit tests with 70%+ coverage
- [ ] Integration tests for all endpoints
- [ ] Test data and fixtures
- [ ] Testing documentation

## Success Criteria

1. **Authentication Flow Works End-to-End**
   - iOS app can authenticate with Firebase
   - Backend validates Firebase tokens
   - JWT tokens are issued correctly
   - Token refresh works properly

2. **Infrastructure is Stable**
   - Both environments are accessible
   - Databases are connected properly
   - SSL certificates are valid
   - Monitoring is operational

3. **CI/CD is Automated**
   - Code changes trigger CI checks
   - Merges to main deploy to dev
   - Production deployments work
   - Rollbacks are possible

4. **Code Quality Standards Met**
   - All tests pass
   - Code coverage above 70%
   - No linting errors
   - Documentation is complete
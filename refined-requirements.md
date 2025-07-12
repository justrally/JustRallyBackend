# JustRally Backend MVP - Refined Requirements

## Project Overview
Create a monorepo backend with authentication API service that validates Firebase tokens and issues JWTs, deployed to GCP with CI/CD pipeline. iOS native app built with SwiftUI.

## Phase 1: Information Gathering & Setup

### 1.1 GCP Setup Information
- [ ] GCP Project ID for development
- [ ] GCP Project ID for production
- [ ] GCP billing account ID
- [ ] GCP region preference (e.g., us-central1)
- [ ] Service account permissions needed

### 1.2 Firebase Setup Information
- [ ] Firebase project ID for development
- [ ] Firebase project ID for production
- [ ] Firebase service account keys location
- [ ] Firebase configuration (API keys, auth domain)
- [ ] iOS bundle identifier

### 1.3 GitHub Setup Information
- [ ] GitHub repository name
- [ ] GitHub organization/username
- [ ] Branch protection rules preference

### 1.4 Domain Information
- [ ] Production API domain (e.g., api.justrally.com)
- [ ] Development API domain (e.g., api-dev.justrally.com)
- [ ] SSL certificate preference (managed by GCP)

### 1.5 Database Information
- [ ] Cloud SQL instance names (dev & prod)
- [ ] Database names
- [ ] Preferred PostgreSQL version (e.g., 15)
- [ ] Initial database size requirements

## Phase 2: MVP Architecture

### 2.1 Monorepo Structure (Backend)
```
justrally-backend/
├── apps/
│   └── auth-api/           # Authentication service
├── libs/
│   ├── shared/             # Shared utilities, types
│   └── prisma/             # Prisma schema and client
│       ├── schema.prisma
│       └── migrations/
├── docker/
│   └── Dockerfile.auth
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── deploy-dev.yml
│       └── deploy-prod.yml
└── config/
    ├── dev/
    └── prod/
```

### 2.2 Authentication Flow
1. **iOS Client (SwiftUI):**
   - User enters phone number
   - Firebase SDK sends OTP
   - User enters OTP code
   - Firebase verifies and returns ID token

2. **Backend flow:**
   - iOS app sends Firebase ID token to auth-api
   - Auth API validates Firebase token
   - Auth API creates/updates user in PostgreSQL
   - Auth API returns JWT tokens
   - iOS app stores tokens in Keychain

### 2.3 JWT Token Refresh Strategy

**Token Lifetimes:**
- Access Token: 15 minutes
- Refresh Token: 7 days

**iOS Token Storage (SwiftUI):**

```swift
import KeychainAccess

class TokenManager {
    private let keychain = Keychain(service: "com.justrally.app")
    
    func saveTokens(accessToken: String, refreshToken: String, expiresIn: Int) {
        keychain["accessToken"] = accessToken
        keychain["refreshToken"] = refreshToken
        keychain["tokenExpiry"] = String(Date().timeIntervalSince1970 + Double(expiresIn))
    }
    
    func getAccessToken() async throws -> String {
        guard let expiryString = keychain["tokenExpiry"],
              let expiry = Double(expiryString) else {
            throw TokenError.notFound
        }
        
        // Refresh if token expires in less than 1 minute
        if Date().timeIntervalSince1970 > expiry - 60 {
            try await refreshAccessToken()
        }
        
        guard let token = keychain["accessToken"] else {
            throw TokenError.notFound
        }
        return token
    }
    
    private func refreshAccessToken() async throws {
        guard let refreshToken = keychain["refreshToken"] else {
            throw TokenError.refreshTokenNotFound
        }
        
        // Call refresh endpoint
        let response = try await APIClient.shared.refreshToken(refreshToken)
        saveTokens(accessToken: response.accessToken, 
                  refreshToken: refreshToken, 
                  expiresIn: response.expiresIn)
    }
}
```

**iOS API Client:**
```swift
class APIClient {
    func request<T: Decodable>(_ endpoint: Endpoint) async throws -> T {
        var request = URLRequest(url: endpoint.url)
        
        // Auto-refresh and add token
        let token = try await TokenManager.shared.getAccessToken()
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        
        let (data, response) = try await URLSession.shared.data(for: request)
        
        // Handle 401 and retry once
        if let httpResponse = response as? HTTPURLResponse,
           httpResponse.statusCode == 401 {
            try await TokenManager.shared.refreshAccessToken()
            return try await request(endpoint)
        }
        
        return try JSONDecoder().decode(T.self, from: data)
    }
}
```

**Backend Token Handling:**
- Access tokens are stateless (JWT)
- Refresh tokens stored in PostgreSQL
- Validate refresh token from DB on refresh
- Generate new access token with user claims

### 2.4 Database Schema

**Prisma Schema:**
```prisma
model User {
  id          String   @id @default(uuid())
  firebaseUid String   @unique
  phone       String   @unique
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  refreshTokens RefreshToken[]
}

model RefreshToken {
  id        String   @id @default(uuid())
  token     String   @unique
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  expiresAt DateTime
  createdAt DateTime @default(now())
  
  @@index([token])
  @@index([userId])
}
```

## Phase 3: Technical Requirements

### 3.1 Auth API Service (NestJS)
- **Endpoints:**
  - `POST /auth/login` - Exchange Firebase token for JWT
    - Body: `{ firebaseToken: string }`
    - Response: `{ accessToken: string, refreshToken: string, expiresIn: number }`
    - Creates/updates user in DB
    - Stores refresh token in DB
  - `POST /auth/refresh` - Refresh JWT token
    - Body: `{ refreshToken: string }`
    - Response: `{ accessToken: string, expiresIn: number }`
    - Validates refresh token from DB
  - `POST /auth/logout` - Invalidate refresh token
    - Headers: `Authorization: Bearer <token>`
    - Deletes refresh token from DB
  - `GET /auth/verify` - Verify JWT validity
    - Headers: `Authorization: Bearer <token>`
    - Response: `{ valid: boolean, user: { uid: string, phone: string } }`

- **JWT Payload Structure:**
  ```typescript
  {
    uid: string;        // Firebase user ID
    userId: string;     // Database user ID
    phone: string;      // User's phone number
    iat: number;        // Issued at
    exp: number;        // Expiration
    type: 'access';     // Token type
  }
  ```

### 3.2 Infrastructure
- **Development Environment**
  - GCP Cloud Run for auth-api
  - Cloud SQL PostgreSQL (dev instance)
  - Firebase Auth (dev project)
  - Development domain with SSL
  - Cloud SQL Proxy for local development

- **Production Environment**
  - GCP Cloud Run with autoscaling
  - Cloud SQL PostgreSQL (prod instance)
  - Firebase Auth (prod project)
  - Production domain with SSL
  - Private IP connection to Cloud SQL

### 3.3 Database Setup
- **Cloud SQL Configuration:**
  - PostgreSQL 15
  - Dev: db-f1-micro (1 vCPU, 0.6 GB)
  - Prod: db-n1-standard-1 (1 vCPU, 3.75 GB)
  - Automated backups
  - Private IP for production
  - Public IP for development (with authorized networks)

- **Prisma Configuration:**
  - Database connection via environment variables
  - Connection pooling
  - Migration management
  - Seeding for development

### 3.4 CI/CD Pipeline
- **On Push to Feature Branch**
  - Run linting (ESLint)
  - Run formatting check (Prettier)
  - Run unit tests
  - Build Docker image

- **On Merge to Main**
  - All above checks
  - Run Prisma migrations on dev DB
  - Deploy to development environment
  - Run health checks

- **On Tag/Release**
  - All above checks
  - Run Prisma migrations on prod DB
  - Deploy to production environment
  - Run health checks

### 3.5 Security Requirements
- JWT tokens signed with RS256 algorithm
- Private/public key pair for JWT signing
- Secure refresh token generation (crypto.randomBytes)
- Database connection via SSL
- Input validation on all endpoints
- CORS configuration (not needed for native iOS)
- Environment variables via GCP Secret Manager
- Firebase service account key management
- Authorization middleware for protected endpoints

## Phase 4: Development Setup

### 4.1 Code Quality
- TypeScript
- ESLint + Prettier
- Husky pre-commit hooks
- Conventional commits

### 4.2 Testing
- Jest for unit tests
- Supertest for API endpoint testing
- Minimum 70% code coverage

## Phase 5: Implementation Tasks

### 5.1 Initial Setup
1. Create GitHub repository
2. Initialize monorepo with npm workspaces
3. Setup TypeScript configuration
4. Configure ESLint and Prettier
5. Setup Husky and commitlint

### 5.2 GCP & Firebase Setup
1. Create GCP projects (dev & prod)
2. Enable required GCP APIs
3. Create Firebase projects
4. Add iOS app to Firebase projects
5. Download GoogleService-Info.plist files
6. Generate service account keys
7. Setup GCP Secret Manager
8. Generate RSA key pairs for JWT signing

### 5.3 Database Setup
1. Create Cloud SQL instances (dev & prod)
2. Create databases
3. Setup connection security
4. Configure Cloud SQL Proxy
5. Setup Prisma in monorepo
6. Create initial schema
7. Run initial migration

### 5.4 Auth API Development
1. Create NestJS auth-api app
2. Setup Firebase Admin SDK
3. Setup Prisma client
4. Create JWT service with RS256 signing
5. Implement user service (create/update)
6. Implement refresh token service
7. Implement /auth/login endpoint
8. Implement /auth/refresh endpoint
9. Implement /auth/logout endpoint
10. Implement /auth/verify endpoint
11. Add authorization middleware
12. Add error handling middleware
13. Add health check endpoint

### 5.5 Docker & Deployment
1. Create Dockerfile for auth-api
2. Setup Cloud Run services
3. Configure Cloud SQL connections
4. Configure domain mapping
5. Setup SSL certificates

### 5.6 CI/CD Pipeline
1. Create GitHub Actions workflow for CI
2. Create deployment workflow for dev
3. Create deployment workflow for prod
4. Setup GitHub secrets
5. Configure Prisma migrations in CI/CD

### 5.7 Testing & Documentation
1. Write unit tests for auth service
2. Write API endpoint tests
3. Create API documentation
4. Create deployment README
5. Create database migration guide

## iOS Client Implementation Guide

### Required Dependencies
```swift
// Package.swift or SPM
dependencies: [
    .package(url: "https://github.com/firebase/firebase-ios-sdk", from: "10.0.0"),
    .package(url: "https://github.com/kishikawakatsumi/KeychainAccess", from: "4.0.0")
]
```

### Firebase Setup in SwiftUI
```swift
import SwiftUI
import Firebase

@main
struct JustRallyApp: App {
    init() {
        FirebaseApp.configure()
    }
    
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
```

### Authentication View Model
```swift
class AuthViewModel: ObservableObject {
    @Published var isAuthenticated = false
    private let tokenManager = TokenManager()
    
    func sendOTP(phoneNumber: String) async {
        // Firebase phone auth
    }
    
    func verifyOTP(code: String) async throws {
        // Get Firebase ID token
        let firebaseToken = try await getFirebaseToken()
        
        // Exchange for JWT
        let response = try await APIClient.shared.login(firebaseToken: firebaseToken)
        
        // Save tokens
        tokenManager.saveTokens(
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            expiresIn: response.expiresIn
        )
        
        isAuthenticated = true
    }
    
    func logout() async throws {
        try await APIClient.shared.logout()
        tokenManager.clearTokens()
        isAuthenticated = false
    }
}
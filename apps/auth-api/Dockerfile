# Multi-stage build for production
FROM node:18-alpine AS base

# Build stage
FROM base AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/auth-api/package*.json ./apps/auth-api/
COPY libs/shared/package*.json ./libs/shared/
COPY libs/prisma/package*.json ./libs/prisma/

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy all files needed for build
COPY . .

# Generate Prisma client
RUN cd libs/prisma && npx prisma generate

# Build the shared library and auth-api
RUN npm run build --workspace=libs/shared
RUN npx tsc --project apps/auth-api/tsconfig.json

# Dependencies stage for production
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/auth-api/package*.json ./apps/auth-api/
COPY libs/shared/package*.json ./libs/shared/
COPY libs/prisma/package*.json ./libs/prisma/

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy built application
COPY --from=builder --chown=nestjs:nodejs /app/apps/auth-api/dist ./dist
COPY --from=deps --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nestjs:nodejs /app/package*.json ./

USER nestjs

EXPOSE 8080

ENV PORT=8080

CMD ["node", "dist/apps/auth-api/src/main.js"]
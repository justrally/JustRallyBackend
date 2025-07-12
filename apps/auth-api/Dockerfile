# Multi-stage build for production
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/auth-api/package*.json ./apps/auth-api/
COPY libs/shared/package*.json ./libs/shared/
COPY libs/prisma/package*.json ./libs/prisma/

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Build stage
FROM base AS builder
WORKDIR /app

# Copy all files needed for build
COPY . .
COPY --from=deps /app/node_modules ./node_modules

# Generate Prisma client
RUN cd libs/prisma && npx prisma generate

# Build the application
RUN npm run build

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy built application
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/libs/prisma/src/generated ./libs/prisma/src/generated
COPY --from=builder --chown=nestjs:nodejs /app/package*.json ./

USER nestjs

EXPOSE 8080

ENV PORT=8080

CMD ["node", "dist/apps/auth-api/src/main.js"]
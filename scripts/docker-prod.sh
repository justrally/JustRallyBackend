#!/bin/bash

# Production Docker build and run script

set -e

echo "🏭 Building JustRally Backend for Production"

# Build the production image
echo "🔨 Building production Docker image..."
docker build -f apps/auth-api/Dockerfile -t justrally/auth-api:latest .

echo "🧪 Testing production build..."
docker run --rm -d \
  --name auth-api-test \
  -p 8080:8080 \
  -e DATABASE_URL="postgresql://justrally_user:JustRally2024Prod!@34.56.12.203:5432/justrally_production?schema=public" \
  -e FIREBASE_PROJECT_ID="justrallyprod-51c2e" \
  -e JWT_PRIVATE_KEY="prod-secret-key" \
  -e JWT_PUBLIC_KEY="prod-secret-key" \
  -e NODE_ENV="production" \
  justrally/auth-api:latest

echo "⏳ Waiting for container to start..."
sleep 10

# Test health endpoint
echo "🔍 Testing health endpoint..."
if curl -f http://localhost:8080/api/v1/health > /dev/null 2>&1; then
    echo "✅ Production build test successful!"
else
    echo "❌ Production build test failed!"
    docker logs auth-api-test
    exit 1
fi

# Cleanup test container
docker stop auth-api-test

echo "🎉 Production image ready: justrally/auth-api:latest"
echo "📦 To push to registry: docker push justrally/auth-api:latest"
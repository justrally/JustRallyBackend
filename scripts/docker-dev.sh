#!/bin/bash

# Development Docker setup script

set -e

echo "🐳 Starting JustRally Backend Development Environment"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Function to handle cleanup
cleanup() {
    echo "🧹 Cleaning up..."
    docker-compose --profile dev down
}

# Set trap for cleanup
trap cleanup EXIT

# Start development environment
echo "🚀 Starting PostgreSQL database..."
docker-compose up -d postgres

echo "⏳ Waiting for database to be ready..."
sleep 10

# Run Prisma migrations
echo "🔄 Running database migrations..."
cd libs/prisma
DATABASE_URL="postgresql://justrally_user:localdev123@localhost:5432/dev-db?schema=public" npx prisma db push
cd ../..

echo "🎯 Starting development API server..."
docker-compose --profile dev up auth-api-dev

echo "✅ Development environment is ready!"
echo "📍 API: http://localhost:3000"
echo "📍 Health: http://localhost:3000/api/v1/health"
echo "📍 API Docs: http://localhost:3000/api/docs"
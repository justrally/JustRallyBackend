import { PrismaClient } from '@prisma/client';

// Global test setup
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_TEST || 'postgresql://test:test@localhost:5432/test_db?schema=public',
    },
  },
});

// Setup test database
beforeAll(async () => {
  // Connect to test database
  await prisma.$connect();
});

// Cleanup after tests
afterAll(async () => {
  // Clean up test data
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
  
  // Disconnect
  await prisma.$disconnect();
});

// Clean data between tests
beforeEach(async () => {
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
});

export { prisma };
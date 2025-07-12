import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';

const createLogger = (context: string) => ({
  info: (message: string, meta?: any) => console.log(`[${context}] ${message}`, meta ? JSON.stringify(meta) : ''),
  error: (message: string, meta?: any) => console.error(`[${context}] ${message}`, meta ? JSON.stringify(meta) : ''),
});

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = createLogger('PrismaService');

  async onModuleInit() {
    this.logger.info('Database service initialized (mock)');
  }

  async onModuleDestroy() {
    this.logger.info('Database service destroyed');
  }

  get client() {
    // Mock client for testing
    return {
      user: {
        findUnique: () => null,
        create: () => ({}),
        update: () => ({}),
      },
      refreshToken: {
        findUnique: () => null,
        create: () => ({}),
        delete: () => ({}),
        deleteMany: () => ({}),
      },
    };
  }
}
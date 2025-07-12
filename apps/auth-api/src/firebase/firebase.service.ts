import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const createLogger = (context: string) => ({
  info: (message: string, meta?: any) => console.log(`[${context}] ${message}`, meta ? JSON.stringify(meta) : ''),
  error: (message: string, meta?: any) => console.error(`[${context}] ${message}`, meta ? JSON.stringify(meta) : ''),
});

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = createLogger('FirebaseService');

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID');
    this.logger.info('Firebase service initialized (mock)', { projectId });
  }

  async verifyIdToken(idToken: string) {
    // Mock Firebase user for testing
    return {
      uid: 'test-firebase-uid',
      email: 'test@example.com',
      displayName: 'Test User',
      photoURL: null,
      phoneNumber: null,
      emailVerified: true,
    };
  }

  async getUserById(uid: string) {
    return {
      uid: uid,
      email: 'test@example.com',
      displayName: 'Test User',
      photoURL: null,
      phoneNumber: null,
      emailVerified: true,
    };
  }
}
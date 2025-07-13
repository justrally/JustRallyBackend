import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

const createLogger = (context: string) => ({
  info: (message: string, meta?: any) =>
    console.log(`[${context}] ${message}`, meta ? JSON.stringify(meta) : ''),
  error: (message: string, meta?: any) =>
    console.error(`[${context}] ${message}`, meta ? JSON.stringify(meta) : ''),
});

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = createLogger('FirebaseService');

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: this.configService.get<string>('FIREBASE_PROJECT_ID'),
      });
      this.logger.info('Firebase service initialized', {
        projectId: this.configService.get<string>('FIREBASE_PROJECT_ID'),
      });
    }
  }

  async verifyIdToken(idToken: string) {
    return admin.auth().verifyIdToken(idToken);
  }

  async getUserById(uid: string) {
    return admin.auth().getUser(uid);
  }
}

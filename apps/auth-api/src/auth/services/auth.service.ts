import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FirebaseService } from '../../firebase/firebase.service';
import { JwtService } from './jwt.service';

// Simple types for now
interface LoginRequest {
  firebaseToken: string;
}

interface User {
  id: string;
  firebaseUid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

const createLogger = (context: string) => ({
  info: (message: string, meta?: any) =>
    console.log(`[${context}] ${message}`, meta ? JSON.stringify(meta) : ''),
  error: (message: string, meta?: any) =>
    console.error(`[${context}] ${message}`, meta ? JSON.stringify(meta) : ''),
});

@Injectable()
export class AuthService {
  private readonly logger = createLogger('AuthService');

  constructor(
    private prismaService: PrismaService,
    private firebaseService: FirebaseService,
    private jwtService: JwtService,
  ) {}

  async login(loginRequest: LoginRequest) {
    try {
      // For now, create a mock response to test the service
      const mockUser: User = {
        id: 'test-user-123',
        firebaseUid: 'firebase-uid-123',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: undefined,
        phoneNumber: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const tokens = {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        expiresIn: 900,
      };

      this.logger.info('User login successful', { userId: mockUser.id, email: mockUser.email });

      return {
        user: mockUser,
        tokens,
      };
    } catch (error) {
      this.logger.error('Login failed', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw new UnauthorizedException('Login failed');
    }
  }

  async refresh(refreshRequest: { refreshToken: string }) {
    return {
      tokens: {
        accessToken: 'new-mock-access-token',
        refreshToken: 'new-mock-refresh-token',
        expiresIn: 900,
      },
    };
  }

  async logout(refreshToken: string): Promise<void> {
    this.logger.info('User logout successful');
  }

  async verify(accessToken: string): Promise<User> {
    return {
      id: 'test-user-123',
      firebaseUid: 'firebase-uid-123',
      email: 'test@example.com',
      displayName: 'Test User',
      photoURL: undefined,
      phoneNumber: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}

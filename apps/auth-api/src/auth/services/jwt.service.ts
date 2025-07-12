import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtService {
  constructor(private configService: ConfigService) {}

  generateAccessToken(payload: any): string {
    // Simple mock token for testing
    return 'mock.access.token';
  }

  generateRefreshToken(userId: string): { token: string; tokenId: string } {
    return {
      token: 'mock.refresh.token',
      tokenId: 'mock-token-id',
    };
  }

  verifyAccessToken(token: string): any {
    if (token === 'mock.access.token') {
      return {
        sub: 'test-user-123',
        email: 'test@example.com',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 900,
      };
    }
    throw new Error('Invalid access token');
  }

  verifyRefreshToken(token: string): any {
    if (token === 'mock.refresh.token') {
      return {
        sub: 'test-user-123',
        tokenId: 'mock-token-id',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 604800,
      };
    }
    throw new Error('Invalid refresh token');
  }
}
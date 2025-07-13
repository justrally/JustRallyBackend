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
      // 1. Verify Firebase ID token
      const firebaseUser = await this.firebaseService.verifyIdToken(loginRequest.firebaseToken);
      if (!firebaseUser || !firebaseUser.uid) {
        throw new UnauthorizedException('Invalid Firebase token');
      }

      // 2. Find or create user in DB by firebaseUid
      let user = await this.prismaService.user.findUnique({
        where: { firebaseUid: firebaseUser.uid },
      });
      if (!user) {
        user = await this.prismaService.user.create({
          data: {
            firebaseUid: firebaseUser.uid,
          },
        });
      }

      // 3. Generate real JWT tokens
      const accessTokenPayload = {
        sub: user.id,
        firebaseUid: user.firebaseUid,
        type: 'access',
      };
      const accessToken = this.jwtService.generateAccessToken(accessTokenPayload);
      const { token: refreshToken } = this.jwtService.generateRefreshToken(user.id);

      const tokens = {
        accessToken,
        refreshToken,
        expiresIn: 900, // 15 minutes
      };

      this.logger.info('User login successful', { userId: user.id });

      return {
        user,
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
    try {
      // 1. Verify the refresh token
      const payload = this.jwtService.verifyRefreshToken(refreshRequest.refreshToken);
      if (!payload || !payload.sub) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      // 2. Find the user
      const user = await this.prismaService.user.findUnique({ where: { id: payload.sub } });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      // 3. Generate new access token
      const accessTokenPayload = {
        sub: user.id,
        firebaseUid: user.firebaseUid,
        type: 'access',
      };
      const accessToken = this.jwtService.generateAccessToken(accessTokenPayload);
      return {
        tokens: {
          accessToken,
          expiresIn: 900,
        },
      };
    } catch (error) {
      this.logger.error('Token refresh failed', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(refreshToken: string): Promise<void> {
    this.logger.info('User logout successful');
  }

  async verify(accessToken: string): Promise<User> {
    try {
      // 1. Verify the access token
      const payload = this.jwtService.verifyAccessToken(accessToken);
      if (!payload || !payload.sub) {
        throw new UnauthorizedException('Invalid access token');
      }
      // 2. Find the user
      const user = await this.prismaService.user.findUnique({ where: { id: payload.sub } });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      return user;
    } catch (error) {
      this.logger.error('Token verification failed', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw new UnauthorizedException('Invalid access token');
    }
  }
}

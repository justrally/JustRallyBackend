import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { JWTPayload, RefreshTokenPayload } from '@justrally/shared';
import { JWT_CONFIG } from '@justrally/shared';

@Injectable()
export class JwtService {
  constructor(
    private configService: ConfigService,
    private nestJwtService: NestJwtService,
  ) {}

  generateAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp' | 'aud' | 'iss'>): string {
    const now = Math.floor(Date.now() / 1000);

    const jwtPayload: JWTPayload = {
      ...payload,
      iat: now,
      exp: now + 900, // 15 minutes
      aud: JWT_CONFIG.AUDIENCE,
      iss: JWT_CONFIG.ISSUER,
    };

    return this.nestJwtService.sign(jwtPayload, {
      algorithm: JWT_CONFIG.ALGORITHM,
      expiresIn: JWT_CONFIG.ACCESS_TOKEN_EXPIRY,
    });
  }

  generateRefreshToken(userId: string): { token: string; tokenId: string } {
    const tokenId = `refresh_${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = Math.floor(Date.now() / 1000);

    const payload: RefreshTokenPayload = {
      sub: userId,
      tokenId,
      iat: now,
      exp: now + 604800, // 7 days
    };

    const token = this.nestJwtService.sign(payload, {
      algorithm: JWT_CONFIG.ALGORITHM,
      expiresIn: JWT_CONFIG.REFRESH_TOKEN_EXPIRY,
    });

    return { token, tokenId };
  }

  verifyAccessToken(token: string): JWTPayload {
    try {
      const payload = this.nestJwtService.verify(token, {
        algorithms: [JWT_CONFIG.ALGORITHM],
        audience: JWT_CONFIG.AUDIENCE,
        issuer: JWT_CONFIG.ISSUER,
      }) as JWTPayload;

      // Additional validation
      if (!payload.sub || !payload.email) {
        throw new UnauthorizedException('Invalid token payload');
      }

      return payload;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid access token');
    }
  }

  verifyRefreshToken(token: string): RefreshTokenPayload {
    try {
      const payload = this.nestJwtService.verify(token, {
        algorithms: [JWT_CONFIG.ALGORITHM],
      }) as RefreshTokenPayload;

      // Additional validation
      if (!payload.sub || !payload.tokenId) {
        throw new UnauthorizedException('Invalid refresh token payload');
      }

      return payload;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}

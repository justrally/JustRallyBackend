import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { JwtService } from './jwt.service';
import { JWT_CONFIG } from '@justrally/shared';

describe('JwtService', () => {
  let service: JwtService;
  let configService: ConfigService;
  let nestJwtService: NestJwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'JWT_PRIVATE_KEY':
                  return 'test-private-key';
                case 'JWT_PUBLIC_KEY':
                  return 'test-public-key';
                default:
                  return undefined;
              }
            }),
          },
        },
        {
          provide: NestJwtService,
          useValue: {
            sign: jest.fn((payload: any, options?: any) => {
              // Mock JWT token generation
              const header = { alg: JWT_CONFIG.ALGORITHM, typ: 'JWT' };
              const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
              const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
              const signature = 'mock-signature';
              return `${encodedHeader}.${encodedPayload}.${signature}`;
            }),
            verify: jest.fn((token: string, options?: any) => {
              // Mock JWT token verification
              if (token === 'invalid-token') {
                throw new Error('Invalid token');
              }

              // Parse the mock token
              const parts = token.split('.');
              if (parts.length !== 3) {
                throw new Error('Invalid token format');
              }

              try {
                const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
                return payload;
              } catch {
                throw new Error('Invalid token payload');
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
    nestJwtService = module.get<NestJwtService>(NestJwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateAccessToken', () => {
    it('should generate a valid access token', () => {
      const payload = {
        sub: 'user-123',
        email: 'test@example.com',
      };

      const token = service.generateAccessToken(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT format
      expect(nestJwtService.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          sub: payload.sub,
          email: payload.email,
          aud: JWT_CONFIG.AUDIENCE,
          iss: JWT_CONFIG.ISSUER,
        }),
        expect.objectContaining({
          algorithm: JWT_CONFIG.ALGORITHM,
          expiresIn: JWT_CONFIG.ACCESS_TOKEN_EXPIRY,
        }),
      );
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a refresh token with tokenId', () => {
      const userId = 'user-123';

      const result = service.generateRefreshToken(userId);

      expect(result).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.tokenId).toBeDefined();
      expect(typeof result.token).toBe('string');
      expect(typeof result.tokenId).toBe('string');
      expect(result.tokenId).toContain('refresh_');
      expect(result.tokenId).toContain(userId);
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify a valid access token', () => {
      const payload = {
        sub: 'user-123',
        email: 'test@example.com',
      };

      const token = service.generateAccessToken(payload);
      const verified = service.verifyAccessToken(token);

      expect(verified.sub).toBe(payload.sub);
      expect(verified.email).toBe(payload.email);
      expect(verified.aud).toBe(JWT_CONFIG.AUDIENCE);
      expect(verified.iss).toBe(JWT_CONFIG.ISSUER);
    });

    it('should throw error for invalid token', () => {
      expect(() => {
        service.verifyAccessToken('invalid-token');
      }).toThrow('Invalid access token');
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify a valid refresh token', () => {
      const userId = 'user-123';
      const { token, tokenId } = service.generateRefreshToken(userId);

      const verified = service.verifyRefreshToken(token);

      expect(verified.sub).toBe(userId);
      expect(verified.tokenId).toBe(tokenId);
    });

    it('should throw error for invalid refresh token', () => {
      expect(() => {
        service.verifyRefreshToken('invalid-token');
      }).toThrow('Invalid refresh token');
    });
  });
});

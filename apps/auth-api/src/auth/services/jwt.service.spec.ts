import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from './jwt.service';

describe('JwtService', () => {
  let service: JwtService;
  let configService: ConfigService;

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
      ],
    }).compile();

    service = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateAccessToken', () => {
    it('should generate a valid access token', () => {
      const payload = {
        sub: 'user-123',
        email: 'test@example.com',
        aud: 'justrally-app',
        iss: 'justrally-auth',
      };

      const token = service.generateAccessToken(payload);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT format
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
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify a valid access token', () => {
      const payload = {
        sub: 'user-123',
        email: 'test@example.com',
        aud: 'justrally-app',
        iss: 'justrally-auth',
      };

      const token = service.generateAccessToken(payload);
      const verified = service.verifyAccessToken(token);

      expect(verified.sub).toBe(payload.sub);
      expect(verified.email).toBe(payload.email);
      expect(verified.aud).toBe(payload.aud);
      expect(verified.iss).toBe(payload.iss);
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
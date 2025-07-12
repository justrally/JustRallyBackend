import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
    refresh: jest.fn(),
    logout: jest.fn(),
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return login response on successful login', async () => {
      const loginDto = { firebaseToken: 'valid-firebase-token' };
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: null,
        phoneNumber: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const mockTokens = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        expiresIn: 900,
      };
      const mockResponse = { user: mockUser, tokens: mockTokens };

      mockAuthService.login.mockResolvedValue(mockResponse);

      const result = await controller.login(loginDto);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResponse);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });

    it('should return error response on login failure', async () => {
      const loginDto = { firebaseToken: 'invalid-firebase-token' };
      
      mockAuthService.login.mockRejectedValue(new Error('Invalid token'));

      const result = await controller.login(loginDto);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('refresh', () => {
    it('should return new tokens on successful refresh', async () => {
      const refreshDto = { refreshToken: 'valid-refresh-token' };
      const mockTokens = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        expiresIn: 900,
      };
      const mockResponse = { tokens: mockTokens };

      mockAuthService.refresh.mockResolvedValue(mockResponse);

      const result = await controller.refresh(refreshDto);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResponse);
      expect(authService.refresh).toHaveBeenCalledWith(refreshDto);
    });
  });

  describe('logout', () => {
    it('should return success response on logout', async () => {
      const logoutDto = { refreshToken: 'refresh-token' };

      mockAuthService.logout.mockResolvedValue(undefined);

      const result = await controller.logout(logoutDto);

      expect(result.success).toBe(true);
      expect(result.data.message).toBe('Logout successful');
      expect(authService.logout).toHaveBeenCalledWith(logoutDto.refreshToken);
    });
  });

  describe('verify', () => {
    it('should return user data on valid token', async () => {
      const authorization = 'Bearer valid-access-token';
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: null,
        phoneNumber: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockAuthService.verify.mockResolvedValue(mockUser);

      const result = await controller.verify(authorization);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockUser);
      expect(authService.verify).toHaveBeenCalledWith('valid-access-token');
    });

    it('should return error when no authorization header', async () => {
      const result = await controller.verify('');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
import { Controller, Post, Body, Get, UseGuards, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './services/auth.service';
import { LoginDto, RefreshDto, LogoutDto } from './dto/auth.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

// Simple response helpers
const createSuccessResponse = (data: any) => ({
  success: true,
  data,
  timestamp: new Date().toISOString(),
});

const createErrorResponse = (error: any) => ({
  success: false,
  error,
  timestamp: new Date().toISOString(),
});

const commonErrors = {
  UNAUTHORIZED: { code: 'UNAUTHORIZED', message: 'Authentication required' },
};

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login with Firebase token' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid Firebase token' })
  async login(@Body() loginDto: LoginDto) {
    try {
      const result = await this.authService.login(loginDto);
      return createSuccessResponse(result);
    } catch (error) {
      return createErrorResponse(commonErrors.UNAUTHORIZED);
    }
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refresh(@Body() refreshDto: RefreshDto) {
    try {
      const result = await this.authService.refresh(refreshDto);
      return createSuccessResponse(result);
    } catch (error) {
      return createErrorResponse(commonErrors.UNAUTHORIZED);
    }
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout and invalidate refresh token' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  async logout(@Body() logoutDto: LogoutDto) {
    await this.authService.logout(logoutDto.refreshToken);
    return createSuccessResponse({ message: 'Logout successful' });
  }

  @Get('verify')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify access token and get user info' })
  @ApiResponse({ status: 200, description: 'Token is valid' })
  @ApiResponse({ status: 401, description: 'Invalid or expired token' })
  async verify(@Headers('authorization') authorization: string) {
    try {
      const token = authorization?.replace('Bearer ', '');
      if (!token) {
        return createErrorResponse(commonErrors.UNAUTHORIZED);
      }

      const user = await this.authService.verify(token);
      return createSuccessResponse(user);
    } catch (error) {
      return createErrorResponse(commonErrors.UNAUTHORIZED);
    }
  }
}

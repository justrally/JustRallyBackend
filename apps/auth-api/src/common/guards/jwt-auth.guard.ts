import { Injectable, UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Bypass authentication in local development
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV !== 'production') {
      const request = context.switchToHttp().getRequest();
      // Mock user for local testing
      request.user = {
        id: 'test-user-123',
        email: 'test@example.com',
        displayName: 'Test User'
      };
      return true;
    }
    
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw err || new UnauthorizedException('Invalid or expired token');
    }
    return user;
  }
}
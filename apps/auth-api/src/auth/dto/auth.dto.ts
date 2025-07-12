import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Firebase ID token from client authentication',
    example: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjY5ZGE...',
  })
  @IsString()
  @IsNotEmpty()
  firebaseToken!: string;
}

export class RefreshDto {
  @ApiProperty({
    description: 'Refresh token to generate new access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}

export class LogoutDto {
  @ApiProperty({
    description: 'Refresh token to invalidate',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}
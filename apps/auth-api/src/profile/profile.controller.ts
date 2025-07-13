import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Req,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { createSuccessResponse } from '@justrally/shared';

@ApiTags('Profile')
@Controller('api/v1/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: ProfileResponseDto,
  })
  async getMyProfile(@Req() req: any) {
    const profile = await this.profileService.getProfile(req.user.id);
    return createSuccessResponse(profile);
  }

  @Put('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    type: ProfileResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Username already taken',
  })
  async updateMyProfile(
    @Req() req: any,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const updatedProfile = await this.profileService.updateProfile(
      req.user.id,
      updateProfileDto,
    );
    return createSuccessResponse(updatedProfile);
  }

  @Get('username/availability')
  @ApiOperation({ summary: 'Check username availability' })
  @ApiQuery({ name: 'username', required: true, description: 'Username to check' })
  @ApiResponse({
    status: 200,
    description: 'Username availability checked',
    schema: {
      properties: {
        available: { type: 'boolean' },
      },
    },
  })
  async checkUsernameAvailability(@Query('username') username: string) {
    const result = await this.profileService.checkUsernameAvailability(username);
    return createSuccessResponse(result);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get user profile by ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: ProfileResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async getUserProfile(@Param('userId') userId: string) {
    const profile = await this.profileService.getProfile(userId);
    return createSuccessResponse(profile);
  }

  @Put('me/photo')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update profile photo URL' })
  @ApiResponse({
    status: 200,
    description: 'Profile photo updated successfully',
    type: ProfileResponseDto,
  })
  async updateProfilePhoto(
    @Req() req: any,
    @Body('photoURL') photoURL: string,
  ) {
    const updatedProfile = await this.profileService.uploadProfilePhoto(
      req.user.id,
      photoURL,
    );
    return createSuccessResponse(updatedProfile);
  }
}
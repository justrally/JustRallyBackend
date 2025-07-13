import { Controller, Get, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto, updateProfileSchema } from './dto/update-profile.dto';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async getProfile(@Request() req: any): Promise<{ user: ProfileResponseDto; completed: boolean }> {
    return this.profileService.getProfile(req.user.id);
  }

  @Put()
  async updateProfile(
    @Request() req: any,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<ProfileResponseDto> {
    // Validate with Zod
    const validatedData = updateProfileSchema.parse(updateProfileDto);
    return this.profileService.updateProfile(req.user.id, validatedData);
  }

  @Get('username/check/:username')
  async checkUsernameAvailability(
    @Param('username') username: string,
  ): Promise<{ available: boolean }> {
    return this.profileService.checkUsernameAvailability(username);
  }
}

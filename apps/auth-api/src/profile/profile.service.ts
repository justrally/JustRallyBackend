import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { isNil } from 'lodash';
@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string): Promise<{ user: ProfileResponseDto; completed: boolean }> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
        deleted: false,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const completed =
      !isNil(user.birthday) &&
      !isNil(user.gender) &&
      !isNil(user.tennisLevel) &&
      !isNil(user.username);

    return { user: ProfileResponseDto.fromUser(user), completed };
  }

  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<ProfileResponseDto> {
    // Check if username is being updated and if it's already taken
    if (updateProfileDto.username) {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          username: updateProfileDto.username,
          deleted: false,
        },
      });

      if (existingUser && existingUser.id !== userId) {
        throw new ConflictException('Username is already taken');
      }
    }

    // Convert birthday string to Date if provided
    const data: any = {
      ...updateProfileDto,
      birthday: updateProfileDto.birthday ? new Date(updateProfileDto.birthday) : undefined,
    };

    try {
      const updatedUser = await this.prisma.user.update({
        where: {
          id: userId,
          deleted: false,
        },
        data,
      });

      return ProfileResponseDto.fromUser(updatedUser);
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException('Username is already taken');
      }
      if (error.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
      throw error;
    }
  }

  async checkUsernameAvailability(username: string): Promise<{ available: boolean }> {
    const user = await this.prisma.user.findFirst({
      where: {
        username,
        deleted: false,
      },
    });

    return { available: !user };
  }
}

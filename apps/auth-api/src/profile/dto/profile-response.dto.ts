import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProfileResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiPropertyOptional()
  photoURL!: string | null;

  @ApiPropertyOptional()
  phoneNumber!: string | null;

  @ApiProperty()
  username!: string;

  @ApiProperty()
  birthday!: Date;

  @ApiProperty()
  gender!: string;

  @ApiProperty()
  tennisLevel!: string;

  @ApiProperty()
  deleted!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  static fromUser(user: any): ProfileResponseDto {
    return {
      id: user.id,
      email: user.email,
      photoURL: user.photoURL,
      phoneNumber: user.phoneNumber,
      username: user.username,
      birthday: user.birthday,
      gender: user.gender,
      tennisLevel: user.tennisLevel,
      deleted: user.deleted,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
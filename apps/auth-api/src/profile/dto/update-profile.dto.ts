import { IsString, IsDateString, MaxLength, Matches, IsIn, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({ description: 'Username (must be unique)' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers and underscores',
  })
  @MaxLength(30)
  username!: string;

  @ApiProperty({ description: 'Birthday' })
  @IsNotEmpty()
  @IsDateString()
  birthday!: string;

  @ApiProperty({ description: 'Gender', enum: ['male', 'female', 'other', 'prefer_not_to_say'] })
  @IsNotEmpty()
  @IsString()
  @IsIn(['male', 'female', 'other', 'prefer_not_to_say'])
  gender!: string;

  @ApiProperty({ 
    description: 'Tennis level (NTRP rating)', 
    enum: ['1.0', '1.5', '2.0', '2.5', '3.0', '3.5', '4.0', '4.5', '5.0', '5.5', '6.0', '6.5', '7.0'] 
  })
  @IsNotEmpty()
  @IsString()
  @IsIn(['1.0', '1.5', '2.0', '2.5', '3.0', '3.5', '4.0', '4.5', '5.0', '5.5', '6.0', '6.5', '7.0'])
  tennisLevel!: string;
}
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, Matches, IsUrl } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    type: 'string',
    description: 'Bio',
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({
    type: 'string',
    description: 'Base 64',
  })
  @IsOptional()
  @Matches(/^data:image\/[a-z]+;base64,[A-Za-z0-9+/=]+$/, {
    message: 'Invalid base64 format',
  })
  base64?: string;

  @ApiProperty({
    type: 'string',
    description: 'Photo URL',
  })
  @IsOptional()
  @IsUrl()
  url?: string;

  @ApiProperty({
    type: 'string',
    description: 'Profile type',
  })
  @IsOptional()
  @IsString()
  profileType?: string;
}

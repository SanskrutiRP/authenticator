import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsMobilePhone, IsOptional, Matches, IsUrl } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    type: 'string',
    description: 'token',
  })
  @IsOptional()
  @IsString()
  token: string;

  @ApiProperty({
    type: 'string',
    description: 'EmailId',
  })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({
    type: 'string',
    description: 'Name',
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({
    type: 'string',
    description: 'Phone Number',
  })
  @IsOptional()
  @IsMobilePhone('en-IN')
  phoneNumber: string;

  @IsOptional()
  @Matches(/^data:image\/[a-z]+;base64,[A-Za-z0-9+/=]+$/, {
    message: 'Invalid base64 format',
  })
  base64?: string;

  @IsOptional()
  @IsUrl()
  url?: string;

  @ApiProperty({
    type: 'string',
    description: 'Bio',
  })
  @IsOptional()
  @IsString()
  bio: string;
}

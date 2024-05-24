import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, IsMobilePhone } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    type: 'string',
    description: 'token',
  })
  @IsNotEmpty()
  @IsString()
  token: string;

  @ApiProperty({
    type: 'string',
    description: 'EmailId',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: 'string',
    description: 'Name',
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: 'string',
    description: 'Phone Number',
  })
  @IsMobilePhone('en-IN')
  phoneNumber: string;

  @ApiProperty({
    type: 'string',
    description: 'Profile Photo',
  })
  @IsString()
  profilePhoto: string;

  @ApiProperty({
    type: 'string',
    description: 'Bio',
  })
  @IsString()
  bio: string;
}

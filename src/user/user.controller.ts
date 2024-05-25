import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Put,
  Query,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './create-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateUserDto } from './update-user.dto';
import { Response } from 'express';
import {
  ApiOperation,
  ApiBody,
  ApiTags,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Onboard a user' })
  @ApiBody({ type: CreateUserDto, required: true })
  @ApiBearerAuth('access-token')
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    let response: any = await this.userService.findAdmin();
    if (response?.errors) {
      return res.status(HttpStatus.BAD_REQUEST).send(response);
    }
    if (!response?.data?.email) {
      return res.status(HttpStatus.FORBIDDEN).send({
        errors: [
          {
            type: 'Unauthorized',
            message: 'NOT ADMIN',
          },
        ],
      });
    }
    response = this.userService.create(createUserDto);

    if (response && response?.data) {
      return res.status(HttpStatus.OK).send(response);
    }

    return res.status(HttpStatus.BAD_REQUEST).send(response);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Get User Profile' })
  @ApiQuery({ type: 'string', required: true, name: 'userId' })
  @ApiBearerAuth('access-token')
  async getProfile(@Query('userId') userId: string, @Res() res: Response) {
    const user: any = await this.userService.findOne(userId);

    if (user && user?.data) {
      return res.status(HttpStatus.OK).send(user);
    }
    return res.status(HttpStatus.BAD_REQUEST).send(user);
  }

  @UseGuards(JwtAuthGuard)
  @Put('me')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiBody({ type: UpdateUserDto, required: true })
  @ApiQuery({ type: 'string', required: true, name: 'userId' })
  @ApiBearerAuth('access-token')
  async updateProfile(
    @Query('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    if (updateUserDto.base64 && updateUserDto.url) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        errors: [
          {
            type: 'Bad Request',
            message: 'Provide either a base64 string or a URL, not both',
          },
        ],
      });
    }

    const response: any = await this.userService.update(userId, updateUserDto);
    if (response && response?.data) {
      return res.status(HttpStatus.OK).send(response);
    }

    return res.status(HttpStatus.BAD_REQUEST).send(response);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Fetch all users' })
  @ApiQuery({ type: 'string', required: true, name: 'userId' })
  @ApiBearerAuth('access-token')
  async getAllProfiles(
    @Query('userId') userId: string,
    @Res() res: Response,
    // @Req() req: Request,
  ) {
    const user: any = await this.userService.findOne(userId);
    let response;
    if (user?.data?.roleType === 'ADMIN') {
      response = await this.userService.findAll(userId);
    } else {
      response = await this.userService.findAllPublic(userId);
    }

    if (response && response?.data) {
      return res.status(HttpStatus.OK).send(response);
    }

    return res.status(HttpStatus.BAD_REQUEST).send(response);
  }
}

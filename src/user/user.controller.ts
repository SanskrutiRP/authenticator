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
  Req,
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
  ApiHeader,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Onboard a user' })
  @ApiBody({ type: CreateUserDto, required: true })
  @ApiHeader({
    name: 'authorization',
    description: 'Bearer Token',
    required: true,
  })
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
  @ApiHeader({
    name: 'authorization',
    description: 'Bearer Token',
    required: true,
  })
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
  @ApiHeader({
    name: 'authorization',
    description: 'Bearer Token',
    required: true,
  })
  async updateProfile(
    @Query('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ) {
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
  @ApiHeader({
    name: 'authorization',
    description: 'Bearer Token',
    required: true,
  })
  async getAllProfiles(
    @Query('userId') userId: string,
    @Res() res: Response,
    @Req() req: Request,
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

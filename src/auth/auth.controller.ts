import { Controller, Post, Body, Req, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/create-user.dto';
import { Response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login user' })
  @Post('login')
  @ApiBody({
    type: CreateUserDto,
    description: 'Login user',
  })
  @ApiBearerAuth('access-token')
  async login(
    @Req() req,
    @Body() payload: CreateUserDto,
    @Res() res: Response,
  ) {
    const token = req.headers.authorization.split(' ')[1];
    const response = await this.authService.checkUser(token, payload);
    if (response && response.data) {
      return res.status(HttpStatus.OK).send(response);
    }
    return res.status(HttpStatus.BAD_REQUEST).send(response);
  }
}

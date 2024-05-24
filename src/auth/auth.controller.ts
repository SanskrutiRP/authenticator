import { Controller, Post, Body, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login user' })
  @Post('login')
  async login(@Req() req, @Body() payload) {
    const token = req.headers.authorization.split(' ')[1];
    return this.authService.checkUser(token, payload);
  }
}

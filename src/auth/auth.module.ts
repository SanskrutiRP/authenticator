import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Module({
  controllers: [AuthController],
  // exports: [JwtAuthGuard],
  providers: [AuthService, UserService, JwtAuthGuard]
})
export class AuthModule {}

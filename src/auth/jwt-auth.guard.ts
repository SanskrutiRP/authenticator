import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1];
    if (!token) {
      return false;
    }
    try {
      const decodedToken = await this.authService.verifyToken(token);

      const user: any = await this.userService.findOne(request?.query?.userId);
      if (decodedToken?.email != user?.data?.email) {
        return false;
      }

      request.user = decodedToken;
      return true;
    } catch (err) {
      return false;
    }
  }
}

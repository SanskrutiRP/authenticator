import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
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
    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('Authorization header not found');
    }

    const token = authorization.split(' ')[1];
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

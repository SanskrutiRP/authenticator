import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { UserService } from '../user/user.service';
import { User } from 'src/db/models/user';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  private readonly logger = new Logger(AuthService.name);
  async verifyToken(token: string) {
    const decodedToken = await admin.auth().verifyIdToken(token);

    return decodedToken;
  }

  async checkUser(token, payload): Promise<User | any> {
    try {
      const decodedToken = await this.verifyToken(token);
      const user: any = await this.userService.findToken(decodedToken.uid);
      const insertPayload = {
        token: decodedToken?.uid || user?.token,
        email: decodedToken?.email || payload?.email || user?.email,
        name: decodedToken?.name || payload?.name || user?.name,
        bio: payload?.bio || user?.bio || '',
        profilePhoto:
          decodedToken?.picture ||
          payload?.url ||
          payload?.base64 ||
          user?.profilePhoto,
        phoneNumber:
          decodedToken?.phone_number ||
          payload?.phoneNumber ||
          user?.phoneNumber,
      };
      if (!user) {
        await this.userService.create(insertPayload);
      }

      return {
        data: insertPayload,
      };
    } catch (error) {
      this.logger.error(error.message);

      return {
        errors: [
          {
            type: 'catch',
            message: 'something went wrong',
          },
        ],
      };
    }
  }
}

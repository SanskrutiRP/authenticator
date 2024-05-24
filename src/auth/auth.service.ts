import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
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
      const user = await this.userService.findToken(decodedToken.uid);
      if (!user) {
        await this.userService.create({
          token: decodedToken?.uid,
          email: decodedToken?.email || payload?.email,
          name: decodedToken?.name || payload?.name,
          bio: payload?.bio || '',
          profilePhoto: decodedToken?.picture || payload?.url,
          phoneNumber: decodedToken?.phone_number || payload?.phoneNumber,
        });
      }

      return decodedToken;
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

  private async uploadBase64Image(
    base64Image: string,
    userId: string,
  ): Promise<string> {
    const bucket = admin.storage().bucket();
    const file = bucket.file(`profile_pictures/${userId}.jpg`);

    const buffer = Buffer.from(base64Image.split(',')[1], 'base64');

    await file.save(buffer, {
      metadata: { contentType: 'image/jpeg' },
      public: true,
    });

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
    return publicUrl;
  }
}

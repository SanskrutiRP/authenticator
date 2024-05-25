import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';
import { User } from 'src/db/models/user';
import { Role } from 'src/db/models/role';
import { Errors, ResponseObject } from 'src/error.dto';
import * as admin from 'firebase-admin';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  async create(
    createUserPayload: CreateUserDto,
  ): Promise<ResponseObject | Errors> {
    try {
      this.logger.log(`creating new user:: ${createUserPayload}`);

      const getUserRole = await Role.query().findOne('roleType', 'USER');

      const payloadToInsert = {
        token: createUserPayload?.token,
        email: createUserPayload?.email,
        name: createUserPayload?.name,
        bio: createUserPayload?.bio,
        profilePhoto: createUserPayload?.base64 || createUserPayload?.url,
        phoneNumber: createUserPayload?.phoneNumber,
        roleId: getUserRole?.publicId,
      };
      const response = await User.query().insert(payloadToInsert);

      this.logger.debug(`returning response ${response}`);

      return {
        data: response,
      };
    } catch (error) {
      this.logger.error(`error: ${error.message}`);

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

  async findOne(userId: string): Promise<ResponseObject | Errors> {
    try {
      this.logger.log(`UserId ${userId}`);

      const user = await User.query()
        .alias('u')
        .select('*')
        .join('role as r', 'r.public_id', 'u.role_id')
        .findById(userId);

      return {
        data: user,
      };
    } catch (error) {
      this.logger.error(`Error: ${error.message}`);

      return {
        errors: [
          {
            type: 'user',
            message: 'failed to fetch users',
          },
        ],
      };
    }
  }

  async findToken(token): Promise<User | boolean> {
    try {
      this.logger.log(`uid: ${token}`);

      const userExists = await User.query().findOne({ token: token });

      if (userExists) {
        return userExists;
      }

      return false;
    } catch (error) {
      this.logger.error(error.message);

      return false;
    }
  }

  async update(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<ResponseObject | Errors> {
    try {
      this.logger.log(`request received:: ${updateUserDto}`);

      const userExists: any = await this.findOne(userId);

      if (userExists?.errors) {
        return userExists.errors;
      }
      const updatePayload = {
        bio: updateUserDto?.bio,
        profileType: updateUserDto?.profileType,
        profilePhoto: updateUserDto?.url,
      };
      if (updateUserDto?.base64) {
        // TODO:: implement image upload here
      }
      if (userExists) {
        const response = await User.query()
          .patch(updatePayload)
          .where('publicId', userId);

        this.logger.debug(`sending response:: ${response}`);
        return {
          data: 'User Updated Successfully',
        };
      }

      return {
        errors: [
          {
            type: 'update user',
            message: `user doesn't exists`,
          },
        ],
      };
    } catch (error) {
      this.logger.error(`error : ${error.message}`);

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

  async findAllPublic(userId): Promise<ResponseObject | Errors> {
    try {
      this.logger.log(`fetching public profiles`);
      const profiles = await User.query()
        .where('profile_type', 'public')
        .whereNot('publicId', userId);

      this.logger.debug(`returning response:: ${profiles}`);
      return {
        data: profiles,
      };
    } catch (error) {
      this.logger.error(`error : ${error.message}`);

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

  async findAll(userId): Promise<ResponseObject | Errors> {
    try {
      this.logger.log(`fetching all users`);
      const allUsers = await User.query().whereNot('publicId', userId);

      this.logger.debug(`returning response:: ${allUsers}`);

      return {
        data: allUsers,
      };
    } catch (error) {
      this.logger.error(`error : ${error.message}`);

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

  async findAdmin(): Promise<ResponseObject | Errors> {
    try {
      this.logger.log(`fetch admin`);

      const admin: any = await Role.query()
        .alias('r')
        .select('u.*')
        .join('user as u', 'u.role_id', 'r.public_id')
        .where('roleType', 'ADMIN');

      return {
        data: admin,
      };
    } catch (error) {
      this.logger.error(`Error: ${error.message}`);

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

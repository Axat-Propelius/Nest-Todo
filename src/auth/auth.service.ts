import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from './auth.dto';
import { hashSync } from 'bcryptjs';
import { JwtPayload } from 'src/types';
import { UsersService } from 'src/users/users.service';
import { ERROR_MESSAGES } from 'src/constants/error.messages';
import { SUCCESS_MESSAGES } from 'src/constants/success.messages';
import { getUId } from 'src/utils/common.helper';
import { UserRoles } from 'src/utils/constants';
import { RoleService } from 'src/role/role.service';
import { UserModel } from 'src/db/models/user.model';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserModel)
    private userModel: typeof UserModel,

    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly roleService: RoleService,
  ) {}

  generateToken(payload: JwtPayload, expiryInDays?: number) {
    return this.jwtService.sign(payload, {
      expiresIn: `${expiryInDays || 7} days`,
    });
  }

  async registerUser(payload: RegisterDto) {
    try {
      const isExits = await this.userService.findUserByEmailID(payload.emailID);
      if (isExits) {
        throw new HttpException(
          ERROR_MESSAGES.ACCOUNT_ALREADY_EXISTS,
          HttpStatus.CONFLICT,
        );
      }
      const userID = getUId();
      const roleDetails = await this.roleService.findRoleBySlug(UserRoles.USER);
      const accessToken = this.generateToken({
        emailID: payload.emailID,
        userID: userID,
      });

      await this.userService.create({
        ...payload,
        userID: userID,
        token: accessToken,
        roleID: roleDetails.id,
        isUser: true,
        password: hashSync(payload.password, 10),
      });

      return {
        message: SUCCESS_MESSAGES.REGISTRATION_COMPLETED,
        success: true,
        statusCode: HttpStatus.CREATED,
        data: { accessToken },
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async login(payload: LoginDto) {
    try {
      const user = await this.userService.findUserByCredentials(
        payload.emailID,
        payload.password,
      );
      const accessToken = this.generateToken({
        emailID: user.emailID,
        userID: user.userID,
      });
      user.token = accessToken;
      await this.userModel
        .query()
        .patch({ token: accessToken })
        .where({ userID: user.userID });
      return {
        message: SUCCESS_MESSAGES.LOGIN_COMPLETED,
        success: true,
        statusCode: HttpStatus.OK,
        data: { accessToken },
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async registerManager(payload: RegisterDto) {
    try {
      const isExits = await this.userService.findUserByEmailID(payload.emailID);
      if (isExits) {
        throw new HttpException(
          ERROR_MESSAGES.ACCOUNT_ALREADY_EXISTS,
          HttpStatus.CONFLICT,
        );
      }
      const userID = getUId();
      const roleDetails = await this.roleService.findRoleBySlug(
        UserRoles.MANAGER,
      );
      const accessToken = this.generateToken({
        emailID: payload.emailID,
        userID: userID,
      });

      await this.userService.create({
        ...payload,
        userID: userID,
        token: accessToken,
        roleID: roleDetails.id,
        isUser: false,
        password: hashSync(payload.password, 10),
      });

      return {
        message: SUCCESS_MESSAGES.REGISTRATION_COMPLETED,
        success: true,
        statusCode: HttpStatus.CREATED,
        data: { accessToken },
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async registerAdmin(payload: RegisterDto) {
    try {
      const isExits = await this.userService.findUserByEmailID(payload.emailID);
      if (isExits) {
        throw new HttpException(
          ERROR_MESSAGES.ACCOUNT_ALREADY_EXISTS,
          HttpStatus.CONFLICT,
        );
      }
      const userID = getUId();
      const roleDetails = await this.roleService.findRoleBySlug(
        UserRoles.ADMIN,
      );
      const accessToken = this.generateToken({
        emailID: payload.emailID,
        userID: userID,
      });

      await this.userService.create({
        ...payload,
        userID: userID,
        token: accessToken,
        roleID: roleDetails.id,
        isUser: false,
        password: hashSync(payload.password, 10),
      });

      return {
        message: SUCCESS_MESSAGES.REGISTRATION_COMPLETED,
        success: true,
        statusCode: HttpStatus.CREATED,
        data: { accessToken },
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}

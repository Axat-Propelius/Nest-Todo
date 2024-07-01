import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { compareSync } from 'bcryptjs';
import { Transaction } from 'objection';
import { ERROR_MESSAGES } from 'src/constants/error.messages';
import { UserModel } from 'src/db/models/user.model';

@Injectable()
export class UsersService {
  constructor(
    @Inject(UserModel)
    private userModel: typeof UserModel,
  ) {}

  async findUserByEmailID(emailID: string) {
    try {
      const user = await this.userModel.query().findOne({ emailID: emailID });
      return user;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findUserByUserID(userID: string, withRole?: boolean) {
    try {
      const relations = withRole ? '[role]' : '';
      const user = await this.userModel
        .query()
        .findOne({ userID: userID })
        .withGraphJoined(relations)
        .select('userID', 'emailID');
      return user;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async create(user: Partial<UserModel>, trx?: Transaction) {
    try {
      const newUser = await this.userModel.query(trx).insert(user);
      return newUser;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findUserByCredentials(emailID: string, password: string) {
    const user = await this.findUserByEmailID(emailID);
    if (!user)
      throw new HttpException(
        ERROR_MESSAGES.INVALID_CREDENTIALS,
        HttpStatus.NOT_FOUND,
      );
    const isValidPassword = compareSync(password, user.password);
    if (!isValidPassword)
      throw new HttpException(
        ERROR_MESSAGES.INVALID_CREDENTIALS,
        HttpStatus.NOT_FOUND,
      );
    return user;
  }
}

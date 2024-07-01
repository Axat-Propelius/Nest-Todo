import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ERROR_MESSAGES } from 'src/constants/error.messages';
import { SUCCESS_MESSAGES } from 'src/constants/success.messages';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async getProfile(@Req() request) {
    const { user } = request;
    const profile = await this.usersService.findUserByUserID(user.userID);
    if (!profile)
      throw new HttpException(
        ERROR_MESSAGES.USER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );

    return {
      message: SUCCESS_MESSAGES.REGISTRATION_COMPLETED,
      success: true,
      statusCode: HttpStatus.CREATED,
      data: profile,
    };
  }
}

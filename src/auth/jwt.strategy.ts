import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ERROR_MESSAGES } from 'src/constants/error.messages';
import { JwtPayload } from 'src/types';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    const { userID } = payload;
    const user = await this.userService.findUserByUserID(userID, true);
    if (!user)
      throw new HttpException(
        ERROR_MESSAGES.INVALID_JWT_TOKEN,
        HttpStatus.UNAUTHORIZED,
      );
    return user;
  }
}

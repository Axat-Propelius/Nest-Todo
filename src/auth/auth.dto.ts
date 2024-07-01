import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { stringSanitize } from 'src/utils/transformer.helper';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  @stringSanitize(['lowerCase', 'trim'])
  emailID: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword(
    {
      minLength: 8,
      minNumbers: 1,
      minSymbols: 0,
      minUppercase: 1,
      minLowercase: 1,
    },
    {
      message:
        'Password must be at least 8 characters long and contain at least one number, one uppercase letter and one lowercase letter',
    },
  )
  password?: string;

  @IsString()
  @IsNotEmpty()
  @stringSanitize(['trim'])
  username: string;
}

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @stringSanitize(['trim'])
  emailID: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';

interface CustomValidationPipeOptions {
  whitelist?: boolean;
  forbidNonWhitelisted?: boolean;
}

@Injectable()
export class CustomValidationPipe implements PipeTransform {
  private readonly whitelist: boolean;
  private readonly forbidNonWhitelisted: boolean;

  constructor(options: CustomValidationPipeOptions = {}) {
    this.whitelist = options.whitelist || true;
    this.forbidNonWhitelisted = options.forbidNonWhitelisted || true;
  }
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object, {
      whitelist: this.whitelist, // Automatically strip non-whitelisted properties
      forbidNonWhitelisted: this.forbidNonWhitelisted, // Throw an error if non-whitelisted properties are passed
      transform: true, // Transform payloads to be objects typed according to their DTO classes
    });
    if (errors.length > 0) {
      this.throwFirstError(errors);
    }
    return object;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private throwFirstError(errors: ValidationError[]) {
    for (const error of errors) {
      if (error.constraints) {
        const firstErrorKey = Object.keys(error.constraints)[0];
        throw new HttpException(error.constraints[firstErrorKey], 400);
      }
      if (error.children && error.children.length > 0) {
        this.throwFirstError(error.children);
      }
    }
  }
}

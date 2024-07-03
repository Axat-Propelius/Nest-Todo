import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsString,
  IsUUID,
} from 'class-validator';
import { TodoStatus } from 'src/db/models/todo.model';
import { stringSanitize } from 'src/utils/transformer.helper';

export class TodoCreateDto {
  @IsString()
  @IsNotEmpty()
  @stringSanitize(['trim'])
  title: string;

  @IsString()
  @IsNotEmpty()
  @stringSanitize(['trim'])
  description: string;

  @IsDateString()
  @IsNotEmpty()
  dueDate: string;

  @IsBoolean()
  isCompleted: boolean;
}

export class TodoIdsDto {
  @IsUUID()
  @IsNotEmpty()
  userID: string;

  @IsUUID()
  @IsNotEmpty()
  todoID: string;
}

export class TodoUpdateDto {
  @IsString()
  @IsNotEmpty()
  @stringSanitize(['trim'])
  title: string;

  @IsString()
  @IsNotEmpty()
  @stringSanitize(['trim'])
  description: string;

  @IsDateString()
  @IsNotEmpty()
  dueDate: Date;

  @IsBoolean()
  isCompleted: boolean;

  @IsString()
  @IsNotEmpty()
  @IsEnum(Object.values(TodoStatus), {
    message:
      'status must be one of the following values: ' +
      Object.values(TodoStatus).join(', '),
  })
  status: TodoStatus;
}

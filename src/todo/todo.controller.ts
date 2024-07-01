import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { TodoCreateDto, TodoUpdateDto } from './todo.dto';
import { TodoStatus } from 'src/db/models/todo.model';
import { getUId } from 'src/utils/common.helper';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRoles } from 'src/utils/constants';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get('/admin')
  @Roles(UserRoles.ADMIN, UserRoles.MANAGER)
  @ApiBearerAuth('access-token')
  async getAdminTodoList(@Query() query) {
    return this.todoService.getTodoList(query);
  }

  @Get('/')
  @Roles(UserRoles.USER)
  @ApiBearerAuth('access-token')
  async getTodoList(@Req() request, @Query() query) {
    const { user } = request;
    return this.todoService.getTodoList(query, user.userID);
  }

  @Get('/:todoID')
  @ApiBearerAuth('access-token')
  async getTodoById(@Req() request, @Param() param) {
    const { user } = request;
    const { todoID } = param;
    return this.todoService.getTodoByID(
      { userID: user.userID, todoID },
      user.isUser,
    );
  }

  @Post('/')
  @Roles(UserRoles.USER)
  @ApiBearerAuth('access-token')
  async cerateTodo(@Req() request, @Body() body: TodoCreateDto) {
    const { user } = request;
    return this.todoService.createTodo({
      ...body,
      todoID: getUId(),
      status: TodoStatus.PENDING,
      userID: user.userID,
      dueDate: new Date(body.dueDate),
    });
  }

  @Patch('/:todoID')
  @Roles(UserRoles.USER, UserRoles.ADMIN)
  @ApiBearerAuth('access-token')
  async updateTodo(
    @Req() request,
    @Param() param,
    @Body() body: TodoUpdateDto,
  ) {
    const { user } = request;
    const { todoID } = param;
    return await this.todoService.updateTodoByID(
      { userID: user.userID, todoID },
      body,
      user.isUser,
    );
  }

  @Delete('/:todoID')
  @ApiBearerAuth('access-token')
  async deleteTodo(@Req() request, @Param() param) {
    const { user } = request;
    const { todoID } = param;
    return await this.todoService.deleteTodoByID(
      {
        userID: user.userID,
        todoID,
      },
      user.isUser,
    );
  }
}

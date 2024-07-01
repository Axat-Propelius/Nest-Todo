import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { TodoModel } from 'src/db/models/todo.model';
import { TodoIdsDto } from './todo.dto';
import { SUCCESS_MESSAGES } from 'src/constants/success.messages';
import { Transaction } from 'objection';
import { ERROR_MESSAGES } from 'src/constants/error.messages';
import { PaginationAndSearchDto } from 'src/utils/common.dto';

@Injectable()
export class TodoService {
  constructor(
    @Inject(TodoModel)
    private todoModel: typeof TodoModel,
  ) {}

  async getTodoList(query: PaginationAndSearchDto, userID?: string) {
    try {
      let { page = 1, limit = 10, search } = query;
      const whereQuery = {};
      if (userID) whereQuery['userID'] = userID;

      const queryBuilder = this.todoModel
        .query()
        .where(whereQuery)
        .select('todoID', 'title', 'status', 'created_at')
        .limit(limit)
        .offset((page - 1) * limit);

      if (search) {
        queryBuilder.andWhere((qb) => {
          return qb
            .orWhere('title', 'ilike', `%${search}%`)
            .orWhere('status', 'ilike', `%${search}%`);
        });
      }

      const todos = await queryBuilder;

      return {
        message: SUCCESS_MESSAGES.TODO_LIST,
        success: true,
        statusCode: HttpStatus.OK,
        data: todos,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async getTodoByID(payload: TodoIdsDto, isUser: boolean) {
    try {
      const findQuery = { todoID: payload.todoID };
      if (isUser) findQuery['userID'] = payload.userID;
      const todo = await this.todoModel
        .query()
        .findOne(findQuery)
        .withGraphJoined('[user.role]')
        .select(
          'todoID',
          'title',
          'description',
          'dueDate',
          'isCompleted',
          'status',
          'created_at',
          'updated_at',
        );

      if (!todo)
        throw new HttpException(
          ERROR_MESSAGES.TODO_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      return {
        message: SUCCESS_MESSAGES.TODO_LIST,
        success: true,
        statusCode: HttpStatus.OK,
        data: todo,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async createTodo(payload: Partial<TodoModel>, trx?: Transaction) {
    try {
      const data = await this.todoModel.query(trx).insert(payload);
      return {
        message: SUCCESS_MESSAGES.TODO_CREATED,
        success: true,
        statusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async updateTodoByID(
    query: TodoIdsDto,
    update: Partial<TodoModel>,
    isUser: boolean,
    trx?: Transaction,
  ) {
    try {
      const todo = await this.todoModel
        .query(trx)
        .patchAndFetchById(query.todoID, update)
        .select(
          'todoID',
          'title',
          'description',
          'dueDate',
          'isCompleted',
          'status',
          'created_at',
          'updated_at',
        );
      if (!todo)
        throw new HttpException(
          ERROR_MESSAGES.TODO_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      return {
        message: SUCCESS_MESSAGES.TODO_UPDATED,
        success: true,
        statusCode: HttpStatus.OK,
        data: todo,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async deleteTodoByID(
    payload: TodoIdsDto,
    isUser: boolean,
    trx?: Transaction,
  ) {
    try {
      const findQuery = { todoID: payload.todoID };
      if (isUser) findQuery['userID'] = payload.userID;
      const todo = await this.todoModel.query(trx).findOne(findQuery).delete();
      if (!todo)
        throw new HttpException(
          ERROR_MESSAGES.TODO_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      return {
        message: SUCCESS_MESSAGES.TODO_DELETED,
        success: true,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}

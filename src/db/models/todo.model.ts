import { Model } from 'objection';
import { getUId } from 'src/utils/common.helper';

export enum TodoStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  IN_PROGRESS = 'in-progress',
}

export class TodoModel extends Model {
  static tableName: string = 'todos';
  static idColumn: string = 'todoID';

  id: number;
  todoID: string;
  userID: string;
  title: string;
  description: string;
  dueDate: Date;
  status: string; //TodoStatus;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;

  static get jsonSchema() {
    return {
      type: 'object',
      required: [
        'todoID',
        'userID',
        'title',
        'description',
        'dueDate',
        'status',
        'isCompleted',
      ],
      properties: {
        id: { type: 'integer' },
        userID: { type: 'string' },
        todoID: { type: 'string', default: getUId() },
        title: { type: 'string', minLength: 1, maxLength: 255 },
        description: { type: 'string', minLength: 10, maxLength: 555 },
        status: {
          type: 'string',
          enum: Object.values(TodoStatus),
          default: 'pending',
        },
        isCompleted: { type: 'boolean', default: false },
      },
    };
  }

  static get relationMappings() {
    // const { UserModel } = require('src/db/models/user.model');
    const { UserModel } = require('./user.model');
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: `${TodoModel.tableName}.${TodoModel.idColumn}`,
          to: `${UserModel.tableName}.${TodoModel.idColumn}`,
        },
      },
    };
  }
}

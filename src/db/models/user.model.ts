import { Model } from 'objection';
import { getUId } from 'src/utils/common.helper';
import { type RoleModel } from './role.model';

export class UserModel extends Model {
  static tableName: string = 'users';
  static idColumn: string = 'userID';

  id: number;
  userID: string;
  username: string;
  emailID: string;
  password: string;
  token: string;
  roleID: number;
  role: RoleModel;
  isUser: boolean;
  created_at: Date;
  updated_at: Date;

  static get jsonSchema() {
    return {
      type: 'object',
      required: [
        'userID',
        'username',
        'emailID',
        'password',
        'roleID',
        'isUser',
      ],
      properties: {
        id: { type: 'integer' },
        userID: { type: 'string', default: getUId() },
        isUser: { type: 'boolean', default: false },
        username: { type: 'string' },
        emailID: { type: 'string' },
        password: { type: 'string' },
        token: { type: 'string' },
        roleID: { type: 'integer' },
      },
    };
  }

  static relationMappings() {
    const { RoleModel } = require('./role.model');

    return {
      role: {
        relation: Model.BelongsToOneRelation,
        modelClass: RoleModel,
        join: {
          from: `${UserModel.tableName}.roleID`,
          to: `${RoleModel.tableName}.${RoleModel.idColumn}`,
        },
        filter: (query) => query.select('id', 'slug', 'name'),
      },
    };
  }
}

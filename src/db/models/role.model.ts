import { Model } from 'objection';
import { type UserModel } from './user.model';

export class RoleModel extends Model {
  static tableName = 'roles';
  static idColumn = 'id';

  id: number;
  name: string;
  slug: string;
  users: UserModel[];
  created_at: Date;
  updated_at: Date;

  static relationMappings() {
    // const { UserModel } = require('src/db/models/user.model');
    const { UserModel } = require('./user.model');
    return {
      users: {
        relation: Model.HasManyRelation,
        modelClass: UserModel,
        join: {
          from: `${RoleModel.tableName}.${RoleModel.idColumn}`,
          to: `${UserModel.tableName}.roleID`,
        },
        filter: (query) =>
          query.select('username', 'userID', 'emailID', 'isUser', 'roleID'),
      },
    };
  }
}

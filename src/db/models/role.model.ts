import { Model } from 'objection';

export class RoleModel extends Model {
  static tableName = 'roles';
  static idColumn = 'id';

  id: number;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;

  static get relationMappings() {
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
      },
    };
  }
}

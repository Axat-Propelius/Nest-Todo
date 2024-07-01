import { Inject, Injectable } from '@nestjs/common';
import { RoleModel } from 'src/db/models/role.model';

@Injectable()
export class RoleService {
  constructor(
    @Inject(RoleModel)
    private roleModel: typeof RoleModel,
  ) {}

  async findRoleBySlug(slug: string) {
    return this.roleModel.query().select('*').findOne({ slug: slug });
  }

  async getAllRoles() {
    return this.roleModel
      .query()
      .select('name', 'slug', 'id')
      .withGraphJoined('[users]');
  }
}

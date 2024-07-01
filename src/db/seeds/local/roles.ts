import { RoleModel } from '../../models/role.model';

const rolesToAdd: Partial<RoleModel>[] = [
  {
    name: 'Admin',
    slug: 'admin',
  },
  {
    name: 'Manager',
    slug: 'manager',
  },
  {
    name: 'User',
    slug: 'user',
  },
];

exports.seed = async function seed(knex) {
  // Check if roles already exist before insert them into roles table
  const roles = await knex('roles').select('*');
  if (!roles.length) {
    // Insert selected roles into roles table
    await knex.batchInsert('roles', rolesToAdd);
  }
};

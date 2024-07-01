import { UserModel } from '../../models/user.model';
import { hashSync } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const usersToAdd: Partial<UserModel>[] = [
  {
    userID: uuidv4(),
    username: 'Axat Developer',
    emailID: 'axat.sachani+user@propelius.tech',
    password: hashSync('Axat@2024', 10),
    isUser: true,
    roleID: 3,
  },
  {
    userID: uuidv4(),
    username: 'Axat Administrator',
    emailID: 'axat.sachani+admin@propelius.tech',
    password: hashSync('Axat@2024', 10),
    isUser: false,
    roleID: 1,
  },
  {
    userID: uuidv4(),
    username: 'Axat Manager',
    emailID: 'axat.sachani+manager@propelius.tech',
    password: hashSync('Axat@2024', 10),
    isUser: false,
    roleID: 2,
  },
];

exports.seed = async function seed(knex) {
  await knex('users').del();
  await knex.batchInsert('users', usersToAdd);
  // const users = await knex('users').select('*');
  // if (!users.length) {
  //   await knex.batchInsert('users', usersToAdd);
  // }
};

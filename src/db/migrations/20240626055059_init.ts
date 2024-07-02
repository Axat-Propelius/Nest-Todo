import type { Knex } from 'knex';
import { onUpdateTrigger } from '../utils';

export async function up(knex: Knex): Promise<void> {
  await knex.raw('CREATE DATABASE todo');

  await knex.transaction(async (trx) => {
    await trx.schema
      .createTable('users', (table) => {
        table.increments('id').unsigned().notNullable().primary();
        table.uuid('userID').defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('username').notNullable();
        table.string('emailID').unique().notNullable();
        table.string('password').nullable();
        table.string('token').nullable();

        table.timestamps(true, true);
      })
      .then(() => {
        knex.raw(onUpdateTrigger('users'));
      });
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw('DROP DATABASE todo');

  await knex.schema.dropTableIfExists('users');
}

import type { Knex } from 'knex';
import { onUpdateTrigger } from '../utils';

export async function up(knex: Knex): Promise<void> {
  await knex.transaction(async (trx) => {
    await trx.schema
      .createTable('roles', (table) => {
        table.increments('id').unsigned().notNullable().primary();
        table.string('name').notNullable();
        table.string('slug').unique().notNullable();

        table.timestamps(true, true);
      })
      .then(() => {
        knex.raw(onUpdateTrigger('roles'));
        trx.schema.alterTable('users', (table) => {
          table.integer('roleID').unsigned().nullable();
          table.string('role').nullable();
        });
      });
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('roles');
  await knex.schema.table('users', function (table) {
    table.dropColumn('roleID');
    table.dropColumn('role');
  });
}

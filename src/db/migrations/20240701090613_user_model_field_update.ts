import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.transaction(async (trx) => {
    trx.schema.alterTable('users', (table) => {
      table.boolean('isUser').defaultTo(false);
    });
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('users', (table) => {
    table.dropColumn('isUser');
  });
}

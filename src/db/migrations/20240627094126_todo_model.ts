import type { Knex } from 'knex';
import { TodoStatus } from '../models/todo.model';

export async function up(knex: Knex): Promise<void> {
  await knex.transaction(async (trx) => {
    await trx.schema.createTable('todos', (table) => {
      table.increments('id').unsigned().notNullable();
      table.uuid('todoID').unsigned().notNullable().primary();
      table.uuid('userID').notNullable(),
        table.text('title').notNullable(),
        table.text('description').notNullable(),
        table.timestamp('dueDate').notNullable();
      table
        .enum('status', ['pending', 'in-progress', 'completed'])
        .defaultTo('pending');
      table.boolean('isCompleted').defaultTo(false);
    });
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('todos');
}

import { Knex } from 'knex';

const tableName = 'user_core';
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    tableName,
    (table: Knex.CreateTableBuilder) => {
      table.increments('id').primary();
      table.text('email').unique();
      table.text('password');
      table.text('password_salt');
      table.boolean('is_verified').defaultTo(false);
      table.boolean('is_active').defaultTo(false);
      table.text('user_handle').unique();
      table.text('country_code');
      table.text('mobile_number');
      table.boolean('is_deleted');
      table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
      table.timestamp('last_updated', { useTz: true }).defaultTo(knex.fn.now());
    },
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(tableName);
}

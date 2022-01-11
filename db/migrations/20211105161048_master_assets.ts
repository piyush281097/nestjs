import { Knex } from 'knex';

const tableName = 'master_assets';
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    tableName,
    (table: Knex.CreateTableBuilder) => {
      table.increments('id').primary();
      table.text('name');
      table.text('logo');
      table.text('symbol');
      table.boolean('is_deleted').defaultTo(0);
      table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
      table.timestamp('last_updated', { useTz: true }).defaultTo(knex.fn.now());
    },
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(tableName);
}

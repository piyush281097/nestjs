import { Knex } from 'knex';

const tableName = 'recent_search';
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    tableName,
    (table: Knex.CreateTableBuilder) => {
      table.increments('id').primary();
      table.integer('created_by').references('id').inTable('user_core');
      table.integer('user_id').references('id').inTable('user_core');
      table.integer('asset_id').references('id').inTable('master_assets');
      table.boolean('is_deleted').defaultTo(false);
      table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
      table.timestamp('last_updated', { useTz: true }).defaultTo(knex.fn.now());
    },
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(tableName);
}

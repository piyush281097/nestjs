import { Knex } from 'knex';

const tableName = 'profile_media';
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    tableName,
    (table: Knex.CreateTableBuilder) => {
      table.increments('id').primary();
      table.integer('user_id').references('id').inTable('user_core');
      table.text('image_org');
      table.text('image_thumb');
      table.text('image_small');
      table.text('image_medium');
      table.text('image_large');
      table.boolean('is_deleted').defaultTo(0);
      table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
      table.timestamp('last_updated', { useTz: true }).defaultTo(knex.fn.now());
    },
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(tableName);
}

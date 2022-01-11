import { Knex } from 'knex';

const tableName = 'tagged_hashtags';
export async function up(knex: Knex): Promise<void> {
  const allowedTypes: string[] = ['post', 'trade'];

  return knex.schema.createTable(
    tableName,
    (table: Knex.CreateTableBuilder) => {
      table.increments('id').primary();
      table.integer('post_id').references('id').inTable('posts_master');
      table.integer('trade_id').references('id').inTable('trades_master');
      table.integer('hashtag_id').references('id').inTable('master_hashtags');
      table.enum('type', allowedTypes).notNullable();
      table.boolean('is_deleted').defaultTo(0);
      table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
      table.timestamp('last_updated', { useTz: true }).defaultTo(knex.fn.now());
    },
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(tableName);
}

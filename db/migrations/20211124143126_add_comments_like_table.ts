import { Knex } from 'knex';

const tableName = 'comment_likes';
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    tableName,
    (table: Knex.CreateTableBuilder) => {
      table.increments('id').primary();
      table
        .integer('post_comment_id')
        .references('id')
        .inTable('posts_comments');
      table
        .integer('trades_comment_id')
        .references('id')
        .inTable('trades_comments');
      table.integer('user_id').references('id').inTable('user_core');
      table.boolean('is_deleted').defaultTo(0);
      table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
      table.timestamp('last_updated', { useTz: true }).defaultTo(knex.fn.now());
    },
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(tableName);
}

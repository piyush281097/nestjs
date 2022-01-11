import { Knex } from 'knex';

const tableName = 'tagged_hashtags';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table: Knex.CreateTableBuilder) => {
    table.integer('post_comment_id').references('id').inTable('posts_comments');
    table
      .integer('trade_comment_id')
      .references('id')
      .inTable('trades_comments');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table) => {
    table.dropColumn('post_comment_id');
    table.dropColumn('trade_comment_id');
  });
}

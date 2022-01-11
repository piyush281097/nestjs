import { Knex } from 'knex';

const tableName = 'comment_likes';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table: Knex.CreateTableBuilder) => {
    table.unique(['post_comment_id', 'user_id']);
    table.unique(['trades_comment_id', 'user_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table) => {
    table.dropUnique(['post_comment_id', 'user_id']);
    table.dropUnique(['trades_comment_id', 'user_id']);
  });
}

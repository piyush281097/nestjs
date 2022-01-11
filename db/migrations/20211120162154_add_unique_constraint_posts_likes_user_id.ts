import { Knex } from 'knex';

const tableName = 'posts_likes';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table: Knex.CreateTableBuilder) => {
    table.unique(['post_id', 'user_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table) => {
    table.dropUnique(['post_id', 'user_id']);
  });
}

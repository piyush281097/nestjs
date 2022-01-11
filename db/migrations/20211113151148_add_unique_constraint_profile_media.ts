import { Knex } from 'knex';

const tableName = 'profile_media';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table: Knex.CreateTableBuilder) => {
    table.unique(['user_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table) => {
    table.dropUnique(null, 'user_id');
  });
}

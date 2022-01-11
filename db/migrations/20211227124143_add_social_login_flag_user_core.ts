import { Knex } from 'knex';

const tableName = 'user_core';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table: Knex.CreateTableBuilder) => {
    table.boolean('is_social_login').defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table) => {
    table.dropColumn('is_social_login');
  });
}

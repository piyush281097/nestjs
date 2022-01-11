import { Knex } from 'knex';

const tableName = 'master_assets';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table: Knex.CreateTableBuilder) => {
    table.unique(['symbol']);
    table.dropColumn('name');
    table.dropColumn('logo');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table) => {
    table.dropUnique(['symbol']);
    table.text('name');
    table.text('logo');
  });
}

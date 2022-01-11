import { Knex } from 'knex';

const tableName = 'trades_master';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table: Knex.CreateTableBuilder) => {
    table.enu('type', ['buy', 'sell']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table) => {
    table.dropColumn('type');
  });
}

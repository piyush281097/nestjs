import { Knex } from 'knex';

const tableName = 'trades_likes';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table: Knex.CreateTableBuilder) => {
    table.unique(['trade_id', 'user_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table) => {
    table.dropUnique(['trade_id', 'user_id']);
  });
}

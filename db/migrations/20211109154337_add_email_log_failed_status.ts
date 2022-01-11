import { Knex } from 'knex';

const tableName = 'email_log';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table: Knex.CreateTableBuilder) => {
    table.boolean('is_success');
    table.text('failed_reason');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table) => {
    table.dropColumn('is_success');
    table.dropColumn('failed_reason');
  });
}

import { Knex } from 'knex';

const tableName = 'user_profile';

export async function up(knex: Knex): Promise<void> {
  await knex.raw('update user_profile set goal=NULL;');

  await knex.schema.alterTable(tableName, (table: Knex.CreateTableBuilder) => {
    table.specificType('goal', 'text ARRAY').alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table) => {
    table.text('goal').alter();
  });
}

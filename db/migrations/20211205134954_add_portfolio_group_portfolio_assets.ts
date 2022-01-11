import { Knex } from 'knex';

const tableName1 = 'portfolio_groups';
const tableName2 = 'portfolio_assets';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(
    tableName1,
    (table: Knex.CreateTableBuilder) => {
      table.increments('id').primary();
      table.text('name');
      table.integer('user_id').references('id').inTable('user_core');
      table.boolean('is_deleted');
      table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
      table.timestamp('last_updated', { useTz: true }).defaultTo(knex.fn.now());
    },
  );

  await knex.schema.createTable(
    tableName2,
    (table: Knex.CreateTableBuilder) => {
      table.increments('id').primary();
      table.integer('asset_id').references('id').inTable('master_assets');
      table.integer('portfolio_group_id').references('id').inTable(tableName1);
      table.enu('type', ['buy', 'sell']);
      table.integer('price');
      table.integer('quantity');
      table.integer('allocation');
      table.boolean('is_deleted');
      table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
      table.timestamp('last_updated', { useTz: true }).defaultTo(knex.fn.now());
    },
  );
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(tableName2);
  await knex.schema.dropTable(tableName1);
}

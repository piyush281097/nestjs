import { Knex } from 'knex';

const tableNameOne = 'posts_comments';
const tableNameTwo = 'trades_comments';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(
    tableNameOne,
    (table: Knex.CreateTableBuilder) => {
      table
        .integer('parent_comment_id')
        .references('id')
        .inTable(tableNameOne)
        .defaultTo(null);
    },
  );
  await knex.schema.alterTable(
    tableNameTwo,
    (table: Knex.CreateTableBuilder) => {
      table
        .integer('parent_comment_id')
        .references('id')
        .inTable(tableNameTwo)
        .defaultTo(null);
    },
  );
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableNameOne, (table) => {
    table.dropColumn('parent_comment_id');
  });
  await knex.schema.alterTable(tableNameTwo, (table) => {
    table.dropColumn('parent_comment_id');
  });
}

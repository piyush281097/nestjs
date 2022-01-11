import { Knex } from 'knex';

const tableName = 'notification_events';
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    tableName,
    (table: Knex.CreateTableBuilder) => {
      table.increments('id').primary();
      table.integer('target_user').references('id').inTable('user_core');
      table.integer('created_by').references('id').inTable('user_core');
      table
        .integer('event_type')
        .references('id')
        .inTable('master_notification_types');
      table.integer('event_parent_id');
      table.boolean('is_read').defaultTo(false);
      table.boolean('is_deleted').defaultTo(false);
      table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
      table.timestamp('last_updated', { useTz: true }).defaultTo(knex.fn.now());
    },
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(tableName);
}

import { Knex } from 'knex';

const tableName = 'otp_log';
export async function up(knex: Knex): Promise<void> {
  const allowedSources: string[] = ['email', 'sms'];
  const allowedTypes: string[] = [
    'new_signup',
    'reset_password',
    'change_password',
  ];

  return knex.schema.createTable(
    tableName,
    (table: Knex.CreateTableBuilder) => {
      table.increments('id').primary();
      table.integer('user_id').references('id').inTable('user_core');
      table.enum('source', allowedSources).notNullable();
      table.enum('type', allowedTypes).notNullable();
      table.text('otp');
      table.boolean('is_verified').defaultTo(0);
      table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
      table.timestamp('last_updated', { useTz: true }).defaultTo(knex.fn.now());
    },
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(tableName);
}

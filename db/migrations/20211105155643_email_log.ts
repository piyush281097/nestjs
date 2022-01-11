import { Knex } from 'knex';

const tableName = 'email_log';
export async function up(knex: Knex): Promise<void> {
  const allowedEmailTypes: string[] = [
    'welcome_email',
    'verify_otp',
    'forgot_password',
    'reset_password',
  ];

  return knex.schema.createTable(
    tableName,
    (table: Knex.CreateTableBuilder) => {
      table.increments('id').primary();
      table.integer('user_id').references('id').inTable('user_core');
      table.enum('email_type', allowedEmailTypes).notNullable();
      table.text('from');
      table.text('to');
      table.text('subject');
      table.text('body');
      table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
      table.timestamp('last_updated', { useTz: true }).defaultTo(knex.fn.now());
    },
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(tableName);
}

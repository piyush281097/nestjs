"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const tableName = 'email_log';
async function up(knex) {
    const allowedEmailTypes = [
        'welcome_email',
        'verify_otp',
        'forgot_password',
        'reset_password',
    ];
    return knex.schema.createTable(tableName, (table) => {
        table.increments('id').primary();
        table.integer('user_id').references('id').inTable('user_core');
        table.enum('email_type', allowedEmailTypes).notNullable();
        table.text('from');
        table.text('to');
        table.text('subject');
        table.text('body');
        table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
        table.timestamp('last_updated', { useTz: true }).defaultTo(knex.fn.now());
    });
}
exports.up = up;
async function down(knex) {
    return knex.schema.dropTable(tableName);
}
exports.down = down;
//# sourceMappingURL=20211105155643_email_log.js.map
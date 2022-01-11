"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const tableName = 'otp_log';
async function up(knex) {
    const allowedSources = ['email', 'sms'];
    const allowedTypes = [
        'new_signup',
        'reset_password',
        'change_password',
    ];
    return knex.schema.createTable(tableName, (table) => {
        table.increments('id').primary();
        table.integer('user_id').references('id').inTable('user_core');
        table.enum('source', allowedSources).notNullable();
        table.enum('type', allowedTypes).notNullable();
        table.text('otp');
        table.boolean('is_verified').defaultTo(0);
        table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
        table.timestamp('last_updated', { useTz: true }).defaultTo(knex.fn.now());
    });
}
exports.up = up;
async function down(knex) {
    return knex.schema.dropTable(tableName);
}
exports.down = down;
//# sourceMappingURL=20211105154556_otp_log.js.map
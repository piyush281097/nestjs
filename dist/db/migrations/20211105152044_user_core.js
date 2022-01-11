"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const tableName = 'user_core';
async function up(knex) {
    return knex.schema.createTable(tableName, (table) => {
        table.increments('id').primary();
        table.text('email').unique();
        table.text('password');
        table.text('password_salt');
        table.boolean('is_verified').defaultTo(false);
        table.boolean('is_active').defaultTo(false);
        table.text('user_handle').unique();
        table.text('country_code');
        table.text('mobile_number');
        table.boolean('is_deleted');
        table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
        table.timestamp('last_updated', { useTz: true }).defaultTo(knex.fn.now());
    });
}
exports.up = up;
async function down(knex) {
    return knex.schema.dropTable(tableName);
}
exports.down = down;
//# sourceMappingURL=20211105152044_user_core.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const tableName = 'user_profile';
async function up(knex) {
    return knex.schema.createTable(tableName, (table) => {
        table.increments('id').primary();
        table.integer('user_id').references('id').inTable('user_core');
        table.text('first_name');
        table.text('last_name');
        table.text('quote');
        table.text('about');
        table.text('goal');
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
//# sourceMappingURL=20211105153346_user_profile.js.map
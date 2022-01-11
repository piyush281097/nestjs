"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const tableName = 'recent_search';
async function up(knex) {
    return knex.schema.createTable(tableName, (table) => {
        table.increments('id').primary();
        table.integer('created_by').references('id').inTable('user_core');
        table.integer('user_id').references('id').inTable('user_core');
        table.integer('asset_id').references('id').inTable('master_assets');
        table.boolean('is_deleted').defaultTo(false);
        table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
        table.timestamp('last_updated', { useTz: true }).defaultTo(knex.fn.now());
    });
}
exports.up = up;
async function down(knex) {
    return knex.schema.dropTable(tableName);
}
exports.down = down;
//# sourceMappingURL=20211206152142_add_recent_search_table.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const tableName = 'tagged_assets';
async function up(knex) {
    const allowedTypes = ['post', 'trade'];
    return knex.schema.createTable(tableName, (table) => {
        table.increments('id').primary();
        table.integer('post_id').references('id').inTable('posts_master');
        table.integer('trade_id').references('id').inTable('trades_master');
        table.integer('asset_id').references('id').inTable('master_assets');
        table.enum('type', allowedTypes).notNullable();
        table.boolean('is_deleted').defaultTo(0);
        table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
        table.timestamp('last_updated', { useTz: true }).defaultTo(knex.fn.now());
    });
}
exports.up = up;
async function down(knex) {
    return knex.schema.dropTable(tableName);
}
exports.down = down;
//# sourceMappingURL=20211105165650_tagged_assets.js.map
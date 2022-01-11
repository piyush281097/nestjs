"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const tableName1 = 'portfolio_groups';
const tableName2 = 'portfolio_assets';
async function up(knex) {
    await knex.schema.createTable(tableName1, (table) => {
        table.increments('id').primary();
        table.text('name');
        table.integer('user_id').references('id').inTable('user_core');
        table.boolean('is_deleted');
        table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
        table.timestamp('last_updated', { useTz: true }).defaultTo(knex.fn.now());
    });
    await knex.schema.createTable(tableName2, (table) => {
        table.increments('id').primary();
        table.integer('asset_id').references('id').inTable('master_assets');
        table.integer('portfolio_group_id').references('id').inTable(tableName1);
        table.enu('type', ['buy', 'sell']);
        table.integer('price');
        table.integer('quantity');
        table.integer('allocation');
        table.boolean('is_deleted');
        table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
        table.timestamp('last_updated', { useTz: true }).defaultTo(knex.fn.now());
    });
}
exports.up = up;
async function down(knex) {
    await knex.schema.dropTable(tableName2);
    await knex.schema.dropTable(tableName1);
}
exports.down = down;
//# sourceMappingURL=20211205134954_add_portfolio_group_portfolio_assets.js.map
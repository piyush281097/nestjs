"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const tableName = 'profile_media';
async function up(knex) {
    return knex.schema.createTable(tableName, (table) => {
        table.increments('id').primary();
        table.integer('user_id').references('id').inTable('user_core');
        table.text('image_org');
        table.text('image_thumb');
        table.text('image_small');
        table.text('image_medium');
        table.text('image_large');
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
//# sourceMappingURL=20211105160413_profile_media.js.map
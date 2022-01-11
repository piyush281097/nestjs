"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const tableName = 'comment_likes';
async function up(knex) {
    return knex.schema.createTable(tableName, (table) => {
        table.increments('id').primary();
        table
            .integer('post_comment_id')
            .references('id')
            .inTable('posts_comments');
        table
            .integer('trades_comment_id')
            .references('id')
            .inTable('trades_comments');
        table.integer('user_id').references('id').inTable('user_core');
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
//# sourceMappingURL=20211124143126_add_comments_like_table.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const tableName = 'tagged_users';
async function up(knex) {
    await knex.schema.alterTable(tableName, (table) => {
        table.integer('post_comment_id').references('id').inTable('posts_comments');
        table
            .integer('trade_comment_id')
            .references('id')
            .inTable('trades_comments');
    });
}
exports.up = up;
async function down(knex) {
    await knex.schema.alterTable(tableName, (table) => {
        table.dropColumn('post_comment_id');
        table.dropColumn('trade_comment_id');
    });
}
exports.down = down;
//# sourceMappingURL=20211124140921_add_comment_column_for_user_tagging.js.map
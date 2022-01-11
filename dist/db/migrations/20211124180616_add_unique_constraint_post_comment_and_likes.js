"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const tableName = 'comment_likes';
async function up(knex) {
    await knex.schema.alterTable(tableName, (table) => {
        table.unique(['post_comment_id', 'user_id']);
        table.unique(['trades_comment_id', 'user_id']);
    });
}
exports.up = up;
async function down(knex) {
    await knex.schema.alterTable(tableName, (table) => {
        table.dropUnique(['post_comment_id', 'user_id']);
        table.dropUnique(['trades_comment_id', 'user_id']);
    });
}
exports.down = down;
//# sourceMappingURL=20211124180616_add_unique_constraint_post_comment_and_likes.js.map
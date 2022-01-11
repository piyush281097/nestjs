"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const tableNameOne = 'posts_comments';
const tableNameTwo = 'trades_comments';
async function up(knex) {
    await knex.schema.alterTable(tableNameOne, (table) => {
        table
            .integer('parent_comment_id')
            .references('id')
            .inTable(tableNameOne)
            .defaultTo(null);
    });
    await knex.schema.alterTable(tableNameTwo, (table) => {
        table
            .integer('parent_comment_id')
            .references('id')
            .inTable(tableNameTwo)
            .defaultTo(null);
    });
}
exports.up = up;
async function down(knex) {
    await knex.schema.alterTable(tableNameOne, (table) => {
        table.dropColumn('parent_comment_id');
    });
    await knex.schema.alterTable(tableNameTwo, (table) => {
        table.dropColumn('parent_comment_id');
    });
}
exports.down = down;
//# sourceMappingURL=20211127163622_add_reply_parent_id_to_comments.js.map
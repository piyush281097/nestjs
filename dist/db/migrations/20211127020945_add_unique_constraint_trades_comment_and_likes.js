"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const tableName = 'trades_likes';
async function up(knex) {
    await knex.schema.alterTable(tableName, (table) => {
        table.unique(['trade_id', 'user_id']);
    });
}
exports.up = up;
async function down(knex) {
    await knex.schema.alterTable(tableName, (table) => {
        table.dropUnique(['trade_id', 'user_id']);
    });
}
exports.down = down;
//# sourceMappingURL=20211127020945_add_unique_constraint_trades_comment_and_likes.js.map
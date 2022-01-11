"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const tableName = 'followers';
async function up(knex) {
    await knex.schema.alterTable(tableName, (table) => {
        table.unique(['user_id', 'follower_id']);
    });
}
exports.up = up;
async function down(knex) {
    await knex.schema.alterTable(tableName, (table) => {
        table.dropUnique(['user_id', 'follower_id']);
    });
}
exports.down = down;
//# sourceMappingURL=20211128091434_add_unqique_constraint_followers_user_id.js.map
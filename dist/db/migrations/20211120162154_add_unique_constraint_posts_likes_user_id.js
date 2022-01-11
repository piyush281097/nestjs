"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const tableName = 'posts_likes';
async function up(knex) {
    await knex.schema.alterTable(tableName, (table) => {
        table.unique(['post_id', 'user_id']);
    });
}
exports.up = up;
async function down(knex) {
    await knex.schema.alterTable(tableName, (table) => {
        table.dropUnique(['post_id', 'user_id']);
    });
}
exports.down = down;
//# sourceMappingURL=20211120162154_add_unique_constraint_posts_likes_user_id.js.map
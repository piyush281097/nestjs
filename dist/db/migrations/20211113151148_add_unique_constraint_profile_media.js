"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const tableName = 'profile_media';
async function up(knex) {
    await knex.schema.alterTable(tableName, (table) => {
        table.unique(['user_id']);
    });
}
exports.up = up;
async function down(knex) {
    await knex.schema.alterTable(tableName, (table) => {
        table.dropUnique(null, 'user_id');
    });
}
exports.down = down;
//# sourceMappingURL=20211113151148_add_unique_constraint_profile_media.js.map
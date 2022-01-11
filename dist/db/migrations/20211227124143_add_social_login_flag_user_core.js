"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const tableName = 'user_core';
async function up(knex) {
    await knex.schema.alterTable(tableName, (table) => {
        table.boolean('is_social_login').defaultTo(false);
    });
}
exports.up = up;
async function down(knex) {
    await knex.schema.alterTable(tableName, (table) => {
        table.dropColumn('is_social_login');
    });
}
exports.down = down;
//# sourceMappingURL=20211227124143_add_social_login_flag_user_core.js.map
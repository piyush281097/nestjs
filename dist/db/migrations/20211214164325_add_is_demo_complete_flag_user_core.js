"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const tableName = 'user_core';
async function up(knex) {
    await knex.schema.alterTable(tableName, (table) => {
        table.boolean('is_demo_complete').defaultTo(false);
    });
}
exports.up = up;
async function down(knex) {
    await knex.schema.alterTable(tableName, (table) => {
        table.dropColumn('is_demo_complete');
    });
}
exports.down = down;
//# sourceMappingURL=20211214164325_add_is_demo_complete_flag_user_core.js.map
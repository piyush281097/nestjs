"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const tableName = 'user_profile';
async function up(knex) {
    await knex.raw('update user_profile set goal=NULL;');
    await knex.schema.alterTable(tableName, (table) => {
        table.specificType('goal', 'text ARRAY').alter();
    });
}
exports.up = up;
async function down(knex) {
    await knex.schema.alterTable(tableName, (table) => {
        table.text('goal').alter();
    });
}
exports.down = down;
//# sourceMappingURL=20211224065254_change_column_type_goals.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const tableName = 'master_assets';
async function up(knex) {
    await knex.schema.alterTable(tableName, (table) => {
        table.unique(['symbol']);
        table.dropColumn('name');
        table.dropColumn('logo');
    });
}
exports.up = up;
async function down(knex) {
    await knex.schema.alterTable(tableName, (table) => {
        table.dropUnique(['symbol']);
        table.text('name');
        table.text('logo');
    });
}
exports.down = down;
//# sourceMappingURL=20211204074010_add_unqique_constraint_assets.js.map
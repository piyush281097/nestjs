"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const tableName = 'trades_master';
async function up(knex) {
    await knex.schema.alterTable(tableName, (table) => {
        table.integer('price').alter();
    });
}
exports.up = up;
async function down(knex) {
    await knex.schema.alterTable(tableName, (table) => {
        table.string('price').alter();
    });
}
exports.down = down;
//# sourceMappingURL=20211127012319_change_datatype_trade_master_price.js.map
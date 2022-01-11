"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const tableName = 'trades_master';
async function up(knex) {
    await knex.schema.alterTable(tableName, (table) => {
        table.enu('type', ['buy', 'sell']);
    });
}
exports.up = up;
async function down(knex) {
    await knex.schema.alterTable(tableName, (table) => {
        table.dropColumn('type');
    });
}
exports.down = down;
//# sourceMappingURL=20211127012921_add_trade_type_on_trade_master_price.js.map
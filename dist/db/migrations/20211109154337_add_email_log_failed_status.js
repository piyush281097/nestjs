"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const tableName = 'email_log';
async function up(knex) {
    await knex.schema.alterTable(tableName, (table) => {
        table.boolean('is_success');
        table.text('failed_reason');
    });
}
exports.up = up;
async function down(knex) {
    await knex.schema.alterTable(tableName, (table) => {
        table.dropColumn('is_success');
        table.dropColumn('failed_reason');
    });
}
exports.down = down;
//# sourceMappingURL=20211109154337_add_email_log_failed_status.js.map
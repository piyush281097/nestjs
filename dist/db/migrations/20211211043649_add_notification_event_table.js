"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const tableName = 'notification_events';
async function up(knex) {
    return knex.schema.createTable(tableName, (table) => {
        table.increments('id').primary();
        table.integer('target_user').references('id').inTable('user_core');
        table.integer('created_by').references('id').inTable('user_core');
        table
            .integer('event_type')
            .references('id')
            .inTable('master_notification_types');
        table.integer('event_parent_id');
        table.boolean('is_read').defaultTo(false);
        table.boolean('is_deleted').defaultTo(false);
        table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
        table.timestamp('last_updated', { useTz: true }).defaultTo(knex.fn.now());
    });
}
exports.up = up;
async function down(knex) {
    return knex.schema.dropTable(tableName);
}
exports.down = down;
//# sourceMappingURL=20211211043649_add_notification_event_table.js.map
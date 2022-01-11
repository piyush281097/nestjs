"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const table = 'tagged_hashtags';
const column = 'type';
const formatAlterTableEnumSql = (tableName, columnName, enums) => {
    const constraintName = `${tableName}_${columnName}_check`;
    return [
        `ALTER TABLE ${tableName} DROP CONSTRAINT IF EXISTS ${constraintName};`,
        `ALTER TABLE ${tableName} ADD CONSTRAINT ${constraintName} CHECK (${columnName} = ANY (ARRAY['${enums.join(`'::text, '`)}'::text]));`,
    ].join('\n');
};
const allowedTypes = [
    'post',
    'trade',
    'post_comment',
    'trade_comment',
];
async function up(knex) {
    await knex.raw(formatAlterTableEnumSql(table, column, allowedTypes));
}
exports.up = up;
async function down(knex) {
    await knex.raw(formatAlterTableEnumSql(table, column, ['post', 'trade']));
}
exports.down = down;
//# sourceMappingURL=20211124150227_add_enums_to_tagged_hashtags.js.map
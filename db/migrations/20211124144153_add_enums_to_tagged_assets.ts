import { Knex } from 'knex';

const table = 'tagged_assets';
const column = 'type';

const formatAlterTableEnumSql = (tableName, columnName, enums) => {
  const constraintName = `${tableName}_${columnName}_check`;
  return [
    `ALTER TABLE ${tableName} DROP CONSTRAINT IF EXISTS ${constraintName};`,
    `ALTER TABLE ${tableName} ADD CONSTRAINT ${constraintName} CHECK (${columnName} = ANY (ARRAY['${enums.join(
      `'::text, '`,
    )}'::text]));`,
  ].join('\n');
};

const allowedTypes: string[] = [
  'post',
  'trade',
  'post_comment',
  'trade_comment',
];
export async function up(knex: Knex): Promise<void> {
  await knex.raw(formatAlterTableEnumSql(table, column, allowedTypes));
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(formatAlterTableEnumSql(table, column, ['post', 'trade']));
}

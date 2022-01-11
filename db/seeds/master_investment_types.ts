import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  const tableName = 'master_investment_types';
  // Deletes ALL existing entries
  await knex(tableName).del();

  // Inserts seed entries
  await knex(tableName).insert([
    {
      type: 'Intraday Trading',
    },
    {
      type: 'Short Term Trading',
    },
    {
      type: 'Short Term Investment',
    },
    {
      type: 'Long Term Investment',
    },
    {
      type: 'Swing Trading',
    },
  ]);
}

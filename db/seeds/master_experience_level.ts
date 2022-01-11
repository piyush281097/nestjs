import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  const tableName = 'master_experience_level';
  // Deletes ALL existing entries
  await knex(tableName).del();

  // Inserts seed entries
  await knex(tableName).insert([
    {
      type: 'Beginner',
    },
    {
      type: 'Intermediate',
    },
    {
      type: 'Advanced',
    },
    {
      type: 'Expert',
    },
  ]);
}

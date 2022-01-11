import { config } from 'dotenv';
config();

export default {
  development: {
    client: 'postgresql',
    connection: {
      database: "test",
      user: "postgres",
      password: "myPassword",
      host: "localhost",
      port: "5432",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: './db/migrations',
      // tableName: 'knex_migrations_investmates',
    },
    seeds: {
      directory: './db/seeds',
    },
  },
};

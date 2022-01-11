// Update with your config settings.
const path = require('path')

module.exports = {

  development: {
    client: 'pg',
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
      extension: 'ts',
      directory: './db/migrations',
      // tableName: 'knex_migrations_investmates',
    },
    seeds: {
      directory: './db/seeds',
    },
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'test',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};

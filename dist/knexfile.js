"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.default = {
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
        },
        seeds: {
            directory: './db/seeds',
        },
    },
};
//# sourceMappingURL=knexfile.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pgConnectionFactory = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const configuration_1 = require("./../config/configuration");
const database_constants_1 = require("./database.constants");
exports.pgConnectionFactory = {
    provide: database_constants_1.POSTGRES_CONNECTION,
    useFactory: async (config) => {
        const logger = new common_1.Logger('pgConnectionFactory');
        const pool = new pg_1.Pool({
            host: config.pg.host,
            database: config.pg.database,
            port: parseInt(config.pg.port, 10),
            user: config.pg.username,
            password: config.pg.password,
        });
        return (0, rxjs_1.lastValueFrom)((0, rxjs_1.from)(pool.connect()).pipe((0, operators_1.retryWhen)((e) => e.pipe((0, operators_1.scan)((errorCount, error) => {
            logger.warn(`Unable to connect to database. ${error.message}. Retrying ${errorCount + 1}...`);
            if (errorCount + 1 > 9) {
                throw error;
            }
            return errorCount + 1;
        }, 0), (0, operators_1.delay)(1 * 1000))), (0, operators_1.tap)(() => {
            logger.log('Connected to Postgres Database successfully!');
        })));
    },
    inject: [configuration_1.default.KEY],
};
//# sourceMappingURL=database.provider.js.map
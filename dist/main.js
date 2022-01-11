/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var __resourceQuery = "?100";
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
/*globals __resourceQuery */
if (true) {
	var hotPollInterval = +__resourceQuery.substr(1) || 0;
	var log = __webpack_require__(1);

	var checkForUpdate = function checkForUpdate(fromUpdate) {
		if (module.hot.status() === "idle") {
			module.hot
				.check(true)
				.then(function (updatedModules) {
					if (!updatedModules) {
						if (fromUpdate) log("info", "[HMR] Update applied.");
						return;
					}
					__webpack_require__(2)(updatedModules, updatedModules);
					checkForUpdate(true);
				})
				.catch(function (err) {
					var status = module.hot.status();
					if (["abort", "fail"].indexOf(status) >= 0) {
						log("warning", "[HMR] Cannot apply update.");
						log("warning", "[HMR] " + log.formatError(err));
						log("warning", "[HMR] You need to restart the application!");
					} else {
						log("warning", "[HMR] Update failed: " + log.formatError(err));
					}
				});
		}
	};
	setInterval(checkForUpdate, hotPollInterval);
} else {}


/***/ }),
/* 1 */
/***/ ((module) => {

var logLevel = "info";

function dummy() {}

function shouldLog(level) {
	var shouldLog =
		(logLevel === "info" && level === "info") ||
		(["info", "warning"].indexOf(logLevel) >= 0 && level === "warning") ||
		(["info", "warning", "error"].indexOf(logLevel) >= 0 && level === "error");
	return shouldLog;
}

function logGroup(logFn) {
	return function (level, msg) {
		if (shouldLog(level)) {
			logFn(msg);
		}
	};
}

module.exports = function (level, msg) {
	if (shouldLog(level)) {
		if (level === "info") {
			console.log(msg);
		} else if (level === "warning") {
			console.warn(msg);
		} else if (level === "error") {
			console.error(msg);
		}
	}
};

/* eslint-disable node/no-unsupported-features/node-builtins */
var group = console.group || dummy;
var groupCollapsed = console.groupCollapsed || dummy;
var groupEnd = console.groupEnd || dummy;
/* eslint-enable node/no-unsupported-features/node-builtins */

module.exports.group = logGroup(group);

module.exports.groupCollapsed = logGroup(groupCollapsed);

module.exports.groupEnd = logGroup(groupEnd);

module.exports.setLogLevel = function (level) {
	logLevel = level;
};

module.exports.formatError = function (err) {
	var message = err.message;
	var stack = err.stack;
	if (!stack) {
		return message;
	} else if (stack.indexOf(message) < 0) {
		return message + "\n" + stack;
	} else {
		return stack;
	}
};


/***/ }),
/* 2 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
module.exports = function (updatedModules, renewedModules) {
	var unacceptedModules = updatedModules.filter(function (moduleId) {
		return renewedModules && renewedModules.indexOf(moduleId) < 0;
	});
	var log = __webpack_require__(1);

	if (unacceptedModules.length > 0) {
		log(
			"warning",
			"[HMR] The following modules couldn't be hot updated: (They would need a full reload!)"
		);
		unacceptedModules.forEach(function (moduleId) {
			log("warning", "[HMR]  - " + moduleId);
		});
	}

	if (!renewedModules || renewedModules.length === 0) {
		log("info", "[HMR] Nothing hot updated.");
	} else {
		log("info", "[HMR] Updated modules:");
		renewedModules.forEach(function (moduleId) {
			if (typeof moduleId === "string" && moduleId.indexOf("!") !== -1) {
				var parts = moduleId.split("!");
				log.groupCollapsed("info", "[HMR]  - " + parts.pop());
				log("info", "[HMR]  - " + moduleId);
				log.groupEnd("info");
			} else {
				log("info", "[HMR]  - " + moduleId);
			}
		});
		var numberIds = renewedModules.every(function (moduleId) {
			return typeof moduleId === "number";
		});
		if (numberIds)
			log(
				"info",
				'[HMR] Consider using the optimization.moduleIds: "named" for module names.'
			);
	}
};


/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const common_1 = __webpack_require__(4);
const config_1 = __webpack_require__(5);
const core_1 = __webpack_require__(6);
const swagger_1 = __webpack_require__(7);
const package_json_1 = __webpack_require__(8);
const app_module_1 = __webpack_require__(9);
const request_logger_1 = __webpack_require__(184);
const logging_service_1 = __webpack_require__(26);
const utils_service_1 = __webpack_require__(23);
async function bootstrap() {
    const logger = new logging_service_1.Logger('main');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useLogger(logger);
    (0, request_logger_1.useRequestLogging)(app);
    app.enableVersioning({
        type: common_1.VersioningType.URI,
    });
    const config = app.get(config_1.ConfigService);
    const port = config.get('config.port');
    const env = config.get('config.environment');
    app.setGlobalPrefix('/api', {
        exclude: [{ path: '/api-docs', method: common_1.RequestMethod.GET }],
    });
    if (process.env.NODE_ENV !== 'production') {
        app.enableCors({
            origin: true,
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
            credentials: true,
        });
    }
    if (process.env.SWAGGER_SERVER === 'true') {
        const options = new swagger_1.DocumentBuilder()
            .setTitle(utils_service_1.UtilsService.convertStringToSentenceCase(package_json_1.name.replace(/-/gi, ' ')))
            .setDescription(`${package_json_1.description}\nRunning on ${process.env.NODE_ENV} Mode`)
            .setVersion(package_json_1.version)
            .addServer(`http://${process.env.LOCALHOST}:${process.env.PORT}`, 'Local Dev Server')
            .addServer(`http://${process.env.DEV_SERVER_URL}`, 'Remote Dev Server')
            .addBearerAuth()
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, options);
        swagger_1.SwaggerModule.setup('api-docs', app, document, {
            uiConfig: { defaultModelsExpandDepth: -1 },
        });
    }
    await app.listen(port, '0.0.0.0');
    logger.log(`Listening on port ${port}, running in ${env} environment`);
}
bootstrap();


/***/ }),
/* 4 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/common");

/***/ }),
/* 5 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/config");

/***/ }),
/* 6 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/core");

/***/ }),
/* 7 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/swagger");

/***/ }),
/* 8 */
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"name":"invest-mates","version":"0.0.1","description":"","author":"","private":true,"license":"UNLICENSED","scripts":{"prebuild":"rimraf dist","build":"nest build","format":"prettier --write \\"src/**/*.ts\\" \\"test/**/*.ts\\"","start":"nest start","start:dev":"nest build --webpack --webpackPath webpack-hmr.config.js --watch","start:debug":"nest start --debug --watch","start:prod":"node dist/main","lint":"eslint \\"{src,apps,libs,test}/**/*.ts\\" --fix","test":"jest","test:watch":"jest --watch","test:cov":"jest --coverage","test:debug":"node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand","test:e2e":"jest --config ./test/jest-e2e.json","create:migration":"knex migrate:make","start:migrations":"knex migrate:latest --env development","revert:migrations":"knex migrate:rollback --env development","create:seed":"knex seed:make","start:seed":"knex seed:run --env development","start:seed-file":"knex seed:run  --env development --specific="},"dependencies":{"@nestjs/axios":"^0.0.3","@nestjs/common":"^8.0.0","@nestjs/config":"^1.0.3","@nestjs/core":"^8.0.0","@nestjs/jwt":"^8.0.0","@nestjs/passport":"^8.0.1","@nestjs/platform-express":"^8.0.0","@nestjs/swagger":"^5.1.5","@sendgrid/mail":"^7.6.0","aws-sdk":"^2.1024.0","bcrypt":"^5.0.1","class-transformer":"^0.4.0","class-validator":"^0.13.1","iexjs":"^0.4.0","joi":"^17.4.2","knex":"^0.95.12","morgan":"^1.10.0","passport":"^0.5.0","passport-google-oauth20":"^2.0.0","passport-jwt":"^4.0.0","passport-local":"^1.0.0","pg":"^8.7.1","reflect-metadata":"^0.1.13","rimraf":"^3.0.2","rxjs":"^7.2.0","swagger-ui-express":"^4.3.0"},"devDependencies":{"@nestjs/cli":"^8.0.0","@nestjs/schematics":"^8.0.0","@nestjs/testing":"^8.0.0","@types/bcrypt":"^5.0.0","@types/express":"^4.17.13","@types/jest":"^27.0.1","@types/morgan":"^1.9.3","@types/node":"^16.0.0","@types/passport-google-oauth20":"^2.0.11","@types/passport-jwt":"^3.0.6","@types/passport-local":"^1.0.34","@types/pg":"^8.6.1","@types/supertest":"^2.0.11","@typescript-eslint/eslint-plugin":"^4.28.2","@typescript-eslint/parser":"^4.28.2","eslint":"^7.30.0","eslint-config-prettier":"^8.3.0","eslint-plugin-prettier":"^3.4.0","jest":"^27.0.6","prettier":"^2.3.2","run-script-webpack-plugin":"0.0.11","supertest":"^6.1.3","ts-jest":"^27.0.3","ts-loader":"^9.2.3","ts-node":"^10.0.0","tsconfig-paths":"^3.10.1","typescript":"^4.3.5","webpack":"^5.65.0","webpack-node-externals":"^3.0.0"},"jest":{"moduleFileExtensions":["js","json","ts"],"rootDir":"src","testRegex":".*\\\\.spec\\\\.ts$","transform":{"^.+\\\\.(t|j)s$":"ts-jest"},"collectCoverageFrom":["**/*.(t|j)s"],"coverageDirectory":"../coverage","testEnvironment":"node"}}');

/***/ }),
/* 9 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(4);
const config_1 = __webpack_require__(5);
const configuration_1 = __webpack_require__(10);
const validation_1 = __webpack_require__(11);
const database_module_1 = __webpack_require__(13);
const logging_module_1 = __webpack_require__(25);
const shared_module_1 = __webpack_require__(27);
const core_1 = __webpack_require__(6);
const http_exception_filter_1 = __webpack_require__(40);
const api_module_1 = __webpack_require__(41);
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.default],
                validationSchema: validation_1.default,
            }),
            database_module_1.DatabaseModule,
            api_module_1.ApiModule,
            logging_module_1.LoggerModule,
            shared_module_1.SharedModule,
        ],
        providers: [
            {
                provide: core_1.APP_FILTER,
                useClass: http_exception_filter_1.HttpExceptionFilter,
            },
        ],
    })
], AppModule);
exports.AppModule = AppModule;


/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const config_1 = __webpack_require__(5);
exports["default"] = (0, config_1.registerAs)('config', () => ({
    environment: process.env.NODE_ENV,
    loggerLevel: process.env.LOGGER_LEVEL,
    port: process.env.PORT,
    pg: {
        host: "localhost",
        port: "5432",
        database: "test",
        username: "postgres",
        password: "myPassword",
    },
    saltRounds: parseInt(process.env.SALT_ROUNDS),
    sendGridAPIKey: process.env.SENDGRID_API_KEY,
    aws: {
        accessKeyID: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
    },
    jwt: {
        accessTokenSecret: process.env.JWT_SECRET,
        accessTokenExpiry: process.env.JWT_EXPIRY,
        refreshTokenSecret: process.env.JWT_REFRESH_SECRET,
        refreshTokenExpiry: process.env.JWT_REFRESH_EXPIRY,
    },
    iex: {
        publicKey: process.env.IEX_PUBLIC_KEY,
        secretKey: process.env.IEX_SECRET_KEY,
        baseUrl: process.env.IEX_BASE_URL,
    },
    cityFalcon: {
        apiKey: process.env.CITY_FALCON_API_KEY,
        baseUrl: process.env.CITY_FALCON_BASE_URL,
    },
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackUrl: process.env.GOOGLE_CALLBACK_URL,
    },
}));


/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const Joi = __webpack_require__(12);
exports["default"] = Joi.object({
    NODE_ENV: Joi.string()
        .valid('development', 'staging', 'production')
        .default('development'),
    LOGGER_LEVEL: Joi.string()
        .valid('error', 'warn', 'log', 'debug')
        .default('log'),
    PORT: Joi.number().default(3000),
    DB_PORT: Joi.number().default(5432),
});


/***/ }),
/* 12 */
/***/ ((module) => {

"use strict";
module.exports = require("joi");

/***/ }),
/* 13 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DatabaseModule = void 0;
const common_1 = __webpack_require__(4);
const database_provider_1 = __webpack_require__(14);
const database_service_1 = __webpack_require__(19);
let DatabaseModule = class DatabaseModule {
};
DatabaseModule = __decorate([
    (0, common_1.Module)({
        providers: [database_provider_1.pgConnectionFactory, database_service_1.DatabaseService],
        exports: [database_service_1.DatabaseService],
    })
], DatabaseModule);
exports.DatabaseModule = DatabaseModule;


/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.pgConnectionFactory = void 0;
const common_1 = __webpack_require__(4);
const pg_1 = __webpack_require__(15);
const rxjs_1 = __webpack_require__(16);
const operators_1 = __webpack_require__(17);
const configuration_1 = __webpack_require__(10);
const database_constants_1 = __webpack_require__(18);
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


/***/ }),
/* 15 */
/***/ ((module) => {

"use strict";
module.exports = require("pg");

/***/ }),
/* 16 */
/***/ ((module) => {

"use strict";
module.exports = require("rxjs");

/***/ }),
/* 17 */
/***/ ((module) => {

"use strict";
module.exports = require("rxjs/operators");

/***/ }),
/* 18 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.POSTGRES_CONNECTION = void 0;
exports.POSTGRES_CONNECTION = 'postgres_connection';


/***/ }),
/* 19 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var DatabaseService_1, _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DatabaseService = void 0;
const common_1 = __webpack_require__(4);
const class_transformer_1 = __webpack_require__(20);
const pg_1 = __webpack_require__(15);
const rxjs_1 = __webpack_require__(16);
const operators_1 = __webpack_require__(17);
const database_constants_1 = __webpack_require__(18);
const db_exception_error_1 = __webpack_require__(21);
let DatabaseService = DatabaseService_1 = class DatabaseService {
    constructor(pool) {
        this.pool = pool;
        this.logger = new common_1.Logger(DatabaseService_1.name);
    }
    static isArray(a) {
        return !!a && a.constructor === Array;
    }
    static isObject(a) {
        return !!a && a.constructor === Object;
    }
    runQuery(query, params, type, camelCase = true) {
        const start = Date.now();
        return (0, rxjs_1.from)(this.pool.query(query, params)).pipe((0, operators_1.tap)((qRes) => {
            this.logger.debug({
                query,
                time: Date.now() - start,
                rows: qRes.rowCount,
            });
        }), (0, operators_1.map)((qRes) => qRes.rows
            .map((row) => (camelCase ? this.underScoreToCamelCase(row) : row))
            .map((row) => (0, class_transformer_1.plainToClass)(type, row))), (0, operators_1.catchError)((err) => {
            this.logger.debug({
                query,
                time: Date.now() - start,
            });
            this.logger.error(err);
            throw new db_exception_error_1.DbExceptionError(err, err.message);
        }));
    }
    underScoreToCamelCase(record) {
        const newObj = {};
        Object.keys(record).forEach((key) => {
            const origKey = key;
            while (key.indexOf('_') > -1) {
                const _index = key.indexOf('_');
                const nextChar = key.charAt(_index + 1);
                key = key.replace(`_${nextChar}`, nextChar.toUpperCase());
            }
            if (DatabaseService_1.isArray(record[origKey]) &&
                !record[origKey].every((i) => typeof i === 'string')) {
                record[origKey] = record[origKey].map((obj) => {
                    return this.underScoreToCamelCase(obj);
                });
            }
            if (DatabaseService_1.isObject(record[origKey])) {
                record[origKey] = this.underScoreToCamelCase(record[origKey]);
            }
            newObj[key] = record[origKey];
        });
        return newObj;
    }
    rawQuery(query, params, type, camelCase) {
        return this.runQuery(query, params, type, camelCase);
    }
};
DatabaseService = DatabaseService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(database_constants_1.POSTGRES_CONNECTION)),
    __metadata("design:paramtypes", [typeof (_a = typeof pg_1.Pool !== "undefined" && pg_1.Pool) === "function" ? _a : Object])
], DatabaseService);
exports.DatabaseService = DatabaseService;


/***/ }),
/* 20 */
/***/ ((module) => {

"use strict";
module.exports = require("class-transformer");

/***/ }),
/* 21 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DbExceptionError = void 0;
const constants_1 = __webpack_require__(22);
const common_1 = __webpack_require__(4);
const utils_service_1 = __webpack_require__(23);
class DbExceptionError extends common_1.HttpException {
    constructor(props, context) {
        if (context.includes('duplicate key value violates unique constraint')) {
            props = {
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                message: [
                    `${utils_service_1.UtilsService.convertSnakeCaseToCamelCase(props.detail.split(/[()]/, 2)[1])} should be unique`,
                ],
            };
            context = 400;
        }
        else if (context.includes('violates foreign key constraint')) {
            props = {
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                message: [
                    `${utils_service_1.UtilsService.convertSnakeCaseToCamelCase(props.detail.split(/[()]/, 2)[1])} is invalid`,
                ],
            };
            context = 400;
        }
        else if (context.includes('violates check constraint')) {
            props = {
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                message: [
                    `${utils_service_1.UtilsService.convertSnakeCaseToCamelCase(context.split(/"(.*?)"/g, 2)[1])} should be a allowed value`,
                ],
            };
            context = 400;
        }
        else {
            props = {
                statusCode: constants_1.ERROR_CODES.DEFAULT.statusCode,
                message: constants_1.ERROR_CODES.DEFAULT.message,
            };
            context = constants_1.ERROR_CODES.DEFAULT.statusCode;
        }
        super(props, context);
    }
}
exports.DbExceptionError = DbExceptionError;


/***/ }),
/* 22 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IMAGE_EXTENSION = exports.S3_FOLDER_POSTS_ATTACHMENT = exports.S3_FOLDER_PROFILE_IMAGE = exports.S3_BUCKET = exports.IMAGE_FILE_EXTENSIONS = exports.INVESTMATES_EMAIL = exports.OTP_TYPES = exports.TAGGED_TYPE = exports.SOURCE_TYPES = exports.EMAIL_TYPES = exports.ERROR_CODES = exports.MAX_JSON_REQUEST_SIZE = void 0;
const common_1 = __webpack_require__(4);
exports.MAX_JSON_REQUEST_SIZE = 10485760;
exports.ERROR_CODES = {
    DEFAULT: {
        statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Unknown error occurred',
    },
};
exports.EMAIL_TYPES = {
    welcome_email: 'welcome_email',
    verify_otp: 'verify_otp',
    forgot_password: 'forgot_password',
    reset_password: 'reset_password',
};
exports.SOURCE_TYPES = {
    email: 'email',
    otp: 'otp',
    social: 'social',
};
exports.TAGGED_TYPE = {
    post: 'post',
    post_comment: 'post_comment',
    trade: 'trade',
    trade_comment: 'trade_comment',
};
exports.OTP_TYPES = {
    new_signup: 'new_signup',
    reset_password: 'reset_password',
    resend_signup: 'resend_signup',
};
exports.INVESTMATES_EMAIL = 'hello@investmates.io';
exports.IMAGE_FILE_EXTENSIONS = ['jpg', 'jpeg', 'png'];
exports.S3_BUCKET = 'investmates-images';
exports.S3_FOLDER_PROFILE_IMAGE = 'profile_image';
exports.S3_FOLDER_POSTS_ATTACHMENT = 'posts_attachment';
exports.IMAGE_EXTENSION = {
    thumbnail: '_t.',
    small: '_sm.',
    medium: '_md.',
    large: '_lg.',
};


/***/ }),
/* 23 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UtilsService = void 0;
const bcrypt = __webpack_require__(24);
const constants_1 = __webpack_require__(22);
const common_1 = __webpack_require__(4);
let UtilsService = class UtilsService {
    static convertStringToSentenceCase(stringToBeConverted) {
        return stringToBeConverted.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    }
    static convertSnakeCaseToCamelCase(stringToBeConverted) {
        return stringToBeConverted.replace(/(_\w)/g, (k) => {
            return k[1].toUpperCase();
        });
    }
    static camelToSnakeCase(str) {
        return str.replace(/[A-Z0-9]/g, (letter) => `_${letter.toLowerCase()}`);
    }
    static isObjectEmpty(objectToCheck) {
        for (const i in objectToCheck)
            return false;
        return true;
    }
    static async generatePasswordHash(password, saltRounds) {
        const passwordSalt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, passwordSalt);
        return {
            passwordSalt,
            hashedPassword,
        };
    }
    static async comparePassword(password, hashedPassword) {
        return bcrypt.compare(password, hashedPassword);
    }
    static generatePassword(length = 10) {
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let password = '';
        for (let i = 0, n = charset.length; i < length; ++i) {
            password += charset.charAt(Math.floor(Math.random() * n));
        }
        return password;
    }
    static generateImagUrlForAllSizes(originalImageUrl) {
        const regexForFileTypeExtension = /(_o.)(?!.*\1)/gm;
        const urlSplit = originalImageUrl.split(regexForFileTypeExtension);
        const mediaTypes = {
            thumbnail: '',
            small: '',
            medium: '',
            large: '',
            original: originalImageUrl,
        };
        for (const key in constants_1.IMAGE_EXTENSION) {
            mediaTypes[key] = `${urlSplit[0]}${constants_1.IMAGE_EXTENSION[key]}${urlSplit[2]}`;
        }
        return mediaTypes;
    }
    static buildInsertQuery({ tableName, columnData, keysToIgnore, keysToReplace = {}, addSqlQuery = {}, start = 1, }) {
        columnData = columnData.map((singleData) => {
            for (const singleKeyToReplace in keysToReplace) {
                singleData[singleKeyToReplace] = keysToReplace[singleKeyToReplace];
            }
            return singleData;
        });
        const columnKeyNames = Object.keys(columnData[0]);
        const columnNamesSnakeCase = columnKeyNames
            .filter((x) => !keysToIgnore.includes(x))
            .map(this.camelToSnakeCase)
            .map((x) => `"${x}"`);
        const param = [], value = [];
        for (const key in addSqlQuery) {
            columnNamesSnakeCase.push(key);
        }
        for (const singleRow of columnData) {
            const { preparedParam, preparedValue } = this.getPreparedParams(singleRow, keysToIgnore, start, columnKeyNames);
            for (const key in addSqlQuery) {
                preparedParam.push(addSqlQuery[key]);
            }
            param.push(preparedParam);
            value.push(...preparedValue);
            start += preparedValue.length;
        }
        const columnNames = columnNamesSnakeCase.join(', ');
        return {
            query: `INSERT INTO ${tableName} (${columnNames})
              VALUES ${param.map((x) => `(${x.join(', ')})`)}`,
            data: value,
        };
    }
    static buildUpdateQuery({ tableName, columnData, keysToIgnore, keysToReplace = {}, addSqlQuery = {}, whereCondition, start = 1, }) {
        for (const singleKeyToReplace in keysToReplace) {
            columnData[singleKeyToReplace] = keysToReplace[singleKeyToReplace];
        }
        const { preparedParam, preparedValue } = this.alterPreparedParams(columnData, keysToIgnore, start);
        for (const key in addSqlQuery) {
            preparedParam.push(`${key} = ${addSqlQuery[key]}`);
        }
        return {
            query: `UPDATE ${tableName}
              SET ${preparedParam.join(', ')}
              WHERE ${whereCondition}`,
            data: preparedValue,
        };
    }
    static getPreparedParams(columnData, keysToIgnore, start = 1, columnKeyNames) {
        var _a;
        const preparedValue = [];
        const preparedParam = [];
        for (const key of columnKeyNames) {
            if (!keysToIgnore.includes(key)) {
                columnData[key] = columnData[key] === '' ? null : columnData[key];
                preparedParam.push(`$${start}`);
                preparedValue.push((_a = columnData[key]) !== null && _a !== void 0 ? _a : null);
                start++;
            }
        }
        return {
            preparedParam,
            preparedValue,
        };
    }
    static alterPreparedParams(columnData, keysToIgnore, start = 1) {
        const preparedValue = [];
        const preparedParam = [];
        for (const key in columnData) {
            if (!keysToIgnore.includes(key)) {
                columnData[key] = columnData[key] === '' ? null : columnData[key];
                preparedParam.push(`${this.camelToSnakeCase(key)} = $${start}`);
                preparedValue.push(columnData[key]);
                start++;
            }
        }
        return {
            preparedParam,
            preparedValue,
        };
    }
};
UtilsService = __decorate([
    (0, common_1.Injectable)()
], UtilsService);
exports.UtilsService = UtilsService;


/***/ }),
/* 24 */
/***/ ((module) => {

"use strict";
module.exports = require("bcrypt");

/***/ }),
/* 25 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoggerModule = void 0;
const common_1 = __webpack_require__(4);
const logging_service_1 = __webpack_require__(26);
let LoggerModule = class LoggerModule {
};
LoggerModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        providers: [logging_service_1.Logger],
        exports: [logging_service_1.Logger],
    })
], LoggerModule);
exports.LoggerModule = LoggerModule;


/***/ }),
/* 26 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Logger = void 0;
const common_1 = __webpack_require__(4);
let Logger = class Logger extends common_1.ConsoleLogger {
    constructor(context, options = {}) {
        super(context, options);
        this.init();
    }
    init() {
        const LOGGER_LEVEL = process.env.LOGGER_LEVEL || 'log';
        const loggerLevel = ['error', 'warn', 'log', 'debug'];
        const envLogIndex = loggerLevel.findIndex((i) => i === LOGGER_LEVEL);
        this.setLogLevels(loggerLevel.slice(0, envLogIndex + 1));
        this.prettyPrintLog = JSON.parse(process.env.PRETTY_PRINT_LOG || 'false');
    }
    log(message, ...args) {
        if (!this.isLevelEnabled('log')) {
            return;
        }
        if (this.isPrettyPrint()) {
            super.log.apply(this, [message, ...args]);
            return;
        }
        this.printPlain(message, 'log');
    }
    error(message, ...args) {
        if (!this.isLevelEnabled('error')) {
            return;
        }
        if (this.isPrettyPrint()) {
            super.error.apply(this, [message, ...args]);
            return;
        }
        this.printPlain(message, 'error');
    }
    warn(message, ...args) {
        if (!this.isLevelEnabled('warn')) {
            return;
        }
        if (this.isPrettyPrint()) {
            super.warn.apply(this, [message, ...args]);
            return;
        }
        this.printPlain(message, 'warn');
    }
    debug(message, ...args) {
        if (!this.isLevelEnabled('debug')) {
            return;
        }
        if (this.isPrettyPrint()) {
            super.debug.apply(this, [message, ...args]);
            return;
        }
        this.printPlain(message, 'debug');
    }
    verbose(message, ...args) {
        if (!this.isLevelEnabled('verbose')) {
            return;
        }
        if (this.isPrettyPrint()) {
            super.verbose.apply(this, [message, ...args]);
            return;
        }
        this.printPlain(message, 'debug');
    }
    isPrettyPrint() {
        return this.prettyPrintLog;
    }
    printPlain(message, level) {
        const formattedLog = `[${this.context || 'NA'}] ${this.isObject(message) ? JSON.stringify(message) : message}`;
        console[level](formattedLog);
    }
    isObject(a) {
        return !!a && a.constructor === Object;
    }
};
Logger = __decorate([
    (0, common_1.Injectable)({
        scope: common_1.Scope.TRANSIENT,
    }),
    __metadata("design:paramtypes", [Object, Object])
], Logger);
exports.Logger = Logger;


/***/ }),
/* 27 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SharedModule = void 0;
const common_1 = __webpack_require__(4);
const database_module_1 = __webpack_require__(13);
const utils_service_1 = __webpack_require__(23);
const city_falcon_module_1 = __webpack_require__(28);
const iex_module_1 = __webpack_require__(31);
const logging_module_1 = __webpack_require__(25);
const s3_module_1 = __webpack_require__(33);
const sendgrid_module_1 = __webpack_require__(36);
let SharedModule = class SharedModule {
};
SharedModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.DatabaseModule,
            logging_module_1.LoggerModule,
            sendgrid_module_1.SendgridModule,
            s3_module_1.S3Module,
            iex_module_1.IexModule,
            city_falcon_module_1.CityFalconModule,
        ],
        providers: [utils_service_1.UtilsService],
        exports: [
            database_module_1.DatabaseModule,
            logging_module_1.LoggerModule,
            utils_service_1.UtilsService,
            sendgrid_module_1.SendgridModule,
            s3_module_1.S3Module,
            iex_module_1.IexModule,
            city_falcon_module_1.CityFalconModule,
        ],
    })
], SharedModule);
exports.SharedModule = SharedModule;


/***/ }),
/* 28 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CityFalconModule = void 0;
const axios_1 = __webpack_require__(29);
const common_1 = __webpack_require__(4);
const logging_module_1 = __webpack_require__(25);
const city_falcon_service_1 = __webpack_require__(30);
let CityFalconModule = class CityFalconModule {
};
CityFalconModule = __decorate([
    (0, common_1.Module)({
        imports: [logging_module_1.LoggerModule, axios_1.HttpModule],
        exports: [city_falcon_service_1.CityFalconService],
        providers: [city_falcon_service_1.CityFalconService],
    })
], CityFalconModule);
exports.CityFalconModule = CityFalconModule;


/***/ }),
/* 29 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/axios");

/***/ }),
/* 30 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var CityFalconService_1, _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CityFalconService = void 0;
const rxjs_1 = __webpack_require__(16);
const configuration_1 = __webpack_require__(10);
const axios_1 = __webpack_require__(29);
const common_1 = __webpack_require__(4);
const config_1 = __webpack_require__(5);
const logging_service_1 = __webpack_require__(26);
let CityFalconService = CityFalconService_1 = class CityFalconService {
    constructor(config, httpService, logger) {
        this.config = config;
        this.httpService = httpService;
        this.logger = logger;
        this.logger.setContext(CityFalconService_1.name);
    }
    getAssetNews(symbol) {
        const searchAssetsUrl = `${this.config.cityFalcon.baseUrl}/v0.2/stories?identifier_type=assets&identifiers=${symbol}&time_filter=d1&categories=mp%2Cop&min_cityfalcon_score=0&order_by=top&access_token=${this.config.cityFalcon.apiKey}`;
        return this.httpService
            .get(searchAssetsUrl)
            .pipe((0, rxjs_1.map)((res) => res.data));
    }
};
CityFalconService = CityFalconService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(configuration_1.default.KEY)),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigType !== "undefined" && config_1.ConfigType) === "function" ? _a : Object, typeof (_b = typeof axios_1.HttpService !== "undefined" && axios_1.HttpService) === "function" ? _b : Object, typeof (_c = typeof logging_service_1.Logger !== "undefined" && logging_service_1.Logger) === "function" ? _c : Object])
], CityFalconService);
exports.CityFalconService = CityFalconService;


/***/ }),
/* 31 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IexModule = void 0;
const axios_1 = __webpack_require__(29);
const common_1 = __webpack_require__(4);
const logging_module_1 = __webpack_require__(25);
const iex_service_1 = __webpack_require__(32);
let IexModule = class IexModule {
};
IexModule = __decorate([
    (0, common_1.Module)({
        imports: [logging_module_1.LoggerModule, axios_1.HttpModule],
        exports: [iex_service_1.IexService],
        providers: [iex_service_1.IexService],
    })
], IexModule);
exports.IexModule = IexModule;


/***/ }),
/* 32 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var IexService_1, _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IexService = void 0;
const rxjs_1 = __webpack_require__(16);
const configuration_1 = __webpack_require__(10);
const logging_service_1 = __webpack_require__(26);
const axios_1 = __webpack_require__(29);
const common_1 = __webpack_require__(4);
const config_1 = __webpack_require__(5);
let IexService = IexService_1 = class IexService {
    constructor(config, httpService, logger) {
        this.config = config;
        this.httpService = httpService;
        this.logger = logger;
        this.logger.setContext(IexService_1.name);
    }
    searchAssets(searchQuery) {
        const searchAssetsUrl = `${this.config.iex.baseUrl}/search/${searchQuery}?token=${this.config.iex.secretKey}`;
        return this.httpService.get(searchAssetsUrl).pipe((0, rxjs_1.map)((res) => res.data));
    }
    getCompanyInfo(symbol) {
        const searchAssetsUrl = `${this.config.iex.baseUrl}/stock/${symbol}/company?token=${this.config.iex.secretKey}`;
        return this.httpService.get(searchAssetsUrl).pipe((0, rxjs_1.map)((res) => res.data), (0, rxjs_1.mergeMap)((asset) => this.getAssetLogo(symbol).pipe((0, rxjs_1.map)((logo) => ({ ...asset, logo: logo.url })))));
    }
    getAssetLogo(symbol) {
        const searchAssetsUrl = `${this.config.iex.baseUrl}/stock/${symbol}/logo?token=${this.config.iex.secretKey}`;
        return this.httpService
            .get(searchAssetsUrl)
            .pipe((0, rxjs_1.map)((res) => res.data));
    }
    getAssetFundamentals(symbol) {
        const searchAssetsUrl = `${this.config.iex.baseUrl}/stock/${symbol}/quote?&token=${this.config.iex.secretKey}`;
        return this.httpService
            .get(searchAssetsUrl)
            .pipe((0, rxjs_1.map)((res) => res.data));
    }
};
IexService = IexService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(configuration_1.default.KEY)),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigType !== "undefined" && config_1.ConfigType) === "function" ? _a : Object, typeof (_b = typeof axios_1.HttpService !== "undefined" && axios_1.HttpService) === "function" ? _b : Object, typeof (_c = typeof logging_service_1.Logger !== "undefined" && logging_service_1.Logger) === "function" ? _c : Object])
], IexService);
exports.IexService = IexService;


/***/ }),
/* 33 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.S3Module = void 0;
const common_1 = __webpack_require__(4);
const s3_service_1 = __webpack_require__(34);
let S3Module = class S3Module {
};
S3Module = __decorate([
    (0, common_1.Module)({
        providers: [s3_service_1.S3Service],
        exports: [s3_service_1.S3Service],
    })
], S3Module);
exports.S3Module = S3Module;


/***/ }),
/* 34 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.S3Service = void 0;
const AWS = __webpack_require__(35);
const rxjs_1 = __webpack_require__(16);
const configuration_1 = __webpack_require__(10);
const common_1 = __webpack_require__(4);
const config_1 = __webpack_require__(5);
let S3Service = class S3Service {
    constructor(config) {
        this.config = config;
        AWS.config.update({
            credentials: {
                accessKeyId: this.config.aws.accessKeyID,
                secretAccessKey: this.config.aws.secretAccessKey,
            },
            region: this.config.aws.region,
        });
        this.S3 = new AWS.S3({ s3ForcePathStyle: true, signatureVersion: 'v4' });
    }
    getS3PreSignUrl({ bucket, filename, path }) {
        const imageOrgUrl = `https://${bucket}.s3.${this.config.aws.region}.amazonaws.com/${path}/${filename}`;
        return (0, rxjs_1.from)(this.S3.getSignedUrlPromise('putObject', {
            Bucket: bucket,
            ACL: 'public-read',
            Key: `${path}/${filename}`,
        })).pipe((0, rxjs_1.map)((uploadUrl) => ({
            uploadUrl: uploadUrl,
            filePath: imageOrgUrl,
        })));
    }
};
S3Service = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(configuration_1.default.KEY)),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigType !== "undefined" && config_1.ConfigType) === "function" ? _a : Object])
], S3Service);
exports.S3Service = S3Service;


/***/ }),
/* 35 */
/***/ ((module) => {

"use strict";
module.exports = require("aws-sdk");

/***/ }),
/* 36 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SendgridModule = void 0;
const database_module_1 = __webpack_require__(13);
const common_1 = __webpack_require__(4);
const logging_module_1 = __webpack_require__(25);
const sendgrid_service_1 = __webpack_require__(37);
let SendgridModule = class SendgridModule {
};
SendgridModule = __decorate([
    (0, common_1.Module)({
        imports: [logging_module_1.LoggerModule, database_module_1.DatabaseModule],
        providers: [sendgrid_service_1.SendgridService],
        exports: [sendgrid_service_1.SendgridService],
    })
], SendgridModule);
exports.SendgridModule = SendgridModule;


/***/ }),
/* 37 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var SendgridService_1, _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SendgridService = void 0;
const rxjs_1 = __webpack_require__(16);
const add_email_log_db_query_1 = __webpack_require__(38);
const configuration_1 = __webpack_require__(10);
const database_service_1 = __webpack_require__(19);
const common_1 = __webpack_require__(4);
const config_1 = __webpack_require__(5);
const SendGridClient = __webpack_require__(39);
const logging_service_1 = __webpack_require__(26);
let SendgridService = SendgridService_1 = class SendgridService {
    constructor(config, db, logger) {
        this.config = config;
        this.db = db;
        this.logger = logger;
        this.logger.setContext(SendgridService_1.name);
        SendGridClient.setApiKey(process.env.SENDGRID_API_KEY);
    }
    sendEmail({ email, userId, emailType }) {
        return (0, rxjs_1.from)(SendGridClient.send(email)).pipe((0, rxjs_1.catchError)((error) => {
            return (0, rxjs_1.of)(error.message);
        }), (0, rxjs_1.switchMap)((response) => {
            let isSuccess = true, failedReason = '';
            if (typeof response === 'string') {
                isSuccess = false;
                failedReason = response;
            }
            return this.db.rawQuery(add_email_log_db_query_1.addEmailLogDbQuery, [
                userId,
                emailType,
                email.from,
                email.to,
                email.subject,
                email.html,
                isSuccess,
                failedReason,
            ], null);
        }));
    }
};
SendgridService = SendgridService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(configuration_1.default.KEY)),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigType !== "undefined" && config_1.ConfigType) === "function" ? _a : Object, typeof (_b = typeof database_service_1.DatabaseService !== "undefined" && database_service_1.DatabaseService) === "function" ? _b : Object, typeof (_c = typeof logging_service_1.Logger !== "undefined" && logging_service_1.Logger) === "function" ? _c : Object])
], SendgridService);
exports.SendgridService = SendgridService;


/***/ }),
/* 38 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.addEmailLogDbQuery = void 0;
exports.addEmailLogDbQuery = `
insert into email_log (user_id, email_type, "from", "to", subject, body, is_success, failed_reason)
values ($1, $2, $3, $4, $5, $6, $7, $8);
`;


/***/ }),
/* 39 */
/***/ ((module) => {

"use strict";
module.exports = require("@sendgrid/mail");

/***/ }),
/* 40 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var HttpExceptionFilter_1, _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HttpExceptionFilter = void 0;
const constants_1 = __webpack_require__(22);
const common_1 = __webpack_require__(4);
const logging_service_1 = __webpack_require__(26);
let HttpExceptionFilter = HttpExceptionFilter_1 = class HttpExceptionFilter {
    constructor(logger) {
        this.logger = logger;
        this.logger.setContext(HttpExceptionFilter_1.name);
    }
    catch(exception, host) {
        var _a, _b, _c, _d;
        console.log(exception);
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let resError;
        let msg;
        const status = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : common_1.HttpStatus.FORBIDDEN;
        if ((_a = exception.response) === null || _a === void 0 ? void 0 : _a.statusCode) {
            msg = exception.response.message;
            resError = exception.response;
        }
        else if ((_b = exception.response) === null || _b === void 0 ? void 0 : _b.code) {
            msg = exception.response.message;
            resError = exception.response;
        }
        else if ((_d = (_c = exception.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.statusCode) {
            msg = exception.response.data.message;
            resError = exception.response.data;
        }
        else {
            msg =
                typeof exception.message === 'string'
                    ? exception.message
                    : exception.message.message;
            resError = constants_1.ERROR_CODES.DEFAULT;
        }
        const logError = {
            statusCode: status,
            timestamp: new Date().toString(),
            path: request.url,
            message: msg || 'Something went wrong',
            host: request.headers.host,
            response: resError,
        };
        this.logger.log(`${request.method} ${request.url} ${status}
      ${JSON.stringify(logError)}`);
        return response.status(status).send(resError);
    }
};
HttpExceptionFilter = HttpExceptionFilter_1 = __decorate([
    (0, common_1.Catch)(),
    __metadata("design:paramtypes", [typeof (_a = typeof logging_service_1.Logger !== "undefined" && logging_service_1.Logger) === "function" ? _a : Object])
], HttpExceptionFilter);
exports.HttpExceptionFilter = HttpExceptionFilter;


/***/ }),
/* 41 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ApiModule = void 0;
const common_1 = __webpack_require__(4);
const user_module_1 = __webpack_require__(42);
const common_module_1 = __webpack_require__(91);
const posts_module_1 = __webpack_require__(103);
const assets_module_1 = __webpack_require__(128);
const trades_module_1 = __webpack_require__(134);
const followers_module_1 = __webpack_require__(155);
const portfolio_module_1 = __webpack_require__(162);
const bookmark_module_1 = __webpack_require__(166);
const social_login_module_1 = __webpack_require__(169);
const notifications_module_1 = __webpack_require__(175);
const room_module_1 = __webpack_require__(181);
let ApiModule = class ApiModule {
};
ApiModule = __decorate([
    (0, common_1.Module)({
        imports: [user_module_1.UserModule, common_module_1.CommonModule, posts_module_1.PostsModule, assets_module_1.AssetsModule, trades_module_1.TradesModule, followers_module_1.FollowersModule, portfolio_module_1.PortfolioModule, bookmark_module_1.BookmarkModule, social_login_module_1.SocialLoginModule, notifications_module_1.NotificationsModule, room_module_1.RoomModule],
    })
], ApiModule);
exports.ApiModule = ApiModule;


/***/ }),
/* 42 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserModule = void 0;
const shared_module_1 = __webpack_require__(27);
const common_1 = __webpack_require__(4);
const auth_module_1 = __webpack_require__(43);
const user_controller_1 = __webpack_require__(67);
const user_service_1 = __webpack_require__(47);
let UserModule = class UserModule {
};
UserModule = __decorate([
    (0, common_1.Module)({
        imports: [shared_module_1.SharedModule, auth_module_1.AuthModule],
        controllers: [user_controller_1.UserController],
        providers: [user_service_1.UserService],
        exports: [user_service_1.UserService],
    })
], UserModule);
exports.UserModule = UserModule;


/***/ }),
/* 43 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const configuration_1 = __webpack_require__(10);
const common_1 = __webpack_require__(4);
const config_1 = __webpack_require__(5);
const jwt_1 = __webpack_require__(44);
const passport_1 = __webpack_require__(45);
const shared_module_1 = __webpack_require__(27);
const user_module_1 = __webpack_require__(42);
const auth_service_1 = __webpack_require__(46);
const jwt_strategy_1 = __webpack_require__(65);
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (config) => ({
                    secret: config.jwt.accessTokenSecret,
                    signOptions: { expiresIn: config.jwt.accessTokenExpiry },
                }),
                inject: [configuration_1.default.KEY],
            }),
            passport_1.PassportModule,
            (0, common_1.forwardRef)(() => user_module_1.UserModule),
            shared_module_1.SharedModule,
        ],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);
exports.AuthModule = AuthModule;


/***/ }),
/* 44 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/jwt");

/***/ }),
/* 45 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/passport");

/***/ }),
/* 46 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const rxjs_1 = __webpack_require__(16);
const utils_service_1 = __webpack_require__(23);
const common_1 = __webpack_require__(4);
const jwt_1 = __webpack_require__(44);
const user_service_1 = __webpack_require__(47);
let AuthService = class AuthService {
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    validateUser(loginRequest) {
        const { username, password } = loginRequest;
        return this.usersService.getUserByEmail(username).pipe((0, rxjs_1.switchMap)((user) => {
            if (!user) {
                return (0, rxjs_1.of)(null);
            }
            return (0, rxjs_1.from)(utils_service_1.UtilsService.comparePassword(password, user.password)).pipe((0, rxjs_1.map)((isPasswordCorrect) => {
                if (!isPasswordCorrect) {
                    return null;
                }
                delete user.password;
                delete user.passwordSalt;
                return user;
            }));
        }));
    }
    login(user) {
        const payload = { username: user.email, sub: user.userId };
        return {
            access_token: this.jwtService.sign(payload),
            user,
        };
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof user_service_1.UserService !== "undefined" && user_service_1.UserService) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object])
], AuthService);
exports.AuthService = AuthService;


/***/ }),
/* 47 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var UserService_1, _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserService = void 0;
const rxjs_1 = __webpack_require__(16);
const configuration_1 = __webpack_require__(10);
const database_service_1 = __webpack_require__(19);
const constants_1 = __webpack_require__(22);
const logging_service_1 = __webpack_require__(26);
const common_1 = __webpack_require__(4);
const config_1 = __webpack_require__(5);
const constants_2 = __webpack_require__(22);
const s3_service_1 = __webpack_require__(34);
const sendgrid_service_1 = __webpack_require__(37);
const utils_service_1 = __webpack_require__(23);
const auth_service_1 = __webpack_require__(46);
const add_otp_for_user_db_query_1 = __webpack_require__(48);
const add_user_db_query_1 = __webpack_require__(49);
const get_otp_by_email_db_query_1 = __webpack_require__(50);
const get_profile_details_db_query_1 = __webpack_require__(51);
const get_user_by_email_db_query_1 = __webpack_require__(52);
const reset_password_db_query_1 = __webpack_require__(53);
const search_users_db_query_1 = __webpack_require__(54);
const update_profile_image_db_query_1 = __webpack_require__(55);
const update_user_demo_complete_bool_db_query_1 = __webpack_require__(56);
const update_user_signup_complete_bool_db_query_1 = __webpack_require__(57);
const verify_user_otp_and_account_db_query_1 = __webpack_require__(58);
const get_otp_by_email_db_dto_1 = __webpack_require__(59);
const get_user_by_email_db_dto_1 = __webpack_require__(60);
const user_create_return_db_dto_1 = __webpack_require__(61);
const get_profile_details_response_dto_1 = __webpack_require__(62);
const search_users_response_dto_1 = __webpack_require__(63);
const welcome_verify_otp_1 = __webpack_require__(64);
let UserService = UserService_1 = class UserService {
    constructor(config, db, sendGrid, S3, logger, authService) {
        this.config = config;
        this.db = db;
        this.sendGrid = sendGrid;
        this.S3 = S3;
        this.logger = logger;
        this.authService = authService;
        this.logger.setContext(UserService_1.name);
    }
    userSignup(signupRequest) {
        const { email, password, countryCode, firstName, lastName, phoneNumber } = signupRequest;
        const otp = Math.floor(Math.random() * 90000) + 10000;
        return (0, rxjs_1.forkJoin)({
            password: (0, rxjs_1.from)(utils_service_1.UtilsService.generatePasswordHash(password, this.config.saltRounds)),
            otp: (0, rxjs_1.from)(utils_service_1.UtilsService.generatePasswordHash(String(otp), this.config.saltRounds)),
        }).pipe((0, rxjs_1.switchMap)(({ password, otp }) => {
            const userHandleTail = Math.floor(Math.random() * 90000) + 10000;
            const userHandle = signupRequest.userHandle
                ? signupRequest.userHandle
                : `${firstName}_${lastName}_${userHandleTail}`.toLowerCase();
            return this.db.rawQuery(add_user_db_query_1.addUserDbQuery, [
                email,
                password.hashedPassword,
                password.passwordSalt,
                countryCode,
                phoneNumber,
                firstName,
                lastName,
                constants_1.SOURCE_TYPES.email,
                constants_2.OTP_TYPES.new_signup,
                otp.hashedPassword,
                userHandle,
            ], user_create_return_db_dto_1.UserCreateReturnDto);
        }), (0, rxjs_1.switchMap)((userId) => {
            return this.sendSignupWelcomeEmailWithOTP(email, userId[0].userId, otp).pipe((0, rxjs_1.map)(() => {
                return {
                    message: 'Signup Success. Please check your email',
                };
            }));
        }));
    }
    getUserByEmail(email) {
        return this.db
            .rawQuery(get_user_by_email_db_query_1.getUserByEmailDbQuery, [email], get_user_by_email_db_dto_1.GetUserByEmailDbDto)
            .pipe((0, rxjs_1.map)((res) => { var _a; return (_a = res[0]) !== null && _a !== void 0 ? _a : null; }));
    }
    userLogin(loginRequest) {
        return this.authService.validateUser(loginRequest).pipe((0, rxjs_1.map)((userData) => {
            if (!userData) {
                throw new common_1.UnauthorizedException('Invalid Email or Password');
            }
            if (!userData.isVerified) {
                throw new common_1.ForbiddenException('Email is not verified');
            }
            return this.authService.login(userData);
        }));
    }
    resendUserVerificationOtp(email) {
        return this.getUserByEmail(email).pipe((0, rxjs_1.switchMap)((user) => {
            if (!user) {
                throw new common_1.ForbiddenException('Please provide a valid email');
            }
            const otp = Math.floor(Math.random() * 90000) + 10000;
            return (0, rxjs_1.from)(utils_service_1.UtilsService.generatePasswordHash(String(otp), this.config.saltRounds)).pipe((0, rxjs_1.map)((hashedOtp) => ({
                otp: hashedOtp,
                otpRaw: otp,
                user,
            })));
        }), (0, rxjs_1.switchMap)(({ otp, otpRaw, user }) => {
            return this.db
                .rawQuery(add_otp_for_user_db_query_1.addOtpForUserDbQuery, [
                user.userId,
                constants_1.SOURCE_TYPES.email,
                constants_2.OTP_TYPES.resend_signup,
                otp.hashedPassword,
            ], null)
                .pipe((0, rxjs_1.map)(() => ({
                otp: otpRaw,
                user,
            })));
        }), (0, rxjs_1.switchMap)(({ otp, user }) => {
            return this.sendSignupWelcomeEmailWithOTP(user.email, user.userId, otp).pipe((0, rxjs_1.map)(() => {
                return {
                    message: 'OTP resent. Please check your email',
                };
            }));
        }));
    }
    verifyAccountOTP(username, otp) {
        return this.db
            .rawQuery(get_otp_by_email_db_query_1.getOtpByEmailDbQuery, [username], get_otp_by_email_db_dto_1.GetOtpByEmailDbDto)
            .pipe((0, rxjs_1.switchMap)((res) => {
            if (!res.length) {
                throw new common_1.NotFoundException('OTP or Email is invalid');
            }
            const { otpId, userId, otpHash } = res[0];
            return (0, rxjs_1.from)(utils_service_1.UtilsService.comparePassword(String(otp), otpHash)).pipe((0, rxjs_1.map)(() => ({ otpId, userId })));
        }), (0, rxjs_1.switchMap)(({ otpId, userId }) => {
            return this.db.rawQuery(verify_user_otp_and_account_db_query_1.verifyUserOtpAndAccountDbQuery, [otpId, userId], null);
        }), (0, rxjs_1.map)(() => {
            return {
                message: 'Account verified. Please login to continue',
            };
        }));
    }
    forgotPassword(username) {
        const otp = Math.floor(Math.random() * 90000) + 10000;
        return (0, rxjs_1.forkJoin)({
            hashedOtp: (0, rxjs_1.from)(utils_service_1.UtilsService.generatePasswordHash(String(otp), this.config.saltRounds)),
            user: this.getUserByEmail(username),
        }).pipe((0, rxjs_1.switchMap)(({ hashedOtp, user }) => {
            if (!user) {
                throw new common_1.NotFoundException('Provided email is invalid');
            }
            return this.db
                .rawQuery(add_otp_for_user_db_query_1.addOtpForUserDbQuery, [
                user.userId,
                constants_1.SOURCE_TYPES.email,
                constants_2.OTP_TYPES.reset_password,
                hashedOtp.hashedPassword,
            ], null)
                .pipe((0, rxjs_1.map)(() => ({
                otp,
                user,
            })));
        }), (0, rxjs_1.switchMap)(({ user }) => {
            const email = {
                from: constants_1.INVESTMATES_EMAIL,
                to: user.email,
                subject: 'Forgot Password - InvestMates',
                html: `<h1>Temp password - ${otp}</h1>`,
                text: `Temp password - ${otp}`,
            };
            return (0, rxjs_1.from)(this.sendGrid.sendEmail({
                email,
                userId: user.userId,
                emailType: constants_1.EMAIL_TYPES.forgot_password,
            }));
        }), (0, rxjs_1.map)(() => {
            return {
                message: 'Email with OTP sent. Please check your email',
            };
        }));
    }
    validateResetPasswordOTP(username, otp) {
        return this.db
            .rawQuery(get_otp_by_email_db_query_1.getOtpByEmailDbQuery, [username], get_otp_by_email_db_dto_1.GetOtpByEmailDbDto)
            .pipe((0, rxjs_1.switchMap)((res) => {
            if (!res.length) {
                throw new common_1.ForbiddenException('Username or OTP is invalid');
            }
            return (0, rxjs_1.from)(utils_service_1.UtilsService.comparePassword(String(otp), res[0].otpHash));
        }), (0, rxjs_1.map)((isOtpValid) => {
            if (!isOtpValid) {
                throw new common_1.ForbiddenException('Username or OTP is invalid');
            }
            return {
                message: 'OTP is valid',
            };
        }));
    }
    resetPassword({ username, otp, password }) {
        return this.db
            .rawQuery(get_otp_by_email_db_query_1.getOtpByEmailDbQuery, [username], get_otp_by_email_db_dto_1.GetOtpByEmailDbDto)
            .pipe((0, rxjs_1.switchMap)((res) => {
            if (!res.length) {
                throw new common_1.ForbiddenException('Username or OTP is invalid');
            }
            const { otpHash, otpId, userId } = res[0];
            return (0, rxjs_1.from)(utils_service_1.UtilsService.comparePassword(String(otp), otpHash)).pipe((0, rxjs_1.map)((isOtpValid) => ({ isOtpValid, userId, otpId })));
        }), (0, rxjs_1.switchMap)(({ isOtpValid, userId, otpId }) => {
            if (!isOtpValid) {
                throw new common_1.ForbiddenException('Username or OTP is invalid');
            }
            return (0, rxjs_1.from)(utils_service_1.UtilsService.generatePasswordHash(password, this.config.saltRounds)).pipe((0, rxjs_1.map)((password) => ({ password, userId, otpId })));
        }), (0, rxjs_1.switchMap)(({ password, userId, otpId }) => {
            return this.db.rawQuery(reset_password_db_query_1.resetPasswordDbQuery, [password.hashedPassword, password.passwordSalt, userId, otpId], null);
        }), (0, rxjs_1.map)(() => ({
            message: 'Password reset success. Please login again.',
        })));
    }
    getPreSignedUrlForProfilePicture(fileName, userId) {
        const fileSplit = fileName.split('.');
        return this.S3.getS3PreSignUrl({
            bucket: constants_1.S3_BUCKET,
            filename: `${Date.now()}_${fileSplit[0]}_o.${fileSplit[1]}`,
            path: `${constants_1.S3_FOLDER_PROFILE_IMAGE}/${userId}`,
        }).pipe((0, rxjs_1.map)(({ filePath, uploadUrl }) => ({ filePath, uploadUrl })));
    }
    updateProfileImageUrls(filePath, userId) {
        const { large, medium, original, small, thumbnail } = utils_service_1.UtilsService.generateImagUrlForAllSizes(filePath);
        return this.db
            .rawQuery(update_profile_image_db_query_1.updateProfileImageDbQuery, [userId, original, thumbnail, small, medium, large], null)
            .pipe((0, rxjs_1.map)((res) => { var _a; return (_a = res[0]) !== null && _a !== void 0 ? _a : {}; }));
    }
    getUserProfileDetails(loggedInUser, userId) {
        return this.db
            .rawQuery(get_profile_details_db_query_1.getProfileDetailsDbQuery, [userId, loggedInUser], get_profile_details_response_dto_1.GetProfileDetailsResponseDto)
            .pipe((0, rxjs_1.map)((details) => { var _a; return (_a = details[0]) !== null && _a !== void 0 ? _a : {}; }));
    }
    updateIsSignupComplete(userId) {
        return this.db
            .rawQuery(update_user_signup_complete_bool_db_query_1.UpdateUserIsSignupCompleteFlagDbQuery, [userId], null)
            .pipe((0, rxjs_1.map)(() => ({})));
    }
    updateIsDemoComplete(userId) {
        return this.db
            .rawQuery(update_user_demo_complete_bool_db_query_1.UpdateUserIsDemoCompleteFlagDbQuery, [userId], null)
            .pipe((0, rxjs_1.map)(() => ({})));
    }
    sendSignupWelcomeEmailWithOTP(email, userId, otp) {
        return this.sendGrid.sendEmail({
            email: {
                to: email,
                from: constants_1.INVESTMATES_EMAIL,
                subject: 'Welcome to Investmates',
                text: welcome_verify_otp_1.welcomeVerifyOtp.replace('OTP_HERE', String(otp)),
                html: welcome_verify_otp_1.welcomeVerifyOtp.replace('OTP_HERE', String(otp)),
            },
            userId,
            emailType: constants_1.EMAIL_TYPES.welcome_email,
        });
    }
    searchUsers(query) {
        return this.db.rawQuery(search_users_db_query_1.searchUserDbQuery, [`${query}%`], search_users_response_dto_1.SearchUsersResponseDto);
    }
    updateProfile(userId, profile) {
        var _a, _b, _c;
        const valuesArray = [userId];
        const queriesArray = [];
        const arrayToSkip = ['timeline', 'investmentStyle', 'interest'];
        const columnToSkip = [
            'createdAt',
            'lastUpdated',
            'password',
            'passwordSalt',
            'profileImage',
            'id',
            'userId',
            'isDeleted',
            'email',
            'isVerified',
            'isSignupComplete',
            'isActive',
            'userHandle',
            'experienceLevel',
        ];
        const addSQLQuery = {
            last_updated: 'current_timestamp',
        };
        const { query, data } = utils_service_1.UtilsService.buildUpdateQuery({
            tableName: 'user_profile',
            columnData: profile,
            keysToIgnore: [...arrayToSkip, ...columnToSkip],
            keysToReplace: { isDeleted: false },
            addSqlQuery: addSQLQuery,
            whereCondition: 'user_id = $1',
            start: 2,
        });
        queriesArray.push(`upd_user_profile as (${query} RETURNING *)`);
        valuesArray.push(...data);
        if (profile.userHandle) {
            const { query, data } = utils_service_1.UtilsService.buildUpdateQuery({
                tableName: 'user_core',
                columnData: {
                    userHandle: profile.userHandle,
                },
                keysToIgnore: ['id', 'createdAt', 'lastUpdated'],
                whereCondition: 'id = $1',
                start: valuesArray.length + 1,
            });
            queriesArray.push(`upd_user_core as (${query})`);
            valuesArray.push(...data);
        }
        if (profile.experienceLevel) {
            queriesArray.push(`del_user_experience as (DELETE from user_experience where user_id = $1)`);
            const { query, data } = utils_service_1.UtilsService.buildInsertQuery({
                tableName: 'user_experience',
                columnData: [
                    {
                        experienceId: profile.experienceLevel,
                    },
                ],
                keysToIgnore: ['id', 'createdAt', 'lastUpdated'],
                addSqlQuery: {
                    user_id: '$1',
                },
                start: valuesArray.length + 1,
            });
            queriesArray.push(`ins_user_experience as (${query})`);
            valuesArray.push(...data);
        }
        if (Array.isArray(profile.timeline)) {
            queriesArray.push(`del_timeline as (DELETE from investment_timeline where user_id = $1)`);
            if ((_a = profile.timeline) === null || _a === void 0 ? void 0 : _a.length) {
                const { query, data } = utils_service_1.UtilsService.buildInsertQuery({
                    tableName: 'investment_timeline',
                    columnData: profile.timeline,
                    keysToIgnore: ['id', 'createdAt', 'lastUpdated', 'userId'],
                    addSqlQuery: {
                        user_id: '$1',
                    },
                    start: valuesArray.length + 1,
                });
                queriesArray.push(`ins_timeline as (${query})`);
                valuesArray.push(...data);
            }
        }
        if (Array.isArray(profile.investmentStyle)) {
            queriesArray.push(`del_investment_style as (DELETE from user_investment_types where user_id = $1)`);
            if ((_b = profile.investmentStyle) === null || _b === void 0 ? void 0 : _b.length) {
                const { query, data } = utils_service_1.UtilsService.buildInsertQuery({
                    tableName: 'user_investment_types',
                    columnData: profile.investmentStyle.map((x) => ({ investmentId: x })),
                    keysToIgnore: ['id', 'createdAt', 'lastUpdated', 'postId'],
                    addSqlQuery: {
                        user_id: '$1',
                    },
                    start: valuesArray.length + 1,
                });
                queriesArray.push(`ins_user_investment_types as (${query})`);
                valuesArray.push(...data);
            }
        }
        if (Array.isArray(profile.interest)) {
            queriesArray.push(`del_user_interest as (DELETE from user_interests where user_id = $1)`);
            if ((_c = profile.interest) === null || _c === void 0 ? void 0 : _c.length) {
                const { query, data } = utils_service_1.UtilsService.buildInsertQuery({
                    tableName: 'user_interests',
                    columnData: profile.interest.map((x) => ({ interestsId: x })),
                    keysToIgnore: ['id', 'createdAt', 'lastUpdated', 'postId'],
                    addSqlQuery: {
                        user_id: '$1',
                    },
                    start: valuesArray.length + 1,
                });
                queriesArray.push(`ins_user_interest as (${query})`);
                valuesArray.push(...data);
            }
        }
        return this.db
            .rawQuery(`WITH ${queriesArray.join(', ')} (select user_id from upd_user_profile) `, valuesArray, null)
            .pipe((0, rxjs_1.map)((res) => res[0]));
    }
};
UserService = UserService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(configuration_1.default.KEY)),
    __param(5, (0, common_1.Inject)((0, common_1.forwardRef)(() => auth_service_1.AuthService))),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigType !== "undefined" && config_1.ConfigType) === "function" ? _a : Object, typeof (_b = typeof database_service_1.DatabaseService !== "undefined" && database_service_1.DatabaseService) === "function" ? _b : Object, typeof (_c = typeof sendgrid_service_1.SendgridService !== "undefined" && sendgrid_service_1.SendgridService) === "function" ? _c : Object, typeof (_d = typeof s3_service_1.S3Service !== "undefined" && s3_service_1.S3Service) === "function" ? _d : Object, typeof (_e = typeof logging_service_1.Logger !== "undefined" && logging_service_1.Logger) === "function" ? _e : Object, typeof (_f = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _f : Object])
], UserService);
exports.UserService = UserService;


/***/ }),
/* 48 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.addOtpForUserDbQuery = void 0;
exports.addOtpForUserDbQuery = `
INSERT INTO otp_log (user_id, source, type, otp)
    VALUES ($1, $2, $3, $4)
`;


/***/ }),
/* 49 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.addUserSocialLoginDbQuery = exports.addUserDbQuery = void 0;
exports.addUserDbQuery = `
WITH ins_user_core AS (
    INSERT INTO user_core (email, PASSWORD, password_salt, country_code, mobile_number, user_handle)
            VALUES ($1, $2, $3, $4, $5, $11)
        RETURNING
            id AS user_id),
            ins_otp_user AS (
                INSERT INTO otp_log (user_id, source, type, otp)
                        VALUES ((
                                SELECT
                                    user_id
                                FROM
                                    ins_user_core),
                                $8,
                                $9,
                                $10))
        INSERT INTO user_profile (user_id, first_name, last_name)
            VALUES ((
                    SELECT
                        user_id
                    FROM
                        ins_user_core),
                    $6,
                    $7)
        RETURNING (
            SELECT
                user_id
            FROM
                ins_user_core);
`;
exports.addUserSocialLoginDbQuery = `
WITH ins_user_core AS (
    INSERT INTO user_core (email, user_handle, is_social_login, is_active, is_verified)
            VALUES ($1, $2, TRUE, TRUE, TRUE)
        RETURNING
            id AS user_id)
        INSERT INTO user_profile (user_id, first_name, last_name)
            VALUES ((
                    SELECT
                        user_id
                    FROM
                        ins_user_core),
                    $3,
                    $4)
        RETURNING (
            SELECT
                user_id
            FROM
                ins_user_core);
`;


/***/ }),
/* 50 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getOtpByEmailDbQuery = void 0;
exports.getOtpByEmailDbQuery = `
SELECT
    ol.id AS otp_id,
    user_id,
    otp AS otp_hash
FROM
    otp_log ol
    INNER JOIN user_core uc ON uc.id = ol.user_id
        AND uc.email = $1
        AND ol.is_verified = FALSE
ORDER BY ol.last_updated DESC
LIMIT 1;
`;


/***/ }),
/* 51 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getProfileDetailsDbQuery = void 0;
exports.getProfileDetailsDbQuery = `
WITH following_details AS (
    SELECT
        1 as temp,
        count(*) AS following_count
    FROM
        followers f
    WHERE
        user_id = $1
        AND is_deleted IS NOT TRUE
    GROUP BY
        f.user_id
),
is_being_followed AS (
    SELECT
        1 as temp,
        count(*) AS followers_count
    FROM
        followers f2
    WHERE
        follower_id = $1
        AND is_deleted IS NOT TRUE
    GROUP BY
        f2.follower_id
)
SELECT uc.id                                            AS user_id,
       uc.email,
       uc.is_verified,
       COALESCE(uc.is_signup_complete, false)           as is_signup_complete,
       coalesce(fds.following_count,0)::integer                            as following_count,
       coalesce(ibf.followers_count,0)::integer                            as followers_count,
       case when f1.id = $2 is not null then true else false end           as is_following,
       case when f2.id = $2 is not null then true else false end           as is_being_followed,
       uc.is_active,
       uc.user_handle,
       uc.country_code,
       uc.mobile_number,
       up.first_name,
       up.last_name,
       up.quote,
       up.about,
       up.goal,
       mel.type                                         as experience_level,
       json_build_object('image_org', pm.image_org,
                         'image_thumb', pm.image_thumb,
                         'image_small', pm.image_small,
                         'image_medium', pm.image_medium,
                         'image_large', pm.image_large) AS profile_image,
       json_agg(
       DISTINCT jsonb_build_object(
               'investor_name', it.investor_name,
               'from', it."from",
               'to', it."to",
               'activity', it.activity
           )
           ) FILTER (WHERE it.id IS NOT NULL)           as timeline,

       json_agg(
       DISTINCT jsonb_build_object(
               'id', mit.id,
               'type', mit.type
           )
           ) FILTER (WHERE mit.id IS NOT NULL)          as investment_style,

       json_agg(
       DISTINCT jsonb_build_object(
               'id', mi.id,
               'type', mi.type
           )
           ) FILTER (WHERE mi.id IS NOT NULL)           as interest
FROM user_core uc
         LEFT JOIN user_profile up ON up.user_id = uc.id
         LEFT JOIN profile_media pm ON pm.user_id = uc.id
         LEFT JOIN user_experience ue on uc.id = ue.user_id
         LEFT JOIN master_experience_level mel on ue.experience_id = mel.id
         LEFT JOIN investment_timeline it on uc.id = it.user_id
         LEFT JOIN user_investment_types uit on uc.id = uit.user_id
         LEFT JOIN master_investment_types mit on uit.investment_id = mit.id
         LEFT JOIN user_interests ui ON uc.id = ui.user_id
         LEFT JOIN master_interests mi on ui.interests_id = mi.id
         LEFT JOIN following_details fds ON fds.temp = 1
         LEFT JOIN is_being_followed ibf ON ibf.temp = 1
         LEFT JOIN followers f1 on f1.is_deleted IS NOT TRUE AND f1.follower_id = uc.id and f1.user_id = $2
         LEFT JOIN followers f2 on f2.is_deleted IS NOT TRUE AND f2.follower_id = $2  and f2.follower_id = uc.id

WHERE uc.id = $1 AND uc.is_deleted IS NOT TRUE
GROUP BY uc.id,
        f1.id, f2.id,
        fds.following_count,
        ibf.followers_count,
         up.first_name,
         up.last_name,
         up.quote,
         up.about,
         up.goal,
         mel.type,
         pm.image_org,
         pm.image_large,
         pm.image_thumb,
         pm.image_small,
         pm.image_medium,
         pm.image_large;
`;


/***/ }),
/* 52 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getUserByEmailDbQuery = void 0;
exports.getUserByEmailDbQuery = `
SELECT uc.id                                            AS user_id,
       uc.email,
       uc.password,
       uc.is_social_login,
       uc.is_demo_complete,
       uc.is_verified,
       COALESCE(uc.is_signup_complete, false)           as is_signup_complete,
       count(DISTINCT f1.id)::integer                            as following_count,
       count(DISTINCT f2.id)::integer                            as followers_count,
       uc.is_active,
       uc.user_handle,
       uc.country_code,
       uc.mobile_number,
       up.first_name,
       up.last_name,
       up.quote,
       up.about,
       up.goal,
       mel.type                                         as experience_level,
       json_build_object('image_org', pm.image_org,
                         'image_thumb', pm.image_thumb,
                         'image_small', pm.image_small,
                         'image_medium', pm.image_medium,
                         'image_large', pm.image_large) AS profile_image,
       json_agg(
       DISTINCT jsonb_build_object(
               'investor_name', it.investor_name,
               'from', it."from",
               'to', it."to",
               'activity', it.activity
           )
           ) FILTER (WHERE it.id IS NOT NULL)           as timeline,

       json_agg(
       DISTINCT jsonb_build_object(
               'id', mit.id,
               'type', mit.type
           )
           ) FILTER (WHERE mit.id IS NOT NULL)          as investment_style,

       json_agg(
       DISTINCT jsonb_build_object(
               'id', uc.id,
               'type', mi.type
           )
           ) FILTER (WHERE mi.id IS NOT NULL)           as interest
FROM user_core uc
         LEFT JOIN user_profile up ON up.user_id = uc.id
         LEFT JOIN profile_media pm ON pm.user_id = uc.id
         LEFT JOIN user_experience ue on uc.id = ue.user_id
         LEFT JOIN master_experience_level mel on ue.experience_id = mel.id
         LEFT JOIN investment_timeline it on uc.id = it.user_id
         LEFT JOIN user_investment_types uit on uc.id = uit.user_id
         LEFT JOIN master_investment_types mit on uit.investment_id = mit.id
         LEFT JOIN user_interests ui ON uc.id = ui.user_id
         LEFT JOIN master_interests mi on ui.interests_id = mi.id
         LEFT JOIN followers f1 on uc.id = f1.user_id
         LEFT JOIN followers f2 on uc.id = f2.follower_id

WHERE uc.is_deleted IS NOT TRUE AND uc.email = $1
GROUP BY uc.id,
         f1.id,
         f2.id,
         up.first_name,
         up.last_name,
         up.quote,
         up.about,
         up.goal,
         mel.type,
         pm.image_org,
         pm.image_large,
         pm.image_thumb,
         pm.image_small,
         pm.image_medium,
         pm.image_large;`;


/***/ }),
/* 53 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.resetPasswordDbQuery = void 0;
exports.resetPasswordDbQuery = `
WITH update_password AS (
    UPDATE
        user_core
    SET
        PASSWORD = $1,
        password_salt = $2
    WHERE
        id = $3)
UPDATE
    otp_log
SET
    is_verified = TRUE
WHERE
    id = $4
`;


/***/ }),
/* 54 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.searchUserDbQuery = void 0;
exports.searchUserDbQuery = `
SELECT
    user_handle,
    first_name,
    last_name,
    up.user_id,       
    json_build_object('image_org', pm.image_org,
    'image_thumb', pm.image_thumb,
    'image_small', pm.image_small,
    'image_medium', pm.image_medium,
    'image_large', pm.image_large) AS profile_image
FROM
    user_core uc
    LEFT JOIN user_profile up ON up.user_id = uc.id
    LEFT JOIN profile_media pm ON pm.user_id = uc.id
WHERE
    user_handle ILIKE $1
    OR up.first_name ILIKE $1
    OR up.last_name ILIKE $1
    LIMIT 10;
`;


/***/ }),
/* 55 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.updateProfileImageDbQuery = void 0;
exports.updateProfileImageDbQuery = `
    INSERT INTO profile_media (user_id, image_org, image_thumb, image_small, image_medium, image_large)
            VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (user_id)
            DO UPDATE SET
                image_org = EXCLUDED.image_org, 
                image_thumb = EXCLUDED.image_thumb,
                image_small = EXCLUDED.image_small,
                image_medium = EXCLUDED.image_medium,
                image_large = EXCLUDED.image_large,
                last_updated = CURRENT_TIMESTAMP
                RETURNING *`;


/***/ }),
/* 56 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateUserIsDemoCompleteFlagDbQuery = void 0;
exports.UpdateUserIsDemoCompleteFlagDbQuery = `
UPDATE
    user_core
SET
    is_demo_complete = TRUE
WHERE
    id = $1
`;


/***/ }),
/* 57 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateUserIsSignupCompleteFlagDbQuery = void 0;
exports.UpdateUserIsSignupCompleteFlagDbQuery = `
UPDATE
    user_core
SET
    is_signup_complete = TRUE
WHERE
    id = $1
`;


/***/ }),
/* 58 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.verifyUserOtpAndAccountDbQuery = void 0;
exports.verifyUserOtpAndAccountDbQuery = `
WITH update_otp as (
    UPDATE
        otp_log
    SET
        is_verified = TRUE
    WHERE
        id = $1)
UPDATE
    user_core
SET
    is_verified = TRUE,
    is_active = TRUE
WHERE
    id = $2
`;


/***/ }),
/* 59 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetOtpByEmailDbDto = void 0;
class GetOtpByEmailDbDto {
}
exports.GetOtpByEmailDbDto = GetOtpByEmailDbDto;


/***/ }),
/* 60 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetUserByEmailWithPassword = exports.GetUserByEmailDbDto = void 0;
const swagger_1 = __webpack_require__(7);
class GetUserByEmailDbDto {
}
exports.GetUserByEmailDbDto = GetUserByEmailDbDto;
class GetUserByEmailWithPassword extends (0, swagger_1.OmitType)(GetUserByEmailDbDto, [
    'password',
    'passwordSalt',
]) {
}
exports.GetUserByEmailWithPassword = GetUserByEmailWithPassword;


/***/ }),
/* 61 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserCreateReturnDto = void 0;
class UserCreateReturnDto {
}
exports.UserCreateReturnDto = UserCreateReturnDto;


/***/ }),
/* 62 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetProfileDetailsResponseDto = exports.Interest = exports.InvestmentStyle = exports.Timeline = exports.ProfileImage = void 0;
const swagger_1 = __webpack_require__(7);
class ProfileImage {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileImage.prototype, "imageOrg", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileImage.prototype, "imageThumb", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileImage.prototype, "imageSmall", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileImage.prototype, "imageMedium", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileImage.prototype, "imageLarge", void 0);
exports.ProfileImage = ProfileImage;
class Timeline {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Timeline.prototype, "to", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Timeline.prototype, "from", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Timeline.prototype, "activity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Timeline.prototype, "investorName", void 0);
exports.Timeline = Timeline;
class InvestmentStyle {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], InvestmentStyle.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], InvestmentStyle.prototype, "type", void 0);
exports.InvestmentStyle = InvestmentStyle;
class Interest {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], Interest.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Interest.prototype, "type", void 0);
exports.Interest = Interest;
class GetProfileDetailsResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetProfileDetailsResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetProfileDetailsResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], GetProfileDetailsResponseDto.prototype, "isVerified", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], GetProfileDetailsResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetProfileDetailsResponseDto.prototype, "followingCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetProfileDetailsResponseDto.prototype, "followersCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], GetProfileDetailsResponseDto.prototype, "isFollowing", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], GetProfileDetailsResponseDto.prototype, "isBeingFollowed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetProfileDetailsResponseDto.prototype, "userHandle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetProfileDetailsResponseDto.prototype, "experienceLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], GetProfileDetailsResponseDto.prototype, "isSignupComplete", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetProfileDetailsResponseDto.prototype, "countryCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetProfileDetailsResponseDto.prototype, "mobileNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetProfileDetailsResponseDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetProfileDetailsResponseDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetProfileDetailsResponseDto.prototype, "quote", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetProfileDetailsResponseDto.prototype, "about", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetProfileDetailsResponseDto.prototype, "goal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", ProfileImage)
], GetProfileDetailsResponseDto.prototype, "profileImage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [Timeline] }),
    __metadata("design:type", Array)
], GetProfileDetailsResponseDto.prototype, "timeline", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [InvestmentStyle] }),
    __metadata("design:type", Array)
], GetProfileDetailsResponseDto.prototype, "investmentStyle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [Interest] }),
    __metadata("design:type", Array)
], GetProfileDetailsResponseDto.prototype, "interest", void 0);
exports.GetProfileDetailsResponseDto = GetProfileDetailsResponseDto;


/***/ }),
/* 63 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SearchUsersResponseDto = exports.ProfileImage = void 0;
const swagger_1 = __webpack_require__(7);
class ProfileImage {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileImage.prototype, "imageOrg", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileImage.prototype, "imageThumb", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileImage.prototype, "imageSmall", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileImage.prototype, "imageMedium", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileImage.prototype, "imageLarge", void 0);
exports.ProfileImage = ProfileImage;
class SearchUsersResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SearchUsersResponseDto.prototype, "userHandle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SearchUsersResponseDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SearchUsersResponseDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SearchUsersResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", ProfileImage)
], SearchUsersResponseDto.prototype, "profileImage", void 0);
exports.SearchUsersResponseDto = SearchUsersResponseDto;


/***/ }),
/* 64 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.welcomeVerifyOtp = void 0;
exports.welcomeVerifyOtp = `<!DOCTYPE html>
<html>
<head> <h1> OTP_HERE </h1></body>
</html>  `;


/***/ }),
/* 65 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const passport_jwt_1 = __webpack_require__(66);
const common_1 = __webpack_require__(4);
const passport_1 = __webpack_require__(45);
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor() {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: "myjwt",
        });
    }
    async validate(payload) {
        return { userId: payload.sub, username: payload.username };
    }
};
JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], JwtStrategy);
exports.JwtStrategy = JwtStrategy;


/***/ }),
/* 66 */
/***/ ((module) => {

"use strict";
module.exports = require("passport-jwt");

/***/ }),
/* 67 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserController = void 0;
const rxjs_1 = __webpack_require__(16);
const common_1 = __webpack_require__(4);
const swagger_1 = __webpack_require__(7);
const user_token_payload_decorator_1 = __webpack_require__(68);
const jwt_auth_guard_1 = __webpack_require__(69);
const jwt_strategy_1 = __webpack_require__(65);
const forgot_password_request_dto_1 = __webpack_require__(70);
const login_request_dto_1 = __webpack_require__(72);
const profile_image_update_url_request_dto_1 = __webpack_require__(73);
const resend_otp_signup_request_dto_1 = __webpack_require__(74);
const reset_password_request_dto_1 = __webpack_require__(75);
const signup_request_dto_1 = __webpack_require__(76);
const update_profile_request_dto_1 = __webpack_require__(77);
const upload_profile_image_request_dto_1 = __webpack_require__(78);
const validate_reset_password_otp_request_dto_1 = __webpack_require__(80);
const verify_account_otp_request_dto_1 = __webpack_require__(81);
const forgot_password_response_dto_1 = __webpack_require__(82);
const get_profile_details_response_dto_1 = __webpack_require__(62);
const login_response_dto_1 = __webpack_require__(83);
const profile_image_update_url_response_dto_1 = __webpack_require__(84);
const resend_otp_signup_request_dto_2 = __webpack_require__(85);
const reset_password_response_dto_1 = __webpack_require__(86);
const search_users_response_dto_1 = __webpack_require__(63);
const signup_response_dto_1 = __webpack_require__(87);
const upload_profile_image_response_dto_1 = __webpack_require__(88);
const validate_reset_password_otp_response_dto_1 = __webpack_require__(89);
const verify_account_otp_request_dto_2 = __webpack_require__(90);
const user_service_1 = __webpack_require__(47);
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    CreateUser(signupRequest) {
        return this.userService.userSignup(signupRequest);
    }
    UserLogin(loginRequest) {
        return this.userService.userLogin(loginRequest);
    }
    ResendSignupVerificationOTP(otpRequest) {
        return this.userService.resendUserVerificationOtp(otpRequest.username);
    }
    VerifySignupOTP(body) {
        return this.userService.verifyAccountOTP(body.username, body.otp);
    }
    ForgotPassword(body) {
        return this.userService.forgotPassword(body.username);
    }
    ValidateResetPasswordOtp(body) {
        return this.userService.validateResetPasswordOTP(body.username, body.otp);
    }
    ResetPassword(body) {
        const { otp, password, username } = body;
        return this.userService.resetPassword({
            otp,
            password,
            username,
        });
    }
    GetPreSignedUrlForProfilePicture(user, body) {
        return this.userService.getPreSignedUrlForProfilePicture(body.fileName, user.userId);
    }
    UpdateProfilePictureURL(user, body) {
        return this.userService.updateProfileImageUrls(body.filePath, user.userId);
    }
    GetUserProfileDetails(user) {
        return this.userService.getUserProfileDetails(user.userId, user.userId);
    }
    GetUserProfileDetailsOfOtherUser(user, userId) {
        return this.userService.getUserProfileDetails(user.userId, userId);
    }
    UpdateUserProfileDetails(user, profile) {
        return this.userService.updateProfile(user.userId, profile);
    }
    UpdateIsSignupComplete(user) {
        return this.userService.updateIsSignupComplete(user.userId);
    }
    UpdateIsDemoComplete(user) {
        return this.userService.updateIsDemoComplete(user.userId);
    }
    SearchUsers(user, query) {
        return this.userService.searchUsers(query);
    }
};
__decorate([
    (0, common_1.Post)('signup'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiBody)({ type: signup_request_dto_1.SignupRequestDto }),
    (0, swagger_1.ApiResponse)({ type: signup_response_dto_1.SignupResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof signup_request_dto_1.SignupRequestDto !== "undefined" && signup_request_dto_1.SignupRequestDto) === "function" ? _a : Object]),
    __metadata("design:returntype", typeof (_b = typeof rxjs_1.Observable !== "undefined" && rxjs_1.Observable) === "function" ? _b : Object)
], UserController.prototype, "CreateUser", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiBody)({ type: login_request_dto_1.LoginRequestDto }),
    (0, swagger_1.ApiResponse)({ type: login_response_dto_1.LoginResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof login_request_dto_1.LoginRequestDto !== "undefined" && login_request_dto_1.LoginRequestDto) === "function" ? _c : Object]),
    __metadata("design:returntype", typeof (_d = typeof rxjs_1.Observable !== "undefined" && rxjs_1.Observable) === "function" ? _d : Object)
], UserController.prototype, "UserLogin", null);
__decorate([
    (0, common_1.Post)('resend-signup-verification-otp'),
    (0, swagger_1.ApiOperation)({ summary: 'To resend signup verification OTP via email' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiBody)({ type: resend_otp_signup_request_dto_1.ResendOtpSignupRequestDto }),
    (0, swagger_1.ApiResponse)({ type: resend_otp_signup_request_dto_2.ResendOtpSignupResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof resend_otp_signup_request_dto_1.ResendOtpSignupRequestDto !== "undefined" && resend_otp_signup_request_dto_1.ResendOtpSignupRequestDto) === "function" ? _e : Object]),
    __metadata("design:returntype", typeof (_f = typeof rxjs_1.Observable !== "undefined" && rxjs_1.Observable) === "function" ? _f : Object)
], UserController.prototype, "ResendSignupVerificationOTP", null);
__decorate([
    (0, common_1.Post)('verify-signup-otp'),
    (0, swagger_1.ApiOperation)({
        summary: 'To mark the user account as verified by verifying otp',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiBody)({ type: verify_account_otp_request_dto_1.VerifyAccountOtpRequestDto }),
    (0, swagger_1.ApiResponse)({ type: verify_account_otp_request_dto_2.VerifyAccountOtpResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof verify_account_otp_request_dto_1.VerifyAccountOtpRequestDto !== "undefined" && verify_account_otp_request_dto_1.VerifyAccountOtpRequestDto) === "function" ? _g : Object]),
    __metadata("design:returntype", typeof (_h = typeof rxjs_1.Observable !== "undefined" && rxjs_1.Observable) === "function" ? _h : Object)
], UserController.prototype, "VerifySignupOTP", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    (0, swagger_1.ApiOperation)({
        summary: 'Generate and will sent OTP to the given email address',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiBody)({ type: forgot_password_request_dto_1.ForgotPasswordRequestDto }),
    (0, swagger_1.ApiResponse)({ type: forgot_password_response_dto_1.ForgotPasswordResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_j = typeof forgot_password_request_dto_1.ForgotPasswordRequestDto !== "undefined" && forgot_password_request_dto_1.ForgotPasswordRequestDto) === "function" ? _j : Object]),
    __metadata("design:returntype", typeof (_k = typeof rxjs_1.Observable !== "undefined" && rxjs_1.Observable) === "function" ? _k : Object)
], UserController.prototype, "ForgotPassword", null);
__decorate([
    (0, common_1.Post)('validate-reset-password-otp'),
    (0, swagger_1.ApiOperation)({
        summary: 'To check OTP is correct or not. NOT TO MARK AS VERIFIED',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiBody)({ type: validate_reset_password_otp_request_dto_1.ValidateResetPasswordOtpRequestDto }),
    (0, swagger_1.ApiResponse)({ type: validate_reset_password_otp_response_dto_1.ValidateResetPasswordOtpResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_l = typeof validate_reset_password_otp_request_dto_1.ValidateResetPasswordOtpRequestDto !== "undefined" && validate_reset_password_otp_request_dto_1.ValidateResetPasswordOtpRequestDto) === "function" ? _l : Object]),
    __metadata("design:returntype", typeof (_m = typeof rxjs_1.Observable !== "undefined" && rxjs_1.Observable) === "function" ? _m : Object)
], UserController.prototype, "ValidateResetPasswordOtp", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    (0, swagger_1.ApiOperation)({
        summary: 'To verify OTP and to update new password',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiBody)({ type: reset_password_request_dto_1.ResetPasswordRequestDto }),
    (0, swagger_1.ApiResponse)({ type: reset_password_response_dto_1.ResetPasswordResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_o = typeof reset_password_request_dto_1.ResetPasswordRequestDto !== "undefined" && reset_password_request_dto_1.ResetPasswordRequestDto) === "function" ? _o : Object]),
    __metadata("design:returntype", typeof (_p = typeof rxjs_1.Observable !== "undefined" && rxjs_1.Observable) === "function" ? _p : Object)
], UserController.prototype, "ResetPassword", null);
__decorate([
    (0, common_1.Post)('profile-picture'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'This will generate presigned S3 URL for profile picture',
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    (0, swagger_1.ApiBody)({ type: upload_profile_image_request_dto_1.UploadProfileImageRequestDto }),
    (0, swagger_1.ApiResponse)({ type: upload_profile_image_response_dto_1.UploadProfileImageResponseDto }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_q = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _q : Object, typeof (_r = typeof upload_profile_image_request_dto_1.UploadProfileImageRequestDto !== "undefined" && upload_profile_image_request_dto_1.UploadProfileImageRequestDto) === "function" ? _r : Object]),
    __metadata("design:returntype", typeof (_s = typeof rxjs_1.Observable !== "undefined" && rxjs_1.Observable) === "function" ? _s : Object)
], UserController.prototype, "GetPreSignedUrlForProfilePicture", null);
__decorate([
    (0, common_1.Put)('profile-picture'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Pass the "filePath" from POST /profile-picture API response in order to update the image url in database',
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    (0, swagger_1.ApiBody)({ type: profile_image_update_url_request_dto_1.ProfileImageUpdateUrlRequestDto }),
    (0, swagger_1.ApiResponse)({ type: profile_image_update_url_response_dto_1.ProfileImageUpdateUrlResponseDto }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_t = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _t : Object, typeof (_u = typeof profile_image_update_url_request_dto_1.ProfileImageUpdateUrlRequestDto !== "undefined" && profile_image_update_url_request_dto_1.ProfileImageUpdateUrlRequestDto) === "function" ? _u : Object]),
    __metadata("design:returntype", typeof (_v = typeof rxjs_1.Observable !== "undefined" && rxjs_1.Observable) === "function" ? _v : Object)
], UserController.prototype, "UpdateProfilePictureURL", null);
__decorate([
    (0, common_1.Get)('details'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'User Profile of the logged in person',
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBody)({ type: get_profile_details_response_dto_1.GetProfileDetailsResponseDto }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_w = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _w : Object]),
    __metadata("design:returntype", typeof (_x = typeof rxjs_1.Observable !== "undefined" && rxjs_1.Observable) === "function" ? _x : Object)
], UserController.prototype, "GetUserProfileDetails", null);
__decorate([
    (0, common_1.Get)('details/:userId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'User Profile of the other user',
    }),
    (0, swagger_1.ApiParam)({ name: 'userId', type: Number }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBody)({ type: get_profile_details_response_dto_1.GetProfileDetailsResponseDto }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_y = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _y : Object, Number]),
    __metadata("design:returntype", typeof (_z = typeof rxjs_1.Observable !== "undefined" && rxjs_1.Observable) === "function" ? _z : Object)
], UserController.prototype, "GetUserProfileDetailsOfOtherUser", null);
__decorate([
    (0, common_1.Patch)('details'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({})),
    (0, swagger_1.ApiOperation)({
        summary: 'Update User Profile of the logged in person',
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBody)({ type: update_profile_request_dto_1.UpdateProfileResponseDto }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_0 = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _0 : Object, typeof (_1 = typeof update_profile_request_dto_1.UpdateProfileResponseDto !== "undefined" && update_profile_request_dto_1.UpdateProfileResponseDto) === "function" ? _1 : Object]),
    __metadata("design:returntype", typeof (_2 = typeof rxjs_1.Observable !== "undefined" && rxjs_1.Observable) === "function" ? _2 : Object)
], UserController.prototype, "UpdateUserProfileDetails", null);
__decorate([
    (0, common_1.Put)('is-signup-complete'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Flag to update after initial screens are shown',
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiResponse)({ type: Object }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_3 = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _3 : Object]),
    __metadata("design:returntype", typeof (_4 = typeof rxjs_1.Observable !== "undefined" && rxjs_1.Observable) === "function" ? _4 : Object)
], UserController.prototype, "UpdateIsSignupComplete", null);
__decorate([
    (0, common_1.Put)('is-demo-complete'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Flag to update after demo screens are shown',
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiResponse)({ type: Object }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_5 = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _5 : Object]),
    __metadata("design:returntype", typeof (_6 = typeof rxjs_1.Observable !== "undefined" && rxjs_1.Observable) === "function" ? _6 : Object)
], UserController.prototype, "UpdateIsDemoComplete", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Search user by username or handle',
    }),
    (0, swagger_1.ApiQuery)({ name: 'query', description: 'Username or User handle' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBody)({ type: [search_users_response_dto_1.SearchUsersResponseDto] }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Query)('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_7 = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _7 : Object, String]),
    __metadata("design:returntype", typeof (_8 = typeof rxjs_1.Observable !== "undefined" && rxjs_1.Observable) === "function" ? _8 : Object)
], UserController.prototype, "SearchUsers", null);
UserController = __decorate([
    (0, common_1.Controller)({
        path: 'user',
        version: '1',
    }),
    (0, swagger_1.ApiTags)('User'),
    __metadata("design:paramtypes", [typeof (_9 = typeof user_service_1.UserService !== "undefined" && user_service_1.UserService) === "function" ? _9 : Object])
], UserController);
exports.UserController = UserController;


/***/ }),
/* 68 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthUser = void 0;
const common_1 = __webpack_require__(4);
exports.AuthUser = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
});


/***/ }),
/* 69 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtAuthGuard = void 0;
const common_1 = __webpack_require__(4);
const core_1 = __webpack_require__(6);
const passport_1 = __webpack_require__(45);
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    constructor(reflector) {
        super();
        this.reflector = reflector;
    }
    async canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride('isPublic', [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        try {
            await super.canActivate(context);
            return true;
        }
        catch (err) {
            throw new common_1.UnauthorizedException('Invalid access token');
        }
    }
};
JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.Reflector !== "undefined" && core_1.Reflector) === "function" ? _a : Object])
], JwtAuthGuard);
exports.JwtAuthGuard = JwtAuthGuard;


/***/ }),
/* 70 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ForgotPasswordRequestDto = void 0;
const class_validator_1 = __webpack_require__(71);
const swagger_1 = __webpack_require__(7);
class ForgotPasswordRequestDto {
}
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ForgotPasswordRequestDto.prototype, "username", void 0);
exports.ForgotPasswordRequestDto = ForgotPasswordRequestDto;


/***/ }),
/* 71 */
/***/ ((module) => {

"use strict";
module.exports = require("class-validator");

/***/ }),
/* 72 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoginRequestDto = void 0;
const class_validator_1 = __webpack_require__(71);
const swagger_1 = __webpack_require__(7);
class LoginRequestDto {
}
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LoginRequestDto.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LoginRequestDto.prototype, "password", void 0);
exports.LoginRequestDto = LoginRequestDto;


/***/ }),
/* 73 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProfileImageUpdateUrlRequestDto = void 0;
const class_validator_1 = __webpack_require__(71);
const swagger_1 = __webpack_require__(7);
class ProfileImageUpdateUrlRequestDto {
}
__decorate([
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileImageUpdateUrlRequestDto.prototype, "filePath", void 0);
exports.ProfileImageUpdateUrlRequestDto = ProfileImageUpdateUrlRequestDto;


/***/ }),
/* 74 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ResendOtpSignupRequestDto = void 0;
const class_validator_1 = __webpack_require__(71);
const swagger_1 = __webpack_require__(7);
class ResendOtpSignupRequestDto {
}
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ResendOtpSignupRequestDto.prototype, "username", void 0);
exports.ResendOtpSignupRequestDto = ResendOtpSignupRequestDto;


/***/ }),
/* 75 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ResetPasswordRequestDto = void 0;
const class_validator_1 = __webpack_require__(71);
const swagger_1 = __webpack_require__(7);
class ResetPasswordRequestDto {
}
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ResetPasswordRequestDto.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ResetPasswordRequestDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ResetPasswordRequestDto.prototype, "otp", void 0);
exports.ResetPasswordRequestDto = ResetPasswordRequestDto;


/***/ }),
/* 76 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SignupRequestDto = void 0;
const class_validator_1 = __webpack_require__(71);
const swagger_1 = __webpack_require__(7);
class SignupRequestDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SignupRequestDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SignupRequestDto.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SignupRequestDto.prototype, "userHandle", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SignupRequestDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SignupRequestDto.prototype, "countryCode", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SignupRequestDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(8),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SignupRequestDto.prototype, "password", void 0);
exports.SignupRequestDto = SignupRequestDto;


/***/ }),
/* 77 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateProfileResponseDto = exports.Timeline = void 0;
const class_validator_1 = __webpack_require__(71);
const swagger_1 = __webpack_require__(7);
class Timeline {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Timeline.prototype, "to", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Timeline.prototype, "from", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Timeline.prototype, "activity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Timeline.prototype, "investorName", void 0);
exports.Timeline = Timeline;
class UpdateProfileResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileResponseDto.prototype, "userHandle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateProfileResponseDto.prototype, "experienceLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileResponseDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileResponseDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileResponseDto.prototype, "quote", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileResponseDto.prototype, "about", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateProfileResponseDto.prototype, "goal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [Timeline] }),
    __metadata("design:type", Array)
], UpdateProfileResponseDto.prototype, "timeline", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [Number] }),
    (0, class_validator_1.IsNumber)({}, { each: true }),
    (0, class_validator_1.ArrayUnique)((o) => o),
    __metadata("design:type", Array)
], UpdateProfileResponseDto.prototype, "investmentStyle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [Number] }),
    (0, class_validator_1.ArrayUnique)((o) => o),
    __metadata("design:type", Array)
], UpdateProfileResponseDto.prototype, "interest", void 0);
exports.UpdateProfileResponseDto = UpdateProfileResponseDto;


/***/ }),
/* 78 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UploadProfileImageRequestDto = void 0;
const class_validator_1 = __webpack_require__(71);
const constants_1 = __webpack_require__(22);
const swagger_1 = __webpack_require__(7);
const is_valid_extension_decorator_1 = __webpack_require__(79);
class UploadProfileImageRequestDto {
}
__decorate([
    (0, is_valid_extension_decorator_1.IsValidExtension)(constants_1.IMAGE_FILE_EXTENSIONS),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UploadProfileImageRequestDto.prototype, "fileName", void 0);
exports.UploadProfileImageRequestDto = UploadProfileImageRequestDto;


/***/ }),
/* 79 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IsValidExtension = void 0;
const class_validator_1 = __webpack_require__(71);
function IsValidExtension(s3FileExtensions, validationOptions) {
    return function (object, propertyName) {
        const defaultValidationOptions = {
            message: `File does not have valid extension`,
        };
        (0, class_validator_1.registerDecorator)({
            name: 'IsValidExtension',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions
                ? { ...defaultValidationOptions, ...validationOptions }
                : defaultValidationOptions,
            validator: {
                validate(value) {
                    let isValid = true;
                    const validateExt = (fileName) => {
                        const fileExtension = fileName.split('.').pop();
                        return s3FileExtensions.includes(fileExtension);
                    };
                    if (typeof value === 'string') {
                        isValid = validateExt(value);
                    }
                    else {
                        for (const fileName of value) {
                            isValid = validateExt(fileName);
                            if (!isValid)
                                break;
                        }
                    }
                    return isValid;
                },
            },
        });
    };
}
exports.IsValidExtension = IsValidExtension;


/***/ }),
/* 80 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ValidateResetPasswordOtpRequestDto = void 0;
const class_validator_1 = __webpack_require__(71);
const swagger_1 = __webpack_require__(7);
class ValidateResetPasswordOtpRequestDto {
}
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ValidateResetPasswordOtpRequestDto.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ValidateResetPasswordOtpRequestDto.prototype, "otp", void 0);
exports.ValidateResetPasswordOtpRequestDto = ValidateResetPasswordOtpRequestDto;


/***/ }),
/* 81 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VerifyAccountOtpRequestDto = void 0;
const class_transformer_1 = __webpack_require__(20);
const class_validator_1 = __webpack_require__(71);
const swagger_1 = __webpack_require__(7);
class VerifyAccountOtpRequestDto {
}
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], VerifyAccountOtpRequestDto.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], VerifyAccountOtpRequestDto.prototype, "otp", void 0);
exports.VerifyAccountOtpRequestDto = VerifyAccountOtpRequestDto;


/***/ }),
/* 82 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ForgotPasswordResponseDto = void 0;
const swagger_1 = __webpack_require__(7);
class ForgotPasswordResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ForgotPasswordResponseDto.prototype, "message", void 0);
exports.ForgotPasswordResponseDto = ForgotPasswordResponseDto;


/***/ }),
/* 83 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoginResponseDto = void 0;
const swagger_1 = __webpack_require__(7);
class User {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], User.prototype, "isVerified", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], User.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], User.prototype, "userHandle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], User.prototype, "countryCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], User.prototype, "mobileNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], User.prototype, "isDeleted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], User.prototype, "lastUpdated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], User.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], User.prototype, "quote", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], User.prototype, "about", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], User.prototype, "goal", void 0);
class LoginResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LoginResponseDto.prototype, "access_token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", User)
], LoginResponseDto.prototype, "user", void 0);
exports.LoginResponseDto = LoginResponseDto;


/***/ }),
/* 84 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProfileImageUpdateUrlResponseDto = void 0;
const swagger_1 = __webpack_require__(7);
class ProfileImageUpdateUrlResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ProfileImageUpdateUrlResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileImageUpdateUrlResponseDto.prototype, "imageOrg", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileImageUpdateUrlResponseDto.prototype, "imageThumb", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileImageUpdateUrlResponseDto.prototype, "imageSmall", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileImageUpdateUrlResponseDto.prototype, "imageMedium", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileImageUpdateUrlResponseDto.prototype, "imageLarge", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ProfileImageUpdateUrlResponseDto.prototype, "isDeleted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], ProfileImageUpdateUrlResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], ProfileImageUpdateUrlResponseDto.prototype, "lastUpdated", void 0);
exports.ProfileImageUpdateUrlResponseDto = ProfileImageUpdateUrlResponseDto;


/***/ }),
/* 85 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ResendOtpSignupResponseDto = void 0;
const swagger_1 = __webpack_require__(7);
class ResendOtpSignupResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ResendOtpSignupResponseDto.prototype, "otp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ResendOtpSignupResponseDto.prototype, "message", void 0);
exports.ResendOtpSignupResponseDto = ResendOtpSignupResponseDto;


/***/ }),
/* 86 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ResetPasswordResponseDto = void 0;
const swagger_1 = __webpack_require__(7);
class ResetPasswordResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ResetPasswordResponseDto.prototype, "message", void 0);
exports.ResetPasswordResponseDto = ResetPasswordResponseDto;


/***/ }),
/* 87 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SignupResponseDto = void 0;
const swagger_1 = __webpack_require__(7);
class SignupResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SignupResponseDto.prototype, "message", void 0);
exports.SignupResponseDto = SignupResponseDto;


/***/ }),
/* 88 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UploadProfileImageResponseDto = void 0;
const swagger_1 = __webpack_require__(7);
class UploadProfileImageResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UploadProfileImageResponseDto.prototype, "uploadUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UploadProfileImageResponseDto.prototype, "filePath", void 0);
exports.UploadProfileImageResponseDto = UploadProfileImageResponseDto;


/***/ }),
/* 89 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ValidateResetPasswordOtpResponseDto = void 0;
const swagger_1 = __webpack_require__(7);
class ValidateResetPasswordOtpResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ValidateResetPasswordOtpResponseDto.prototype, "message", void 0);
exports.ValidateResetPasswordOtpResponseDto = ValidateResetPasswordOtpResponseDto;


/***/ }),
/* 90 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VerifyAccountOtpResponseDto = void 0;
const swagger_1 = __webpack_require__(7);
class VerifyAccountOtpResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], VerifyAccountOtpResponseDto.prototype, "message", void 0);
exports.VerifyAccountOtpResponseDto = VerifyAccountOtpResponseDto;


/***/ }),
/* 91 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommonModule = void 0;
const common_1 = __webpack_require__(4);
const shared_module_1 = __webpack_require__(27);
const common_controller_1 = __webpack_require__(92);
const common_service_1 = __webpack_require__(93);
let CommonModule = class CommonModule {
};
CommonModule = __decorate([
    (0, common_1.Module)({
        imports: [shared_module_1.SharedModule],
        controllers: [common_controller_1.CommonController],
        providers: [common_service_1.CommonService],
    })
], CommonModule);
exports.CommonModule = CommonModule;


/***/ }),
/* 92 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommonController = void 0;
const user_token_payload_decorator_1 = __webpack_require__(68);
const common_1 = __webpack_require__(4);
const swagger_1 = __webpack_require__(7);
const jwt_auth_guard_1 = __webpack_require__(69);
const jwt_strategy_1 = __webpack_require__(65);
const common_service_1 = __webpack_require__(93);
const add_recent_search_history_request_dto_1 = __webpack_require__(100);
const list_hashtags_request_dto_1 = __webpack_require__(101);
const get_interests_response_dto_1 = __webpack_require__(98);
const get_recent_item_response_dto_1 = __webpack_require__(102);
let CommonController = class CommonController {
    constructor(commonService) {
        this.commonService = commonService;
    }
    GetAllInterests() {
        return this.commonService.getAllInterests();
    }
    GetAllExperienceLevel() {
        return this.commonService.getAllExperienceLevel();
    }
    GetAllInvestmentStyles() {
        return this.commonService.getAllInvestStyles();
    }
    GetAllHashtags(queryVal) {
        const { limit, offset, query } = queryVal;
        return this.commonService.getAllHashtags(limit, offset, query);
    }
    AddRecentSearchUser(user, body) {
        return this.commonService.addRecentSearchUser(user.userId, body);
    }
    GetRecentSearchItems(user, param) {
        return this.commonService.listRecentSearchItems(param.type, user.userId);
    }
};
__decorate([
    (0, common_1.Get)('interests'),
    (0, swagger_1.ApiResponse)({ type: [get_interests_response_dto_1.GetInterestsResponseDto] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CommonController.prototype, "GetAllInterests", null);
__decorate([
    (0, common_1.Get)('experience-level'),
    (0, swagger_1.ApiResponse)({ type: [get_interests_response_dto_1.GetInterestsResponseDto] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CommonController.prototype, "GetAllExperienceLevel", null);
__decorate([
    (0, common_1.Get)('investment-styles'),
    (0, swagger_1.ApiResponse)({ type: [get_interests_response_dto_1.GetInterestsResponseDto] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CommonController.prototype, "GetAllInvestmentStyles", null);
__decorate([
    (0, common_1.Get)('hashtags'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Follow a User',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiResponse)({ type: [get_interests_response_dto_1.GetInterestsResponseDto] }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof list_hashtags_request_dto_1.ListAllHashtagsQueryDto !== "undefined" && list_hashtags_request_dto_1.ListAllHashtagsQueryDto) === "function" ? _a : Object]),
    __metadata("design:returntype", void 0)
], CommonController.prototype, "GetAllHashtags", null);
__decorate([
    (0, common_1.Post)('recent-search'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Add recent search user or asset',
    }),
    (0, swagger_1.ApiBody)({ type: add_recent_search_history_request_dto_1.AddRecentSearchRequestDto }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    (0, swagger_1.ApiResponse)({}),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _b : Object, typeof (_c = typeof add_recent_search_history_request_dto_1.AddRecentSearchRequestDto !== "undefined" && add_recent_search_history_request_dto_1.AddRecentSearchRequestDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], CommonController.prototype, "AddRecentSearchUser", null);
__decorate([
    (0, common_1.Get)('recent-search/:type'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Get recent searches',
    }),
    (0, swagger_1.ApiParam)({
        name: 'type',
        enum: ['user', 'asset'],
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiResponse)({ type: [get_recent_item_response_dto_1.GetRecentItemResponse] }),
    (0, swagger_1.ApiResponse)({ type: [get_interests_response_dto_1.GetInterestsResponseDto] }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _d : Object, typeof (_e = typeof add_recent_search_history_request_dto_1.listRecentSearchItemDto !== "undefined" && add_recent_search_history_request_dto_1.listRecentSearchItemDto) === "function" ? _e : Object]),
    __metadata("design:returntype", void 0)
], CommonController.prototype, "GetRecentSearchItems", null);
CommonController = __decorate([
    (0, common_1.Controller)({
        path: 'common',
        version: '1',
    }),
    (0, swagger_1.ApiTags)('Common'),
    __metadata("design:paramtypes", [typeof (_f = typeof common_service_1.CommonService !== "undefined" && common_service_1.CommonService) === "function" ? _f : Object])
], CommonController);
exports.CommonController = CommonController;


/***/ }),
/* 93 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var CommonService_1, _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommonService = void 0;
const configuration_1 = __webpack_require__(10);
const database_service_1 = __webpack_require__(19);
const logging_service_1 = __webpack_require__(26);
const utils_service_1 = __webpack_require__(23);
const common_1 = __webpack_require__(4);
const config_1 = __webpack_require__(5);
const get_all_experience_level_db_query_1 = __webpack_require__(94);
const get_all_interests_db_query_1 = __webpack_require__(95);
const get_all_investment_style_db_query_1 = __webpack_require__(96);
const get_experience_level_response_dto_1 = __webpack_require__(97);
const get_interests_response_dto_1 = __webpack_require__(98);
const get_investment_styes_response_dto_1 = __webpack_require__(99);
let CommonService = CommonService_1 = class CommonService {
    constructor(config, db, logger) {
        this.config = config;
        this.db = db;
        this.logger = logger;
        this.logger.setContext(CommonService_1.name);
    }
    getAllInterests() {
        return this.db.rawQuery(get_all_interests_db_query_1.getAllInterestsDbQuery, [], get_interests_response_dto_1.GetInterestsResponseDto);
    }
    getAllExperienceLevel() {
        return this.db.rawQuery(get_all_experience_level_db_query_1.getAllExperienceLevelDbQuery, [], get_experience_level_response_dto_1.GetExperienceLevelResponseDto);
    }
    getAllInvestStyles() {
        return this.db.rawQuery(get_all_investment_style_db_query_1.getAllInvestmentStylesDbQuery, [], get_investment_styes_response_dto_1.GetInvestmentStyleResponseDto);
    }
    getAllHashtags(limit, offset, query) {
        let dbQuery = `SELECT * from master_hashtags 
    -- TAG_NAME_CONDITION
    ORDER by last_updated DESC LIMIT $1 OFFSET $2`;
        const data = [limit, offset];
        if (query) {
            dbQuery = dbQuery.replace('-- TAG_NAME_CONDITION', 'WHERE tag_name ILIKE $3');
            data.push(`${query}%`);
        }
        return this.db.rawQuery(dbQuery, data, null);
    }
    addRecentSearchUser(createdUserId, body) {
        const { assetId, userId } = body;
        const valuesArray = [], queriesArray = [];
        if (!(assetId || userId)) {
            throw new common_1.BadRequestException('assetId or userId is required');
        }
        if (assetId) {
            valuesArray.push(createdUserId);
            const { data: createAssetMasterData, query: createAssetMasterQuery } = utils_service_1.UtilsService.buildInsertQuery({
                tableName: 'master_assets',
                columnData: [assetId].map((x) => ({
                    symbol: x,
                })),
                keysToIgnore: [],
                keysToReplace: [],
                start: valuesArray.length + 1,
            });
            queriesArray.push(`
      ins_master_asset AS (
        ${createAssetMasterQuery}
            ON CONFLICT("symbol")
              DO NOTHING
                RETURNING id
            ),    
        select_asset_ids as (
          SELECT * FROM ins_master_asset
              UNION
          SELECT id FROM master_assets
                where 
            symbol in ( ${createAssetMasterData
                .map((x, i) => `$${valuesArray.length + i + 1}`)
                .join(', ')} )
        ),          
        ins_asset_recent_search as (
          INSERT INTO recent_search (created_by, asset_id) 
          SELECT
              $1, id
          FROM
              select_asset_ids
          RETURNING *
        )
      `);
            valuesArray.push(...createAssetMasterData);
        }
        else {
            const { data, query } = utils_service_1.UtilsService.buildInsertQuery({
                tableName: 'recent_search',
                columnData: [
                    {
                        userId,
                        createdBy: createdUserId,
                    },
                ],
                keysToIgnore: ['assetId'],
                keysToReplace: {},
                start: valuesArray.length + 1,
            });
            queriesArray.push(`ins_user_recent_search as ( ${query} )`);
            valuesArray.push(...data);
        }
        return this.db.rawQuery(`WITH ${queriesArray.join(', ')} (select 1 as success) `, valuesArray, null);
    }
    listRecentSearchItems(type, userId) {
        let dbQuery = '';
        const data = [userId];
        if (type === 'asset') {
            dbQuery = `select recent_search.id, symbol
      from recent_search
               LEFT OUTER JOIN master_assets ma on ma.id = recent_search.asset_id
      WHERE user_id is null
        AND created_by = $1
      ORDER BY recent_search.last_updated desc
      LIMIT 5;`;
        }
        else {
            dbQuery = `SELECT user_handle,
      first_name,
      last_name,
            up.user_id
      FROM recent_search
              LEFT JOIN user_core uc on recent_search.user_id = uc.id
              LEFT JOIN user_profile up ON up.user_id = uc.id
      WHERE asset_id is null AND created_by = $1
      ORDER BY recent_search.last_updated desc
      LIMIT 5;
      `;
        }
        return this.db.rawQuery(dbQuery, data, null);
    }
};
CommonService = CommonService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(configuration_1.default.KEY)),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigType !== "undefined" && config_1.ConfigType) === "function" ? _a : Object, typeof (_b = typeof database_service_1.DatabaseService !== "undefined" && database_service_1.DatabaseService) === "function" ? _b : Object, typeof (_c = typeof logging_service_1.Logger !== "undefined" && logging_service_1.Logger) === "function" ? _c : Object])
], CommonService);
exports.CommonService = CommonService;


/***/ }),
/* 94 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getAllExperienceLevelDbQuery = void 0;
exports.getAllExperienceLevelDbQuery = `
select * from master_experience_level;
`;


/***/ }),
/* 95 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getAllInterestsDbQuery = void 0;
exports.getAllInterestsDbQuery = `
select * from master_interests;
`;


/***/ }),
/* 96 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getAllInvestmentStylesDbQuery = void 0;
exports.getAllInvestmentStylesDbQuery = `
select * from master_investment_types;
`;


/***/ }),
/* 97 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetExperienceLevelResponseDto = void 0;
const swagger_1 = __webpack_require__(7);
class GetExperienceLevelResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetExperienceLevelResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetExperienceLevelResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], GetExperienceLevelResponseDto.prototype, "isDeleted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], GetExperienceLevelResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], GetExperienceLevelResponseDto.prototype, "lastUpdated", void 0);
exports.GetExperienceLevelResponseDto = GetExperienceLevelResponseDto;


/***/ }),
/* 98 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetInterestsResponseDto = void 0;
const swagger_1 = __webpack_require__(7);
class GetInterestsResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetInterestsResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetInterestsResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], GetInterestsResponseDto.prototype, "isDeleted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], GetInterestsResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], GetInterestsResponseDto.prototype, "lastUpdated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetInterestsResponseDto.prototype, "imageUrl", void 0);
exports.GetInterestsResponseDto = GetInterestsResponseDto;


/***/ }),
/* 99 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetInvestmentStyleResponseDto = void 0;
const swagger_1 = __webpack_require__(7);
class GetInvestmentStyleResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetInvestmentStyleResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetInvestmentStyleResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], GetInvestmentStyleResponseDto.prototype, "isDeleted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], GetInvestmentStyleResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], GetInvestmentStyleResponseDto.prototype, "lastUpdated", void 0);
exports.GetInvestmentStyleResponseDto = GetInvestmentStyleResponseDto;


/***/ }),
/* 100 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.listRecentSearchItemDto = exports.AddRecentSearchRequestDto = void 0;
const class_transformer_1 = __webpack_require__(20);
const class_validator_1 = __webpack_require__(71);
const swagger_1 = __webpack_require__(7);
class AddRecentSearchRequestDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], AddRecentSearchRequestDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddRecentSearchRequestDto.prototype, "assetId", void 0);
exports.AddRecentSearchRequestDto = AddRecentSearchRequestDto;
class listRecentSearchItemDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['user', 'asset']),
    __metadata("design:type", String)
], listRecentSearchItemDto.prototype, "type", void 0);
exports.listRecentSearchItemDto = listRecentSearchItemDto;


/***/ }),
/* 101 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ListAllHashtagsQueryDto = void 0;
const class_transformer_1 = __webpack_require__(20);
const class_validator_1 = __webpack_require__(71);
class ListAllHashtagsQueryDto {
    constructor() {
        this.limit = 8;
        this.offset = 0;
    }
}
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotIn)([0]),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ListAllHashtagsQueryDto.prototype, "limit", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ListAllHashtagsQueryDto.prototype, "offset", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ListAllHashtagsQueryDto.prototype, "query", void 0);
exports.ListAllHashtagsQueryDto = ListAllHashtagsQueryDto;


/***/ }),
/* 102 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetRecentItemResponse = void 0;
const swagger_1 = __webpack_require__(7);
class GetRecentItemResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetRecentItemResponse.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'For asset list' }),
    __metadata("design:type", String)
], GetRecentItemResponse.prototype, "symbol", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'For user list' }),
    __metadata("design:type", String)
], GetRecentItemResponse.prototype, "userHandle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'For user list' }),
    __metadata("design:type", String)
], GetRecentItemResponse.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'For user list' }),
    __metadata("design:type", String)
], GetRecentItemResponse.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'For user list' }),
    __metadata("design:type", Number)
], GetRecentItemResponse.prototype, "userId", void 0);
exports.GetRecentItemResponse = GetRecentItemResponse;


/***/ }),
/* 103 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PostsModule = void 0;
const common_1 = __webpack_require__(4);
const shared_module_1 = __webpack_require__(27);
const posts_controller_1 = __webpack_require__(104);
const posts_service_1 = __webpack_require__(118);
let PostsModule = class PostsModule {
};
PostsModule = __decorate([
    (0, common_1.Module)({
        imports: [shared_module_1.SharedModule],
        controllers: [posts_controller_1.PostsController],
        providers: [posts_service_1.PostsService],
    })
], PostsModule);
exports.PostsModule = PostsModule;


/***/ }),
/* 104 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PostsController = void 0;
const joi_1 = __webpack_require__(12);
const rxjs_1 = __webpack_require__(16);
const user_token_payload_decorator_1 = __webpack_require__(68);
const common_1 = __webpack_require__(4);
const swagger_1 = __webpack_require__(7);
const jwt_auth_guard_1 = __webpack_require__(69);
const jwt_strategy_1 = __webpack_require__(65);
const add_comment_db_query_1 = __webpack_require__(105);
const create_post_request_dto_1 = __webpack_require__(106);
const list_all_posts_query_dto_1 = __webpack_require__(107);
const update_comment_request_dto_1 = __webpack_require__(108);
const update_like_for_comment_param_dto_1 = __webpack_require__(109);
const update_like_for_post_param_dto_1 = __webpack_require__(110);
const update_post_request_dto_1 = __webpack_require__(111);
const upload_attachment_image_request_dto_1 = __webpack_require__(112);
const create_post_response_dto_1 = __webpack_require__(113);
const likes_of_post_response_dto_1 = __webpack_require__(114);
const list_all_comments_response_dto_1 = __webpack_require__(115);
const list_all_post_response_dto_1 = __webpack_require__(116);
const upload_attachment_image_response_dto_1 = __webpack_require__(117);
const posts_service_1 = __webpack_require__(118);
let PostsController = class PostsController {
    constructor(postsService) {
        this.postsService = postsService;
    }
    create(user, createPostDto) {
        return this.postsService.create(user.userId, createPostDto);
    }
    findAllPosts(user, query) {
        return this.postsService.findAll(user.userId, null, query);
    }
    findPostsOfAUser(user, query, userId) {
        return this.postsService.findAll(user.userId, userId !== null && userId !== void 0 ? userId : user.userId, query);
    }
    UpdatePost(user, createPostDto, postId) {
        return this.postsService.updatePost(user.userId, postId, createPostDto);
    }
    remove(user, postId) {
        return this.postsService.deletePost(user.userId, postId);
    }
    UpdatePostLike(user, param) {
        const { likeValue, postId } = param;
        return this.postsService.updateLikeForPost(user.userId, postId, likeValue);
    }
    GetLikeDetailsOfPost(user, query, postId) {
        return this.postsService.getPostLikeUsers(postId, query);
    }
    GetPreSignedUrlForAttachment(user, body) {
        return this.postsService.getPreSignedUrlForAttachment(body.fileName, user.userId);
    }
    AddCommentOnPost(user, postId, body) {
        return this.postsService.addCommentOnPost(user.userId, postId, body);
    }
    ListCommentOfAPost(user, query, postId) {
        return this.postsService.listCommentOfPost(postId, user.userId, query);
    }
    ListRepliesOfCommentOfAPost(user, query, postId, commentId) {
        return this.postsService.listCommentOfPost(postId, user.userId, query, commentId, true);
    }
    UpdateCommentOnPost(user, createPostDto, postId, commentId) {
        return this.postsService.updateCommentOnPost(user.userId, commentId, postId, createPostDto);
    }
    RemoveCommentOnPost(user, postId, commentId) {
        return this.postsService.deleteCommentOnPost(user.userId, postId, commentId);
    }
    UpdateLikeForCommentOnPost(user, param) {
        const { likeValue, postId, commentId } = param;
        return this.postsService.updateLikeForCommentOnPost(user.userId, postId, commentId, likeValue);
    }
    GetLikesForCommentOnPost(user, query, postId, commentId) {
        return this.postsService.getLikeForCommentOnPost(commentId, query);
    }
    ListAllPostsWithTaggedTypes(user, query, type, value) {
        return this.postsService.getPostsWhichTagged(query, type, value, user.userId);
    }
};
__decorate([
    (0, swagger_1.ApiTags)('Posts'),
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Create POST',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiBody)({ type: create_post_request_dto_1.CreatePostRequestDto }),
    (0, swagger_1.ApiResponse)({ type: create_post_response_dto_1.CreatePostResponseDto }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _a : Object, typeof (_b = typeof create_post_request_dto_1.CreatePostRequestDto !== "undefined" && create_post_request_dto_1.CreatePostRequestDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiTags)('Posts'),
    (0, common_1.Get)(''),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all posts in latest order of all users',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiResponse)({ type: [list_all_post_response_dto_1.ListAllPostsResponseDto] }),
    (0, swagger_1.ApiQuery)({ name: 'limit', description: 'Number of posts to return' }),
    (0, swagger_1.ApiQuery)({
        name: 'filter',
        enum: ['all', 'one_day', 'one_week', 'one_month'],
    }),
    (0, swagger_1.ApiQuery)({
        name: 'offset',
        description: 'From which post to get n-limit posts',
    }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _c : Object, typeof (_d = typeof list_all_posts_query_dto_1.ListAllPostsQueryDto !== "undefined" && list_all_posts_query_dto_1.ListAllPostsQueryDto) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "findAllPosts", null);
__decorate([
    (0, swagger_1.ApiTags)('Posts'),
    (0, common_1.Get)(':userId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all posts of any particular user or current logged in user',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiResponse)({ type: [list_all_post_response_dto_1.ListAllPostsResponseDto] }),
    (0, swagger_1.ApiQuery)({ name: 'limit', description: 'Number of posts to return' }),
    (0, swagger_1.ApiQuery)({
        name: 'offset',
        description: 'From which post to get n-limit posts',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'filter',
        enum: ['all', 'one_day', 'one_week', 'one_month'],
    }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _e : Object, typeof (_f = typeof list_all_posts_query_dto_1.ListAllPostsQueryDto !== "undefined" && list_all_posts_query_dto_1.ListAllPostsQueryDto) === "function" ? _f : Object, Number]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "findPostsOfAUser", null);
__decorate([
    (0, swagger_1.ApiTags)('Posts'),
    (0, common_1.Patch)(':postId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'PATCH a post',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiBody)({ type: update_post_request_dto_1.UpdatePostRequestDto }),
    (0, swagger_1.ApiResponse)({ type: create_post_response_dto_1.UpdatePostResponseDto }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Param)('postId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _g : Object, typeof (_h = typeof create_post_request_dto_1.CreatePostRequestDto !== "undefined" && create_post_request_dto_1.CreatePostRequestDto) === "function" ? _h : Object, Number]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "UpdatePost", null);
__decorate([
    (0, swagger_1.ApiTags)('Posts'),
    (0, common_1.Delete)(':postId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a post',
    }),
    (0, swagger_1.ApiResponse)({}),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)('postId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_j = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _j : Object, Number]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "remove", null);
__decorate([
    (0, swagger_1.ApiTags)('Posts'),
    (0, common_1.Patch)('/:postId/:likeValue'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiParam)({ name: 'postId', type: joi_1.number }),
    (0, swagger_1.ApiParam)({ name: 'likeValue', enum: ['like', 'unlike'] }),
    (0, swagger_1.ApiOperation)({
        summary: 'PATCH a post',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiResponse)({}),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_k = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _k : Object, typeof (_l = typeof update_like_for_post_param_dto_1.UpdateLikeForPostParam !== "undefined" && update_like_for_post_param_dto_1.UpdateLikeForPostParam) === "function" ? _l : Object]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "UpdatePostLike", null);
__decorate([
    (0, swagger_1.ApiTags)('Posts'),
    (0, common_1.Get)(':postId/likes'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'get list of users who like the post',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiResponse)({ type: [likes_of_post_response_dto_1.LikesOfPostResponseDto] }),
    (0, swagger_1.ApiQuery)({ name: 'limit', description: 'Number of users to return' }),
    (0, swagger_1.ApiQuery)({
        name: 'offset',
        description: 'From which post to get n-limit posts',
    }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Param)('postId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_m = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _m : Object, typeof (_o = typeof list_all_posts_query_dto_1.ListAllPostsQueryDto !== "undefined" && list_all_posts_query_dto_1.ListAllPostsQueryDto) === "function" ? _o : Object, Number]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "GetLikeDetailsOfPost", null);
__decorate([
    (0, swagger_1.ApiTags)('Posts'),
    (0, common_1.Post)('attachment'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'This will generate presigned S3 URL for attachment pictures',
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    (0, swagger_1.ApiBody)({ type: upload_attachment_image_request_dto_1.UploadAttachmentImageRequestDto }),
    (0, swagger_1.ApiResponse)({ type: upload_attachment_image_response_dto_1.UploadAttachmentImageResponseDto }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_p = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _p : Object, typeof (_q = typeof upload_attachment_image_request_dto_1.UploadAttachmentImageRequestDto !== "undefined" && upload_attachment_image_request_dto_1.UploadAttachmentImageRequestDto) === "function" ? _q : Object]),
    __metadata("design:returntype", typeof (_r = typeof rxjs_1.Observable !== "undefined" && rxjs_1.Observable) === "function" ? _r : Object)
], PostsController.prototype, "GetPreSignedUrlForAttachment", null);
__decorate([
    (0, swagger_1.ApiTags)('Posts - Comment'),
    (0, common_1.Post)('/:postId/comment'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'In order to add comment on a post',
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    (0, swagger_1.ApiBody)({ type: add_comment_db_query_1.AddCommentOnPostRequestDto }),
    (0, swagger_1.ApiResponse)({}),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)('postId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_s = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _s : Object, Number, typeof (_t = typeof add_comment_db_query_1.AddCommentOnPostRequestDto !== "undefined" && add_comment_db_query_1.AddCommentOnPostRequestDto) === "function" ? _t : Object]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "AddCommentOnPost", null);
__decorate([
    (0, swagger_1.ApiTags)('Posts - Comment'),
    (0, common_1.Get)('/:postId/comment'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'This will generate presigned S3 URL for attachment pictures',
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiQuery)({ name: 'limit' }),
    (0, swagger_1.ApiQuery)({
        name: 'offset',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    (0, swagger_1.ApiResponse)({ type: [list_all_comments_response_dto_1.ListAllCommentsOnPostsResponseDto] }),
    (0, swagger_1.ApiResponse)({}),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Param)('postId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_u = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _u : Object, typeof (_v = typeof list_all_posts_query_dto_1.ListAllPostsQueryDto !== "undefined" && list_all_posts_query_dto_1.ListAllPostsQueryDto) === "function" ? _v : Object, Number]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "ListCommentOfAPost", null);
__decorate([
    (0, swagger_1.ApiTags)('Posts - Replies of Comment'),
    (0, common_1.Get)('/:postId/comment/:commentId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'This will generate presigned S3 URL for attachment pictures',
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiQuery)({ name: 'limit' }),
    (0, swagger_1.ApiQuery)({
        name: 'offset',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    (0, swagger_1.ApiResponse)({ type: [list_all_comments_response_dto_1.ListAllCommentsOnPostsResponseDto] }),
    (0, swagger_1.ApiResponse)({}),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Param)('postId', common_1.ParseIntPipe)),
    __param(3, (0, common_1.Param)('commentId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_w = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _w : Object, typeof (_x = typeof list_all_posts_query_dto_1.ListAllPostsQueryDto !== "undefined" && list_all_posts_query_dto_1.ListAllPostsQueryDto) === "function" ? _x : Object, Number, Number]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "ListRepliesOfCommentOfAPost", null);
__decorate([
    (0, swagger_1.ApiTags)('Posts - Comment'),
    (0, common_1.Patch)('/:postId/comment/:commentId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'PATCH a comment',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiBody)({ type: update_post_request_dto_1.UpdatePostRequestDto }),
    (0, swagger_1.ApiResponse)({ type: create_post_response_dto_1.UpdatePostResponseDto }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Param)('postId', common_1.ParseIntPipe)),
    __param(3, (0, common_1.Param)('commentId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_y = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _y : Object, typeof (_z = typeof update_comment_request_dto_1.UpdateCommentOnPostRequestDto !== "undefined" && update_comment_request_dto_1.UpdateCommentOnPostRequestDto) === "function" ? _z : Object, Number, Number]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "UpdateCommentOnPost", null);
__decorate([
    (0, swagger_1.ApiTags)('Posts - Comment'),
    (0, common_1.Delete)('/:postId/comment/:commentId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a comment on post',
    }),
    (0, swagger_1.ApiResponse)({}),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)('postId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Param)('commentId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_0 = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _0 : Object, Number, Number]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "RemoveCommentOnPost", null);
__decorate([
    (0, swagger_1.ApiTags)('Posts - Comment'),
    (0, common_1.Patch)('/:postId/comment/:commentId/:likeValue'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiParam)({ name: 'postId', type: joi_1.number }),
    (0, swagger_1.ApiParam)({ name: 'commentId', type: joi_1.number }),
    (0, swagger_1.ApiParam)({ name: 'likeValue', enum: ['like', 'unlike'] }),
    (0, swagger_1.ApiOperation)({
        summary: 'update a like for comment',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiResponse)({}),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_1 = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _1 : Object, typeof (_2 = typeof update_like_for_comment_param_dto_1.UpdateLikeForCommentOnPostParam !== "undefined" && update_like_for_comment_param_dto_1.UpdateLikeForCommentOnPostParam) === "function" ? _2 : Object]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "UpdateLikeForCommentOnPost", null);
__decorate([
    (0, swagger_1.ApiTags)('Posts - Comment'),
    (0, common_1.Get)('/:postId/comment/:commentId/likes'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'get list of users who like the post',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiResponse)({ type: [likes_of_post_response_dto_1.LikesOfPostResponseDto] }),
    (0, swagger_1.ApiQuery)({ name: 'limit', description: 'Number of users to return' }),
    (0, swagger_1.ApiQuery)({
        name: 'offset',
        description: 'From which post to get n-limit posts',
    }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Param)('postId', common_1.ParseIntPipe)),
    __param(3, (0, common_1.Param)('commentId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_3 = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _3 : Object, typeof (_4 = typeof list_all_posts_query_dto_1.ListAllPostsQueryDto !== "undefined" && list_all_posts_query_dto_1.ListAllPostsQueryDto) === "function" ? _4 : Object, Number, Number]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "GetLikesForCommentOnPost", null);
__decorate([
    (0, swagger_1.ApiTags)('Posts - Get posts from tagged user/hashtag/trades'),
    (0, common_1.Get)('/:type/:value'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'get list of posts with Hashtag/User/Asset mentioned',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    (0, swagger_1.ApiParam)({
        name: 'type',
        description: 'Type of tagged type',
        enum: ['hashtag', 'user', 'asset'],
    }),
    (0, swagger_1.ApiParam)({
        name: 'value',
        description: 'Corresponding value of tagged type',
    }),
    (0, swagger_1.ApiQuery)({ name: 'limit', description: 'Number of users to return' }),
    (0, swagger_1.ApiQuery)({
        name: 'offset',
        description: 'From which post to get n-limit posts',
    }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Param)('type')),
    __param(3, (0, common_1.Param)('value')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_5 = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _5 : Object, typeof (_6 = typeof list_all_posts_query_dto_1.ListAllPostsQueryDto !== "undefined" && list_all_posts_query_dto_1.ListAllPostsQueryDto) === "function" ? _6 : Object, String, String]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "ListAllPostsWithTaggedTypes", null);
PostsController = __decorate([
    (0, common_1.Controller)({
        path: 'posts',
        version: '1',
    }),
    __metadata("design:paramtypes", [typeof (_7 = typeof posts_service_1.PostsService !== "undefined" && posts_service_1.PostsService) === "function" ? _7 : Object])
], PostsController);
exports.PostsController = PostsController;


/***/ }),
/* 105 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AddCommentOnPostRequestDto = void 0;
const class_validator_1 = __webpack_require__(71);
const swagger_1 = __webpack_require__(7);
class AddCommentOnPostRequestDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddCommentOnPostRequestDto.prototype, "comment", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        description: 'Array of tagged users ID',
        required: false,
        type: [Number],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNumber)({}, { each: true }),
    __metadata("design:type", Array)
], AddCommentOnPostRequestDto.prototype, "taggedUsers", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        description: 'Hashtags as array of strings',
        required: false,
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], AddCommentOnPostRequestDto.prototype, "hashtags", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        description: 'Array of tagged Assets ID',
        required: false,
        type: [String],
    }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], AddCommentOnPostRequestDto.prototype, "taggedAssets", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AddCommentOnPostRequestDto.prototype, "parentCommentId", void 0);
exports.AddCommentOnPostRequestDto = AddCommentOnPostRequestDto;


/***/ }),
/* 106 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreatePostRequestDto = void 0;
const class_validator_1 = __webpack_require__(71);
const swagger_1 = __webpack_require__(7);
class CreatePostRequestDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePostRequestDto.prototype, "sharedPostId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePostRequestDto.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        description: 'Original image URL that being returned from the generatePresignedUrl API',
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUrl)({}, { each: true }),
    __metadata("design:type", Array)
], CreatePostRequestDto.prototype, "mediaUrls", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        description: 'Array of tagged users ID',
        required: false,
        type: [Number],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNumber)({}, { each: true }),
    __metadata("design:type", Array)
], CreatePostRequestDto.prototype, "taggedUsers", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        description: 'Hashtags as array of strings',
        required: false,
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreatePostRequestDto.prototype, "hashtags", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        description: 'Array of tagged Assets ID',
        required: false,
        type: [String],
    }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreatePostRequestDto.prototype, "taggedAssets", void 0);
exports.CreatePostRequestDto = CreatePostRequestDto;


/***/ }),
/* 107 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ListAllPostsQueryDto = void 0;
const class_transformer_1 = __webpack_require__(20);
const class_validator_1 = __webpack_require__(71);
class ListAllPostsQueryDto {
    constructor() {
        this.limit = 8;
        this.offset = 0;
        this.sort = 'latest';
        this.filter = 'all';
    }
}
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ListAllPostsQueryDto.prototype, "limit", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ListAllPostsQueryDto.prototype, "offset", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ListAllPostsQueryDto.prototype, "sort", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['all', 'one_day', 'one_week', 'one_month']),
    __metadata("design:type", String)
], ListAllPostsQueryDto.prototype, "filter", void 0);
exports.ListAllPostsQueryDto = ListAllPostsQueryDto;


/***/ }),
/* 108 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateCommentOnPostRequestDto = void 0;
const swagger_1 = __webpack_require__(7);
const add_comment_db_query_1 = __webpack_require__(105);
class UpdateCommentOnPostRequestDto extends (0, swagger_1.PartialType)(add_comment_db_query_1.AddCommentOnPostRequestDto) {
}
exports.UpdateCommentOnPostRequestDto = UpdateCommentOnPostRequestDto;


/***/ }),
/* 109 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateLikeForCommentOnPostParam = void 0;
const class_transformer_1 = __webpack_require__(20);
const class_validator_1 = __webpack_require__(71);
class UpdateLikeForCommentOnPostParam {
    constructor() {
        this.likeValue = 'like';
    }
}
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateLikeForCommentOnPostParam.prototype, "postId", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateLikeForCommentOnPostParam.prototype, "commentId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['like', 'unlike']),
    __metadata("design:type", Object)
], UpdateLikeForCommentOnPostParam.prototype, "likeValue", void 0);
exports.UpdateLikeForCommentOnPostParam = UpdateLikeForCommentOnPostParam;


/***/ }),
/* 110 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateLikeForPostParam = void 0;
const class_transformer_1 = __webpack_require__(20);
const class_validator_1 = __webpack_require__(71);
class UpdateLikeForPostParam {
    constructor() {
        this.likeValue = 'like';
    }
}
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateLikeForPostParam.prototype, "postId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['like', 'unlike']),
    __metadata("design:type", Object)
], UpdateLikeForPostParam.prototype, "likeValue", void 0);
exports.UpdateLikeForPostParam = UpdateLikeForPostParam;


/***/ }),
/* 111 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdatePostRequestDto = void 0;
const swagger_1 = __webpack_require__(7);
const create_post_request_dto_1 = __webpack_require__(106);
class UpdatePostRequestDto extends (0, swagger_1.PartialType)(create_post_request_dto_1.CreatePostRequestDto) {
}
exports.UpdatePostRequestDto = UpdatePostRequestDto;


/***/ }),
/* 112 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UploadAttachmentImageRequestDto = void 0;
const class_validator_1 = __webpack_require__(71);
const constants_1 = __webpack_require__(22);
const swagger_1 = __webpack_require__(7);
const is_valid_extension_decorator_1 = __webpack_require__(79);
class UploadAttachmentImageRequestDto {
}
__decorate([
    (0, is_valid_extension_decorator_1.IsValidExtension)(constants_1.IMAGE_FILE_EXTENSIONS),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UploadAttachmentImageRequestDto.prototype, "fileName", void 0);
exports.UploadAttachmentImageRequestDto = UploadAttachmentImageRequestDto;


/***/ }),
/* 113 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdatePostResponseDto = exports.CreatePostResponseDto = void 0;
const swagger_1 = __webpack_require__(7);
class CreatePostResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreatePostResponseDto.prototype, "id", void 0);
exports.CreatePostResponseDto = CreatePostResponseDto;
class UpdatePostResponseDto extends CreatePostResponseDto {
}
exports.UpdatePostResponseDto = UpdatePostResponseDto;


/***/ }),
/* 114 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LikesOfPostResponseDto = exports.ProfileImage = void 0;
const swagger_1 = __webpack_require__(7);
class ProfileImage {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileImage.prototype, "imageOrg", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileImage.prototype, "imageLarge", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileImage.prototype, "imageSmall", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileImage.prototype, "imageThumb", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileImage.prototype, "imageMedium", void 0);
exports.ProfileImage = ProfileImage;
class LikesOfPostResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], LikesOfPostResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LikesOfPostResponseDto.prototype, "userHandle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LikesOfPostResponseDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LikesOfPostResponseDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", ProfileImage)
], LikesOfPostResponseDto.prototype, "profileImage", void 0);
exports.LikesOfPostResponseDto = LikesOfPostResponseDto;


/***/ }),
/* 115 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ListAllCommentsOnPostsResponseDto = exports.ListAllCommentsOnPostsResponseDtoTemp = exports.TaggedUser = exports.TaggedAsset = exports.CreatedBy = void 0;
const swagger_1 = __webpack_require__(7);
class CreatedBy {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreatedBy.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreatedBy.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreatedBy.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreatedBy.prototype, "userHandle", void 0);
exports.CreatedBy = CreatedBy;
class TaggedAsset {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TaggedAsset.prototype, "logo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TaggedAsset.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TaggedAsset.prototype, "symbol", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], TaggedAsset.prototype, "assetId", void 0);
exports.TaggedAsset = TaggedAsset;
class TaggedUser {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TaggedUser.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TaggedUser.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TaggedUser.prototype, "userHandle", void 0);
exports.TaggedUser = TaggedUser;
class ListAllCommentsOnPostsResponseDtoTemp {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ListAllCommentsOnPostsResponseDtoTemp.prototype, "postId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ListAllCommentsOnPostsResponseDtoTemp.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ListAllCommentsOnPostsResponseDtoTemp.prototype, "isLiked", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ListAllCommentsOnPostsResponseDtoTemp.prototype, "likes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: CreatedBy }),
    __metadata("design:type", CreatedBy)
], ListAllCommentsOnPostsResponseDtoTemp.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [TaggedAsset] }),
    __metadata("design:type", Array)
], ListAllCommentsOnPostsResponseDtoTemp.prototype, "taggedAssets", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [TaggedUser] }),
    __metadata("design:type", Array)
], ListAllCommentsOnPostsResponseDtoTemp.prototype, "taggedUsers", void 0);
exports.ListAllCommentsOnPostsResponseDtoTemp = ListAllCommentsOnPostsResponseDtoTemp;
class ListAllCommentsOnPostsResponseDto extends ListAllCommentsOnPostsResponseDtoTemp {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ListAllCommentsOnPostsResponseDtoTemp] }),
    __metadata("design:type", Array)
], ListAllCommentsOnPostsResponseDto.prototype, "replies", void 0);
exports.ListAllCommentsOnPostsResponseDto = ListAllCommentsOnPostsResponseDto;


/***/ }),
/* 116 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ListAllPostsResponseDto = exports.ListAllPostsResponseDtoTemp = exports.ProfileImage = exports.MediaUrl = exports.TaggedUser = exports.TaggedAsset = exports.CreatedBy = void 0;
const swagger_1 = __webpack_require__(7);
class CreatedBy {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreatedBy.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreatedBy.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreatedBy.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreatedBy.prototype, "userHandle", void 0);
exports.CreatedBy = CreatedBy;
class TaggedAsset {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TaggedAsset.prototype, "logo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TaggedAsset.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TaggedAsset.prototype, "symbol", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], TaggedAsset.prototype, "assetId", void 0);
exports.TaggedAsset = TaggedAsset;
class TaggedUser {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TaggedUser.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TaggedUser.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TaggedUser.prototype, "userHandle", void 0);
exports.TaggedUser = TaggedUser;
class MediaUrl {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], MediaUrl.prototype, "imageLarge", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], MediaUrl.prototype, "imageSmall", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], MediaUrl.prototype, "imageThumb", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], MediaUrl.prototype, "imageMedium", void 0);
exports.MediaUrl = MediaUrl;
class ProfileImage {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileImage.prototype, "imageOrg", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileImage.prototype, "imageThumb", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileImage.prototype, "imageSmall", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileImage.prototype, "imageMedium", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileImage.prototype, "imageLarge", void 0);
exports.ProfileImage = ProfileImage;
class ListAllPostsResponseDtoTemp {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ListAllPostsResponseDtoTemp.prototype, "postId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ListAllPostsResponseDtoTemp.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ListAllPostsResponseDtoTemp.prototype, "isLiked", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ListAllPostsResponseDtoTemp.prototype, "likes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: CreatedBy }),
    __metadata("design:type", CreatedBy)
], ListAllPostsResponseDtoTemp.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [TaggedAsset] }),
    __metadata("design:type", Array)
], ListAllPostsResponseDtoTemp.prototype, "taggedAssets", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [TaggedUser] }),
    __metadata("design:type", Array)
], ListAllPostsResponseDtoTemp.prototype, "taggedUsers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [MediaUrl] }),
    __metadata("design:type", Array)
], ListAllPostsResponseDtoTemp.prototype, "mediaUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ProfileImage] }),
    __metadata("design:type", ProfileImage)
], ListAllPostsResponseDtoTemp.prototype, "profileImage", void 0);
exports.ListAllPostsResponseDtoTemp = ListAllPostsResponseDtoTemp;
class ListAllPostsResponseDto extends ListAllPostsResponseDtoTemp {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: ListAllPostsResponseDtoTemp }),
    __metadata("design:type", ListAllPostsResponseDtoTemp)
], ListAllPostsResponseDto.prototype, "postShared", void 0);
exports.ListAllPostsResponseDto = ListAllPostsResponseDto;


/***/ }),
/* 117 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UploadAttachmentImageResponseDto = void 0;
const swagger_1 = __webpack_require__(7);
class UploadAttachmentImageResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UploadAttachmentImageResponseDto.prototype, "uploadUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UploadAttachmentImageResponseDto.prototype, "filePath", void 0);
exports.UploadAttachmentImageResponseDto = UploadAttachmentImageResponseDto;


/***/ }),
/* 118 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PostsService_1, _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PostsService = void 0;
const rxjs_1 = __webpack_require__(16);
const configuration_1 = __webpack_require__(10);
const database_service_1 = __webpack_require__(19);
const constants_1 = __webpack_require__(22);
const logging_service_1 = __webpack_require__(26);
const s3_service_1 = __webpack_require__(34);
const utils_service_1 = __webpack_require__(23);
const common_1 = __webpack_require__(4);
const config_1 = __webpack_require__(5);
const list_all_post_db_query_1 = __webpack_require__(119);
const list_comments_of_post_db_query_1 = __webpack_require__(120);
const list_likes_of_comment_db_query_1 = __webpack_require__(121);
const list_likes_of_post_db_query_1 = __webpack_require__(122);
const reverse_search_assets_posts_db_query_1 = __webpack_require__(123);
const reverse_search_hashtag_posts_db_query_1 = __webpack_require__(124);
const reverse_search_user_posts_db_query_1 = __webpack_require__(125);
const update_comment_like_db_query_1 = __webpack_require__(126);
const update_post_like_db_query_1 = __webpack_require__(127);
const list_all_post_response_dto_1 = __webpack_require__(116);
let PostsService = PostsService_1 = class PostsService {
    constructor(config, db, S3, logger) {
        this.config = config;
        this.db = db;
        this.S3 = S3;
        this.logger = logger;
        this.logger.setContext(PostsService_1.name);
    }
    create(userId, post) {
        var _a, _b, _c, _d;
        const valuesArray = [];
        const queriesArray = [];
        const arrayToSkip = [
            'mediaUrls',
            'taggedUsers',
            'hashtags',
            'taggedAssets',
        ];
        const columnToSkip = [
            'createdAt',
            'lastUpdated',
            'id',
            'isDeleted',
            'sharedPostId',
        ];
        const addSqlQuery = {};
        const { query, data } = utils_service_1.UtilsService.buildInsertQuery({
            tableName: 'posts_master',
            columnData: [post],
            keysToIgnore: [...arrayToSkip, ...columnToSkip],
            keysToReplace: {
                userId,
                isDeleted: false,
            },
            addSqlQuery,
            start: 1,
        });
        queriesArray.push(`ins_posts_master as (${query} RETURNING id)`);
        valuesArray.push(...data);
        if (post.sharedPostId) {
            const { query, data } = utils_service_1.UtilsService.buildInsertQuery({
                tableName: 'posts_shared',
                columnData: [{ sharedPostId: post.sharedPostId }],
                keysToIgnore: ['id', 'createdAt', 'lastUpdated', 'postId'],
                addSqlQuery: {
                    post_id: '(select id from ins_posts_master)',
                },
                start: valuesArray.length + 1,
            });
            queriesArray.push(`ins_posts_shared as (${query})`);
            valuesArray.push(...data);
        }
        if ((_a = post.mediaUrls) === null || _a === void 0 ? void 0 : _a.length) {
            const updatedMediaUrls = post.mediaUrls.map((mediaUrl) => {
                const { large, medium, original, small, thumbnail } = utils_service_1.UtilsService.generateImagUrlForAllSizes(mediaUrl);
                return {
                    image_org: original,
                    image_thumb: thumbnail,
                    image_small: small,
                    image_medium: medium,
                    image_large: large,
                };
            });
            const { query, data } = utils_service_1.UtilsService.buildInsertQuery({
                tableName: 'posts_media',
                columnData: updatedMediaUrls,
                keysToIgnore: ['id', 'createdAt', 'lastUpdated', 'postId'],
                addSqlQuery: {
                    post_id: '(select id from ins_posts_master)',
                },
                start: valuesArray.length + 1,
            });
            queriesArray.push(`ins_posts_media as (${query})`);
            valuesArray.push(...data);
        }
        if ((_b = post.taggedUsers) === null || _b === void 0 ? void 0 : _b.length) {
            const { query, data } = utils_service_1.UtilsService.buildInsertQuery({
                tableName: 'tagged_users',
                columnData: post.taggedUsers.map((x) => ({ userId: x })),
                keysToIgnore: ['id', 'createdAt', 'lastUpdated', 'postId'],
                addSqlQuery: {
                    post_id: '(select id from ins_posts_master)',
                    type: `'${constants_1.TAGGED_TYPE.post}'`,
                },
                start: valuesArray.length + 1,
            });
            queriesArray.push(`ins_tagged_users as (${query})`);
            valuesArray.push(...data);
        }
        if ((_c = post.hashtags) === null || _c === void 0 ? void 0 : _c.length) {
            const { data: createHashTagData, query: createHashTagQuery } = utils_service_1.UtilsService.buildInsertQuery({
                tableName: 'master_hashtags',
                columnData: post.hashtags.map((x) => ({ tagName: x })),
                keysToIgnore: [],
                keysToReplace: [],
                start: valuesArray.length + 1,
            });
            queriesArray.push(`
        ins_master_hashtag AS (
          ${createHashTagQuery}
              ON CONFLICT (tag_name)
                  DO NOTHING
                  RETURNING id
                  ),
                  
        select_hashtag_ids as (
          SELECT * FROM ins_master_hashtag
              UNION
            SELECT 
                id
            from 
                master_hashtags 
            where 
                tag_name in ( ${createHashTagData
                .map((x, i) => `$${valuesArray.length + i + 1}`)
                .join(', ')} )
          ),          
          ins_tagged_hashtags as (
            INSERT INTO tagged_hashtags (hashtag_id, post_id, type) 
            SELECT
                id, (select id from ins_posts_master) as post_id, 'post'
            FROM
                select_hashtag_ids
            RETURNING *
          )
        `);
            valuesArray.push(...createHashTagData);
        }
        if ((_d = post.taggedAssets) === null || _d === void 0 ? void 0 : _d.length) {
            const { data: createAssetMasterData, query: createAssetMasterQuery } = utils_service_1.UtilsService.buildInsertQuery({
                tableName: 'master_assets',
                columnData: post.taggedAssets.map((x) => ({ symbol: x })),
                keysToIgnore: [],
                keysToReplace: [],
                start: valuesArray.length + 1,
            });
            queriesArray.push(`
        ins_master_asset AS (
          ${createAssetMasterQuery}
              ON CONFLICT("symbol")
                DO NOTHING
                  RETURNING id
              ),    
          select_asset_ids as (
            SELECT * FROM ins_master_asset
                UNION
            SELECT id FROM master_assets
                  where 
              symbol in ( ${createAssetMasterData
                .map((x, i) => `$${valuesArray.length + i + 1}`)
                .join(', ')} )
          ),          
          ins_tagged_assets as (
            INSERT INTO tagged_assets (asset_id, post_id, type) 
            SELECT
                id, (select id from ins_posts_master) as post_id , 'post'
            FROM
                select_asset_ids
            RETURNING *
          )
        `);
            valuesArray.push(...createAssetMasterData);
        }
        return this.db
            .rawQuery(`WITH ${queriesArray.join(', ')} (select * from ins_posts_master) `, valuesArray, null)
            .pipe((0, rxjs_1.map)((res) => res[0]));
    }
    findAll(loggedInUserId, userId, queryParams) {
        let dbQuery = list_all_post_db_query_1.listAllPostsDbQuery;
        const { limit, offset } = queryParams;
        const data = [limit, offset, loggedInUserId];
        if (queryParams.filter) {
            const filterQuery = {
                all: '',
                one_day: `
        AND pm.created_at::date = current_date::date`,
                one_week: `
        AND pm.created_at BETWEEN
          NOW()::DATE-EXTRACT(DOW FROM NOW())::INTEGER - 7 
          AND NOW()::DATE-EXTRACT(DOW from NOW())::INTEGER`,
                one_month: `
        AND pm.created_at BETWEEN date_trunc('month', current_date)
              and current_date::date`,
            };
            dbQuery = dbQuery.replace('--FILTER_CONDITION', filterQuery[queryParams.filter]);
        }
        if (userId) {
            dbQuery = dbQuery.replace('-- user_where_condition', 'AND pm.user_id = $4');
            data.push(userId);
        }
        else {
            dbQuery = dbQuery.replace('--INNER_JOIN_FOLLOWER', 'INNER JOIN followers f on f.user_id = $3 AND pm.user_id = f.follower_id or pm.user_id = $3');
        }
        return this.db.rawQuery(dbQuery, data, list_all_post_response_dto_1.ListAllPostsResponseDto);
    }
    updatePost(userId, postId, updatePost) {
        var _a, _b, _c, _d;
        const valuesArray = [userId, postId];
        const queriesArray = [];
        const arrayToSkip = [
            'mediaUrls',
            'taggedUsers',
            'hashtags',
            'taggedAssets',
        ];
        const columnToSkip = [
            'createdAt',
            'lastUpdated',
            'id',
            'userId',
            'isDeleted',
        ];
        const addSQLQuery = {
            last_updated: 'current_timestamp',
        };
        const { query, data } = utils_service_1.UtilsService.buildUpdateQuery({
            tableName: 'posts_master',
            columnData: updatePost,
            keysToIgnore: [...arrayToSkip, ...columnToSkip],
            keysToReplace: { isDeleted: false },
            addSqlQuery: addSQLQuery,
            whereCondition: 'user_id = $1 and id = $2',
            start: 3,
        });
        queriesArray.push(`upd_posts_master as (${query} RETURNING id)`);
        valuesArray.push(...data);
        if (Array.isArray(updatePost.mediaUrls)) {
            queriesArray.push(`del_post_media as (DELETE from posts_media where post_id = $2)`);
            if ((_a = updatePost.mediaUrls) === null || _a === void 0 ? void 0 : _a.length) {
                const updatedMediaUrls = updatePost.mediaUrls.map((mediaUrl) => {
                    const { large, medium, original, small, thumbnail } = utils_service_1.UtilsService.generateImagUrlForAllSizes(mediaUrl);
                    return {
                        image_org: original,
                        image_thumb: thumbnail,
                        image_small: small,
                        image_medium: medium,
                        image_large: large,
                    };
                });
                const { query, data } = utils_service_1.UtilsService.buildInsertQuery({
                    tableName: 'posts_media',
                    columnData: updatedMediaUrls,
                    keysToIgnore: ['id', 'createdAt', 'lastUpdated', 'postId'],
                    addSqlQuery: {
                        post_id: '$2',
                    },
                    start: valuesArray.length + 1,
                });
                queriesArray.push(`ins_posts_media as (${query})`);
                valuesArray.push(...data);
            }
        }
        if (Array.isArray(updatePost.taggedUsers)) {
            queriesArray.push(`del_tagged_users as (DELETE from tagged_users where post_id = $2)`);
            if ((_b = updatePost.taggedUsers) === null || _b === void 0 ? void 0 : _b.length) {
                const { query, data } = utils_service_1.UtilsService.buildInsertQuery({
                    tableName: 'tagged_users',
                    columnData: updatePost.taggedUsers.map((x) => ({ userId: x })),
                    keysToIgnore: ['id', 'createdAt', 'lastUpdated', 'postId'],
                    addSqlQuery: {
                        post_id: '$2',
                        type: `'${constants_1.TAGGED_TYPE.post}'`,
                    },
                    start: valuesArray.length + 1,
                });
                queriesArray.push(`ins_tagged_users as (${query})`);
                valuesArray.push(...data);
            }
        }
        if (Array.isArray(updatePost.hashtags)) {
            queriesArray.push(`del_post_assets as (DELETE from tagged_hashtags where post_id = $2)`);
            if ((_c = updatePost.hashtags) === null || _c === void 0 ? void 0 : _c.length) {
                const { data: createHashTagData, query: createHashTagQuery } = utils_service_1.UtilsService.buildInsertQuery({
                    tableName: 'master_hashtags',
                    columnData: [...new Set(updatePost.hashtags)].map((x) => ({
                        tagName: x,
                    })),
                    keysToIgnore: [],
                    keysToReplace: [],
                    start: valuesArray.length + 1,
                });
                queriesArray.push(`
          ins_master_hashtag AS (
            ${createHashTagQuery}
                ON CONFLICT (tag_name)
                    DO NOTHING
                    RETURNING id
                    ),
          select_hashtag_ids as (
            SELECT * FROM ins_master_hashtag
                UNION
              SELECT 
                  id
              from 
                  master_hashtags 
              where 
                  tag_name in ( ${createHashTagData
                    .map((x, i) => `$${valuesArray.length + i + 1}`)
                    .join(', ')} )
            ),          
            ins_tagged_hashtags as (
              INSERT INTO tagged_hashtags (hashtag_id, post_id, type) 
              SELECT
                  id, $2 as post_id, 'post'
              FROM
                  select_hashtag_ids
              RETURNING *
            )
          `);
                valuesArray.push(...createHashTagData);
            }
        }
        if (Array.isArray(updatePost.taggedAssets)) {
            queriesArray.push(`del_post_assets as (DELETE from tagged_assets where post_id = $2)`);
            if ((_d = updatePost.taggedAssets) === null || _d === void 0 ? void 0 : _d.length) {
                const { data: createAssetMasterData, query: createAssetMasterQuery } = utils_service_1.UtilsService.buildInsertQuery({
                    tableName: 'master_assets',
                    columnData: [...new Set(updatePost.taggedAssets)].map((x) => ({
                        symbol: x,
                    })),
                    keysToIgnore: [],
                    keysToReplace: [],
                    start: valuesArray.length + 1,
                });
                queriesArray.push(`
          ins_master_asset AS (
            ${createAssetMasterQuery}
                ON CONFLICT("symbol")
                  DO NOTHING
                    RETURNING id
                ),    
            select_asset_ids as (
              SELECT * FROM ins_master_asset
                  UNION
              SELECT id FROM master_assets
                    where 
                symbol in ( ${createAssetMasterData
                    .map((x, i) => `$${valuesArray.length + i + 1}`)
                    .join(', ')} )
            ),          
            ins_tagged_assets as (
              INSERT INTO tagged_assets (asset_id, post_id, type) 
              SELECT
                  id, $2 as post_id , 'post'
              FROM
                  select_asset_ids
              RETURNING *
            )
          `);
                valuesArray.push(...createAssetMasterData);
            }
        }
        return this.db
            .rawQuery(`WITH ${queriesArray.join(', ')} select * from upd_posts_master`, valuesArray, null)
            .pipe((0, rxjs_1.map)((res) => res[0]));
    }
    deletePost(userId, postId) {
        return this.db
            .rawQuery(`UPDATE
          posts_master
      SET
          is_deleted = TRUE
      WHERE
          user_id = $1 AND id = $2
      RETURNING
          1 AS deleted
      `, [userId, postId], null)
            .pipe((0, rxjs_1.map)((x) => x[0] || {}));
    }
    getPreSignedUrlForAttachment(fileName, userId) {
        const fileSplit = fileName.split('.');
        return this.S3.getS3PreSignUrl({
            bucket: constants_1.S3_BUCKET,
            filename: `${Date.now()}_${fileSplit[0]}_o.${fileSplit[1]}`,
            path: `${constants_1.S3_FOLDER_POSTS_ATTACHMENT}`,
        }).pipe((0, rxjs_1.map)(({ filePath, uploadUrl }) => ({ filePath, uploadUrl })));
    }
    UpdateAttachmentUrls(filePath, userId) {
        const { large, medium, original, small, thumbnail } = utils_service_1.UtilsService.generateImagUrlForAllSizes(filePath);
        return this.db
            .rawQuery('updateProfileImageDbQuery', [userId, original, thumbnail, small, medium, large], null)
            .pipe((0, rxjs_1.map)((res) => { var _a; return (_a = res[0]) !== null && _a !== void 0 ? _a : {}; }));
    }
    updateLikeForPost(userId, postId, isDeleted) {
        const isDeletedStatus = isDeleted !== 'like';
        return this.db.rawQuery(update_post_like_db_query_1.UpdatePostLikeDbQuery, [postId, userId, isDeletedStatus], null);
    }
    getPostLikeUsers(postId, queryParams) {
        const { limit, offset } = queryParams;
        const data = [postId, offset, limit];
        return this.db.rawQuery(list_likes_of_post_db_query_1.listLikesOfPostDbQuery, data, list_all_post_response_dto_1.ListAllPostsResponseDto);
    }
    addCommentOnPost(userId, postId, postComment) {
        var _a, _b, _c;
        const valuesArray = [];
        const queriesArray = [];
        const arrayToSkip = ['taggedUsers', 'hashtags', 'taggedAssets'];
        const columnToSkip = ['createdAt', 'lastUpdated', 'id', 'isDeleted'];
        const addSqlQuery = {};
        const { query, data } = utils_service_1.UtilsService.buildInsertQuery({
            tableName: 'posts_comments',
            columnData: [postComment],
            keysToIgnore: [...arrayToSkip, ...columnToSkip],
            keysToReplace: {
                userId,
                postId,
                isDeleted: false,
            },
            addSqlQuery,
            start: 1,
        });
        queriesArray.push(`ins_posts_comment as (${query} RETURNING id)`);
        valuesArray.push(...data);
        if ((_a = postComment.taggedUsers) === null || _a === void 0 ? void 0 : _a.length) {
            const { query, data } = utils_service_1.UtilsService.buildInsertQuery({
                tableName: 'tagged_users',
                columnData: postComment.taggedUsers.map((x) => ({ userId: x })),
                keysToIgnore: ['id', 'createdAt', 'lastUpdated', 'postCommentId'],
                addSqlQuery: {
                    post_comment_id: '(select id from ins_posts_comment)',
                    type: `'${constants_1.TAGGED_TYPE.post_comment}'`,
                },
                start: valuesArray.length + 1,
            });
            queriesArray.push(`ins_tagged_users as (${query})`);
            valuesArray.push(...data);
        }
        if ((_b = postComment.hashtags) === null || _b === void 0 ? void 0 : _b.length) {
            const { data: createHashTagData, query: createHashTagQuery } = utils_service_1.UtilsService.buildInsertQuery({
                tableName: 'master_hashtags',
                columnData: postComment.hashtags.map((x) => ({ tagName: x })),
                keysToIgnore: [],
                keysToReplace: [],
                start: valuesArray.length + 1,
            });
            queriesArray.push(`
        ins_master_hashtag AS (
          ${createHashTagQuery}
              ON CONFLICT (tag_name)
                  DO NOTHING
                  RETURNING id
                  ),
                  
        select_hashtag_ids as (
          SELECT * FROM ins_master_hashtag
              UNION
            SELECT 
                id
            from 
                master_hashtags 
            where 
                tag_name in ( ${createHashTagData
                .map((x, i) => `$${valuesArray.length + i + 1}`)
                .join(', ')} )
          ),          
          ins_tagged_hashtags as (
            INSERT INTO tagged_hashtags (hashtag_id, post_comment_id, type) 
            SELECT
                id, (select id from ins_posts_comment) as post_comment_id, 'post_comment'
            FROM
                select_hashtag_ids
            RETURNING *
          )
        `);
            valuesArray.push(...createHashTagData);
        }
        if ((_c = postComment.taggedAssets) === null || _c === void 0 ? void 0 : _c.length) {
            const { data: createAssetMasterData, query: createAssetMasterQuery } = utils_service_1.UtilsService.buildInsertQuery({
                tableName: 'master_assets',
                columnData: [...new Set(postComment.taggedAssets)].map((x) => ({
                    symbol: x,
                })),
                keysToIgnore: [],
                keysToReplace: [],
                start: valuesArray.length + 1,
            });
            queriesArray.push(`
        ins_master_asset AS (
          ${createAssetMasterQuery}
              ON CONFLICT("symbol")
                DO NOTHING
                  RETURNING id
              ),    
          select_asset_ids as (
            SELECT * FROM ins_master_asset
                UNION
            SELECT id FROM master_assets
                  where 
              symbol in ( ${createAssetMasterData
                .map((x, i) => `$${valuesArray.length + i + 1}`)
                .join(', ')} )
          ),          
          ins_tagged_assets as (
            INSERT INTO tagged_assets (asset_id, post_comment_id, type) 
            SELECT
                id, (select id from ins_posts_comment) as post_comment_id , 'post_comment'
            FROM
                select_asset_ids
            RETURNING *
          )
        `);
            valuesArray.push(...createAssetMasterData);
        }
        return this.db
            .rawQuery(`WITH ${queriesArray.join(', ')} (select id from ins_posts_comment) `, valuesArray, null)
            .pipe((0, rxjs_1.map)((res) => res[0]), (0, rxjs_1.mergeMap)((x) => {
            return this.listCommentOfPost(postId, userId, { limit: 1, offset: 0 }, x.id);
        }), (0, rxjs_1.map)((res) => res[0]));
    }
    listCommentOfPost(postId, userId, query, commentId, getReplies = false) {
        const { limit, offset } = query;
        const data = [postId, userId, limit, offset];
        let dbQuery = list_comments_of_post_db_query_1.listCommentsOfPostDbQuery;
        if (!commentId) {
            dbQuery = dbQuery.replace('-- PARENT_COMMENT_ID', 'AND pc.parent_comment_id IS NULL');
        }
        else if (getReplies) {
            dbQuery = dbQuery.replace('-- PARENT_COMMENT_ID', 'AND pc.parent_comment_id = $5');
            data.push(commentId);
        }
        else {
            dbQuery = dbQuery.replace('-- PARENT_COMMENT_ID', 'AND pc.id = $5');
            data.push(commentId);
        }
        return this.db.rawQuery(dbQuery, data, null);
    }
    updateCommentOnPost(userId, commentId, postId, updatePostComment) {
        var _a, _b, _c;
        const valuesArray = [userId, postId, commentId];
        const queriesArray = [];
        const arrayToSkip = ['taggedUsers', 'hashtags', 'taggedAssets'];
        const columnToSkip = [
            'createdAt',
            'lastUpdated',
            'id',
            'userId',
            'postId',
            'isDeleted',
        ];
        const addSQLQuery = {
            last_updated: 'current_timestamp',
        };
        const { query, data } = utils_service_1.UtilsService.buildUpdateQuery({
            tableName: 'posts_comments',
            columnData: updatePostComment,
            keysToIgnore: [...arrayToSkip, ...columnToSkip],
            keysToReplace: { isDeleted: false },
            addSqlQuery: addSQLQuery,
            whereCondition: 'user_id = $1 and post_id = $2 and id = $3',
            start: 4,
        });
        queriesArray.push(`upd_posts_comment as (${query} RETURNING id)`);
        valuesArray.push(...data);
        if (Array.isArray(updatePostComment.taggedUsers)) {
            queriesArray.push(`del_tagged_users as (DELETE from tagged_users where post_comment_id = $3)`);
            if ((_a = updatePostComment.taggedUsers) === null || _a === void 0 ? void 0 : _a.length) {
                const { query, data } = utils_service_1.UtilsService.buildInsertQuery({
                    tableName: 'tagged_users',
                    columnData: updatePostComment.taggedUsers.map((x) => ({ userId: x })),
                    keysToIgnore: ['id', 'createdAt', 'lastUpdated', 'postCommentId'],
                    addSqlQuery: {
                        post_comment_id: '$3',
                        type: `'${constants_1.TAGGED_TYPE.post_comment}'`,
                    },
                    start: valuesArray.length + 1,
                });
                queriesArray.push(`ins_tagged_users as (${query})`);
                valuesArray.push(...data);
            }
        }
        if (Array.isArray(updatePostComment.hashtags)) {
            queriesArray.push(`del_comment_assets as (DELETE from tagged_hashtags where post_comment_id = $3)`);
            if ((_b = updatePostComment.hashtags) === null || _b === void 0 ? void 0 : _b.length) {
                const { data: createHashTagData, query: createHashTagQuery } = utils_service_1.UtilsService.buildInsertQuery({
                    tableName: 'master_hashtags',
                    columnData: updatePostComment.hashtags.map((x) => ({ tagName: x })),
                    keysToIgnore: [],
                    keysToReplace: [],
                    start: valuesArray.length + 1,
                });
                queriesArray.push(`
          ins_master_hashtag AS (
            ${createHashTagQuery}
                ON CONFLICT (tag_name)
                    DO NOTHING
                    RETURNING id
                    ),
          select_hashtag_ids as (
            SELECT * FROM ins_master_hashtag
                UNION
              SELECT 
                  id
              from 
                  master_hashtags 
              where 
                  tag_name in ( ${createHashTagData
                    .map((x, i) => `$${valuesArray.length + i + 1}`)
                    .join(', ')} )
            ),          
            ins_tagged_hashtags as (
              INSERT INTO tagged_hashtags (hashtag_id, post_comment_id, type) 
              SELECT
                  id, $3, 'post_comment'
              FROM
                  select_hashtag_ids
              RETURNING *
            )
          `);
                valuesArray.push(...createHashTagData);
            }
        }
        if (Array.isArray(updatePostComment.taggedAssets)) {
            queriesArray.push(`del_post_assets as (DELETE from tagged_assets where post_comment_id = $3)`);
            if ((_c = updatePostComment.taggedAssets) === null || _c === void 0 ? void 0 : _c.length) {
                const { data: createAssetMasterData, query: createAssetMasterQuery } = utils_service_1.UtilsService.buildInsertQuery({
                    tableName: 'master_assets',
                    columnData: [...new Set(updatePostComment.taggedAssets)].map((x) => ({
                        symbol: x,
                    })),
                    keysToIgnore: [],
                    keysToReplace: [],
                    start: valuesArray.length + 1,
                });
                queriesArray.push(`
          ins_master_asset AS (
            ${createAssetMasterQuery}
                ON CONFLICT("symbol")
                  DO NOTHING
                    RETURNING id
                ),    
            select_asset_ids as (
              SELECT * FROM ins_master_asset
                  UNION
              SELECT id FROM master_assets
                    where 
                symbol in ( ${createAssetMasterData
                    .map((x, i) => `$${valuesArray.length + i + 1}`)
                    .join(', ')} )
            ),          
            ins_tagged_assets as (
              INSERT INTO tagged_assets (asset_id, post_comment_id, type) 
              SELECT
                  id, $3, 'post_comment'
              FROM
                  select_asset_ids
              RETURNING *
            )
          `);
                valuesArray.push(...createAssetMasterData);
            }
        }
        return this.db
            .rawQuery(`WITH ${queriesArray.join(', ')} (select id from upd_posts_comment) `, valuesArray, null)
            .pipe((0, rxjs_1.map)((res) => res[0]), (0, rxjs_1.mergeMap)((x) => {
            return this.listCommentOfPost(postId, userId, { limit: 1, offset: 0 }, x.id);
        }), (0, rxjs_1.map)((res) => res[0]));
    }
    deleteCommentOnPost(userId, postId, commentId) {
        return this.db
            .rawQuery(`UPDATE
          posts_comments
      SET
          is_deleted = TRUE
      WHERE
          user_id = $1 AND post_id =$2 AND id = $3
      RETURNING
          1 AS deleted
      `, [userId, postId, commentId], null)
            .pipe((0, rxjs_1.map)((x) => x[0] || {}));
    }
    updateLikeForCommentOnPost(userId, postId, commentId, isDeleted) {
        const isDeletedStatus = isDeleted !== 'like';
        return this.db.rawQuery(update_comment_like_db_query_1.UpdateCommentOnPostLikeDbQuery, [commentId, userId, isDeletedStatus], null);
    }
    getLikeForCommentOnPost(commentId, queryParams) {
        const { limit, offset } = queryParams;
        const data = [commentId, offset, limit];
        return this.db.rawQuery(list_likes_of_comment_db_query_1.listLikesOfCommentOnPostDbQuery, data, list_all_post_response_dto_1.ListAllPostsResponseDto);
    }
    getPostsWhichTagged(queryParams, type, value, userId) {
        const { limit, offset } = queryParams;
        const data = [limit, offset];
        let dbQuery;
        if (type === 'hashtag') {
            data.push(value, userId);
            dbQuery = reverse_search_hashtag_posts_db_query_1.reverseSearchHashtagWithDbQuery;
        }
        else if (type === 'asset') {
            data.push(value, userId);
            dbQuery = reverse_search_assets_posts_db_query_1.reverseSearchAssetsWithDbQuery;
        }
        else if (type === 'user') {
            data.push(Number(value), userId);
            dbQuery = reverse_search_user_posts_db_query_1.reverseSearchUsersWithDbQuery;
        }
        return this.db.rawQuery(dbQuery, data, list_all_post_response_dto_1.ListAllPostsResponseDto);
    }
};
PostsService = PostsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(configuration_1.default.KEY)),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigType !== "undefined" && config_1.ConfigType) === "function" ? _a : Object, typeof (_b = typeof database_service_1.DatabaseService !== "undefined" && database_service_1.DatabaseService) === "function" ? _b : Object, typeof (_c = typeof s3_service_1.S3Service !== "undefined" && s3_service_1.S3Service) === "function" ? _c : Object, typeof (_d = typeof logging_service_1.Logger !== "undefined" && logging_service_1.Logger) === "function" ? _d : Object])
], PostsService);
exports.PostsService = PostsService;


/***/ }),
/* 119 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.listAllPostsDbQuery = void 0;
exports.listAllPostsDbQuery = `
select pm.id                                                           as post_id,
       pm.content                                                      as content,
       extract(epoch from pm.created_at::timestamptz(0))               as created_at,
       count(DISTINCT pl.id) FILTER (WHERE pl.id IS NOT NULL)::integer as likes,
       count(DISTINCT pc.id) FILTER (WHERE pc.id IS NOT NULL)::integer as comments,
       case when pl2.id is not null then true else false end           as is_liked,
       case
           when ps.id is not null then (
               select jsonb_build_object(
                              'post_id', pm5.id,
                              'content', pm5.content,
                              'likes', count(DISTINCT pl5.id) FILTER (WHERE pl5.id IS NOT NULL)::integer,
                              'comments', count(DISTINCT pc1.id) FILTER (WHERE pc1.id IS NOT NULL)::integer,
                              'is_liked', case when pl6.id is not null then true else false end,
                              'created_at', extract(epoch from pm5.created_at::timestamptz(0)),
                              'created_by', jsonb_build_object(
                                      'user_id', uc6.id,
                                      'user_handle', uc6.user_handle,
                                      'first_name', up6.first_name,
                                      'last_name', up6.last_name,
                                      'is_following', case when f.id is not null then true else false end,
                                      'profile_image',        json_build_object('image_org', pm7.image_org,
                                      'image_thumb', pm7.image_thumb,
                                      'image_small', pm7.image_small,
                                      'image_medium', pm7.image_medium,
                                      'image_large', pm7.image_large)
                                  ),
                              'tagged_assets', json_agg(
                                               DISTINCT jsonb_build_object(
                                                       'asset_id', ta5.asset_id,
                                                       'symbol', ma5.symbol)
                                  ) FILTER (WHERE ta5.asset_id IS NOT NULL),
                              'tagged_users', json_agg(
                                              DISTINCT jsonb_build_object(
                                                      'user_id', uc5.id,
                                                      'user_handle', uc5.user_handle,
                                                      'first_name', up5.first_name,
                                                      'last_name', up5.last_name)
                                  ) FILTER (WHERE uc5.id IS NOT NULL),
                              'media_url', json_agg(
                                           DISTINCT jsonb_build_object(
                                                   'image_org', pm6.image_org,
                                                   'image_thumb', pm6.image_thumb,
                                                   'image_small', pm6.image_small,
                                                   'image_medium', pm6.image_medium,
                                                   'image_large', pm6.image_large)
                                  ) FILTER (WHERE pm6.id IS NOT NULL)
                          )
               from posts_master pm5
                        left join posts_media pm6 on pm5.id = pm6.post_id
                        left join tagged_users tu on pm5.id = tu.post_id
                        left join user_core uc5 on uc5.id = tu.user_id
                        left join user_profile up5 on uc5.id = up5.user_id
                        left join user_core uc6 on uc6.id = pm5.user_id
                        left join user_profile up6 on uc6.id = up6.user_id
                        LEFT JOIN profile_media pm7 ON pm7.user_id = uc6.id
                        LEFT JOIN followers f ON f.user_id = $3 and f.follower_id = uc6.id 
                        left join tagged_assets ta5 on ta5.post_id = pm5.id and ta5.type = 'post'
                        left join master_assets ma5 on ta5.asset_id = ma5.id
                        left join posts_likes pl5 on pl5.post_id = pm5.id AND pl5.is_deleted = FALSE
                        left join posts_likes pl6
                                  on pl6.post_id = pm5.id AND pl6.is_deleted = FALSE AND pl6.user_id = $3
                        left join posts_comments pc1
                                  on pc1.post_id = pm5.id AND pc1.is_deleted = FALSE AND pc1.parent_comment_id is NULL
               WHERE pm5.is_deleted = FALSE
                 AND pm5.id = ps.shared_post_id
                    group by pm5.id, uc6.id, uc5.user_handle, up6.first_name, up6.last_name, pl6.id, ps.id, f.id, pm7.image_org,
                    pm7.image_large,
                    pm7.image_thumb,
                    pm7.image_small,
                    pm7.image_medium,
                    pm7.image_large
                    LIMIT 1
           )
           else '{}'::jsonb
           end                                                         as post_shared,
       jsonb_build_object(
               'user_id', uc2.id,
               'user_handle', uc2.user_handle,
               'first_name', up2.first_name,
               'last_name', up2.last_name,
               'is_following', case when f2.id is not null then true else false end,
               'profile_image',        json_build_object('image_org', pm5.image_org,
               'image_thumb', pm5.image_thumb,
               'image_small', pm5.image_small,
               'image_medium', pm5.image_medium,
               'image_large', pm5.image_large)
           )                                                           as created_by,
       json_agg(
       DISTINCT jsonb_build_object(
               'asset_id', ta.asset_id,
               'symbol', ma.symbol)
           ) FILTER (WHERE ta.asset_id IS NOT NULL)                    AS tagged_assets,
       json_agg(
       DISTINCT jsonb_build_object(
               'user_id', uc.id,
               'user_handle', uc.user_handle,
               'first_name', up.first_name,
               'last_name', up.last_name)
           ) FILTER (WHERE uc.id IS NOT NULL)                          AS tagged_users,
       json_agg(
       DISTINCT jsonb_build_object(
               'image_org', pm2.image_org,
               'image_thumb', pm2.image_thumb,
               'image_small', pm2.image_small,
               'image_medium', pm2.image_medium,
               'image_large', pm2.image_large)
           ) FILTER (WHERE pm2.id IS NOT NULL)                         AS media_url
from posts_master pm
         --INNER_JOIN_FOLLOWER
         --INNER_JOIN_SAVED_ITEMS
         left join posts_shared ps on pm.id = ps.post_id
         left join posts_media pm2 on pm.id = pm2.post_id
         left join tagged_users tu on pm.id = tu.post_id
         left join user_core uc on uc.id = tu.user_id
         left join user_profile up on uc.id = up.user_id
         left join user_core uc2 on uc2.id = pm.user_id
         left join user_profile up2 on uc2.id = up2.user_id
         LEFT JOIN profile_media pm5 ON pm5.user_id = uc2.id
         LEFT JOIN followers f2 ON f2.user_id = $3 and f2.follower_id = uc2.id 
         left join tagged_assets ta on ta.post_id = pm.id and ta.type = 'post'
         left join master_assets ma on ta.asset_id = ma.id
         left join posts_likes pl on pl.post_id = pm.id AND pl.is_deleted = FALSE
         left join posts_likes pl2 on pl2.post_id = pm.id AND pl2.is_deleted = FALSE AND pl2.user_id = $3
         left join posts_comments pc on pc.post_id = pm.id AND pc.is_deleted = FALSE AND pc.parent_comment_id is NULL
WHERE pm.is_deleted = FALSE 
-- user_where_condition 
--FILTER_CONDITION
group by pm.id, uc2.id, uc2.user_handle, up2.first_name, up2.last_name, pl2.id, ps.id, f2.id, pm5.image_org,
pm5.image_large,
pm5.image_thumb,
pm5.image_small,
pm5.image_medium,
pm5.image_large
--GROUP_BY_SAVED
ORDER BY pm.last_updated DESC
OFFSET $2
LIMIT $1;
`;


/***/ }),
/* 120 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.listCommentsOfPostDbQuery = void 0;
exports.listCommentsOfPostDbQuery = `
WITH replies_for_comments as (
    select 1                                                               as temp,
           pc.id                                                           as comment_id,
           pc.comment                                                      as comment,
           pc.post_id                                                      as post_id,
           pc.parent_comment_id                                            as parent_comment_id,
           count(DISTINCT cl.id) FILTER (WHERE cl.id IS NOT NULL)::integer as likes,
           case when cl2.id is not null then true else false end           as is_liked,
           jsonb_build_object(
                   'user_id', uc2.id,
                   'user_handle', uc2.user_handle,
                   'first_name', up2.first_name,
                   'last_name', up2.last_name,
                   'profile_image',        json_build_object('image_org', pm7.image_org,
                                      'image_thumb', pm7.image_thumb,
                                      'image_small', pm7.image_small,
                                      'image_medium', pm7.image_medium,
                                      'image_large', pm7.image_large)
               )                                                           as created_by,
           json_agg(
           DISTINCT jsonb_build_object(
                   'asset_id', ta.asset_id,
                   'symbol', ma.symbol)
               )
           FILTER (WHERE ta.asset_id IS NOT NULL)                          AS tagged_assets,
           json_agg(
           DISTINCT jsonb_build_object(
                   'user_id', uc.id,
                   'user_handle', uc.user_handle,
                   'first_name', up.first_name,
                   'last_name', up.last_name)
               )
           FILTER (WHERE uc.id IS NOT NULL)                                AS tagged_users
    from posts_comments pc
             left join posts_comments pcc ON pc.id = pcc.parent_comment_id and pcc.is_deleted = FALSE
             left join tagged_users tu on pc.id = tu.post_comment_id and tu.type = 'post_comment'
             left join user_core uc on uc.id = tu.user_id
             left join user_profile up on uc.id = up.user_id
             left join user_core uc2 on uc2.id = pc.user_id
             left join user_profile up2 on uc2.id = up2.user_id
             LEFT JOIN profile_media pm7 ON pm7.user_id = uc2.id
             left join tagged_assets ta on ta.post_comment_id = pc.id and ta.type = 'post_comment'
             left join master_assets ma on ta.asset_id = ma.id
             left join comment_likes cl on cl.post_comment_id = pc.id AND cl.is_deleted = FALSE
             left join comment_likes cl2 on cl2.post_comment_id = pc.id AND cl2.is_deleted = FALSE AND cl2.user_id = $2
    WHERE pc.is_deleted = FALSE
      AND pc.post_id = $1
      AND pc.parent_comment_id IS NOT NULL
    group by pc.id, pc.comment, pc.parent_comment_id, uc2.id, uc2.user_handle, up2.first_name, up2.last_name, cl2.id, pm7.image_org,
    pm7.image_large,
    pm7.image_thumb,
    pm7.image_small,
    pm7.image_medium,
    pm7.image_large
    ORDER BY pc.last_updated DESC
)
select pc.id                                                           as comment_id,
       pc.comment                                                      as comment,
       pc.post_id                                                      as post_id,
       count(DISTINCT cl.id) FILTER (WHERE cl.id IS NOT NULL)::integer as likes,
       case when cl2.id is not null then true else false end           as is_liked,
       (
           SELECT count(*)::integer
           from replies_for_comments
           where pc.id = replies_for_comments.parent_comment_id
       )                                                               as replies_count,
       (
           SELECT json_agg(row_to_json(replies_for_comments))
           from replies_for_comments
           where pc.id = replies_for_comments.parent_comment_id
           LIMIT 2
       )                                                               as replies,
       jsonb_build_object(
               'user_id', uc2.id,
               'user_handle', uc2.user_handle,
               'first_name', up2.first_name,
               'last_name', up2.last_name,
               'profile_image',        json_build_object('image_org', pm5.image_org,
                                      'image_thumb', pm5.image_thumb,
                                      'image_small', pm5.image_small,
                                      'image_medium', pm5.image_medium,
                                      'image_large', pm5.image_large)
           )                                                           as created_by,
       json_agg(
       DISTINCT jsonb_build_object(
               'asset_id', ta.asset_id,
               'symbol', ma.symbol)
           )
       FILTER (WHERE ta.asset_id IS NOT NULL)                          AS tagged_assets,
       json_agg(
       DISTINCT jsonb_build_object(
               'user_id', uc.id,
               'user_handle', uc.user_handle,
               'first_name', up.first_name,
               'last_name', up.last_name)
           )
       FILTER (WHERE uc.id IS NOT NULL)                                AS tagged_users
from posts_comments pc
         left join posts_comments pcc ON pc.id = pcc.parent_comment_id and pcc.is_deleted = FALSE
         left join tagged_users tu on pc.id = tu.post_comment_id and tu.type = 'post_comment'
         left join user_core uc on uc.id = tu.user_id
         left join user_profile up on uc.id = up.user_id
         left join user_core uc2 on uc2.id = pc.user_id
         left join user_profile up2 on uc2.id = up2.user_id
         LEFT JOIN profile_media pm5 ON pm5.user_id = uc2.id
         left join tagged_assets ta on ta.post_comment_id = pc.id and ta.type = 'post_comment'
         left join master_assets ma on ta.asset_id = ma.id
         left join comment_likes cl on cl.post_comment_id = pc.id AND cl.is_deleted = FALSE
         left join comment_likes cl2 on cl2.post_comment_id = pc.id AND cl2.is_deleted = FALSE AND cl2.user_id = $2
         left join replies_for_comments on replies_for_comments.temp = 1
WHERE pc.is_deleted = FALSE
  AND pc.post_id = $1 
  -- PARENT_COMMENT_ID
group by pc.id, pc.comment, uc2.id, uc2.user_handle, up2.first_name, up2.last_name, cl2.id, pm5.image_org,
pm5.image_large,
pm5.image_thumb,
pm5.image_small,
pm5.image_medium,
pm5.image_large
ORDER BY pc.last_updated DESC
LIMIT $3 OFFSET $4;
`;


/***/ }),
/* 121 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.listLikesOfCommentOnPostDbQuery = void 0;
exports.listLikesOfCommentOnPostDbQuery = `
SELECT uc.id                   as user_id,
       uc.user_handle          as user_handle,
       up.first_name           as first_name,
       up.last_name            as last_name,
       jsonb_build_object(
               'image_org', pm.image_org, 'image_thumb', pm.image_thumb, 'image_small',
               pm.image_small, 'image_medium', pm.image_medium, 'image_large',
               pm.image_large) as profile_image
FROM comment_likes cl
         LEFT JOIN user_core uc ON uc.id = cl.user_id
         LEFT JOIN user_profile up ON uc.id = up.user_id
         LEFT JOIN profile_media pm ON pm.user_id = uc.id
WHERE post_comment_id = $1 AND cl.is_deleted IS NOT TRUE
group by cl.last_updated, uc.id, uc.id, uc.user_handle, up.first_name, up.last_name,
         pm.image_org, pm.image_thumb, pm.image_small, pm.image_medium,
         pm.image_large
ORDER BY cl.last_updated DESC
OFFSET $2
LIMIT $3
`;


/***/ }),
/* 122 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.listLikesOfPostDbQuery = void 0;
exports.listLikesOfPostDbQuery = `
SELECT uc.id                   as user_id,
       uc.user_handle          as user_handle,
       up.first_name           as first_name,
       up.last_name            as last_name,
       jsonb_build_object(
               'image_org', pm.image_org, 'image_thumb', pm.image_thumb, 'image_small',
               pm.image_small, 'image_medium', pm.image_medium, 'image_large',
               pm.image_large) as profile_image
FROM posts_likes pl
         LEFT JOIN user_core uc ON uc.id = pl.user_id
         LEFT JOIN user_profile up ON uc.id = up.user_id
         LEFT JOIN profile_media pm ON pm.user_id = uc.id
WHERE post_id = $1 AND pl.is_deleted = FALSE
group by pl.last_updated, uc.id, uc.id, uc.user_handle, up.first_name, up.last_name,
         pm.image_org, pm.image_thumb, pm.image_small, pm.image_medium,
         pm.image_large
ORDER BY pl.last_updated DESC
OFFSET $2
LIMIT $3
`;


/***/ }),
/* 123 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.reverseSearchAssetsWithDbQuery = void 0;
exports.reverseSearchAssetsWithDbQuery = `
WITH posts_ids as (
    SELECT DISTINCT pm.id, pm.last_updated
    from tagged_assets ta
             LEFT JOIN posts_master pm on pm.id = ta.post_id
             INNER JOIN master_assets mh on mh.id = ta.asset_id and mh.symbol = $3::text
    where post_id is not null
    ORDER BY pm.last_updated
)
select pm.id                                                           as post_id,
       pm.content                                                      as content,
       count(DISTINCT pl.id) FILTER (WHERE pl.id IS NOT NULL)::integer as likes,
       count(DISTINCT pc.id) FILTER (WHERE pc.id IS NOT NULL)::integer as comments,
       case when pl2.id is not null then true else false end           as is_liked,
       case
           when ps.id is not null then (
               select jsonb_build_object(
                              'post_id', pm5.id,
                              'content', pm5.content,
                              'likes', count(DISTINCT pl5.id) FILTER (WHERE pl5.id IS NOT NULL)::integer,
                              'comments', count(DISTINCT pc1.id) FILTER (WHERE pc1.id IS NOT NULL)::integer,
                              'is_liked', case when pl6.id is not null then true else false end,
                              'created_by', jsonb_build_object(
                                      'user_id', uc6.id,
                                      'user_handle', uc6.user_handle,
                                      'first_name', up6.first_name,
                                      'last_name', up6.last_name
                                  ),
                              'tagged_assets', json_agg(
                                               DISTINCT jsonb_build_object(
                                                       'asset_id', ta5.asset_id,
                                                       'symbol', ma5.symbol)
                                  ) FILTER (WHERE ta5.asset_id IS NOT NULL),
                              'tagged_users', json_agg(
                                              DISTINCT jsonb_build_object(
                                                      'user_id', uc5.id,
                                                      'user_handle', uc5.user_handle,
                                                      'first_name', up5.first_name,
                                                      'last_name', up5.last_name)
                                  ) FILTER (WHERE uc5.id IS NOT NULL),
                              'media_url', json_agg(
                                           DISTINCT jsonb_build_object(
                                                   'image_org', pm6.image_org,
                                                   'image_thumb', pm6.image_thumb,
                                                   'image_small', pm6.image_small,
                                                   'image_medium', pm6.image_medium,
                                                   'image_large', pm6.image_large)
                                  ) FILTER (WHERE pm6.id IS NOT NULL)
                          )
               from posts_master pm5
                        left join posts_media pm6 on pm5.id = pm6.post_id
                        left join tagged_users tu on pm5.id = tu.post_id
                        left join user_core uc5 on uc5.id = tu.user_id
                        left join user_profile up5 on uc5.id = up5.user_id
                        left join user_core uc6 on uc6.id = pm5.user_id
                        left join user_profile up6 on uc6.id = up6.user_id
                        left join tagged_assets ta5 on ta5.post_id = pm5.id and ta5.type = 'post'
                        left join master_assets ma5 on ta5.asset_id = ma5.id
                        left join posts_likes pl5 on pl5.post_id = pm5.id AND pl5.is_deleted = FALSE
                        left join posts_likes pl6
                                  on pl6.post_id = pm5.id AND pl6.is_deleted = FALSE AND pl6.user_id = $4
                        left join posts_comments pc1
                                  on pc1.post_id = pm5.id AND pc1.is_deleted = FALSE AND pc1.parent_comment_id is NULL
               WHERE pm5.is_deleted = FALSE
                 AND pm5.id = ps.shared_post_id
                    group by pm5.id, uc6.id, uc5.user_handle, up6.first_name, up6.last_name, pl6.id, ps.id
           )
           else '{}'::jsonb
           end                                                         as post_shared,
       jsonb_build_object(
               'user_id', uc2.id,
               'user_handle', uc2.user_handle,
               'first_name', up2.first_name,
               'last_name', up2.last_name
           )                                                           as created_by,
       json_agg(
       DISTINCT jsonb_build_object(
               'asset_id', ta.asset_id,
               'symbol', ma.symbol)
           ) FILTER (WHERE ta.asset_id IS NOT NULL)                    AS tagged_assets,
       json_agg(
       DISTINCT jsonb_build_object(
               'user_id', uc.id,
               'user_handle', uc.user_handle,
               'first_name', up.first_name,
               'last_name', up.last_name)
           ) FILTER (WHERE uc.id IS NOT NULL)                          AS tagged_users,
       json_agg(
       DISTINCT jsonb_build_object(
               'image_org', pm2.image_org,
               'image_thumb', pm2.image_thumb,
               'image_small', pm2.image_small,
               'image_medium', pm2.image_medium,
               'image_large', pm2.image_large)
           ) FILTER (WHERE pm2.id IS NOT NULL)                         AS media_url
from posts_master pm
         left join posts_shared ps on pm.id = ps.post_id
         left join posts_media pm2 on pm.id = pm2.post_id
         left join tagged_users tu on pm.id = tu.post_id
         left join user_core uc on uc.id = tu.user_id
         left join user_profile up on uc.id = up.user_id
         left join user_core uc2 on uc2.id = pm.user_id
         left join user_profile up2 on uc2.id = up2.user_id
         left join tagged_assets ta on ta.post_id = pm.id and ta.type = 'post'
         left join master_assets ma on ta.asset_id = ma.id
         left join posts_likes pl on pl.post_id = pm.id AND pl.is_deleted = FALSE
         left join posts_likes pl2 on pl2.post_id = pm.id AND pl2.is_deleted = FALSE AND pl2.user_id = $4
         left join posts_comments pc on pc.post_id = pm.id AND pc.is_deleted = FALSE AND pc.parent_comment_id is NULL
WHERE pm.is_deleted = FALSE -- user_where_condition 
AND pm.id IN ( SELECT id from posts_ids)
group by pm.id, uc2.id, uc2.user_handle, up2.first_name, up2.last_name, pl2.id, ps.id
ORDER BY pm.last_updated DESC
OFFSET $2
LIMIT $1
`;


/***/ }),
/* 124 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.reverseSearchHashtagWithDbQuery = void 0;
exports.reverseSearchHashtagWithDbQuery = `
WITH posts_ids as (
    SELECT DISTINCT pm.id, mh.tag_name
    from tagged_hashtags th
             LEFT JOIN posts_master pm on pm.id = th.post_id
             INNER JOIN master_hashtags mh on mh.id = th.hashtag_id and mh.tag_name = $3
    where post_id is not null
    ORDER BY pm.last_updated
)
select pm.id                                                           as post_id,
       pm.content                                                      as content,
       count(DISTINCT pl.id) FILTER (WHERE pl.id IS NOT NULL)::integer as likes,
       count(DISTINCT pc.id) FILTER (WHERE pc.id IS NOT NULL)::integer as comments,
       case when pl2.id is not null then true else false end           as is_liked,
       case
           when ps.id is not null then (
               select jsonb_build_object(
                              'post_id', pm5.id,
                              'content', pm5.content,
                              'likes', count(DISTINCT pl5.id) FILTER (WHERE pl5.id IS NOT NULL)::integer,
                              'comments', count(DISTINCT pc1.id) FILTER (WHERE pc1.id IS NOT NULL)::integer,
                              'is_liked', case when pl6.id is not null then true else false end,
                              'created_by', jsonb_build_object(
                                      'user_id', uc6.id,
                                      'user_handle', uc6.user_handle,
                                      'first_name', up6.first_name,
                                      'last_name', up6.last_name
                                  ),
                              'tagged_assets', json_agg(
                                               DISTINCT jsonb_build_object(
                                                       'asset_id', ta5.asset_id,
                                                       'symbol', ma5.symbol)
                                  ) FILTER (WHERE ta5.asset_id IS NOT NULL),
                              'tagged_users', json_agg(
                                              DISTINCT jsonb_build_object(
                                                      'user_id', uc5.id,
                                                      'user_handle', uc5.user_handle,
                                                      'first_name', up5.first_name,
                                                      'last_name', up5.last_name)
                                  ) FILTER (WHERE uc5.id IS NOT NULL),
                              'media_url', json_agg(
                                           DISTINCT jsonb_build_object(
                                                   'image_org', pm6.image_org,
                                                   'image_thumb', pm6.image_thumb,
                                                   'image_small', pm6.image_small,
                                                   'image_medium', pm6.image_medium,
                                                   'image_large', pm6.image_large)
                                  ) FILTER (WHERE pm6.id IS NOT NULL)
                          )
               from posts_master pm5
                        left join posts_media pm6 on pm5.id = pm6.post_id
                        left join tagged_users tu on pm5.id = tu.post_id
                        left join user_core uc5 on uc5.id = tu.user_id
                        left join user_profile up5 on uc5.id = up5.user_id
                        left join user_core uc6 on uc6.id = pm5.user_id
                        left join user_profile up6 on uc6.id = up6.user_id
                        left join tagged_assets ta5 on ta5.post_id = pm5.id and ta5.type = 'post'
                        left join master_assets ma5 on ta5.asset_id = ma5.id
                        left join posts_likes pl5 on pl5.post_id = pm5.id AND pl5.is_deleted = FALSE
                        left join posts_likes pl6
                                  on pl6.post_id = pm5.id AND pl6.is_deleted = FALSE AND pl6.user_id = $4
                        left join posts_comments pc1
                                  on pc1.post_id = pm5.id AND pc1.is_deleted = FALSE AND pc1.parent_comment_id is NULL
               WHERE pm5.is_deleted = FALSE
                 AND pm5.id = ps.shared_post_id
                    group by pm5.id, uc6.id, uc5.user_handle, up6.first_name, up6.last_name, pl6.id, ps.id
           )
           else '{}'::jsonb
           end                                                         as post_shared,
       jsonb_build_object(
               'user_id', uc2.id,
               'user_handle', uc2.user_handle,
               'first_name', up2.first_name,
               'last_name', up2.last_name
           )                                                           as created_by,
       json_agg(
       DISTINCT jsonb_build_object(
               'asset_id', ta.asset_id,
               'symbol', ma.symbol)
           ) FILTER (WHERE ta.asset_id IS NOT NULL)                    AS tagged_assets,
       json_agg(
       DISTINCT jsonb_build_object(
               'user_id', uc.id,
               'user_handle', uc.user_handle,
               'first_name', up.first_name,
               'last_name', up.last_name)
           ) FILTER (WHERE uc.id IS NOT NULL)                          AS tagged_users,
       json_agg(
       DISTINCT jsonb_build_object(
               'image_org', pm2.image_org,
               'image_thumb', pm2.image_thumb,
               'image_small', pm2.image_small,
               'image_medium', pm2.image_medium,
               'image_large', pm2.image_large)
           ) FILTER (WHERE pm2.id IS NOT NULL)                         AS media_url
from posts_master pm
         left join posts_shared ps on pm.id = ps.post_id
         left join posts_media pm2 on pm.id = pm2.post_id
         left join tagged_users tu on pm.id = tu.post_id
         left join user_core uc on uc.id = tu.user_id
         left join user_profile up on uc.id = up.user_id
         left join user_core uc2 on uc2.id = pm.user_id
         left join user_profile up2 on uc2.id = up2.user_id
         left join tagged_assets ta on ta.post_id = pm.id and ta.type = 'post'
         left join master_assets ma on ta.asset_id = ma.id
         left join posts_likes pl on pl.post_id = pm.id AND pl.is_deleted = FALSE
         left join posts_likes pl2 on pl2.post_id = pm.id AND pl2.is_deleted = FALSE AND pl2.user_id = $4
         left join posts_comments pc on pc.post_id = pm.id AND pc.is_deleted = FALSE AND pc.parent_comment_id is NULL
WHERE pm.is_deleted = FALSE -- user_where_condition
AND pm.id IN ( SELECT id from posts_ids) 
group by pm.id, uc2.id, uc2.user_handle, up2.first_name, up2.last_name, pl2.id, ps.id
ORDER BY pm.last_updated DESC
OFFSET $2
LIMIT $1
`;


/***/ }),
/* 125 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.reverseSearchUsersWithDbQuery = void 0;
exports.reverseSearchUsersWithDbQuery = `
WITH posts_ids as (
    SELECT DISTINCT pm.id, pm.last_updated
    from tagged_users tu
        LEFT JOIN posts_master pm on pm.id = tu.post_id
    where tu.post_id is not null AND tu.user_id = $3::integer
    ORDER BY pm.last_updated
)
select pm.id                                                           as post_id,
       pm.content                                                      as content,
       count(DISTINCT pl.id) FILTER (WHERE pl.id IS NOT NULL)::integer as likes,
       count(DISTINCT pc.id) FILTER (WHERE pc.id IS NOT NULL)::integer as comments,
       case when pl2.id is not null then true else false end           as is_liked,
       case
           when ps.id is not null then (
               select jsonb_build_object(
                              'post_id', pm5.id,
                              'content', pm5.content,
                              'likes', count(DISTINCT pl5.id) FILTER (WHERE pl5.id IS NOT NULL)::integer,
                              'comments', count(DISTINCT pc1.id) FILTER (WHERE pc1.id IS NOT NULL)::integer,
                              'is_liked', case when pl6.id is not null then true else false end,
                              'created_by', jsonb_build_object(
                                      'user_id', uc6.id,
                                      'user_handle', uc6.user_handle,
                                      'first_name', up6.first_name,
                                      'last_name', up6.last_name
                                  ),
                              'tagged_assets', json_agg(
                                               DISTINCT jsonb_build_object(
                                                       'asset_id', ta5.asset_id,
                                                       'symbol', ma5.symbol)
                                  ) FILTER (WHERE ta5.asset_id IS NOT NULL),
                              'tagged_users', json_agg(
                                              DISTINCT jsonb_build_object(
                                                      'user_id', uc5.id,
                                                      'user_handle', uc5.user_handle,
                                                      'first_name', up5.first_name,
                                                      'last_name', up5.last_name)
                                  ) FILTER (WHERE uc5.id IS NOT NULL),
                              'media_url', json_agg(
                                           DISTINCT jsonb_build_object(
                                                   'image_org', pm6.image_org,
                                                   'image_thumb', pm6.image_thumb,
                                                   'image_small', pm6.image_small,
                                                   'image_medium', pm6.image_medium,
                                                   'image_large', pm6.image_large)
                                  ) FILTER (WHERE pm6.id IS NOT NULL)
                          )
               from posts_master pm5
                        left join posts_media pm6 on pm5.id = pm6.post_id
                        left join tagged_users tu on pm5.id = tu.post_id
                        left join user_core uc5 on uc5.id = tu.user_id
                        left join user_profile up5 on uc5.id = up5.user_id
                        left join user_core uc6 on uc6.id = pm5.user_id
                        left join user_profile up6 on uc6.id = up6.user_id
                        left join tagged_assets ta5 on ta5.post_id = pm5.id and ta5.type = 'post'
                        left join master_assets ma5 on ta5.asset_id = ma5.id
                        left join posts_likes pl5 on pl5.post_id = pm5.id AND pl5.is_deleted = FALSE
                        left join posts_likes pl6
                                  on pl6.post_id = pm5.id AND pl6.is_deleted = FALSE AND pl6.user_id = $4
                        left join posts_comments pc1
                                  on pc1.post_id = pm5.id AND pc1.is_deleted = FALSE AND pc1.parent_comment_id is NULL
               WHERE pm5.is_deleted = FALSE
                 AND pm5.id = ps.shared_post_id
                    group by pm5.id, uc6.id, uc5.user_handle, up6.first_name, up6.last_name, pl6.id, ps.id
           )
           else '{}'::jsonb
           end                                                         as post_shared,
       jsonb_build_object(
               'user_id', uc2.id,
               'user_handle', uc2.user_handle,
               'first_name', up2.first_name,
               'last_name', up2.last_name
           )                                                           as created_by,
       json_agg(
       DISTINCT jsonb_build_object(
               'asset_id', ta.asset_id,
               'symbol', ma.symbol)
           ) FILTER (WHERE ta.asset_id IS NOT NULL)                    AS tagged_assets,
       json_agg(
       DISTINCT jsonb_build_object(
               'user_id', uc.id,
               'user_handle', uc.user_handle,
               'first_name', up.first_name,
               'last_name', up.last_name)
           ) FILTER (WHERE uc.id IS NOT NULL)                          AS tagged_users,
       json_agg(
       DISTINCT jsonb_build_object(
               'image_org', pm2.image_org,
               'image_thumb', pm2.image_thumb,
               'image_small', pm2.image_small,
               'image_medium', pm2.image_medium,
               'image_large', pm2.image_large)
           ) FILTER (WHERE pm2.id IS NOT NULL)                         AS media_url
from posts_master pm
         left join posts_shared ps on pm.id = ps.post_id
         left join posts_media pm2 on pm.id = pm2.post_id
         left join tagged_users tu on pm.id = tu.post_id
         left join user_core uc on uc.id = tu.user_id
         left join user_profile up on uc.id = up.user_id
         left join user_core uc2 on uc2.id = pm.user_id
         left join user_profile up2 on uc2.id = up2.user_id
         left join tagged_assets ta on ta.post_id = pm.id and ta.type = 'post'
         left join master_assets ma on ta.asset_id = ma.id
         left join posts_likes pl on pl.post_id = pm.id AND pl.is_deleted = FALSE
         left join posts_likes pl2 on pl2.post_id = pm.id AND pl2.is_deleted = FALSE AND pl2.user_id = $4
         left join posts_comments pc on pc.post_id = pm.id AND pc.is_deleted = FALSE AND pc.parent_comment_id is NULL
WHERE pm.is_deleted = FALSE -- user_where_condition 
AND pm.id IN ( SELECT id from posts_ids)
group by pm.id, uc2.id, uc2.user_handle, up2.first_name, up2.last_name, pl2.id, ps.id
ORDER BY pm.last_updated DESC
OFFSET $2
LIMIT $1
`;


/***/ }),
/* 126 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateCommentOnPostLikeDbQuery = void 0;
exports.UpdateCommentOnPostLikeDbQuery = `
INSERT INTO comment_likes (post_comment_id, trades_comment_id, user_id, is_deleted)
            VALUES ($1, null, $2, $3)
        ON CONFLICT (user_id, post_comment_id)
            DO UPDATE SET
                is_deleted = EXCLUDED.is_deleted,
                last_updated = CURRENT_TIMESTAMP;
                `;


/***/ }),
/* 127 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdatePostLikeDbQuery = void 0;
exports.UpdatePostLikeDbQuery = `
INSERT INTO posts_likes (post_id, user_id, is_deleted)
            VALUES ($1, $2, $3)
        ON CONFLICT (user_id, post_id)
            DO UPDATE SET
                is_deleted = EXCLUDED.is_deleted,
                last_updated = CURRENT_TIMESTAMP;
                `;


/***/ }),
/* 128 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AssetsModule = void 0;
const common_1 = __webpack_require__(4);
const shared_module_1 = __webpack_require__(27);
const assets_controller_1 = __webpack_require__(129);
const assets_service_1 = __webpack_require__(130);
let AssetsModule = class AssetsModule {
};
AssetsModule = __decorate([
    (0, common_1.Module)({
        imports: [shared_module_1.SharedModule],
        controllers: [assets_controller_1.AssetsController],
        providers: [assets_service_1.AssetsService],
    })
], AssetsModule);
exports.AssetsModule = AssetsModule;


/***/ }),
/* 129 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AssetsController = void 0;
const common_1 = __webpack_require__(4);
const swagger_1 = __webpack_require__(7);
const assets_service_1 = __webpack_require__(130);
const asset_logo_response_dto_1 = __webpack_require__(132);
const asset_search_response_dto_1 = __webpack_require__(133);
let AssetsController = class AssetsController {
    constructor(assetsService) {
        this.assetsService = assetsService;
    }
    AssetSearch(query) {
        return this.assetsService.getAssetDetails(query);
    }
    GetAssetLogo(symbol) {
        return this.assetsService.getAssetLogo(symbol);
    }
    GetCompanyDetails(symbol) {
        return this.assetsService.getCompanyInfo(symbol);
    }
    GetCompanyFundamentals(symbol) {
        return this.assetsService.getCompanyFundamentals(symbol);
    }
    GetCompanyNews(symbol) {
        return this.assetsService.getCompanyNews(symbol);
    }
};
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiQuery)({
        name: 'query',
        required: true,
        description: 'Name or Asset symbol to search',
    }),
    (0, swagger_1.ApiResponse)({ type: [asset_search_response_dto_1.AssetSearchResponseDto] }),
    __param(0, (0, common_1.Query)('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AssetsController.prototype, "AssetSearch", null);
__decorate([
    (0, common_1.Get)('logo/:symbol'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiParam)({
        name: 'symbol',
        required: true,
        description: 'Asset symbol to search',
    }),
    (0, swagger_1.ApiResponse)({ type: asset_logo_response_dto_1.AssetLogoResponseDto }),
    __param(0, (0, common_1.Param)('symbol')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AssetsController.prototype, "GetAssetLogo", null);
__decorate([
    (0, common_1.Get)('details/:symbol'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiParam)({
        name: 'symbol',
        required: true,
        description: 'Asset symbol to search',
    }),
    (0, swagger_1.ApiResponse)({ type: asset_logo_response_dto_1.AssetDetailsDto }),
    __param(0, (0, common_1.Param)('symbol')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AssetsController.prototype, "GetCompanyDetails", null);
__decorate([
    (0, common_1.Get)('fundamental/:symbol'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiParam)({
        name: 'symbol',
        required: true,
        description: 'Asset symbol to search',
    }),
    (0, swagger_1.ApiResponse)({ type: asset_logo_response_dto_1.AssetFundamentalsDto }),
    __param(0, (0, common_1.Param)('symbol')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AssetsController.prototype, "GetCompanyFundamentals", null);
__decorate([
    (0, common_1.Get)('news/:symbol'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiParam)({
        name: 'symbol',
        required: true,
        description: 'Asset symbol to search',
    }),
    (0, swagger_1.ApiResponse)({ type: asset_logo_response_dto_1.AssetLogoResponseDto }),
    __param(0, (0, common_1.Param)('symbol')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AssetsController.prototype, "GetCompanyNews", null);
AssetsController = __decorate([
    (0, common_1.Controller)({
        path: 'assets',
        version: '1',
    }),
    (0, swagger_1.ApiTags)('Assets'),
    __metadata("design:paramtypes", [typeof (_a = typeof assets_service_1.AssetsService !== "undefined" && assets_service_1.AssetsService) === "function" ? _a : Object])
], AssetsController);
exports.AssetsController = AssetsController;


/***/ }),
/* 130 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AssetsService_1, _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AssetsService = void 0;
const database_service_1 = __webpack_require__(19);
const logging_service_1 = __webpack_require__(26);
const common_1 = __webpack_require__(4);
const city_falcon_service_1 = __webpack_require__(30);
const iex_service_1 = __webpack_require__(32);
const search_assets_db_query_1 = __webpack_require__(131);
let AssetsService = AssetsService_1 = class AssetsService {
    constructor(db, iex, cityFalcon, logger) {
        this.db = db;
        this.iex = iex;
        this.cityFalcon = cityFalcon;
        this.logger = logger;
        this.logger.setContext(AssetsService_1.name);
    }
    getAssetDetails(searchQuery) {
        return this.iex.searchAssets(searchQuery);
    }
    getAssetLogo(symbol) {
        return this.iex.getAssetLogo(symbol);
    }
    searchAssetsFromDb(query) {
        return this.db.rawQuery(search_assets_db_query_1.searchAssetDbQuery, [`${query}%`], null);
    }
    getCompanyInfo(symbol) {
        return this.iex.getCompanyInfo(symbol);
    }
    getCompanyFundamentals(symbol) {
        return this.iex.getAssetFundamentals(symbol);
    }
    getCompanyNews(symbol) {
        return this.cityFalcon.getAssetNews(symbol);
    }
};
AssetsService = AssetsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof database_service_1.DatabaseService !== "undefined" && database_service_1.DatabaseService) === "function" ? _a : Object, typeof (_b = typeof iex_service_1.IexService !== "undefined" && iex_service_1.IexService) === "function" ? _b : Object, typeof (_c = typeof city_falcon_service_1.CityFalconService !== "undefined" && city_falcon_service_1.CityFalconService) === "function" ? _c : Object, typeof (_d = typeof logging_service_1.Logger !== "undefined" && logging_service_1.Logger) === "function" ? _d : Object])
], AssetsService);
exports.AssetsService = AssetsService;


/***/ }),
/* 131 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.searchAssetDbQuery = void 0;
exports.searchAssetDbQuery = `
SELECT
    id as asset_id,
    symbol
FROM
    master_assets 
WHERE
    symbol ILIKE $1
    LIMIT 10;
`;


/***/ }),
/* 132 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AssetFundamentalsDto = exports.AssetDetailsDto = exports.AssetLogoResponseDto = void 0;
const swagger_1 = __webpack_require__(7);
class AssetLogoResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetLogoResponseDto.prototype, "url", void 0);
exports.AssetLogoResponseDto = AssetLogoResponseDto;
class AssetDetailsDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetDetailsDto.prototype, "symbol", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetDetailsDto.prototype, "companyName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetDetailsDto.prototype, "exchange", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetDetailsDto.prototype, "industry", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetDetailsDto.prototype, "website", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetDetailsDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetDetailsDto.prototype, "CEO", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetDetailsDto.prototype, "securityName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetDetailsDto.prototype, "issueType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetDetailsDto.prototype, "sector", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetDetailsDto.prototype, "primarySicCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetDetailsDto.prototype, "employees", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], AssetDetailsDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetDetailsDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], AssetDetailsDto.prototype, "address2", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetDetailsDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetDetailsDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetDetailsDto.prototype, "zip", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetDetailsDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetDetailsDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetDetailsDto.prototype, "logo", void 0);
exports.AssetDetailsDto = AssetDetailsDto;
class AssetFundamentalsDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetFundamentalsDto.prototype, "avgTotalVolume", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetFundamentalsDto.prototype, "calculationPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetFundamentalsDto.prototype, "change", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetFundamentalsDto.prototype, "changePercent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], AssetFundamentalsDto.prototype, "close", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetFundamentalsDto.prototype, "closeSource", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], AssetFundamentalsDto.prototype, "closeTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetFundamentalsDto.prototype, "companyName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetFundamentalsDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], AssetFundamentalsDto.prototype, "delayedPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], AssetFundamentalsDto.prototype, "delayedPriceTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], AssetFundamentalsDto.prototype, "extendedChange", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], AssetFundamentalsDto.prototype, "extendedChangePercent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], AssetFundamentalsDto.prototype, "extendedPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], AssetFundamentalsDto.prototype, "extendedPriceTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetFundamentalsDto.prototype, "high", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetFundamentalsDto.prototype, "highSource", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetFundamentalsDto.prototype, "highTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetFundamentalsDto.prototype, "iexAskPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetFundamentalsDto.prototype, "iexAskSize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetFundamentalsDto.prototype, "iexBidPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetFundamentalsDto.prototype, "iexBidSize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetFundamentalsDto.prototype, "iexClose", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetFundamentalsDto.prototype, "iexCloseTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetFundamentalsDto.prototype, "iexLastUpdated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetFundamentalsDto.prototype, "iexMarketPercent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetFundamentalsDto.prototype, "iexOpen", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetFundamentalsDto.prototype, "iexOpenTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetFundamentalsDto.prototype, "iexRealtimePrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetFundamentalsDto.prototype, "iexRealtimeSize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetFundamentalsDto.prototype, "iexVolume", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetFundamentalsDto.prototype, "lastTradeTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetFundamentalsDto.prototype, "latestPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetFundamentalsDto.prototype, "latestSource", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetFundamentalsDto.prototype, "latestTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetFundamentalsDto.prototype, "latestUpdate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetFundamentalsDto.prototype, "latestVolume", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetFundamentalsDto.prototype, "low", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetFundamentalsDto.prototype, "lowSource", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetFundamentalsDto.prototype, "lowTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetFundamentalsDto.prototype, "marketCap", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], AssetFundamentalsDto.prototype, "oddLotDelayedPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], AssetFundamentalsDto.prototype, "oddLotDelayedPriceTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], AssetFundamentalsDto.prototype, "open", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], AssetFundamentalsDto.prototype, "openTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetFundamentalsDto.prototype, "openSource", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetFundamentalsDto.prototype, "peRatio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetFundamentalsDto.prototype, "previousClose", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetFundamentalsDto.prototype, "previousVolume", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetFundamentalsDto.prototype, "primaryExchange", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetFundamentalsDto.prototype, "symbol", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetFundamentalsDto.prototype, "volume", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetFundamentalsDto.prototype, "week52High", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetFundamentalsDto.prototype, "week52Low", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetFundamentalsDto.prototype, "ytdChange", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], AssetFundamentalsDto.prototype, "isUSMarketOpen", void 0);
exports.AssetFundamentalsDto = AssetFundamentalsDto;


/***/ }),
/* 133 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AssetSearchResponseDto = void 0;
const swagger_1 = __webpack_require__(7);
class AssetSearchResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetSearchResponseDto.prototype, "symbol", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetSearchResponseDto.prototype, "exchange", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetSearchResponseDto.prototype, "exchangeSuffix", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetSearchResponseDto.prototype, "exchangeName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetSearchResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetSearchResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], AssetSearchResponseDto.prototype, "iexId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetSearchResponseDto.prototype, "region", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetSearchResponseDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetSearchResponseDto.prototype, "figi", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetSearchResponseDto.prototype, "cik", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetSearchResponseDto.prototype, "lei", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetSearchResponseDto.prototype, "securityName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetSearchResponseDto.prototype, "securityType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetSearchResponseDto.prototype, "sector", void 0);
exports.AssetSearchResponseDto = AssetSearchResponseDto;


/***/ }),
/* 134 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TradesModule = void 0;
const shared_module_1 = __webpack_require__(27);
const common_1 = __webpack_require__(4);
const trades_controller_1 = __webpack_require__(135);
const trades_service_1 = __webpack_require__(147);
let TradesModule = class TradesModule {
};
TradesModule = __decorate([
    (0, common_1.Module)({
        imports: [shared_module_1.SharedModule],
        controllers: [trades_controller_1.TradesController],
        providers: [trades_service_1.TradesService],
    })
], TradesModule);
exports.TradesModule = TradesModule;


/***/ }),
/* 135 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TradesController = void 0;
const user_token_payload_decorator_1 = __webpack_require__(68);
const common_1 = __webpack_require__(4);
const swagger_1 = __webpack_require__(7);
const jwt_auth_guard_1 = __webpack_require__(69);
const jwt_strategy_1 = __webpack_require__(65);
const list_all_posts_query_dto_1 = __webpack_require__(107);
const add_comment_db_query_1 = __webpack_require__(136);
const create_trade_request_dto_1 = __webpack_require__(137);
const list_all_trades_query_dto_1 = __webpack_require__(138);
const update_comment_request_dto_1 = __webpack_require__(139);
const update_like_for_comment_param_dto_1 = __webpack_require__(140);
const update_like_for_trade_param_dto_1 = __webpack_require__(141);
const update_trade_request_dto_1 = __webpack_require__(142);
const create_trade_response_dto_1 = __webpack_require__(143);
const likes_of_post_response_dto_1 = __webpack_require__(144);
const list_all_comments_response_dto_1 = __webpack_require__(145);
const list_all_trades_response_dto_1 = __webpack_require__(146);
const trades_service_1 = __webpack_require__(147);
let TradesController = class TradesController {
    constructor(tradesService) {
        this.tradesService = tradesService;
    }
    create(user, createTradeDto) {
        return this.tradesService.create(user.userId, createTradeDto);
    }
    findAllTrades(user, query) {
        return this.tradesService.findAll(user.userId, null, query);
    }
    findTradesOfAUser(user, query, userId) {
        return this.tradesService.findAll(user.userId, userId !== null && userId !== void 0 ? userId : user.userId, query);
    }
    UpdateTrade(user, createTradeDto, tradeId) {
        return this.tradesService.updateTrade(user.userId, tradeId, createTradeDto);
    }
    remove(user, tradeId) {
        return this.tradesService.deleteTrade(user.userId, tradeId);
    }
    UpdateTradeLike(user, param) {
        const { likeValue, tradeId } = param;
        return this.tradesService.updateLikeForTrade(user.userId, tradeId, likeValue);
    }
    GetLikeDetailsOfTrade(user, query, tradeId) {
        return this.tradesService.getTradeLikeUsers(tradeId, query);
    }
    AddCommentOnTrade(user, tradeId, body) {
        return this.tradesService.addCommentOnTrade(user.userId, tradeId, body);
    }
    ListCommentOfATrade(user, query, tradeId) {
        return this.tradesService.listCommentOfTrade(tradeId, user.userId, query);
    }
    ListRepliesOfCommentOfATrade(user, query, tradeId, commentId) {
        return this.tradesService.listCommentOfTrade(tradeId, user.userId, query, commentId, true);
    }
    UpdateCommentOnTrade(user, createTradeDto, tradeId, commentId) {
        return this.tradesService.updateCommentOnTrade(user.userId, commentId, tradeId, createTradeDto);
    }
    RemoveCommentOnTrade(user, tradeId, commentId) {
        return this.tradesService.deleteCommentOnTrade(user.userId, tradeId, commentId);
    }
    UpdateLikeForCommentOnTrade(user, param) {
        const { likeValue, tradeId, commentId } = param;
        return this.tradesService.updateLikeForCommentOnTrade(user.userId, tradeId, commentId, likeValue);
    }
    GetLikesForCommentOnTrade(user, query, tradeId, commentId) {
        return this.tradesService.getLikeForCommentOnTrade(commentId, query);
    }
    ListAllTradesWithTaggedAsset(user, query, value) {
        return this.tradesService.getPostsWhichTagged(query, user.userId, value);
    }
};
__decorate([
    (0, swagger_1.ApiTags)('Trades'),
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Create POST',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiBody)({ type: create_trade_request_dto_1.CreateTradeRequestDto }),
    (0, swagger_1.ApiResponse)({ type: create_trade_response_dto_1.CreateTradeResponseDto }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _a : Object, typeof (_b = typeof create_trade_request_dto_1.CreateTradeRequestDto !== "undefined" && create_trade_request_dto_1.CreateTradeRequestDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], TradesController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiTags)('Trades'),
    (0, common_1.Get)(''),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all trades in latest order of all users',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiResponse)({ type: [list_all_trades_response_dto_1.ListAllTradesResponseDto] }),
    (0, swagger_1.ApiQuery)({ name: 'limit', description: 'Number of trades to return' }),
    (0, swagger_1.ApiQuery)({
        name: 'offset',
        description: 'From which trade to get n-limit trades',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'filter',
        enum: ['all', 'one_day', 'one_week', 'one_month'],
    }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _c : Object, typeof (_d = typeof list_all_trades_query_dto_1.ListAllTradesQueryDto !== "undefined" && list_all_trades_query_dto_1.ListAllTradesQueryDto) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], TradesController.prototype, "findAllTrades", null);
__decorate([
    (0, swagger_1.ApiTags)('Trades'),
    (0, common_1.Get)(':userId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all trades of any particular user or current logged in user',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'filter',
        enum: ['all', 'one_day', 'one_week', 'one_month'],
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiResponse)({ type: [list_all_trades_response_dto_1.ListAllTradesResponseDto] }),
    (0, swagger_1.ApiQuery)({ name: 'limit', description: 'Number of trades to return' }),
    (0, swagger_1.ApiQuery)({
        name: 'offset',
        description: 'From which trade to get n-limit trades',
    }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _e : Object, typeof (_f = typeof list_all_trades_query_dto_1.ListAllTradesQueryDto !== "undefined" && list_all_trades_query_dto_1.ListAllTradesQueryDto) === "function" ? _f : Object, Number]),
    __metadata("design:returntype", void 0)
], TradesController.prototype, "findTradesOfAUser", null);
__decorate([
    (0, swagger_1.ApiTags)('Trades'),
    (0, common_1.Patch)(':tradeId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'PATCH a trade',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ skipMissingProperties: true })),
    (0, swagger_1.ApiBody)({ type: update_trade_request_dto_1.UpdateTradeRequestDto }),
    (0, swagger_1.ApiResponse)({ type: create_trade_response_dto_1.UpdateTradeResponseDto }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Param)('tradeId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _g : Object, typeof (_h = typeof create_trade_request_dto_1.CreateTradeRequestDto !== "undefined" && create_trade_request_dto_1.CreateTradeRequestDto) === "function" ? _h : Object, Number]),
    __metadata("design:returntype", void 0)
], TradesController.prototype, "UpdateTrade", null);
__decorate([
    (0, swagger_1.ApiTags)('Trades'),
    (0, common_1.Delete)(':tradeId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a trade',
    }),
    (0, swagger_1.ApiResponse)({}),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)('tradeId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_j = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _j : Object, Number]),
    __metadata("design:returntype", void 0)
], TradesController.prototype, "remove", null);
__decorate([
    (0, swagger_1.ApiTags)('Trades'),
    (0, common_1.Patch)('/:tradeId/:likeValue'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiParam)({ name: 'tradeId', type: Number }),
    (0, swagger_1.ApiParam)({ name: 'likeValue', enum: ['like', 'unlike'] }),
    (0, swagger_1.ApiOperation)({
        summary: 'Add like for a trade',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiResponse)({}),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_k = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _k : Object, typeof (_l = typeof update_like_for_trade_param_dto_1.UpdateLikeForTradeParam !== "undefined" && update_like_for_trade_param_dto_1.UpdateLikeForTradeParam) === "function" ? _l : Object]),
    __metadata("design:returntype", void 0)
], TradesController.prototype, "UpdateTradeLike", null);
__decorate([
    (0, swagger_1.ApiTags)('Trades'),
    (0, common_1.Get)(':tradeId/likes'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'get list of users who like the trade',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiResponse)({ type: [likes_of_post_response_dto_1.LikesOfTradesResponseDto] }),
    (0, swagger_1.ApiQuery)({ name: 'limit', description: 'Number of users to return' }),
    (0, swagger_1.ApiQuery)({
        name: 'offset',
        description: 'From which trade to get n-limit trades',
    }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Param)('tradeId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_m = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _m : Object, typeof (_o = typeof list_all_trades_query_dto_1.ListAllTradesQueryDto !== "undefined" && list_all_trades_query_dto_1.ListAllTradesQueryDto) === "function" ? _o : Object, Number]),
    __metadata("design:returntype", void 0)
], TradesController.prototype, "GetLikeDetailsOfTrade", null);
__decorate([
    (0, swagger_1.ApiTags)('Trades - Comment'),
    (0, common_1.Post)('/:tradeId/comment'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'In order to add comment on a trade',
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    (0, swagger_1.ApiBody)({ type: add_comment_db_query_1.AddCommentOnTradeRequestDto }),
    (0, swagger_1.ApiResponse)({}),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)('tradeId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_p = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _p : Object, Number, typeof (_q = typeof add_comment_db_query_1.AddCommentOnTradeRequestDto !== "undefined" && add_comment_db_query_1.AddCommentOnTradeRequestDto) === "function" ? _q : Object]),
    __metadata("design:returntype", void 0)
], TradesController.prototype, "AddCommentOnTrade", null);
__decorate([
    (0, swagger_1.ApiTags)('Trades - Comment'),
    (0, common_1.Get)('/:tradeId/comment'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'This will generate presigned S3 URL for attachment pictures',
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiQuery)({ name: 'limit' }),
    (0, swagger_1.ApiQuery)({
        name: 'offset',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    (0, swagger_1.ApiResponse)({ type: [list_all_comments_response_dto_1.ListAllCommentsOnTradesResponseDto] }),
    (0, swagger_1.ApiResponse)({}),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Param)('tradeId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_r = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _r : Object, typeof (_s = typeof list_all_trades_query_dto_1.ListAllTradesQueryDto !== "undefined" && list_all_trades_query_dto_1.ListAllTradesQueryDto) === "function" ? _s : Object, Number]),
    __metadata("design:returntype", void 0)
], TradesController.prototype, "ListCommentOfATrade", null);
__decorate([
    (0, swagger_1.ApiTags)('Trades - Replies of Comment'),
    (0, common_1.Get)('/:tradeId/comment/:commentId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'This will generate presigned S3 URL for attachment pictures',
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiQuery)({ name: 'limit' }),
    (0, swagger_1.ApiQuery)({
        name: 'offset',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    (0, swagger_1.ApiResponse)({ type: [list_all_comments_response_dto_1.ListAllCommentsOnTradesResponseDto] }),
    (0, swagger_1.ApiResponse)({}),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Param)('tradeId', common_1.ParseIntPipe)),
    __param(3, (0, common_1.Param)('commentId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_t = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _t : Object, typeof (_u = typeof list_all_trades_query_dto_1.ListAllTradesQueryDto !== "undefined" && list_all_trades_query_dto_1.ListAllTradesQueryDto) === "function" ? _u : Object, Number, Number]),
    __metadata("design:returntype", void 0)
], TradesController.prototype, "ListRepliesOfCommentOfATrade", null);
__decorate([
    (0, swagger_1.ApiTags)('Trades - Comment'),
    (0, common_1.Patch)('/:tradeId/comment/:commentId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'PATCH a comment',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiBody)({ type: update_trade_request_dto_1.UpdateTradeRequestDto }),
    (0, swagger_1.ApiResponse)({ type: create_trade_response_dto_1.UpdateTradeResponseDto }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Param)('tradeId', common_1.ParseIntPipe)),
    __param(3, (0, common_1.Param)('commentId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_v = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _v : Object, typeof (_w = typeof update_comment_request_dto_1.UpdateCommentOnTradeRequestDto !== "undefined" && update_comment_request_dto_1.UpdateCommentOnTradeRequestDto) === "function" ? _w : Object, Number, Number]),
    __metadata("design:returntype", void 0)
], TradesController.prototype, "UpdateCommentOnTrade", null);
__decorate([
    (0, swagger_1.ApiTags)('Trades - Comment'),
    (0, common_1.Delete)('/:tradeId/comment/:commentId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a comment on trade',
    }),
    (0, swagger_1.ApiResponse)({}),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)('tradeId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Param)('commentId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_x = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _x : Object, Number, Number]),
    __metadata("design:returntype", void 0)
], TradesController.prototype, "RemoveCommentOnTrade", null);
__decorate([
    (0, swagger_1.ApiTags)('Trades - Comment'),
    (0, common_1.Patch)('/:tradeId/comment/:commentId/:likeValue'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiParam)({ name: 'tradeId', type: Number }),
    (0, swagger_1.ApiParam)({ name: 'commentId', type: Number }),
    (0, swagger_1.ApiParam)({ name: 'likeValue', enum: ['like', 'unlike'] }),
    (0, swagger_1.ApiOperation)({
        summary: 'update a like for comment',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiResponse)({}),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_y = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _y : Object, typeof (_z = typeof update_like_for_comment_param_dto_1.UpdateLikeForCommentOnTradeParam !== "undefined" && update_like_for_comment_param_dto_1.UpdateLikeForCommentOnTradeParam) === "function" ? _z : Object]),
    __metadata("design:returntype", void 0)
], TradesController.prototype, "UpdateLikeForCommentOnTrade", null);
__decorate([
    (0, swagger_1.ApiTags)('Trades - Comment'),
    (0, common_1.Get)('/:tradeId/comment/:commentId/likes'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'get list of users who like the trade',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiResponse)({ type: [update_like_for_comment_param_dto_1.UpdateLikeForCommentOnTradeParam] }),
    (0, swagger_1.ApiQuery)({ name: 'limit', description: 'Number of users to return' }),
    (0, swagger_1.ApiQuery)({
        name: 'offset',
        description: 'From which trade to get n-limit trades',
    }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Param)('tradeId', common_1.ParseIntPipe)),
    __param(3, (0, common_1.Param)('commentId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_0 = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _0 : Object, typeof (_1 = typeof list_all_trades_query_dto_1.ListAllTradesQueryDto !== "undefined" && list_all_trades_query_dto_1.ListAllTradesQueryDto) === "function" ? _1 : Object, Number, Number]),
    __metadata("design:returntype", void 0)
], TradesController.prototype, "GetLikesForCommentOnTrade", null);
__decorate([
    (0, swagger_1.ApiTags)('Trades - Get trades from tagged Asset'),
    (0, common_1.Get)('/asset/:value'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'get list of Trades with Asset tagged',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    (0, swagger_1.ApiParam)({
        name: 'value',
        description: 'Corresponding symbol of tagged asset',
    }),
    (0, swagger_1.ApiQuery)({ name: 'limit', description: 'Number of users to return' }),
    (0, swagger_1.ApiQuery)({
        name: 'offset',
        description: 'From which post to get n-limit posts',
    }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Param)('value')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_2 = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _2 : Object, typeof (_3 = typeof list_all_posts_query_dto_1.ListAllPostsQueryDto !== "undefined" && list_all_posts_query_dto_1.ListAllPostsQueryDto) === "function" ? _3 : Object, String]),
    __metadata("design:returntype", void 0)
], TradesController.prototype, "ListAllTradesWithTaggedAsset", null);
TradesController = __decorate([
    (0, common_1.Controller)({
        path: 'trades',
        version: '1',
    }),
    __metadata("design:paramtypes", [typeof (_4 = typeof trades_service_1.TradesService !== "undefined" && trades_service_1.TradesService) === "function" ? _4 : Object])
], TradesController);
exports.TradesController = TradesController;


/***/ }),
/* 136 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AddCommentOnTradeRequestDto = void 0;
const class_validator_1 = __webpack_require__(71);
const swagger_1 = __webpack_require__(7);
class AddCommentOnTradeRequestDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddCommentOnTradeRequestDto.prototype, "comment", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        description: 'Array of tagged users ID',
        required: false,
        type: [Number],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNumber)({}, { each: true }),
    __metadata("design:type", Array)
], AddCommentOnTradeRequestDto.prototype, "taggedUsers", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        description: 'Hashtags as array of strings',
        required: false,
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], AddCommentOnTradeRequestDto.prototype, "hashtags", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        description: 'Asset symbols as array of strings',
        required: false,
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], AddCommentOnTradeRequestDto.prototype, "taggedAssets", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AddCommentOnTradeRequestDto.prototype, "parentCommentId", void 0);
exports.AddCommentOnTradeRequestDto = AddCommentOnTradeRequestDto;


/***/ }),
/* 137 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateTradeRequestDto = void 0;
const class_validator_1 = __webpack_require__(71);
const swagger_1 = __webpack_require__(7);
class CreateTradeRequestDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsIn)(['buy', 'sell']),
    __metadata("design:type", String)
], CreateTradeRequestDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTradeRequestDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Quantity of stock that purchased' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateTradeRequestDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Price at which asset purchased' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateTradeRequestDto.prototype, "price", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        description: 'Purchased/Sold asset SYMBOL NAME',
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTradeRequestDto.prototype, "assetId", void 0);
exports.CreateTradeRequestDto = CreateTradeRequestDto;


/***/ }),
/* 138 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ListAllTradesQueryDto = void 0;
const class_transformer_1 = __webpack_require__(20);
const class_validator_1 = __webpack_require__(71);
class ListAllTradesQueryDto {
    constructor() {
        this.limit = 8;
        this.offset = 0;
        this.sort = 'latest';
        this.filter = 'all';
    }
}
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotIn)([0]),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ListAllTradesQueryDto.prototype, "limit", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ListAllTradesQueryDto.prototype, "offset", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ListAllTradesQueryDto.prototype, "sort", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['all', 'one_day', 'one_week', 'one_month']),
    __metadata("design:type", String)
], ListAllTradesQueryDto.prototype, "filter", void 0);
exports.ListAllTradesQueryDto = ListAllTradesQueryDto;


/***/ }),
/* 139 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateCommentOnTradeRequestDto = void 0;
const swagger_1 = __webpack_require__(7);
const add_comment_db_query_1 = __webpack_require__(136);
class UpdateCommentOnTradeRequestDto extends (0, swagger_1.PartialType)(add_comment_db_query_1.AddCommentOnTradeRequestDto) {
}
exports.UpdateCommentOnTradeRequestDto = UpdateCommentOnTradeRequestDto;


/***/ }),
/* 140 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateLikeForCommentOnTradeParam = void 0;
const class_transformer_1 = __webpack_require__(20);
const class_validator_1 = __webpack_require__(71);
class UpdateLikeForCommentOnTradeParam {
    constructor() {
        this.likeValue = 'like';
    }
}
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateLikeForCommentOnTradeParam.prototype, "tradeId", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateLikeForCommentOnTradeParam.prototype, "commentId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['like', 'unlike']),
    __metadata("design:type", Object)
], UpdateLikeForCommentOnTradeParam.prototype, "likeValue", void 0);
exports.UpdateLikeForCommentOnTradeParam = UpdateLikeForCommentOnTradeParam;


/***/ }),
/* 141 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateLikeForTradeParam = void 0;
const class_transformer_1 = __webpack_require__(20);
const class_validator_1 = __webpack_require__(71);
class UpdateLikeForTradeParam {
    constructor() {
        this.likeValue = 'like';
    }
}
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateLikeForTradeParam.prototype, "tradeId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['like', 'unlike']),
    __metadata("design:type", Object)
], UpdateLikeForTradeParam.prototype, "likeValue", void 0);
exports.UpdateLikeForTradeParam = UpdateLikeForTradeParam;


/***/ }),
/* 142 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateTradeRequestDto = void 0;
const swagger_1 = __webpack_require__(7);
const create_trade_request_dto_1 = __webpack_require__(137);
class UpdateTradeRequestDto extends (0, swagger_1.PartialType)(create_trade_request_dto_1.CreateTradeRequestDto) {
}
exports.UpdateTradeRequestDto = UpdateTradeRequestDto;


/***/ }),
/* 143 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateTradeResponseDto = exports.CreateTradeResponseDto = void 0;
const swagger_1 = __webpack_require__(7);
class CreateTradeResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateTradeResponseDto.prototype, "id", void 0);
exports.CreateTradeResponseDto = CreateTradeResponseDto;
class UpdateTradeResponseDto extends CreateTradeResponseDto {
}
exports.UpdateTradeResponseDto = UpdateTradeResponseDto;


/***/ }),
/* 144 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LikesOfTradesResponseDto = exports.ProfileImage = void 0;
const swagger_1 = __webpack_require__(7);
class ProfileImage {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileImage.prototype, "imageOrg", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileImage.prototype, "imageLarge", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileImage.prototype, "imageSmall", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileImage.prototype, "imageThumb", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileImage.prototype, "imageMedium", void 0);
exports.ProfileImage = ProfileImage;
class LikesOfTradesResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], LikesOfTradesResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LikesOfTradesResponseDto.prototype, "userHandle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LikesOfTradesResponseDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LikesOfTradesResponseDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", ProfileImage)
], LikesOfTradesResponseDto.prototype, "profileImage", void 0);
exports.LikesOfTradesResponseDto = LikesOfTradesResponseDto;


/***/ }),
/* 145 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ListAllCommentsOnTradesResponseDto = exports.ListAllCommentsOnTradesResponseDtoTemp = exports.TaggedUser = exports.TaggedAsset = exports.CreatedBy = void 0;
const swagger_1 = __webpack_require__(7);
class CreatedBy {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreatedBy.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreatedBy.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreatedBy.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreatedBy.prototype, "userHandle", void 0);
exports.CreatedBy = CreatedBy;
class TaggedAsset {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TaggedAsset.prototype, "logo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TaggedAsset.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TaggedAsset.prototype, "symbol", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], TaggedAsset.prototype, "assetId", void 0);
exports.TaggedAsset = TaggedAsset;
class TaggedUser {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TaggedUser.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TaggedUser.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TaggedUser.prototype, "userHandle", void 0);
exports.TaggedUser = TaggedUser;
class ListAllCommentsOnTradesResponseDtoTemp {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ListAllCommentsOnTradesResponseDtoTemp.prototype, "tradeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ListAllCommentsOnTradesResponseDtoTemp.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ListAllCommentsOnTradesResponseDtoTemp.prototype, "isLiked", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ListAllCommentsOnTradesResponseDtoTemp.prototype, "likes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: CreatedBy }),
    __metadata("design:type", CreatedBy)
], ListAllCommentsOnTradesResponseDtoTemp.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [TaggedAsset] }),
    __metadata("design:type", Array)
], ListAllCommentsOnTradesResponseDtoTemp.prototype, "taggedAssets", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [TaggedUser] }),
    __metadata("design:type", Array)
], ListAllCommentsOnTradesResponseDtoTemp.prototype, "taggedUsers", void 0);
exports.ListAllCommentsOnTradesResponseDtoTemp = ListAllCommentsOnTradesResponseDtoTemp;
class ListAllCommentsOnTradesResponseDto extends ListAllCommentsOnTradesResponseDtoTemp {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ListAllCommentsOnTradesResponseDtoTemp] }),
    __metadata("design:type", Array)
], ListAllCommentsOnTradesResponseDto.prototype, "replies", void 0);
exports.ListAllCommentsOnTradesResponseDto = ListAllCommentsOnTradesResponseDto;


/***/ }),
/* 146 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ListAllTradesResponseDto = exports.ProfileImage = exports.MediaUrl = exports.TaggedUser = exports.TaggedAsset = exports.CreatedBy = void 0;
const swagger_1 = __webpack_require__(7);
class CreatedBy {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreatedBy.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreatedBy.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreatedBy.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreatedBy.prototype, "userHandle", void 0);
exports.CreatedBy = CreatedBy;
class TaggedAsset {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TaggedAsset.prototype, "logo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TaggedAsset.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TaggedAsset.prototype, "symbol", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], TaggedAsset.prototype, "assetId", void 0);
exports.TaggedAsset = TaggedAsset;
class TaggedUser {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TaggedUser.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TaggedUser.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TaggedUser.prototype, "userHandle", void 0);
exports.TaggedUser = TaggedUser;
class MediaUrl {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], MediaUrl.prototype, "imageLarge", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], MediaUrl.prototype, "imageSmall", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], MediaUrl.prototype, "imageThumb", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], MediaUrl.prototype, "imageMedium", void 0);
exports.MediaUrl = MediaUrl;
class ProfileImage {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileImage.prototype, "imageOrg", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileImage.prototype, "imageThumb", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileImage.prototype, "imageSmall", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileImage.prototype, "imageMedium", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileImage.prototype, "imageLarge", void 0);
exports.ProfileImage = ProfileImage;
class ListAllTradesResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ListAllTradesResponseDto.prototype, "postId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ListAllTradesResponseDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ListAllTradesResponseDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ListAllTradesResponseDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: TaggedAsset }),
    __metadata("design:type", TaggedAsset)
], ListAllTradesResponseDto.prototype, "taggedAssets", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ProfileImage] }),
    __metadata("design:type", ProfileImage)
], ListAllTradesResponseDto.prototype, "profileImage", void 0);
exports.ListAllTradesResponseDto = ListAllTradesResponseDto;


/***/ }),
/* 147 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var TradesService_1, _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TradesService = void 0;
const rxjs_1 = __webpack_require__(16);
const configuration_1 = __webpack_require__(10);
const database_service_1 = __webpack_require__(19);
const constants_1 = __webpack_require__(22);
const logging_service_1 = __webpack_require__(26);
const s3_service_1 = __webpack_require__(34);
const utils_service_1 = __webpack_require__(23);
const common_1 = __webpack_require__(4);
const config_1 = __webpack_require__(5);
const list_all_trades_db_query_1 = __webpack_require__(148);
const list_comments_of_trades_db_query_1 = __webpack_require__(149);
const list_likes_of_comment_db_query_1 = __webpack_require__(150);
const list_likes_of_trade_db_query_1 = __webpack_require__(151);
const reverse_search_trade_by_tagged_assets_db_query_1 = __webpack_require__(152);
const update_comment_like_db_query_1 = __webpack_require__(153);
const update_trade_like_db_query_1 = __webpack_require__(154);
let TradesService = TradesService_1 = class TradesService {
    constructor(config, db, S3, logger) {
        this.config = config;
        this.db = db;
        this.S3 = S3;
        this.logger = logger;
        this.logger.setContext(TradesService_1.name);
    }
    create(userId, trade) {
        const valuesArray = [];
        const queriesArray = [];
        const arrayToSkip = [];
        const columnToSkip = [
            'createdAt',
            'lastUpdated',
            'id',
            'isDeleted',
            'assetId',
        ];
        if (trade.assetId) {
            const { data: createAssetMasterData, query: createAssetMasterQuery } = utils_service_1.UtilsService.buildInsertQuery({
                tableName: 'master_assets',
                columnData: [trade.assetId].map((x) => ({
                    symbol: x,
                })),
                keysToIgnore: [],
                keysToReplace: [],
                start: valuesArray.length + 1,
            });
            queriesArray.push(`
    ins_master_asset AS (
      ${createAssetMasterQuery}
          ON CONFLICT("symbol")
            DO NOTHING
              RETURNING id
          ),    
      select_asset_ids as (
        SELECT * FROM ins_master_asset
            UNION
        SELECT id FROM master_assets
              where 
          symbol in ( ${createAssetMasterData
                .map((x, i) => `$${valuesArray.length + i + 1}`)
                .join(', ')} )
      )
    `);
            valuesArray.push(...createAssetMasterData);
        }
        const { query, data } = utils_service_1.UtilsService.buildInsertQuery({
            tableName: 'trades_master',
            columnData: [trade],
            keysToIgnore: [...arrayToSkip, ...columnToSkip],
            keysToReplace: {
                userId,
                isDeleted: false,
            },
            addSqlQuery: { asset_id: '(SELECT id from select_asset_ids)' },
            start: valuesArray.length + 1,
        });
        queriesArray.push(`ins_trades_master as (${query} RETURNING id)`);
        valuesArray.push(...data);
        return this.db
            .rawQuery(`WITH ${queriesArray.join(', ')} (select id as trade_id from select_asset_ids) `, valuesArray, null)
            .pipe((0, rxjs_1.map)((res) => res));
    }
    findAll(loggedInUserId, userId, queryParams) {
        let dbQuery = list_all_trades_db_query_1.listAllTradesDbQuery;
        const { limit, offset } = queryParams;
        const data = [limit, offset, loggedInUserId];
        if (queryParams.filter) {
            const filterQuery = {
                all: '',
                one_day: `
        AND tm.created_at::date = current_date::date`,
                one_week: `
        AND tm.created_at BETWEEN
          NOW()::DATE-EXTRACT(DOW FROM NOW())::INTEGER - 7 
          AND NOW()::DATE-EXTRACT(DOW from NOW())::INTEGER`,
                one_month: `
        AND tm.created_at BETWEEN date_trunc('month', current_date)
              and current_date::date`,
            };
            dbQuery = dbQuery.replace('--FILTER_CONDITION', filterQuery[queryParams.filter]);
        }
        if (userId) {
            dbQuery = dbQuery.replace('-- user_where_condition', 'AND tm.user_id = $4');
            data.push(userId);
        }
        else {
            dbQuery = dbQuery.replace('--INNER_JOIN_FOLLOWER', 'INNER JOIN followers f on f.user_id = $3 AND tm.user_id = f.follower_id  or tm.user_id = $3');
        }
        return this.db.rawQuery(dbQuery, data, null);
    }
    updateTrade(userId, tradeId, updateTrade) {
        const valuesArray = [userId, tradeId];
        const queriesArray = [];
        const arrayToSkip = [];
        const columnToSkip = [
            'createdAt',
            'lastUpdated',
            'id',
            'userId',
            'isDeleted',
        ];
        const addSQLQuery = {
            last_updated: 'current_timestamp',
        };
        const { query, data } = utils_service_1.UtilsService.buildUpdateQuery({
            tableName: 'trades_master',
            columnData: updateTrade,
            keysToIgnore: [...arrayToSkip, ...columnToSkip],
            keysToReplace: { isDeleted: false },
            addSqlQuery: addSQLQuery,
            whereCondition: 'user_id = $1 and id = $2',
            start: 3,
        });
        queriesArray.push(`upd_trades_master as (${query} RETURNING id)`);
        valuesArray.push(...data);
        return this.db
            .rawQuery(`WITH ${queriesArray.join(', ')} (select id as  trade_id from upd_trades_master) `, valuesArray, null)
            .pipe((0, rxjs_1.map)((res) => res[0]));
    }
    deleteTrade(userId, tradeId) {
        return this.db
            .rawQuery(`UPDATE
          trades_master
      SET
          is_deleted = TRUE
      WHERE
          user_id = $1 AND id = $2
      RETURNING
          1 AS deleted
      `, [userId, tradeId], null)
            .pipe((0, rxjs_1.map)((x) => x[0] || {}));
    }
    updateLikeForTrade(userId, tradeId, isDeleted) {
        const isDeletedStatus = isDeleted !== 'like';
        return this.db.rawQuery(update_trade_like_db_query_1.UpdateTradeLikeDbQuery, [tradeId, userId, isDeletedStatus], null);
    }
    getTradeLikeUsers(tradeId, queryParams) {
        const { limit, offset } = queryParams;
        const data = [tradeId, offset, limit];
        return this.db.rawQuery(list_likes_of_trade_db_query_1.listLikesOfTradeDbQuery, data, null);
    }
    addCommentOnTrade(userId, tradeId, tradeComment) {
        var _a, _b, _c;
        const valuesArray = [];
        const queriesArray = [];
        const arrayToSkip = ['taggedUsers', 'hashtags', 'taggedAssets'];
        const columnToSkip = ['createdAt', 'lastUpdated', 'id', 'isDeleted'];
        const addSqlQuery = {};
        const { query, data } = utils_service_1.UtilsService.buildInsertQuery({
            tableName: 'trades_comments',
            columnData: [tradeComment],
            keysToIgnore: [...arrayToSkip, ...columnToSkip],
            keysToReplace: {
                userId,
                tradeId,
                isDeleted: false,
            },
            addSqlQuery,
            start: 1,
        });
        queriesArray.push(`ins_trades_comment as (${query} RETURNING id, trade_id)`);
        valuesArray.push(...data);
        if ((_a = tradeComment.taggedUsers) === null || _a === void 0 ? void 0 : _a.length) {
            const { query, data } = utils_service_1.UtilsService.buildInsertQuery({
                tableName: 'tagged_users',
                columnData: tradeComment.taggedUsers.map((x) => ({ userId: x })),
                keysToIgnore: ['id', 'createdAt', 'lastUpdated', ' tradeCommentId'],
                addSqlQuery: {
                    trade_comment_id: '(select id from ins_trades_comment)',
                    type: `'${constants_1.TAGGED_TYPE.trade_comment}'`,
                },
                start: valuesArray.length + 1,
            });
            queriesArray.push(`ins_tagged_users as (${query})`);
            valuesArray.push(...data);
        }
        if ((_b = tradeComment.hashtags) === null || _b === void 0 ? void 0 : _b.length) {
            const { data: createHashTagData, query: createHashTagQuery } = utils_service_1.UtilsService.buildInsertQuery({
                tableName: 'master_hashtags',
                columnData: tradeComment.hashtags.map((x) => ({ tagName: x })),
                keysToIgnore: [],
                keysToReplace: [],
                start: valuesArray.length + 1,
            });
            queriesArray.push(`
        ins_master_hashtag AS (
          ${createHashTagQuery}
              ON CONFLICT (tag_name)
                  DO NOTHING
                  RETURNING id
                  ),
                  
        select_hashtag_ids as (
          SELECT * FROM ins_master_hashtag
              UNION
            SELECT 
                id
            from 
                master_hashtags 
            where 
                tag_name in ( ${createHashTagData
                .map((x, i) => `$${valuesArray.length + i + 1}`)
                .join(', ')} )
          ),          
          ins_tagged_hashtags as (
            INSERT INTO tagged_hashtags (hashtag_id, trade_comment_id, type) 
            SELECT
                id, (select id from ins_trades_comment), 'trade_comment'
            FROM
                select_hashtag_ids
            RETURNING *
          )
        `);
            valuesArray.push(...createHashTagData);
        }
        if ((_c = tradeComment.taggedAssets) === null || _c === void 0 ? void 0 : _c.length) {
            const { data: createAssetMasterData, query: createAssetMasterQuery } = utils_service_1.UtilsService.buildInsertQuery({
                tableName: 'master_assets',
                columnData: [...new Set(tradeComment.taggedAssets)].map((x) => ({
                    symbol: x,
                })),
                keysToIgnore: [],
                keysToReplace: [],
                start: valuesArray.length + 1,
            });
            queriesArray.push(`
        ins_master_asset AS (
          ${createAssetMasterQuery}
              ON CONFLICT("symbol")
                DO NOTHING
                  RETURNING id
              ),    
          select_asset_ids as (
            SELECT * FROM ins_master_asset
                UNION
            SELECT id FROM master_assets
                  where 
              symbol in ( ${createAssetMasterData
                .map((x, i) => `$${valuesArray.length + i + 1}`)
                .join(', ')} )
          ),          
          ins_tagged_assets as (
            INSERT INTO tagged_assets (asset_id, trade_comment_id, type) 
            SELECT
                id, (select id from ins_trades_comment), 'trade_comment'
            FROM
                select_asset_ids
            RETURNING *
          )
        `);
            valuesArray.push(...createAssetMasterData);
        }
        return this.db
            .rawQuery(`WITH ${queriesArray.join(', ')} (select * from ins_trades_comment) `, valuesArray, null)
            .pipe((0, rxjs_1.map)((res) => res[0]), (0, rxjs_1.mergeMap)((x) => {
            return this.listCommentOfTrade(tradeId, userId, { limit: 1, offset: 0 }, x.id);
        }), (0, rxjs_1.map)((res) => res[0]));
    }
    listCommentOfTrade(tradeId, userId, query, commentId, getReplies = false) {
        const { limit, offset } = query;
        const data = [tradeId, userId, limit, offset];
        let dbQuery = list_comments_of_trades_db_query_1.listCommentsOfTradeDbQuery;
        if (!commentId) {
            dbQuery = dbQuery.replace('-- PARENT_COMMENT_ID', 'AND tc.parent_comment_id IS NULL');
        }
        else if (getReplies) {
            dbQuery = dbQuery.replace('-- PARENT_COMMENT_ID', 'AND tc.parent_comment_id = $5');
            data.push(commentId);
        }
        else {
            dbQuery = dbQuery.replace('-- PARENT_COMMENT_ID', 'AND tc.id = $5');
            data.push(commentId);
        }
        return this.db.rawQuery(dbQuery, data, null);
    }
    updateCommentOnTrade(userId, commentId, tradeId, updateTradeComment) {
        var _a, _b, _c;
        const valuesArray = [userId, tradeId, commentId];
        const queriesArray = [];
        const arrayToSkip = ['taggedUsers', 'hashtags', 'taggedAssets'];
        const columnToSkip = [
            'createdAt',
            'lastUpdated',
            'id',
            'userId',
            'tradeId',
            'isDeleted',
        ];
        const addSQLQuery = {
            last_updated: 'current_timestamp',
        };
        const { query, data } = utils_service_1.UtilsService.buildUpdateQuery({
            tableName: 'trades_comments',
            columnData: updateTradeComment,
            keysToIgnore: [...arrayToSkip, ...columnToSkip],
            keysToReplace: { isDeleted: false },
            addSqlQuery: addSQLQuery,
            whereCondition: 'user_id = $1 and  trade_id = $2 and id = $3',
            start: 4,
        });
        queriesArray.push(`upd_trades_comment as (${query} RETURNING id)`);
        valuesArray.push(...data);
        if (Array.isArray(updateTradeComment.taggedUsers)) {
            queriesArray.push(`del_tagged_users as (DELETE from tagged_users where  trade_comment_id = $3)`);
            if ((_a = updateTradeComment.taggedUsers) === null || _a === void 0 ? void 0 : _a.length) {
                const { query, data } = utils_service_1.UtilsService.buildInsertQuery({
                    tableName: 'tagged_users',
                    columnData: updateTradeComment.taggedUsers.map((x) => ({
                        userId: x,
                    })),
                    keysToIgnore: ['id', 'createdAt', 'lastUpdated', ' tradeCommentId'],
                    addSqlQuery: {
                        trade_comment_id: '$3',
                        type: `'${constants_1.TAGGED_TYPE.trade_comment}'`,
                    },
                    start: valuesArray.length + 1,
                });
                queriesArray.push(`ins_tagged_users as (${query})`);
                valuesArray.push(...data);
            }
        }
        if (Array.isArray(updateTradeComment.hashtags)) {
            queriesArray.push(`del_trade_hashtags as (DELETE from tagged_hashtags where  trade_comment_id = $3)`);
            if ((_b = updateTradeComment.hashtags) === null || _b === void 0 ? void 0 : _b.length) {
                const { data: createHashTagData, query: createHashTagQuery } = utils_service_1.UtilsService.buildInsertQuery({
                    tableName: 'master_hashtags',
                    columnData: updateTradeComment.hashtags.map((x) => ({
                        tagName: x,
                    })),
                    keysToIgnore: [],
                    keysToReplace: [],
                    start: valuesArray.length + 1,
                });
                queriesArray.push(`
          ins_master_hashtag AS (
            ${createHashTagQuery}
                ON CONFLICT (tag_name)
                    DO NOTHING
                    RETURNING id
                    ),
                    
          select_hashtag_ids as (
            SELECT * FROM ins_master_hashtag
                UNION
              SELECT 
                  id
              from 
                  master_hashtags 
              where 
                  tag_name in ( ${createHashTagData
                    .map((x, i) => `$${valuesArray.length + i + 1}`)
                    .join(', ')} )
            ),          
            ins_tagged_hashtags as (
              INSERT INTO tagged_hashtags (hashtag_id, trade_comment_id, type) 
              SELECT
                  id, $3, 'trade_comment'
              FROM
                  select_hashtag_ids
              RETURNING *
            )
          `);
                valuesArray.push(...createHashTagData);
            }
        }
        if (Array.isArray(updateTradeComment.taggedAssets)) {
            queriesArray.push(`del_trade_assets as (DELETE from tagged_assets where  trade_comment_id = $3)`);
            if ((_c = updateTradeComment.taggedAssets) === null || _c === void 0 ? void 0 : _c.length) {
                const { data: createAssetMasterData, query: createAssetMasterQuery } = utils_service_1.UtilsService.buildInsertQuery({
                    tableName: 'master_assets',
                    columnData: [...new Set(updateTradeComment.taggedAssets)].map((x) => ({
                        symbol: x,
                    })),
                    keysToIgnore: [],
                    keysToReplace: [],
                    start: valuesArray.length + 1,
                });
                queriesArray.push(`
          ins_master_asset AS (
            ${createAssetMasterQuery}
                ON CONFLICT("symbol")
                  DO NOTHING
                    RETURNING id
                ),    
            select_asset_ids as (
              SELECT * FROM ins_master_asset
                  UNION
              SELECT id FROM master_assets
                    where 
                symbol in ( ${createAssetMasterData
                    .map((x, i) => `$${valuesArray.length + i + 1}`)
                    .join(', ')} )
            ),          
            ins_tagged_assets as (
              INSERT INTO tagged_assets (asset_id, trade_comment_id, type) 
              SELECT
                  id, $3, 'trade_comment'
              FROM
                  select_asset_ids
              RETURNING *
            )
          `);
                valuesArray.push(...createAssetMasterData);
            }
        }
        return this.db
            .rawQuery(`WITH ${queriesArray.join(', ')} (select id from upd_trades_comment) `, valuesArray, null)
            .pipe((0, rxjs_1.map)((res) => res[0]), (0, rxjs_1.mergeMap)((x) => {
            return this.listCommentOfTrade(tradeId, userId, { limit: 1, offset: 0 }, x.id);
        }), (0, rxjs_1.map)((res) => res[0]));
    }
    deleteCommentOnTrade(userId, tradeId, commentId) {
        return this.db
            .rawQuery(`UPDATE
          trades_comments
      SET
          is_deleted = TRUE
      WHERE
          user_id = $1 AND  trade_id =$2 AND id = $3
      RETURNING
          1 AS deleted
      `, [userId, tradeId, commentId], null)
            .pipe((0, rxjs_1.map)((x) => x[0] || {}));
    }
    updateLikeForCommentOnTrade(userId, tradeId, commentId, isDeleted) {
        const isDeletedStatus = isDeleted !== 'like';
        return this.db.rawQuery(update_comment_like_db_query_1.UpdateCommentOnTradeLikeDbQuery, [commentId, userId, isDeletedStatus], null);
    }
    getLikeForCommentOnTrade(commentId, queryParams) {
        const { limit, offset } = queryParams;
        const data = [commentId, offset, limit];
        return this.db.rawQuery(list_likes_of_comment_db_query_1.listLikesOfCommentOnTradesDbQuery, data, null);
    }
    getPostsWhichTagged(queryParams, userId, value) {
        const { limit, offset } = queryParams;
        const data = [limit, offset, userId, value];
        return this.db.rawQuery(reverse_search_trade_by_tagged_assets_db_query_1.reverseSearchTradeByTaggedAssetDbQuery, data, null);
    }
};
TradesService = TradesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(configuration_1.default.KEY)),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigType !== "undefined" && config_1.ConfigType) === "function" ? _a : Object, typeof (_b = typeof database_service_1.DatabaseService !== "undefined" && database_service_1.DatabaseService) === "function" ? _b : Object, typeof (_c = typeof s3_service_1.S3Service !== "undefined" && s3_service_1.S3Service) === "function" ? _c : Object, typeof (_d = typeof logging_service_1.Logger !== "undefined" && logging_service_1.Logger) === "function" ? _d : Object])
], TradesService);
exports.TradesService = TradesService;


/***/ }),
/* 148 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.listAllTradesDbQuery = void 0;
exports.listAllTradesDbQuery = `
select tm.id                                                           as trade_id,
       tm.content                                                      as content,
       tm.type                                                         as type,
       extract(epoch from tm.created_at::timestamptz(0))               as created_at,
       count(DISTINCT pl.id) FILTER (WHERE pl.id IS NOT NULL)::integer as likes,
       count(DISTINCT tc.id) FILTER (WHERE tc.id IS NOT NULL)::integer as comments,
       case when pl2.id is not null then true else false end           as is_liked,
       jsonb_build_object(
               'user_id', uc2.id,
               'user_handle', uc2.user_handle,
               'first_name', up2.first_name,
               'last_name', up2.last_name,
               'is_following', case when f2.id is not null then true else false end,
               'profile_image',        json_build_object('image_org', pm7.image_org,
                                      'image_thumb', pm7.image_thumb,
                                      'image_small', pm7.image_small,
                                      'image_medium', pm7.image_medium,
                                      'image_large', pm7.image_large)
           )                                                           as created_by,
       json_agg(
       DISTINCT jsonb_build_object(
               'asset_id', tm.asset_id,
               'symbol', ma.symbol)
           ) FILTER (WHERE tm.asset_id IS NOT NULL)                    AS tagged_assets
from trades_master tm
         --INNER_JOIN_FOLLOWER
         left join tagged_users tu on tm.id = tu.trade_id
         left join user_core uc on uc.id = tu.user_id
         left join user_profile up on uc.id = up.user_id
         left join user_core uc2 on uc2.id = tm.user_id
         left join user_profile up2 on uc2.id = up2.user_id
         LEFT JOIN profile_media pm7 ON pm7.user_id = uc2.id
         LEFT JOIN followers f2 ON f2.user_id = $3 and f2.follower_id = uc2.id 
         left join master_assets ma on tm.asset_id = ma.id
         left join trades_likes pl on pl.trade_id = tm.id AND pl.is_deleted = FALSE
         left join trades_likes pl2 on pl2.trade_id = tm.id AND pl2.is_deleted = FALSE AND pl2.user_id = $3
         left join trades_comments tc on tc.trade_id = tm.id AND tc.is_deleted = FALSE AND tc.parent_comment_id is NULL
WHERE tm.is_deleted = FALSE 
-- user_where_condition 
--FILTER_CONDITION
group by tm.id, uc2.id, uc2.user_handle, up2.first_name, up2.last_name, pl2.id, f2.id, pm7.image_org,
pm7.image_large,
pm7.image_thumb,
pm7.image_small,
pm7.image_medium,
pm7.image_large
ORDER BY tm.last_updated DESC
OFFSET $2 LIMIT $1;
`;


/***/ }),
/* 149 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.listCommentsOfTradeDbQuery = void 0;
exports.listCommentsOfTradeDbQuery = `
WITH replies_for_comment as (
    select 1                                            as temp,
           tc.id                                        as comment_id,
           tc.comment                                   as comment,
           tc.trade_id                                  as trade_id,
           tc.parent_comment_id                         as parent_comment_id,
           count(DISTINCT cl.id) FILTER (WHERE cl.id IS NOT NULL)::integer as likes,
           case when cl2.id is not null then true else false end           as is_liked,
           jsonb_build_object(
                   'user_id', uc2.id,
                   'user_handle', uc2.user_handle,
                   'first_name', up2.first_name,
                   'last_name', up2.last_name,
                   'profile_image',        json_build_object('image_org', pm5.image_org,
                                          'image_thumb', pm5.image_thumb,
                                          'image_small', pm5.image_small,
                                          'image_medium', pm5.image_medium,
                                          'image_large', pm5.image_large)
               )                                        as created_by,
           json_agg(
           DISTINCT jsonb_build_object(
                   'asset_id', ta.asset_id,
                   'symbol', ma.symbol)
               ) FILTER (WHERE ta.asset_id IS NOT NULL) AS tagged_assets,
           json_agg(
           DISTINCT jsonb_build_object(
                   'user_id', uc.id,
                   'user_handle', uc.user_handle,
                   'first_name', up.first_name,
                   'last_name', up.last_name)
               ) FILTER (WHERE uc.id IS NOT NULL)       AS tagged_users
    from trades_comments tc
             left join tagged_users tu on tc.id = tu.trade_comment_id and tu.type = 'trade_comment'
             left join user_core uc on uc.id = tu.user_id
             left join user_profile up on uc.id = up.user_id
             left join user_core uc2 on uc2.id = tc.user_id
             left join user_profile up2 on uc2.id = up2.user_id
             LEFT JOIN profile_media pm5 ON pm5.user_id = uc2.id
             left join tagged_assets ta on ta.trade_comment_id = tc.id and ta.type = 'trade_comment'
             left join master_assets ma on ta.asset_id = ma.id
         left join comment_likes cl on cl.trades_comment_id = tc.id AND cl.is_deleted = FALSE 
         left join comment_likes cl2 on cl2.trades_comment_id = tc.id AND cl2.is_deleted = FALSE AND cl2.user_id = $2
    WHERE tc.is_deleted = FALSE
      AND tc.parent_comment_id IS NOT NULL
      AND tc.trade_id = $1
    group by tc.id, uc2.id, uc2.user_handle, up2.first_name, up2.last_name, cl2.id, pm5.image_org,
    pm5.image_large,
    pm5.image_thumb,
    pm5.image_small,
    pm5.image_medium,
    pm5.image_large
    ORDER BY tc.last_updated DESC
)
select tc.id                                        as comment_id,
       tc.comment                                   as comment,
       tc.trade_id                                  as trade_id,
       count(DISTINCT cl.id) FILTER (WHERE cl.id IS NOT NULL)::integer as likes,
       case when cl2.id is not null then true else false end           as is_liked,
       (
           SELECT count(*)::integer
           from replies_for_comment
           where tc.id = replies_for_comment.parent_comment_id
       )                                            as replies_count,
       (
           SELECT json_agg(row_to_json(replies_for_comment))
           from replies_for_comment
           where tc.id = replies_for_comment.parent_comment_id
           LIMIT 2
       )                                            as replies,
       jsonb_build_object(
               'user_id', uc2.id,
               'user_handle', uc2.user_handle,
               'first_name', up2.first_name,
               'last_name', up2.last_name,
               'profile_image',        json_build_object('image_org', pm5.image_org,
                                      'image_thumb', pm5.image_thumb,
                                      'image_small', pm5.image_small,
                                      'image_medium', pm5.image_medium,
                                      'image_large', pm5.image_large)
           )                                                       as created_by,
       json_agg(
       DISTINCT jsonb_build_object(
               'asset_id', ta.asset_id,
               'symbol', ma.symbol)
           ) FILTER (WHERE ta.asset_id IS NOT NULL) AS tagged_assets,
       json_agg(
       DISTINCT jsonb_build_object(
               'user_id', uc.id,
               'user_handle', uc.user_handle,
               'first_name', up.first_name,
               'last_name', up.last_name)
           ) FILTER (WHERE uc.id IS NOT NULL)       AS tagged_users
from trades_comments tc
         left join tagged_users tu on tc.id = tu.trade_comment_id and tu.type = 'trade_comment'
         left join user_core uc on uc.id = tu.user_id
         left join user_profile up on uc.id = up.user_id
         left join user_core uc2 on uc2.id = tc.user_id
         left join user_profile up2 on uc2.id = up2.user_id
         LEFT JOIN profile_media pm5 ON pm5.user_id = uc2.id
         left join tagged_assets ta on ta.trade_comment_id = tc.id and ta.type = 'trade_comment'
         left join master_assets ma on ta.asset_id = ma.id
         left join comment_likes cl on cl.trades_comment_id = tc.id AND cl.is_deleted = FALSE
         left join comment_likes cl2 on cl2.trades_comment_id = tc.id AND cl2.is_deleted = FALSE AND cl2.user_id = $2
         left join replies_for_comment on replies_for_comment.temp = 1
WHERE tc.is_deleted = FALSE
  -- PARENT_COMMENT_ID
  AND tc.trade_id = $1
group by tc.id, uc2.id, uc2.user_handle, up2.first_name, up2.last_name, cl2.id, pm5.image_org,
pm5.image_large,
pm5.image_thumb,
pm5.image_small,
pm5.image_medium,
pm5.image_large
ORDER BY tc.last_updated DESC
LIMIT $3 OFFSET $4;
`;


/***/ }),
/* 150 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.listLikesOfCommentOnTradesDbQuery = void 0;
exports.listLikesOfCommentOnTradesDbQuery = `
SELECT uc.id                   as user_id,
       uc.user_handle          as user_handle,
       up.first_name           as first_name,
       up.last_name            as last_name,
       jsonb_build_object(
               'image_org', pm.image_org, 'image_thumb', pm.image_thumb, 'image_small',
               pm.image_small, 'image_medium', pm.image_medium, 'image_large',
               pm.image_large) as profile_image
FROM comment_likes cl
         LEFT JOIN user_core uc ON uc.id = cl.user_id
         LEFT JOIN user_profile up ON uc.id = up.user_id
         LEFT JOIN profile_media pm ON pm.user_id = uc.id
WHERE trades_comment_id = $1
group by cl.last_updated, uc.id, uc.id, uc.user_handle, up.first_name, up.last_name,
         pm.image_org, pm.image_thumb, pm.image_small, pm.image_medium,
         pm.image_large
ORDER BY cl.last_updated DESC
OFFSET $2
LIMIT $3
`;


/***/ }),
/* 151 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.listLikesOfTradeDbQuery = void 0;
exports.listLikesOfTradeDbQuery = `
SELECT uc.id                   as user_id,
       uc.user_handle          as user_handle,
       up.first_name           as first_name,
       up.last_name            as last_name,
       jsonb_build_object(
               'image_org', pm.image_org, 'image_thumb', pm.image_thumb, 'image_small',
               pm.image_small, 'image_medium', pm.image_medium, 'image_large',
               pm.image_large) as profile_image
FROM trades_likes tl
         LEFT JOIN user_core uc ON uc.id = tl.user_id
         LEFT JOIN user_profile up ON uc.id = up.user_id
         LEFT JOIN profile_media pm ON pm.user_id = uc.id
WHERE trade_id = $1 AND tl.is_deleted = FALSE
group by tl.last_updated, uc.id, uc.id, uc.user_handle, up.first_name, up.last_name,
         pm.image_org, pm.image_thumb, pm.image_small, pm.image_medium,
         pm.image_large
ORDER BY tl.last_updated DESC
OFFSET $2
LIMIT $3
`;


/***/ }),
/* 152 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.reverseSearchTradeByTaggedAssetDbQuery = void 0;
exports.reverseSearchTradeByTaggedAssetDbQuery = `
WITH select_trade_ids as (
    SELECT id from master_assets where symbol = $4 ORDER BY last_updated DESC 
    OFFSET $2 LIMIT $1
)
select tm.id                                                           as trade_id,
       tm.content                                                      as content,
       tm.type                                                         as type,
       count(DISTINCT pl.id) FILTER (WHERE pl.id IS NOT NULL)::integer as likes,
       count(DISTINCT tc.id) FILTER (WHERE tc.id IS NOT NULL)::integer as comments,
       case when pl2.id is not null then true else false end           as is_liked,
       jsonb_build_object(
               'user_id', uc2.id,
               'user_handle', uc2.user_handle,
               'first_name', up2.first_name,
               'last_name', up2.last_name
           )                                                           as created_by,
       json_agg(
       DISTINCT jsonb_build_object(
               'asset_id', tm.asset_id,
               'symbol', ma.symbol)
           ) FILTER (WHERE tm.asset_id IS NOT NULL)                    AS tagged_assets
from trades_master tm
         left join tagged_users tu on tm.id = tu.trade_id
         left join user_core uc on uc.id = tu.user_id
         left join user_profile up on uc.id = up.user_id
         left join user_core uc2 on uc2.id = tm.user_id
         left join user_profile up2 on uc2.id = up2.user_id
         left join master_assets ma on tm.asset_id = ma.id
         left join trades_likes pl on pl.trade_id = tm.id AND pl.is_deleted = FALSE
         left join trades_likes pl2 on pl2.trade_id = tm.id AND pl2.is_deleted = FALSE AND pl2.user_id = $3
         left join trades_comments tc on tc.trade_id = tm.id AND tc.is_deleted = FALSE AND tc.parent_comment_id is NULL
WHERE tm.is_deleted = FALSE -- user_where_condition
AND tm.asset_id IN (select id from select_trade_ids)
group by tm.id, uc2.id, uc2.user_handle, up2.first_name, up2.last_name, pl2.id
ORDER BY tm.last_updated DESC
OFFSET $2 LIMIT $1;
`;


/***/ }),
/* 153 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateCommentOnTradeLikeDbQuery = void 0;
exports.UpdateCommentOnTradeLikeDbQuery = `
INSERT INTO comment_likes (trades_comment_id, post_comment_id, user_id, is_deleted)
            VALUES ($1, null, $2, $3)
        ON CONFLICT (user_id, trades_comment_id)
            DO UPDATE SET
                is_deleted = EXCLUDED.is_deleted,
                last_updated = CURRENT_TIMESTAMP;
                `;


/***/ }),
/* 154 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateTradeLikeDbQuery = void 0;
exports.UpdateTradeLikeDbQuery = `
INSERT INTO trades_likes (trade_id, user_id, is_deleted)
            VALUES ($1, $2, $3)
        ON CONFLICT (user_id, trade_id)
            DO UPDATE SET
                is_deleted = EXCLUDED.is_deleted,
                last_updated = CURRENT_TIMESTAMP;
                `;


/***/ }),
/* 155 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FollowersModule = void 0;
const common_1 = __webpack_require__(4);
const shared_module_1 = __webpack_require__(27);
const followers_controller_1 = __webpack_require__(156);
const followers_service_1 = __webpack_require__(160);
let FollowersModule = class FollowersModule {
};
FollowersModule = __decorate([
    (0, common_1.Module)({
        imports: [shared_module_1.SharedModule],
        controllers: [followers_controller_1.FollowersController],
        providers: [followers_service_1.FollowersService],
    })
], FollowersModule);
exports.FollowersModule = FollowersModule;


/***/ }),
/* 156 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FollowersController = void 0;
const user_token_payload_decorator_1 = __webpack_require__(68);
const common_1 = __webpack_require__(4);
const swagger_1 = __webpack_require__(7);
const jwt_auth_guard_1 = __webpack_require__(69);
const jwt_strategy_1 = __webpack_require__(65);
const follow_array_of_users_request_dto_1 = __webpack_require__(157);
const list_all_followers_query_dto_1 = __webpack_require__(158);
const list_of_follower_request_1 = __webpack_require__(159);
const followers_service_1 = __webpack_require__(160);
let FollowersController = class FollowersController {
    constructor(followersService) {
        this.followersService = followersService;
    }
    findAll(user, query) {
        return this.followersService.getAllFollowers(user.userId, query);
    }
    ListAllFollowersOfNonLoggedInUser(user, userId, query) {
        return this.followersService.getAllFollowers(userId, query);
    }
    FollowListOfUsers(user, body, followType) {
        return this.followersService.followListOfUsers(user.userId, body.userIds, followType);
    }
    FollowUser(user, userId, followType) {
        return this.followersService.followUser(user.userId, userId, followType);
    }
    RemoveAUserFollowing(user, userId) {
        return this.followersService.RemoveAFollowingUser(user.userId, userId);
    }
};
__decorate([
    (0, common_1.Get)('list'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Get list of followers and Following loggedIn user',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiResponse)({ type: list_of_follower_request_1.ListOfFollowersDto }),
    (0, swagger_1.ApiQuery)({ name: 'limit', description: 'Number of posts to return' }),
    (0, swagger_1.ApiQuery)({
        name: 'offset',
        description: 'From which post to get n-limit posts',
    }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _a : Object, typeof (_b = typeof list_all_followers_query_dto_1.ListAllFollowersQueryDto !== "undefined" && list_all_followers_query_dto_1.ListAllFollowersQueryDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], FollowersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('list/:userId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Get list of followers and Following other users',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiResponse)({ type: list_of_follower_request_1.ListOfFollowersDto }),
    (0, swagger_1.ApiQuery)({ name: 'limit', description: 'Number of posts to return' }),
    (0, swagger_1.ApiQuery)({
        name: 'offset',
        description: 'From which post to get n-limit posts',
    }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _c : Object, Number, typeof (_d = typeof list_all_followers_query_dto_1.ListAllFollowersQueryDto !== "undefined" && list_all_followers_query_dto_1.ListAllFollowersQueryDto) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], FollowersController.prototype, "ListAllFollowersOfNonLoggedInUser", null);
__decorate([
    (0, common_1.Patch)('list/:followType'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Follow a List of Users',
    }),
    (0, swagger_1.ApiParam)({ name: 'followType', enum: ['follow', 'unfollow'] }),
    (0, swagger_1.ApiBody)({ type: follow_array_of_users_request_dto_1.FollowArrayOfUsersDto }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiResponse)({}),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Param)('followType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _e : Object, typeof (_f = typeof follow_array_of_users_request_dto_1.FollowArrayOfUsersDto !== "undefined" && follow_array_of_users_request_dto_1.FollowArrayOfUsersDto) === "function" ? _f : Object, String]),
    __metadata("design:returntype", void 0)
], FollowersController.prototype, "FollowListOfUsers", null);
__decorate([
    (0, common_1.Patch)(':userId/:followType'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Follow a User',
    }),
    (0, swagger_1.ApiParam)({ name: 'userId', type: Number }),
    (0, swagger_1.ApiParam)({ name: 'followType', enum: ['follow', 'unfollow'] }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiResponse)({}),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Param)('followType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _g : Object, Number, String]),
    __metadata("design:returntype", void 0)
], FollowersController.prototype, "FollowUser", null);
__decorate([
    (0, common_1.Delete)(':userId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Remove a user from following loggedIn user',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiResponse)({}),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_h = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _h : Object, Number]),
    __metadata("design:returntype", void 0)
], FollowersController.prototype, "RemoveAUserFollowing", null);
FollowersController = __decorate([
    (0, common_1.Controller)({
        path: 'followers',
        version: '1',
    }),
    (0, swagger_1.ApiTags)('Followers'),
    __metadata("design:paramtypes", [typeof (_j = typeof followers_service_1.FollowersService !== "undefined" && followers_service_1.FollowersService) === "function" ? _j : Object])
], FollowersController);
exports.FollowersController = FollowersController;


/***/ }),
/* 157 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FollowArrayOfUsersDto = void 0;
const class_validator_1 = __webpack_require__(71);
const swagger_1 = __webpack_require__(7);
class FollowArrayOfUsersDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: [Number] }),
    (0, class_validator_1.IsNumber)({}, { each: true }),
    (0, class_validator_1.ArrayUnique)((o) => o),
    __metadata("design:type", Array)
], FollowArrayOfUsersDto.prototype, "userIds", void 0);
exports.FollowArrayOfUsersDto = FollowArrayOfUsersDto;


/***/ }),
/* 158 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ListAllFollowersQueryDto = void 0;
const class_transformer_1 = __webpack_require__(20);
const class_validator_1 = __webpack_require__(71);
class ListAllFollowersQueryDto {
    constructor() {
        this.limit = 8;
        this.offset = 0;
        this.sort = 'latest';
    }
}
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotIn)([0]),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ListAllFollowersQueryDto.prototype, "limit", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ListAllFollowersQueryDto.prototype, "offset", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ListAllFollowersQueryDto.prototype, "sort", void 0);
exports.ListAllFollowersQueryDto = ListAllFollowersQueryDto;


/***/ }),
/* 159 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ListOfFollowersDto = exports.ProfileImage = exports.UserFollowDto = void 0;
const swagger_1 = __webpack_require__(7);
class UserFollowDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UserFollowDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UserFollowDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UserFollowDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UserFollowDto.prototype, "userHandle", void 0);
exports.UserFollowDto = UserFollowDto;
class ProfileImage {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileImage.prototype, "imageOrg", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileImage.prototype, "imageThumb", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileImage.prototype, "imageSmall", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileImage.prototype, "imageMedium", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileImage.prototype, "imageLarge", void 0);
exports.ProfileImage = ProfileImage;
class ListOfFollowersDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: [UserFollowDto] }),
    __metadata("design:type", Array)
], ListOfFollowersDto.prototype, "following", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [UserFollowDto] }),
    __metadata("design:type", Array)
], ListOfFollowersDto.prototype, "followers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", ProfileImage)
], ListOfFollowersDto.prototype, "profileImage", void 0);
exports.ListOfFollowersDto = ListOfFollowersDto;


/***/ }),
/* 160 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var FollowersService_1, _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FollowersService = void 0;
const rxjs_1 = __webpack_require__(16);
const configuration_1 = __webpack_require__(10);
const database_service_1 = __webpack_require__(19);
const logging_service_1 = __webpack_require__(26);
const utils_service_1 = __webpack_require__(23);
const common_1 = __webpack_require__(4);
const config_1 = __webpack_require__(5);
const get_all_follower_list_db_query_1 = __webpack_require__(161);
let FollowersService = FollowersService_1 = class FollowersService {
    constructor(config, db, logger) {
        this.config = config;
        this.db = db;
        this.logger = logger;
        this.logger.setContext(FollowersService_1.name);
    }
    getAllFollowers(userId, queryParams) {
        const { limit, offset } = queryParams;
        const data = [limit, offset, userId];
        return this.db
            .rawQuery(get_all_follower_list_db_query_1.GetAllFollowersListDbQuery, data, null)
            .pipe((0, rxjs_1.map)((x) => { var _a; return (_a = x[0]) !== null && _a !== void 0 ? _a : {}; }));
    }
    followUser(userId, userToFollow, followType) {
        const isDeleted = followType !== 'follow';
        const data = [userId, userToFollow, isDeleted];
        let dbQuery = `INSERT INTO followers (user_id, follower_id, is_deleted)
          VALUES ($1, $2, $3)
      ON CONFLICT (user_id, follower_id)
          DO UPDATE SET
              is_deleted = EXCLUDED.is_deleted,
              last_updated = CURRENT_TIMESTAMP;`;
        if (isDeleted) {
            dbQuery = `DELETE FROM followers where user_id = $1 AND follower_id = $2`;
            data.pop();
        }
        return this.db.rawQuery(dbQuery, data, null).pipe((0, rxjs_1.map)((x) => { var _a; return (_a = x[0]) !== null && _a !== void 0 ? _a : {}; }));
    }
    followListOfUsers(userId, usersToFollow, followType) {
        const isDeleted = followType !== 'follow';
        const valuesArray = [userId];
        const { query, data } = utils_service_1.UtilsService.buildInsertQuery({
            tableName: 'followers',
            columnData: usersToFollow.map((x) => ({
                followerId: x,
                isDeleted,
            })),
            keysToIgnore: ['id', 'createdAt', 'lastUpdated'],
            addSqlQuery: {
                user_id: '$1',
            },
            start: valuesArray.length + 1,
        });
        valuesArray.push(...data);
        console.log({ valuesArray });
        const dbQuery = `${query}
      ON CONFLICT (user_id, follower_id)
          DO UPDATE SET
              is_deleted = EXCLUDED.is_deleted,
              last_updated = CURRENT_TIMESTAMP;`;
        return this.db
            .rawQuery(dbQuery, valuesArray, null)
            .pipe((0, rxjs_1.map)((x) => { var _a; return (_a = x[0]) !== null && _a !== void 0 ? _a : {}; }));
    }
    RemoveAFollowingUser(userId, userToUnFollow) {
        const dbQuery = `DELETE FROM followers where follower_id = $1 AND  user_id = $2`;
        return this.db
            .rawQuery(dbQuery, [userId, userToUnFollow], null)
            .pipe((0, rxjs_1.map)((x) => { var _a; return (_a = x[0]) !== null && _a !== void 0 ? _a : {}; }));
    }
};
FollowersService = FollowersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(configuration_1.default.KEY)),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigType !== "undefined" && config_1.ConfigType) === "function" ? _a : Object, typeof (_b = typeof database_service_1.DatabaseService !== "undefined" && database_service_1.DatabaseService) === "function" ? _b : Object, typeof (_c = typeof logging_service_1.Logger !== "undefined" && logging_service_1.Logger) === "function" ? _c : Object])
], FollowersService);
exports.FollowersService = FollowersService;


/***/ }),
/* 161 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetAllFollowersListDbQuery = void 0;
exports.GetAllFollowersListDbQuery = `
WITH temp_cte AS (
  SELECT
      1 AS temp
),
list_of_following AS (
    select 1 as temp, uc.id, uc.user_handle, up.first_name, up.last_name,       
    json_build_object('image_org', pm.image_org,
    'image_thumb', pm.image_thumb,
    'image_small', pm.image_small,
    'image_medium', pm.image_medium,
    'image_large', pm.image_large) AS profile_image
    from followers f
             left JOIN user_core uc on f.follower_id = uc.id
             left join user_profile up on uc.id = up.user_id
             LEFT JOIN profile_media pm ON pm.user_id = uc.id
    WHERE f.user_id = $3
      AND f.is_deleted IS NOT TRUE
    ORDER BY f.last_updated DESC
    LIMIT $1 OFFSET $2
),
     list_of_followers as (
         select 1 as temp, uc.id, uc.user_handle, up.first_name, up.last_name,       
         json_build_object('image_org', pm.image_org,
         'image_thumb', pm.image_thumb,
         'image_small', pm.image_small,
         'image_medium', pm.image_medium,
         'image_large', pm.image_large) AS profile_image
         from followers f
                  left JOIN user_core uc on f.user_id = uc.id
                  left join user_profile up on uc.id = up.user_id
                  LEFT JOIN profile_media pm ON pm.user_id = uc.id
         WHERE f.follower_id = $3
           AND f.is_deleted IS NOT TRUE
         ORDER BY f.last_updated DESC
         LIMIT $1 OFFSET $2
)
select json_agg(
       DISTINCT jsonb_build_object(
               'user_id', flwing.id,
               'user_handle', flwing.user_handle,
               'first_name', flwing.first_name,
               'last_name', flwing.last_name,
               'profile_image', flwing.profile_image
           )
           ) FILTER (WHERE flwing.id IS NOT NULL)
           AS following,
       json_agg(
       DISTINCT jsonb_build_object(
               'user_id', flwr.id,
               'user_handle', flwr.user_handle,
               'first_name', flwr.first_name,
               'last_name', flwr.last_name,
               'profile_image', flwr.profile_image
           )
           ) FILTER (WHERE flwr.id IS NOT NULL)
           AS followers
FROM
  temp_cte tc
LEFT JOIN list_of_following flwing ON tc.temp = flwing.temp
LEFT JOIN list_of_followers flwr ON tc.temp = flwr.temp
`;


/***/ }),
/* 162 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PortfolioModule = void 0;
const shared_module_1 = __webpack_require__(27);
const common_1 = __webpack_require__(4);
const portfolio_controller_1 = __webpack_require__(163);
const portfolio_service_1 = __webpack_require__(165);
let PortfolioModule = class PortfolioModule {
};
PortfolioModule = __decorate([
    (0, common_1.Module)({
        imports: [shared_module_1.SharedModule],
        controllers: [portfolio_controller_1.PortfolioController],
        providers: [portfolio_service_1.PortfolioService],
    })
], PortfolioModule);
exports.PortfolioModule = PortfolioModule;


/***/ }),
/* 163 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PortfolioController = void 0;
const user_token_payload_decorator_1 = __webpack_require__(68);
const common_1 = __webpack_require__(4);
const swagger_1 = __webpack_require__(7);
const jwt_auth_guard_1 = __webpack_require__(69);
const jwt_strategy_1 = __webpack_require__(65);
const create_portfolio_dto_1 = __webpack_require__(164);
const portfolio_service_1 = __webpack_require__(165);
let PortfolioController = class PortfolioController {
    constructor(portfolioService) {
        this.portfolioService = portfolioService;
    }
    create(user, createPostDto) {
        return this.portfolioService.create(user.userId, createPostDto.name);
    }
    findAll(user, query) {
        return this.portfolioService.findAll(user.userId, query);
    }
    update(user, groupId, body) {
        return this.portfolioService.update(user.userId, groupId, body.name);
    }
    remove(user, groupId) {
        return this.portfolioService.remove(user.userId, groupId);
    }
    createPortfolio(user, portfolio) {
        return this.portfolioService.addPortfolio(user.userId, portfolio);
    }
    listPortfolioByGroup(user, portfolioGroupId) {
        return this.portfolioService.findAllPortfolioOfaGroup(user.userId, portfolioGroupId);
    }
    PatchPortfolioItem(user, portfolioId, body) {
        return this.portfolioService.updatePortfolio(user.userId, portfolioId, body);
    }
    DeletePortfolioItem(user, groupId) {
        return this.portfolioService.remove(user.userId, groupId);
    }
};
__decorate([
    (0, common_1.Post)('group'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a portfolio group',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiBody)({ type: create_portfolio_dto_1.AddPortfolioName }),
    (0, swagger_1.ApiResponse)({}),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _a : Object, typeof (_b = typeof create_portfolio_dto_1.AddPortfolioName !== "undefined" && create_portfolio_dto_1.AddPortfolioName) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], PortfolioController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('group'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a portfolio group',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiQuery)({
        name: 'query',
        description: 'Query variable to search portfolio group',
    }),
    (0, swagger_1.ApiResponse)({ type: [create_portfolio_dto_1.listAllPortfolioGroups] }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Query)('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _c : Object, String]),
    __metadata("design:returntype", void 0)
], PortfolioController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)('group/:groupId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Update a portfolio group name',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiResponse)({}),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)('groupId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _d : Object, Number, typeof (_e = typeof create_portfolio_dto_1.AddPortfolioName !== "undefined" && create_portfolio_dto_1.AddPortfolioName) === "function" ? _e : Object]),
    __metadata("design:returntype", void 0)
], PortfolioController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('group/:groupId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a portfolio group',
    }),
    (0, swagger_1.ApiResponse)({}),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)('groupId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _f : Object, Number]),
    __metadata("design:returntype", void 0)
], PortfolioController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a portfolio',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiBody)({ type: create_portfolio_dto_1.AddPortfolioWithAsset }),
    (0, swagger_1.ApiResponse)({}),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _g : Object, typeof (_h = typeof create_portfolio_dto_1.AddPortfolioWithAsset !== "undefined" && create_portfolio_dto_1.AddPortfolioWithAsset) === "function" ? _h : Object]),
    __metadata("design:returntype", void 0)
], PortfolioController.prototype, "createPortfolio", null);
__decorate([
    (0, common_1.Get)(':portfolioGroupId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'List all assets under a portfolio group',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiResponse)({ type: [create_portfolio_dto_1.GetAllPortFolioResponse] }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)('portfolioGroupId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_j = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _j : Object, Number]),
    __metadata("design:returntype", void 0)
], PortfolioController.prototype, "listPortfolioByGroup", null);
__decorate([
    (0, common_1.Patch)(':portfolioId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Update a portfolio item',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiBody)({ type: create_portfolio_dto_1.UpdatePortfolioWithAsset }),
    (0, swagger_1.ApiResponse)({}),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)('portfolioId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_k = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _k : Object, Number, typeof (_l = typeof create_portfolio_dto_1.UpdatePortfolioWithAsset !== "undefined" && create_portfolio_dto_1.UpdatePortfolioWithAsset) === "function" ? _l : Object]),
    __metadata("design:returntype", void 0)
], PortfolioController.prototype, "PatchPortfolioItem", null);
__decorate([
    (0, common_1.Delete)(':portfolioId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a portfolio group',
    }),
    (0, swagger_1.ApiResponse)({}),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)('groupId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_m = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _m : Object, Number]),
    __metadata("design:returntype", void 0)
], PortfolioController.prototype, "DeletePortfolioItem", null);
PortfolioController = __decorate([
    (0, swagger_1.ApiTags)('Portfolio'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)({
        path: 'portfolio',
        version: '1',
    }),
    __metadata("design:paramtypes", [typeof (_o = typeof portfolio_service_1.PortfolioService !== "undefined" && portfolio_service_1.PortfolioService) === "function" ? _o : Object])
], PortfolioController);
exports.PortfolioController = PortfolioController;


/***/ }),
/* 164 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetAllPortFolioResponse = exports.UpdatePortfolioWithAsset = exports.AddPortfolioWithAsset = exports.listAllPortfolioGroups = exports.AddPortfolioName = void 0;
const class_validator_1 = __webpack_require__(71);
const swagger_1 = __webpack_require__(7);
class AddPortfolioName {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddPortfolioName.prototype, "name", void 0);
exports.AddPortfolioName = AddPortfolioName;
class listAllPortfolioGroups {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], listAllPortfolioGroups.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], listAllPortfolioGroups.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], listAllPortfolioGroups.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], listAllPortfolioGroups.prototype, "isDeleted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], listAllPortfolioGroups.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], listAllPortfolioGroups.prototype, "lastUpdated", void 0);
exports.listAllPortfolioGroups = listAllPortfolioGroups;
class AddPortfolioWithAsset {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Portfolio group ID',
        required: true,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AddPortfolioWithAsset.prototype, "portfolioGroupId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Asset SYMBOL NAME',
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddPortfolioWithAsset.prototype, "assetId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Quantity of stock that purchased' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AddPortfolioWithAsset.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Allocation of stock quantity' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AddPortfolioWithAsset.prototype, "allocation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Price at which asset purchased' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AddPortfolioWithAsset.prototype, "price", void 0);
exports.AddPortfolioWithAsset = AddPortfolioWithAsset;
class UpdatePortfolioWithAsset extends (0, swagger_1.PartialType)(AddPortfolioWithAsset) {
}
exports.UpdatePortfolioWithAsset = UpdatePortfolioWithAsset;
class GetAllPortFolioResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetAllPortFolioResponse.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetAllPortFolioResponse.prototype, "assetId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetAllPortFolioResponse.prototype, "allocation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetAllPortFolioResponse.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetAllPortFolioResponse.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], GetAllPortFolioResponse.prototype, "lastUpdated", void 0);
exports.GetAllPortFolioResponse = GetAllPortFolioResponse;


/***/ }),
/* 165 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PortfolioService = void 0;
const rxjs_1 = __webpack_require__(16);
const configuration_1 = __webpack_require__(10);
const database_service_1 = __webpack_require__(19);
const logging_service_1 = __webpack_require__(26);
const utils_service_1 = __webpack_require__(23);
const common_1 = __webpack_require__(4);
const config_1 = __webpack_require__(5);
const posts_service_1 = __webpack_require__(118);
let PortfolioService = class PortfolioService {
    constructor(config, db, logger) {
        this.config = config;
        this.db = db;
        this.logger = logger;
        this.logger.setContext(posts_service_1.PostsService.name);
    }
    create(userId, name) {
        const columnToSkip = ['createdAt', 'lastUpdated', 'id', 'isDeleted'];
        const { query, data } = utils_service_1.UtilsService.buildInsertQuery({
            tableName: 'portfolio_groups',
            columnData: [
                {
                    name,
                },
            ],
            keysToIgnore: [...columnToSkip],
            keysToReplace: {
                userId,
                isDeleted: false,
            },
            start: 1,
        });
        return this.db.rawQuery(query, data, null);
    }
    findAll(userId, query) {
        let dbQuery = `SELECT * from portfolio_groups WHERE user_id = $1 AND is_deleted IS NOT TRUE
    -- QUERY_LIKE  
    ORDER BY name`;
        const data = [userId];
        if (query) {
            dbQuery = dbQuery.replace('-- QUERY_LIKE', 'AND name ILIKE $2');
            data.push(`${query}%`);
        }
        return this.db.rawQuery(dbQuery, data, null);
    }
    update(userId, id, name) {
        const columnToSkip = ['createdAt', 'lastUpdated', 'id', 'isDeleted'];
        const { query, data } = utils_service_1.UtilsService.buildUpdateQuery({
            tableName: 'portfolio_groups',
            columnData: { name },
            keysToIgnore: [...columnToSkip],
            keysToReplace: { isDeleted: false },
            whereCondition: 'user_id = $1 and id = $2',
            start: 3,
        });
        return this.db.rawQuery(query, [userId, id, ...data], null);
    }
    remove(userId, id) {
        return this.db
            .rawQuery(`UPDATE
        portfolio_groups
        SET
            is_deleted = TRUE
        WHERE
            user_id = $1 AND id = $2
        RETURNING
        1 AS deleted`, [userId, id], null)
            .pipe((0, rxjs_1.map)((x) => x[0] || {}));
    }
    addPortfolio(userId, portfolio) {
        const columnToSkip = [
            'createdAt',
            'lastUpdated',
            'id',
            'isDeleted',
            'assetId',
        ];
        const valuesArray = [];
        const queriesArray = [];
        const { query, data } = utils_service_1.UtilsService.buildInsertQuery({
            tableName: 'portfolio_assets',
            columnData: [portfolio],
            keysToIgnore: [...columnToSkip],
            keysToReplace: {
                isDeleted: false,
            },
            addSqlQuery: {
                asset_id: '(SELECT id from select_asset_ids)',
            },
            start: 1,
        });
        valuesArray.push(...data);
        const { data: createAssetMasterData, query: createAssetMasterQuery } = utils_service_1.UtilsService.buildInsertQuery({
            tableName: 'master_assets',
            columnData: [{ symbol: portfolio.assetId }],
            keysToIgnore: [],
            keysToReplace: [],
            start: valuesArray.length + 1,
        });
        queriesArray.push(`
    upd_master_asset AS (
      ${createAssetMasterQuery}
          ON CONFLICT("symbol")
            DO NOTHING
              RETURNING id
          ),    
      select_asset_ids as (
        SELECT * FROM upd_master_asset
            UNION
        SELECT id FROM master_assets
              where 
          symbol in ( ${createAssetMasterData
            .map((x, i) => `$${valuesArray.length + i + 1}`)
            .join(', ')} )
      )
    `);
        valuesArray.push(...createAssetMasterData);
        queriesArray.push(`ins_portfolio as (
        ${query}
        RETURNING *
      )`);
        return this.db.rawQuery(`WITH ${queriesArray.join(', ')} (select id from ins_portfolio) `, valuesArray, null);
    }
    findAllPortfolioOfaGroup(userId, portfolioGroupId) {
        const dbQuery = `
    select pa.id, ma.symbol as asset_id, pa.allocation, pa.price, pa.quantity, pa.last_updated
    from portfolio_assets pa
    LEFT JOIN master_assets ma on ma.id = pa.asset_id
    LEFT JOIN portfolio_groups pg on pa.portfolio_group_id = pg.id
    WHERE pg.user_id = $1 AND pa.portfolio_group_id = $2 AND pa.is_deleted IS NOT TRUE
    `;
        return this.db.rawQuery(dbQuery, [userId, portfolioGroupId], null);
    }
    updatePortfolio(userId, portfolioId, portfolio) {
        const valuesArray = [portfolioId];
        const queriesArray = [];
        const columnToSkip = [
            'createdAt',
            'lastUpdated',
            'id',
            'isDeleted',
            'assetId',
        ];
        const { query, data } = utils_service_1.UtilsService.buildUpdateQuery({
            tableName: 'portfolio_assets',
            columnData: portfolio,
            keysToIgnore: [...columnToSkip],
            keysToReplace: {
                isDeleted: false,
            },
            addSqlQuery: {
                asset_id: '(SELECT id from select_asset_ids)',
            },
            whereCondition: 'id = $1',
            start: 2,
        });
        valuesArray.push(...data);
        const { data: createAssetMasterData, query: createAssetMasterQuery } = utils_service_1.UtilsService.buildInsertQuery({
            tableName: 'master_assets',
            columnData: [{ symbol: portfolio.assetId }],
            keysToIgnore: [],
            keysToReplace: [],
            start: valuesArray.length + 1,
        });
        queriesArray.push(`
    upd_master_asset AS (
      ${createAssetMasterQuery}
          ON CONFLICT("symbol")
            DO NOTHING
              RETURNING id
          ),    
      select_asset_ids as (
        SELECT * FROM upd_master_asset
            UNION
        SELECT id FROM master_assets
              where 
          symbol in ( ${createAssetMasterData
            .map((x, i) => `$${valuesArray.length + i + 1}`)
            .join(', ')} )
      )
    `);
        valuesArray.push(...createAssetMasterData);
        queriesArray.push(`ins_portfolio as (
        ${query}
        RETURNING *
      )`);
        return this.db.rawQuery(`WITH ${queriesArray.join(', ')} (select id from ins_portfolio) `, valuesArray, null);
    }
    removePortfolio(userId, id) {
        return this.db
            .rawQuery(`UPDATE
        portfolio_assets
        SET
            is_deleted = TRUE
        WHERE
            id = $2
        RETURNING
        1 AS deleted`, [userId, id], null)
            .pipe((0, rxjs_1.map)((x) => x[0] || {}));
    }
};
PortfolioService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(configuration_1.default.KEY)),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigType !== "undefined" && config_1.ConfigType) === "function" ? _a : Object, typeof (_b = typeof database_service_1.DatabaseService !== "undefined" && database_service_1.DatabaseService) === "function" ? _b : Object, typeof (_c = typeof logging_service_1.Logger !== "undefined" && logging_service_1.Logger) === "function" ? _c : Object])
], PortfolioService);
exports.PortfolioService = PortfolioService;


/***/ }),
/* 166 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BookmarkModule = void 0;
const shared_module_1 = __webpack_require__(27);
const common_1 = __webpack_require__(4);
const bookmark_controller_1 = __webpack_require__(167);
const bookmark_service_1 = __webpack_require__(168);
let BookmarkModule = class BookmarkModule {
};
BookmarkModule = __decorate([
    (0, common_1.Module)({
        imports: [shared_module_1.SharedModule],
        controllers: [bookmark_controller_1.BookmarkController],
        providers: [bookmark_service_1.BookmarkService],
    })
], BookmarkModule);
exports.BookmarkModule = BookmarkModule;


/***/ }),
/* 167 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BookmarkController = void 0;
const user_token_payload_decorator_1 = __webpack_require__(68);
const common_1 = __webpack_require__(4);
const swagger_1 = __webpack_require__(7);
const jwt_auth_guard_1 = __webpack_require__(69);
const jwt_strategy_1 = __webpack_require__(65);
const list_all_posts_query_dto_1 = __webpack_require__(107);
const list_all_post_response_dto_1 = __webpack_require__(116);
const bookmark_service_1 = __webpack_require__(168);
let BookmarkController = class BookmarkController {
    constructor(bookmarkService) {
        this.bookmarkService = bookmarkService;
    }
    create(user, postId) {
        return this.bookmarkService.createPostsBookmark(user.userId, postId);
    }
    findAllPosts(user, query) {
        return this.bookmarkService.listAllBookmarkedPosts(user.userId, query);
    }
    remove(user, postId) {
        return this.bookmarkService.DeletePostsBookmark(user.userId, postId);
    }
};
__decorate([
    (0, common_1.Post)(':postId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'bookmark a post',
    }),
    (0, swagger_1.ApiBody)({}),
    (0, swagger_1.ApiResponse)({}),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)('postId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _a : Object, Number]),
    __metadata("design:returntype", void 0)
], BookmarkController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(''),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all saved bookmark of posts in latest order',
    }),
    (0, swagger_1.ApiResponse)({ type: [list_all_post_response_dto_1.ListAllPostsResponseDto] }),
    (0, swagger_1.ApiQuery)({ name: 'limit', description: 'Number of posts to return' }),
    (0, swagger_1.ApiQuery)({
        name: 'offset',
        description: 'From which post to get n-limit posts',
    }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _b : Object, typeof (_c = typeof list_all_posts_query_dto_1.ListAllPostsQueryDto !== "undefined" && list_all_posts_query_dto_1.ListAllPostsQueryDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], BookmarkController.prototype, "findAllPosts", null);
__decorate([
    (0, common_1.Delete)(':postId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a saved post (bookmark)',
    }),
    (0, swagger_1.ApiResponse)({}),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)('postId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _d : Object, Number]),
    __metadata("design:returntype", void 0)
], BookmarkController.prototype, "remove", null);
BookmarkController = __decorate([
    (0, common_1.Controller)({
        path: 'bookmark',
        version: '1',
    }),
    (0, swagger_1.ApiTags)('BookMark'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [typeof (_e = typeof bookmark_service_1.BookmarkService !== "undefined" && bookmark_service_1.BookmarkService) === "function" ? _e : Object])
], BookmarkController);
exports.BookmarkController = BookmarkController;


/***/ }),
/* 168 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var BookmarkService_1, _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BookmarkService = void 0;
const rxjs_1 = __webpack_require__(16);
const configuration_1 = __webpack_require__(10);
const database_service_1 = __webpack_require__(19);
const logging_service_1 = __webpack_require__(26);
const s3_service_1 = __webpack_require__(34);
const common_1 = __webpack_require__(4);
const config_1 = __webpack_require__(5);
const list_all_post_db_query_1 = __webpack_require__(119);
const list_all_post_response_dto_1 = __webpack_require__(116);
let BookmarkService = BookmarkService_1 = class BookmarkService {
    constructor(config, db, S3, logger) {
        this.config = config;
        this.db = db;
        this.S3 = S3;
        this.logger = logger;
        this.logger.setContext(BookmarkService_1.name);
    }
    createPostsBookmark(userId, postId) {
        const dbQuery = `
    INSERT INTO saved_items (user_id, post_id, type)
    VALUES ($1, $2, 'post')`;
        return this.db
            .rawQuery(dbQuery, [userId, postId], null)
            .pipe((0, rxjs_1.map)(() => ({})));
    }
    listAllBookmarkedPosts(loggedInUserId, queryParams) {
        let dbQuery = list_all_post_db_query_1.listAllPostsDbQuery;
        const { limit, offset } = queryParams;
        const data = [limit, offset, loggedInUserId];
        dbQuery = dbQuery.replace('--INNER_JOIN_SAVED_ITEMS', 'INNER JOIN saved_items si ON si.user_id = $3 AND si.post_id = pm.id');
        dbQuery = dbQuery.replace('ORDER BY pm.last_updated DESC', 'ORDER BY si.last_updated DESC');
        dbQuery = dbQuery.replace('--GROUP_BY_SAVED', ', si.last_updated');
        return this.db.rawQuery(dbQuery, data, list_all_post_response_dto_1.ListAllPostsResponseDto);
    }
    DeletePostsBookmark(userId, postId) {
        const dbQuery = `
    DELETE FROM saved_items 
    WHERE user_id = $1 AND post_id = $2 AND type = 'post';`;
        return this.db
            .rawQuery(dbQuery, [userId, postId], null)
            .pipe((0, rxjs_1.map)(() => ({})));
    }
};
BookmarkService = BookmarkService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(configuration_1.default.KEY)),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigType !== "undefined" && config_1.ConfigType) === "function" ? _a : Object, typeof (_b = typeof database_service_1.DatabaseService !== "undefined" && database_service_1.DatabaseService) === "function" ? _b : Object, typeof (_c = typeof s3_service_1.S3Service !== "undefined" && s3_service_1.S3Service) === "function" ? _c : Object, typeof (_d = typeof logging_service_1.Logger !== "undefined" && logging_service_1.Logger) === "function" ? _d : Object])
], BookmarkService);
exports.BookmarkService = BookmarkService;


/***/ }),
/* 169 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SocialLoginModule = void 0;
const shared_module_1 = __webpack_require__(27);
const common_1 = __webpack_require__(4);
const auth_module_1 = __webpack_require__(43);
const google_strategy_1 = __webpack_require__(170);
const social_login_controller_1 = __webpack_require__(173);
const social_login_service_1 = __webpack_require__(174);
let SocialLoginModule = class SocialLoginModule {
};
SocialLoginModule = __decorate([
    (0, common_1.Module)({
        imports: [shared_module_1.SharedModule, auth_module_1.AuthModule],
        controllers: [social_login_controller_1.SocialLoginController],
        providers: [social_login_service_1.SocialLoginService, google_strategy_1.GoogleStrategy],
    })
], SocialLoginModule);
exports.SocialLoginModule = SocialLoginModule;


/***/ }),
/* 170 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GoogleStrategy = void 0;
const dotenv_1 = __webpack_require__(171);
const passport_google_oauth20_1 = __webpack_require__(172);
const configuration_1 = __webpack_require__(10);
const common_1 = __webpack_require__(4);
const config_1 = __webpack_require__(5);
const passport_1 = __webpack_require__(45);
(0, dotenv_1.config)();
let GoogleStrategy = class GoogleStrategy extends (0, passport_1.PassportStrategy)(passport_google_oauth20_1.Strategy, 'google') {
    constructor(config) {
        super({
            clientID: '116117069980-9engdulupkb8cjgtitj4k0vbimsecguk.apps.googleusercontent.com',
            clientSecret: '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',
            callbackURL: 'http://localhost:3000',
            scope: ['email', 'profile'],
        });
        this.config = config;
    }
    async validate(accessToken, refreshToken, profile, done) {
        const { name, emails, photos } = profile;
        const user = {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            picture: photos[0].value,
            accessToken,
        };
        done(null, user);
    }
};
GoogleStrategy = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(configuration_1.default.KEY)),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigType !== "undefined" && config_1.ConfigType) === "function" ? _a : Object])
], GoogleStrategy);
exports.GoogleStrategy = GoogleStrategy;


/***/ }),
/* 171 */
/***/ ((module) => {

"use strict";
module.exports = require("dotenv");

/***/ }),
/* 172 */
/***/ ((module) => {

"use strict";
module.exports = require("passport-google-oauth20");

/***/ }),
/* 173 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SocialLoginController = void 0;
const common_1 = __webpack_require__(4);
const passport_1 = __webpack_require__(45);
const social_login_service_1 = __webpack_require__(174);
let SocialLoginController = class SocialLoginController {
    constructor(socialLoginService) {
        this.socialLoginService = socialLoginService;
    }
    async googleAuth(req) { }
    googleAuthRedirect(req) {
        return this.socialLoginService.googleLogin(req);
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SocialLoginController.prototype, "googleAuth", null);
__decorate([
    (0, common_1.Get)('redirect'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SocialLoginController.prototype, "googleAuthRedirect", null);
SocialLoginController = __decorate([
    (0, common_1.Controller)('social-login'),
    __metadata("design:paramtypes", [typeof (_a = typeof social_login_service_1.SocialLoginService !== "undefined" && social_login_service_1.SocialLoginService) === "function" ? _a : Object])
], SocialLoginController);
exports.SocialLoginController = SocialLoginController;


/***/ }),
/* 174 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var SocialLoginService_1, _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SocialLoginService = void 0;
const rxjs_1 = __webpack_require__(16);
const configuration_1 = __webpack_require__(10);
const database_service_1 = __webpack_require__(19);
const logging_service_1 = __webpack_require__(26);
const common_1 = __webpack_require__(4);
const config_1 = __webpack_require__(5);
const auth_service_1 = __webpack_require__(46);
const add_user_db_query_1 = __webpack_require__(49);
const get_user_by_email_db_query_1 = __webpack_require__(52);
const get_user_by_email_db_dto_1 = __webpack_require__(60);
const user_create_return_db_dto_1 = __webpack_require__(61);
let SocialLoginService = SocialLoginService_1 = class SocialLoginService {
    constructor(config, db, logger, authService) {
        this.config = config;
        this.db = db;
        this.logger = logger;
        this.authService = authService;
        this.logger.setContext(SocialLoginService_1.name);
    }
    googleLogin(req) {
        if (!req.user) {
            return 'No user from google';
        }
        const { accessToken, email, firstName, lastName, picture } = req.user;
        return this.db
            .rawQuery(get_user_by_email_db_query_1.getUserByEmailDbQuery, [email], get_user_by_email_db_dto_1.GetUserByEmailDbDto)
            .pipe((0, rxjs_1.map)((res) => { var _a; return (_a = res[0]) !== null && _a !== void 0 ? _a : null; }), (0, rxjs_1.switchMap)((res) => {
            if (!res) {
                const userHandleTail = Math.floor(Math.random() * 90000) + 10000;
                const userHandle = `${firstName}_${lastName}_${userHandleTail}`.toLowerCase();
                return this.db
                    .rawQuery(add_user_db_query_1.addUserSocialLoginDbQuery, [email, firstName, lastName, userHandle], user_create_return_db_dto_1.UserCreateReturnDto)
                    .pipe((0, rxjs_1.switchMap)(() => {
                    return this.db
                        .rawQuery(get_user_by_email_db_query_1.getUserByEmailDbQuery, [email], get_user_by_email_db_dto_1.GetUserByEmailDbDto)
                        .pipe((0, rxjs_1.map)((res) => { var _a; return (_a = res[0]) !== null && _a !== void 0 ? _a : null; }));
                }));
            }
            else {
                if (!res.isSocialLogin) {
                    throw new common_1.ForbiddenException('Email already exists! Try login via email method');
                }
                return (0, rxjs_1.of)(res);
            }
        }), (0, rxjs_1.map)((user) => {
            return this.authService.login(user);
        }));
    }
};
SocialLoginService = SocialLoginService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(configuration_1.default.KEY)),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigType !== "undefined" && config_1.ConfigType) === "function" ? _a : Object, typeof (_b = typeof database_service_1.DatabaseService !== "undefined" && database_service_1.DatabaseService) === "function" ? _b : Object, typeof (_c = typeof logging_service_1.Logger !== "undefined" && logging_service_1.Logger) === "function" ? _c : Object, typeof (_d = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _d : Object])
], SocialLoginService);
exports.SocialLoginService = SocialLoginService;


/***/ }),
/* 175 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationsModule = void 0;
const shared_module_1 = __webpack_require__(27);
const common_1 = __webpack_require__(4);
const notifications_controller_1 = __webpack_require__(176);
const notifications_service_1 = __webpack_require__(179);
let NotificationsModule = class NotificationsModule {
};
NotificationsModule = __decorate([
    (0, common_1.Module)({
        imports: [shared_module_1.SharedModule],
        controllers: [notifications_controller_1.NotificationsController],
        providers: [notifications_service_1.NotificationsService],
    })
], NotificationsModule);
exports.NotificationsModule = NotificationsModule;


/***/ }),
/* 176 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationsController = void 0;
const user_token_payload_decorator_1 = __webpack_require__(68);
const common_1 = __webpack_require__(4);
const swagger_1 = __webpack_require__(7);
const jwt_auth_guard_1 = __webpack_require__(69);
const jwt_strategy_1 = __webpack_require__(65);
const mark_notification_as_read_dto_1 = __webpack_require__(177);
const notification_list_response_dto_1 = __webpack_require__(178);
const notifications_service_1 = __webpack_require__(179);
let NotificationsController = class NotificationsController {
    constructor(notificationsService) {
        this.notificationsService = notificationsService;
    }
    findAll(user) {
        return this.notificationsService.getAllNotifications(user.userId);
    }
    create(user, createPostDto) {
        return this.notificationsService.markNotificationsAsRead(user.userId, createPostDto);
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all notifications of logged in user',
    }),
    (0, swagger_1.ApiBody)({
        type: [notification_list_response_dto_1.NotificationListResponseDto],
    }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _a : Object]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('read'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Mark notification as read',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiBody)({ type: [mark_notification_as_read_dto_1.NotificationMarkAsReadRequestDto] }),
    (0, swagger_1.ApiResponse)({}),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof jwt_strategy_1.DecodedTokenPayload !== "undefined" && jwt_strategy_1.DecodedTokenPayload) === "function" ? _b : Object, Array]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "create", null);
NotificationsController = __decorate([
    (0, common_1.Controller)({
        path: 'notifications',
        version: '1',
    }),
    (0, swagger_1.ApiTags)('Notifications'),
    __metadata("design:paramtypes", [typeof (_c = typeof notifications_service_1.NotificationsService !== "undefined" && notifications_service_1.NotificationsService) === "function" ? _c : Object])
], NotificationsController);
exports.NotificationsController = NotificationsController;


/***/ }),
/* 177 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationMarkAsReadRequestDto = void 0;
const swagger_1 = __webpack_require__(7);
class NotificationMarkAsReadRequestDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], NotificationMarkAsReadRequestDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], NotificationMarkAsReadRequestDto.prototype, "eventParentId", void 0);
exports.NotificationMarkAsReadRequestDto = NotificationMarkAsReadRequestDto;


/***/ }),
/* 178 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationListResponseDto = void 0;
const swagger_1 = __webpack_require__(7);
class NotificationListResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], NotificationListResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], NotificationListResponseDto.prototype, "text", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], NotificationListResponseDto.prototype, "eventParentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], NotificationListResponseDto.prototype, "lastUpdated", void 0);
exports.NotificationListResponseDto = NotificationListResponseDto;


/***/ }),
/* 179 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var NotificationsService_1, _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationsService = void 0;
const rxjs_1 = __webpack_require__(16);
const configuration_1 = __webpack_require__(10);
const database_service_1 = __webpack_require__(19);
const logging_service_1 = __webpack_require__(26);
const common_1 = __webpack_require__(4);
const config_1 = __webpack_require__(5);
const get_notifications_of_user_1 = __webpack_require__(180);
let NotificationsService = NotificationsService_1 = class NotificationsService {
    constructor(config, db, logger) {
        this.config = config;
        this.db = db;
        this.logger = logger;
        this.logger.setContext(NotificationsService_1.name);
    }
    getAllNotifications(userId) {
        const data = [userId];
        return this.db.rawQuery(get_notifications_of_user_1.getNotificationOfUserDbQuery, data, null);
    }
    markNotificationsAsRead(userId, notificationList) {
        const queryArray = [];
        const result = notificationList.reduce(function (r, a) {
            r[a.type] = r[a.type] || [];
            r[a.type].push(a.eventParentId);
            return r;
        }, Object.create(null));
        const postCommentIds = result['post_comment'];
        const tradeCommentIds = result['trade_comment'];
        const postSharedIds = result['post_shared'];
        delete result['post_comment'];
        delete result['trade_comment'];
        delete result['post_shared'];
        const idsToUpdateDirectly = [...Object.values(result)].flat();
        console.log(result);
        if (postCommentIds === null || postCommentIds === void 0 ? void 0 : postCommentIds.length) {
            const updatePostCommentQuery = `
      UPDATE
          notification_events ne
      SET
          is_read = TRUE
      WHERE
          ne.event_parent_id IN (
              SELECT
                  id
              FROM
                  posts_comments pc
              WHERE
                  post_id IN (${postCommentIds.join(', ')}))
      `;
            queryArray.push(`update_post_comment_query as ( ${updatePostCommentQuery})`);
        }
        if (tradeCommentIds === null || tradeCommentIds === void 0 ? void 0 : tradeCommentIds.length) {
            const updateTradeCommentQuery = `
      UPDATE
          notification_events ne
      SET
          is_read = TRUE
      WHERE
          ne.event_parent_id IN (
              SELECT
                  id
              FROM
                  trades_comments tc
              WHERE
                  trade_id IN (${tradeCommentIds.join(', ')}))
      `;
            queryArray.push(`update_trade_comment_query as ( ${updateTradeCommentQuery})`);
        }
        if (postSharedIds === null || postSharedIds === void 0 ? void 0 : postSharedIds.length) {
            console.log({ postSharedIds });
            const postSharedQuery = `
      UPDATE
          notification_events ne
      SET
          is_read = TRUE
      WHERE
          ne.event_parent_id IN (
              SELECT
                  post_id
              FROM
                  posts_shared ps
              WHERE
                  ps.shared_post_id in (${postSharedIds.join(', ')}))
      `;
            queryArray.push(`update_post_shared_query as ( ${postSharedQuery})`);
        }
        if (idsToUpdateDirectly === null || idsToUpdateDirectly === void 0 ? void 0 : idsToUpdateDirectly.length) {
            const updateTradeCommentQuery = `
      UPDATE
          notification_events ne
      SET
          is_read = TRUE
      WHERE
          ne.event_parent_id IN (${idsToUpdateDirectly.join(', ')})
      `;
            queryArray.push(`update_events_query as ( ${updateTradeCommentQuery})`);
        }
        return this.db
            .rawQuery(`WITH ${queryArray.join(', ')} select 1 as success;`, [], null)
            .pipe((0, rxjs_1.map)((res) => res[0]));
    }
};
NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(configuration_1.default.KEY)),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigType !== "undefined" && config_1.ConfigType) === "function" ? _a : Object, typeof (_b = typeof database_service_1.DatabaseService !== "undefined" && database_service_1.DatabaseService) === "function" ? _b : Object, typeof (_c = typeof logging_service_1.Logger !== "undefined" && logging_service_1.Logger) === "function" ? _c : Object])
], NotificationsService);
exports.NotificationsService = NotificationsService;


/***/ }),
/* 180 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getNotificationOfUserDbQuery = void 0;
exports.getNotificationOfUserDbQuery = `
WITH temp_cte AS (
    SELECT
        1 AS temp
),
liked_post_cte AS (
    SELECT
        1 AS temp,
        'post_like' AS type,
        CASE WHEN count(*) > 1 THEN
            ss.first_name || ' ' || ss.last_name || ' and' || count(*) - 1 || ' other ' || ' liked your post: ' || mp."content"
        ELSE
            ss.first_name || ' ' || ss.last_name || ' liked your post: ' || mp."content"
        END AS text,
        ne.event_parent_id,
        extract(epoch from ss.last_updated::timestamptz(0)) as last_updated
    FROM
        notification_events ne
        INNER JOIN master_notification_types mnt ON ne.event_type = mnt.id
            AND mnt.type = 'post_like'
        INNER JOIN posts_master mp ON mp.id = ne.event_parent_id
        INNER JOIN ( SELECT DISTINCT ON (event_parent_id)
                event_parent_id,
                up.first_name,
                up.last_name,
                ne.last_updated
            FROM
                notification_events ne
                INNER JOIN master_notification_types mnt ON ne.event_type = mnt.id
                    AND mnt.type = 'post_like'
                INNER JOIN posts_master mp ON mp.id = ne.event_parent_id
                LEFT JOIN user_profile up ON up.user_id = ne.created_by
            WHERE
                target_user = $1
                AND target_user != created_by
                AND ne.is_deleted IS NOT TRUE AND ne.is_read IS NOT TRUE
            ORDER BY
                event_parent_id,
                ne.last_updated DESC) ss ON ne.event_parent_id = ss.event_parent_id
        WHERE
            target_user = $1
            AND target_user != created_by
            AND ne.is_deleted IS NOT TRUE AND ne.is_read IS NOT TRUE
        GROUP BY
            ne.event_parent_id,
            mp."content",
            ss.first_name,
            ss.last_name,
            ss.last_updated
),
liked_trade_cte AS (
    SELECT
        1 AS temp,
        'trade_like' AS type,
        CASE WHEN count(*) > 1 THEN
            ss.first_name || ' ' || ss.last_name || ' and' || count(*) - 1 || ' other ' || ' liked your trade: ' || tm."content"
        ELSE
            ss.first_name || ' ' || ss.last_name || ' liked your trade: ' || tm."content"
        END AS text,
        ne.event_parent_id,
        extract(epoch from ss.last_updated::timestamptz(0)) as last_updated
    FROM
        notification_events ne
        INNER JOIN master_notification_types mnt ON ne.event_type = mnt.id
            AND mnt.type = 'trade_like'
        INNER JOIN trades_master tm ON tm.id = ne.event_parent_id
        INNER JOIN ( SELECT DISTINCT ON (event_parent_id)
                event_parent_id,
                up.first_name,
                up.last_name,
                ne.last_updated
            FROM
                notification_events ne
                INNER JOIN master_notification_types mnt ON ne.event_type = mnt.id
                    AND mnt.type = 'trade_like'
                INNER JOIN trades_master tm ON tm.id = ne.event_parent_id
                LEFT JOIN user_profile up ON up.user_id = ne.created_by
            WHERE
                target_user = $1
                AND target_user != created_by
                AND ne.is_deleted IS NOT TRUE AND ne.is_read IS NOT TRUE
            ORDER BY
                event_parent_id,
                ne.last_updated DESC) ss ON ne.event_parent_id = ss.event_parent_id
        WHERE
            target_user = $1
            AND target_user != created_by
            AND ne.is_deleted IS NOT TRUE AND ne.is_read IS NOT TRUE
        GROUP BY
            ne.event_parent_id,
            tm."content",
            ss.first_name,
            ss.last_name,
            ss.last_updated
),
post_comment_and_reply_cte AS (
    SELECT
        1 AS temp,
        CASE WHEN pc.parent_comment_id IS NOT NULL THEN
            'post_comment_like'
        ELSE
            'post_reply_like'
        END AS type,
        CASE WHEN pc.parent_comment_id IS NOT NULL THEN
            CASE WHEN count(*) > 1 THEN
                ss.first_name || ' ' || ss.last_name || ' and ' || count(*) - 1 || ' other ' || ' liked your reply on a post: "' || pc.comment || '"'
            ELSE
                ss.first_name || ' ' || ss.last_name || ' liked your reply on a post: "' || pc.comment || '"'
            END
        ELSE
            CASE WHEN count(*) > 1 THEN
                ss.first_name || ' ' || ss.last_name || ' and ' || count(*) - 1 || ' other ' || ' liked your comment on a post: "' || pc.comment || '"'
            ELSE
                ss.first_name || ' ' || ss.last_name || ' liked your comment on a post: "' || pc.comment || '"'
            END
        END AS text,
        ne.event_parent_id,
        extract(epoch from ss.last_updated::timestamptz(0)) as last_updated
    FROM
        notification_events ne
        INNER JOIN master_notification_types mnt ON ne.event_type = mnt.id
            AND (mnt.type = 'comment_like'
                OR mnt.type = 'reply_like')
            INNER JOIN posts_comments pc ON pc.id = ne.event_parent_id
            INNER JOIN ( SELECT DISTINCT ON (event_parent_id)
                    event_parent_id,
                    up.first_name,
                    up.last_name,
                    ne.last_updated
                FROM
                    notification_events ne
                    INNER JOIN master_notification_types mnt ON ne.event_type = mnt.id
                        AND (mnt.type = 'comment_like'
                            OR mnt.type = 'reply_like')
                        INNER JOIN posts_comments pc ON pc.id = ne.event_parent_id
                        LEFT JOIN user_profile up ON up.user_id = ne.created_by
                    WHERE
                        target_user = $1
                        AND target_user != created_by
                        AND ne.is_deleted IS NOT TRUE AND ne.is_read IS NOT TRUE
                    ORDER BY
                        event_parent_id,
                        ne.last_updated DESC) ss ON ne.event_parent_id = ss.event_parent_id
                WHERE
                    target_user = $1
                    AND target_user != created_by
                    AND ne.is_deleted IS NOT TRUE AND ne.is_read IS NOT TRUE
                GROUP BY
                    ne.event_parent_id,
                    pc.comment,
                    pc.parent_comment_id,
                    ss.first_name,
                    ss.last_name,
                    ss.last_updated
),
trades_comments_and_reply_cte AS (
    SELECT
        CASE WHEN tc.parent_comment_id IS NOT NULL THEN
            'trade_comment_like'
        ELSE
            'trade_reply_like'
        END AS type,
        CASE WHEN tc.parent_comment_id IS NOT NULL THEN
            CASE WHEN count(*) > 1 THEN
                ss.first_name || ' ' || ss.last_name || ' and ' || count(*) - 1 || ' other ' || ' liked your reply on a trade: "' || tc.comment || '"'
            ELSE
                ss.first_name || ' ' || ss.last_name || ' liked your reply on a trade: "' || tc.comment || '"'
            END
        ELSE
            CASE WHEN count(*) > 1 THEN
                ss.first_name || ' ' || ss.last_name || ' and ' || count(*) - 1 || ' other ' || ' liked your comment on a trade: "' || tc.comment || '"'
            ELSE
                ss.first_name || ' ' || ss.last_name || ' liked your comment on a trade: "' || tc.comment || '"'
            END
        END AS text,
        ne.event_parent_id,
        extract(epoch from ss.last_updated::timestamptz(0)) as last_updated
    FROM
        notification_events ne
        INNER JOIN master_notification_types mnt ON ne.event_type = mnt.id
            AND (mnt.type = 'comment_like'
                OR mnt.type = 'reply_like')
            INNER JOIN trades_comments tc ON tc.id = ne.event_parent_id
            INNER JOIN ( SELECT DISTINCT ON (event_parent_id)
                    event_parent_id,
                    up.first_name,
                    up.last_name,
                    ne.last_updated
                FROM
                    notification_events ne
                    INNER JOIN master_notification_types mnt ON ne.event_type = mnt.id
                        AND (mnt.type = 'comment_like'
                            OR mnt.type = 'reply_like')
                        INNER JOIN trades_comments tc ON tc.id = ne.event_parent_id
                        LEFT JOIN user_profile up ON up.user_id = ne.created_by
                    WHERE
                        target_user = $1
                        AND target_user != created_by
                        AND ne.is_deleted IS NOT TRUE AND ne.is_read IS NOT TRUE
                    ORDER BY
                        event_parent_id,
                        ne.last_updated DESC) ss ON ne.event_parent_id = ss.event_parent_id
                WHERE
                    target_user = $1
                    AND target_user != created_by
                    AND ne.is_deleted IS NOT TRUE AND ne.is_read IS NOT TRUE
                GROUP BY
                    ne.event_parent_id,
                    tc.comment,
                    tc.parent_comment_id,
                    ss.first_name,
                    ss.last_name,
                    ss.last_updated
),
commented_on_post_cte AS (
    SELECT
        'post_comment' AS type,
        CASE WHEN count(*) > 1 THEN
            ss.first_name || ' ' || ss.last_name || ' and ' || count(*) - 1 || ' other ' || ' commented on your post: "' || pm.content || '"'
        ELSE
            ss.first_name || ' ' || ss.last_name || ' commented on your post: "' || pm.content || '"'
        END AS text,
        pm.id,
        ss.event_parent_id,
        extract(epoch from ss.last_updated::timestamptz(0)) as last_updated
    FROM
        notification_events ne
        INNER JOIN master_notification_types mnt ON ne.event_type = mnt.id
            AND mnt.type = 'post_comment'
        INNER JOIN posts_comments pc ON pc.id = ne.event_parent_id
        INNER JOIN posts_master pm ON pm.id = pc.post_id
        INNER JOIN ( SELECT DISTINCT ON (pc.post_id)
                pc.post_id,
                event_parent_id,
                up.first_name,
                up.last_name,
                ne.last_updated
            FROM
                notification_events ne
                INNER JOIN master_notification_types mnt ON ne.event_type = mnt.id
                    AND mnt.type = 'post_comment'
                INNER JOIN posts_comments pc ON pc.id = ne.event_parent_id
                LEFT JOIN user_profile up ON up.user_id = ne.created_by
            WHERE
                target_user = $1
                AND target_user != created_by
                AND ne.is_deleted IS NOT TRUE AND ne.is_read IS NOT TRUE
            ORDER BY
                pc.post_id,
                ne.last_updated DESC) ss ON ss.post_id = pc.post_id
        WHERE
            target_user = $1
            AND target_user != created_by
            AND ne.is_deleted IS NOT TRUE AND ne.is_read IS NOT TRUE
        GROUP BY
            pc.post_id,
            ss.first_name,
            ss.last_name,
            pm.content,
            pm.id,
            ss.last_updated,
            ss.event_parent_id
),
commented_on_trade_cte AS (
    SELECT
        CASE WHEN count(*) > 1 THEN
            ss.first_name || ' ' || ss.last_name || ' and ' || count(*) - 1 || ' other ' || ' commented on your trade: "' || tm.content || '"'
        ELSE
            ss.first_name || ' ' || ss.last_name || ' commented on your trade: "' || tm.content || '"'
        END AS text,
        tm.id,
        extract(epoch from ss.last_updated::timestamptz(0)) as last_updated,
        ss.event_parent_id,
        'trade_comment' AS type
    FROM
        notification_events ne
        INNER JOIN master_notification_types mnt ON ne.event_type = mnt.id
            AND mnt.type = 'trade_comment'
        INNER JOIN trades_comments tc ON tc.id = ne.event_parent_id
        INNER JOIN trades_master tm ON tm.id = tc.trade_id
        INNER JOIN ( SELECT DISTINCT ON (tc.trade_id)
                tc.trade_id,
                event_parent_id,
                up.first_name,
                up.last_name,
                ne.last_updated
            FROM
                notification_events ne
                INNER JOIN master_notification_types mnt ON ne.event_type = mnt.id
                    AND mnt.type = 'trade_comment'
                INNER JOIN trades_comments tc ON tc.id = ne.event_parent_id
                LEFT JOIN user_profile up ON up.user_id = ne.created_by
            WHERE
                target_user = $1
                AND target_user != created_by
                AND ne.is_deleted IS NOT TRUE AND ne.is_read IS NOT TRUE
            ORDER BY
                tc.trade_id,
                ne.last_updated DESC) ss ON ss.trade_id = tc.trade_id
        WHERE
            target_user = $1
            AND target_user != created_by
            AND ne.is_deleted IS NOT TRUE AND ne.is_read IS NOT TRUE
        GROUP BY
            tc.trade_id,
            ss.first_name,
            ss.last_name,
            tm.content,
            tm.id,
            ss.last_updated,
            ss.event_parent_id
),
shared_post_cte AS (
    SELECT
        CASE WHEN count(*) > 1 THEN
            ss.first_name || ' ' || ss.last_name || ' and ' || count(*) - 1 || ' other ' || ' shared your post: "' || pm.content || '"'
        ELSE
            ss.first_name || ' ' || ss.last_name || ' shared your post:  "' || pm.content || '"'
        END AS text,
        pm.id as event_parent_id,
        extract(epoch from ss.last_updated::timestamptz(0)) as last_updated,
        'post_shared' AS type
    FROM
        notification_events ne
        INNER JOIN master_notification_types mnt ON ne.event_type = mnt.id
            AND mnt.type = 'post_shared'
        INNER JOIN posts_shared ps ON ps.post_id = ne.event_parent_id
        INNER JOIN posts_master pm ON pm.id = ps.shared_post_id
        LEFT JOIN user_profile up ON up.user_id = ne.created_by
        INNER JOIN ( SELECT DISTINCT ON (ps.shared_post_id)
                ps.shared_post_id,
                event_parent_id,
                up.first_name,
                up.last_name,
                ne.last_updated
            FROM
                notification_events ne
                INNER JOIN master_notification_types mnt ON ne.event_type = mnt.id
                    AND mnt.type = 'post_shared'
                INNER JOIN posts_shared ps ON ps.post_id = ne.event_parent_id
                INNER JOIN posts_master pm ON pm.id = ps.shared_post_id
                LEFT JOIN user_profile up ON up.user_id = ne.created_by
            WHERE
                target_user = $1
                AND target_user != created_by
                AND ne.is_deleted IS NOT TRUE AND ne.is_read IS NOT TRUE
            ORDER BY
                ps.shared_post_id,
                ne.last_updated DESC) ss ON ss.shared_post_id = ps.shared_post_id
        WHERE
            target_user = $1
            AND target_user != created_by
            AND ne.is_deleted IS NOT TRUE AND ne.is_read IS NOT TRUE
        GROUP BY
            ss.first_name,
            ss.last_name,
            pm.content,
            pm.id,
            ss.last_updated,
            ss.event_parent_id
),
tagged_user_cte AS (
    SELECT
        CASE WHEN count(*) > 1 THEN
            up.first_name || ' ' || up.last_name || ' and ' || count(*) - 1 || ' other ' || ' tagged you on a post: "' || pm.content || '"'
        ELSE
            up.first_name || ' ' || up.last_name || ' tagged you on a post: "' || pm.content || '"'
        END AS text,
        extract(epoch from ne.last_updated::timestamptz(0)) as last_updated,
        ne.event_parent_id,
        'post_user_tagged' AS type
    FROM
        notification_events ne
        INNER JOIN master_notification_types mnt ON ne.event_type = mnt.id
            AND mnt.type = 'post_user_tagged'
        INNER JOIN tagged_users tu ON tu.id = ne.event_parent_id
            AND tu."type" = 'post'
        INNER JOIN posts_master pm ON pm.id = tu.post_id
        LEFT JOIN user_profile up ON up.user_id = pm.user_id
    WHERE
        target_user = $1
        AND target_user != created_by
        AND ne.is_deleted IS NOT TRUE AND ne.is_read IS NOT TRUE
    GROUP BY
        up.first_name,
        up.last_name,
        pm.content,
        pm.id,
        ne.last_updated,
        ne.event_parent_id
),
following_user_cte AS (
    SELECT
        CASE WHEN count(*) > 1 THEN
            ss.first_name || ' ' || ss.last_name || ' and ' || count(*) - 1 || ' other ' || ' started following you'
        ELSE
            ss.first_name || ' ' || ss.last_name || ' started following you'
        END AS text,
        extract(epoch from ss.last_updated::timestamptz(0)) as last_updated,
        f.follower_id,
        'follow' AS type,
        ss.event_parent_id
    FROM
        notification_events ne
        INNER JOIN master_notification_types mnt ON ne.event_type = mnt.id
            AND mnt.type = 'follow'
        INNER JOIN followers f ON f.id = ne.event_parent_id
        INNER JOIN ( SELECT DISTINCT ON (f.follower_id)
                f.follower_id,
                up.first_name,
                up.last_name,
                ne.last_updated,
                ne.event_parent_id
            FROM
                notification_events ne
                INNER JOIN master_notification_types mnt ON ne.event_type = mnt.id
                    AND mnt.type = 'follow'
                INNER JOIN followers f ON f.id = ne.event_parent_id
                LEFT JOIN user_profile up ON f.user_id = up.id
            WHERE
                target_user = $1
                AND target_user != created_by
                AND ne.is_deleted IS NOT TRUE AND ne.is_read IS NOT TRUE
            ORDER BY
                f.follower_id,
                ne.last_updated DESC) ss ON ss.follower_id = f.follower_id
        WHERE
            target_user = $1
            AND target_user != created_by
            AND ne.is_deleted IS NOT TRUE AND ne.is_read IS NOT TRUE
        GROUP BY
            f.follower_id,
            ss.first_name,
            ss.last_name,
            ss.last_updated,
            ss.event_parent_id
),
combined_cte AS (
    SELECT
        type,
        text,
        event_parent_id,
        last_updated
    FROM
        liked_post_cte lpc
    UNION
    SELECT
        type,
        text,
        event_parent_id,
        last_updated
    FROM
        liked_trade_cte ltc
    UNION
    SELECT
        type,
        text,
        event_parent_id,
        last_updated
    FROM
        post_comment_and_reply_cte pcarc
    UNION
    SELECT
        type,
        text,
        event_parent_id,
        last_updated
    FROM
        trades_comments_and_reply_cte tcarc
    UNION
    SELECT
        type,
        text,
        event_parent_id,
        last_updated
    FROM
        commented_on_post_cte copc
    UNION
    SELECT
        type,
        text,
        event_parent_id,
        last_updated
    FROM
        commented_on_trade_cte cotc
    UNION
    SELECT
        type,
        text,
        event_parent_id,
        last_updated
    FROM
        shared_post_cte spc
    UNION
    SELECT
        type,
        text,
        event_parent_id,
        last_updated
    FROM
        tagged_user_cte tuc
    UNION
    SELECT
        type,
        text,
        event_parent_id,
        last_updated
    FROM
        following_user_cte fuc
)
SELECT
    *
FROM
    combined_cte cc
ORDER BY
    cc.last_updated DESC

`;


/***/ }),
/* 181 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RoomModule = void 0;
const common_1 = __webpack_require__(4);
const shared_module_1 = __webpack_require__(27);
const room_controller_1 = __webpack_require__(182);
const room_service_1 = __webpack_require__(183);
let RoomModule = class RoomModule {
};
RoomModule = __decorate([
    (0, common_1.Module)({
        imports: [shared_module_1.SharedModule],
        controllers: [room_controller_1.RoomController],
        providers: [room_service_1.RoomService]
    })
], RoomModule);
exports.RoomModule = RoomModule;


/***/ }),
/* 182 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RoomController = void 0;
const common_1 = __webpack_require__(4);
const room_service_1 = __webpack_require__(183);
let RoomController = class RoomController {
    constructor(myService) {
        this.myService = myService;
    }
    CreateRoom() {
        console.log("in");
        return this.myService.CreatemessageRoom();
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RoomController.prototype, "CreateRoom", null);
RoomController = __decorate([
    (0, common_1.Controller)('room'),
    __metadata("design:paramtypes", [typeof (_a = typeof room_service_1.RoomService !== "undefined" && room_service_1.RoomService) === "function" ? _a : Object])
], RoomController);
exports.RoomController = RoomController;


/***/ }),
/* 183 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var RoomService_1, _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RoomService = void 0;
const configuration_1 = __webpack_require__(10);
const database_service_1 = __webpack_require__(19);
const logging_service_1 = __webpack_require__(26);
const common_1 = __webpack_require__(4);
const config_1 = __webpack_require__(5);
let RoomService = RoomService_1 = class RoomService {
    constructor(config, db, logger) {
        this.config = config;
        this.db = db;
        this.logger = logger;
        this.logger.setContext(RoomService_1.name);
    }
    CreatemessageRoom() {
        return this.db.rawQuery(`INSERT INTO message (senderid, receiverid, message)
        VALUES ($1, $2, $3)`, [1, 2, "hi hello how are you"], null);
    }
};
RoomService = RoomService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(configuration_1.default.KEY)),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigType !== "undefined" && config_1.ConfigType) === "function" ? _a : Object, typeof (_b = typeof database_service_1.DatabaseService !== "undefined" && database_service_1.DatabaseService) === "function" ? _b : Object, typeof (_c = typeof logging_service_1.Logger !== "undefined" && logging_service_1.Logger) === "function" ? _c : Object])
], RoomService);
exports.RoomService = RoomService;


/***/ }),
/* 184 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.useRequestLogging = void 0;
const morgan = __webpack_require__(185);
const logging_service_1 = __webpack_require__(26);
function useRequestLogging(app) {
    const logger = new logging_service_1.Logger('Http');
    app.use(morgan(':remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"    ', {
        skip: (req) => {
            return (process.env.NODE_ENV === 'production' || req.url === '/status.html');
        },
        stream: {
            write: (message) => logger.log(message.replace('\n', '')),
        },
    }));
}
exports.useRequestLogging = useRequestLogging;


/***/ }),
/* 185 */
/***/ ((module) => {

"use strict";
module.exports = require("morgan");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			if (cachedModule.error !== undefined) throw cachedModule.error;
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		try {
/******/ 			var execOptions = { id: moduleId, module: module, factory: __webpack_modules__[moduleId], require: __webpack_require__ };
/******/ 			__webpack_require__.i.forEach(function(handler) { handler(execOptions); });
/******/ 			module = execOptions.module;
/******/ 			execOptions.factory.call(module.exports, module, module.exports, execOptions.require);
/******/ 		} catch(e) {
/******/ 			module.error = e;
/******/ 			throw e;
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = __webpack_module_cache__;
/******/ 	
/******/ 	// expose the module execution interceptor
/******/ 	__webpack_require__.i = [];
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/get javascript update chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference all chunks
/******/ 		__webpack_require__.hu = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + "." + __webpack_require__.h() + ".hot-update.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get update manifest filename */
/******/ 	(() => {
/******/ 		__webpack_require__.hmrF = () => ("main." + __webpack_require__.h() + ".hot-update.json");
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/getFullHash */
/******/ 	(() => {
/******/ 		__webpack_require__.h = () => ("2f996aa0bbe1e36e0d14")
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hot module replacement */
/******/ 	(() => {
/******/ 		var currentModuleData = {};
/******/ 		var installedModules = __webpack_require__.c;
/******/ 		
/******/ 		// module and require creation
/******/ 		var currentChildModule;
/******/ 		var currentParents = [];
/******/ 		
/******/ 		// status
/******/ 		var registeredStatusHandlers = [];
/******/ 		var currentStatus = "idle";
/******/ 		
/******/ 		// while downloading
/******/ 		var blockingPromises;
/******/ 		
/******/ 		// The update info
/******/ 		var currentUpdateApplyHandlers;
/******/ 		var queuedInvalidatedModules;
/******/ 		
/******/ 		// eslint-disable-next-line no-unused-vars
/******/ 		__webpack_require__.hmrD = currentModuleData;
/******/ 		
/******/ 		__webpack_require__.i.push(function (options) {
/******/ 			var module = options.module;
/******/ 			var require = createRequire(options.require, options.id);
/******/ 			module.hot = createModuleHotObject(options.id, module);
/******/ 			module.parents = currentParents;
/******/ 			module.children = [];
/******/ 			currentParents = [];
/******/ 			options.require = require;
/******/ 		});
/******/ 		
/******/ 		__webpack_require__.hmrC = {};
/******/ 		__webpack_require__.hmrI = {};
/******/ 		
/******/ 		function createRequire(require, moduleId) {
/******/ 			var me = installedModules[moduleId];
/******/ 			if (!me) return require;
/******/ 			var fn = function (request) {
/******/ 				if (me.hot.active) {
/******/ 					if (installedModules[request]) {
/******/ 						var parents = installedModules[request].parents;
/******/ 						if (parents.indexOf(moduleId) === -1) {
/******/ 							parents.push(moduleId);
/******/ 						}
/******/ 					} else {
/******/ 						currentParents = [moduleId];
/******/ 						currentChildModule = request;
/******/ 					}
/******/ 					if (me.children.indexOf(request) === -1) {
/******/ 						me.children.push(request);
/******/ 					}
/******/ 				} else {
/******/ 					console.warn(
/******/ 						"[HMR] unexpected require(" +
/******/ 							request +
/******/ 							") from disposed module " +
/******/ 							moduleId
/******/ 					);
/******/ 					currentParents = [];
/******/ 				}
/******/ 				return require(request);
/******/ 			};
/******/ 			var createPropertyDescriptor = function (name) {
/******/ 				return {
/******/ 					configurable: true,
/******/ 					enumerable: true,
/******/ 					get: function () {
/******/ 						return require[name];
/******/ 					},
/******/ 					set: function (value) {
/******/ 						require[name] = value;
/******/ 					}
/******/ 				};
/******/ 			};
/******/ 			for (var name in require) {
/******/ 				if (Object.prototype.hasOwnProperty.call(require, name) && name !== "e") {
/******/ 					Object.defineProperty(fn, name, createPropertyDescriptor(name));
/******/ 				}
/******/ 			}
/******/ 			fn.e = function (chunkId) {
/******/ 				return trackBlockingPromise(require.e(chunkId));
/******/ 			};
/******/ 			return fn;
/******/ 		}
/******/ 		
/******/ 		function createModuleHotObject(moduleId, me) {
/******/ 			var _main = currentChildModule !== moduleId;
/******/ 			var hot = {
/******/ 				// private stuff
/******/ 				_acceptedDependencies: {},
/******/ 				_acceptedErrorHandlers: {},
/******/ 				_declinedDependencies: {},
/******/ 				_selfAccepted: false,
/******/ 				_selfDeclined: false,
/******/ 				_selfInvalidated: false,
/******/ 				_disposeHandlers: [],
/******/ 				_main: _main,
/******/ 				_requireSelf: function () {
/******/ 					currentParents = me.parents.slice();
/******/ 					currentChildModule = _main ? undefined : moduleId;
/******/ 					__webpack_require__(moduleId);
/******/ 				},
/******/ 		
/******/ 				// Module API
/******/ 				active: true,
/******/ 				accept: function (dep, callback, errorHandler) {
/******/ 					if (dep === undefined) hot._selfAccepted = true;
/******/ 					else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 					else if (typeof dep === "object" && dep !== null) {
/******/ 						for (var i = 0; i < dep.length; i++) {
/******/ 							hot._acceptedDependencies[dep[i]] = callback || function () {};
/******/ 							hot._acceptedErrorHandlers[dep[i]] = errorHandler;
/******/ 						}
/******/ 					} else {
/******/ 						hot._acceptedDependencies[dep] = callback || function () {};
/******/ 						hot._acceptedErrorHandlers[dep] = errorHandler;
/******/ 					}
/******/ 				},
/******/ 				decline: function (dep) {
/******/ 					if (dep === undefined) hot._selfDeclined = true;
/******/ 					else if (typeof dep === "object" && dep !== null)
/******/ 						for (var i = 0; i < dep.length; i++)
/******/ 							hot._declinedDependencies[dep[i]] = true;
/******/ 					else hot._declinedDependencies[dep] = true;
/******/ 				},
/******/ 				dispose: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				addDisposeHandler: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				removeDisposeHandler: function (callback) {
/******/ 					var idx = hot._disposeHandlers.indexOf(callback);
/******/ 					if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 				},
/******/ 				invalidate: function () {
/******/ 					this._selfInvalidated = true;
/******/ 					switch (currentStatus) {
/******/ 						case "idle":
/******/ 							currentUpdateApplyHandlers = [];
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							setStatus("ready");
/******/ 							break;
/******/ 						case "ready":
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							break;
/******/ 						case "prepare":
/******/ 						case "check":
/******/ 						case "dispose":
/******/ 						case "apply":
/******/ 							(queuedInvalidatedModules = queuedInvalidatedModules || []).push(
/******/ 								moduleId
/******/ 							);
/******/ 							break;
/******/ 						default:
/******/ 							// ignore requests in error states
/******/ 							break;
/******/ 					}
/******/ 				},
/******/ 		
/******/ 				// Management API
/******/ 				check: hotCheck,
/******/ 				apply: hotApply,
/******/ 				status: function (l) {
/******/ 					if (!l) return currentStatus;
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				addStatusHandler: function (l) {
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				removeStatusHandler: function (l) {
/******/ 					var idx = registeredStatusHandlers.indexOf(l);
/******/ 					if (idx >= 0) registeredStatusHandlers.splice(idx, 1);
/******/ 				},
/******/ 		
/******/ 				//inherit from previous dispose call
/******/ 				data: currentModuleData[moduleId]
/******/ 			};
/******/ 			currentChildModule = undefined;
/******/ 			return hot;
/******/ 		}
/******/ 		
/******/ 		function setStatus(newStatus) {
/******/ 			currentStatus = newStatus;
/******/ 			var results = [];
/******/ 		
/******/ 			for (var i = 0; i < registeredStatusHandlers.length; i++)
/******/ 				results[i] = registeredStatusHandlers[i].call(null, newStatus);
/******/ 		
/******/ 			return Promise.all(results);
/******/ 		}
/******/ 		
/******/ 		function trackBlockingPromise(promise) {
/******/ 			switch (currentStatus) {
/******/ 				case "ready":
/******/ 					setStatus("prepare");
/******/ 					blockingPromises.push(promise);
/******/ 					waitForBlockingPromises(function () {
/******/ 						return setStatus("ready");
/******/ 					});
/******/ 					return promise;
/******/ 				case "prepare":
/******/ 					blockingPromises.push(promise);
/******/ 					return promise;
/******/ 				default:
/******/ 					return promise;
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function waitForBlockingPromises(fn) {
/******/ 			if (blockingPromises.length === 0) return fn();
/******/ 			var blocker = blockingPromises;
/******/ 			blockingPromises = [];
/******/ 			return Promise.all(blocker).then(function () {
/******/ 				return waitForBlockingPromises(fn);
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function hotCheck(applyOnUpdate) {
/******/ 			if (currentStatus !== "idle") {
/******/ 				throw new Error("check() is only allowed in idle status");
/******/ 			}
/******/ 			return setStatus("check")
/******/ 				.then(__webpack_require__.hmrM)
/******/ 				.then(function (update) {
/******/ 					if (!update) {
/******/ 						return setStatus(applyInvalidatedModules() ? "ready" : "idle").then(
/******/ 							function () {
/******/ 								return null;
/******/ 							}
/******/ 						);
/******/ 					}
/******/ 		
/******/ 					return setStatus("prepare").then(function () {
/******/ 						var updatedModules = [];
/******/ 						blockingPromises = [];
/******/ 						currentUpdateApplyHandlers = [];
/******/ 		
/******/ 						return Promise.all(
/******/ 							Object.keys(__webpack_require__.hmrC).reduce(function (
/******/ 								promises,
/******/ 								key
/******/ 							) {
/******/ 								__webpack_require__.hmrC[key](
/******/ 									update.c,
/******/ 									update.r,
/******/ 									update.m,
/******/ 									promises,
/******/ 									currentUpdateApplyHandlers,
/******/ 									updatedModules
/******/ 								);
/******/ 								return promises;
/******/ 							},
/******/ 							[])
/******/ 						).then(function () {
/******/ 							return waitForBlockingPromises(function () {
/******/ 								if (applyOnUpdate) {
/******/ 									return internalApply(applyOnUpdate);
/******/ 								} else {
/******/ 									return setStatus("ready").then(function () {
/******/ 										return updatedModules;
/******/ 									});
/******/ 								}
/******/ 							});
/******/ 						});
/******/ 					});
/******/ 				});
/******/ 		}
/******/ 		
/******/ 		function hotApply(options) {
/******/ 			if (currentStatus !== "ready") {
/******/ 				return Promise.resolve().then(function () {
/******/ 					throw new Error("apply() is only allowed in ready status");
/******/ 				});
/******/ 			}
/******/ 			return internalApply(options);
/******/ 		}
/******/ 		
/******/ 		function internalApply(options) {
/******/ 			options = options || {};
/******/ 		
/******/ 			applyInvalidatedModules();
/******/ 		
/******/ 			var results = currentUpdateApplyHandlers.map(function (handler) {
/******/ 				return handler(options);
/******/ 			});
/******/ 			currentUpdateApplyHandlers = undefined;
/******/ 		
/******/ 			var errors = results
/******/ 				.map(function (r) {
/******/ 					return r.error;
/******/ 				})
/******/ 				.filter(Boolean);
/******/ 		
/******/ 			if (errors.length > 0) {
/******/ 				return setStatus("abort").then(function () {
/******/ 					throw errors[0];
/******/ 				});
/******/ 			}
/******/ 		
/******/ 			// Now in "dispose" phase
/******/ 			var disposePromise = setStatus("dispose");
/******/ 		
/******/ 			results.forEach(function (result) {
/******/ 				if (result.dispose) result.dispose();
/******/ 			});
/******/ 		
/******/ 			// Now in "apply" phase
/******/ 			var applyPromise = setStatus("apply");
/******/ 		
/******/ 			var error;
/******/ 			var reportError = function (err) {
/******/ 				if (!error) error = err;
/******/ 			};
/******/ 		
/******/ 			var outdatedModules = [];
/******/ 			results.forEach(function (result) {
/******/ 				if (result.apply) {
/******/ 					var modules = result.apply(reportError);
/******/ 					if (modules) {
/******/ 						for (var i = 0; i < modules.length; i++) {
/******/ 							outdatedModules.push(modules[i]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		
/******/ 			return Promise.all([disposePromise, applyPromise]).then(function () {
/******/ 				// handle errors in accept handlers and self accepted module load
/******/ 				if (error) {
/******/ 					return setStatus("fail").then(function () {
/******/ 						throw error;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				if (queuedInvalidatedModules) {
/******/ 					return internalApply(options).then(function (list) {
/******/ 						outdatedModules.forEach(function (moduleId) {
/******/ 							if (list.indexOf(moduleId) < 0) list.push(moduleId);
/******/ 						});
/******/ 						return list;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				return setStatus("idle").then(function () {
/******/ 					return outdatedModules;
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function applyInvalidatedModules() {
/******/ 			if (queuedInvalidatedModules) {
/******/ 				if (!currentUpdateApplyHandlers) currentUpdateApplyHandlers = [];
/******/ 				Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 					queuedInvalidatedModules.forEach(function (moduleId) {
/******/ 						__webpack_require__.hmrI[key](
/******/ 							moduleId,
/******/ 							currentUpdateApplyHandlers
/******/ 						);
/******/ 					});
/******/ 				});
/******/ 				queuedInvalidatedModules = undefined;
/******/ 				return true;
/******/ 			}
/******/ 		}
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/require chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "loaded", otherwise not loaded yet
/******/ 		var installedChunks = __webpack_require__.hmrS_require = __webpack_require__.hmrS_require || {
/******/ 			0: 1
/******/ 		};
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no chunk install function needed
/******/ 		
/******/ 		// no chunk loading
/******/ 		
/******/ 		// no external install chunk
/******/ 		
/******/ 		function loadUpdateChunk(chunkId, updatedModulesList) {
/******/ 			var update = require("./" + __webpack_require__.hu(chunkId));
/******/ 			var updatedModules = update.modules;
/******/ 			var runtime = update.runtime;
/******/ 			for(var moduleId in updatedModules) {
/******/ 				if(__webpack_require__.o(updatedModules, moduleId)) {
/******/ 					currentUpdate[moduleId] = updatedModules[moduleId];
/******/ 					if(updatedModulesList) updatedModulesList.push(moduleId);
/******/ 				}
/******/ 			}
/******/ 			if(runtime) currentUpdateRuntime.push(runtime);
/******/ 		}
/******/ 		
/******/ 		var currentUpdateChunks;
/******/ 		var currentUpdate;
/******/ 		var currentUpdateRemovedChunks;
/******/ 		var currentUpdateRuntime;
/******/ 		function applyHandler(options) {
/******/ 			if (__webpack_require__.f) delete __webpack_require__.f.requireHmr;
/******/ 			currentUpdateChunks = undefined;
/******/ 			function getAffectedModuleEffects(updateModuleId) {
/******/ 				var outdatedModules = [updateModuleId];
/******/ 				var outdatedDependencies = {};
/******/ 		
/******/ 				var queue = outdatedModules.map(function (id) {
/******/ 					return {
/******/ 						chain: [id],
/******/ 						id: id
/******/ 					};
/******/ 				});
/******/ 				while (queue.length > 0) {
/******/ 					var queueItem = queue.pop();
/******/ 					var moduleId = queueItem.id;
/******/ 					var chain = queueItem.chain;
/******/ 					var module = __webpack_require__.c[moduleId];
/******/ 					if (
/******/ 						!module ||
/******/ 						(module.hot._selfAccepted && !module.hot._selfInvalidated)
/******/ 					)
/******/ 						continue;
/******/ 					if (module.hot._selfDeclined) {
/******/ 						return {
/******/ 							type: "self-declined",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					if (module.hot._main) {
/******/ 						return {
/******/ 							type: "unaccepted",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					for (var i = 0; i < module.parents.length; i++) {
/******/ 						var parentId = module.parents[i];
/******/ 						var parent = __webpack_require__.c[parentId];
/******/ 						if (!parent) continue;
/******/ 						if (parent.hot._declinedDependencies[moduleId]) {
/******/ 							return {
/******/ 								type: "declined",
/******/ 								chain: chain.concat([parentId]),
/******/ 								moduleId: moduleId,
/******/ 								parentId: parentId
/******/ 							};
/******/ 						}
/******/ 						if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 						if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 							if (!outdatedDependencies[parentId])
/******/ 								outdatedDependencies[parentId] = [];
/******/ 							addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 							continue;
/******/ 						}
/******/ 						delete outdatedDependencies[parentId];
/******/ 						outdatedModules.push(parentId);
/******/ 						queue.push({
/******/ 							chain: chain.concat([parentId]),
/******/ 							id: parentId
/******/ 						});
/******/ 					}
/******/ 				}
/******/ 		
/******/ 				return {
/******/ 					type: "accepted",
/******/ 					moduleId: updateModuleId,
/******/ 					outdatedModules: outdatedModules,
/******/ 					outdatedDependencies: outdatedDependencies
/******/ 				};
/******/ 			}
/******/ 		
/******/ 			function addAllToSet(a, b) {
/******/ 				for (var i = 0; i < b.length; i++) {
/******/ 					var item = b[i];
/******/ 					if (a.indexOf(item) === -1) a.push(item);
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			// at begin all updates modules are outdated
/******/ 			// the "outdated" status can propagate to parents if they don't accept the children
/******/ 			var outdatedDependencies = {};
/******/ 			var outdatedModules = [];
/******/ 			var appliedUpdate = {};
/******/ 		
/******/ 			var warnUnexpectedRequire = function warnUnexpectedRequire(module) {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" + module.id + ") to disposed module"
/******/ 				);
/******/ 			};
/******/ 		
/******/ 			for (var moduleId in currentUpdate) {
/******/ 				if (__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 					var newModuleFactory = currentUpdate[moduleId];
/******/ 					/** @type {TODO} */
/******/ 					var result;
/******/ 					if (newModuleFactory) {
/******/ 						result = getAffectedModuleEffects(moduleId);
/******/ 					} else {
/******/ 						result = {
/******/ 							type: "disposed",
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					/** @type {Error|false} */
/******/ 					var abortError = false;
/******/ 					var doApply = false;
/******/ 					var doDispose = false;
/******/ 					var chainInfo = "";
/******/ 					if (result.chain) {
/******/ 						chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 					}
/******/ 					switch (result.type) {
/******/ 						case "self-declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of self decline: " +
/******/ 										result.moduleId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of declined dependency: " +
/******/ 										result.moduleId +
/******/ 										" in " +
/******/ 										result.parentId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "unaccepted":
/******/ 							if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 							if (!options.ignoreUnaccepted)
/******/ 								abortError = new Error(
/******/ 									"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "accepted":
/******/ 							if (options.onAccepted) options.onAccepted(result);
/******/ 							doApply = true;
/******/ 							break;
/******/ 						case "disposed":
/******/ 							if (options.onDisposed) options.onDisposed(result);
/******/ 							doDispose = true;
/******/ 							break;
/******/ 						default:
/******/ 							throw new Error("Unexception type " + result.type);
/******/ 					}
/******/ 					if (abortError) {
/******/ 						return {
/******/ 							error: abortError
/******/ 						};
/******/ 					}
/******/ 					if (doApply) {
/******/ 						appliedUpdate[moduleId] = newModuleFactory;
/******/ 						addAllToSet(outdatedModules, result.outdatedModules);
/******/ 						for (moduleId in result.outdatedDependencies) {
/******/ 							if (__webpack_require__.o(result.outdatedDependencies, moduleId)) {
/******/ 								if (!outdatedDependencies[moduleId])
/******/ 									outdatedDependencies[moduleId] = [];
/******/ 								addAllToSet(
/******/ 									outdatedDependencies[moduleId],
/******/ 									result.outdatedDependencies[moduleId]
/******/ 								);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 					if (doDispose) {
/******/ 						addAllToSet(outdatedModules, [result.moduleId]);
/******/ 						appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 			currentUpdate = undefined;
/******/ 		
/******/ 			// Store self accepted outdated modules to require them later by the module system
/******/ 			var outdatedSelfAcceptedModules = [];
/******/ 			for (var j = 0; j < outdatedModules.length; j++) {
/******/ 				var outdatedModuleId = outdatedModules[j];
/******/ 				var module = __webpack_require__.c[outdatedModuleId];
/******/ 				if (
/******/ 					module &&
/******/ 					(module.hot._selfAccepted || module.hot._main) &&
/******/ 					// removed self-accepted modules should not be required
/******/ 					appliedUpdate[outdatedModuleId] !== warnUnexpectedRequire &&
/******/ 					// when called invalidate self-accepting is not possible
/******/ 					!module.hot._selfInvalidated
/******/ 				) {
/******/ 					outdatedSelfAcceptedModules.push({
/******/ 						module: outdatedModuleId,
/******/ 						require: module.hot._requireSelf,
/******/ 						errorHandler: module.hot._selfAccepted
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			var moduleOutdatedDependencies;
/******/ 		
/******/ 			return {
/******/ 				dispose: function () {
/******/ 					currentUpdateRemovedChunks.forEach(function (chunkId) {
/******/ 						delete installedChunks[chunkId];
/******/ 					});
/******/ 					currentUpdateRemovedChunks = undefined;
/******/ 		
/******/ 					var idx;
/******/ 					var queue = outdatedModules.slice();
/******/ 					while (queue.length > 0) {
/******/ 						var moduleId = queue.pop();
/******/ 						var module = __webpack_require__.c[moduleId];
/******/ 						if (!module) continue;
/******/ 		
/******/ 						var data = {};
/******/ 		
/******/ 						// Call dispose handlers
/******/ 						var disposeHandlers = module.hot._disposeHandlers;
/******/ 						for (j = 0; j < disposeHandlers.length; j++) {
/******/ 							disposeHandlers[j].call(null, data);
/******/ 						}
/******/ 						__webpack_require__.hmrD[moduleId] = data;
/******/ 		
/******/ 						// disable module (this disables requires from this module)
/******/ 						module.hot.active = false;
/******/ 		
/******/ 						// remove module from cache
/******/ 						delete __webpack_require__.c[moduleId];
/******/ 		
/******/ 						// when disposing there is no need to call dispose handler
/******/ 						delete outdatedDependencies[moduleId];
/******/ 		
/******/ 						// remove "parents" references from all children
/******/ 						for (j = 0; j < module.children.length; j++) {
/******/ 							var child = __webpack_require__.c[module.children[j]];
/******/ 							if (!child) continue;
/******/ 							idx = child.parents.indexOf(moduleId);
/******/ 							if (idx >= 0) {
/******/ 								child.parents.splice(idx, 1);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// remove outdated dependency from module children
/******/ 					var dependency;
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									dependency = moduleOutdatedDependencies[j];
/******/ 									idx = module.children.indexOf(dependency);
/******/ 									if (idx >= 0) module.children.splice(idx, 1);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				},
/******/ 				apply: function (reportError) {
/******/ 					// insert new code
/******/ 					for (var updateModuleId in appliedUpdate) {
/******/ 						if (__webpack_require__.o(appliedUpdate, updateModuleId)) {
/******/ 							__webpack_require__.m[updateModuleId] = appliedUpdate[updateModuleId];
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// run new runtime modules
/******/ 					for (var i = 0; i < currentUpdateRuntime.length; i++) {
/******/ 						currentUpdateRuntime[i](__webpack_require__);
/******/ 					}
/******/ 		
/******/ 					// call accept handlers
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							var module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								var callbacks = [];
/******/ 								var errorHandlers = [];
/******/ 								var dependenciesForCallbacks = [];
/******/ 								for (var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									var dependency = moduleOutdatedDependencies[j];
/******/ 									var acceptCallback =
/******/ 										module.hot._acceptedDependencies[dependency];
/******/ 									var errorHandler =
/******/ 										module.hot._acceptedErrorHandlers[dependency];
/******/ 									if (acceptCallback) {
/******/ 										if (callbacks.indexOf(acceptCallback) !== -1) continue;
/******/ 										callbacks.push(acceptCallback);
/******/ 										errorHandlers.push(errorHandler);
/******/ 										dependenciesForCallbacks.push(dependency);
/******/ 									}
/******/ 								}
/******/ 								for (var k = 0; k < callbacks.length; k++) {
/******/ 									try {
/******/ 										callbacks[k].call(null, moduleOutdatedDependencies);
/******/ 									} catch (err) {
/******/ 										if (typeof errorHandlers[k] === "function") {
/******/ 											try {
/******/ 												errorHandlers[k](err, {
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k]
/******/ 												});
/******/ 											} catch (err2) {
/******/ 												if (options.onErrored) {
/******/ 													options.onErrored({
/******/ 														type: "accept-error-handler-errored",
/******/ 														moduleId: outdatedModuleId,
/******/ 														dependencyId: dependenciesForCallbacks[k],
/******/ 														error: err2,
/******/ 														originalError: err
/******/ 													});
/******/ 												}
/******/ 												if (!options.ignoreErrored) {
/******/ 													reportError(err2);
/******/ 													reportError(err);
/******/ 												}
/******/ 											}
/******/ 										} else {
/******/ 											if (options.onErrored) {
/******/ 												options.onErrored({
/******/ 													type: "accept-errored",
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k],
/******/ 													error: err
/******/ 												});
/******/ 											}
/******/ 											if (!options.ignoreErrored) {
/******/ 												reportError(err);
/******/ 											}
/******/ 										}
/******/ 									}
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// Load self accepted modules
/******/ 					for (var o = 0; o < outdatedSelfAcceptedModules.length; o++) {
/******/ 						var item = outdatedSelfAcceptedModules[o];
/******/ 						var moduleId = item.module;
/******/ 						try {
/******/ 							item.require(moduleId);
/******/ 						} catch (err) {
/******/ 							if (typeof item.errorHandler === "function") {
/******/ 								try {
/******/ 									item.errorHandler(err, {
/******/ 										moduleId: moduleId,
/******/ 										module: __webpack_require__.c[moduleId]
/******/ 									});
/******/ 								} catch (err2) {
/******/ 									if (options.onErrored) {
/******/ 										options.onErrored({
/******/ 											type: "self-accept-error-handler-errored",
/******/ 											moduleId: moduleId,
/******/ 											error: err2,
/******/ 											originalError: err
/******/ 										});
/******/ 									}
/******/ 									if (!options.ignoreErrored) {
/******/ 										reportError(err2);
/******/ 										reportError(err);
/******/ 									}
/******/ 								}
/******/ 							} else {
/******/ 								if (options.onErrored) {
/******/ 									options.onErrored({
/******/ 										type: "self-accept-errored",
/******/ 										moduleId: moduleId,
/******/ 										error: err
/******/ 									});
/******/ 								}
/******/ 								if (!options.ignoreErrored) {
/******/ 									reportError(err);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					return outdatedModules;
/******/ 				}
/******/ 			};
/******/ 		}
/******/ 		__webpack_require__.hmrI.require = function (moduleId, applyHandlers) {
/******/ 			if (!currentUpdate) {
/******/ 				currentUpdate = {};
/******/ 				currentUpdateRuntime = [];
/******/ 				currentUpdateRemovedChunks = [];
/******/ 				applyHandlers.push(applyHandler);
/******/ 			}
/******/ 			if (!__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 				currentUpdate[moduleId] = __webpack_require__.m[moduleId];
/******/ 			}
/******/ 		};
/******/ 		__webpack_require__.hmrC.require = function (
/******/ 			chunkIds,
/******/ 			removedChunks,
/******/ 			removedModules,
/******/ 			promises,
/******/ 			applyHandlers,
/******/ 			updatedModulesList
/******/ 		) {
/******/ 			applyHandlers.push(applyHandler);
/******/ 			currentUpdateChunks = {};
/******/ 			currentUpdateRemovedChunks = removedChunks;
/******/ 			currentUpdate = removedModules.reduce(function (obj, key) {
/******/ 				obj[key] = false;
/******/ 				return obj;
/******/ 			}, {});
/******/ 			currentUpdateRuntime = [];
/******/ 			chunkIds.forEach(function (chunkId) {
/******/ 				if (
/******/ 					__webpack_require__.o(installedChunks, chunkId) &&
/******/ 					installedChunks[chunkId] !== undefined
/******/ 				) {
/******/ 					promises.push(loadUpdateChunk(chunkId, updatedModulesList));
/******/ 					currentUpdateChunks[chunkId] = true;
/******/ 				}
/******/ 			});
/******/ 			if (__webpack_require__.f) {
/******/ 				__webpack_require__.f.requireHmr = function (chunkId, promises) {
/******/ 					if (
/******/ 						currentUpdateChunks &&
/******/ 						!__webpack_require__.o(currentUpdateChunks, chunkId) &&
/******/ 						__webpack_require__.o(installedChunks, chunkId) &&
/******/ 						installedChunks[chunkId] !== undefined
/******/ 					) {
/******/ 						promises.push(loadUpdateChunk(chunkId));
/******/ 						currentUpdateChunks[chunkId] = true;
/******/ 					}
/******/ 				};
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.hmrM = function() {
/******/ 			return Promise.resolve().then(function() {
/******/ 				return require("./" + __webpack_require__.hmrF());
/******/ 			}).catch(function(err) { if(err.code !== "MODULE_NOT_FOUND") throw err; });
/******/ 		}
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// module cache are used so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	__webpack_require__(0);
/******/ 	var __webpack_exports__ = __webpack_require__(3);
/******/ 	
/******/ })()
;
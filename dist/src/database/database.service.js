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
var DatabaseService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const common_1 = require("@nestjs/common");
const class_transformer_1 = require("class-transformer");
const pg_1 = require("pg");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const database_constants_1 = require("./database.constants");
const db_exception_error_1 = require("../errors/db-exception.error");
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
    __metadata("design:paramtypes", [pg_1.Pool])
], DatabaseService);
exports.DatabaseService = DatabaseService;
//# sourceMappingURL=database.service.js.map
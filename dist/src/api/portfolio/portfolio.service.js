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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortfolioService = void 0;
const rxjs_1 = require("rxjs");
const configuration_1 = require("../../config/configuration");
const database_service_1 = require("../../database/database.service");
const logging_service_1 = require("../../shared/logger/logging.service");
const utils_service_1 = require("../../utils/utils.service");
const common_1 = require("@nestjs/common");
const posts_service_1 = require("../posts/posts.service");
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
    __metadata("design:paramtypes", [void 0, database_service_1.DatabaseService,
        logging_service_1.Logger])
], PortfolioService);
exports.PortfolioService = PortfolioService;
//# sourceMappingURL=portfolio.service.js.map
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
var CommonService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonService = void 0;
const configuration_1 = require("../../config/configuration");
const database_service_1 = require("../../database/database.service");
const logging_service_1 = require("../../shared/logger/logging.service");
const utils_service_1 = require("../../utils/utils.service");
const common_1 = require("@nestjs/common");
const get_all_experience_level_db_query_1 = require("./db-query/get-all-experience-level.db-query");
const get_all_interests_db_query_1 = require("./db-query/get-all-interests.db-query");
const get_all_investment_style_db_query_1 = require("./db-query/get-all-investment-style.db-query");
const get_experience_level_response_dto_1 = require("./dto/response/get-experience-level.response-dto");
const get_interests_response_dto_1 = require("./dto/response/get-interests.response-dto");
const get_investment_styes_response_dto_1 = require("./dto/response/get-investment-styes.response-dto");
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
    __metadata("design:paramtypes", [void 0, database_service_1.DatabaseService,
        logging_service_1.Logger])
], CommonService);
exports.CommonService = CommonService;
//# sourceMappingURL=common.service.js.map
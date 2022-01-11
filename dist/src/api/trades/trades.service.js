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
var TradesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradesService = void 0;
const rxjs_1 = require("rxjs");
const configuration_1 = require("../../config/configuration");
const database_service_1 = require("../../database/database.service");
const constants_1 = require("../../shared/constants");
const logging_service_1 = require("../../shared/logger/logging.service");
const s3_service_1 = require("../../shared/s3/s3.service");
const utils_service_1 = require("../../utils/utils.service");
const common_1 = require("@nestjs/common");
const list_all_trades_db_query_1 = require("./db-query/list-all-trades.db-query");
const list_comments_of_trades_db_query_1 = require("./db-query/list-comments-of-trades.db-query");
const list_likes_of_comment_db_query_1 = require("./db-query/list-likes-of-comment.db-query");
const list_likes_of_trade_db_query_1 = require("./db-query/list-likes-of-trade.db-query");
const reverse_search_trade_by_tagged_assets_db_query_1 = require("./db-query/reverse-search-trade-by-tagged-assets.db-query");
const update_comment_like_db_query_1 = require("./db-query/update-comment-like.db-query");
const update_trade_like_db_query_1 = require("./db-query/update-trade-like.db-query");
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
    __metadata("design:paramtypes", [void 0, database_service_1.DatabaseService,
        s3_service_1.S3Service,
        logging_service_1.Logger])
], TradesService);
exports.TradesService = TradesService;
//# sourceMappingURL=trades.service.js.map
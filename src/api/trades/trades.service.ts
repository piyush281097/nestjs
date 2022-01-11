import { map, mergeMap, of } from 'rxjs';
import configuration from 'src/config/configuration';
import { DatabaseService } from 'src/database/database.service';
import { TAGGED_TYPE } from 'src/shared/constants';
import { Logger } from 'src/shared/logger/logging.service';
import { S3Service } from 'src/shared/s3/s3.service';
import { UtilsService } from 'src/utils/utils.service';

import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import { ListAllPostsQueryDto } from '../posts/dto/request/list-all-posts.query-dto';
import { listAllTradesDbQuery } from './db-query/list-all-trades.db-query';
import { listCommentsOfTradeDbQuery } from './db-query/list-comments-of-trades.db-query';
import { listLikesOfCommentOnTradesDbQuery } from './db-query/list-likes-of-comment.db-query';
import { listLikesOfTradeDbQuery } from './db-query/list-likes-of-trade.db-query';
import { reverseSearchTradeByTaggedAssetDbQuery } from './db-query/reverse-search-trade-by-tagged-assets.db-query';
import { UpdateCommentOnTradeLikeDbQuery } from './db-query/update-comment-like.db-query';
import { UpdateTradeLikeDbQuery } from './db-query/update-trade-like.db-query';
import { AddCommentOnTradeRequestDto } from './dto/request/add-comment.db-query';
import { CreateTradeRequestDto } from './dto/request/create-trade.request-dto';
import { ListAllTradesQueryDto } from './dto/request/list-all-trades.query-dto';
import { UpdateCommentOnTradeRequestDto } from './dto/request/update-comment.request-dto';
import { UpdateTradeRequestDto } from './dto/request/update-trade.request-dto';

@Injectable()
export class TradesService {
  constructor(
    @Inject(configuration.KEY) private config: ConfigType<typeof configuration>,
    private db: DatabaseService<any>,
    private S3: S3Service,
    private logger: Logger,
  ) {
    this.logger.setContext(TradesService.name);
  }

  create(userId: number, trade: CreateTradeRequestDto) {
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
    /**
     * Add Tagged Assets
     */
    if (trade.assetId) {
      const { data: createAssetMasterData, query: createAssetMasterQuery } =
        UtilsService.buildInsertQuery({
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

    const { query, data } = UtilsService.buildInsertQuery({
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
      .rawQuery(
        `WITH ${queriesArray.join(
          ', ',
        )} (select id as trade_id from select_asset_ids) `,
        valuesArray,
        null,
      )
      .pipe(map((res) => res));
  }

  findAll(
    loggedInUserId: number,
    userId: number,
    queryParams: ListAllTradesQueryDto,
  ) {
    let dbQuery = listAllTradesDbQuery;

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

      dbQuery = dbQuery.replace(
        '--FILTER_CONDITION',
        filterQuery[queryParams.filter],
      );
    }

    if (userId) {
      dbQuery = dbQuery.replace(
        '-- user_where_condition',
        'AND tm.user_id = $4',
      );
      data.push(userId);
    } else {
      dbQuery = dbQuery.replace(
        '--INNER_JOIN_FOLLOWER',
        'INNER JOIN followers f on f.user_id = $3 AND tm.user_id = f.follower_id  or tm.user_id = $3',
      );
    }
    return this.db.rawQuery(dbQuery, data, null);
  }

  updateTrade(
    userId: number,
    tradeId: number,
    updateTrade: UpdateTradeRequestDto,
  ) {
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

    const addSQLQuery: Record<string, any> = {
      last_updated: 'current_timestamp',
    };
    /**
     * Updating original trade master data
     */
    const { query, data } = UtilsService.buildUpdateQuery({
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
      .rawQuery(
        `WITH ${queriesArray.join(
          ', ',
        )} (select id as  trade_id from upd_trades_master) `,
        valuesArray,
        null,
      )
      .pipe(map((res) => res[0]));
  }

  deleteTrade(userId: number, tradeId: number) {
    return this.db
      .rawQuery(
        `UPDATE
          trades_master
      SET
          is_deleted = TRUE
      WHERE
          user_id = $1 AND id = $2
      RETURNING
          1 AS deleted
      `,
        [userId, tradeId],
        null,
      )
      .pipe(map((x) => x[0] || {}));
  }

  updateLikeForTrade(userId: number, tradeId: number, isDeleted: string) {
    // To convert to boolean
    const isDeletedStatus = isDeleted !== 'like';

    return this.db.rawQuery(
      UpdateTradeLikeDbQuery,
      [tradeId, userId, isDeletedStatus],
      null,
    );
  }

  getTradeLikeUsers(tradeId: number, queryParams: ListAllTradesQueryDto) {
    const { limit, offset } = queryParams;
    const data = [tradeId, offset, limit];

    return this.db.rawQuery(listLikesOfTradeDbQuery, data, null);
  }

  addCommentOnTrade(
    userId: number,
    tradeId: number,
    tradeComment: AddCommentOnTradeRequestDto,
  ) {
    const valuesArray = [];
    const queriesArray = [];

    const arrayToSkip = ['taggedUsers', 'hashtags', 'taggedAssets'];
    const columnToSkip = ['createdAt', 'lastUpdated', 'id', 'isDeleted'];

    const addSqlQuery: any = {};

    const { query, data } = UtilsService.buildInsertQuery({
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

    queriesArray.push(
      `ins_trades_comment as (${query} RETURNING id, trade_id)`,
    );
    valuesArray.push(...data);

    /**
     * Add Tagged Users
     */
    if (tradeComment.taggedUsers?.length) {
      const { query, data } = UtilsService.buildInsertQuery({
        tableName: 'tagged_users',
        columnData: tradeComment.taggedUsers.map((x) => ({ userId: x })),
        keysToIgnore: ['id', 'createdAt', 'lastUpdated', ' tradeCommentId'],
        addSqlQuery: {
          trade_comment_id: '(select id from ins_trades_comment)',
          type: `'${TAGGED_TYPE.trade_comment}'`,
        },
        start: valuesArray.length + 1,
      });

      queriesArray.push(`ins_tagged_users as (${query})`);
      valuesArray.push(...data);
    }

    /**
     * Add hashtags and return ID. If exists do nothing. And map with  tradeId
     */
    if (tradeComment.hashtags?.length) {
      const { data: createHashTagData, query: createHashTagQuery } =
        UtilsService.buildInsertQuery({
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

    /**
     * Add Tagged Assets
     */
    if (tradeComment.taggedAssets?.length) {
      const { data: createAssetMasterData, query: createAssetMasterQuery } =
        UtilsService.buildInsertQuery({
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
      .rawQuery(
        `WITH ${queriesArray.join(', ')} (select * from ins_trades_comment) `,
        valuesArray,
        null,
      )
      .pipe(
        map((res) => res[0]),
        mergeMap((x) => {
          return this.listCommentOfTrade(
            tradeId,
            userId,
            { limit: 1, offset: 0 },
            x.id,
          );
        }),
        map((res) => res[0]),
      );
  }

  listCommentOfTrade(
    tradeId: number,
    userId: number,
    query: ListAllTradesQueryDto,
    commentId?: number, // This is to get a single comment details
    getReplies = false,
  ) {
    const { limit, offset } = query;
    const data = [tradeId, userId, limit, offset];
    let dbQuery = listCommentsOfTradeDbQuery;

    if (!commentId) {
      dbQuery = dbQuery.replace(
        '-- PARENT_COMMENT_ID',
        'AND tc.parent_comment_id IS NULL',
      );
    } else if (getReplies) {
      dbQuery = dbQuery.replace(
        '-- PARENT_COMMENT_ID',
        'AND tc.parent_comment_id = $5',
      );
      data.push(commentId);
    } else {
      dbQuery = dbQuery.replace('-- PARENT_COMMENT_ID', 'AND tc.id = $5');
      data.push(commentId);
    }

    return this.db.rawQuery(dbQuery, data, null);
  }

  updateCommentOnTrade(
    userId: number,
    commentId: number,
    tradeId: number,
    updateTradeComment: UpdateCommentOnTradeRequestDto,
  ) {
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

    const addSQLQuery: Record<string, any> = {
      last_updated: 'current_timestamp',
    };
    /**
     * Updating original  trade master data and wiping and reinserting other data
     */
    const { query, data } = UtilsService.buildUpdateQuery({
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

    /**
     * Add Tagged Users
     */
    if (Array.isArray(updateTradeComment.taggedUsers)) {
      queriesArray.push(
        `del_tagged_users as (DELETE from tagged_users where  trade_comment_id = $3)`,
      );

      if (updateTradeComment.taggedUsers?.length) {
        const { query, data } = UtilsService.buildInsertQuery({
          tableName: 'tagged_users',
          columnData: updateTradeComment.taggedUsers.map((x) => ({
            userId: x,
          })),
          keysToIgnore: ['id', 'createdAt', 'lastUpdated', ' tradeCommentId'],
          addSqlQuery: {
            trade_comment_id: '$3',
            type: `'${TAGGED_TYPE.trade_comment}'`,
          },
          start: valuesArray.length + 1,
        });

        queriesArray.push(`ins_tagged_users as (${query})`);
        valuesArray.push(...data);
      }
    }

    /**
     * Add hashtags and return ID. If exists do nothing. And map with  tradeId
     */
    if (Array.isArray(updateTradeComment.hashtags)) {
      queriesArray.push(
        `del_trade_hashtags as (DELETE from tagged_hashtags where  trade_comment_id = $3)`,
      );

      if (updateTradeComment.hashtags?.length) {
        const { data: createHashTagData, query: createHashTagQuery } =
          UtilsService.buildInsertQuery({
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

    /**
     * Add Tagged Assets
     */
    if (Array.isArray(updateTradeComment.taggedAssets)) {
      queriesArray.push(
        `del_trade_assets as (DELETE from tagged_assets where  trade_comment_id = $3)`,
      );

      if (updateTradeComment.taggedAssets?.length) {
        const { data: createAssetMasterData, query: createAssetMasterQuery } =
          UtilsService.buildInsertQuery({
            tableName: 'master_assets',
            columnData: [...new Set(updateTradeComment.taggedAssets)].map(
              (x) => ({
                symbol: x,
              }),
            ),
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
      .rawQuery(
        `WITH ${queriesArray.join(', ')} (select id from upd_trades_comment) `,
        valuesArray,
        null,
      )
      .pipe(
        map((res) => res[0]),
        mergeMap((x) => {
          return this.listCommentOfTrade(
            tradeId,
            userId,
            { limit: 1, offset: 0 },
            x.id,
          );
        }),
        map((res) => res[0]),
      );
  }

  deleteCommentOnTrade(userId: number, tradeId: number, commentId: number) {
    return this.db
      .rawQuery(
        `UPDATE
          trades_comments
      SET
          is_deleted = TRUE
      WHERE
          user_id = $1 AND  trade_id =$2 AND id = $3
      RETURNING
          1 AS deleted
      `,
        [userId, tradeId, commentId],
        null,
      )
      .pipe(map((x) => x[0] || {}));
  }

  updateLikeForCommentOnTrade(
    userId: number,
    tradeId: number,
    commentId: number,
    isDeleted: string,
  ) {
    // To convert to boolean
    const isDeletedStatus = isDeleted !== 'like';

    return this.db.rawQuery(
      UpdateCommentOnTradeLikeDbQuery,
      [commentId, userId, isDeletedStatus],
      null,
    );
  }

  getLikeForCommentOnTrade(
    commentId: number,
    queryParams: ListAllTradesQueryDto,
  ) {
    const { limit, offset } = queryParams;
    const data = [commentId, offset, limit];

    return this.db.rawQuery(listLikesOfCommentOnTradesDbQuery, data, null);
  }

  getPostsWhichTagged(
    queryParams: ListAllPostsQueryDto,
    userId: number,
    value: string,
  ) {
    const { limit, offset } = queryParams;
    const data: any[] = [limit, offset, userId, value];

    return this.db.rawQuery(reverseSearchTradeByTaggedAssetDbQuery, data, null);
  }
}

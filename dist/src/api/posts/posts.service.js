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
var PostsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsService = void 0;
const rxjs_1 = require("rxjs");
const configuration_1 = require("../../config/configuration");
const database_service_1 = require("../../database/database.service");
const constants_1 = require("../../shared/constants");
const logging_service_1 = require("../../shared/logger/logging.service");
const s3_service_1 = require("../../shared/s3/s3.service");
const utils_service_1 = require("../../utils/utils.service");
const common_1 = require("@nestjs/common");
const list_all_post_db_query_1 = require("./db-query/list-all-post.db-query");
const list_comments_of_post_db_query_1 = require("./db-query/list-comments-of-post.db-query");
const list_likes_of_comment_db_query_1 = require("./db-query/list-likes-of-comment.db-query");
const list_likes_of_post_db_query_1 = require("./db-query/list-likes-of-post.db-query");
const reverse_search_assets_posts_db_query_1 = require("./db-query/reverse-search-assets-posts.db-query");
const reverse_search_hashtag_posts_db_query_1 = require("./db-query/reverse-search-hashtag-posts.db-query");
const reverse_search_user_posts_db_query_1 = require("./db-query/reverse-search-user-posts.db-query");
const update_comment_like_db_query_1 = require("./db-query/update-comment-like.db-query");
const update_post_like_db_query_1 = require("./db-query/update-post-like.db-query");
const list_all_post_response_dto_1 = require("./dto/response/list-all-post.response-dto");
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
    __metadata("design:paramtypes", [void 0, database_service_1.DatabaseService,
        s3_service_1.S3Service,
        logging_service_1.Logger])
], PostsService);
exports.PostsService = PostsService;
//# sourceMappingURL=posts.service.js.map
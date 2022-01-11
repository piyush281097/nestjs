import { map, mergeMap } from 'rxjs';
import configuration from 'src/config/configuration';
import { DatabaseService } from 'src/database/database.service';
import {
  S3_BUCKET,
  S3_FOLDER_POSTS_ATTACHMENT,
  TAGGED_TYPE,
} from 'src/shared/constants';
import { Logger } from 'src/shared/logger/logging.service';
import { S3Service } from 'src/shared/s3/s3.service';
import { UtilsService } from 'src/utils/utils.service';

import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import { listAllPostsDbQuery } from './db-query/list-all-post.db-query';
import { listCommentsOfPostDbQuery } from './db-query/list-comments-of-post.db-query';
import { listLikesOfCommentOnPostDbQuery } from './db-query/list-likes-of-comment.db-query';
import { listLikesOfPostDbQuery } from './db-query/list-likes-of-post.db-query';
import { reverseSearchAssetsWithDbQuery } from './db-query/reverse-search-assets-posts.db-query';
import { reverseSearchHashtagWithDbQuery } from './db-query/reverse-search-hashtag-posts.db-query';
import { reverseSearchUsersWithDbQuery } from './db-query/reverse-search-user-posts.db-query';
import { UpdateCommentOnPostLikeDbQuery } from './db-query/update-comment-like.db-query';
import { UpdatePostLikeDbQuery } from './db-query/update-post-like.db-query';
import { AddCommentOnPostRequestDto } from './dto/request/add-comment.db-query';
import { CreatePostRequestDto } from './dto/request/create-post.request-dto';
import { ListAllPostsQueryDto } from './dto/request/list-all-posts.query-dto';
import { UpdateCommentOnPostRequestDto } from './dto/request/update-comment.request-dto';
import { UpdatePostRequestDto } from './dto/request/update-post.request-dto';
import { ListAllPostsResponseDto } from './dto/response/list-all-post.response-dto';

@Injectable()
export class PostsService {
  constructor(
    @Inject(configuration.KEY) private config: ConfigType<typeof configuration>,
    private db: DatabaseService<any>,
    private S3: S3Service,
    private logger: Logger,
  ) {
    this.logger.setContext(PostsService.name);
  }

  create(userId: number, post: CreatePostRequestDto) {
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
    const addSqlQuery: any = {};

    const { query, data } = UtilsService.buildInsertQuery({
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

    /**
     * If we are re-sharing the post, store it in the posts_shared table
     */
    if (post.sharedPostId) {
      const { query, data } = UtilsService.buildInsertQuery({
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
    /**
     * Add MediaUrl/attachments
     */
    if (post.mediaUrls?.length) {
      const updatedMediaUrls = post.mediaUrls.map((mediaUrl) => {
        const { large, medium, original, small, thumbnail } =
          UtilsService.generateImagUrlForAllSizes(mediaUrl);
        return {
          image_org: original,
          image_thumb: thumbnail,
          image_small: small,
          image_medium: medium,
          image_large: large,
        };
      });

      const { query, data } = UtilsService.buildInsertQuery({
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

    /**
     * Add Tagged Users
     */
    if (post.taggedUsers?.length) {
      const { query, data } = UtilsService.buildInsertQuery({
        tableName: 'tagged_users',
        columnData: post.taggedUsers.map((x) => ({ userId: x })),
        keysToIgnore: ['id', 'createdAt', 'lastUpdated', 'postId'],
        addSqlQuery: {
          post_id: '(select id from ins_posts_master)',
          type: `'${TAGGED_TYPE.post}'`,
        },
        start: valuesArray.length + 1,
      });

      queriesArray.push(`ins_tagged_users as (${query})`);
      valuesArray.push(...data);
    }

    /**
     * Add hashtags and return ID. If exists do nothing. And map with postId
     */
    if (post.hashtags?.length) {
      const { data: createHashTagData, query: createHashTagQuery } =
        UtilsService.buildInsertQuery({
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

    /**
     * Add Tagged Assets
     */
    if (post.taggedAssets?.length) {
      const { data: createAssetMasterData, query: createAssetMasterQuery } =
        UtilsService.buildInsertQuery({
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
      .rawQuery(
        `WITH ${queriesArray.join(', ')} (select * from ins_posts_master) `,
        valuesArray,
        null,
      )
      .pipe(map((res) => res[0]));
  }

  findAll(
    loggedInUserId: number,
    userId: number,
    queryParams: ListAllPostsQueryDto,
  ) {
    let dbQuery = listAllPostsDbQuery;

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

      dbQuery = dbQuery.replace(
        '--FILTER_CONDITION',
        filterQuery[queryParams.filter],
      );
    }

    if (userId) {
      dbQuery = dbQuery.replace(
        '-- user_where_condition',
        'AND pm.user_id = $4',
      );
      data.push(userId);
    } else {
      dbQuery = dbQuery.replace(
        '--INNER_JOIN_FOLLOWER',
        'INNER JOIN followers f on f.user_id = $3 AND pm.user_id = f.follower_id or pm.user_id = $3',
      );
    }
    return this.db.rawQuery(dbQuery, data, ListAllPostsResponseDto);
  }

  updatePost(userId: number, postId: number, updatePost: UpdatePostRequestDto) {
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

    const addSQLQuery: Record<string, any> = {
      last_updated: 'current_timestamp',
    };
    /**
     * Updating original post master data and wiping and reinserting other data
     */
    const { query, data } = UtilsService.buildUpdateQuery({
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

    /**
     * Add MediaUrl/attachments
     */
    if (Array.isArray(updatePost.mediaUrls)) {
      queriesArray.push(
        `del_post_media as (DELETE from posts_media where post_id = $2)`,
      );
      if (updatePost.mediaUrls?.length) {
        const updatedMediaUrls = updatePost.mediaUrls.map((mediaUrl) => {
          const { large, medium, original, small, thumbnail } =
            UtilsService.generateImagUrlForAllSizes(mediaUrl);
          return {
            image_org: original,
            image_thumb: thumbnail,
            image_small: small,
            image_medium: medium,
            image_large: large,
          };
        });

        const { query, data } = UtilsService.buildInsertQuery({
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

    /**
     * Add Tagged Users
     */
    if (Array.isArray(updatePost.taggedUsers)) {
      queriesArray.push(
        `del_tagged_users as (DELETE from tagged_users where post_id = $2)`,
      );

      if (updatePost.taggedUsers?.length) {
        const { query, data } = UtilsService.buildInsertQuery({
          tableName: 'tagged_users',
          columnData: updatePost.taggedUsers.map((x) => ({ userId: x })),
          keysToIgnore: ['id', 'createdAt', 'lastUpdated', 'postId'],
          addSqlQuery: {
            post_id: '$2',
            type: `'${TAGGED_TYPE.post}'`,
          },
          start: valuesArray.length + 1,
        });

        queriesArray.push(`ins_tagged_users as (${query})`);
        valuesArray.push(...data);
      }
    }

    /**
     * Add hashtags and return ID. If exists do nothing. And map with postId
     */
    if (Array.isArray(updatePost.hashtags)) {
      queriesArray.push(
        `del_post_assets as (DELETE from tagged_hashtags where post_id = $2)`,
      );

      if (updatePost.hashtags?.length) {
        const { data: createHashTagData, query: createHashTagQuery } =
          UtilsService.buildInsertQuery({
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

    /**
     * Add Tagged Assets
     */
    if (Array.isArray(updatePost.taggedAssets)) {
      queriesArray.push(
        `del_post_assets as (DELETE from tagged_assets where post_id = $2)`,
      );

      if (updatePost.taggedAssets?.length) {
        const { data: createAssetMasterData, query: createAssetMasterQuery } =
          UtilsService.buildInsertQuery({
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
      .rawQuery(
        `WITH ${queriesArray.join(', ')} select * from upd_posts_master`,
        valuesArray,
        null,
      )
      .pipe(map((res) => res[0]));
  }

  deletePost(userId: number, postId: number) {
    return this.db
      .rawQuery(
        `UPDATE
          posts_master
      SET
          is_deleted = TRUE
      WHERE
          user_id = $1 AND id = $2
      RETURNING
          1 AS deleted
      `,
        [userId, postId],
        null,
      )
      .pipe(map((x) => x[0] || {}));
  }

  getPreSignedUrlForAttachment(fileName: string, userId: number) {
    const fileSplit = fileName.split('.');

    return this.S3.getS3PreSignUrl({
      bucket: S3_BUCKET,
      filename: `${Date.now()}_${fileSplit[0]}_o.${fileSplit[1]}`,
      path: `${S3_FOLDER_POSTS_ATTACHMENT}`,
    }).pipe(map(({ filePath, uploadUrl }) => ({ filePath, uploadUrl })));
  }

  UpdateAttachmentUrls(filePath: string, userId: number) {
    const { large, medium, original, small, thumbnail } =
      UtilsService.generateImagUrlForAllSizes(filePath);

    return this.db
      .rawQuery(
        'updateProfileImageDbQuery',
        [userId, original, thumbnail, small, medium, large],
        null,
      )
      .pipe(map((res) => res[0] ?? {}));
  }

  updateLikeForPost(userId: number, postId: number, isDeleted: string) {
    // To convert to boolean
    const isDeletedStatus = isDeleted !== 'like';

    return this.db.rawQuery(
      UpdatePostLikeDbQuery,
      [postId, userId, isDeletedStatus],
      null,
    );
  }

  getPostLikeUsers(postId: number, queryParams: ListAllPostsQueryDto) {
    const { limit, offset } = queryParams;
    const data = [postId, offset, limit];

    return this.db.rawQuery(
      listLikesOfPostDbQuery,
      data,
      ListAllPostsResponseDto,
    );
  }

  addCommentOnPost(
    userId: number,
    postId: number,
    postComment: AddCommentOnPostRequestDto,
  ) {
    const valuesArray = [];
    const queriesArray = [];

    const arrayToSkip = ['taggedUsers', 'hashtags', 'taggedAssets'];
    const columnToSkip = ['createdAt', 'lastUpdated', 'id', 'isDeleted'];

    const addSqlQuery: any = {};

    const { query, data } = UtilsService.buildInsertQuery({
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

    /**
     * Add Tagged Users
     */
    if (postComment.taggedUsers?.length) {
      const { query, data } = UtilsService.buildInsertQuery({
        tableName: 'tagged_users',
        columnData: postComment.taggedUsers.map((x) => ({ userId: x })),
        keysToIgnore: ['id', 'createdAt', 'lastUpdated', 'postCommentId'],
        addSqlQuery: {
          post_comment_id: '(select id from ins_posts_comment)',
          type: `'${TAGGED_TYPE.post_comment}'`,
        },
        start: valuesArray.length + 1,
      });

      queriesArray.push(`ins_tagged_users as (${query})`);
      valuesArray.push(...data);
    }

    /**
     * Add hashtags and return ID. If exists do nothing. And map with postId
     */
    if (postComment.hashtags?.length) {
      const { data: createHashTagData, query: createHashTagQuery } =
        UtilsService.buildInsertQuery({
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

    /**
     * Add Tagged Assets
     */
    if (postComment.taggedAssets?.length) {
      const { data: createAssetMasterData, query: createAssetMasterQuery } =
        UtilsService.buildInsertQuery({
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
      .rawQuery(
        `WITH ${queriesArray.join(', ')} (select id from ins_posts_comment) `,
        valuesArray,
        null,
      )
      .pipe(
        map((res) => res[0]),
        mergeMap((x) => {
          return this.listCommentOfPost(
            postId,
            userId,
            { limit: 1, offset: 0 },
            x.id,
          );
        }),
        map((res) => res[0]),
      );
  }

  listCommentOfPost(
    postId: number,
    userId: number,
    query: ListAllPostsQueryDto,
    commentId?: number, // This is to get a single comment details,
    getReplies = false,
  ) {
    const { limit, offset } = query;

    const data = [postId, userId, limit, offset];
    let dbQuery = listCommentsOfPostDbQuery;

    if (!commentId) {
      dbQuery = dbQuery.replace(
        '-- PARENT_COMMENT_ID',
        'AND pc.parent_comment_id IS NULL',
      );
    } else if (getReplies) {
      dbQuery = dbQuery.replace(
        '-- PARENT_COMMENT_ID',
        'AND pc.parent_comment_id = $5',
      );
      data.push(commentId);
    } else {
      dbQuery = dbQuery.replace('-- PARENT_COMMENT_ID', 'AND pc.id = $5');
      data.push(commentId);
    }
    return this.db.rawQuery(dbQuery, data, null);
  }

  updateCommentOnPost(
    userId: number,
    commentId: number,
    postId: number,
    updatePostComment: UpdateCommentOnPostRequestDto,
  ) {
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

    const addSQLQuery: Record<string, any> = {
      last_updated: 'current_timestamp',
    };
    /**
     * Updating original post master data and wiping and reinserting other data
     */
    const { query, data } = UtilsService.buildUpdateQuery({
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

    /**
     * Add Tagged Users
     */
    if (Array.isArray(updatePostComment.taggedUsers)) {
      queriesArray.push(
        `del_tagged_users as (DELETE from tagged_users where post_comment_id = $3)`,
      );

      if (updatePostComment.taggedUsers?.length) {
        const { query, data } = UtilsService.buildInsertQuery({
          tableName: 'tagged_users',
          columnData: updatePostComment.taggedUsers.map((x) => ({ userId: x })),
          keysToIgnore: ['id', 'createdAt', 'lastUpdated', 'postCommentId'],
          addSqlQuery: {
            post_comment_id: '$3',
            type: `'${TAGGED_TYPE.post_comment}'`,
          },
          start: valuesArray.length + 1,
        });

        queriesArray.push(`ins_tagged_users as (${query})`);
        valuesArray.push(...data);
      }
    }

    /**
     * Add hashtags and return ID. If exists do nothing. And map with postId
     */
    if (Array.isArray(updatePostComment.hashtags)) {
      queriesArray.push(
        `del_comment_assets as (DELETE from tagged_hashtags where post_comment_id = $3)`,
      );
      if (updatePostComment.hashtags?.length) {
        const { data: createHashTagData, query: createHashTagQuery } =
          UtilsService.buildInsertQuery({
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

    /**
     * Add Tagged Assets
     */
    if (Array.isArray(updatePostComment.taggedAssets)) {
      queriesArray.push(
        `del_post_assets as (DELETE from tagged_assets where post_comment_id = $3)`,
      );

      if (updatePostComment.taggedAssets?.length) {
        const { data: createAssetMasterData, query: createAssetMasterQuery } =
          UtilsService.buildInsertQuery({
            tableName: 'master_assets',
            columnData: [...new Set(updatePostComment.taggedAssets)].map(
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
      .rawQuery(
        `WITH ${queriesArray.join(', ')} (select id from upd_posts_comment) `,
        valuesArray,
        null,
      )
      .pipe(
        map((res) => res[0]),
        mergeMap((x) => {
          return this.listCommentOfPost(
            postId,
            userId,
            { limit: 1, offset: 0 },
            x.id,
          );
        }),
        map((res) => res[0]),
      );
  }

  deleteCommentOnPost(userId: number, postId: number, commentId: number) {
    return this.db
      .rawQuery(
        `UPDATE
          posts_comments
      SET
          is_deleted = TRUE
      WHERE
          user_id = $1 AND post_id =$2 AND id = $3
      RETURNING
          1 AS deleted
      `,
        [userId, postId, commentId],
        null,
      )
      .pipe(map((x) => x[0] || {}));
  }

  updateLikeForCommentOnPost(
    userId: number,
    postId: number,
    commentId: number,
    isDeleted: string,
  ) {
    // To convert to boolean
    const isDeletedStatus = isDeleted !== 'like';

    return this.db.rawQuery(
      UpdateCommentOnPostLikeDbQuery,
      [commentId, userId, isDeletedStatus],
      null,
    );
  }

  getLikeForCommentOnPost(
    commentId: number,
    queryParams: ListAllPostsQueryDto,
  ) {
    const { limit, offset } = queryParams;
    const data = [commentId, offset, limit];

    return this.db.rawQuery(
      listLikesOfCommentOnPostDbQuery,
      data,
      ListAllPostsResponseDto,
    );
  }

  getPostsWhichTagged(
    queryParams: ListAllPostsQueryDto,
    type: string,
    value: string,
    userId: number,
  ) {
    const { limit, offset } = queryParams;
    const data: any[] = [limit, offset];

    let dbQuery;

    if (type === 'hashtag') {
      data.push(value, userId);
      dbQuery = reverseSearchHashtagWithDbQuery;
    } else if (type === 'asset') {
      data.push(value, userId);
      dbQuery = reverseSearchAssetsWithDbQuery;
    } else if (type === 'user') {
      data.push(Number(value), userId);
      dbQuery = reverseSearchUsersWithDbQuery;
    }

    return this.db.rawQuery(dbQuery, data, ListAllPostsResponseDto);
  }
}

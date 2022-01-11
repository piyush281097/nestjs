"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=list-comments-of-trades.db-query.js.map
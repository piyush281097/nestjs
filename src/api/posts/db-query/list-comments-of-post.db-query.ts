export const listCommentsOfPostDbQuery = `
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

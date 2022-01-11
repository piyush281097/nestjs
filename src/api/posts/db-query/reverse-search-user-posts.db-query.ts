export const reverseSearchUsersWithDbQuery = `
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

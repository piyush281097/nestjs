export declare const listAllPostsDbQuery = "\nselect pm.id                                                           as post_id,\n       pm.content                                                      as content,\n       extract(epoch from pm.created_at::timestamptz(0))               as created_at,\n       count(DISTINCT pl.id) FILTER (WHERE pl.id IS NOT NULL)::integer as likes,\n       count(DISTINCT pc.id) FILTER (WHERE pc.id IS NOT NULL)::integer as comments,\n       case when pl2.id is not null then true else false end           as is_liked,\n       case\n           when ps.id is not null then (\n               select jsonb_build_object(\n                              'post_id', pm5.id,\n                              'content', pm5.content,\n                              'likes', count(DISTINCT pl5.id) FILTER (WHERE pl5.id IS NOT NULL)::integer,\n                              'comments', count(DISTINCT pc1.id) FILTER (WHERE pc1.id IS NOT NULL)::integer,\n                              'is_liked', case when pl6.id is not null then true else false end,\n                              'created_at', extract(epoch from pm5.created_at::timestamptz(0)),\n                              'created_by', jsonb_build_object(\n                                      'user_id', uc6.id,\n                                      'user_handle', uc6.user_handle,\n                                      'first_name', up6.first_name,\n                                      'last_name', up6.last_name,\n                                      'is_following', case when f.id is not null then true else false end,\n                                      'profile_image',        json_build_object('image_org', pm7.image_org,\n                                      'image_thumb', pm7.image_thumb,\n                                      'image_small', pm7.image_small,\n                                      'image_medium', pm7.image_medium,\n                                      'image_large', pm7.image_large)\n                                  ),\n                              'tagged_assets', json_agg(\n                                               DISTINCT jsonb_build_object(\n                                                       'asset_id', ta5.asset_id,\n                                                       'symbol', ma5.symbol)\n                                  ) FILTER (WHERE ta5.asset_id IS NOT NULL),\n                              'tagged_users', json_agg(\n                                              DISTINCT jsonb_build_object(\n                                                      'user_id', uc5.id,\n                                                      'user_handle', uc5.user_handle,\n                                                      'first_name', up5.first_name,\n                                                      'last_name', up5.last_name)\n                                  ) FILTER (WHERE uc5.id IS NOT NULL),\n                              'media_url', json_agg(\n                                           DISTINCT jsonb_build_object(\n                                                   'image_org', pm6.image_org,\n                                                   'image_thumb', pm6.image_thumb,\n                                                   'image_small', pm6.image_small,\n                                                   'image_medium', pm6.image_medium,\n                                                   'image_large', pm6.image_large)\n                                  ) FILTER (WHERE pm6.id IS NOT NULL)\n                          )\n               from posts_master pm5\n                        left join posts_media pm6 on pm5.id = pm6.post_id\n                        left join tagged_users tu on pm5.id = tu.post_id\n                        left join user_core uc5 on uc5.id = tu.user_id\n                        left join user_profile up5 on uc5.id = up5.user_id\n                        left join user_core uc6 on uc6.id = pm5.user_id\n                        left join user_profile up6 on uc6.id = up6.user_id\n                        LEFT JOIN profile_media pm7 ON pm7.user_id = uc6.id\n                        LEFT JOIN followers f ON f.user_id = $3 and f.follower_id = uc6.id \n                        left join tagged_assets ta5 on ta5.post_id = pm5.id and ta5.type = 'post'\n                        left join master_assets ma5 on ta5.asset_id = ma5.id\n                        left join posts_likes pl5 on pl5.post_id = pm5.id AND pl5.is_deleted = FALSE\n                        left join posts_likes pl6\n                                  on pl6.post_id = pm5.id AND pl6.is_deleted = FALSE AND pl6.user_id = $3\n                        left join posts_comments pc1\n                                  on pc1.post_id = pm5.id AND pc1.is_deleted = FALSE AND pc1.parent_comment_id is NULL\n               WHERE pm5.is_deleted = FALSE\n                 AND pm5.id = ps.shared_post_id\n                    group by pm5.id, uc6.id, uc5.user_handle, up6.first_name, up6.last_name, pl6.id, ps.id, f.id, pm7.image_org,\n                    pm7.image_large,\n                    pm7.image_thumb,\n                    pm7.image_small,\n                    pm7.image_medium,\n                    pm7.image_large\n                    LIMIT 1\n           )\n           else '{}'::jsonb\n           end                                                         as post_shared,\n       jsonb_build_object(\n               'user_id', uc2.id,\n               'user_handle', uc2.user_handle,\n               'first_name', up2.first_name,\n               'last_name', up2.last_name,\n               'is_following', case when f2.id is not null then true else false end,\n               'profile_image',        json_build_object('image_org', pm5.image_org,\n               'image_thumb', pm5.image_thumb,\n               'image_small', pm5.image_small,\n               'image_medium', pm5.image_medium,\n               'image_large', pm5.image_large)\n           )                                                           as created_by,\n       json_agg(\n       DISTINCT jsonb_build_object(\n               'asset_id', ta.asset_id,\n               'symbol', ma.symbol)\n           ) FILTER (WHERE ta.asset_id IS NOT NULL)                    AS tagged_assets,\n       json_agg(\n       DISTINCT jsonb_build_object(\n               'user_id', uc.id,\n               'user_handle', uc.user_handle,\n               'first_name', up.first_name,\n               'last_name', up.last_name)\n           ) FILTER (WHERE uc.id IS NOT NULL)                          AS tagged_users,\n       json_agg(\n       DISTINCT jsonb_build_object(\n               'image_org', pm2.image_org,\n               'image_thumb', pm2.image_thumb,\n               'image_small', pm2.image_small,\n               'image_medium', pm2.image_medium,\n               'image_large', pm2.image_large)\n           ) FILTER (WHERE pm2.id IS NOT NULL)                         AS media_url\nfrom posts_master pm\n         --INNER_JOIN_FOLLOWER\n         --INNER_JOIN_SAVED_ITEMS\n         left join posts_shared ps on pm.id = ps.post_id\n         left join posts_media pm2 on pm.id = pm2.post_id\n         left join tagged_users tu on pm.id = tu.post_id\n         left join user_core uc on uc.id = tu.user_id\n         left join user_profile up on uc.id = up.user_id\n         left join user_core uc2 on uc2.id = pm.user_id\n         left join user_profile up2 on uc2.id = up2.user_id\n         LEFT JOIN profile_media pm5 ON pm5.user_id = uc2.id\n         LEFT JOIN followers f2 ON f2.user_id = $3 and f2.follower_id = uc2.id \n         left join tagged_assets ta on ta.post_id = pm.id and ta.type = 'post'\n         left join master_assets ma on ta.asset_id = ma.id\n         left join posts_likes pl on pl.post_id = pm.id AND pl.is_deleted = FALSE\n         left join posts_likes pl2 on pl2.post_id = pm.id AND pl2.is_deleted = FALSE AND pl2.user_id = $3\n         left join posts_comments pc on pc.post_id = pm.id AND pc.is_deleted = FALSE AND pc.parent_comment_id is NULL\nWHERE pm.is_deleted = FALSE \n-- user_where_condition \n--FILTER_CONDITION\ngroup by pm.id, uc2.id, uc2.user_handle, up2.first_name, up2.last_name, pl2.id, ps.id, f2.id, pm5.image_org,\npm5.image_large,\npm5.image_thumb,\npm5.image_small,\npm5.image_medium,\npm5.image_large\n--GROUP_BY_SAVED\nORDER BY pm.last_updated DESC\nOFFSET $2\nLIMIT $1;\n";

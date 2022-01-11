export declare const listCommentsOfTradeDbQuery = "\nWITH replies_for_comment as (\n    select 1                                            as temp,\n           tc.id                                        as comment_id,\n           tc.comment                                   as comment,\n           tc.trade_id                                  as trade_id,\n           tc.parent_comment_id                         as parent_comment_id,\n           count(DISTINCT cl.id) FILTER (WHERE cl.id IS NOT NULL)::integer as likes,\n           case when cl2.id is not null then true else false end           as is_liked,\n           jsonb_build_object(\n                   'user_id', uc2.id,\n                   'user_handle', uc2.user_handle,\n                   'first_name', up2.first_name,\n                   'last_name', up2.last_name,\n                   'profile_image',        json_build_object('image_org', pm5.image_org,\n                                          'image_thumb', pm5.image_thumb,\n                                          'image_small', pm5.image_small,\n                                          'image_medium', pm5.image_medium,\n                                          'image_large', pm5.image_large)\n               )                                        as created_by,\n           json_agg(\n           DISTINCT jsonb_build_object(\n                   'asset_id', ta.asset_id,\n                   'symbol', ma.symbol)\n               ) FILTER (WHERE ta.asset_id IS NOT NULL) AS tagged_assets,\n           json_agg(\n           DISTINCT jsonb_build_object(\n                   'user_id', uc.id,\n                   'user_handle', uc.user_handle,\n                   'first_name', up.first_name,\n                   'last_name', up.last_name)\n               ) FILTER (WHERE uc.id IS NOT NULL)       AS tagged_users\n    from trades_comments tc\n             left join tagged_users tu on tc.id = tu.trade_comment_id and tu.type = 'trade_comment'\n             left join user_core uc on uc.id = tu.user_id\n             left join user_profile up on uc.id = up.user_id\n             left join user_core uc2 on uc2.id = tc.user_id\n             left join user_profile up2 on uc2.id = up2.user_id\n             LEFT JOIN profile_media pm5 ON pm5.user_id = uc2.id\n             left join tagged_assets ta on ta.trade_comment_id = tc.id and ta.type = 'trade_comment'\n             left join master_assets ma on ta.asset_id = ma.id\n         left join comment_likes cl on cl.trades_comment_id = tc.id AND cl.is_deleted = FALSE \n         left join comment_likes cl2 on cl2.trades_comment_id = tc.id AND cl2.is_deleted = FALSE AND cl2.user_id = $2\n    WHERE tc.is_deleted = FALSE\n      AND tc.parent_comment_id IS NOT NULL\n      AND tc.trade_id = $1\n    group by tc.id, uc2.id, uc2.user_handle, up2.first_name, up2.last_name, cl2.id, pm5.image_org,\n    pm5.image_large,\n    pm5.image_thumb,\n    pm5.image_small,\n    pm5.image_medium,\n    pm5.image_large\n    ORDER BY tc.last_updated DESC\n)\nselect tc.id                                        as comment_id,\n       tc.comment                                   as comment,\n       tc.trade_id                                  as trade_id,\n       count(DISTINCT cl.id) FILTER (WHERE cl.id IS NOT NULL)::integer as likes,\n       case when cl2.id is not null then true else false end           as is_liked,\n       (\n           SELECT count(*)::integer\n           from replies_for_comment\n           where tc.id = replies_for_comment.parent_comment_id\n       )                                            as replies_count,\n       (\n           SELECT json_agg(row_to_json(replies_for_comment))\n           from replies_for_comment\n           where tc.id = replies_for_comment.parent_comment_id\n           LIMIT 2\n       )                                            as replies,\n       jsonb_build_object(\n               'user_id', uc2.id,\n               'user_handle', uc2.user_handle,\n               'first_name', up2.first_name,\n               'last_name', up2.last_name,\n               'profile_image',        json_build_object('image_org', pm5.image_org,\n                                      'image_thumb', pm5.image_thumb,\n                                      'image_small', pm5.image_small,\n                                      'image_medium', pm5.image_medium,\n                                      'image_large', pm5.image_large)\n           )                                                       as created_by,\n       json_agg(\n       DISTINCT jsonb_build_object(\n               'asset_id', ta.asset_id,\n               'symbol', ma.symbol)\n           ) FILTER (WHERE ta.asset_id IS NOT NULL) AS tagged_assets,\n       json_agg(\n       DISTINCT jsonb_build_object(\n               'user_id', uc.id,\n               'user_handle', uc.user_handle,\n               'first_name', up.first_name,\n               'last_name', up.last_name)\n           ) FILTER (WHERE uc.id IS NOT NULL)       AS tagged_users\nfrom trades_comments tc\n         left join tagged_users tu on tc.id = tu.trade_comment_id and tu.type = 'trade_comment'\n         left join user_core uc on uc.id = tu.user_id\n         left join user_profile up on uc.id = up.user_id\n         left join user_core uc2 on uc2.id = tc.user_id\n         left join user_profile up2 on uc2.id = up2.user_id\n         LEFT JOIN profile_media pm5 ON pm5.user_id = uc2.id\n         left join tagged_assets ta on ta.trade_comment_id = tc.id and ta.type = 'trade_comment'\n         left join master_assets ma on ta.asset_id = ma.id\n         left join comment_likes cl on cl.trades_comment_id = tc.id AND cl.is_deleted = FALSE\n         left join comment_likes cl2 on cl2.trades_comment_id = tc.id AND cl2.is_deleted = FALSE AND cl2.user_id = $2\n         left join replies_for_comment on replies_for_comment.temp = 1\nWHERE tc.is_deleted = FALSE\n  -- PARENT_COMMENT_ID\n  AND tc.trade_id = $1\ngroup by tc.id, uc2.id, uc2.user_handle, up2.first_name, up2.last_name, cl2.id, pm5.image_org,\npm5.image_large,\npm5.image_thumb,\npm5.image_small,\npm5.image_medium,\npm5.image_large\nORDER BY tc.last_updated DESC\nLIMIT $3 OFFSET $4;\n";

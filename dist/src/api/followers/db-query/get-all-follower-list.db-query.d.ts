export declare const GetAllFollowersListDbQuery = "\nWITH temp_cte AS (\n  SELECT\n      1 AS temp\n),\nlist_of_following AS (\n    select 1 as temp, uc.id, uc.user_handle, up.first_name, up.last_name,       \n    json_build_object('image_org', pm.image_org,\n    'image_thumb', pm.image_thumb,\n    'image_small', pm.image_small,\n    'image_medium', pm.image_medium,\n    'image_large', pm.image_large) AS profile_image\n    from followers f\n             left JOIN user_core uc on f.follower_id = uc.id\n             left join user_profile up on uc.id = up.user_id\n             LEFT JOIN profile_media pm ON pm.user_id = uc.id\n    WHERE f.user_id = $3\n      AND f.is_deleted IS NOT TRUE\n    ORDER BY f.last_updated DESC\n    LIMIT $1 OFFSET $2\n),\n     list_of_followers as (\n         select 1 as temp, uc.id, uc.user_handle, up.first_name, up.last_name,       \n         json_build_object('image_org', pm.image_org,\n         'image_thumb', pm.image_thumb,\n         'image_small', pm.image_small,\n         'image_medium', pm.image_medium,\n         'image_large', pm.image_large) AS profile_image\n         from followers f\n                  left JOIN user_core uc on f.user_id = uc.id\n                  left join user_profile up on uc.id = up.user_id\n                  LEFT JOIN profile_media pm ON pm.user_id = uc.id\n         WHERE f.follower_id = $3\n           AND f.is_deleted IS NOT TRUE\n         ORDER BY f.last_updated DESC\n         LIMIT $1 OFFSET $2\n)\nselect json_agg(\n       DISTINCT jsonb_build_object(\n               'user_id', flwing.id,\n               'user_handle', flwing.user_handle,\n               'first_name', flwing.first_name,\n               'last_name', flwing.last_name,\n               'profile_image', flwing.profile_image\n           )\n           ) FILTER (WHERE flwing.id IS NOT NULL)\n           AS following,\n       json_agg(\n       DISTINCT jsonb_build_object(\n               'user_id', flwr.id,\n               'user_handle', flwr.user_handle,\n               'first_name', flwr.first_name,\n               'last_name', flwr.last_name,\n               'profile_image', flwr.profile_image\n           )\n           ) FILTER (WHERE flwr.id IS NOT NULL)\n           AS followers\nFROM\n  temp_cte tc\nLEFT JOIN list_of_following flwing ON tc.temp = flwing.temp\nLEFT JOIN list_of_followers flwr ON tc.temp = flwr.temp\n";

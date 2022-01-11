export const listLikesOfTradeDbQuery = `
SELECT uc.id                   as user_id,
       uc.user_handle          as user_handle,
       up.first_name           as first_name,
       up.last_name            as last_name,
       jsonb_build_object(
               'image_org', pm.image_org, 'image_thumb', pm.image_thumb, 'image_small',
               pm.image_small, 'image_medium', pm.image_medium, 'image_large',
               pm.image_large) as profile_image
FROM trades_likes tl
         LEFT JOIN user_core uc ON uc.id = tl.user_id
         LEFT JOIN user_profile up ON uc.id = up.user_id
         LEFT JOIN profile_media pm ON pm.user_id = uc.id
WHERE trade_id = $1 AND tl.is_deleted = FALSE
group by tl.last_updated, uc.id, uc.id, uc.user_handle, up.first_name, up.last_name,
         pm.image_org, pm.image_thumb, pm.image_small, pm.image_medium,
         pm.image_large
ORDER BY tl.last_updated DESC
OFFSET $2
LIMIT $3
`;

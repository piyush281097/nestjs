export const GetAllFollowersListDbQuery = `
WITH temp_cte AS (
  SELECT
      1 AS temp
),
list_of_following AS (
    select 1 as temp, uc.id, uc.user_handle, up.first_name, up.last_name,       
    json_build_object('image_org', pm.image_org,
    'image_thumb', pm.image_thumb,
    'image_small', pm.image_small,
    'image_medium', pm.image_medium,
    'image_large', pm.image_large) AS profile_image
    from followers f
             left JOIN user_core uc on f.follower_id = uc.id
             left join user_profile up on uc.id = up.user_id
             LEFT JOIN profile_media pm ON pm.user_id = uc.id
    WHERE f.user_id = $3
      AND f.is_deleted IS NOT TRUE
    ORDER BY f.last_updated DESC
    LIMIT $1 OFFSET $2
),
     list_of_followers as (
         select 1 as temp, uc.id, uc.user_handle, up.first_name, up.last_name,       
         json_build_object('image_org', pm.image_org,
         'image_thumb', pm.image_thumb,
         'image_small', pm.image_small,
         'image_medium', pm.image_medium,
         'image_large', pm.image_large) AS profile_image
         from followers f
                  left JOIN user_core uc on f.user_id = uc.id
                  left join user_profile up on uc.id = up.user_id
                  LEFT JOIN profile_media pm ON pm.user_id = uc.id
         WHERE f.follower_id = $3
           AND f.is_deleted IS NOT TRUE
         ORDER BY f.last_updated DESC
         LIMIT $1 OFFSET $2
)
select json_agg(
       DISTINCT jsonb_build_object(
               'user_id', flwing.id,
               'user_handle', flwing.user_handle,
               'first_name', flwing.first_name,
               'last_name', flwing.last_name,
               'profile_image', flwing.profile_image
           )
           ) FILTER (WHERE flwing.id IS NOT NULL)
           AS following,
       json_agg(
       DISTINCT jsonb_build_object(
               'user_id', flwr.id,
               'user_handle', flwr.user_handle,
               'first_name', flwr.first_name,
               'last_name', flwr.last_name,
               'profile_image', flwr.profile_image
           )
           ) FILTER (WHERE flwr.id IS NOT NULL)
           AS followers
FROM
  temp_cte tc
LEFT JOIN list_of_following flwing ON tc.temp = flwing.temp
LEFT JOIN list_of_followers flwr ON tc.temp = flwr.temp
`;

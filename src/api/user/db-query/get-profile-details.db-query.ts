export const getProfileDetailsDbQuery = `
WITH following_details AS (
    SELECT
        1 as temp,
        count(*) AS following_count
    FROM
        followers f
    WHERE
        user_id = $1
        AND is_deleted IS NOT TRUE
    GROUP BY
        f.user_id
),
is_being_followed AS (
    SELECT
        1 as temp,
        count(*) AS followers_count
    FROM
        followers f2
    WHERE
        follower_id = $1
        AND is_deleted IS NOT TRUE
    GROUP BY
        f2.follower_id
)
SELECT uc.id                                            AS user_id,
       uc.email,
       uc.is_verified,
       COALESCE(uc.is_signup_complete, false)           as is_signup_complete,
       coalesce(fds.following_count,0)::integer                            as following_count,
       coalesce(ibf.followers_count,0)::integer                            as followers_count,
       case when f1.id = $2 is not null then true else false end           as is_following,
       case when f2.id = $2 is not null then true else false end           as is_being_followed,
       uc.is_active,
       uc.user_handle,
       uc.country_code,
       uc.mobile_number,
       up.first_name,
       up.last_name,
       up.quote,
       up.about,
       up.goal,
       mel.type                                         as experience_level,
       json_build_object('image_org', pm.image_org,
                         'image_thumb', pm.image_thumb,
                         'image_small', pm.image_small,
                         'image_medium', pm.image_medium,
                         'image_large', pm.image_large) AS profile_image,
       json_agg(
       DISTINCT jsonb_build_object(
               'investor_name', it.investor_name,
               'from', it."from",
               'to', it."to",
               'activity', it.activity
           )
           ) FILTER (WHERE it.id IS NOT NULL)           as timeline,

       json_agg(
       DISTINCT jsonb_build_object(
               'id', mit.id,
               'type', mit.type
           )
           ) FILTER (WHERE mit.id IS NOT NULL)          as investment_style,

       json_agg(
       DISTINCT jsonb_build_object(
               'id', mi.id,
               'type', mi.type
           )
           ) FILTER (WHERE mi.id IS NOT NULL)           as interest
FROM user_core uc
         LEFT JOIN user_profile up ON up.user_id = uc.id
         LEFT JOIN profile_media pm ON pm.user_id = uc.id
         LEFT JOIN user_experience ue on uc.id = ue.user_id
         LEFT JOIN master_experience_level mel on ue.experience_id = mel.id
         LEFT JOIN investment_timeline it on uc.id = it.user_id
         LEFT JOIN user_investment_types uit on uc.id = uit.user_id
         LEFT JOIN master_investment_types mit on uit.investment_id = mit.id
         LEFT JOIN user_interests ui ON uc.id = ui.user_id
         LEFT JOIN master_interests mi on ui.interests_id = mi.id
         LEFT JOIN following_details fds ON fds.temp = 1
         LEFT JOIN is_being_followed ibf ON ibf.temp = 1
         LEFT JOIN followers f1 on f1.is_deleted IS NOT TRUE AND f1.follower_id = uc.id and f1.user_id = $2
         LEFT JOIN followers f2 on f2.is_deleted IS NOT TRUE AND f2.follower_id = $2  and f2.follower_id = uc.id

WHERE uc.id = $1 AND uc.is_deleted IS NOT TRUE
GROUP BY uc.id,
        f1.id, f2.id,
        fds.following_count,
        ibf.followers_count,
         up.first_name,
         up.last_name,
         up.quote,
         up.about,
         up.goal,
         mel.type,
         pm.image_org,
         pm.image_large,
         pm.image_thumb,
         pm.image_small,
         pm.image_medium,
         pm.image_large;
`;

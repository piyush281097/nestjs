"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByEmailDbQuery = void 0;
exports.getUserByEmailDbQuery = `
SELECT uc.id                                            AS user_id,
       uc.email,
       uc.password,
       uc.is_social_login,
       uc.is_demo_complete,
       uc.is_verified,
       COALESCE(uc.is_signup_complete, false)           as is_signup_complete,
       count(DISTINCT f1.id)::integer                            as following_count,
       count(DISTINCT f2.id)::integer                            as followers_count,
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
               'id', uc.id,
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
         LEFT JOIN followers f1 on uc.id = f1.user_id
         LEFT JOIN followers f2 on uc.id = f2.follower_id

WHERE uc.is_deleted IS NOT TRUE AND uc.email = $1
GROUP BY uc.id,
         f1.id,
         f2.id,
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
         pm.image_large;`;
//# sourceMappingURL=get-user-by-email.db-query.js.map
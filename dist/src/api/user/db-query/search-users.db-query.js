"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchUserDbQuery = void 0;
exports.searchUserDbQuery = `
SELECT
    user_handle,
    first_name,
    last_name,
    up.user_id,       
    json_build_object('image_org', pm.image_org,
    'image_thumb', pm.image_thumb,
    'image_small', pm.image_small,
    'image_medium', pm.image_medium,
    'image_large', pm.image_large) AS profile_image
FROM
    user_core uc
    LEFT JOIN user_profile up ON up.user_id = uc.id
    LEFT JOIN profile_media pm ON pm.user_id = uc.id
WHERE
    user_handle ILIKE $1
    OR up.first_name ILIKE $1
    OR up.last_name ILIKE $1
    LIMIT 10;
`;
//# sourceMappingURL=search-users.db-query.js.map
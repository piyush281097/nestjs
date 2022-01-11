export const updateProfileImageDbQuery = `
    INSERT INTO profile_media (user_id, image_org, image_thumb, image_small, image_medium, image_large)
            VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (user_id)
            DO UPDATE SET
                image_org = EXCLUDED.image_org, 
                image_thumb = EXCLUDED.image_thumb,
                image_small = EXCLUDED.image_small,
                image_medium = EXCLUDED.image_medium,
                image_large = EXCLUDED.image_large,
                last_updated = CURRENT_TIMESTAMP
                RETURNING *`;

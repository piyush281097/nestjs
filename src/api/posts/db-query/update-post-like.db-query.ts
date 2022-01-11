export const UpdatePostLikeDbQuery = `
INSERT INTO posts_likes (post_id, user_id, is_deleted)
            VALUES ($1, $2, $3)
        ON CONFLICT (user_id, post_id)
            DO UPDATE SET
                is_deleted = EXCLUDED.is_deleted,
                last_updated = CURRENT_TIMESTAMP;
                `;

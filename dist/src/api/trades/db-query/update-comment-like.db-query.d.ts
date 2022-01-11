export declare const UpdateCommentOnTradeLikeDbQuery = "\nINSERT INTO comment_likes (trades_comment_id, post_comment_id, user_id, is_deleted)\n            VALUES ($1, null, $2, $3)\n        ON CONFLICT (user_id, trades_comment_id)\n            DO UPDATE SET\n                is_deleted = EXCLUDED.is_deleted,\n                last_updated = CURRENT_TIMESTAMP;\n                ";
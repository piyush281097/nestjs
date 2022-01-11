"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCommentOnTradeLikeDbQuery = void 0;
exports.UpdateCommentOnTradeLikeDbQuery = `
INSERT INTO comment_likes (trades_comment_id, post_comment_id, user_id, is_deleted)
            VALUES ($1, null, $2, $3)
        ON CONFLICT (user_id, trades_comment_id)
            DO UPDATE SET
                is_deleted = EXCLUDED.is_deleted,
                last_updated = CURRENT_TIMESTAMP;
                `;
//# sourceMappingURL=update-comment-like.db-query.js.map
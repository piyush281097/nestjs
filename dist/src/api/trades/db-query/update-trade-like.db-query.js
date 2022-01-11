"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTradeLikeDbQuery = void 0;
exports.UpdateTradeLikeDbQuery = `
INSERT INTO trades_likes (trade_id, user_id, is_deleted)
            VALUES ($1, $2, $3)
        ON CONFLICT (user_id, trade_id)
            DO UPDATE SET
                is_deleted = EXCLUDED.is_deleted,
                last_updated = CURRENT_TIMESTAMP;
                `;
//# sourceMappingURL=update-trade-like.db-query.js.map
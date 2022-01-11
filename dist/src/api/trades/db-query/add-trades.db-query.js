"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTradeDbQuery = void 0;
exports.addTradeDbQuery = `
INSERT INTO trades_master (user_id, content)
VALUES ($1, $2) RETURNING *;
`;
//# sourceMappingURL=add-trades.db-query.js.map
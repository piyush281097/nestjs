"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPostDbQuery = void 0;
exports.addPostDbQuery = `
INSERT INTO posts_master (user_id, content)
VALUES ($1, $2) RETURNING *;
`;
//# sourceMappingURL=add-post.db-query.js.map
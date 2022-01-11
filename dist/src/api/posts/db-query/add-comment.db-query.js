"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCommentOnPostDbQuery = void 0;
exports.addCommentOnPostDbQuery = `
INSERT INTO posts_comments (user_id, post_id, comment)
VALUES ($1, $2, $3);`;
//# sourceMappingURL=add-comment.db-query.js.map
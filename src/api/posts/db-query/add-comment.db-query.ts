export const addCommentOnPostDbQuery = `
INSERT INTO posts_comments (user_id, post_id, comment)
VALUES ($1, $2, $3);`;

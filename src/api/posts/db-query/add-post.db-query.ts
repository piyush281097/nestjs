export const addPostDbQuery = `
INSERT INTO posts_master (user_id, content)
VALUES ($1, $2) RETURNING *;
`;

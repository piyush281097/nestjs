export const addTradeDbQuery = `
INSERT INTO trades_master (user_id, content)
VALUES ($1, $2) RETURNING *;
`;

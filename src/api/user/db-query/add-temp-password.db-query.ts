export const addTempPasswordForUser = `
UPDATE
    user_core
SET
    PASSWORD = $1,
    password_salt = $2
WHERE
    id = $3;
`;

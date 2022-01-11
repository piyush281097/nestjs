export const resetPasswordDbQuery = `
WITH update_password AS (
    UPDATE
        user_core
    SET
        PASSWORD = $1,
        password_salt = $2
    WHERE
        id = $3)
UPDATE
    otp_log
SET
    is_verified = TRUE
WHERE
    id = $4
`;

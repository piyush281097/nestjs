export const verifyUserOtpAndAccountDbQuery = `
WITH update_otp as (
    UPDATE
        otp_log
    SET
        is_verified = TRUE
    WHERE
        id = $1)
UPDATE
    user_core
SET
    is_verified = TRUE,
    is_active = TRUE
WHERE
    id = $2
`;

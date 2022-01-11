export const getOtpByEmailDbQuery = `
SELECT
    ol.id AS otp_id,
    user_id,
    otp AS otp_hash
FROM
    otp_log ol
    INNER JOIN user_core uc ON uc.id = ol.user_id
        AND uc.email = $1
        AND ol.is_verified = FALSE
ORDER BY ol.last_updated DESC
LIMIT 1;
`;

export const addOtpForUserDbQuery = `
INSERT INTO otp_log (user_id, source, type, otp)
    VALUES ($1, $2, $3, $4)
`;

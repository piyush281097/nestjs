"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOtpByEmailDbQuery = void 0;
exports.getOtpByEmailDbQuery = `
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
//# sourceMappingURL=get-otp-by-email.db-query.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordDbQuery = void 0;
exports.resetPasswordDbQuery = `
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
//# sourceMappingURL=reset-password.db-query.js.map
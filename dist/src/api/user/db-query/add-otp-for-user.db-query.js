"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addOtpForUserDbQuery = void 0;
exports.addOtpForUserDbQuery = `
INSERT INTO otp_log (user_id, source, type, otp)
    VALUES ($1, $2, $3, $4)
`;
//# sourceMappingURL=add-otp-for-user.db-query.js.map
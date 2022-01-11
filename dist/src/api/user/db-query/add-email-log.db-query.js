"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addEmailLogDbQuery = void 0;
exports.addEmailLogDbQuery = `
insert into email_log (user_id, email_type, "from", "to", subject, body, is_success, failed_reason)
values ($1, $2, $3, $4, $5, $6, $7, $8);
`;
//# sourceMappingURL=add-email-log.db-query.js.map
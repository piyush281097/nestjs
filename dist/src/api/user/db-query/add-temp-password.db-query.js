"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTempPasswordForUser = void 0;
exports.addTempPasswordForUser = `
UPDATE
    user_core
SET
    PASSWORD = $1,
    password_salt = $2
WHERE
    id = $3;
`;
//# sourceMappingURL=add-temp-password.db-query.js.map
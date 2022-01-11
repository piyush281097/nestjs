"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserIsSignupCompleteFlagDbQuery = void 0;
exports.UpdateUserIsSignupCompleteFlagDbQuery = `
UPDATE
    user_core
SET
    is_signup_complete = TRUE
WHERE
    id = $1
`;
//# sourceMappingURL=update-user-signup-complete-bool.db-query.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserIsDemoCompleteFlagDbQuery = void 0;
exports.UpdateUserIsDemoCompleteFlagDbQuery = `
UPDATE
    user_core
SET
    is_demo_complete = TRUE
WHERE
    id = $1
`;
//# sourceMappingURL=update-user-demo-complete-bool.db-query.js.map
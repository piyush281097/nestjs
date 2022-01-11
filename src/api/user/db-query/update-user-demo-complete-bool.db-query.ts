export const UpdateUserIsDemoCompleteFlagDbQuery = `
UPDATE
    user_core
SET
    is_demo_complete = TRUE
WHERE
    id = $1
`;

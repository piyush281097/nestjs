export const UpdateUserIsSignupCompleteFlagDbQuery = `
UPDATE
    user_core
SET
    is_signup_complete = TRUE
WHERE
    id = $1
`;

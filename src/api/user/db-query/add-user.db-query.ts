export const addUserDbQuery = `
WITH ins_user_core AS (
    INSERT INTO user_core (email, PASSWORD, password_salt, country_code, mobile_number, user_handle)
            VALUES ($1, $2, $3, $4, $5, $11)
        RETURNING
            id AS user_id),
            ins_otp_user AS (
                INSERT INTO otp_log (user_id, source, type, otp)
                        VALUES ((
                                SELECT
                                    user_id
                                FROM
                                    ins_user_core),
                                $8,
                                $9,
                                $10))
        INSERT INTO user_profile (user_id, first_name, last_name)
            VALUES ((
                    SELECT
                        user_id
                    FROM
                        ins_user_core),
                    $6,
                    $7)
        RETURNING (
            SELECT
                user_id
            FROM
                ins_user_core);
`;

export const addUserSocialLoginDbQuery = `
WITH ins_user_core AS (
    INSERT INTO user_core (email, user_handle, is_social_login, is_active, is_verified)
            VALUES ($1, $2, TRUE, TRUE, TRUE)
        RETURNING
            id AS user_id)
        INSERT INTO user_profile (user_id, first_name, last_name)
            VALUES ((
                    SELECT
                        user_id
                    FROM
                        ins_user_core),
                    $3,
                    $4)
        RETURNING (
            SELECT
                user_id
            FROM
                ins_user_core);
`;

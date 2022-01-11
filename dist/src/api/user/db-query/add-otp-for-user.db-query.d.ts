export declare const addOtpForUserDbQuery = "\nINSERT INTO otp_log (user_id, source, type, otp)\n    VALUES ($1, $2, $3, $4)\n";

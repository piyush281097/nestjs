export declare const addEmailLogDbQuery = "\ninsert into email_log (user_id, email_type, \"from\", \"to\", subject, body, is_success, failed_reason)\nvalues ($1, $2, $3, $4, $5, $6, $7, $8);\n";

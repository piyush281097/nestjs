export declare const addPostDbQuery = "\nINSERT INTO posts_master (user_id, content)\nVALUES ($1, $2) RETURNING *;\n";

export declare const addCommentOnPostDbQuery = "\nINSERT INTO posts_comments (user_id, post_id, comment)\nVALUES ($1, $2, $3);";

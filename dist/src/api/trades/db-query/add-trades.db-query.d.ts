export declare const addTradeDbQuery = "\nINSERT INTO trades_master (user_id, content)\nVALUES ($1, $2) RETURNING *;\n";

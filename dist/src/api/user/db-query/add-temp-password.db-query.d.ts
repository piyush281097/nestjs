export declare const addTempPasswordForUser = "\nUPDATE\n    user_core\nSET\n    PASSWORD = $1,\n    password_salt = $2\nWHERE\n    id = $3;\n";

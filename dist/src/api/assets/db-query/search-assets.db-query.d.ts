export declare const searchAssetDbQuery = "\nSELECT\n    id as asset_id,\n    symbol\nFROM\n    master_assets \nWHERE\n    symbol ILIKE $1\n    LIMIT 10;\n";

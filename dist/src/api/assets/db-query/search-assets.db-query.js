"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchAssetDbQuery = void 0;
exports.searchAssetDbQuery = `
SELECT
    id as asset_id,
    symbol
FROM
    master_assets 
WHERE
    symbol ILIKE $1
    LIMIT 10;
`;
//# sourceMappingURL=search-assets.db-query.js.map
export const searchAssetDbQuery = `
SELECT
    id as asset_id,
    symbol
FROM
    master_assets 
WHERE
    symbol ILIKE $1
    LIMIT 10;
`;

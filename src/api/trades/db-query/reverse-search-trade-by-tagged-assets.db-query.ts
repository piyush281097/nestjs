export const reverseSearchTradeByTaggedAssetDbQuery = `
WITH select_trade_ids as (
    SELECT id from master_assets where symbol = $4 ORDER BY last_updated DESC 
    OFFSET $2 LIMIT $1
)
select tm.id                                                           as trade_id,
       tm.content                                                      as content,
       tm.type                                                         as type,
       count(DISTINCT pl.id) FILTER (WHERE pl.id IS NOT NULL)::integer as likes,
       count(DISTINCT tc.id) FILTER (WHERE tc.id IS NOT NULL)::integer as comments,
       case when pl2.id is not null then true else false end           as is_liked,
       jsonb_build_object(
               'user_id', uc2.id,
               'user_handle', uc2.user_handle,
               'first_name', up2.first_name,
               'last_name', up2.last_name
           )                                                           as created_by,
       json_agg(
       DISTINCT jsonb_build_object(
               'asset_id', tm.asset_id,
               'symbol', ma.symbol)
           ) FILTER (WHERE tm.asset_id IS NOT NULL)                    AS tagged_assets
from trades_master tm
         left join tagged_users tu on tm.id = tu.trade_id
         left join user_core uc on uc.id = tu.user_id
         left join user_profile up on uc.id = up.user_id
         left join user_core uc2 on uc2.id = tm.user_id
         left join user_profile up2 on uc2.id = up2.user_id
         left join master_assets ma on tm.asset_id = ma.id
         left join trades_likes pl on pl.trade_id = tm.id AND pl.is_deleted = FALSE
         left join trades_likes pl2 on pl2.trade_id = tm.id AND pl2.is_deleted = FALSE AND pl2.user_id = $3
         left join trades_comments tc on tc.trade_id = tm.id AND tc.is_deleted = FALSE AND tc.parent_comment_id is NULL
WHERE tm.is_deleted = FALSE -- user_where_condition
AND tm.asset_id IN (select id from select_trade_ids)
group by tm.id, uc2.id, uc2.user_handle, up2.first_name, up2.last_name, pl2.id
ORDER BY tm.last_updated DESC
OFFSET $2 LIMIT $1;
`;

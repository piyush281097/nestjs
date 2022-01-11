export declare const getNotificationOfUserDbQuery = "\nWITH temp_cte AS (\n    SELECT\n        1 AS temp\n),\nliked_post_cte AS (\n    SELECT\n        1 AS temp,\n        'post_like' AS type,\n        CASE WHEN count(*) > 1 THEN\n            ss.first_name || ' ' || ss.last_name || ' and' || count(*) - 1 || ' other ' || ' liked your post: ' || mp.\"content\"\n        ELSE\n            ss.first_name || ' ' || ss.last_name || ' liked your post: ' || mp.\"content\"\n        END AS text,\n        ne.event_parent_id,\n        extract(epoch from ss.last_updated::timestamptz(0)) as last_updated\n    FROM\n        notification_events ne\n        INNER JOIN master_notification_types mnt ON ne.event_type = mnt.id\n            AND mnt.type = 'post_like'\n        INNER JOIN posts_master mp ON mp.id = ne.event_parent_id\n        INNER JOIN ( SELECT DISTINCT ON (event_parent_id)\n                event_parent_id,\n                up.first_name,\n                up.last_name,\n                ne.last_updated\n            FROM\n                notification_events ne\n                INNER JOIN master_notification_types mnt ON ne.event_type = mnt.id\n                    AND mnt.type = 'post_like'\n                INNER JOIN posts_master mp ON mp.id = ne.event_parent_id\n                LEFT JOIN user_profile up ON up.user_id = ne.created_by\n            WHERE\n                target_user = $1\n                AND target_user != created_by\n                AND ne.is_deleted IS NOT TRUE AND ne.is_read IS NOT TRUE\n            ORDER BY\n                event_parent_id,\n                ne.last_updated DESC) ss ON ne.event_parent_id = ss.event_parent_id\n        WHERE\n            target_user = $1\n            AND target_user != created_by\n            AND ne.is_deleted IS NOT TRUE AND ne.is_read IS NOT TRUE\n        GROUP BY\n            ne.event_parent_id,\n            mp.\"content\",\n            ss.first_name,\n            ss.last_name,\n            ss.last_updated\n),\nliked_trade_cte AS (\n    SELECT\n        1 AS temp,\n        'trade_like' AS type,\n        CASE WHEN count(*) > 1 THEN\n            ss.first_name || ' ' || ss.last_name || ' and' || count(*) - 1 || ' other ' || ' liked your trade: ' || tm.\"content\"\n        ELSE\n            ss.first_name || ' ' || ss.last_name || ' liked your trade: ' || tm.\"content\"\n        END AS text,\n        ne.event_parent_id,\n        extract(epoch from ss.last_updated::timestamptz(0)) as last_updated\n    FROM\n        notification_events ne\n        INNER JOIN master_notification_types mnt ON ne.event_type = mnt.id\n            AND mnt.type = 'trade_like'\n        INNER JOIN trades_master tm ON tm.id = ne.event_parent_id\n        INNER JOIN ( SELECT DISTINCT ON (event_parent_id)\n                event_parent_id,\n                up.first_name,\n                up.last_name,\n                ne.last_updated\n            FROM\n                notification_events ne\n                INNER JOIN master_notification_types mnt ON ne.event_type = mnt.id\n                    AND mnt.type = 'trade_like'\n                INNER JOIN trades_master tm ON tm.id = ne.event_parent_id\n                LEFT JOIN user_profile up ON up.user_id = ne.created_by\n            WHERE\n                target_user = $1\n                AND target_user != created_by\n                AND ne.is_deleted IS NOT TRUE AND ne.is_read IS NOT TRUE\n            ORDER BY\n                event_parent_id,\n                ne.last_updated DESC) ss ON ne.event_parent_id = ss.event_parent_id\n        WHERE\n            target_user = $1\n            AND target_user != created_by\n            AND ne.is_deleted IS NOT TRUE AND ne.is_read IS NOT TRUE\n        GROUP BY\n            ne.event_parent_id,\n            tm.\"content\",\n            ss.first_name,\n            ss.last_name,\n            ss.last_updated\n),\npost_comment_and_reply_cte AS (\n    SELECT\n        1 AS temp,\n        CASE WHEN pc.parent_comment_id IS NOT NULL THEN\n            'post_comment_like'\n        ELSE\n            'post_reply_like'\n        END AS type,\n        CASE WHEN pc.parent_comment_id IS NOT NULL THEN\n            CASE WHEN count(*) > 1 THEN\n                ss.first_name || ' ' || ss.last_name || ' and ' || count(*) - 1 || ' other ' || ' liked your reply on a post: \"' || pc.comment || '\"'\n            ELSE\n                ss.first_name || ' ' || ss.last_name || ' liked your reply on a post: \"' || pc.comment || '\"'\n            END\n        ELSE\n            CASE WHEN count(*) > 1 THEN\n                ss.first_name || ' ' || ss.last_name || ' and ' || count(*) - 1 || ' other ' || ' liked your comment on a post: \"' || pc.comment || '\"'\n            ELSE\n                ss.first_name || ' ' || ss.last_name || ' liked your comment on a post: \"' || pc.comment || '\"'\n            END\n        END AS text,\n        ne.event_parent_id,\n        extract(epoch from ss.last_updated::timestamptz(0)) as last_updated\n    FROM\n        notification_events ne\n        INNER JOIN master_notification_types mnt ON ne.event_type = mnt.id\n            AND (mnt.type = 'comment_like'\n                OR mnt.type = 'reply_like')\n            INNER JOIN posts_comments pc ON pc.id = ne.event_parent_id\n            INNER JOIN ( SELECT DISTINCT ON (event_parent_id)\n                    event_parent_id,\n                    up.first_name,\n                    up.last_name,\n                    ne.last_updated\n                FROM\n                    notification_events ne\n                    INNER JOIN master_notification_types mnt ON ne.event_type = mnt.id\n                        AND (mnt.type = 'comment_like'\n                            OR mnt.type = 'reply_like')\n                        INNER JOIN posts_comments pc ON pc.id = ne.event_parent_id\n                        LEFT JOIN user_profile up ON up.user_id = ne.created_by\n                    WHERE\n                        target_user = $1\n                        AND target_user != created_by\n                        AND ne.is_deleted IS NOT TRUE AND ne.is_read IS NOT TRUE\n                    ORDER BY\n                        event_parent_id,\n                        ne.last_updated DESC) ss ON ne.event_parent_id = ss.event_parent_id\n                WHERE\n                    target_user = $1\n                    AND target_user != created_by\n                    AND ne.is_deleted IS NOT TRUE AND ne.is_read IS NOT TRUE\n                GROUP BY\n                    ne.event_parent_id,\n                    pc.comment,\n                    pc.parent_comment_id,\n                    ss.first_name,\n                    ss.last_name,\n                    ss.last_updated\n),\ntrades_comments_and_reply_cte AS (\n    SELECT\n        CASE WHEN tc.parent_comment_id IS NOT NULL THEN\n            'trade_comment_like'\n        ELSE\n            'trade_reply_like'\n        END AS type,\n        CASE WHEN tc.parent_comment_id IS NOT NULL THEN\n            CASE WHEN count(*) > 1 THEN\n                ss.first_name || ' ' || ss.last_name || ' and ' || count(*) - 1 || ' other ' || ' liked your reply on a trade: \"' || tc.comment || '\"'\n            ELSE\n                ss.first_name || ' ' || ss.last_name || ' liked your reply on a trade: \"' || tc.comment || '\"'\n            END\n        ELSE\n            CASE WHEN count(*) > 1 THEN\n                ss.first_name || ' ' || ss.last_name || ' and ' || count(*) - 1 || ' other ' || ' liked your comment on a trade: \"' || tc.comment || '\"'\n            ELSE\n                ss.first_name || ' ' || ss.last_name || ' liked your comment on a trade: \"' || tc.comment || '\"'\n            END\n        END AS text,\n        ne.event_parent_id,\n        extract(epoch from ss.last_updated::timestamptz(0)) as last_updated\n    FROM\n        notification_events ne\n        INNER JOIN master_notification_types mnt ON ne.event_type = mnt.id\n            AND (mnt.type = 'comment_like'\n                OR mnt.type = 'reply_like')\n            INNER JOIN trades_comments tc ON tc.id = ne.event_parent_id\n            INNER JOIN ( SELECT DISTINCT ON (event_parent_id)\n                    event_parent_id,\n                    up.first_name,\n                    up.last_name,\n                    ne.last_updated\n                FROM\n                    notification_events ne\n                    INNER JOIN master_notification_types mnt ON ne.event_type = mnt.id\n                        AND (mnt.type = 'comment_like'\n                            OR mnt.type = 'reply_like')\n                        INNER JOIN trades_comments tc ON tc.id = ne.event_parent_id\n                        LEFT JOIN user_profile up ON up.user_id = ne.created_by\n                    WHERE\n                        target_user = $1\n                        AND target_user != created_by\n                        AND ne.is_deleted IS NOT TRUE AND ne.is_read IS NOT TRUE\n                    ORDER BY\n                        event_parent_id,\n                        ne.last_updated DESC) ss ON ne.event_parent_id = ss.event_parent_id\n                WHERE\n                    target_user = $1\n                    AND target_user != created_by\n                    AND ne.is_deleted IS NOT TRUE AND ne.is_read IS NOT TRUE\n                GROUP BY\n                    ne.event_parent_id,\n                    tc.comment,\n                    tc.parent_comment_id,\n                    ss.first_name,\n                    ss.last_name,\n                    ss.last_updated\n),\ncommented_on_post_cte AS (\n    SELECT\n        'post_comment' AS type,\n        CASE WHEN count(*) > 1 THEN\n            ss.first_name || ' ' || ss.last_name || ' and ' || count(*) - 1 || ' other ' || ' commented on your post: \"' || pm.content || '\"'\n        ELSE\n            ss.first_name || ' ' || ss.last_name || ' commented on your post: \"' || pm.content || '\"'\n        END AS text,\n        pm.id,\n        ss.event_parent_id,\n        extract(epoch from ss.last_updated::timestamptz(0)) as last_updated\n    FROM\n        notification_events ne\n        INNER JOIN master_notification_types mnt ON ne.event_type = mnt.id\n            AND mnt.type = 'post_comment'\n        INNER JOIN posts_comments pc ON pc.id = ne.event_parent_id\n        INNER JOIN posts_master pm ON pm.id = pc.post_id\n        INNER JOIN ( SELECT DISTINCT ON (pc.post_id)\n                pc.post_id,\n                event_parent_id,\n                up.first_name,\n                up.last_name,\n                ne.last_updated\n            FROM\n                notification_events ne\n                INNER JOIN master_notification_types mnt ON ne.event_type = mnt.id\n                    AND mnt.type = 'post_comment'\n                INNER JOIN posts_comments pc ON pc.id = ne.event_parent_id\n                LEFT JOIN user_profile up ON up.user_id = ne.created_by\n            WHERE\n                target_user = $1\n                AND target_user != created_by\n                AND ne.is_deleted IS NOT TRUE AND ne.is_read IS NOT TRUE\n            ORDER BY\n                pc.post_id,\n                ne.last_updated DESC) ss ON ss.post_id = pc.post_id\n        WHERE\n            target_user = $1\n            AND target_user != created_by\n            AND ne.is_deleted IS NOT TRUE AND ne.is_read IS NOT TRUE\n        GROUP BY\n            pc.post_id,\n            ss.first_name,\n            ss.last_name,\n            pm.content,\n            pm.id,\n            ss.last_updated,\n            ss.event_parent_id\n),\ncommented_on_trade_cte AS (\n    SELECT\n        CASE WHEN count(*) > 1 THEN\n            ss.first_name || ' ' || ss.last_name || ' and ' || count(*) - 1 || ' other ' || ' commented on your trade: \"' || tm.content || '\"'\n        ELSE\n            ss.first_name || ' ' || ss.last_name || ' commented on your trade: \"' || tm.content || '\"'\n        END AS text,\n        tm.id,\n        extract(epoch from ss.last_updated::timestamptz(0)) as last_updated,\n        ss.event_parent_id,\n        'trade_comment' AS type\n    FROM\n        notification_events ne\n        INNER JOIN master_notification_types mnt ON ne.event_type = mnt.id\n            AND mnt.type = 'trade_comment'\n        INNER JOIN trades_comments tc ON tc.id = ne.event_parent_id\n        INNER JOIN trades_master tm ON tm.id = tc.trade_id\n        INNER JOIN ( SELECT DISTINCT ON (tc.trade_id)\n                tc.trade_id,\n                event_parent_id,\n                up.first_name,\n                up.last_name,\n                ne.last_updated\n            FROM\n                notification_events ne\n                INNER JOIN master_notification_types mnt ON ne.event_type = mnt.id\n                    AND mnt.type = 'trade_comment'\n                INNER JOIN trades_comments tc ON tc.id = ne.event_parent_id\n                LEFT JOIN user_profile up ON up.user_id = ne.created_by\n            WHERE\n                target_user = $1\n                AND target_user != created_by\n                AND ne.is_deleted IS NOT TRUE AND ne.is_read IS NOT TRUE\n            ORDER BY\n                tc.trade_id,\n                ne.last_updated DESC) ss ON ss.trade_id = tc.trade_id\n        WHERE\n            target_user = $1\n            AND target_user != created_by\n            AND ne.is_deleted IS NOT TRUE AND ne.is_read IS NOT TRUE\n        GROUP BY\n            tc.trade_id,\n            ss.first_name,\n            ss.last_name,\n            tm.content,\n            tm.id,\n            ss.last_updated,\n            ss.event_parent_id\n),\nshared_post_cte AS (\n    SELECT\n        CASE WHEN count(*) > 1 THEN\n            ss.first_name || ' ' || ss.last_name || ' and ' || count(*) - 1 || ' other ' || ' shared your post: \"' || pm.content || '\"'\n        ELSE\n            ss.first_name || ' ' || ss.last_name || ' shared your post:  \"' || pm.content || '\"'\n        END AS text,\n        pm.id as event_parent_id,\n        extract(epoch from ss.last_updated::timestamptz(0)) as last_updated,\n        'post_shared' AS type\n    FROM\n        notification_events ne\n        INNER JOIN master_notification_types mnt ON ne.event_type = mnt.id\n            AND mnt.type = 'post_shared'\n        INNER JOIN posts_shared ps ON ps.post_id = ne.event_parent_id\n        INNER JOIN posts_master pm ON pm.id = ps.shared_post_id\n        LEFT JOIN user_profile up ON up.user_id = ne.created_by\n        INNER JOIN ( SELECT DISTINCT ON (ps.shared_post_id)\n                ps.shared_post_id,\n                event_parent_id,\n                up.first_name,\n                up.last_name,\n                ne.last_updated\n            FROM\n                notification_events ne\n                INNER JOIN master_notification_types mnt ON ne.event_type = mnt.id\n                    AND mnt.type = 'post_shared'\n                INNER JOIN posts_shared ps ON ps.post_id = ne.event_parent_id\n                INNER JOIN posts_master pm ON pm.id = ps.shared_post_id\n                LEFT JOIN user_profile up ON up.user_id = ne.created_by\n            WHERE\n                target_user = $1\n                AND target_user != created_by\n                AND ne.is_deleted IS NOT TRUE AND ne.is_read IS NOT TRUE\n            ORDER BY\n                ps.shared_post_id,\n                ne.last_updated DESC) ss ON ss.shared_post_id = ps.shared_post_id\n        WHERE\n            target_user = $1\n            AND target_user != created_by\n            AND ne.is_deleted IS NOT TRUE AND ne.is_read IS NOT TRUE\n        GROUP BY\n            ss.first_name,\n            ss.last_name,\n            pm.content,\n            pm.id,\n            ss.last_updated,\n            ss.event_parent_id\n),\ntagged_user_cte AS (\n    SELECT\n        CASE WHEN count(*) > 1 THEN\n            up.first_name || ' ' || up.last_name || ' and ' || count(*) - 1 || ' other ' || ' tagged you on a post: \"' || pm.content || '\"'\n        ELSE\n            up.first_name || ' ' || up.last_name || ' tagged you on a post: \"' || pm.content || '\"'\n        END AS text,\n        extract(epoch from ne.last_updated::timestamptz(0)) as last_updated,\n        ne.event_parent_id,\n        'post_user_tagged' AS type\n    FROM\n        notification_events ne\n        INNER JOIN master_notification_types mnt ON ne.event_type = mnt.id\n            AND mnt.type = 'post_user_tagged'\n        INNER JOIN tagged_users tu ON tu.id = ne.event_parent_id\n            AND tu.\"type\" = 'post'\n        INNER JOIN posts_master pm ON pm.id = tu.post_id\n        LEFT JOIN user_profile up ON up.user_id = pm.user_id\n    WHERE\n        target_user = $1\n        AND target_user != created_by\n        AND ne.is_deleted IS NOT TRUE AND ne.is_read IS NOT TRUE\n    GROUP BY\n        up.first_name,\n        up.last_name,\n        pm.content,\n        pm.id,\n        ne.last_updated,\n        ne.event_parent_id\n),\nfollowing_user_cte AS (\n    SELECT\n        CASE WHEN count(*) > 1 THEN\n            ss.first_name || ' ' || ss.last_name || ' and ' || count(*) - 1 || ' other ' || ' started following you'\n        ELSE\n            ss.first_name || ' ' || ss.last_name || ' started following you'\n        END AS text,\n        extract(epoch from ss.last_updated::timestamptz(0)) as last_updated,\n        f.follower_id,\n        'follow' AS type,\n        ss.event_parent_id\n    FROM\n        notification_events ne\n        INNER JOIN master_notification_types mnt ON ne.event_type = mnt.id\n            AND mnt.type = 'follow'\n        INNER JOIN followers f ON f.id = ne.event_parent_id\n        INNER JOIN ( SELECT DISTINCT ON (f.follower_id)\n                f.follower_id,\n                up.first_name,\n                up.last_name,\n                ne.last_updated,\n                ne.event_parent_id\n            FROM\n                notification_events ne\n                INNER JOIN master_notification_types mnt ON ne.event_type = mnt.id\n                    AND mnt.type = 'follow'\n                INNER JOIN followers f ON f.id = ne.event_parent_id\n                LEFT JOIN user_profile up ON f.user_id = up.id\n            WHERE\n                target_user = $1\n                AND target_user != created_by\n                AND ne.is_deleted IS NOT TRUE AND ne.is_read IS NOT TRUE\n            ORDER BY\n                f.follower_id,\n                ne.last_updated DESC) ss ON ss.follower_id = f.follower_id\n        WHERE\n            target_user = $1\n            AND target_user != created_by\n            AND ne.is_deleted IS NOT TRUE AND ne.is_read IS NOT TRUE\n        GROUP BY\n            f.follower_id,\n            ss.first_name,\n            ss.last_name,\n            ss.last_updated,\n            ss.event_parent_id\n),\ncombined_cte AS (\n    SELECT\n        type,\n        text,\n        event_parent_id,\n        last_updated\n    FROM\n        liked_post_cte lpc\n    UNION\n    SELECT\n        type,\n        text,\n        event_parent_id,\n        last_updated\n    FROM\n        liked_trade_cte ltc\n    UNION\n    SELECT\n        type,\n        text,\n        event_parent_id,\n        last_updated\n    FROM\n        post_comment_and_reply_cte pcarc\n    UNION\n    SELECT\n        type,\n        text,\n        event_parent_id,\n        last_updated\n    FROM\n        trades_comments_and_reply_cte tcarc\n    UNION\n    SELECT\n        type,\n        text,\n        event_parent_id,\n        last_updated\n    FROM\n        commented_on_post_cte copc\n    UNION\n    SELECT\n        type,\n        text,\n        event_parent_id,\n        last_updated\n    FROM\n        commented_on_trade_cte cotc\n    UNION\n    SELECT\n        type,\n        text,\n        event_parent_id,\n        last_updated\n    FROM\n        shared_post_cte spc\n    UNION\n    SELECT\n        type,\n        text,\n        event_parent_id,\n        last_updated\n    FROM\n        tagged_user_cte tuc\n    UNION\n    SELECT\n        type,\n        text,\n        event_parent_id,\n        last_updated\n    FROM\n        following_user_cte fuc\n)\nSELECT\n    *\nFROM\n    combined_cte cc\nORDER BY\n    cc.last_updated DESC\n\n";
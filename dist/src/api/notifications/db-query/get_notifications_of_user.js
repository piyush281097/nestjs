"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotificationOfUserDbQuery = void 0;
exports.getNotificationOfUserDbQuery = `
WITH temp_cte AS (
    SELECT
        1 AS temp
),
liked_post_cte AS (
    SELECT
        1 AS temp,
        'post_like' AS type,
        CASE WHEN count(*) > 1 THEN
            ss.first_name || ' ' || ss.last_name || ' and' || count(*) - 1 || ' other ' || ' liked your post: ' || mp."content"
        ELSE
            ss.first_name || ' ' || ss.last_name || ' liked your post: ' || mp."content"
        END AS text,
        ne.event_parent_id,
        extract(epoch from ss.last_updated::timestamptz(0)) as last_updated
    FROM
        notification_events ne
        INNER JOIN master_notification_types mnt ON ne.event_type = mnt.id
            AND mnt.type = 'post_like'
        INNER JOIN posts_master mp ON mp.id = ne.event_parent_id
        INNER JOIN ( SELECT DISTINCT ON (event_parent_id)
                event_parent_id,
                up.first_name,
                up.last_name,
                ne.last_updated
            FROM
                notification_events ne
                INNER JOIN master_notification_types mnt ON ne.event_type = mnt.id
                    AND mnt.type = 'post_like'
                INNER JOIN posts_master mp ON mp.id = ne.event_parent_id
                LEFT JOIN user_profile up ON up.user_id = ne.created_by
            WHERE
                target_user = $1
                AND target_user != created_by
                AND ne.is_deleted IS NOT TRUE AND ne.is_read IS NOT TRUE
            ORDER BY
                event_parent_id,
                ne.last_updated DESC) ss ON ne.event_parent_id = ss.event_parent_id
        WHERE
            target_user = $1
            AND target_user != created_by
            AND ne.is_deleted IS NOT TRUE AND ne.is_read IS NOT TRUE
        GROUP BY
            ne.event_parent_id,
            mp."content",
            ss.first_name,
            ss.last_name,
            ss.last_updated
),
liked_trade_cte AS (
    SELECT
        1 AS temp,
        'trade_like' AS type,
        CASE WHEN count(*) > 1 THEN
            ss.first_name || ' ' || ss.last_name || ' and' || count(*) - 1 || ' other ' || ' liked your trade: ' || tm."content"
        ELSE
            ss.first_name || ' ' || ss.last_name || ' liked your trade: ' || tm."content"
        END AS text,
        ne.event_parent_id,
        extract(epoch from ss.last_updated::timestamptz(0)) as last_updated
    FROM
        notification_events ne
        INNER JOIN master_notification_types mnt ON ne.event_type = mnt.id
            AND mnt.type = 'trade_like'
        INNER JOIN trades_master tm ON tm.id = ne.event_parent_id
        INNER JOIN ( SELECT DISTINCT ON (event_parent_id)
                event_parent_id,
                up.first_name,
                up.last_name,
                ne.last_updated
            FROM
                notification_events ne
                INNER JOIN master_notification_types mnt ON ne.event_type = mnt.id
                    AND mnt.type = 'trade_like'
                INNER JOIN trades_master tm ON tm.id = ne.event_parent_id
                LEFT JOIN user_profile up ON up.user_id = ne.created_by
            WHERE
                target_user = $1
                AND target_user != created_by
                AND ne.is_deleted IS NOT TRUE AND ne.is_read IS NOT TRUE
            ORDER BY
                event_parent_id,
                ne.last_updated DESC) ss ON ne.event_parent_id = ss.event_parent_id
        WHERE
            target_user = $1
            AND target_user != created_by
            AND ne.is_deleted IS NOT TRUE AND ne.is_read IS NOT TRUE
        GROUP BY
            ne.event_parent_id,
            tm."content",
            ss.first_name,
            ss.last_name,
            ss.last_updated
),
post_comment_and_reply_cte AS (
    SELECT
        1 AS temp,
        CASE WHEN pc.parent_comment_id IS NOT NULL THEN
            'post_comment_like'
        ELSE
            'post_reply_like'
        END AS type,
        CASE WHEN pc.parent_comment_id IS NOT NULL THEN
            CASE WHEN count(*) > 1 THEN
                ss.first_name || ' ' || ss.last_name || ' and ' || count(*) - 1 || ' other ' || ' liked your reply on a post: "' || pc.comment || '"'
            ELSE
                ss.first_name || ' ' || ss.last_name || ' liked your reply on a post: "' || pc.comment || '"'
            END
        ELSE
            CASE WHEN count(*) > 1 THEN
                ss.first_name || ' ' || ss.last_name || ' and ' || count(*) - 1 || ' other ' || ' liked your comment on a post: "' || pc.comment || '"'
            ELSE
                ss.first_name || ' ' || ss.last_name || ' liked your comment on a post: "' || pc.comment || '"'
            END
        END AS text,
        ne.event_parent_id,
        extract(epoch from ss.last_updated::timestamptz(0)) as last_updated
    FROM
        notification_events ne
        INNER JOIN master_notification_types mnt ON ne.event_type = mnt.id
            AND (mnt.type = 'comment_like'
                OR mnt.type = 'reply_like')
            INNER JOIN posts_comments pc ON pc.id = ne.event_parent_id
            INNER JOIN ( SELECT DISTINCT ON (event_parent_id)
                    event_parent_id,
                    up.first_name,
                    up.last_name,
                    ne.last_updated
                FROM
                    notification_events ne
                    INNER JOIN master_notification_types mnt ON ne.event_type = mnt.id
                        AND (mnt.type = 'comment_like'
                            OR mnt.type = 'reply_like')
                        INNER JOIN posts_comments pc ON pc.id = ne.event_parent_id
                        LEFT JOIN user_profile up ON up.user_id = ne.created_by
                    WHERE
                        target_user = $1
                        AND target_user != created_by
                        AND ne.is_deleted IS NOT TRUE AND ne.is_read IS NOT TRUE
                    ORDER BY
                        event_parent_id,
                        ne.last_updated DESC) ss ON ne.event_parent_id = ss.event_parent_id
                WHERE
                    target_user = $1
                    AND target_user != created_by
                    AND ne.is_deleted IS NOT TRUE AND ne.is_read IS NOT TRUE
                GROUP BY
                    ne.event_parent_id,
                    pc.comment,
                    pc.parent_comment_id,
                    ss.first_name,
                    ss.last_name,
                    ss.last_updated
),
trades_comments_and_reply_cte AS (
    SELECT
        CASE WHEN tc.parent_comment_id IS NOT NULL THEN
            'trade_comment_like'
        ELSE
            'trade_reply_like'
        END AS type,
        CASE WHEN tc.parent_comment_id IS NOT NULL THEN
            CASE WHEN count(*) > 1 THEN
                ss.first_name || ' ' || ss.last_name || ' and ' || count(*) - 1 || ' other ' || ' liked your reply on a trade: "' || tc.comment || '"'
            ELSE
                ss.first_name || ' ' || ss.last_name || ' liked your reply on a trade: "' || tc.comment || '"'
            END
        ELSE
            CASE WHEN count(*) > 1 THEN
                ss.first_name || ' ' || ss.last_name || ' and ' || count(*) - 1 || ' other ' || ' liked your comment on a trade: "' || tc.comment || '"'
            ELSE
                ss.first_name || ' ' || ss.last_name || ' liked your comment on a trade: "' || tc.comment || '"'
            END
        END AS text,
        ne.event_parent_id,
        extract(epoch from ss.last_updated::timestamptz(0)) as last_updated
    FROM
        notification_events ne
        INNER JOIN master_notification_types mnt ON ne.event_type = mnt.id
            AND (mnt.type = 'comment_like'
                OR mnt.type = 'reply_like')
            INNER JOIN trades_comments tc ON tc.id = ne.event_parent_id
            INNER JOIN ( SELECT DISTINCT ON (event_parent_id)
                    event_parent_id,
                    up.first_name,
                    up.last_name,
                    ne.last_updated
                FROM
                    notification_events ne
                    INNER JOIN master_notification_types mnt ON ne.event_type = mnt.id
                        AND (mnt.type = 'comment_like'
                            OR mnt.type = 'reply_like')
                        INNER JOIN trades_comments tc ON tc.id = ne.event_parent_id
                        LEFT JOIN user_profile up ON up.user_id = ne.created_by
                    WHERE
                        target_user = $1
                        AND target_user != created_by
                        AND ne.is_deleted IS NOT TRUE AND ne.is_read IS NOT TRUE
                    ORDER BY
                        event_parent_id,
                        ne.last_updated DESC) ss ON ne.event_parent_id = ss.event_parent_id
                WHERE
                    target_user = $1
                    AND target_user != created_by
                    AND ne.is_deleted IS NOT TRUE AND ne.is_read IS NOT TRUE
                GROUP BY
                    ne.event_parent_id,
                    tc.comment,
                    tc.parent_comment_id,
                    ss.first_name,
                    ss.last_name,
                    ss.last_updated
),
commented_on_post_cte AS (
    SELECT
        'post_comment' AS type,
        CASE WHEN count(*) > 1 THEN
            ss.first_name || ' ' || ss.last_name || ' and ' || count(*) - 1 || ' other ' || ' commented on your post: "' || pm.content || '"'
        ELSE
            ss.first_name || ' ' || ss.last_name || ' commented on your post: "' || pm.content || '"'
        END AS text,
        pm.id,
        ss.event_parent_id,
        extract(epoch from ss.last_updated::timestamptz(0)) as last_updated
    FROM
        notification_events ne
        INNER JOIN master_notification_types mnt ON ne.event_type = mnt.id
            AND mnt.type = 'post_comment'
        INNER JOIN posts_comments pc ON pc.id = ne.event_parent_id
        INNER JOIN posts_master pm ON pm.id = pc.post_id
        INNER JOIN ( SELECT DISTINCT ON (pc.post_id)
                pc.post_id,
                event_parent_id,
                up.first_name,
                up.last_name,
                ne.last_updated
            FROM
                notification_events ne
                INNER JOIN master_notification_types mnt ON ne.event_type = mnt.id
                    AND mnt.type = 'post_comment'
                INNER JOIN posts_comments pc ON pc.id = ne.event_parent_id
                LEFT JOIN user_profile up ON up.user_id = ne.created_by
            WHERE
                target_user = $1
                AND target_user != created_by
                AND ne.is_deleted IS NOT TRUE AND ne.is_read IS NOT TRUE
            ORDER BY
                pc.post_id,
                ne.last_updated DESC) ss ON ss.post_id = pc.post_id
        WHERE
            target_user = $1
            AND target_user != created_by
            AND ne.is_deleted IS NOT TRUE AND ne.is_read IS NOT TRUE
        GROUP BY
            pc.post_id,
            ss.first_name,
            ss.last_name,
            pm.content,
            pm.id,
            ss.last_updated,
            ss.event_parent_id
),
commented_on_trade_cte AS (
    SELECT
        CASE WHEN count(*) > 1 THEN
            ss.first_name || ' ' || ss.last_name || ' and ' || count(*) - 1 || ' other ' || ' commented on your trade: "' || tm.content || '"'
        ELSE
            ss.first_name || ' ' || ss.last_name || ' commented on your trade: "' || tm.content || '"'
        END AS text,
        tm.id,
        extract(epoch from ss.last_updated::timestamptz(0)) as last_updated,
        ss.event_parent_id,
        'trade_comment' AS type
    FROM
        notification_events ne
        INNER JOIN master_notification_types mnt ON ne.event_type = mnt.id
            AND mnt.type = 'trade_comment'
        INNER JOIN trades_comments tc ON tc.id = ne.event_parent_id
        INNER JOIN trades_master tm ON tm.id = tc.trade_id
        INNER JOIN ( SELECT DISTINCT ON (tc.trade_id)
                tc.trade_id,
                event_parent_id,
                up.first_name,
                up.last_name,
                ne.last_updated
            FROM
                notification_events ne
                INNER JOIN master_notification_types mnt ON ne.event_type = mnt.id
                    AND mnt.type = 'trade_comment'
                INNER JOIN trades_comments tc ON tc.id = ne.event_parent_id
                LEFT JOIN user_profile up ON up.user_id = ne.created_by
            WHERE
                target_user = $1
                AND target_user != created_by
                AND ne.is_deleted IS NOT TRUE AND ne.is_read IS NOT TRUE
            ORDER BY
                tc.trade_id,
                ne.last_updated DESC) ss ON ss.trade_id = tc.trade_id
        WHERE
            target_user = $1
            AND target_user != created_by
            AND ne.is_deleted IS NOT TRUE AND ne.is_read IS NOT TRUE
        GROUP BY
            tc.trade_id,
            ss.first_name,
            ss.last_name,
            tm.content,
            tm.id,
            ss.last_updated,
            ss.event_parent_id
),
shared_post_cte AS (
    SELECT
        CASE WHEN count(*) > 1 THEN
            ss.first_name || ' ' || ss.last_name || ' and ' || count(*) - 1 || ' other ' || ' shared your post: "' || pm.content || '"'
        ELSE
            ss.first_name || ' ' || ss.last_name || ' shared your post:  "' || pm.content || '"'
        END AS text,
        pm.id as event_parent_id,
        extract(epoch from ss.last_updated::timestamptz(0)) as last_updated,
        'post_shared' AS type
    FROM
        notification_events ne
        INNER JOIN master_notification_types mnt ON ne.event_type = mnt.id
            AND mnt.type = 'post_shared'
        INNER JOIN posts_shared ps ON ps.post_id = ne.event_parent_id
        INNER JOIN posts_master pm ON pm.id = ps.shared_post_id
        LEFT JOIN user_profile up ON up.user_id = ne.created_by
        INNER JOIN ( SELECT DISTINCT ON (ps.shared_post_id)
                ps.shared_post_id,
                event_parent_id,
                up.first_name,
                up.last_name,
                ne.last_updated
            FROM
                notification_events ne
                INNER JOIN master_notification_types mnt ON ne.event_type = mnt.id
                    AND mnt.type = 'post_shared'
                INNER JOIN posts_shared ps ON ps.post_id = ne.event_parent_id
                INNER JOIN posts_master pm ON pm.id = ps.shared_post_id
                LEFT JOIN user_profile up ON up.user_id = ne.created_by
            WHERE
                target_user = $1
                AND target_user != created_by
                AND ne.is_deleted IS NOT TRUE AND ne.is_read IS NOT TRUE
            ORDER BY
                ps.shared_post_id,
                ne.last_updated DESC) ss ON ss.shared_post_id = ps.shared_post_id
        WHERE
            target_user = $1
            AND target_user != created_by
            AND ne.is_deleted IS NOT TRUE AND ne.is_read IS NOT TRUE
        GROUP BY
            ss.first_name,
            ss.last_name,
            pm.content,
            pm.id,
            ss.last_updated,
            ss.event_parent_id
),
tagged_user_cte AS (
    SELECT
        CASE WHEN count(*) > 1 THEN
            up.first_name || ' ' || up.last_name || ' and ' || count(*) - 1 || ' other ' || ' tagged you on a post: "' || pm.content || '"'
        ELSE
            up.first_name || ' ' || up.last_name || ' tagged you on a post: "' || pm.content || '"'
        END AS text,
        extract(epoch from ne.last_updated::timestamptz(0)) as last_updated,
        ne.event_parent_id,
        'post_user_tagged' AS type
    FROM
        notification_events ne
        INNER JOIN master_notification_types mnt ON ne.event_type = mnt.id
            AND mnt.type = 'post_user_tagged'
        INNER JOIN tagged_users tu ON tu.id = ne.event_parent_id
            AND tu."type" = 'post'
        INNER JOIN posts_master pm ON pm.id = tu.post_id
        LEFT JOIN user_profile up ON up.user_id = pm.user_id
    WHERE
        target_user = $1
        AND target_user != created_by
        AND ne.is_deleted IS NOT TRUE AND ne.is_read IS NOT TRUE
    GROUP BY
        up.first_name,
        up.last_name,
        pm.content,
        pm.id,
        ne.last_updated,
        ne.event_parent_id
),
following_user_cte AS (
    SELECT
        CASE WHEN count(*) > 1 THEN
            ss.first_name || ' ' || ss.last_name || ' and ' || count(*) - 1 || ' other ' || ' started following you'
        ELSE
            ss.first_name || ' ' || ss.last_name || ' started following you'
        END AS text,
        extract(epoch from ss.last_updated::timestamptz(0)) as last_updated,
        f.follower_id,
        'follow' AS type,
        ss.event_parent_id
    FROM
        notification_events ne
        INNER JOIN master_notification_types mnt ON ne.event_type = mnt.id
            AND mnt.type = 'follow'
        INNER JOIN followers f ON f.id = ne.event_parent_id
        INNER JOIN ( SELECT DISTINCT ON (f.follower_id)
                f.follower_id,
                up.first_name,
                up.last_name,
                ne.last_updated,
                ne.event_parent_id
            FROM
                notification_events ne
                INNER JOIN master_notification_types mnt ON ne.event_type = mnt.id
                    AND mnt.type = 'follow'
                INNER JOIN followers f ON f.id = ne.event_parent_id
                LEFT JOIN user_profile up ON f.user_id = up.id
            WHERE
                target_user = $1
                AND target_user != created_by
                AND ne.is_deleted IS NOT TRUE AND ne.is_read IS NOT TRUE
            ORDER BY
                f.follower_id,
                ne.last_updated DESC) ss ON ss.follower_id = f.follower_id
        WHERE
            target_user = $1
            AND target_user != created_by
            AND ne.is_deleted IS NOT TRUE AND ne.is_read IS NOT TRUE
        GROUP BY
            f.follower_id,
            ss.first_name,
            ss.last_name,
            ss.last_updated,
            ss.event_parent_id
),
combined_cte AS (
    SELECT
        type,
        text,
        event_parent_id,
        last_updated
    FROM
        liked_post_cte lpc
    UNION
    SELECT
        type,
        text,
        event_parent_id,
        last_updated
    FROM
        liked_trade_cte ltc
    UNION
    SELECT
        type,
        text,
        event_parent_id,
        last_updated
    FROM
        post_comment_and_reply_cte pcarc
    UNION
    SELECT
        type,
        text,
        event_parent_id,
        last_updated
    FROM
        trades_comments_and_reply_cte tcarc
    UNION
    SELECT
        type,
        text,
        event_parent_id,
        last_updated
    FROM
        commented_on_post_cte copc
    UNION
    SELECT
        type,
        text,
        event_parent_id,
        last_updated
    FROM
        commented_on_trade_cte cotc
    UNION
    SELECT
        type,
        text,
        event_parent_id,
        last_updated
    FROM
        shared_post_cte spc
    UNION
    SELECT
        type,
        text,
        event_parent_id,
        last_updated
    FROM
        tagged_user_cte tuc
    UNION
    SELECT
        type,
        text,
        event_parent_id,
        last_updated
    FROM
        following_user_cte fuc
)
SELECT
    *
FROM
    combined_cte cc
ORDER BY
    cc.last_updated DESC

`;
//# sourceMappingURL=get_notifications_of_user.js.map
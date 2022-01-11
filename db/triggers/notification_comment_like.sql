CREATE OR REPLACE FUNCTION comment_like_create()
    RETURNS TRIGGER
    LANGUAGE PLPGSQL
AS
$$
BEGIN
    WITH get_user_id as (
        SELECT CASE
                   WHEN new.post_comment_id IS NOT NULL
                       THEN
                       (
                           SELECT pc.user_id
                           from comment_likes cl
                                    INNER JOIN posts_comments pc
                                               on pc.id = new.post_comment_id
                           LIMIT 1
                       )
                   ELSE
                       (
                           SELECT tc.user_id
                           from comment_likes cl
                                    INNER JOIN trades_comments tc
                                               on tc.id = new.trades_comment_id
                           LIMIT 1
                       )
                   END as user_id
    ),
         check_is_reply as (
             SELECT CASE
                        WHEN new.post_comment_id IS NOT NULL
                            THEN
                            (SELECT CASE WHEN pc.parent_comment_id is not null THEN TRUE ELSE FALSE END
                             from comment_likes cl
                                      INNER JOIN posts_comments pc
                                                 on pc.id = new.post_comment_id
                             LIMIT 1
                            )
                        ELSE
                            (SELECT CASE WHEN tc.parent_comment_id is not null THEN TRUE ELSE FALSE END
                             from comment_likes cl
                                      INNER JOIN trades_comments tc
                                                 on tc.id = new.trades_comment_id
                             LIMIT 1
                            )
                        END as is_reply
         ),
         get_notfication_id as (
             SELECT CASE
                        WHEN check_is_reply.is_reply = true
                            THEN
                            (
                                SELECT id
                                from master_notification_types
                                where type = 'reply_like'
                            )
                        ELSE
                            (
                                SELECT id
                                from master_notification_types
                                where type = 'comment_like'
                            )
                        END as id
             FROM check_is_reply
         )
    INSERT
    INTO notification_events(target_user, created_by, event_type, event_parent_id, is_deleted)
    VALUES ((SELECT user_id from get_user_id), new.user_id,
            (select id from get_notfication_id), COALESCE(new.post_comment_id, new.trades_comment_id), FALSE);

    RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_comment_like_create
    AFTER insert
    ON comment_likes
    FOR EACH ROW
EXECUTE PROCEDURE comment_like_create();


CREATE OR REPLACE FUNCTION comment_like_update()
    RETURNS TRIGGER
    LANGUAGE PLPGSQL
AS
$$
BEGIN
    WITH get_user_id as (
        SELECT CASE
                   WHEN new.post_comment_id IS NOT NULL
                       THEN
                       (
                           SELECT pc.user_id
                           from comment_likes cl
                                    INNER JOIN posts_comments pc
                                               on pc.id = new.post_comment_id
                           LIMIT 1
                       )
                   ELSE
                       (
                           SELECT tc.user_id
                           from comment_likes cl
                                    INNER JOIN trades_comments tc
                                               on tc.id = new.trades_comment_id
                           LIMIT 1
                       )
                   END as user_id
    ),
         check_is_reply as (
             SELECT CASE
                        WHEN new.post_comment_id IS NOT NULL
                            THEN
                            (SELECT CASE WHEN pc.parent_comment_id is not null THEN TRUE ELSE FALSE END
                             from comment_likes cl
                                      INNER JOIN posts_comments pc
                                                 on pc.id = new.post_comment_id
                             LIMIT 1
                            )
                        ELSE
                            (SELECT CASE WHEN tc.parent_comment_id is not null THEN TRUE ELSE FALSE END
                             from comment_likes cl
                                      INNER JOIN trades_comments tc
                                                 on tc.id = new.trades_comment_id
                             LIMIT 1
                            )
                        END as is_reply
         ),
         get_notfication_id as (
             SELECT CASE
                        WHEN check_is_reply.is_reply = true
                            THEN
                            (
                                SELECT id
                                from master_notification_types
                                where type = 'reply_like'
                            )
                        ELSE
                            (
                                SELECT id
                                from master_notification_types
                                where type = 'comment_like'
                            )
                        END as id
             FROM check_is_reply
         )
    UPDATE notification_events
    SET target_user     = (SELECT user_id from get_user_id),
        created_by      = new.user_id,
        event_type      = (select id from get_notfication_id),
        event_parent_id = COALESCE(new.post_comment_id, new.trades_comment_id),
        is_deleted      = new.is_deleted
    WHERE created_by = old.user_id
      AND event_parent_id = COALESCE(old.post_comment_id, old.trades_comment_id)
      AND event_type = (select id from get_notfication_id);
    RETURN NEW;
END;
$$;



CREATE TRIGGER trigger_comment_like_update
    AFTER update
    ON comment_likes
    FOR EACH ROW
EXECUTE PROCEDURE comment_like_update();


CREATE OR REPLACE FUNCTION comment_like_delete()
    RETURNS TRIGGER
    LANGUAGE PLPGSQL
AS
$$
BEGIN
    WITH check_is_reply as (
        SELECT CASE
                   WHEN old.post_comment_id IS NOT NULL
                       THEN
                       (SELECT CASE WHEN pc.parent_comment_id is not null THEN TRUE ELSE FALSE END
                        from comment_likes cl
                                 INNER JOIN posts_comments pc
                                            on pc.id = old.post_comment_id
                        LIMIT 1
                       )
                   ELSE
                       (SELECT CASE WHEN tc.parent_comment_id is not null THEN TRUE ELSE FALSE END
                        from comment_likes cl
                                 INNER JOIN trades_comments tc
                                            on tc.id = old.trades_comment_id
                        LIMIT 1
                       )
                   END as is_reply
    ),
         get_notfication_id as (
             SELECT CASE
                        WHEN check_is_reply.is_reply = true
                            THEN
                            (
                                SELECT id
                                from master_notification_types
                                where type = 'reply_like'
                            )
                        ELSE
                            (
                                SELECT id
                                from master_notification_types
                                where type = 'comment_like'
                            )
                        END as id
             FROM check_is_reply
         )
    DELETE
    FROM notification_events
    WHERE created_by = old.user_id
      AND event_parent_id = COALESCE(old.post_comment_id, old.trades_comment_id)
      AND event_type = (select id from get_notfication_id);

    RETURN new;
END;
$$;

CREATE TRIGGER trigger_comment_like_delete
    AFTER DELETE
    ON comment_likes
    FOR EACH ROW
EXECUTE PROCEDURE comment_like_delete();


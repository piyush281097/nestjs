
CREATE OR REPLACE FUNCTION post_like_create()
    RETURNS TRIGGER
    LANGUAGE PLPGSQL
AS
$$
BEGIN
    WITH get_user_id as (
        select user_id
        from posts_master
        where posts_master.id = new.post_id
    ),
         get_notfication_id as (
             SELECT id
             from master_notification_types
             where type = 'post_like'
         )
    INSERT
    INTO notification_events(target_user, created_by, event_type, event_parent_id, is_deleted)
    VALUES ((SELECT user_id from get_user_id), new.user_id,
            (select id from get_notfication_id), new.post_id, FALSE);
    RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_post_like_create
    AFTER insert
    ON posts_likes
    FOR EACH ROW
EXECUTE PROCEDURE post_like_create();

CREATE OR REPLACE FUNCTION post_like_update()
    RETURNS TRIGGER
    LANGUAGE PLPGSQL
AS
$$
BEGIN
    WITH get_user_id as (
        select user_id
        from posts_master
        where posts_master.id = new.post_id
    ),
         get_notfication_id as (
             SELECT id
             from master_notification_types
             where type = 'post_like'
         )
    UPDATE notification_events
    SET target_user     = (SELECT user_id from get_user_id),
        created_by      = new.user_id,
        event_type      = (select id from get_notfication_id),
        event_parent_id = new.post_id,
        is_deleted      = new.is_deleted
    WHERE created_by = old.user_id
      AND event_parent_id = old.post_id
      AND event_type = (select id from get_notfication_id);

    RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_post_like_update
    AFTER UPDATE
    ON posts_likes
    FOR EACH ROW
EXECUTE PROCEDURE post_like_update();


CREATE OR REPLACE FUNCTION post_like_delete()
    RETURNS TRIGGER
    LANGUAGE PLPGSQL
AS
$$
BEGIN
    WITH get_notfication_id as (
        SELECT id
        from master_notification_types
        where type = 'post_like'
    )
    DELETE
    FROM notification_events
    WHERE created_by = old.user_id
      AND event_parent_id = old.post_id
      AND event_type = (select id from get_notfication_id);

    RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_post_like_delete
    AFTER DELETE
    ON posts_likes
    FOR EACH ROW
EXECUTE PROCEDURE post_like_delete();

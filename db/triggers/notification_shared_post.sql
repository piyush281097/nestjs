CREATE OR REPLACE FUNCTION post_shared_create()
    RETURNS TRIGGER
    LANGUAGE PLPGSQL
AS
$$
BEGIN
    WITH get_user_id as (
        select user_id
        from posts_master
        where posts_master.id = new.shared_post_id
    ),
         get_shared_user_id as (
             select user_id
             from posts_master
             where posts_master.id = new.post_id
         ),
         get_notfication_id as (
             SELECT id
             from master_notification_types
             where type = 'post_shared'
         )
    INSERT
    INTO notification_events(target_user, created_by, event_type, event_parent_id, is_deleted)
    VALUES ((SELECT user_id from get_user_id), (SELECT user_id from get_shared_user_id),
            (select id from get_notfication_id), new.post_id, FALSE);

    RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_post_shared_create
    AFTER insert
    ON posts_shared
    FOR EACH ROW
EXECUTE PROCEDURE post_shared_create();

CREATE OR REPLACE FUNCTION post_shared_update()
    RETURNS TRIGGER
    LANGUAGE PLPGSQL
AS
$$
BEGIN
    WITH get_user_id as (
        select user_id
        from posts_master
        where posts_master.id = new.shared_post_id
    ),
         get_shared_user_id as (
             select user_id
             from posts_master
             where posts_master.id = new.post_id
         ),
         get_notfication_id as (
             SELECT id
             from master_notification_types
             where type = 'post_shared'
         )
    UPDATE notification_events
    SET target_user     = (SELECT user_id from get_user_id),
        created_by      = (SELECT user_id from get_shared_user_id),
        event_type      = (select id from get_notfication_id),
        event_parent_id = new.post_id,
        is_deleted      = new.is_deleted
    WHERE created_by = (SELECT user_id from get_shared_user_id)
      AND event_parent_id = new.post_id
      AND event_type = (select id from get_notfication_id);

    RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_post_shared_update
    AFTER update
    ON posts_shared
    FOR EACH ROW
EXECUTE PROCEDURE post_shared_update();


CREATE OR REPLACE FUNCTION post_shared_delete()
    RETURNS TRIGGER
    LANGUAGE PLPGSQL
AS
$$
BEGIN
    WITH get_shared_user_id as (
             select user_id
             from posts_master
             where posts_master.id = old.post_id
         ),
         get_notfication_id as (
             SELECT id
             from master_notification_types
             where type = 'post_shared'
         )
    DELETE
    FROM notification_events
    WHERE created_by = (SELECT user_id from get_shared_user_id)
      AND event_parent_id = old.post_id
      AND event_type = (select id from get_notfication_id);

    RETURN new;
END;
$$;

CREATE TRIGGER trigger_post_shared_delete
    AFTER delete
    ON posts_shared
    FOR EACH ROW
EXECUTE PROCEDURE post_shared_delete();



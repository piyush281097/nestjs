CREATE OR REPLACE FUNCTION post_user_tagged_create()
    RETURNS TRIGGER
    LANGUAGE PLPGSQL
AS
$$
BEGIN
    WITH get_user_id as (
        SELECT CASE
                   WHEN new.post_id is not null THEN
                       (
                           select user_id
                           from posts_master
                           where posts_master.id = new.post_id
                           LIMIT 1
                       )
                   END as user_id
    ),
         get_notfication_id as (
             SELECT id
             from master_notification_types
             where type = 'post_user_tagged'
         )
    INSERT
    INTO notification_events(target_user, created_by, event_type, event_parent_id, is_deleted)
    SELECT new.user_id,
           (SELECT user_id from get_user_id),
           (select id from get_notfication_id),
           new.id,
           FALSE
    WHERE new.post_id is not null;

    RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_post_user_tagged_create
    AFTER insert
    ON tagged_users
    FOR EACH ROW
EXECUTE PROCEDURE post_user_tagged_create();

CREATE OR REPLACE FUNCTION post_user_tagged_update()
    RETURNS TRIGGER
    LANGUAGE PLPGSQL
AS
$$
BEGIN
    WITH get_user_id as (
        SELECT CASE
                   WHEN new.post_id is not null THEN
                       (
                           select user_id
                           from posts_master
                           where posts_master.id = new.post_id
                           LIMIT 1
                       )
                   END as user_id
    ),
         get_notfication_id as (
             SELECT id
             from master_notification_types
             where type = 'post_user_tagged'
         )
    UPDATE notification_events
    SET target_user     = new.user_id,
        created_by      = (SELECT user_id from get_user_id),
        event_type      = (select id from get_notfication_id),
        event_parent_id = new.id,
        is_deleted      = new.is_deleted
    WHERE created_by = (SELECT user_id from get_user_id)
      AND event_parent_id = new.id
      AND event_type = (select id from get_notfication_id)
      AND new.post_id is not null;

    RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_post_user_tagged_update
    AFTER update
    ON tagged_users
    FOR EACH ROW
EXECUTE PROCEDURE post_user_tagged_update();


CREATE OR REPLACE FUNCTION post_user_tagged_delete()
    RETURNS TRIGGER
    LANGUAGE PLPGSQL
AS
$$
BEGIN
    WITH get_user_id as (
        SELECT CASE
                   WHEN old.post_id is not null THEN
                       (
                           select user_id
                           from posts_master
                           where posts_master.id = old.post_id
                           LIMIT 1
                       )
                   END as user_id
    ),
         get_notfication_id as (
             SELECT id
             from master_notification_types
             where type = 'post_user_tagged'
         )
    DELETE
    FROM notification_events
    WHERE created_by = (SELECT user_id from get_user_id)
      AND event_parent_id = old.id
      AND event_type = (select id from get_notfication_id);
    RETURN new;
END;
$$;

CREATE TRIGGER trigger_post_user_tagged_delete
    AFTER delete
    ON tagged_users
    FOR EACH ROW
EXECUTE PROCEDURE post_user_tagged_delete();



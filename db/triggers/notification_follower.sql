CREATE OR REPLACE FUNCTION follower_create()
    RETURNS TRIGGER
    LANGUAGE PLPGSQL
AS
$$
BEGIN
    WITH get_notfication_id as (
        SELECT id
        from master_notification_types
        where type = 'follow'
    )
    INSERT
    INTO notification_events(target_user, created_by, event_type, event_parent_id, is_deleted)
    VALUES (new.follower_id, new.user_id,
            (select id from get_notfication_id), new.id, FALSE);

    RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_follower_create
    AFTER insert
    ON followers
    FOR EACH ROW
EXECUTE PROCEDURE follower_create();

CREATE OR REPLACE FUNCTION follower_update()
    RETURNS TRIGGER
    LANGUAGE PLPGSQL
AS
$$
BEGIN
    WITH get_notfication_id as (
        SELECT id
        from master_notification_types
        where type = 'follow'
    )
    UPDATE notification_events
    SET created_by      = new.user_id,
        target_user     = new.follower_id,
        event_type      = (select id from get_notfication_id),
        event_parent_id = new.id,
        is_deleted      = new.is_deleted
    WHERE created_by = new.user_id
      AND event_parent_id = new.id
      AND event_type = (select id from get_notfication_id);

    RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_follower_update
    AFTER update
    ON followers
    FOR EACH ROW
EXECUTE PROCEDURE follower_update();


CREATE OR REPLACE FUNCTION follower_delete()
    RETURNS TRIGGER
    LANGUAGE PLPGSQL
AS
$$
BEGIN
    WITH get_notfication_id as (
        SELECT id
        from master_notification_types
        where type = 'follow'
    )
    DELETE
    FROM notification_events
    WHERE created_by = old.user_id
      AND event_parent_id = old.id
      AND event_type = (select id from get_notfication_id);
    RETURN new;
END;
$$;
--
CREATE TRIGGER trigger_follower_delete
    AFTER delete
    ON followers
    FOR EACH ROW
EXECUTE PROCEDURE follower_delete();



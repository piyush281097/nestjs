
CREATE OR REPLACE FUNCTION trade_like_create()
    RETURNS TRIGGER
    LANGUAGE PLPGSQL
AS
$$
BEGIN
    WITH get_user_id as (
        select user_id
        from trades_master
        where trades_master.id = new.trade_id
    ),
         get_notfication_id as (
             SELECT id
             from master_notification_types
             where type = 'trade_like'
         )
    INSERT
    INTO notification_events(target_user, created_by, event_type, event_parent_id, is_deleted)
    VALUES ((SELECT user_id from get_user_id), new.user_id,
            (select id from get_notfication_id), new.trade_id, FALSE);
    RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_trade_like_create
    AFTER insert
    ON trades_likes
    FOR EACH ROW
EXECUTE PROCEDURE trade_like_create();

CREATE OR REPLACE FUNCTION trade_like_update()
    RETURNS TRIGGER
    LANGUAGE PLPGSQL
AS
$$
BEGIN
    WITH get_user_id as (
        select user_id
        from trades_master
        where trades_master.id = new.trade_id
    ),
         get_notfication_id as (
             SELECT id
             from master_notification_types
             where type = 'trade_like'
         )
    UPDATE notification_events
    SET target_user     = (SELECT user_id from get_user_id),
        created_by      = new.user_id,
        event_type      = (select id from get_notfication_id),
        event_parent_id = new.trade_id,
        is_deleted      = new.is_deleted
    WHERE created_by = old.user_id
      AND event_parent_id = old.trade_id
      AND event_type = (select id from get_notfication_id);

    RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_trade_like_update
    AFTER UPDATE
    ON trades_likes
    FOR EACH ROW
EXECUTE PROCEDURE trade_like_update();


CREATE OR REPLACE FUNCTION trade_like_delete()
    RETURNS TRIGGER
    LANGUAGE PLPGSQL
AS
$$
BEGIN
    WITH get_notfication_id as (
        SELECT id
        from master_notification_types
        where type = 'trade_like'
    )
    DELETE
    FROM notification_events
    WHERE created_by = old.user_id
      AND event_parent_id = old.trade_id
      AND event_type = (select id from get_notfication_id);

    RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_trade_like_delete
    AFTER DELETE
    ON trades_likes
    FOR EACH ROW
EXECUTE PROCEDURE trade_like_delete();

import { map } from 'rxjs';
import configuration from 'src/config/configuration';
import { DatabaseService } from 'src/database/database.service';
import { Logger } from 'src/shared/logger/logging.service';
import { UtilsService } from 'src/utils/utils.service';

import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import { getNotificationOfUserDbQuery } from './db-query/get_notifications_of_user';
import { NotificationMarkAsReadRequestDto } from './dto/mark-notification-as-read.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @Inject(configuration.KEY) private config: ConfigType<typeof configuration>,
    private db: DatabaseService<any>,
    private logger: Logger,
  ) {
    this.logger.setContext(NotificationsService.name);
  }

  getAllNotifications(userId: number) {
    const data = [userId];
    return this.db.rawQuery(getNotificationOfUserDbQuery, data, null);
  }

  markNotificationsAsRead(
    userId: number,
    notificationList: [NotificationMarkAsReadRequestDto],
  ) {
    const queryArray = [];
    /**
     * Below item types should be manually updated. Else you can directly mark as read
     * 1, post_comment
     * 2, trade_comment
     * 3, post_shared
     */
    const result = notificationList.reduce(function (r, a) {
      r[a.type] = r[a.type] || [];
      r[a.type].push(a.eventParentId);
      return r;
    }, Object.create(null));

    const postCommentIds: number[] = result['post_comment'];
    const tradeCommentIds: number[] = result['trade_comment'];
    const postSharedIds: number[] = result['post_shared'];

    delete result['post_comment'];
    delete result['trade_comment'];
    delete result['post_shared'];

    const idsToUpdateDirectly = [...Object.values(result)].flat();

    console.log(result);

    if (postCommentIds?.length) {
      const updatePostCommentQuery = `
      UPDATE
          notification_events ne
      SET
          is_read = TRUE
      WHERE
          ne.event_parent_id IN (
              SELECT
                  id
              FROM
                  posts_comments pc
              WHERE
                  post_id IN (${postCommentIds.join(', ')}))
      `;
      queryArray.push(
        `update_post_comment_query as ( ${updatePostCommentQuery})`,
      );
    }

    if (tradeCommentIds?.length) {
      const updateTradeCommentQuery = `
      UPDATE
          notification_events ne
      SET
          is_read = TRUE
      WHERE
          ne.event_parent_id IN (
              SELECT
                  id
              FROM
                  trades_comments tc
              WHERE
                  trade_id IN (${tradeCommentIds.join(', ')}))
      `;
      queryArray.push(
        `update_trade_comment_query as ( ${updateTradeCommentQuery})`,
      );
    }

    if (postSharedIds?.length) {
      console.log({ postSharedIds });

      const postSharedQuery = `
      UPDATE
          notification_events ne
      SET
          is_read = TRUE
      WHERE
          ne.event_parent_id IN (
              SELECT
                  post_id
              FROM
                  posts_shared ps
              WHERE
                  ps.shared_post_id in (${postSharedIds.join(', ')}))
      `;

      queryArray.push(`update_post_shared_query as ( ${postSharedQuery})`);
    }

    if (idsToUpdateDirectly?.length) {
      const updateTradeCommentQuery = `
      UPDATE
          notification_events ne
      SET
          is_read = TRUE
      WHERE
          ne.event_parent_id IN (${idsToUpdateDirectly.join(', ')})
      `;
      queryArray.push(`update_events_query as ( ${updateTradeCommentQuery})`);
    }

    return this.db
      .rawQuery(`WITH ${queryArray.join(', ')} select 1 as success;`, [], null)
      .pipe(map((res) => res[0]));
  }
}

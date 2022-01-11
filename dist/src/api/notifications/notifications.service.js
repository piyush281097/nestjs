"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var NotificationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const rxjs_1 = require("rxjs");
const configuration_1 = require("../../config/configuration");
const database_service_1 = require("../../database/database.service");
const logging_service_1 = require("../../shared/logger/logging.service");
const utils_service_1 = require("../../utils/utils.service");
const common_1 = require("@nestjs/common");
const get_notifications_of_user_1 = require("./db-query/get_notifications_of_user");
let NotificationsService = NotificationsService_1 = class NotificationsService {
    constructor(config, db, logger) {
        this.config = config;
        this.db = db;
        this.logger = logger;
        this.logger.setContext(NotificationsService_1.name);
    }
    getAllNotifications(userId) {
        const data = [userId];
        return this.db.rawQuery(get_notifications_of_user_1.getNotificationOfUserDbQuery, data, null);
    }
    markNotificationsAsRead(userId, notificationList) {
        const queryArray = [];
        const result = notificationList.reduce(function (r, a) {
            r[a.type] = r[a.type] || [];
            r[a.type].push(a.eventParentId);
            return r;
        }, Object.create(null));
        const postCommentIds = result['post_comment'];
        const tradeCommentIds = result['trade_comment'];
        const postSharedIds = result['post_shared'];
        delete result['post_comment'];
        delete result['trade_comment'];
        delete result['post_shared'];
        const idsToUpdateDirectly = [...Object.values(result)].flat();
        console.log(result);
        if (postCommentIds === null || postCommentIds === void 0 ? void 0 : postCommentIds.length) {
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
            queryArray.push(`update_post_comment_query as ( ${updatePostCommentQuery})`);
        }
        if (tradeCommentIds === null || tradeCommentIds === void 0 ? void 0 : tradeCommentIds.length) {
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
            queryArray.push(`update_trade_comment_query as ( ${updateTradeCommentQuery})`);
        }
        if (postSharedIds === null || postSharedIds === void 0 ? void 0 : postSharedIds.length) {
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
        if (idsToUpdateDirectly === null || idsToUpdateDirectly === void 0 ? void 0 : idsToUpdateDirectly.length) {
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
            .pipe((0, rxjs_1.map)((res) => res[0]));
    }
};
NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(configuration_1.default.KEY)),
    __metadata("design:paramtypes", [void 0, database_service_1.DatabaseService,
        logging_service_1.Logger])
], NotificationsService);
exports.NotificationsService = NotificationsService;
//# sourceMappingURL=notifications.service.js.map
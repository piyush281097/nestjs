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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsController = void 0;
const user_token_payload_decorator_1 = require("../../utils/decorator/user-token-payload.decorator");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guard/jwt.auth-guard");
const mark_notification_as_read_dto_1 = require("./dto/mark-notification-as-read.dto");
const notification_list_response_dto_1 = require("./dto/notification-list-response.dto");
const notifications_service_1 = require("./notifications.service");
let NotificationsController = class NotificationsController {
    constructor(notificationsService) {
        this.notificationsService = notificationsService;
    }
    findAll(user) {
        return this.notificationsService.getAllNotifications(user.userId);
    }
    create(user, createPostDto) {
        return this.notificationsService.markNotificationsAsRead(user.userId, createPostDto);
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all notifications of logged in user',
    }),
    (0, swagger_1.ApiBody)({
        type: [notification_list_response_dto_1.NotificationListResponseDto],
    }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('read'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Mark notification as read',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiBody)({ type: [mark_notification_as_read_dto_1.NotificationMarkAsReadRequestDto] }),
    (0, swagger_1.ApiResponse)({}),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "create", null);
NotificationsController = __decorate([
    (0, common_1.Controller)({
        path: 'notifications',
        version: '1',
    }),
    (0, swagger_1.ApiTags)('Notifications'),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService])
], NotificationsController);
exports.NotificationsController = NotificationsController;
//# sourceMappingURL=notifications.controller.js.map
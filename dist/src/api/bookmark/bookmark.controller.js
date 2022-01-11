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
exports.BookmarkController = void 0;
const user_token_payload_decorator_1 = require("../../utils/decorator/user-token-payload.decorator");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guard/jwt.auth-guard");
const list_all_posts_query_dto_1 = require("../posts/dto/request/list-all-posts.query-dto");
const list_all_post_response_dto_1 = require("../posts/dto/response/list-all-post.response-dto");
const bookmark_service_1 = require("./bookmark.service");
let BookmarkController = class BookmarkController {
    constructor(bookmarkService) {
        this.bookmarkService = bookmarkService;
    }
    create(user, postId) {
        return this.bookmarkService.createPostsBookmark(user.userId, postId);
    }
    findAllPosts(user, query) {
        return this.bookmarkService.listAllBookmarkedPosts(user.userId, query);
    }
    remove(user, postId) {
        return this.bookmarkService.DeletePostsBookmark(user.userId, postId);
    }
};
__decorate([
    (0, common_1.Post)(':postId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'bookmark a post',
    }),
    (0, swagger_1.ApiBody)({}),
    (0, swagger_1.ApiResponse)({}),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)('postId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], BookmarkController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(''),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all saved bookmark of posts in latest order',
    }),
    (0, swagger_1.ApiResponse)({ type: [list_all_post_response_dto_1.ListAllPostsResponseDto] }),
    (0, swagger_1.ApiQuery)({ name: 'limit', description: 'Number of posts to return' }),
    (0, swagger_1.ApiQuery)({
        name: 'offset',
        description: 'From which post to get n-limit posts',
    }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, list_all_posts_query_dto_1.ListAllPostsQueryDto]),
    __metadata("design:returntype", void 0)
], BookmarkController.prototype, "findAllPosts", null);
__decorate([
    (0, common_1.Delete)(':postId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a saved post (bookmark)',
    }),
    (0, swagger_1.ApiResponse)({}),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)('postId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], BookmarkController.prototype, "remove", null);
BookmarkController = __decorate([
    (0, common_1.Controller)({
        path: 'bookmark',
        version: '1',
    }),
    (0, swagger_1.ApiTags)('BookMark'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [bookmark_service_1.BookmarkService])
], BookmarkController);
exports.BookmarkController = BookmarkController;
//# sourceMappingURL=bookmark.controller.js.map
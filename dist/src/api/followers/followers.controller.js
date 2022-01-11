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
exports.FollowersController = void 0;
const user_token_payload_decorator_1 = require("../../utils/decorator/user-token-payload.decorator");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guard/jwt.auth-guard");
const follow_array_of_users_request_dto_1 = require("./dto/request/follow-array-of-users.request-dto");
const list_all_followers_query_dto_1 = require("./dto/request/list-all-followers.query-dto");
const list_of_follower_request_1 = require("./dto/response/list-of-follower.request");
const followers_service_1 = require("./followers.service");
let FollowersController = class FollowersController {
    constructor(followersService) {
        this.followersService = followersService;
    }
    findAll(user, query) {
        return this.followersService.getAllFollowers(user.userId, query);
    }
    ListAllFollowersOfNonLoggedInUser(user, userId, query) {
        return this.followersService.getAllFollowers(userId, query);
    }
    FollowListOfUsers(user, body, followType) {
        return this.followersService.followListOfUsers(user.userId, body.userIds, followType);
    }
    FollowUser(user, userId, followType) {
        return this.followersService.followUser(user.userId, userId, followType);
    }
    RemoveAUserFollowing(user, userId) {
        return this.followersService.RemoveAFollowingUser(user.userId, userId);
    }
};
__decorate([
    (0, common_1.Get)('list'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Get list of followers and Following loggedIn user',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiResponse)({ type: list_of_follower_request_1.ListOfFollowersDto }),
    (0, swagger_1.ApiQuery)({ name: 'limit', description: 'Number of posts to return' }),
    (0, swagger_1.ApiQuery)({
        name: 'offset',
        description: 'From which post to get n-limit posts',
    }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, list_all_followers_query_dto_1.ListAllFollowersQueryDto]),
    __metadata("design:returntype", void 0)
], FollowersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('list/:userId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Get list of followers and Following other users',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiResponse)({ type: list_of_follower_request_1.ListOfFollowersDto }),
    (0, swagger_1.ApiQuery)({ name: 'limit', description: 'Number of posts to return' }),
    (0, swagger_1.ApiQuery)({
        name: 'offset',
        description: 'From which post to get n-limit posts',
    }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, list_all_followers_query_dto_1.ListAllFollowersQueryDto]),
    __metadata("design:returntype", void 0)
], FollowersController.prototype, "ListAllFollowersOfNonLoggedInUser", null);
__decorate([
    (0, common_1.Patch)('list/:followType'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Follow a List of Users',
    }),
    (0, swagger_1.ApiParam)({ name: 'followType', enum: ['follow', 'unfollow'] }),
    (0, swagger_1.ApiBody)({ type: follow_array_of_users_request_dto_1.FollowArrayOfUsersDto }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiResponse)({}),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Param)('followType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, follow_array_of_users_request_dto_1.FollowArrayOfUsersDto, String]),
    __metadata("design:returntype", void 0)
], FollowersController.prototype, "FollowListOfUsers", null);
__decorate([
    (0, common_1.Patch)(':userId/:followType'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Follow a User',
    }),
    (0, swagger_1.ApiParam)({ name: 'userId', type: Number }),
    (0, swagger_1.ApiParam)({ name: 'followType', enum: ['follow', 'unfollow'] }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiResponse)({}),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Param)('followType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, String]),
    __metadata("design:returntype", void 0)
], FollowersController.prototype, "FollowUser", null);
__decorate([
    (0, common_1.Delete)(':userId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Remove a user from following loggedIn user',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiResponse)({}),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], FollowersController.prototype, "RemoveAUserFollowing", null);
FollowersController = __decorate([
    (0, common_1.Controller)({
        path: 'followers',
        version: '1',
    }),
    (0, swagger_1.ApiTags)('Followers'),
    __metadata("design:paramtypes", [followers_service_1.FollowersService])
], FollowersController);
exports.FollowersController = FollowersController;
//# sourceMappingURL=followers.controller.js.map
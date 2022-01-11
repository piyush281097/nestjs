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
exports.TradesController = void 0;
const user_token_payload_decorator_1 = require("../../utils/decorator/user-token-payload.decorator");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guard/jwt.auth-guard");
const list_all_posts_query_dto_1 = require("../posts/dto/request/list-all-posts.query-dto");
const add_comment_db_query_1 = require("./dto/request/add-comment.db-query");
const create_trade_request_dto_1 = require("./dto/request/create-trade.request-dto");
const list_all_trades_query_dto_1 = require("./dto/request/list-all-trades.query-dto");
const update_comment_request_dto_1 = require("./dto/request/update-comment.request-dto");
const update_like_for_comment_param_dto_1 = require("./dto/request/update-like-for-comment.param-dto");
const update_like_for_trade_param_dto_1 = require("./dto/request/update-like-for-trade.param-dto");
const update_trade_request_dto_1 = require("./dto/request/update-trade.request-dto");
const create_trade_response_dto_1 = require("./dto/response/create-trade.response-dto");
const likes_of_post_response_dto_1 = require("./dto/response/likes-of-post.response-dto");
const list_all_comments_response_dto_1 = require("./dto/response/list-all-comments.response-dto");
const list_all_trades_response_dto_1 = require("./dto/response/list-all-trades.response-dto");
const trades_service_1 = require("./trades.service");
let TradesController = class TradesController {
    constructor(tradesService) {
        this.tradesService = tradesService;
    }
    create(user, createTradeDto) {
        return this.tradesService.create(user.userId, createTradeDto);
    }
    findAllTrades(user, query) {
        return this.tradesService.findAll(user.userId, null, query);
    }
    findTradesOfAUser(user, query, userId) {
        return this.tradesService.findAll(user.userId, userId !== null && userId !== void 0 ? userId : user.userId, query);
    }
    UpdateTrade(user, createTradeDto, tradeId) {
        return this.tradesService.updateTrade(user.userId, tradeId, createTradeDto);
    }
    remove(user, tradeId) {
        return this.tradesService.deleteTrade(user.userId, tradeId);
    }
    UpdateTradeLike(user, param) {
        const { likeValue, tradeId } = param;
        return this.tradesService.updateLikeForTrade(user.userId, tradeId, likeValue);
    }
    GetLikeDetailsOfTrade(user, query, tradeId) {
        return this.tradesService.getTradeLikeUsers(tradeId, query);
    }
    AddCommentOnTrade(user, tradeId, body) {
        return this.tradesService.addCommentOnTrade(user.userId, tradeId, body);
    }
    ListCommentOfATrade(user, query, tradeId) {
        return this.tradesService.listCommentOfTrade(tradeId, user.userId, query);
    }
    ListRepliesOfCommentOfATrade(user, query, tradeId, commentId) {
        return this.tradesService.listCommentOfTrade(tradeId, user.userId, query, commentId, true);
    }
    UpdateCommentOnTrade(user, createTradeDto, tradeId, commentId) {
        return this.tradesService.updateCommentOnTrade(user.userId, commentId, tradeId, createTradeDto);
    }
    RemoveCommentOnTrade(user, tradeId, commentId) {
        return this.tradesService.deleteCommentOnTrade(user.userId, tradeId, commentId);
    }
    UpdateLikeForCommentOnTrade(user, param) {
        const { likeValue, tradeId, commentId } = param;
        return this.tradesService.updateLikeForCommentOnTrade(user.userId, tradeId, commentId, likeValue);
    }
    GetLikesForCommentOnTrade(user, query, tradeId, commentId) {
        return this.tradesService.getLikeForCommentOnTrade(commentId, query);
    }
    ListAllTradesWithTaggedAsset(user, query, value) {
        return this.tradesService.getPostsWhichTagged(query, user.userId, value);
    }
};
__decorate([
    (0, swagger_1.ApiTags)('Trades'),
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Create POST',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiBody)({ type: create_trade_request_dto_1.CreateTradeRequestDto }),
    (0, swagger_1.ApiResponse)({ type: create_trade_response_dto_1.CreateTradeResponseDto }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_trade_request_dto_1.CreateTradeRequestDto]),
    __metadata("design:returntype", void 0)
], TradesController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiTags)('Trades'),
    (0, common_1.Get)(''),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all trades in latest order of all users',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiResponse)({ type: [list_all_trades_response_dto_1.ListAllTradesResponseDto] }),
    (0, swagger_1.ApiQuery)({ name: 'limit', description: 'Number of trades to return' }),
    (0, swagger_1.ApiQuery)({
        name: 'offset',
        description: 'From which trade to get n-limit trades',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'filter',
        enum: ['all', 'one_day', 'one_week', 'one_month'],
    }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, list_all_trades_query_dto_1.ListAllTradesQueryDto]),
    __metadata("design:returntype", void 0)
], TradesController.prototype, "findAllTrades", null);
__decorate([
    (0, swagger_1.ApiTags)('Trades'),
    (0, common_1.Get)(':userId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all trades of any particular user or current logged in user',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'filter',
        enum: ['all', 'one_day', 'one_week', 'one_month'],
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiResponse)({ type: [list_all_trades_response_dto_1.ListAllTradesResponseDto] }),
    (0, swagger_1.ApiQuery)({ name: 'limit', description: 'Number of trades to return' }),
    (0, swagger_1.ApiQuery)({
        name: 'offset',
        description: 'From which trade to get n-limit trades',
    }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, list_all_trades_query_dto_1.ListAllTradesQueryDto, Number]),
    __metadata("design:returntype", void 0)
], TradesController.prototype, "findTradesOfAUser", null);
__decorate([
    (0, swagger_1.ApiTags)('Trades'),
    (0, common_1.Patch)(':tradeId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'PATCH a trade',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ skipMissingProperties: true })),
    (0, swagger_1.ApiBody)({ type: update_trade_request_dto_1.UpdateTradeRequestDto }),
    (0, swagger_1.ApiResponse)({ type: create_trade_response_dto_1.UpdateTradeResponseDto }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Param)('tradeId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_trade_request_dto_1.CreateTradeRequestDto, Number]),
    __metadata("design:returntype", void 0)
], TradesController.prototype, "UpdateTrade", null);
__decorate([
    (0, swagger_1.ApiTags)('Trades'),
    (0, common_1.Delete)(':tradeId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a trade',
    }),
    (0, swagger_1.ApiResponse)({}),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)('tradeId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], TradesController.prototype, "remove", null);
__decorate([
    (0, swagger_1.ApiTags)('Trades'),
    (0, common_1.Patch)('/:tradeId/:likeValue'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiParam)({ name: 'tradeId', type: Number }),
    (0, swagger_1.ApiParam)({ name: 'likeValue', enum: ['like', 'unlike'] }),
    (0, swagger_1.ApiOperation)({
        summary: 'Add like for a trade',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiResponse)({}),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_like_for_trade_param_dto_1.UpdateLikeForTradeParam]),
    __metadata("design:returntype", void 0)
], TradesController.prototype, "UpdateTradeLike", null);
__decorate([
    (0, swagger_1.ApiTags)('Trades'),
    (0, common_1.Get)(':tradeId/likes'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'get list of users who like the trade',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiResponse)({ type: [likes_of_post_response_dto_1.LikesOfTradesResponseDto] }),
    (0, swagger_1.ApiQuery)({ name: 'limit', description: 'Number of users to return' }),
    (0, swagger_1.ApiQuery)({
        name: 'offset',
        description: 'From which trade to get n-limit trades',
    }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Param)('tradeId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, list_all_trades_query_dto_1.ListAllTradesQueryDto, Number]),
    __metadata("design:returntype", void 0)
], TradesController.prototype, "GetLikeDetailsOfTrade", null);
__decorate([
    (0, swagger_1.ApiTags)('Trades - Comment'),
    (0, common_1.Post)('/:tradeId/comment'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'In order to add comment on a trade',
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    (0, swagger_1.ApiBody)({ type: add_comment_db_query_1.AddCommentOnTradeRequestDto }),
    (0, swagger_1.ApiResponse)({}),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)('tradeId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, add_comment_db_query_1.AddCommentOnTradeRequestDto]),
    __metadata("design:returntype", void 0)
], TradesController.prototype, "AddCommentOnTrade", null);
__decorate([
    (0, swagger_1.ApiTags)('Trades - Comment'),
    (0, common_1.Get)('/:tradeId/comment'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'This will generate presigned S3 URL for attachment pictures',
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiQuery)({ name: 'limit' }),
    (0, swagger_1.ApiQuery)({
        name: 'offset',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    (0, swagger_1.ApiResponse)({ type: [list_all_comments_response_dto_1.ListAllCommentsOnTradesResponseDto] }),
    (0, swagger_1.ApiResponse)({}),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Param)('tradeId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, list_all_trades_query_dto_1.ListAllTradesQueryDto, Number]),
    __metadata("design:returntype", void 0)
], TradesController.prototype, "ListCommentOfATrade", null);
__decorate([
    (0, swagger_1.ApiTags)('Trades - Replies of Comment'),
    (0, common_1.Get)('/:tradeId/comment/:commentId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'This will generate presigned S3 URL for attachment pictures',
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiQuery)({ name: 'limit' }),
    (0, swagger_1.ApiQuery)({
        name: 'offset',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    (0, swagger_1.ApiResponse)({ type: [list_all_comments_response_dto_1.ListAllCommentsOnTradesResponseDto] }),
    (0, swagger_1.ApiResponse)({}),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Param)('tradeId', common_1.ParseIntPipe)),
    __param(3, (0, common_1.Param)('commentId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, list_all_trades_query_dto_1.ListAllTradesQueryDto, Number, Number]),
    __metadata("design:returntype", void 0)
], TradesController.prototype, "ListRepliesOfCommentOfATrade", null);
__decorate([
    (0, swagger_1.ApiTags)('Trades - Comment'),
    (0, common_1.Patch)('/:tradeId/comment/:commentId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'PATCH a comment',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiBody)({ type: update_trade_request_dto_1.UpdateTradeRequestDto }),
    (0, swagger_1.ApiResponse)({ type: create_trade_response_dto_1.UpdateTradeResponseDto }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Param)('tradeId', common_1.ParseIntPipe)),
    __param(3, (0, common_1.Param)('commentId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_comment_request_dto_1.UpdateCommentOnTradeRequestDto, Number, Number]),
    __metadata("design:returntype", void 0)
], TradesController.prototype, "UpdateCommentOnTrade", null);
__decorate([
    (0, swagger_1.ApiTags)('Trades - Comment'),
    (0, common_1.Delete)('/:tradeId/comment/:commentId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a comment on trade',
    }),
    (0, swagger_1.ApiResponse)({}),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)('tradeId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Param)('commentId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", void 0)
], TradesController.prototype, "RemoveCommentOnTrade", null);
__decorate([
    (0, swagger_1.ApiTags)('Trades - Comment'),
    (0, common_1.Patch)('/:tradeId/comment/:commentId/:likeValue'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiParam)({ name: 'tradeId', type: Number }),
    (0, swagger_1.ApiParam)({ name: 'commentId', type: Number }),
    (0, swagger_1.ApiParam)({ name: 'likeValue', enum: ['like', 'unlike'] }),
    (0, swagger_1.ApiOperation)({
        summary: 'update a like for comment',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiResponse)({}),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_like_for_comment_param_dto_1.UpdateLikeForCommentOnTradeParam]),
    __metadata("design:returntype", void 0)
], TradesController.prototype, "UpdateLikeForCommentOnTrade", null);
__decorate([
    (0, swagger_1.ApiTags)('Trades - Comment'),
    (0, common_1.Get)('/:tradeId/comment/:commentId/likes'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'get list of users who like the trade',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiResponse)({ type: [update_like_for_comment_param_dto_1.UpdateLikeForCommentOnTradeParam] }),
    (0, swagger_1.ApiQuery)({ name: 'limit', description: 'Number of users to return' }),
    (0, swagger_1.ApiQuery)({
        name: 'offset',
        description: 'From which trade to get n-limit trades',
    }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Param)('tradeId', common_1.ParseIntPipe)),
    __param(3, (0, common_1.Param)('commentId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, list_all_trades_query_dto_1.ListAllTradesQueryDto, Number, Number]),
    __metadata("design:returntype", void 0)
], TradesController.prototype, "GetLikesForCommentOnTrade", null);
__decorate([
    (0, swagger_1.ApiTags)('Trades - Get trades from tagged Asset'),
    (0, common_1.Get)('/asset/:value'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'get list of Trades with Asset tagged',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    (0, swagger_1.ApiParam)({
        name: 'value',
        description: 'Corresponding symbol of tagged asset',
    }),
    (0, swagger_1.ApiQuery)({ name: 'limit', description: 'Number of users to return' }),
    (0, swagger_1.ApiQuery)({
        name: 'offset',
        description: 'From which post to get n-limit posts',
    }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Param)('value')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, list_all_posts_query_dto_1.ListAllPostsQueryDto, String]),
    __metadata("design:returntype", void 0)
], TradesController.prototype, "ListAllTradesWithTaggedAsset", null);
TradesController = __decorate([
    (0, common_1.Controller)({
        path: 'trades',
        version: '1',
    }),
    __metadata("design:paramtypes", [trades_service_1.TradesService])
], TradesController);
exports.TradesController = TradesController;
//# sourceMappingURL=trades.controller.js.map
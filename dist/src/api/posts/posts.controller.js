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
exports.PostsController = void 0;
const joi_1 = require("joi");
const rxjs_1 = require("rxjs");
const user_token_payload_decorator_1 = require("../../utils/decorator/user-token-payload.decorator");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guard/jwt.auth-guard");
const add_comment_db_query_1 = require("./dto/request/add-comment.db-query");
const create_post_request_dto_1 = require("./dto/request/create-post.request-dto");
const list_all_posts_query_dto_1 = require("./dto/request/list-all-posts.query-dto");
const update_comment_request_dto_1 = require("./dto/request/update-comment.request-dto");
const update_like_for_comment_param_dto_1 = require("./dto/request/update-like-for-comment.param-dto");
const update_like_for_post_param_dto_1 = require("./dto/request/update-like-for-post.param-dto");
const update_post_request_dto_1 = require("./dto/request/update-post.request-dto");
const upload_attachment_image_request_dto_1 = require("./dto/request/upload-attachment-image.request-dto");
const create_post_response_dto_1 = require("./dto/response/create-post.response-dto");
const likes_of_post_response_dto_1 = require("./dto/response/likes-of-post.response-dto");
const list_all_comments_response_dto_1 = require("./dto/response/list-all-comments.response-dto");
const list_all_post_response_dto_1 = require("./dto/response/list-all-post.response-dto");
const upload_attachment_image_response_dto_1 = require("./dto/response/upload-attachment-image.response-dto");
const posts_service_1 = require("./posts.service");
let PostsController = class PostsController {
    constructor(postsService) {
        this.postsService = postsService;
    }
    create(user, createPostDto) {
        return this.postsService.create(user.userId, createPostDto);
    }
    findAllPosts(user, query) {
        return this.postsService.findAll(user.userId, null, query);
    }
    findPostsOfAUser(user, query, userId) {
        return this.postsService.findAll(user.userId, userId !== null && userId !== void 0 ? userId : user.userId, query);
    }
    UpdatePost(user, createPostDto, postId) {
        return this.postsService.updatePost(user.userId, postId, createPostDto);
    }
    remove(user, postId) {
        return this.postsService.deletePost(user.userId, postId);
    }
    UpdatePostLike(user, param) {
        const { likeValue, postId } = param;
        return this.postsService.updateLikeForPost(user.userId, postId, likeValue);
    }
    GetLikeDetailsOfPost(user, query, postId) {
        return this.postsService.getPostLikeUsers(postId, query);
    }
    GetPreSignedUrlForAttachment(user, body) {
        return this.postsService.getPreSignedUrlForAttachment(body.fileName, user.userId);
    }
    AddCommentOnPost(user, postId, body) {
        return this.postsService.addCommentOnPost(user.userId, postId, body);
    }
    ListCommentOfAPost(user, query, postId) {
        return this.postsService.listCommentOfPost(postId, user.userId, query);
    }
    ListRepliesOfCommentOfAPost(user, query, postId, commentId) {
        return this.postsService.listCommentOfPost(postId, user.userId, query, commentId, true);
    }
    UpdateCommentOnPost(user, createPostDto, postId, commentId) {
        return this.postsService.updateCommentOnPost(user.userId, commentId, postId, createPostDto);
    }
    RemoveCommentOnPost(user, postId, commentId) {
        return this.postsService.deleteCommentOnPost(user.userId, postId, commentId);
    }
    UpdateLikeForCommentOnPost(user, param) {
        const { likeValue, postId, commentId } = param;
        return this.postsService.updateLikeForCommentOnPost(user.userId, postId, commentId, likeValue);
    }
    GetLikesForCommentOnPost(user, query, postId, commentId) {
        return this.postsService.getLikeForCommentOnPost(commentId, query);
    }
    ListAllPostsWithTaggedTypes(user, query, type, value) {
        return this.postsService.getPostsWhichTagged(query, type, value, user.userId);
    }
};
__decorate([
    (0, swagger_1.ApiTags)('Posts'),
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Create POST',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiBody)({ type: create_post_request_dto_1.CreatePostRequestDto }),
    (0, swagger_1.ApiResponse)({ type: create_post_response_dto_1.CreatePostResponseDto }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_post_request_dto_1.CreatePostRequestDto]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiTags)('Posts'),
    (0, common_1.Get)(''),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all posts in latest order of all users',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiResponse)({ type: [list_all_post_response_dto_1.ListAllPostsResponseDto] }),
    (0, swagger_1.ApiQuery)({ name: 'limit', description: 'Number of posts to return' }),
    (0, swagger_1.ApiQuery)({
        name: 'filter',
        enum: ['all', 'one_day', 'one_week', 'one_month'],
    }),
    (0, swagger_1.ApiQuery)({
        name: 'offset',
        description: 'From which post to get n-limit posts',
    }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, list_all_posts_query_dto_1.ListAllPostsQueryDto]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "findAllPosts", null);
__decorate([
    (0, swagger_1.ApiTags)('Posts'),
    (0, common_1.Get)(':userId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all posts of any particular user or current logged in user',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiResponse)({ type: [list_all_post_response_dto_1.ListAllPostsResponseDto] }),
    (0, swagger_1.ApiQuery)({ name: 'limit', description: 'Number of posts to return' }),
    (0, swagger_1.ApiQuery)({
        name: 'offset',
        description: 'From which post to get n-limit posts',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'filter',
        enum: ['all', 'one_day', 'one_week', 'one_month'],
    }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, list_all_posts_query_dto_1.ListAllPostsQueryDto, Number]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "findPostsOfAUser", null);
__decorate([
    (0, swagger_1.ApiTags)('Posts'),
    (0, common_1.Patch)(':postId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'PATCH a post',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiBody)({ type: update_post_request_dto_1.UpdatePostRequestDto }),
    (0, swagger_1.ApiResponse)({ type: create_post_response_dto_1.UpdatePostResponseDto }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Param)('postId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_post_request_dto_1.CreatePostRequestDto, Number]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "UpdatePost", null);
__decorate([
    (0, swagger_1.ApiTags)('Posts'),
    (0, common_1.Delete)(':postId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a post',
    }),
    (0, swagger_1.ApiResponse)({}),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)('postId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "remove", null);
__decorate([
    (0, swagger_1.ApiTags)('Posts'),
    (0, common_1.Patch)('/:postId/:likeValue'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiParam)({ name: 'postId', type: joi_1.number }),
    (0, swagger_1.ApiParam)({ name: 'likeValue', enum: ['like', 'unlike'] }),
    (0, swagger_1.ApiOperation)({
        summary: 'PATCH a post',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiResponse)({}),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_like_for_post_param_dto_1.UpdateLikeForPostParam]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "UpdatePostLike", null);
__decorate([
    (0, swagger_1.ApiTags)('Posts'),
    (0, common_1.Get)(':postId/likes'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'get list of users who like the post',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiResponse)({ type: [likes_of_post_response_dto_1.LikesOfPostResponseDto] }),
    (0, swagger_1.ApiQuery)({ name: 'limit', description: 'Number of users to return' }),
    (0, swagger_1.ApiQuery)({
        name: 'offset',
        description: 'From which post to get n-limit posts',
    }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Param)('postId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, list_all_posts_query_dto_1.ListAllPostsQueryDto, Number]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "GetLikeDetailsOfPost", null);
__decorate([
    (0, swagger_1.ApiTags)('Posts'),
    (0, common_1.Post)('attachment'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'This will generate presigned S3 URL for attachment pictures',
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    (0, swagger_1.ApiBody)({ type: upload_attachment_image_request_dto_1.UploadAttachmentImageRequestDto }),
    (0, swagger_1.ApiResponse)({ type: upload_attachment_image_response_dto_1.UploadAttachmentImageResponseDto }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, upload_attachment_image_request_dto_1.UploadAttachmentImageRequestDto]),
    __metadata("design:returntype", rxjs_1.Observable)
], PostsController.prototype, "GetPreSignedUrlForAttachment", null);
__decorate([
    (0, swagger_1.ApiTags)('Posts - Comment'),
    (0, common_1.Post)('/:postId/comment'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'In order to add comment on a post',
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    (0, swagger_1.ApiBody)({ type: add_comment_db_query_1.AddCommentOnPostRequestDto }),
    (0, swagger_1.ApiResponse)({}),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)('postId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, add_comment_db_query_1.AddCommentOnPostRequestDto]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "AddCommentOnPost", null);
__decorate([
    (0, swagger_1.ApiTags)('Posts - Comment'),
    (0, common_1.Get)('/:postId/comment'),
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
    (0, swagger_1.ApiResponse)({ type: [list_all_comments_response_dto_1.ListAllCommentsOnPostsResponseDto] }),
    (0, swagger_1.ApiResponse)({}),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Param)('postId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, list_all_posts_query_dto_1.ListAllPostsQueryDto, Number]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "ListCommentOfAPost", null);
__decorate([
    (0, swagger_1.ApiTags)('Posts - Replies of Comment'),
    (0, common_1.Get)('/:postId/comment/:commentId'),
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
    (0, swagger_1.ApiResponse)({ type: [list_all_comments_response_dto_1.ListAllCommentsOnPostsResponseDto] }),
    (0, swagger_1.ApiResponse)({}),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Param)('postId', common_1.ParseIntPipe)),
    __param(3, (0, common_1.Param)('commentId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, list_all_posts_query_dto_1.ListAllPostsQueryDto, Number, Number]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "ListRepliesOfCommentOfAPost", null);
__decorate([
    (0, swagger_1.ApiTags)('Posts - Comment'),
    (0, common_1.Patch)('/:postId/comment/:commentId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'PATCH a comment',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiBody)({ type: update_post_request_dto_1.UpdatePostRequestDto }),
    (0, swagger_1.ApiResponse)({ type: create_post_response_dto_1.UpdatePostResponseDto }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Param)('postId', common_1.ParseIntPipe)),
    __param(3, (0, common_1.Param)('commentId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_comment_request_dto_1.UpdateCommentOnPostRequestDto, Number, Number]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "UpdateCommentOnPost", null);
__decorate([
    (0, swagger_1.ApiTags)('Posts - Comment'),
    (0, common_1.Delete)('/:postId/comment/:commentId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a comment on post',
    }),
    (0, swagger_1.ApiResponse)({}),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)('postId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Param)('commentId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "RemoveCommentOnPost", null);
__decorate([
    (0, swagger_1.ApiTags)('Posts - Comment'),
    (0, common_1.Patch)('/:postId/comment/:commentId/:likeValue'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiParam)({ name: 'postId', type: joi_1.number }),
    (0, swagger_1.ApiParam)({ name: 'commentId', type: joi_1.number }),
    (0, swagger_1.ApiParam)({ name: 'likeValue', enum: ['like', 'unlike'] }),
    (0, swagger_1.ApiOperation)({
        summary: 'update a like for comment',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiResponse)({}),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_like_for_comment_param_dto_1.UpdateLikeForCommentOnPostParam]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "UpdateLikeForCommentOnPost", null);
__decorate([
    (0, swagger_1.ApiTags)('Posts - Comment'),
    (0, common_1.Get)('/:postId/comment/:commentId/likes'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'get list of users who like the post',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiResponse)({ type: [likes_of_post_response_dto_1.LikesOfPostResponseDto] }),
    (0, swagger_1.ApiQuery)({ name: 'limit', description: 'Number of users to return' }),
    (0, swagger_1.ApiQuery)({
        name: 'offset',
        description: 'From which post to get n-limit posts',
    }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Param)('postId', common_1.ParseIntPipe)),
    __param(3, (0, common_1.Param)('commentId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, list_all_posts_query_dto_1.ListAllPostsQueryDto, Number, Number]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "GetLikesForCommentOnPost", null);
__decorate([
    (0, swagger_1.ApiTags)('Posts - Get posts from tagged user/hashtag/trades'),
    (0, common_1.Get)('/:type/:value'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'get list of posts with Hashtag/User/Asset mentioned',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    (0, swagger_1.ApiParam)({
        name: 'type',
        description: 'Type of tagged type',
        enum: ['hashtag', 'user', 'asset'],
    }),
    (0, swagger_1.ApiParam)({
        name: 'value',
        description: 'Corresponding value of tagged type',
    }),
    (0, swagger_1.ApiQuery)({ name: 'limit', description: 'Number of users to return' }),
    (0, swagger_1.ApiQuery)({
        name: 'offset',
        description: 'From which post to get n-limit posts',
    }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Param)('type')),
    __param(3, (0, common_1.Param)('value')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, list_all_posts_query_dto_1.ListAllPostsQueryDto, String, String]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "ListAllPostsWithTaggedTypes", null);
PostsController = __decorate([
    (0, common_1.Controller)({
        path: 'posts',
        version: '1',
    }),
    __metadata("design:paramtypes", [posts_service_1.PostsService])
], PostsController);
exports.PostsController = PostsController;
//# sourceMappingURL=posts.controller.js.map
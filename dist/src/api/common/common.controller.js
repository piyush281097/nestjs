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
exports.CommonController = void 0;
const user_token_payload_decorator_1 = require("../../utils/decorator/user-token-payload.decorator");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guard/jwt.auth-guard");
const common_service_1 = require("./common.service");
const add_recent_search_history_request_dto_1 = require("./dto/request/add-recent-search-history.request-dto");
const list_hashtags_request_dto_1 = require("./dto/request/list-hashtags.request-dto");
const get_interests_response_dto_1 = require("./dto/response/get-interests.response-dto");
const get_recent_item_response_dto_1 = require("./dto/response/get-recent-item.response-dto");
let CommonController = class CommonController {
    constructor(commonService) {
        this.commonService = commonService;
    }
    GetAllInterests() {
        return this.commonService.getAllInterests();
    }
    GetAllExperienceLevel() {
        return this.commonService.getAllExperienceLevel();
    }
    GetAllInvestmentStyles() {
        return this.commonService.getAllInvestStyles();
    }
    GetAllHashtags(queryVal) {
        const { limit, offset, query } = queryVal;
        return this.commonService.getAllHashtags(limit, offset, query);
    }
    AddRecentSearchUser(user, body) {
        return this.commonService.addRecentSearchUser(user.userId, body);
    }
    GetRecentSearchItems(user, param) {
        return this.commonService.listRecentSearchItems(param.type, user.userId);
    }
};
__decorate([
    (0, common_1.Get)('interests'),
    (0, swagger_1.ApiResponse)({ type: [get_interests_response_dto_1.GetInterestsResponseDto] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CommonController.prototype, "GetAllInterests", null);
__decorate([
    (0, common_1.Get)('experience-level'),
    (0, swagger_1.ApiResponse)({ type: [get_interests_response_dto_1.GetInterestsResponseDto] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CommonController.prototype, "GetAllExperienceLevel", null);
__decorate([
    (0, common_1.Get)('investment-styles'),
    (0, swagger_1.ApiResponse)({ type: [get_interests_response_dto_1.GetInterestsResponseDto] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CommonController.prototype, "GetAllInvestmentStyles", null);
__decorate([
    (0, common_1.Get)('hashtags'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Follow a User',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiResponse)({ type: [get_interests_response_dto_1.GetInterestsResponseDto] }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_hashtags_request_dto_1.ListAllHashtagsQueryDto]),
    __metadata("design:returntype", void 0)
], CommonController.prototype, "GetAllHashtags", null);
__decorate([
    (0, common_1.Post)('recent-search'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Add recent search user or asset',
    }),
    (0, swagger_1.ApiBody)({ type: add_recent_search_history_request_dto_1.AddRecentSearchRequestDto }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    (0, swagger_1.ApiResponse)({}),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, add_recent_search_history_request_dto_1.AddRecentSearchRequestDto]),
    __metadata("design:returntype", void 0)
], CommonController.prototype, "AddRecentSearchUser", null);
__decorate([
    (0, common_1.Get)('recent-search/:type'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Get recent searches',
    }),
    (0, swagger_1.ApiParam)({
        name: 'type',
        enum: ['user', 'asset'],
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiResponse)({ type: [get_recent_item_response_dto_1.GetRecentItemResponse] }),
    (0, swagger_1.ApiResponse)({ type: [get_interests_response_dto_1.GetInterestsResponseDto] }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, add_recent_search_history_request_dto_1.listRecentSearchItemDto]),
    __metadata("design:returntype", void 0)
], CommonController.prototype, "GetRecentSearchItems", null);
CommonController = __decorate([
    (0, common_1.Controller)({
        path: 'common',
        version: '1',
    }),
    (0, swagger_1.ApiTags)('Common'),
    __metadata("design:paramtypes", [common_service_1.CommonService])
], CommonController);
exports.CommonController = CommonController;
//# sourceMappingURL=common.controller.js.map
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
exports.PortfolioController = void 0;
const user_token_payload_decorator_1 = require("../../utils/decorator/user-token-payload.decorator");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guard/jwt.auth-guard");
const create_portfolio_dto_1 = require("./dto/create-portfolio.dto");
const portfolio_service_1 = require("./portfolio.service");
let PortfolioController = class PortfolioController {
    constructor(portfolioService) {
        this.portfolioService = portfolioService;
    }
    create(user, createPostDto) {
        return this.portfolioService.create(user.userId, createPostDto.name);
    }
    findAll(user, query) {
        return this.portfolioService.findAll(user.userId, query);
    }
    update(user, groupId, body) {
        return this.portfolioService.update(user.userId, groupId, body.name);
    }
    remove(user, groupId) {
        return this.portfolioService.remove(user.userId, groupId);
    }
    createPortfolio(user, portfolio) {
        return this.portfolioService.addPortfolio(user.userId, portfolio);
    }
    listPortfolioByGroup(user, portfolioGroupId) {
        return this.portfolioService.findAllPortfolioOfaGroup(user.userId, portfolioGroupId);
    }
    PatchPortfolioItem(user, portfolioId, body) {
        return this.portfolioService.updatePortfolio(user.userId, portfolioId, body);
    }
    DeletePortfolioItem(user, groupId) {
        return this.portfolioService.remove(user.userId, groupId);
    }
};
__decorate([
    (0, common_1.Post)('group'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a portfolio group',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiBody)({ type: create_portfolio_dto_1.AddPortfolioName }),
    (0, swagger_1.ApiResponse)({}),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_portfolio_dto_1.AddPortfolioName]),
    __metadata("design:returntype", void 0)
], PortfolioController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('group'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a portfolio group',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiQuery)({
        name: 'query',
        description: 'Query variable to search portfolio group',
    }),
    (0, swagger_1.ApiResponse)({ type: [create_portfolio_dto_1.listAllPortfolioGroups] }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Query)('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PortfolioController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)('group/:groupId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Update a portfolio group name',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiResponse)({}),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)('groupId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, create_portfolio_dto_1.AddPortfolioName]),
    __metadata("design:returntype", void 0)
], PortfolioController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('group/:groupId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a portfolio group',
    }),
    (0, swagger_1.ApiResponse)({}),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)('groupId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], PortfolioController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a portfolio',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiBody)({ type: create_portfolio_dto_1.AddPortfolioWithAsset }),
    (0, swagger_1.ApiResponse)({}),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_portfolio_dto_1.AddPortfolioWithAsset]),
    __metadata("design:returntype", void 0)
], PortfolioController.prototype, "createPortfolio", null);
__decorate([
    (0, common_1.Get)(':portfolioGroupId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'List all assets under a portfolio group',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiResponse)({ type: [create_portfolio_dto_1.GetAllPortFolioResponse] }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)('portfolioGroupId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], PortfolioController.prototype, "listPortfolioByGroup", null);
__decorate([
    (0, common_1.Patch)(':portfolioId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Update a portfolio item',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiBody)({ type: create_portfolio_dto_1.UpdatePortfolioWithAsset }),
    (0, swagger_1.ApiResponse)({}),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)('portfolioId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, create_portfolio_dto_1.UpdatePortfolioWithAsset]),
    __metadata("design:returntype", void 0)
], PortfolioController.prototype, "PatchPortfolioItem", null);
__decorate([
    (0, common_1.Delete)(':portfolioId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a portfolio group',
    }),
    (0, swagger_1.ApiResponse)({}),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)('groupId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], PortfolioController.prototype, "DeletePortfolioItem", null);
PortfolioController = __decorate([
    (0, swagger_1.ApiTags)('Portfolio'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)({
        path: 'portfolio',
        version: '1',
    }),
    __metadata("design:paramtypes", [portfolio_service_1.PortfolioService])
], PortfolioController);
exports.PortfolioController = PortfolioController;
//# sourceMappingURL=portfolio.controller.js.map
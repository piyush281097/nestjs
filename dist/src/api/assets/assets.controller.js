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
exports.AssetsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const assets_service_1 = require("./assets.service");
const asset_logo_response_dto_1 = require("./dto/response/asset-logo.response-dto");
const asset_search_response_dto_1 = require("./dto/response/asset-search.response-dto");
let AssetsController = class AssetsController {
    constructor(assetsService) {
        this.assetsService = assetsService;
    }
    AssetSearch(query) {
        return this.assetsService.getAssetDetails(query);
    }
    GetAssetLogo(symbol) {
        return this.assetsService.getAssetLogo(symbol);
    }
    GetCompanyDetails(symbol) {
        return this.assetsService.getCompanyInfo(symbol);
    }
    GetCompanyFundamentals(symbol) {
        return this.assetsService.getCompanyFundamentals(symbol);
    }
    GetCompanyNews(symbol) {
        return this.assetsService.getCompanyNews(symbol);
    }
};
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiQuery)({
        name: 'query',
        required: true,
        description: 'Name or Asset symbol to search',
    }),
    (0, swagger_1.ApiResponse)({ type: [asset_search_response_dto_1.AssetSearchResponseDto] }),
    __param(0, (0, common_1.Query)('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AssetsController.prototype, "AssetSearch", null);
__decorate([
    (0, common_1.Get)('logo/:symbol'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiParam)({
        name: 'symbol',
        required: true,
        description: 'Asset symbol to search',
    }),
    (0, swagger_1.ApiResponse)({ type: asset_logo_response_dto_1.AssetLogoResponseDto }),
    __param(0, (0, common_1.Param)('symbol')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AssetsController.prototype, "GetAssetLogo", null);
__decorate([
    (0, common_1.Get)('details/:symbol'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiParam)({
        name: 'symbol',
        required: true,
        description: 'Asset symbol to search',
    }),
    (0, swagger_1.ApiResponse)({ type: asset_logo_response_dto_1.AssetDetailsDto }),
    __param(0, (0, common_1.Param)('symbol')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AssetsController.prototype, "GetCompanyDetails", null);
__decorate([
    (0, common_1.Get)('fundamental/:symbol'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiParam)({
        name: 'symbol',
        required: true,
        description: 'Asset symbol to search',
    }),
    (0, swagger_1.ApiResponse)({ type: asset_logo_response_dto_1.AssetFundamentalsDto }),
    __param(0, (0, common_1.Param)('symbol')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AssetsController.prototype, "GetCompanyFundamentals", null);
__decorate([
    (0, common_1.Get)('news/:symbol'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiParam)({
        name: 'symbol',
        required: true,
        description: 'Asset symbol to search',
    }),
    (0, swagger_1.ApiResponse)({ type: asset_logo_response_dto_1.AssetLogoResponseDto }),
    __param(0, (0, common_1.Param)('symbol')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AssetsController.prototype, "GetCompanyNews", null);
AssetsController = __decorate([
    (0, common_1.Controller)({
        path: 'assets',
        version: '1',
    }),
    (0, swagger_1.ApiTags)('Assets'),
    __metadata("design:paramtypes", [assets_service_1.AssetsService])
], AssetsController);
exports.AssetsController = AssetsController;
//# sourceMappingURL=assets.controller.js.map
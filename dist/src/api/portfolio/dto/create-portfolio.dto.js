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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllPortFolioResponse = exports.UpdatePortfolioWithAsset = exports.AddPortfolioWithAsset = exports.listAllPortfolioGroups = exports.AddPortfolioName = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class AddPortfolioName {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddPortfolioName.prototype, "name", void 0);
exports.AddPortfolioName = AddPortfolioName;
class listAllPortfolioGroups {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], listAllPortfolioGroups.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], listAllPortfolioGroups.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], listAllPortfolioGroups.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], listAllPortfolioGroups.prototype, "isDeleted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], listAllPortfolioGroups.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], listAllPortfolioGroups.prototype, "lastUpdated", void 0);
exports.listAllPortfolioGroups = listAllPortfolioGroups;
class AddPortfolioWithAsset {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Portfolio group ID',
        required: true,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AddPortfolioWithAsset.prototype, "portfolioGroupId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Asset SYMBOL NAME',
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddPortfolioWithAsset.prototype, "assetId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Quantity of stock that purchased' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AddPortfolioWithAsset.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Allocation of stock quantity' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AddPortfolioWithAsset.prototype, "allocation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Price at which asset purchased' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AddPortfolioWithAsset.prototype, "price", void 0);
exports.AddPortfolioWithAsset = AddPortfolioWithAsset;
class UpdatePortfolioWithAsset extends (0, swagger_1.PartialType)(AddPortfolioWithAsset) {
}
exports.UpdatePortfolioWithAsset = UpdatePortfolioWithAsset;
class GetAllPortFolioResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetAllPortFolioResponse.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetAllPortFolioResponse.prototype, "assetId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetAllPortFolioResponse.prototype, "allocation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetAllPortFolioResponse.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetAllPortFolioResponse.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], GetAllPortFolioResponse.prototype, "lastUpdated", void 0);
exports.GetAllPortFolioResponse = GetAllPortFolioResponse;
//# sourceMappingURL=create-portfolio.dto.js.map
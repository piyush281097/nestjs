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
exports.ListAllCommentsOnTradesResponseDto = exports.ListAllCommentsOnTradesResponseDtoTemp = exports.TaggedUser = exports.TaggedAsset = exports.CreatedBy = void 0;
const swagger_1 = require("@nestjs/swagger");
class CreatedBy {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreatedBy.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreatedBy.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreatedBy.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreatedBy.prototype, "userHandle", void 0);
exports.CreatedBy = CreatedBy;
class TaggedAsset {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TaggedAsset.prototype, "logo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TaggedAsset.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TaggedAsset.prototype, "symbol", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], TaggedAsset.prototype, "assetId", void 0);
exports.TaggedAsset = TaggedAsset;
class TaggedUser {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TaggedUser.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TaggedUser.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TaggedUser.prototype, "userHandle", void 0);
exports.TaggedUser = TaggedUser;
class ListAllCommentsOnTradesResponseDtoTemp {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ListAllCommentsOnTradesResponseDtoTemp.prototype, "tradeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ListAllCommentsOnTradesResponseDtoTemp.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ListAllCommentsOnTradesResponseDtoTemp.prototype, "isLiked", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ListAllCommentsOnTradesResponseDtoTemp.prototype, "likes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: CreatedBy }),
    __metadata("design:type", CreatedBy)
], ListAllCommentsOnTradesResponseDtoTemp.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [TaggedAsset] }),
    __metadata("design:type", Array)
], ListAllCommentsOnTradesResponseDtoTemp.prototype, "taggedAssets", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [TaggedUser] }),
    __metadata("design:type", Array)
], ListAllCommentsOnTradesResponseDtoTemp.prototype, "taggedUsers", void 0);
exports.ListAllCommentsOnTradesResponseDtoTemp = ListAllCommentsOnTradesResponseDtoTemp;
class ListAllCommentsOnTradesResponseDto extends ListAllCommentsOnTradesResponseDtoTemp {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ListAllCommentsOnTradesResponseDtoTemp] }),
    __metadata("design:type", Array)
], ListAllCommentsOnTradesResponseDto.prototype, "replies", void 0);
exports.ListAllCommentsOnTradesResponseDto = ListAllCommentsOnTradesResponseDto;
//# sourceMappingURL=list-all-comments.response-dto.js.map
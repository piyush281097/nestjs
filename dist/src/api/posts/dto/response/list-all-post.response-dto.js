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
exports.ListAllPostsResponseDto = exports.ListAllPostsResponseDtoTemp = exports.ProfileImage = exports.MediaUrl = exports.TaggedUser = exports.TaggedAsset = exports.CreatedBy = void 0;
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
class MediaUrl {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], MediaUrl.prototype, "imageLarge", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], MediaUrl.prototype, "imageSmall", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], MediaUrl.prototype, "imageThumb", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], MediaUrl.prototype, "imageMedium", void 0);
exports.MediaUrl = MediaUrl;
class ProfileImage {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileImage.prototype, "imageOrg", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileImage.prototype, "imageThumb", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileImage.prototype, "imageSmall", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileImage.prototype, "imageMedium", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileImage.prototype, "imageLarge", void 0);
exports.ProfileImage = ProfileImage;
class ListAllPostsResponseDtoTemp {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ListAllPostsResponseDtoTemp.prototype, "postId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ListAllPostsResponseDtoTemp.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ListAllPostsResponseDtoTemp.prototype, "isLiked", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ListAllPostsResponseDtoTemp.prototype, "likes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: CreatedBy }),
    __metadata("design:type", CreatedBy)
], ListAllPostsResponseDtoTemp.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [TaggedAsset] }),
    __metadata("design:type", Array)
], ListAllPostsResponseDtoTemp.prototype, "taggedAssets", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [TaggedUser] }),
    __metadata("design:type", Array)
], ListAllPostsResponseDtoTemp.prototype, "taggedUsers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [MediaUrl] }),
    __metadata("design:type", Array)
], ListAllPostsResponseDtoTemp.prototype, "mediaUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ProfileImage] }),
    __metadata("design:type", ProfileImage)
], ListAllPostsResponseDtoTemp.prototype, "profileImage", void 0);
exports.ListAllPostsResponseDtoTemp = ListAllPostsResponseDtoTemp;
class ListAllPostsResponseDto extends ListAllPostsResponseDtoTemp {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: ListAllPostsResponseDtoTemp }),
    __metadata("design:type", ListAllPostsResponseDtoTemp)
], ListAllPostsResponseDto.prototype, "postShared", void 0);
exports.ListAllPostsResponseDto = ListAllPostsResponseDto;
//# sourceMappingURL=list-all-post.response-dto.js.map
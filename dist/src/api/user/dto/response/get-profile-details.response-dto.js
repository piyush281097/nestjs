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
exports.GetProfileDetailsResponseDto = exports.Interest = exports.InvestmentStyle = exports.Timeline = exports.ProfileImage = void 0;
const swagger_1 = require("@nestjs/swagger");
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
class Timeline {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Timeline.prototype, "to", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Timeline.prototype, "from", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Timeline.prototype, "activity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Timeline.prototype, "investorName", void 0);
exports.Timeline = Timeline;
class InvestmentStyle {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], InvestmentStyle.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], InvestmentStyle.prototype, "type", void 0);
exports.InvestmentStyle = InvestmentStyle;
class Interest {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], Interest.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Interest.prototype, "type", void 0);
exports.Interest = Interest;
class GetProfileDetailsResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetProfileDetailsResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetProfileDetailsResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], GetProfileDetailsResponseDto.prototype, "isVerified", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], GetProfileDetailsResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetProfileDetailsResponseDto.prototype, "followingCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetProfileDetailsResponseDto.prototype, "followersCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], GetProfileDetailsResponseDto.prototype, "isFollowing", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], GetProfileDetailsResponseDto.prototype, "isBeingFollowed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetProfileDetailsResponseDto.prototype, "userHandle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetProfileDetailsResponseDto.prototype, "experienceLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], GetProfileDetailsResponseDto.prototype, "isSignupComplete", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetProfileDetailsResponseDto.prototype, "countryCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetProfileDetailsResponseDto.prototype, "mobileNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetProfileDetailsResponseDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetProfileDetailsResponseDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetProfileDetailsResponseDto.prototype, "quote", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetProfileDetailsResponseDto.prototype, "about", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetProfileDetailsResponseDto.prototype, "goal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", ProfileImage)
], GetProfileDetailsResponseDto.prototype, "profileImage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [Timeline] }),
    __metadata("design:type", Array)
], GetProfileDetailsResponseDto.prototype, "timeline", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [InvestmentStyle] }),
    __metadata("design:type", Array)
], GetProfileDetailsResponseDto.prototype, "investmentStyle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [Interest] }),
    __metadata("design:type", Array)
], GetProfileDetailsResponseDto.prototype, "interest", void 0);
exports.GetProfileDetailsResponseDto = GetProfileDetailsResponseDto;
//# sourceMappingURL=get-profile-details.response-dto.js.map
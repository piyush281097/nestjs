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
exports.UpdateProfileResponseDto = exports.Timeline = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class Timeline {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Timeline.prototype, "to", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Timeline.prototype, "from", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Timeline.prototype, "activity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Timeline.prototype, "investorName", void 0);
exports.Timeline = Timeline;
class UpdateProfileResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileResponseDto.prototype, "userHandle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateProfileResponseDto.prototype, "experienceLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileResponseDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileResponseDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileResponseDto.prototype, "quote", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileResponseDto.prototype, "about", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateProfileResponseDto.prototype, "goal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [Timeline] }),
    __metadata("design:type", Array)
], UpdateProfileResponseDto.prototype, "timeline", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [Number] }),
    (0, class_validator_1.IsNumber)({}, { each: true }),
    (0, class_validator_1.ArrayUnique)((o) => o),
    __metadata("design:type", Array)
], UpdateProfileResponseDto.prototype, "investmentStyle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [Number] }),
    (0, class_validator_1.ArrayUnique)((o) => o),
    __metadata("design:type", Array)
], UpdateProfileResponseDto.prototype, "interest", void 0);
exports.UpdateProfileResponseDto = UpdateProfileResponseDto;
//# sourceMappingURL=update-profile.request-dto.js.map
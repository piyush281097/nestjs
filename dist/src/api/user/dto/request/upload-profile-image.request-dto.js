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
exports.UploadProfileImageRequestDto = void 0;
const class_validator_1 = require("class-validator");
const constants_1 = require("../../../../shared/constants");
const swagger_1 = require("@nestjs/swagger");
const is_valid_extension_decorator_1 = require("../../../../utils/decorator/is-valid-extension.decorator");
class UploadProfileImageRequestDto {
}
__decorate([
    (0, is_valid_extension_decorator_1.IsValidExtension)(constants_1.IMAGE_FILE_EXTENSIONS),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UploadProfileImageRequestDto.prototype, "fileName", void 0);
exports.UploadProfileImageRequestDto = UploadProfileImageRequestDto;
//# sourceMappingURL=upload-profile-image.request-dto.js.map